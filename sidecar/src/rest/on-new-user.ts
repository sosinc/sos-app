import { Router } from "express";
import { UserLogin } from "../entity/UserLogin.entity";

const api = Router();

api.post("/on-new-user", async (req, res) => {
  const {
    event: { data: user },
  } = req.body;

  const userLoginRepo = UserLogin.getRepository();

  const existingUserLogin = await userLoginRepo.findOne({
    public_key: user.new.email,
    provider: "EMAIL",
  });

  if (existingUserLogin) {
    return res.status(208).send();
  }

  const userLogin = new UserLogin();
  userLogin.public_key = user.new.email;
  userLogin.provider = "EMAIL";
  userLogin.user_id = user.new.id;
  await userLoginRepo.save(userLogin);

  res.status(201).send();
});

export default api;
