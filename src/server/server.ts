import { enviroment } from './../common/enviroment';
import * as restify from 'restify'
import {Router} from './../common/router'

export class Server{

    public aplication: restify.Server;

    initRoutes(routers:Router[]):Promise<any>{
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
                for(let router of routers){
                    router.apllyRoutes(this.aplication);
                }

                //OUVINDO PORTA -> notificar que conexao está disponivel
                this.aplication.listen(enviroment.server.port,()=>{resolve(this.aplication)});
                
            }catch(error){
                reject(error)
            }
        });
    }
    bootstrap(routers:Router[]=[]): Promise<Server>{
        return this.initRoutes(routers).then(()=>this);
    }
}