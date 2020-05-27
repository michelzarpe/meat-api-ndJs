import { User } from '../users/user.model';
import * as restify from 'restify';
import * as jwt from 'jsonwebtoken'
import { enviroment } from '../common/enviroment';

//apenas fazer o parser aqui e segue o baile
export const tokerParser: restify.RequestHandler = (req,resp,next)=>{
    const token = extractToken(req);
    if(token){
        jwt.verify(token,enviroment.security.apiSecret,applyBearer(req,next))
    }else{
        next();
    }
}

function extractToken(req:restify.Request):string{
    //header - Authorization: Bearer TOKEN
    const authorization = req.header('authorization')
    if(authorization){
        const parts:string[] = authorization.split(' ');
        if(parts.length === 2 && parts[0]==='Bearer'){
            return parts[1];
        }
    }
    return undefined;
}

// retorna uma callback com dois parametros error e decode
function applyBearer(req:restify.Request, next):(error,decoded) =>void {
    return (error,decoded) =>{
        if(decoded){
            User.findByEmail(decoded.sub).then(user=>{
                if(user){
                //associar o usuario no request
                req.authenticated = user;
                }
                next()
            }).catch(next)
        }else{
            next();
        }
    }
}