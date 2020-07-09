import { Router } from "express";
import { User } from "../entity/User.entity";

const api = Router();

api.get("/authenticate", (req, res) => {
  const user = req.session?.user as User;
  const organization_id = req.session?.organizationId;

  if (!user) {
    return res.json({
      "x-hasura-role": "anonymous",
    });
  }

  return res.json({
    "x-hasura-role": user.role_id.toLowerCase(),
    "x-hasura-user-id": user.id,
    "x-hasura-Organization-id": organization_id,
  });
});

export default api;
