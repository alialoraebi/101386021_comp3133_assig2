import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GET_EMPLOYEE } from '../graphql/graphql.queries';

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
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  employee: GetEmployeeResponse['getEmployee'] | null = null;


  constructor(
    private apollo: Apollo,
    private dialogRef: MatDialogRef<ViewEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: string }
  ) {}

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.apollo.watchQuery<GetEmployeeResponse>({
      query: GET_EMPLOYEE,
      variables: { id: this.data.employeeId }
    }).valueChanges.subscribe(result => {
      this.employee = result?.data?.getEmployee;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}