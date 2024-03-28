import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LOGIN, SIGNUP } from './graphql/graphql.queries';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor(private apollo: Apollo) { }

  login(username: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN,
      variables: {
        username,
        password
      }
    });
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
  }
}