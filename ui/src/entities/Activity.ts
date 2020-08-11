import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';
import { User } from './User';

export interface Activity {
  task_id: string;
  project_id: string;
  type: string;
  user_id: string;
  updated_at: string;
  payload: {old_status: boolean, new_status: boolean};
  user: User;
}

export const fetchMany = async (): Promise<Activity[]> => {
  const query = `
    query {
      activities{
        id
        project_id
        task_id
        type
        payload
        user {
          id
          name
          avatar
        }
        updated_at
      }
  }`;

  const data = await client.request(query);

  return data?.activities.map((a: any) => ({
      ...a,
    user: {...a.user, avatar: resolveStorageFile(a.user.avatar)}}));
};
