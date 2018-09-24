import { Server, ServerResponse } from "phaethon";
const server = new Server();
server.listener = request => new ServerResponse("Hello");
server.listenHttp(8800);