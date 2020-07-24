import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';
import { Team } from './Team';

export interface Project {
  id: string;
  name: string;
  logo_square: string;
  description: string;
  issue_link_template?: string;
  pr_link_template?: string;
  organization_id: string;
  teams_count: number;
}

export interface ProjectArgs {
  id: string;
  name: string;
  logo_square: string;
  description: string;
  issue_link_template?: string;
  pr_link_template?: string;
  organization_id: string;
}

export interface GetOnePayload {
  id: string;
}

export interface ProjectResponse {
  project: Project;
  teams: Team[];
}

export const create = async (payload: ProjectArgs): Promise<Project> => {
  const query = `
  mutation ($name: String!, $logo_square: String, $description: String, $issue_link_template: String, $pr_link_template: String, $organization_id: uuid!){
    insert_projects_one(object: {
    name: $name,
    logo_square: $logo_square,
    description: $description,
    organization_id: $organization_id,
    issue_link_template: $issue_link_template,
    pr_link_template: $pr_link_template,
    }) {
      id
    }
  }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate project name');
    }
    throw new Error('Something went wrong :-(');
  }
};

export const update = async (payload: ProjectArgs): Promise<Project> => {
  const query = `
    mutation ($projectId: uuid!, $name: String!, $logo_square: String, $description: String, $issue_link_template: String, $pr_link_template: String, $organization_id: uuid!){
      update_projects_by_pk( pk_columns:
        {id: $projectId }
          _set:{
            name: $name
            logo_square: $logo_square,
            description: $description,
            issue_link_template: $issue_link_template,
            pr_link_template: $pr_link_template,
          })
        {
          id
        }
    }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate project name');
    }
    throw new Error('Something went wrong :-(');
  }
};

export const fetchMany = async (): Promise<Project[]> => {
  const query = `{
  projects {
      id
      name
      logo_square
      description
      organization_id
      teams_aggregate {
        aggregate {
          count
        }
      }
    }
  }`;

  const data = await client.request(query);
  return data?.projects.length
    ? data.projects.map((e: any) => ({
        ...e,
        logo_square: resolveStorageFile(e.logo_square),
        teams_count: e?.teams_aggregate?.aggregate?.count || 0,
      }))
    : [];
};

export const fetchOne = async (payload: GetOnePayload): Promise<ProjectResponse> => {
  const query = `query ($id: uuid!){
    projects_by_pk(id: $id) {
      id
      name
      logo_square
      description
      issue_link_template
      pr_link_template
      organization_id
      issue_link_template
      pr_link_template
      teams{
        id
        name
        logo_square
        members{
          ecode
        }
      }
    }
  }`;

  const data = await client.request(query, payload);
  let project = data.projects_by_pk;

  if (!project) {
    throw new Error('Could not get projects at the moment');
  }

  const teams = project.teams.length
    ? project.teams.map((t: any) => ({
        ...t,
        logo_square: resolveStorageFile(t.logo_square),
        membersCount: t.members.length,
        project_id: project.id,
      }))
    : [];

  project = { ...project, logo_square: resolveStorageFile(project.logo_square) };
  delete project.teams;

  return {
    project,
    teams,
  };
};
