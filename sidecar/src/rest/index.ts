import * as express from "express";
import auth from "./auth";
import onNewUser from "./on-new-user";

const api = express.Router();

api.use(express.json());
api.use(auth);
api.use(onNewUser);

export default api;
