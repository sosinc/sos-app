import * as express from "express";
import auth from "./auth";

const api = express.Router();

api.use(express.json());
api.use(auth);

export default api;
