type Message = {
  user: number;
  content: string;
  time: Date;
};

export type User = {
  id?: number;
  name: string | null;
  room: string | null;
  socket: any;
};

type StoreContainer = {
  current: Store;
};

export type Store = {
  rooms: {
    [key: string]: Message[];
  };
  users: {
    [key: number]: User;
  };
};

const store: StoreContainer = {
  current: {
    rooms: {
      one: [],
      two: [],
      three: [],
      four: [],
    },
    users: {},
  },
};

type Action = { type: string; [key: string]: any };

function reducer(state: Store, { type, ...action }: Action): Store {
  if (type === "JOIN_ROOM") {
    return {
      ...state,
      users: {
        ...state.users,
        [action.userid]: {
          ...state.users[action.userid],
          room: action.room,
        },
      },
    };
  }

  if (type === "LEAVE_ROOM") {
    return {
      ...state,
      users: {
        ...state.users,
        [action.userid]: {
          ...state.users[action.userid],
          room: null,
        },
      },
    };
  }

  if (type === "ADD_USER") {
    return {
      ...state,
      users: {
        ...state.users,
        [action.id]: {
          name: action.name,
          room: null,
          socket: action.socket,
        },
      },
    };
  }

  if (type === "REMOVE_USER") {
    return {
      ...state,
      users: {
        ...state.users,
        [action.id]: {
          ...state.users[action.id],
          socket: null,
        },
      },
    };
  }

  if (type === "MESSAGE") {
    return {
      ...state,
      rooms: {
        ...state.rooms,
        [action.room]: [...state.rooms[action.room], action.message],
      },
    };
  }

  if (type === "SET_NAME") {
    return {
      ...state,
      users: {
        ...state.users,
        [action.userid]: {
          ...state.users[action.userid],
          name: action.name,
        },
      },
    };
  }

  if (type === "ADD_MESSAGE") {
    const room = state.users[action.userid].room;

    if (!room) throw new Error("Shouldn't add a message if not in a room");

    return {
      ...state,
      rooms: {
        ...state.rooms,
        [room]: [
          ...state.rooms[room],
          { ...action.message, user: action.userid },
        ],
      },
    };
  }

  throw new Error("Action doesn't exist");
}

export const getStore = () => store.current;
export const dispatch = (action: Action) => {
  store.current = reducer(store.current, action);
};

export const addUser = (socket: any) => {
  dispatch({
    type: "ADD_USER",
    id: Number(socket.conn.rid),
    name: "Anonymous",
    socket,
  });
};

export const removeUser = (id: number) => {
  dispatch({ type: "REMOVE_USER", id });
};

export const joinRoom = (userid: number, room: string) => {
  dispatch({ type: "JOIN_ROOM", userid, room });
};

export const leaveRoom = (userid: number) => {
  dispatch({ type: "LEAVE_ROOM", userid });
};

export const setName = (userid: number, name: string) => {
  dispatch({ type: "SET_NAME", userid, name });
};

export const addMessage = (userid: number, message: any) => {
  dispatch({ type: "ADD_MESSAGE", userid, message });
};
