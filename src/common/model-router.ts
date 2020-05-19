import * as mongoose from 'mongoose';
import {Router} from './../common/router';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router{
    public basePath:string;

    constructor(protected model:mongoose.Model<D>){
        super();
        this.basePath = `/${model.collection.name}`
    }

    //meta dado hipermedia
    envelope(document :any):any{
        let resource = Object.assign({_links:{}},document.toJSON());
        resource._links = `${this.basePath}/${resource._id}`;
        return resource;
    }

    validateId=(req,resp,next)=>{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            next(new NotFoundError('Document Not Found'))
        }else{
            next()
        }
    }

    findAll = (req, resp, next)=>{
        this.model.find()
        .then(this.renderAll(resp,next))
        .catch(next)
    }

    findById = (req,resp,next)=>{
            this.model.findById(req.params.id)
            .then(this.render(resp,next))
            .catch(next);
         }

    save = (req,resp,next)=>{
            let document = new this.model(req.body);
            document.save()
            .then(this.render(resp,next))
            .catch(next)
         }
    //put
    replace = (req,resp,next)=>{
            //filtro; as informacao; parametros para customizar o metodo; 
            //runVAlidators para ativar as validações
            const options ={runValidators:true,overwirte:true};  
            this.model.update({_id:req.params.id},req.body,options)
            .exec()
            .then(result=>{
                if(result.n){
                    return this.model.findById(req.params.id).exec();
                }else{
                  throw new NotFoundError('Document not found'); 
                }
            }).then(this.render(resp,next))
              .catch(next);
         }

    update = (req,resp,next)=>{
             //receber o documento atualizado, porque o findByIdAndUpdate user antes das alterações
             const options = {runValidators:true, new:true}
             this.model.findByIdAndUpdate(req.params.id,req.body,options)
             .then(this.render(resp,next))
             .catch(next);
         }

    delete = (req,resp,next)=>{
             this.model.remove({_id:req.params.id})
             .exec()
             .then((cmdResult:any)=>{
                 if(cmdResult.result.n){
                    resp.send(204);
                 }else{
                    throw new NotFoundError('Document not found'); 
                 }
                 return next();
             })
             .catch(next);
         }
}
