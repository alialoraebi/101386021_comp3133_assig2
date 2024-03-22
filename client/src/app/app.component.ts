import { Component } from '@angular/core';
import { ApolloClientService } from '../../apollo-client.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavbarComponent]
})
export class AppComponent {
    constructor(private apolloClientService: ApolloClientService) { }

    public isLoggedIn(): boolean {
        return true;
    }
}
