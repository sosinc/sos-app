import client from 'src/lib/client';

export interface Team {
  id: string;
  name: string;
  banner: string;
  logo_square: string;
  project_id: string;
  issue_link_template: string;
  pr_link_template: string;
}

export interface CreatePayload {
  project_id: string;
  name: string;
  logo_square?: string;
  issue_link_template?: string;
  pr_link_template?: string;
}

export const create = async (payload: CreatePayload): Promise<Team> => {
  const query = `
  mutation ($name: String!, $project_id: uuid!, $logo_square: String, $issue_link_template: String, $pr_link_template: String,){
    insert_teams_one(object: {
      name: $name
      project_id: $project_id
      }) {
        id
        name
      }
  }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  }  catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate team name');
    }

    throw new Error('Something went wrong :-(');
  }
};
