import { tokerParser } from './../security/token.parser';
import { handleError } from './error.handler';
import { enviroment } from './../common/enviroment';
import * as mongoose from 'mongoose'
import * as restify from 'restify'
import {Router} from './../common/router'
import {logger} from './../common/logger'
import {mergePatchBodyParser} from './merg-patch.parser'
import * as fs from 'fs';


export class Server{
    public aplication: restify.Server;

    initializeDb(): mongoose.MongooseThenable{
        //retirar a mensagem de depreciação
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(enviroment.db.url,{
            useMongoClient:true
        })
    }

    initRoutes(routers:Router[]):Promise<any>{
        return new Promise((resolve,reject)=>{
            try{
                //criar o server
                const options: restify.ServerOptions={
                    name:'meat-api', 
                    version:'1.0.0', 
                    log: logger
                }
                if(enviroment.security.enableHTTP){
                    options.certificate= fs.readFileSync(enviroment.security.certificate);
                    options.key=fs.readFileSync(enviroment.security.key);
                }
                this.aplication = restify.createServer(options);

                //***************************PLUGINS**********************************
                this.aplication.pre(restify.plugins.requestLogger({
                    log:logger
                }));

                 //configuracao de plugin para pegar os parametros de budy e converter em objeto
                 this.aplication.use(restify.plugins.bodyParser());
                //configuracao de plugin para pegar os parametros de url
                this.aplication.use(restify.plugins.queryParser());
                //poder fazer a operação PATH corretamente
                this.aplication.use(mergePatchBodyParser);
                //coloco aqui para verificar antes de qualquer rota
                this.aplication.use(tokerParser); 
                //ROUTES
                for(let router of routers){
                    router.apllyRoutes(this.aplication);
                }

                //OUVINDO PORTA -> notificar que conexao está disponivel
                this.aplication.listen(enviroment.server.port,()=>{resolve(this.aplication)});
                this.aplication.on('restifyError',handleError);
                // pre, router, after -> auditloger(req, resp, route, error)
                /*
                this.aplication.on('after',restify.plugins.auditLogger({
                    log:logger,
                    event: 'after',
                    body:true,
                    server:this.aplication
                }));
                this.aplication.on('audit',data=>{
                });
                */
            }catch(error){
                reject(error)
            }
        });
    }
    bootstrap(routers:Router[]=[]): Promise<Server>{
        return this.initializeDb().then(()=>
                    this.initRoutes(routers).then(()=>this));
    }
}

