import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { getUsers } from './graphql.operations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HttpClientModule], 
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
      query: getUsers
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
