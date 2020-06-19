import 'cross-fetch/polyfill';

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
}

export interface CreatePayload {
  name: string;
  logo_square: string;
  description: string;
  issue_link_template?: string;
  pr_link_template?: string;
  organization_id: string;
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

  const data = await client.request(query, payload);

  return data.payload;
};

export const fetchMany = async (): Promise<Project[]> => {
  const query = `{
  projects {
      id
      name
      logo_square
      description
      organization_id
    }
  }`;

  const data = await client.request(query);

  return data?.projects.length
    ? data.projects.map((e: any) => ({
        ...e,
        logo: resolveStorageFile(e.logo),
      }))
    : [];
};
