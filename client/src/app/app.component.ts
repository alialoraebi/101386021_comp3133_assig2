import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { LIST_EMPLOYEES } from './graphql/graphql.queries';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HttpClientModule, SignupComponent, LoginComponent,], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private apollo: Apollo){}

  ngOnInit(){
    this.getUsers();
  }

  getUsers() {
    this.apollo.watchQuery({
      query: LIST_EMPLOYEES
    }).valueChanges.subscribe(({data, loading, errors}) => {
      if (loading) {
        console.log('Loading...');
      } else if (errors) {
        console.log('Errors:', errors);
      } else {
        console.log('Data:', data);
      }
    });
  }
}
