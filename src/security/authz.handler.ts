import * as restify from 'restify';
import { ForbiddenError } from 'restify-errors';


export const authorize: (...profiles:string[])=> restify.RequestHandler = (...profiles)=>{
    return (req, resp, next)=>{                                    // operador spred quebra o arrei e passa cmo varias string de argumento...
        if(req.authenticated!==undefined && req.authenticated.hasAny(...profiles)){
            next();
        }else{
            next(new ForbiddenError('Permission denied'))
        }
    }
}