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
            User.find({email:req.query.email}).then(this.renderAll(resp,next)).catch(next)
        }else{
            next();
        }
    }
    apllyRoutes(application:restify.Server){
        //Accept-version no get
        application.get({path:'/users',version:'2.0.0'},[this.findByEmail,this.findAll]);
        application.get({path:'/users',version:'1.0.0'},this.findAll);
        application.get('/users/:id',[this.validateId,this.findById]);
        application.post('/users',this.save);
        //put para alterar o recurso inteiro
        application.put('/users/:id',[this.validateId,this.replace]);
        // atualizacao parcial, adicionar e excluir propriedades
        //runVAlidators para ativar as validações
        application.patch('/users/:id',[this.validateId,this.update]);
        application.del('/users/:id',[this.validateId,this.delete]);
    }
}

export const usersRouter = new UsersRouter();