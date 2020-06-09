import 'cross-fetch/polyfill';

import client from 'src/lib/client';

export interface Organization {
  id: string;
  name: string;
  banner: string;
  square_logo: string;
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
               {
               id
               name
               banner
               square_logo
            }
          }`;

  const data = await client.request(query, payload);

  return data.insert_organizations_one;
};

export const fetch = async (): Promise<Organization[]> => {
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
