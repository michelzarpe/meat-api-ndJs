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
    apllyRoutes(application:restify.Server){
        application.get('/users',this.findAll);
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