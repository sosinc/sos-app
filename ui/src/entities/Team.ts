import client from 'src/lib/client';
import resolveStorageFile from 'src/lib/resolveStorageFile';
import uploadDefaultLogo from 'src/lib/uploadDefaultLogo';
import { Project } from './Project';

export interface Team {
  id: string;
  name: string;
  banner: string;
  logo_square: string;
  project_id: string;
  issue_link_template: string;
  pr_link_template: string;
  memberIds: string[];
  membersCount: number;
}

export interface TeamArgs {
  project_id: string;
  name: string;
  logo_square?: string;
  issue_link_template?: string;
  pr_link_template?: string;
}

export interface CreateMemberArgs {
  ecode: string;
  team_id: string;
  organization_id: string;
}

export interface CreateMemberResponse {
  teamId: string;
  employeeId: string;
}

export interface FetchOneTeamResponse {
  project: Project;
  team: Team;
}

export const create = async (args: TeamArgs): Promise<Team> => {
  const query = `
  mutation ($name: String!, $project_id: uuid!, $logo_square: String, $issue_link_template: String, $pr_link_template: String,){
    insert_teams_one(object: {
      name: $name
      logo_square: $logo_square
      project_id: $project_id
      issue_link_template: $issue_link_template,
      pr_link_template: $pr_link_template,
      }) {
        id
        name
      }
  }`;

  try {
    const logoSquare = args.logo_square || (await uploadDefaultLogo(args.name));
    const variables: TeamArgs = { ...args, logo_square: logoSquare };
    const data = await client.request(query, variables);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate team name');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const update = async (payload: TeamArgs): Promise<Team> => {
  const query = `
    mutation ($teamId: uuid!, $name: String!, $project_id: uuid, $logo_square: String, $issue_link_template: String, $pr_link_template: String){
      update_teams_by_pk( pk_columns: {id: $teamId }
        _set:{
          name: $name
          logo_square: $logo_square,
          issue_link_template: $issue_link_template,
          pr_link_template: $pr_link_template,
        }){
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

export const fetchOne = async (payload: { id: string }): Promise<FetchOneTeamResponse> => {
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
        issue_link_template
        pr_link_template
      }
      members{
        ecode
        organization_id
      }
    }
  }`;

  try {
    const { project: projectData, members, ...teamData } = (
      await client.request(query, payload)
    ).teams_by_pk;

    const project = { ...projectData, logo_square: resolveStorageFile(projectData.logo_square) };
    const memberIds = members.map(
      (m: { ecode: string; organization_id: string }) => `${m.ecode}-${m.organization_id}`,
    );

    const team = { ...teamData, logo_square: resolveStorageFile(teamData.logo_square), memberIds };

    return { team, project };
  } catch (err) {
    throw new Error('Could not get team at the moment');
  }
};

export const createMember = async (args: CreateMemberArgs): Promise<CreateMemberResponse> => {
  const query = `
    mutation ($ecode: String!, $team_id: uuid!, $organization_id: uuid!){
      insert_team_members_one(object: {
      ecode: $ecode
      organization_id: $organization_id
      team_id: $team_id
    }) {
      team_id
    }
  }`;

  try {
    await client.request(query, args);

    return {
      employeeId: `${args.ecode}-${args.organization_id}`,
      teamId: args.team_id,
    };
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate member');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const deleteMember = async (args: CreateMemberArgs): Promise<CreateMemberResponse> => {
  const query = `
    mutation ($team_id: uuid!, $ecode: String!, $organization_id: uuid!) {
      delete_team_members_by_pk(
        ecode: $ecode,
        organization_id: $organization_id,
        team_id: $team_id)
       {
         ecode
         organization_id
      }
  }`;

  try {
    await client.request(query, args);

    return {
      employeeId: `${args.ecode}-${args.organization_id}`,
      teamId: args.team_id,
    };
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};
