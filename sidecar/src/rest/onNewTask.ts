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
  newActivity.payload = {old_status: task.is_delivered, new_status: task.is_delivered};

  await activityRepo.save(newActivity);

  res.status(201).send();
});

api.post("/on-task-status-updates", async (req, res) => {

  const {
    event: {
      data: { new: task },
    },
  } = req.body;

  const activityRepo = Activities.getRepository();

  const newActivity = new Activities();
  newActivity.type = 'TASK_STATUS_UPDATE';
  newActivity.task_id = task.id;
  newActivity.user_id = task.created_by;
  newActivity.project_id = task.project_id;
  newActivity.payload = {old_status: !task.is_delivered, new_status: task.is_delivered};

  await activityRepo.save(newActivity);

  res.status(201).send();
});

export default api;
