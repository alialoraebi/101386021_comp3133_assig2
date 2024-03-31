import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { LIST_EMPLOYEES, DELETE_EMPLOYEE } from '../graphql/graphql.queries';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { UpdateEmployeeComponent } from '../update-employee/update-employee.component';
import { ViewEmployeeComponent } from '../view-employee/view-employee.component';

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
    UpdateEmployeeComponent,
    ViewEmployeeComponent
  ],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css'
})

export class EmployeePageComponent implements OnInit {
  employees: Employee[] = [];
  isEmployeeUpdated = false;
  updateEmployeeError = false;

  constructor(private apollo: Apollo, private router: Router, public dialog: MatDialog) { } 

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.apollo.watchQuery<EmployeeData>({ query: LIST_EMPLOYEES, fetchPolicy: 'network-only' })
      .valueChanges.subscribe(result => {
        this.employees = result?.data?.listEmployees;
      });
  }

  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '450px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEmployees();
      if (result?.status === 'success') {
        console.log('Employee added successfully');
      } else if (result?.status === 'error') {
        console.error('Error adding employee');
      }
    });
  }

  openUpdateEmployeeDialog(employeeId: string): void {
    const dialogRef = this.dialog.open(UpdateEmployeeComponent, {
      width: '450px',
      height: '700px',
      data: { employeeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEmployees();
      if (result?.status === 'success') {
        this.isEmployeeUpdated = true;
        this.updateEmployeeError = false;
      } else if (result?.status === 'error') {
        this.isEmployeeUpdated = false;
        this.updateEmployeeError = true;
      }
    });
  }

  viewEmployee(id: string): void {
    const dialogRef = this.dialog.open(ViewEmployeeComponent, {
      width: '450px',
      height: '500px',
      data: { employeeId: id }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
        update: (cache) => {
          const existingData = cache.readQuery<EmployeeData>({ query: LIST_EMPLOYEES });
      
          if (existingData && existingData.listEmployees) {
            const newEmployees = existingData.listEmployees.filter(employee => employee.id !== id);
            cache.writeQuery({
              query: LIST_EMPLOYEES,
              data: { listEmployees: newEmployees },
            });
          }
        }
      }).subscribe({
        next: response => {
          console.log('Employee deleted successfully:', response);
        },
        error: error => {
          console.error('Error deleting employee:', error);
        }
      });
    } else {
      console.log('Delete operation canceled by user');
    }
  }

  updateEmployee(id: string) {
    this.openUpdateEmployeeDialog(id);
  }
}