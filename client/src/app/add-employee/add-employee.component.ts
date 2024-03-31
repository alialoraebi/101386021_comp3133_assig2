import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { ADD_EMPLOYEE, LIST_EMPLOYEES } from '../graphql/graphql.queries';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm!: FormGroup;
  isEmployeeAdded = false;
  addEmployeeError = false; 

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private dialogRef: MatDialogRef<AddEmployeeComponent> 
  ) {}

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]]
    });
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      const employeeData = this.addEmployeeForm.value;
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: { employee: employeeData },
        refetchQueries: [{ query: LIST_EMPLOYEES }],
      }).subscribe({
        next: (response) => {
          console.log('Employee added successfully:', response);
          this.isEmployeeAdded = true;
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          this.addEmployeeError = true;
        }
      });
    }
  }
}
