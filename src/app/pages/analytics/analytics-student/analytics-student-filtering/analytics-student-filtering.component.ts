import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-analytics-student-filtering',
  templateUrl: './analytics-student-filtering.component.html',
  styleUrls: ['./analytics-student-filtering.component.scss']
})
export class AnalyticsStudentFilteringComponent implements OnInit {
  edit_filter: boolean;
  constructor() { }

  ngOnInit(): void {
  }
  studentList = [
    {
      checkbox: '',
      studentId: '',
      // monthlyCohort: '',
      studentName: '',
      major: '',
      internshipStartDate: '',
      hoursWeek: '',
      docs: '',
      companyName: '',
      actions: ''
    },
  ]
  editFilter(){
    this.edit_filter = !this.edit_filter;
  }
  displayedColumns: string[] = ['checkbox', 'studentId',
   'studentName', 'major', 'internshipStartDate', 'hoursWeek', 'docs', 'companyName', 'actions']
  dataSource: MatTableDataSource<any>;

}
