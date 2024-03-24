import { gql } from 'apollo-angular';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

export { GET_USERS as getUsers };