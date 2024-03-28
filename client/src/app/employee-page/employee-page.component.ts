// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Apollo } from 'apollo-angular';
// import { LIST_EMPLOYEES, DELETE_EMPLOYEE } from '../graphql/graphql.queries';

// @Component({
//   selector: 'app-employee-page',
//   templateUrl: './employee-page.component.html',
//   styleUrl: './employee-page.component.css'
// })
// export class EmployeePageComponent implements OnInit {
//   employees = [];

//   constructor(private apollo: Apollo, private router: Router) { } 

//   ngOnInit() {
//     this.getEmployees();
//   }

//   getEmployees() {
//     this.apollo.watchQuery({ query: LIST_EMPLOYEES }).valueChanges.subscribe(result => {
//       this.employees = result.data && result.data.listEmployees;
//     });
//   }

//   addEmployee() {
//     this.router.navigate(['/add-employee']);
//   }

//   deleteEmployee(id: string) {
//     this.apollo.mutate({ mutation: DELETE_EMPLOYEE, variables: { id } }).subscribe(() => {
//       this.getEmployees();
//     });
//   }

//   updateEmployee(id: string) {
//     this.router.navigate(['/update-employee', id]);
//   }
// }