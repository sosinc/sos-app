import client from 'src/lib/client';
import { PaginationArgs } from 'src/utils/paginationArgs';
import resolveStorageFile from 'src/utils/resolveStorageFile';

export interface Organization {
  id: string;
  name: string;
  banner: string;
  square_logo: string;
  employees_count: number;
  isCurrent: boolean;
}

export interface OrganizationArgs {
  id: string;
  name: string;
  banner?: string;
  square_logo?: string;
}

export const create = async (payload: OrganizationArgs): Promise<Organization> => {
  const query = `
  mutation ($name: String!, $banner: String, $square_logo: String){
    insert_organizations_one(
      object:{
        name: $name,
        banner: $banner,
        square_logo: $square_logo
      }) {
        id
      }
  }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate organization name');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const update = async (payload: OrganizationArgs): Promise<Organization> => {
  const query = `
    mutation ($orgId: uuid!, $name: String!, $banner: String, $square_logo: String){
      update_organizations_by_pk ( pk_columns: {id: $orgId }
      _set:{
        name: $name,
        banner: $banner,
        square_logo: $square_logo
      }) {
        id
        }
    }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate organization name');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const fetchMany = async (payload: PaginationArgs): Promise<Organization[]> => {
  const query = `query ( $offset: Int, $limit: Int ){
    organizations(offset: $offset, limit: $limit) {
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

  const data = await client.request(query, payload);

  const organizations: Organization[] = data?.organizations.map((org: any) => {
    return {
      ...org,
      banner: resolveStorageFile(org.banner),
      employees_count: org?.employees_aggregate?.aggregate?.count || 0,
      square_logo: resolveStorageFile(org.square_logo),
    };
  });

  return organizations || [];
};

export const fetchOne = async (payload: { id: string }): Promise<Organization> => {
  const query = `query ($id: uuid!){
    organizations_by_pk(id: $id ) {
      id
      name
      square_logo
      banner
      }
  }`;

  const data = await client.request(query, payload);
  const organization = data.organizations_by_pk;

  if (!organization) {
    throw new Error('Could not get organization at the moment');
  }

  return organization;
};
