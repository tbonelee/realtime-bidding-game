import { nanoid } from "nanoid";

const clientId = nanoid();

export const getClientId = () => {
  return clientId;

  // 동일 로컬 스토리지 범위로 제한하고자 하는 경우 아래 코드 사용

  // if (typeof window === "undefined") {
  //   return "";
  // }
  // const _clientId = localStorage.getItem("clientId");
  // if (_clientId) {
  //   return _clientId;
  // }
  // const newClientId = nanoid();
  // localStorage.setItem("clientId", newClientId);
  // return newClientId;
};
