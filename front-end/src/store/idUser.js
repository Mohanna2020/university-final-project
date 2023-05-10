import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

const idUser = atom({
  key: "idUser",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export default idUser;
