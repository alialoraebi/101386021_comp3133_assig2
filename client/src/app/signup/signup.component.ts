import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatInputModule, MatFormFieldModule, MatButtonModule, NavbarComponent, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isSignupSuccessful = false;
  userExists = false; 

  constructor(private authService: AuthService, private fb: FormBuilder) { 
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  signup(): void {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      this.authService.signup(username, email, password).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          this.isSignupSuccessful = true; 
        },
        error: (error) => {
          console.error('Signup failed:', error);
          console.log('Error object:', error); 
          if (error.message.includes('Username already exists')) { 
            this.userExists = true;
          }
        }
      });
    }
  }
}
