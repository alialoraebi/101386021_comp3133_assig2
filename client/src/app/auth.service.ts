import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOGIN, SIGNUP } from './graphql/graphql.queries';
import { NetworkStatus } from '@apollo/client/core';

interface ApolloQueryResult<T> {
  data: T;
  loading: boolean;
  networkStatus: NetworkStatus;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string; 
}

interface LoginResponse {
  login: {
    message: string;
    user: User;
    token: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor(private apollo: Apollo) { }

  login(username: string, password: string): Observable<any> {
    return this.apollo.query<LoginResponse>({
      query: LOGIN,
      variables: { username, password },
    }).pipe(
      tap(result => {
        if (result.data.login) {
          localStorage.setItem('token', result.data.login.token); 
          this.isLoggedIn = true;
        }
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: SIGNUP,
      variables: {
        user: {
          username,
          email,
          password
        }
      }
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }
}