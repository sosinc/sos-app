import * as express from "express";
import auth from "./auth";
import onNewUser from "./onNewUser";
import onNewEmployee from "./onNewEmployee";
import onNewProject from "./onNewProject";
import onNewTask from "./onNewTask";
import onDeleteEntity from "./onDeletedEntity";

const api = express.Router();

api.use(express.json());
api.use(auth);
api.use(onNewUser);
api.use(onNewEmployee);
api.use(onNewProject);
api.use(onNewTask);
api.use(onDeleteEntity);

export default api;
