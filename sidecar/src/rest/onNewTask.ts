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
  newActivity.user_id = task.created_by;
  newActivity.project_id = task.project_id;
  newActivity.payload = {id: task.id, is_delivered: task.is_delivered, title: task.title, issue_id: task.issue_id, pr_id: task.pr_id};

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
  newActivity.user_id = task.created_by;
  newActivity.project_id = task.project_id;
  newActivity.payload = {id: task.id, is_delivered: task.is_delivered, title: task.title, issue_id: task.issue_id, pr_id: task.pr_id};

  await activityRepo.save(newActivity);

  res.status(201).send();
});

export default api;
