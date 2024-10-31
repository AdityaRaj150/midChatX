import { atom } from "recoil";

const usernameAtom = atom({
  key: "usernameAtom",
  default: "",
});

const socketIdAtom = atom({
  key: "socketIdAtom",
  default: null,
});

const allRoomAtom = atom({
  key: "allRoomData",
  default: [],
});

export { usernameAtom, socketIdAtom, allRoomAtom };
