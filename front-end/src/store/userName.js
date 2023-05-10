import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const username = atom({
  key: "username",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export default username;
