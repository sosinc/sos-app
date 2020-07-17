import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';
import { Project } from './Project';

export interface DailyTask {
  id: string;
  is_delivered: boolean;
  project_id: string;
  title: string;
  description: string;
  issue_id: string;
  pr_id: string;
  estimated_hours: number;
  billable_hours: number;
  user_id: string;
}

export interface FetchTasksResponse {
  projects: Project[];
  tasks: DailyTask[];
}

export interface UpdateTaskArgs {
  id: string;
  isDelivered: boolean;
}

export const createDailyTasks = async (payload: DailyTask[]): Promise<undefined> => {
  const query = `
    mutation ($statusUpdates: [daily_tasks_insert_input!]!) {
      insert_daily_tasks(objects: $statusUpdates) { affected_rows }
    }`;

  try {
    const data = await client.request(query, { statusUpdates: payload });

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate title');
    }
    throw new Error('Something went wrong :-(');
  }
};

export const fetchManyDailyTasks = async (): Promise<FetchTasksResponse> => {
  const date = new Date();
  const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const query = `{
    daily_tasks (
      order_by: { created_at: asc },
      where: { _or: [
      { date: { _eq: "${today}" } }
      { is_delivered: { _eq: false } }
      ] }
    ) {
      id
      is_delivered
      title
      pr_id
      issue_id
      billable_hours
      date
      project_id
      project {
        id
        name
        logo_square
        }
      }
    }`;

  const data = await client.request(query);

  const projects = data.daily_tasks.map((d: any) => ({
    ...d.project,
    logo_square: resolveStorageFile(d.project.logo_square),
  }));

  return {
    projects,
    tasks: data.daily_tasks,
  };
};

export const updateDailyTasks = async (payload: UpdateTaskArgs): Promise<{ id: string }> => {
  const query = `
mutation ($isDelivered: Boolean, $id: uuid!) {
      update_daily_tasks_by_pk( pk_columns: {id: $id } _set:{ is_delivered: $isDelivered})
        {
          id
        }
    }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};
