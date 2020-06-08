import 'cross-fetch/polyfill';
import { GraphQLClient } from 'graphql-request';
import config from 'src/config';

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

const client = new GraphQLClient(config.urls.graphql, {
  credentials: 'include',
});

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

  try {
    const data = await client.request(query);

    return data.me?.length ? data.me[0] : undefined;
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(`[fetchCurrentUser]: ${err.message}`);

    throw err;
  }
};
