import { User } from './user.model';
import {Router} from './../common/router';
import * as restify from 'restify';


class UsersRouter extends Router{
    apllyRoutes(application:restify.Server){
        application.get('/users',(req,resp,next)=>{
           User.findAll().then(users=>{
                resp.json(users);
                return next;
           }).catch(error=>{

           });
        })

        application.get('/users/:id',(req,resp,next)=>{
            User.findByID(req.params.id).then(user=>{
                if(user) {
                    resp.json(user)
                    return next();
                }
                resp.send(404);
                return next();
            })
         })
    }
}

export const usersRouter = new UsersRouter();