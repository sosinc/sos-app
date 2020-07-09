import * as express from "express";
import auth from "./auth";
import onNewUser from "./onNewUser";
import onNewEmployee from "./onNewEmployee";
import onNewProject from './onNewProject';

const api = express.Router();

api.use(express.json());
api.use(auth);
api.use(onNewUser);
api.use(onNewEmployee);
api.use(onNewProject);

export default api;
