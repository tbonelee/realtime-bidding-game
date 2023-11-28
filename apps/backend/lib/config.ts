export const getEnvFilePath = () => {
  return process.env.NODE_ENV === "production" ? ".env" : ".env.local";
};
