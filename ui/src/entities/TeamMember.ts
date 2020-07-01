import client from 'src/lib/client';

export interface Member {
  designation_id: string;
  id: string;
  ecode: string;
  name: string;
  headshot: string;
  team_id: string;
  orgainzation_id: string;
}

export interface CreatePayload {
  ecode: string;
  team_id: string;
  organization_id: string;
}

export const create = async (payload: CreatePayload): Promise<Member> => {
  const query = `
  mutation ($ecode: String!, $team_id: uuid!, $organization_id: uuid!){
    insert_team_members_one(object: {
    ecode: $ecode
    organization_id: $organization_id
    team_id: $team_id
    }) {
        team_id
        employee{
        ecode
        name
        headshot
        designation_id
      }
    }
}`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate member name');
    }

    throw new Error('Something went wrong :-(');
  }
};
