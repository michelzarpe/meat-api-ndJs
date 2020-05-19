"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_router_1 = require("./users/users.router");
const restaurant_router_1 = require("./restaurant/restaurant.router");
const server_1 = require("./server/server");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurant_router_1.restRouter
])
    .then(server => { console.log('Server is listening on: ', server.aplication.address()); })
    .catch(erro => { console.log('Server failed to start'); console.error(erro); process.exit(1); });
