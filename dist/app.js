"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const server = new server_1.Server();
server.bootstrap()
    .then(server => { console.log('Server is listening on: ', server.aplication.address()); })
    .catch(erro => { console.log('Server failed to start'); console.error(erro); process.exit(1); });
