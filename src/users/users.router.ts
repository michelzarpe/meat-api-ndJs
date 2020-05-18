import { User } from './user.model';
import {Router} from './../common/router';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';


class UsersRouter extends Router{
    constructor(){
        super();
        this.on('beforeRender',document=>{
            document.password = undefined;
            // delete document.password
        })
    }
    apllyRoutes(application:restify.Server){
        application.get('/users',(req,resp,next)=>{
           User.find()
           .then(this.render(resp,next))
           .catch(next);
        })
        application.get('/users/:id',(req,resp,next)=>{
            User.findById(req.params.id)
            .then(this.render(resp,next))
            .catch(next);
         });
         application.post('/users',(req,resp,next)=>{
            let user = new User(req.body);
            user.save()
            .then(this.render(resp,next))
            .catch(next)
         });
         //put para alterar o recurso inteiro
         application.put('/users/:id',(req,resp,next)=>{
            //filtro; as informacao; parametros para customizar o metodo; 
            //runVAlidators para ativar as validações
            const options ={runValidators:true,overwirte:true};  
            User.update({_id:req.params.id},req.body,options)
            .exec()
            .then(result=>{
                if(result.n){
                    return User.findById(req.params.id).exec();
                }else{
                  throw new NotFoundError('Document not found'); 
                }
            }).then(this.render(resp,next))
              .catch(next);
         });

         // atualizacao parcial, adicionar e excluir propriedades
         //runVAlidators para ativar as validações
         application.patch('/users/:id',(req,resp,next)=>{
             //receber o documento atualizado, porque o findByIdAndUpdate user antes das alterações
             const options = {runValidators:true, new:true}
             User.findByIdAndUpdate(req.params.id,req.body,options)
             .then(this.render(resp,next))
             .catch(next);
         });

         application.del('/users/:id',(req,resp,next)=>{
             User.remove({_id:req.params.id})
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
         });
    }
}

export const usersRouter = new UsersRouter();