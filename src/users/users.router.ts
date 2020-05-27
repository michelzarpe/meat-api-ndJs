import { authorize } from './../security/authz.handler';
import { authenticate } from './../security/auth.handler';
import { User } from './user.model';
import {ModelRouter} from './../common/model-router';
import * as restify from 'restify';




class UsersRouter extends ModelRouter<User>{
    constructor(){
        super(User);
        this.on('beforeRender',document=>{
            document.password = undefined;
            // delete document.password
        })
    }

    findByEmail = (req,resp,next)=>{
        if(req.query.email){
            User.findByEmail(req.query.email)
            .then(user=>user ? [user]: []) //retornando em um array com um elemento ou vazio
            .then(this.renderAll(resp,next,{url:req.url, pageSize:this.pageSize})).catch(next)
        }else{
            next();
        }
    }
    apllyRoutes(application:restify.Server){
        //Accept-version no get
        application.get({path:`${this.basePath}`,version:'2.0.0'},[authorize('admin'),this.findByEmail,this.findAll]);
        application.get({path:`${this.basePath}`,version:'1.0.0'},[authorize('admin'),this.findAll]);
        application.get(`${this.basePath}/:id`,[authorize('admin'),this.validateId,this.findById]);
        application.post(`${this.basePath}`,[authorize('admin'),this.save]);
        //put para alterar o recurso inteiro
        application.put(`${this.basePath}/:id`,[authorize('admin','user'),this.validateId,this.replace]);
        // atualizacao parcial, adicionar e excluir propriedades
        //runVAlidators para ativar as validações
        application.patch(`${this.basePath}/:id`,[authorize('admin','user'),this.validateId,this.update]);
        //application.patch(`${this.basePath}/:id`,[authorize('admin','user'),this.userEquals,this.validateId,this.update]); //this.userEquals, criar para verificar se o usuario está alterando suas propias informações
        application.del(`${this.basePath}/:id`,[authorize('admin'),this.validateId,this.delete]);
        application.post(`${this.basePath}/login`,authenticate);
    }
}

export const usersRouter = new UsersRouter();