import client from 'src/lib/client';

export interface Activity {
  task_id: string;
  project_id: string;
  type: string;
  user_id: string;
}

export const fetchMany = async (): Promise<Activity[]> => {
  const query = `
    query {
      activities{
        id
        project_id
        task_id
        user_id
        type
      }
  }`;

  const data = await client.request(query);
  return data?.activities;
};
