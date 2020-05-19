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
        application.get('/restaurants',this.findAll);
        application.get('/restaurants/:id',[this.validateId,this.findById]);
        application.post('/restaurants',this.save);
        //put para alterar o recurso inteiro
        application.put('/restaurants/:id',[this.validateId,this.replace]);
        // atualizacao parcial, adicionar e excluir propriedades
        //runVAlidators para ativar as validações
        application.patch('/restaurants/:id',[this.validateId,this.update]);
        application.del('/restaurants/:id',[this.validateId,this.delete]);
        application.get('/restaurants/:id/menu',[this.validateId,this.findMenu]);
        application.put('/restaurants/:id/menu',[this.validateId,this.replaceMenu]);
    }
}

export const restRouter = new RestaurantRouter();