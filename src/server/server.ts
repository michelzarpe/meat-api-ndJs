import { handleError } from './error.handler';
import { enviroment } from './../common/enviroment';
import * as mongoose from 'mongoose'
import * as restify from 'restify'
import {Router} from './../common/router'
import {mergePatchBodyParser} from './merg-patch.parser'

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
                this.aplication = restify.createServer({
                    name:'meat-api', version:'1.0.0'
                });

                //***************************PLUGINS**********************************
                 //configuracao de plugin para pegar os parametros de budy e converter em objeto
                 this.aplication.use(restify.plugins.bodyParser());
                //configuracao de plugin para pegar os parametros de url
                this.aplication.use(restify.plugins.queryParser());
                //poder fazer a operação PATH corretamente
                this.aplication.use(mergePatchBodyParser);

                //ROUTES
                for(let router of routers){
                    router.apllyRoutes(this.aplication);
                }

                //OUVINDO PORTA -> notificar que conexao está disponivel
                this.aplication.listen(enviroment.server.port,()=>{resolve(this.aplication)});
                this.aplication.on('restifyError',handleError);
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

