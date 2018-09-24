"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var phaethon_1 = require("phaethon");
var server = new phaethon_1.Server();
server.listener = function (request) { return new phaethon_1.ServerResponse("Hello"); };
server.listenHttp(8800);

//# sourceMappingURL=server.js.map
