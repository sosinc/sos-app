import client from 'src/lib/client';
import resolveStorageFile from 'src/lib/resolveStorageFile';
import { User } from './User';

export interface ActivityEvent {
  id: string;
  project_id: string;
  type: string;
  user_id: string;
  created_at: string;
  payload: {id: string, is_delivered: boolean, pr_id: string, issue_id: string, title: string};
  user: User;
}

export const fetchMany = async (): Promise<ActivityEvent[]> => {
  const query = `
    query {
      activities(order_by: { created_at: desc }) {
        id
        project_id
        user_id
        type
        payload
        user {
          id
          name
          avatar
        }
        created_at
      }
  }`;

  const data = await client.request(query);
  const activities = data?.activities;

  return activities.map((a: any) => ({
    ...a,
    user: {...a.user, avatar: resolveStorageFile(a.user.avatar)}}));
};
