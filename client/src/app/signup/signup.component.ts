import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  signup(): void {
    this.authService.signup(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
      },
      error: (error) => {
        console.error('Signup failed:', error);
      }
    });
  }
}
