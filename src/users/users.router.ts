import { User } from './user.model';
import {Router} from './../common/router';
import * as restify from 'restify';


class UsersRouter extends Router{
    apllyRoutes(application:restify.Server){
        application.get('/users',(req,resp,next)=>{
           User.find().then(users=>{
                resp.json(users);
                return next;
           }).catch(error=>{

           });
        })
        application.get('/users/:id',(req,resp,next)=>{
            User.findById(req.params.id).then(user=>{
                if(user) {
                    resp.json(user)
                    return next();
                }
                resp.send(404);
                return next();
            })
         });
         application.post('/users',(req,resp,next)=>{
            let user = new User(req.body);
            user.save().then(user=>{
                user.password = undefined;
                resp.json(user);
                return next();
            })
         });
         //put para alterar o recurso inteiro
         application.put('/users/:id',(req,resp,next)=>{
            //filtro; as informacao; parametros para customizar o metodo; 
            const options ={overwirte:true};  
            User.update({_id:req.params.id},req.body,options)
            .exec()
            .then(result=>{
                if(result.n){
                    return User.findById(req.params.id).exec();
                }else{
                   resp.send(404);
                }
            }).then(user=>{
                resp.json(user);
                return next();
            });
         });

         // atualizacao parcial, adicionar e excluir propriedades
         application.patch('/users/:id',(req,resp,next)=>{
             //receber o documento atualizado, porque o findByIdAndUpdate user antes das alterações
             const options = {new:true}
             User.findByIdAndUpdate(req.params.id,req.body,options).then(user=>{
                 if(user){
                    resp.json(user);
                    return next();
                 }else{
                    resp.send(404);
                    return next();
                 }
             });
         });

         application.del('/users/:id',(req,resp,next)=>{
             User.remove({_id:req.params.id})
             .exec()
             .then((cmdResult:any)=>{
                 if(cmdResult.result.n){
                    resp.send(204);
                 }else{
                    resp.send(204);
                 }
                 return next();
             });
         });
    }
}

export const usersRouter = new UsersRouter();