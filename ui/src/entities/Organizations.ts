import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';

export interface Organization {
  id: string;
  name: string;
  banner: string;
  square_logo: string;
  employees_count: number;
}

export interface CreatePayload {
  name: string;
  banner?: string;
  square_logo?: string;
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
    employees_aggregate {
      aggregate {
        count
      }
    }
   }
 }`;

  const data = await client.request(query);
  const organizations: Organization[] = data?.organizations.map((org: any) => {
    return {
      ...org,
      banner: resolveStorageFile(org.banner),
      employees_count: org?.employees_agregate?.aggregate?.count || 0,
      square_logo: resolveStorageFile(org.square_logo),
    };
  });

  return organizations || [];
};
