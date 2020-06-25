import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';

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

export interface CreatePayload {
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

export const create = async (payload: CreatePayload): Promise<Project> => {
  const query = `
  mutation ($name: String!, $logo_square: String, $description: String, $issue_link_template: String, $pr_link_template: String, $organization_id: uuid!){
    insert_projects_one(object: {
    name: $name,
    logo_square: $logo_square,
    description: $description,
    organization_id: $organization_id,
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
        teams_count: data?.teams_aggregate?.aggregate?.count || 0,
      }))
    : [];
};

export const fetchOne = async (payload: GetOnePayload): Promise<Project> => {
  const query = `query ($id: uuid!){
    projects_by_pk(id: $id) {
      id
      name
      logo_square
      description
      issue_link_template
      pr_link_template
      organization_id
    }
  }`;

  const data = await client.request(query, payload);

  return data?.projects_by_pk
    ? { ...data.projects_by_pk, logo_square: resolveStorageFile(data.projects_by_pk.logo_square) }
    : {};
};
