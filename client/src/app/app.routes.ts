import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { NgModule } from '@angular/core';
import { AuthGuardService } from './auth-guard.service';
import { ReverseAuthGuardService } from './reverse-auth-guard.service';


export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, canActivate: [ReverseAuthGuardService]},
  { path: 'login', component: LoginComponent, canActivate: [ReverseAuthGuardService]},
  { path: 'employee-page', component: EmployeePageComponent, canActivate: [AuthGuardService]},
  { path: '**', redirectTo: '/employee-page' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }