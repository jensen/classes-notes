import { ServerRequest } from "./deps.ts";
import { Store } from "./store.ts";

export const routes = new Map();

const json = (request: ServerRequest) => (config: { body: string }) =>
  request.respond({
    ...config,
    headers: new Headers({
      "content-type": "application/json",
    }),
  });

const bad = (request: ServerRequest) => () =>
  request.respond({
    status: 400,
  });

routes.set("/rooms", async (request: ServerRequest, store: Store) => {
  await json(request)({
    body: JSON.stringify(Object.keys(store.rooms).map((room) => room)),
  });
});

routes.set("/messages", async (request: ServerRequest, store: Store) => {
  const query = request.url.split("?")[1];

  if (!query) {
    await bad(request);
    return;
  }

  const params = query.split("&").reduce((acc: any, pair: any) => {
    const [k, v] = pair.split("=");
    return { ...acc, [k]: v };
  }, {});

  if (params.room) {
    console.log(store.rooms[params.room]);
    await json(request)({
      body: JSON.stringify(
        store.rooms[params.room].map((message) => ({
          ...message,
          user: store.users[message.user].name,
        }))
      ),
    });
    return;
  }

  await bad(request);
});

routes.set("/store", async (request: ServerRequest, store: Store) => {
  await json(request)({
    body: JSON.stringify(store, null, 2),
  });
});
