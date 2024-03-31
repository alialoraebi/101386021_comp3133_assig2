import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UPDATE_EMPLOYEE, GET_EMPLOYEE, LIST_EMPLOYEES } from '../graphql/graphql.queries';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';


interface GetEmployeeResponse {
  getEmployee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    salary: number;
  }
}

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    ReactiveFormsModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
  ],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})

export class UpdateEmployeeComponent implements OnInit {
  updateEmployeeForm!: FormGroup;
  isEmployeeUpdated = false;
  updateEmployeeError = false;
  
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private dialogRef: MatDialogRef<UpdateEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: string }
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployeeData();
  }

  initializeForm(): void {
    this.updateEmployeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]]
    });
  }

  loadEmployeeData(): void {
    this.apollo.watchQuery<GetEmployeeResponse>({
      query: GET_EMPLOYEE,
      variables: { id: this.data.employeeId }
    }).valueChanges.subscribe(result => {
      const employee = result?.data?.getEmployee;
      this.updateEmployeeForm.patchValue({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        salary: employee.salary
      });
    });
  }
  
  onSubmit(): void {
    if (this.updateEmployeeForm.valid) {
      const updatedData = this.updateEmployeeForm.value;
      this.apollo.mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: { id: this.data.employeeId, employee: updatedData },
        refetchQueries: [{ query: LIST_EMPLOYEES }],
      }).subscribe({
        next: response => {
          console.log('Employee updated successfully:', response);
          this.isEmployeeUpdated = true; 
          this.updateEmployeeError = false; 
          this.dialogRef.close();
        },
        error: error => {
          console.error('Error updating employee:', error);
          this.isEmployeeUpdated = false; 
          this.updateEmployeeError = true; 
        }
      });
    }
  }
}
