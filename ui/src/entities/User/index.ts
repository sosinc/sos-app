import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';
import { Employee } from '../Employee';
import { Organization } from '../Organizations';
import { Project } from '../Project';
import { Team } from '../Team';

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  password: string;
  otp: string;
}

export const login = async (payload: LoginPayload): Promise<User> => {
  const query = `
    mutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        email role { id name }
      }
    }
  `;

  try {
    const data = await client.request(query, payload);

    return data.login;
  } catch (err) {
    if (err.response?.errors && err.response.errors.length) {
      throw new Error(err.response.errors[0].message);
    }

    throw new Error('Something went wrong :-(');
  }
};

export const logout = async (): Promise<undefined> => {
  const query = `
    mutation {
      logout
    }`;

  try {
    const data = await client.request(query);
    return data;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};

export interface CurrentUserResponse {
  user: User;
  employees: Employee[];
  organizations: Organization[];
  projects: Project[];
  teams: Team[];
}

/**
 * "me" request for getting loggedIn user on initial page load. `headers` are
 * required when making this request from server-side because server don't send
 * the cookie header automatically.
 */
export const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
  const query = `query {
    me {
      id
      name
      avatar
      email
      as_employee {
        ecode
        name
        organization_id
        organization {
          id
          is_current
          name
          square_logo
          projects {
            id
            name
            logo_square
            description
            organization_id
            issue_link_template
            pr_link_template
            teams {
                id
                logo_square
                name
                issue_link_template
                pr_link_template
                project_id
                members{
                  ecode
                  organization_id
                }
            }
            teams_aggregate {
              aggregate {
                count
              }
            }
          }
        }
      }
      role {
        id
        name
      }
    }
   }`;

  const data = await client.request(query);
  const me = data.me.length ? data.me[0] : null;

  if (!me) {
    throw new Error('Could not get current user');
  }

  const employees = me.as_employee.map((employee: any) => ({
    ecode: employee.ecode,
    isCurrent: employee.organization.is_current,
    name: employee.name,
    organization_id: employee.organization_id,
  }));
  const organizations = me.as_employee.map((org: any) => ({
    id: org.organization.id,
    isCurrent: org.organization.is_current,
    name: org.organization.name,
    square_logo: resolveStorageFile(org.organization.square_logo),
  }));
  const projects = me.as_employee.flatMap((employee: any) =>
    employee.organization.projects.map((project: any) => ({
      ...project,
      employeeId: project.id,
      logo_square: resolveStorageFile(project.logo_square),
      teams_count: project?.teams_aggregate?.aggregate?.count || 0,
    })),
  );
  const teams = me.as_employee.flatMap((employee: any) =>
    employee.organization.projects.flatMap((project: any) =>
      project.teams.map((t: any) => ({
        ...t,
        logo_square: resolveStorageFile(t.logo_square),
        memberIds: [],
      })),
    ),
  );

  return {
    employees,
    organizations,
    projects,
    teams,
    user: {
      avatar: resolveStorageFile(me.avatar),
      email: me.email,
      id: me.id,
      name: me.name,
      role: me.role,
    },
  };
};

export const sendPasswordResetOTP = async (email: string): Promise<undefined> => {
  const query = `
    mutation($email: String!) {
      sendPasswordResetOtp(email: $email)
    }`;

  try {
    const data = await client.request(query, { email });

    return data?.sendPasswordResetOtp;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<undefined> => {
  const query = `
    mutation($password: String!, $otp: String!) {
      resetPassword(newPassword: $password, otp: $otp) { id }
    }`;

  try {
    const data = await client.request(query, payload);

    return data?.resetPassword?.id;
  } catch (err) {
    if (Array.isArray(err.response?.errors) && err.response.errors.length) {
      throw new Error(err.response.errors[0].message);
    }

    throw new Error('Something went wrong :-(');
  }
};

export const setCurrentOrg = async (payload: { orgId: string }): Promise<undefined> => {
  const query = `
    mutation($orgId: String!){
      changeActiveOrg(orgId: $orgId)
    }`;

  try {
    const data = await client.request(query, payload);

    return data;
  } catch (err) {
    throw new Error('Something went wrong :-(');
  }
};
