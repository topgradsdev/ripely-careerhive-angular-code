import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-resume-review',
  templateUrl: './resume-review.component.html',
  styleUrls: ['./resume-review.component.scss']
})
export class ResumeReviewComponent implements OnInit {
  selectedIndex = 1
  constructor() { }
  @ViewChild(MatSort) sort: MatSort;

  resumeInProgressList = [
    {
      name: "Bob",
      lname: "Jade",
      student_id: "012345",
      major: "Master of Engineering",
      totalComments: "5",
      lastComments : "",
      status: '',
      actions: ""
    },
    {
      name: "Bob",
      lname: "Jade",
      student_id: "012345",
      major: "Master of Engineering",
      totalComments: "5",
      lastComments : "",
      status: '',
      actions: ""
    },
   
  ]
  resumeCompletedList = [
    {
      name: "Bob",
      lname: "Jade",
      student_id: "012345",
      major: "Master of Engineering",
      email: "jadedbob@gmail.com",
      commentResolved: '5',
      lastComments : "",
      completed: '',
      actions: ""
    },
  ]

  displayedInprogressColumns: string[] = [ 
  'name', 
  'lname', 
  'student_id', 
  'major',
  'totalComments',
  'lastComments',
  'status',
  'actions',];
  displayedCompletedColumns: string[] = [ 
    'name', 
    'lname', 
    'student_id', 
    'major',
    'email',
    'commentResolved',
    'lastComments',
    'completed',
    'actions',];
  btnTabs(index: number) {
    // return;
    this.selectedIndex = index;
  }
  ngOnInit(): void {
  }

}
