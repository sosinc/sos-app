import 'cross-fetch/polyfill';

import { Employee } from 'src/entities/Employee';
import client from 'src/lib/client';

export interface Organization {
  id: string;
  name: string;
  banner: string;
  square_logo: string;
  employees: Employee;
}

export interface CreatePayload {
  name: string;
  banner?: string;
  square_logo?: string;
}

export interface GetOnePayload {
  id: string;
}

export const create = async (payload: CreatePayload): Promise<Organization> => {
  const query = `
  mutation ($name: String!, $banner: String, $square_logo: String){
    insert_organizations_one(
      object:{
        name: $name,
        banner: $banner,
        square_logo: $square_logo
      })
      {id}
  }`;

  const data = await client.request(query, payload);

  return data.payload;
};

export const fetchMany = async (): Promise<Organization[]> => {
  const query = `{
  organizations {
    id
    name
    square_logo
    banner
   }
 }`;

  const data = await client.request(query);

  return data?.organizations.length ? data.organizations : [];
};

export const fetchOne = async (payload: GetOnePayload): Promise<Organization> => {
  const query = `query ($id: uuid!){
  organizations_by_pk(id: $id) {
    id
    name
    square_logo
    banner
    employees {
      name
      headshot
      joining_date
      relieving_date
      user_id
      }
    }
}`;

  const data = await client.request(query, payload);

  return data?.organizations_by_pk ? data.organizations_by_pk : {};
};
