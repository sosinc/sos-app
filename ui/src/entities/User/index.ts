import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';
import { Employee } from '../Employee';
import { Organization } from '../Organizations';
import { Project } from '../Project';

export interface Role {
  id: string;
  name: string;
}

export interface User {
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

  return client.request(query, payload).then((data) => data.login);
};

export interface CurrentUserResponse {
  user: User;
  employees: Employee[];
  organizations: Organization[];
  projects: Project[];
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
          name
          projects {
            id
            name
            logo
            organization_id
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

  const employees = me.as_employee.map((e: any) => ({
    ecode: e.ecode,
    name: e.name,
    organization_id: e.organization_id,
  }));
  const organizations = me.as_employee.map((e: any) => ({
    id: e.organization.id,
    name: e.organization.name,
  }));
  const projects = me.as_employee.flatMap((e: any) =>
    e.organization.projects.map((p: any) => ({ ...p, employeeId: e.id })),
  );

  return {
    employees,
    organizations,
    projects,
    user: {
      avatar: resolveStorageFile(me.avatar),
      email: me.email,
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
  const data = await client.request(query, { email });

  return data?.sendPasswordResetOtp;
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<undefined> => {
  const query = `
    mutation($password: String!, $otp: String!) {
      resetPassword(newPassword: $password, otp: $otp) { id }
    }`;
  const data = await client.request(query, payload);

  return data?.resetPassword?.id;
};
