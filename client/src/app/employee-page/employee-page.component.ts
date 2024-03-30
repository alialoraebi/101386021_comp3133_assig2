import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { LIST_EMPLOYEES, DELETE_EMPLOYEE } from '../graphql/graphql.queries';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

interface EmployeeData {
  listEmployees: Employee[];
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string
  gender: string;
  salary: number;
  
}

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [
    NavbarComponent, 
    MatTableModule, 
    CommonModule, 
    RouterLink,
    AddEmployeeComponent,
  ],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css'
})

export class EmployeePageComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private apollo: Apollo, private router: Router, public dialog: MatDialog) { } 

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.apollo.watchQuery<EmployeeData>({ query: LIST_EMPLOYEES })
      .valueChanges.subscribe(result => {
        this.employees = result.data && result.data.listEmployees;
      });
  }

  // addEmployee() {
  //   this.router.navigate(['/add-employee']);
  // }

  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '400px',
      height: '700px',
      
      // ... any other configuration you need
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle after the dialog is closed, like refreshing the employee list
      this.getEmployees();
    });
  }

  deleteEmployee(id: string) {
    this.apollo.mutate({ mutation: DELETE_EMPLOYEE, variables: { id } }).subscribe(() => {
      this.getEmployees();
    });
  }

  updateEmployee(id: string) {
    this.router.navigate(['/update-employee', id]);
  }
}