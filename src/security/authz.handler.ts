import * as restify from 'restify';
import { ForbiddenError } from 'restify-errors';


export const authorize: (...profiles:string[])=> restify.RequestHandler = (...profiles)=>{
    return (req, resp, next)=>{                                    // operador spred quebra o arrei e passa cmo varias string de argumento...
        if(req.authenticated!==undefined && req.authenticated.hasAny(...profiles)){
            req.log.debug('User %s is authorized with profiles %j on route %s. Required profiles %j',req.authenticated._id,req.authenticated.profiles,req.path(),profiles);
            next();
        }else{
            if(req.authenticated){
                req.log.debug(`Permission denied for ${req.authenticated._id}. Required profiles: ${profiles}. User profiles: ${req.authenticated.profiles}`);
            }
            next(new ForbiddenError('Permission denied'))
        }
    }
}