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
                resp.json(user);
                return next();
            })
         });
    }
}

export const usersRouter = new UsersRouter();