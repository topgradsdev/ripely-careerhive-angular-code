import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-student-search-database',
  templateUrl: './student-search-database.component.html',
  styleUrls: ['./student-search-database.component.scss']
})
export class StudentSearchDatabaseComponent implements OnInit {

  constructor() { }
  eligibleStudentList = [
    {
      name: 'Bob',
      last_name: 'Jode',
      major: 'Bachelor of Civil Engineering',
      studentId: 's3515996',
      // monthlyCohort: '25/02/24',
      campus: 'Parramatta Campus',
      email: 'bobjade@email.com.au',
    },
  ]
  eligibleStudentListDisplayedColumns: string[] = ['name', 'last_name', 'major', 'studentId', 'campus', 'email']
  dataSource: MatTableDataSource<any>;
  ngOnInit(): void {
  }

}
