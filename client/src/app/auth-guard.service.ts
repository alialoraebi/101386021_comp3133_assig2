import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    if (!this.authService.isLoggedIn) { 
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
