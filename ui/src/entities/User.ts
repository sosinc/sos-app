import 'cross-fetch/polyfill';

import client from 'src/lib/client';

export interface Role {
  id: string;
  name: string;
}

export interface User {
  email: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
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

/**
 * "me" request for getting loggedIn user on initial page load. `headers` are
 * required when making this request from server-side because server don't send
 * the cookie header automatically.
 */
export const fetchCurrentUser = async (): Promise<User> => {
  const query = `query { me { email, role { id, name }} }`;

  const data = await client.request(query);

  return data.me?.length ? data.me[0] : undefined;
};

export const sendPasswordResetOTP = async (email: string): Promise<undefined> => {
  const query = `
    mutation($email: String!) {
      sendPasswordResetOtp(email: $email)
    }
  `;
  const data = await client.request(query, { email });

  return data?.sendPasswordResetOtp;
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<undefined> => {
  const query = `
    mutation($newPassword: String!, $otp: String!) {
      resetPassword(newPassword: $newPassword, otp: $otp) {
        id
      }
    }
  `;
  const data = await client.request(query, payload);

  return data?.resetPassword?.id;
};
