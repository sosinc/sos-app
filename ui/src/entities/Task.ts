import dayjs from 'dayjs';

import client from 'src/lib/client';
import { PaginationArgs } from 'src/lib/paginationArgs';
import resolveStorageFile from 'src/lib/resolveStorageFile';
import { Project } from './Project';

export interface DailyTask {
  date: string;
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

export const fetchManyDailyTasks = async (payload: PaginationArgs): Promise<FetchTasksResponse> => {
  const today = dayjs(new Date()).format('YYYY-MM-DD');

  const query = `query ($offset: Int, $limit: Int){
    daily_tasks (
      offset: $offset,
      limit: $limit,
      order_by: { created_at: desc },
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

  const data = await client.request(query, payload);

  const projects = data.daily_tasks.map((d: any) => ({
    ...d.project,
    logo_square: resolveStorageFile(d.project.logo_square),
  }));

  return {
    projects,
    tasks: data.daily_tasks,
  };
};

export const setDailyTaskStatus = async (payload: UpdateTaskArgs): Promise<{ id: string }> => {
  const query = `
   mutation ($id: uuid!, $isDelivered: Boolean ) {
    update_daily_tasks_by_pk( pk_columns: {id: $id }
      _set:{
        is_delivered: $isDelivered,
      })
      {
        id
        is_delivered
      }
   }`;

  try {
    const data = await client.request(query, payload);

    return data.update_daily_tasks_by_pk;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};

export const updateDailyTask = async (payload: UpdateTaskArgs): Promise<{ id: string }> => {
  const query = `
mutation ($id: uuid!, $estimated_hours: numeric, $description: String, $issue_id: String, $pr_id: String, $project_id: uuid, $title: String ) {
      update_daily_tasks_by_pk( pk_columns: {id: $id }
      _set:{
        estimated_hours: $estimated_hours,
        issue_id: $issue_id,
        pr_id: $pr_id,
        title: $title,
      })
        {
          id
          is_delivered
        }
    }`;

  try {
    const data = await client.request(query, payload);

    return data.update_daily_tasks_by_pk;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};

export const deleteDailyTask = async (args: { id: string }): Promise<{ id: string }> => {
  const query = `
    mutation ($taskId: uuid!)  {
      delete_daily_tasks_by_pk(id: $taskId) {
        id
      }
    }`;

  try {
    const data = await client.request(query, args);

    return data.delete_daily_tasks_by_pk;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};
