import { atom } from "recoil";

const ownerId = atom({
  key: "ownerId",
  default: "",
});

export default ownerId;
