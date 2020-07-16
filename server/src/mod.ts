import {
  listenAndServe,
  ServerRequest,
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "./deps.ts";
import { routes } from "./router.ts";
import {
  getStore,
  addUser,
  removeUser,
  setName,
  joinRoom,
  leaveRoom,
  addMessage,
} from "./store.ts";

const PORT = 8080;

async function handleWebsocketEvent(sock: WebSocket) {
  console.log("ws:connected");

  addUser(sock.conn.rid);

  // const broadcast = (data) => {
  //   const users = getStore().users;

  //   for (let user in users) {
  //     if (user !== sock.conn.rid) {
  //     }
  //   }
  // };

  try {
    for await (const ev of sock) {
      if (typeof ev === "string") {
        console.log("ws:text", ev);
        const data: {
          type: string;
          message?: {
            user: string;
            content: string;
          };
          room?: string;
          name?: string;
        } = JSON.parse(ev);

        // await sock.send(ev);
        if (data.room && data.type === "JOIN_ROOM") {
          joinRoom(sock.conn.rid, data.room);
        }

        if (data.type === "LEAVE_ROOM") {
          leaveRoom(sock.conn.rid);
        }

        if (data.name && data.type === "SET_NAME") {
          setName(sock.conn.rid, data.name);
        }

        if (data.message && data.type === "NEW_MESSAGE") {
          addMessage(sock.conn.rid, data.message);
        }
      } else if (isWebSocketCloseEvent(ev)) {
        const { code, reason } = ev;
        console.log("ws:close", code, reason);
        // removeUser(sock.conn.rid);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}

listenAndServe(`:${PORT}`, async (request: ServerRequest) => {
  if (request.url === "/ws") {
    acceptWebSocket({
      conn: request.conn,
      bufReader: request.r,
      bufWriter: request.w,
      headers: request.headers,
    })
      .then(handleWebsocketEvent)
      .catch(async (err) => {
        console.error(`failed to accept websocket: ${err}`);
        await request.respond({ status: 400 });
      });
    return;
  }

  const [path, query] = request.url.split("?");

  if (routes.has(path)) {
    routes.get(path)(request, getStore());
    return;
  }

  await request.respond({
    body: "Not Found",
    status: 404,
  });
});
