import { User } from '../users/user.model';
import * as restify from 'restify';
import { NotAuthorizedError } from 'restify-errors';
import * as jwt from 'jsonwebtoken'
import { enviroment } from '../common/enviroment';
export const authenticate:restify.RequestHandler = (req,resp,next) =>{
    //autenticadr
    //email e senha
    const {email,password} = req.body;
    //saber se tem usuario com esse email e retornar o password
    User.findByEmail(email,'+password')
    .then(user=>{
        if(user && user.matches(password)){
            //gerar o token no padrão JWT 
            // cabecalho: {"alg":"HS256","typ":"JWT"}
            // corpo/clains: {"sub":"user@host.com","iss":"my-token-manager","exp":"15032156461"}
            // assinatura 
            const token = jwt.sign({sub:user.email,iss:'meat-api'},enviroment.security.apiSecret);
            resp.json({email:user.email,accessToken:token});
            return next(false);
        }else{
            return next(new NotAuthorizedError('Invalid Credentials'))
        }
    }).catch(next);
}