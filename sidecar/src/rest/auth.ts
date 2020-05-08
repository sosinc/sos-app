import { Router } from "express";
import { User } from "../entity/User.entity";

const api = Router();

api.get("/authenticate", (req, res) => {
  const user = req.session?.user as User;

  if (!user) {
    return res.status(403).json({
      status: "I've never seen this man in my life",
    });
  }

  console.log("USER", user);

  return res.json({
    "x-hasura-role": user.role_id.toLowerCase(),
    "x-hasura-user-id": user.id,
  });
});

export default api;
