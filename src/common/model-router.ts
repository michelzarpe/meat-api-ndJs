import * as mongoose from 'mongoose';
import {Router} from './../common/router';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router{
    public basePath:string;
    public pageSize:number = 4;



    constructor(protected model:mongoose.Model<D>){
        super();
        this.basePath = `/${model.collection.name}`
    }

    //meta dado hipermedia
    envelopeAll(documents :any[],options:any={}):any{
        let resource = {
            items:documents,
            _links:{
                self:`${options.url}`,
                next:``,
                previus:``
            }
        }
        if(options.page&&options.count&&options.pageSize){
            if(options.page>1){
                resource._links.previus = `${this.basePath}?_page=${options.page-1}`
            }
            const remaining = options.count - (options.page * options.pageSize)
            if(remaining>0){
                resource._links.next = `${this.basePath}?_page=${options.page+1}`
            }
        }
        return resource;
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
        let page = parseInt(req.query._page || 1);
        page = page > 0? page : 1;
        const skipe = (page - 1) * this.pageSize;
        this.model
            .count({}).exec()
            .then(count=>{
                this.model.find()
                .skip(skipe)
                .limit(this.pageSize)
                .then(this.renderAll(resp,next,{
                    page,count,
                    pageSize:this.pageSize,
                    url:req.url
                }))})
            .catch(next);
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
