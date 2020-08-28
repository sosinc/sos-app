import { Router } from "express";
import { Deleted } from "../entity/Deleted.entity";

const api = Router();

api.post("/add-deleted-entities", async (req, res) => {
  const {
    table: { name: tableType },
  } = req.body;

  const {
    event: { session_variables: sessionVar },
  } = req.body;

  const {
    event: {
      data: { old: entity },
    },
  } = req.body;

  const deletedRepo = Deleted.getRepository();
  const newEntity = new Deleted();
  newEntity.deleted_by = sessionVar["x-hasura-user-id"];
  newEntity.type = tableType;
  newEntity.organization_id = sessionVar["x-hasura-organization-id"] || null;
  newEntity.row = {
    ...entity,
  };

  await deletedRepo.save(newEntity);

  res.status(201).send();
});

export default api;
