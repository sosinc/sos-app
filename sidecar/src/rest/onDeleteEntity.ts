import { Router } from "express";
import { Deleted } from "../entity/Delete.Antity";

const api = Router();

api.post("/add-deleted-entities", async (req, res) => {
  console.warn("----------delete---hook", req);
  const {
    event: {
      data: { new: task },
    },
  } = req.body;

  const deletedRepo = Deleted.getRepository();

  const newEntity = new Deleted();
  newEntity.type = "TASK_DETELED";
  newEntity.deleted_by = task.created_by;
  newEntity.organization_id = task.project_id;
  newEntity.row = {
    id: task.id,
  };

  await deletedRepo.save(newEntity);

  res.status(201).send();
});

export default api;
