import 'cross-fetch/polyfill';

import client from 'src/lib/client';

export interface Employee {
  ecode: string;
  email: string;
  name: string;
  headshot: string;
  joining_date: string;
  designation_id: string;
  organiztion_id: string;
}

export interface CreatePayload {
  ecode: string;
  email?: string;
  name: string;
  headshot?: string;
  organization_id: string;
  designation_id: string;
}

export const create = async (payload: CreatePayload): Promise<Employee> => {
  const query = `
  mutation ($ecode: String!, $email: String, $name: String!, $headshot: String, $designation_id: designations_enum!, $organization_id: uuid!){
    insert_employees_one(
      object:{
         ecode: $ecode,
         email: $email,
         name: $name,
         headshot: $headshot,
         designation_id: $designation_id,
         organization_id: $organization_id
      })
       {
        ecode
      }
  }`;

  const data = await client.request(query, payload);

  return data.payload;
};

export const fetchMany = async (): Promise<Employee[]> => {
  const query = `{
  employees {
    ecode
    name
    email
    headshot
    joining_date
    designation_id
    }
  }`;

  const data = await client.request(query);

  return data?.employees.length ? data.employees : [];
};
