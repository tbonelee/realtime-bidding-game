import { nanoid } from "nanoid";

export const getClientId = () => {
  if (typeof window === "undefined") {
    return "";
  }
  const clientId = localStorage.getItem("clientId");
  if (clientId) {
    return clientId;
  }
  const newClientId = nanoid();
  localStorage.setItem("clientId", newClientId);
  return newClientId;
};
