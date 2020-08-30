import client from 'src/lib/client';
import { PaginationArgs } from 'src/lib/paginationArgs';
import resolveStorageFile from 'src/lib/resolveStorageFile';
import uploadDefaultLogo from 'src/lib/uploadDefaultLogo';

export interface Employee {
  isCurrent: boolean;
  id: string;
  ecode: string;
  email: string;
  name: string;
  headshot: string;
  joining_date: string;
  designation_id: string;
  organization_id: string;
}

export interface EmployeeArgs {
  ecode: string;
  email?: string;
  name: string;
  headshot?: string;
  organization_id: string;
  designation_id: string;
}

export const create = async (args: EmployeeArgs): Promise<Employee> => {
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

  try {
    const headshot = args.headshot || (await uploadDefaultLogo(args.name));
    const variables: EmployeeArgs = { ...args, headshot };
    const data = await client.request(query, variables);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate employee ecode');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const deleteEmployee = async (args: { id: string }): Promise<Employee> => {
  const query = `
    mutation ($id: uuid!)  {
      delete_employees_by_pk(
        id: $id,)
        {
         id
         ecode,
         organization_id
        }
      }`;

  try {
    const data = await client.request(query, args);

    return data.delete_employees_by_pk;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};

export const update = async (payload: EmployeeArgs): Promise<Employee> => {
  const query = `
    mutation ($id: uuid!, $ecode: String, $email: String, $name: String, $headshot: String, $designation_id: designations_enum, $organization_id: uuid)
     {update_employees_by_pk ( pk_columns: {id: $id}
      _set:{
        ecode: $ecode,
        email: $email,
        name: $name,
        headshot: $headshot,
        designation_id: $designation_id,
        organization_id: $organization_id
        }){
        id
        ecode
      }
    }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate employee email');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const fetchMany = async (payload: PaginationArgs): Promise<Employee[]> => {
  const query = ` query ( $offset: Int, $limit: Int ){
   employees(offset: $offset, limit: $limit) {
    id
    ecode
    name
    email
    headshot
    joining_date
    designation_id
    organization_id
    }
  }`;

  const data = await client.request(query, payload);

  return data?.employees.length
    ? data.employees.map((e: any) => ({
        ...e,
        headshot: resolveStorageFile(e.headshot),
      }))
    : [];
};

export const fetchOne = async (payload: { id: string }): Promise<Employee> => {
  const query = `query ($id: uuid!){
    employees_by_pk(id: $id ) {
      id
      ecode
      name
      email
      headshot
      joining_date
      designation_id
      organization_id
     }
   }`;

  const data = await client.request(query, payload);
  const employee = data.employees_by_pk;

  if (!employee) {
    throw new Error('Could not get employee at the moment');
  }
  return employee;
};
