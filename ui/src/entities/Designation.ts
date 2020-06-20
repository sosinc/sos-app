import client from 'src/lib/client';

export interface Designation {
  id: string;
  name: string;
}

export const fetchMany = async (): Promise<Designation[]> => {
  const query = `
   {
    designations {
      id
      name
    }
  }`;

  const data = await client.request(query);

  return data?.designations.length ? data.designations : [];
};
