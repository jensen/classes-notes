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

const broadcast = async (id: number, data: any) => {
  const store = getStore();
  const users = Object.keys(store.users).map((user: string) => ({
    ...store.users[Number(user)],
    id: Number(user),
  }));

  Promise.all(
    users.filter((user) => {
      if (user.id === id) return false;

      if (user.socket && user.room === store.users[id].room) {
        return user.socket.send(
          JSON.stringify({
            type: "NEW_MESSAGE",
            ...data,
            user: store.users[id].name,
          })
        );
      }

      return false;
    })
  ).then((all) => {
    console.log(`ws:broadcast ${all.length} clients`);
  });
};

async function handleWebsocketEvent(sock: WebSocket) {
  console.log("ws:connected");

  addUser(sock);

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
          const message = {
            content: data.message,
            time: new Date(),
          };
          addMessage(sock.conn.rid, message);
          broadcast(sock.conn.rid, message);
        }
      } else if (isWebSocketCloseEvent(ev)) {
        const { code, reason } = ev;

        removeUser(sock.conn.rid);

        console.log("ws:close", code, reason);
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
