import { Router } from "express";
import { User } from "../entity/User.entity";
import { UserLogin } from "../entity/UserLogin.entity";
import { Employee } from "../entity/Employee.entity";

const api = Router();

api.post("/on-new-employee", async (req, res) => {
  const {
    event: { data: employee },
  } = req.body;

  const userRepo = User.getRepository();
  const userLoginRepo = UserLogin.getRepository();
  const employeeRepo = Employee.getRepository();

  const existingUserLogin = await userLoginRepo.findOne({
    public_key: employee.new.email,
    provider: "EMAIL",
  });

  if (!existingUserLogin) {
    const newUser = new User();
    newUser.name = employee.new.name;
    newUser.avatar = employee.new.headshot;
    newUser.email = employee.new.email;
    newUser.role_id = "USER";

    await userRepo.save(newUser);
  }

  const user = await userRepo.findOneOrFail({ email: employee.new.email });
  const emp = await employeeRepo.findOneOrFail({ email: employee.new.email });

  emp.user_id = user.id;

  await employeeRepo.save(emp);

  res.status(201).send();
});

export default api;
