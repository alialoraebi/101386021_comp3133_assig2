import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOGIN, SIGNUP, ADD_EMPLOYEE } from './graphql/graphql.queries';

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

  constructor(private apollo: Apollo, private router: Router) { }

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

  addEmployee(first_name: string, last_name: string, email : string, gender: string, salary: number): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
        employee: {
          first_name,
          last_name,
          email,
          gender,
          salary
        }
      }
    });
  }    

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  logout(): void {

    const confirmLogout = confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.router.navigate(['/signup']);
    }
  }
}