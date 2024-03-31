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
    this.router.navigate(['/update-employee', id]);
  }
}