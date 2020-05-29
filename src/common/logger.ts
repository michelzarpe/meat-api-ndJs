import * as bunyan from 'bunyan';
import { enviroment } from './enviroment';

//ativando logger
export const logger = bunyan.createLogger({
    name: enviroment.log.name, 
    level: (<any>bunyan).resolveLevel(enviroment.log.level)
})