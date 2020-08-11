import { Router } from "express";
import { Activities } from "../entity/Activity.entity";

const api = Router();

api.post("/on-new-task", async (req, res) => {

  const {
    event: {
      data: { new: task },
    },
  } = req.body;

  const activityRepo = Activities.getRepository();

  const newActivity = new Activities();
  newActivity.type = 'TASK_ADDED';
  newActivity.task_id = task.id;
  newActivity.user_id = task.created_by;
  newActivity.project_id = task.project_id;

  await activityRepo.save(newActivity);

  res.status(201).send();
});

export default api;
