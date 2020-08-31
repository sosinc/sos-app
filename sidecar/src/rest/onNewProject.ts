import { Router } from "express";
import { Team } from "../entity/Team.entity";
import { TeamMember } from "../entity/TeamMember.entity";
import { Employee } from "../entity/Employee.entity";

const api = Router();

// user can see only those projects which he/she is a member so when a employee creates a project than this hook create a team which he is member
api.post("/on-new-project", async (req, res) => {
  const {
    event: {
      data: { new: project },
    },
  } = req.body;

  const employeeRepo = Employee.getRepository();

  // if admin creates a project than there is not need to create a team automatically since admin has no ecode
  const employee = await employeeRepo.findOneOrFail({ user_id: project.created_by });
  if (!employee.ecode) {
    res.status(201).send();
    return;
  }

  const memberRepo = TeamMember.getRepository();
  const teamRepo = Team.getRepository();
  const newTeam = new Team();

  newTeam.project_id = project.id;
  newTeam.name = project.name;

  await teamRepo.save(newTeam);

  const team = await teamRepo.findOneOrFail({ project_id: project.id });
  const newMember = new TeamMember();

  newMember.team_id = team.id;
  newMember.ecode = employee.ecode;
  newMember.employee_id = employee.id;
  newMember.organization_id = employee.organization_id;

  await memberRepo.save(newMember);

  res.status(201).send();
});

export default api;
