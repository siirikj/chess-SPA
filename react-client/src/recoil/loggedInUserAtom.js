import { atom } from "recoil";

const loggedInUserAtom = atom({
  key: "loggedInUserAtom",
  default: null,
});

export default loggedInUserAtom;
