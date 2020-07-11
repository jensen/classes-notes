type Message = {
  user: string;
  content: string;
};

type User = {
  name: string | null;
  room: string;
};

type StoreContainer = {
  current: Store;
};

export type Store = {
  rooms: {
    [key: string]: Message[];
  };
  users: {
    [key: string]: User;
  };
};

const store: StoreContainer = {
  current: {
    rooms: {
      a: [
        {
          user: "Karl",
          content: "Test",
        },
      ],
      b: [],
    },
    users: {},
  },
};

type Action = { type: string; [key: string]: any };

function reducer(state: Store, { type, ...action }: Action) {
  if (type === "JOIN_ROOM") {
    return {
      ...state,
      users: {
        ...state.users,
        [action.userid]: {
          ...state.users[action.userid],
          room: action.roomid,
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
    const { [action.id]: deleted, ...rest } = state.users;

    return {
      ...state,
      users: {
        ...rest,
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

  if (type === "CHANGE_NAME") {
    return {
      ...state,
      users: {
        [action.userid]: {
          ...state.users[action.userid],
          name: action.name,
        },
      },
    };
  }

  throw new Error("Action doesn't exist");
}

export const getStore = () => store.current;
export const dispatch = (action: Action) => {
  store.current = reducer(store.current, action);
};

export const addUser = (id: number, name: string = "") => {
  dispatch({ type: "ADD_USER", id, name });
};

export const removeUser = (id: number) => {
  dispatch({ type: "REMOVE_USER", id });
};

export const joinRoom = (userid: number, roomid: string) => {
  dispatch({ type: "JOIN_ROOM", userid, roomid });
};

export const changeName = (userid: number, name: string) => {
  dispatch({ type: "CHANGE_NAME", userid, name });
};
