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

export interface SendOTPPayload {
  email: string;
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

export const sendPasswordResetOTP = async (payload: SendOTPPayload): Promise<undefined> => {
  const query = `
    mutation($email: String!) {
      sendPasswordResetOtp(email: $email)
    }
  `;
  const data = await client.request(query, payload);

  return data ? data.sendPasswordResetOtp : undefined;
};
