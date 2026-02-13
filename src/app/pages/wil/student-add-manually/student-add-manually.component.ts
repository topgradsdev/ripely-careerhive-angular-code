import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-student-add-manually',
  templateUrl: './student-add-manually.component.html',
  styleUrls: ['./student-add-manually.component.scss']
})
export class StudentAddManuallyComponent implements OnInit {

  constructor() { }
  eligibleStudentList = [
    {
      name: '',
      last_name: '',
      major: '',
      priority: '',
      status: '',
      workflow: '',
    },
  ]
  eligibleStudentListDisplayedColumns: string[]=['name', 'last_name', 'major', 'priority', 'status', 'workflow']
  dataSource= this.eligibleStudentList;
  @ViewChild(MatTable) table: MatTable<any>;
  addRow(): void {
    this.dataSource.unshift({name: '',
    last_name: '',
    major: '',
    priority: '',
    status: '',
    workflow: '',});   
    this.table.renderRows();
  }
  ngOnInit(): void {
  }

}
