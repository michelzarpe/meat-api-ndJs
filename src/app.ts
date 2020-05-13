import { usersRouter } from './users/users.router';
import {Server} from './server/server';


const server = new Server();
server.bootstrap([usersRouter])
      .then(server=>{console.log('Server is listening on: ',server.aplication.address())})
      .catch(erro=>{console.log('Server failed to start');console.error(erro);process.exit(1)});