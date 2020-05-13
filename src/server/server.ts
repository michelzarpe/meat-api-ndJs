import { enviroment } from './../common/enviroment';
import * as restify from 'restify'

export class Server{

    public aplication: restify.Server;

    initRoutes():Promise<any>{
        return new Promise((resolve,reject)=>{
            try{
                //criar o server
                this.aplication = restify.createServer({
                    name:'meat-api', version:'1.0.0'
                });

                //***************************PLUGINS**********************************
                //configuracao de plugin para pegar os parametros de url
                this.aplication.use(restify.plugins.queryParser());

                //ROUTES
                this.aplication.get('/hello',[(req,resp,next)=>{
                    //passa para proxima callback
                    return next();
                    //return next(false) // termina por aqui mesmo
                },(req,resp,next)=>{
                    resp.json({message:'hello'});
                    return next();
                }])
                
                this.aplication.get('/info',(req,resp,next)=>{
                    resp.json({
                        message:'Info Cliente',
                        browser:req.userAgent(),
                        method: req.method,
                        url: req.href(),
                        path: req.path(),
                        query: req.query
                    });
                    return next();
                })

                //OUVINDO PORTA -> notificar que conexao está disponivel
                this.aplication.listen(enviroment.server.port,()=>{resolve(this.aplication)});
                
            }catch(error){
                reject(error)
            }
        });
    }
    bootstrap(): Promise<Server>{
        return this.initRoutes().then(()=>this);
    }
}