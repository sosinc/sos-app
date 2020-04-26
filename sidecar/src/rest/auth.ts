import { Router } from "express";

const api = Router();

api.post("/authenticate", req => {
  const user = req.session?.user;

  console.log("USER", user);

  return {
    "x-hasura-user-id": "lol",
  };
});

export default api;
