import { Router } from "express";
import { Team } from '../entity/Team.entity';
import { TeamMember } from '../entity/TeamMember.entity';
import { Employee } from "../entity/Employee.entity";

const api = Router();

api.post("/on-new-project", async (req, res) => {
  const {
    event: { data: { new: project } },
  } = req.body;

  const teamRepo = Team.getRepository();
  const memberRepo = TeamMember.getRepository();
  const employeeRepo = Employee.getRepository();

  const newTeam = new Team();

  newTeam.project_id = project.id;
  newTeam.name = project.name;

  await teamRepo.save(newTeam);

  const team = await teamRepo.findOneOrFail({ project_id: project.id });
  const user =await employeeRepo.findOneOrFail({ organization_id: project.organization_id });

  const newMember = new TeamMember();

  newMember.team_id = team.id;
  newMember.ecode = user.ecode;
  newMember.organization_id = user.organization_id;

  await memberRepo.save(newMember);

  res.status(201).send();
});

export default api;
