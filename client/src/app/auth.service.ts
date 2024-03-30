import { Router } from '@angular/router';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOGIN, SIGNUP, ADD_EMPLOYEE } from './graphql/graphql.queries';
import { isPlatformBrowser } from '@angular/common';

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

  constructor(
    private apollo: Apollo, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
    ) { 
      if (isPlatformBrowser(this.platformId)) {
        this.isLoggedIn = !!localStorage.getItem('token');
      }
  }

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
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return this.isLoggedIn;
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