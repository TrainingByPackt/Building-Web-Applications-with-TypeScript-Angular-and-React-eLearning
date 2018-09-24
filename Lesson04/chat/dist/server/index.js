"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const api = require("../shared/api");
const server = new WebSocket.Server({ port: 8800 });
server.on("connection", receiveConnection);
const sessions = [];
const recentMessages = new Array(2048);
let recentMessagesPointer = 0;
function receiveConnection(ws) {
    let username;
    let room;
    ws.on("message", message);
    ws.on("close", close);
    const session = { sendChatMessage };
    sessions.push(session);
    function message(data) {
        try {
            const object = JSON.parse(data);
            if (typeof object.kind !== "number")
                return;
            switch (object.kind) {
                case api.MessageKind.FindRooms:
                    findRooms(object);
                case api.MessageKind.OpenRoom:
                    openRoom(object);
                    break;
                case api.MessageKind.SendMessage:
                    chatMessage(object);
                    break;
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    function close() {
        const index = sessions.indexOf(session);
        sessions.splice(index, 1);
    }
    function send(data) {
        ws.send(JSON.stringify(data));
    }
    function sendChatMessage(content) {
        if (content.room === room) {
            send({
                kind: api.MessageKind.ReceiveMessage,
                content
            });
        }
    }
    function chatMessage(message) {
        if (typeof message.content !== "string")
            return;
        const content = {
            room,
            username,
            content: message.content
        };
        recentMessages[recentMessagesPointer] = content;
        recentMessagesPointer++;
        if (recentMessagesPointer >= recentMessages.length) {
            recentMessagesPointer = 0;
        }
        for (const item of sessions) {
            if (session !== item)
                item.sendChatMessage(content);
        }
    }
    function openRoom(message) {
        if (typeof message.username !== "string" || typeof message.room !== "string")
            return;
        username = message.username;
        room = message.room;
        function check(item) {
            if (!item)
                return false;
            return item.room === room;
        }
        let messages = [
            ...recentMessages.slice(recentMessagesPointer).filter(check),
            ...recentMessages.slice(0, recentMessagesPointer).filter(check)
        ];
        send({
            kind: api.MessageKind.RoomContent,
            room,
            messages
        });
    }
    function findRooms(message) {
        const query = message.query;
        if (typeof query !== "string")
            return;
        const rooms = recentMessages
            .map(msg => msg.room)
            .filter(room => room.toLowerCase().indexOf(query.toLowerCase()) !== -1)
            .sort();
        const completions = [];
        let previous = undefined;
        for (let room of rooms) {
            if (previous !== room) {
                completions.push(room);
                previous = room;
            }
        }
        send({
            kind: api.MessageKind.RoomCompletions,
            completions
        });
    }
}

//# sourceMappingURL=index.js.map
