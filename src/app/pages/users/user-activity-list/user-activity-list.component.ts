import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-activity-list',
  templateUrl: './user-activity-list.component.html',
  styleUrls: ['./user-activity-list.component.scss']
})
export class UserActivityListComponent implements OnInit {
  activityList = [
    {
      activity: "User logged out",
      date: "05/08/23",
      time: "10:12 AM",
    },
    {
      activity: "User logged out",
      date: "05/08/23",
      time: "10:12 AM",
    }
  ]
  displayedColumns: string[] = ['activity', 'date', 'time']
  dataSource: MatTableDataSource<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
