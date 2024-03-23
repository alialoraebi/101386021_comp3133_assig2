import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  private apiUrl = 'http://localhost:4000/graphql'; 

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const query = {
      query: `{
        login(username: "${username}", password: "${password}") {
          message
          user {
            id
            username
            email
          }
        }
      }`
    };

    return this.http.post(this.apiUrl, query);
  }

  signup(username: string, email: string, password: string): Observable<any> {
    const query = {
      query: `mutation {
        signup(username: "${username}", email: "${email}", password: "${password}") {
          message
          user {
            id
            username
            email
          }
        }
      }`
    };

    return this.http.post(this.apiUrl, query);
  }

  logout() {
    this.isLoggedIn = false;
  }
}