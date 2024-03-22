import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  login: {
    message: string;
    user: User;
  };
}

interface SignupResponse {
  signup: {
    message: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private apollo: Apollo) { }

  login(username: string, password: string) {
    return this.apollo.mutate<LoginResponse>({
      mutation: gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            message
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        password
      }
    }).pipe(tap(result => {
      if (result.data?.login.message === 'Success') {
        this._isLoggedIn.next(true);
      }
    }));
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate<SignupResponse>({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            message
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password
      }
    }).pipe(tap(result => {
      if (result.data?.signup.message === 'Success') {
        this._isLoggedIn.next(true);
      }
    }));
  }

  logout() {
    this._isLoggedIn.next(false);
  }
}