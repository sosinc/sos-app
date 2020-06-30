import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';
import { Project } from './Project';

export interface Team {
  id: string;
  name: string;
  banner: string;
  logo_square: string;
  project_id: string;
  issue_link_template: string;
  pr_link_template: string;
}

export interface CreatePayload {
  project_id: string;
  name: string;
  logo_square?: string;
  issue_link_template?: string;
  pr_link_template?: string;
}

export interface CreateMemberPayload {
  ecode: string;
  team_id: string;
  organization_id: string;
}

export interface TeamResponse {
  project: Project;
  team: Team;
}

export const create = async (payload: CreatePayload): Promise<Team> => {
  const query = `
  mutation ($name: String!, $project_id: uuid!, $logo_square: String, $issue_link_template: String, $pr_link_template: String,){
    insert_teams_one(object: {
      name: $name
      logo_square: $logo_square
      project_id: $project_id
      }) {
        id
        name
      }
  }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate team name');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const fetchOne = async (payload: {id: string}): Promise<TeamResponse> => {
  const query = `query ($id: uuid!){
  teams_by_pk(id: $id ) {
    id
    name
    logo_square
    issue_link_template
    pr_link_template
    project{
      id
      name
      logo_square
      description
      organization_id
    }
  }
}`;

  const data = await client.request(query, payload);
  let team = data.teams_by_pk;

  if (!team) {
    throw new Error('Could not get team at the moment');
  }

  const project = {...team.project, logo_square: resolveStorageFile(team.project.logo_square)};
  team = {...team, logo_square: resolveStorageFile(team.logo_square)};
  delete team.project;

  return {team, project};
};

export const createTeamMember = async (payload: CreateMemberPayload): Promise<{id: string}> => {
  const query = `
  mutation ($ecode: String!, $team_id: uuid!, $organization_id: Suuid){
    insert_teams_one(object: {
    name: $ecode
    organization_id: $organization_id
    team_id: $team_id
    }) {
      id
    }
}`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate member name');
    }

    throw new Error('Something went wrong :-(');
  }
};
