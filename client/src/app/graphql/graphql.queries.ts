import { gql } from 'apollo-angular';


export const SIGNUP = gql`
  mutation Signup($user: UserInput!) {
    signup(user: $user) {
      message
      user {
        id
        username
        email
        password
      }
    }
  }
`;

export const LOGIN = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      message
      user {
        id
        username
        email
        password
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;

export const LIST_EMPLOYEES = gql`
  query ListEmployees {
    listEmployees {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($employee: EmployeeInput!) {
    addEmployee(employee: $employee) {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $employee: EmployeeInput) {
    updateEmployee(id: $id, employee: $employee) {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;