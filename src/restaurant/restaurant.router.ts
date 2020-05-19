import { Restaurant } from './restaurant.model';
import {ModelRouter} from './../common/model-router';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';



class RestaurantRouter extends ModelRouter<Restaurant>{
    constructor(){
        super(Restaurant);
    }


    findMenu = (req, resp, next) =>{
        Restaurant.findById(req.params.id,"+menu")
        .then(rest=>{
            if(!rest){
                throw new NotFoundError('Restaurant not fount')
            }else{
                resp.json(rest.menu);
                return next();
            }
        })
        .catch(next)
    }


    replaceMenu = (req, resp, next) =>{
        Restaurant.findById(req.params.id)
          .then(rest=>{
            if(!rest){
                throw new NotFoundError('Restaurant not fount')
            }else{
                rest.menu = req.body //array de menuItem
                return rest.save()
            }
        })
        .then(rest=>{
            resp.json(rest.menu);
            return next();
        })
        .catch(next)
    }

    apllyRoutes(application:restify.Server){
        application.get(`${this.basePath}`,this.findAll);
        application.get(`${this.basePath}/:id`,[this.validateId,this.findById]);
        application.post(`${this.basePath}`,this.save);
        //put para alterar o recurso inteiro
        application.put(`${this.basePath}/:id`,[this.validateId,this.replace]);
        // atualizacao parcial, adicionar e excluir propriedades
        //runVAlidators para ativar as validações
        application.patch(`${this.basePath}/:id`,[this.validateId,this.update]);
        application.del(`${this.basePath}/:id`,[this.validateId,this.delete]);
        application.get(`${this.basePath}/:id/menu`,[this.validateId,this.findMenu]);
        application.put(`${this.basePath}/:id/menu`,[this.validateId,this.replaceMenu]);
    }
}

export const restRouter = new RestaurantRouter();