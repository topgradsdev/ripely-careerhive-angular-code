import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-workflow-track-progress',
  templateUrl: './workflow-track-progress.component.html',
  styleUrls: ['./workflow-track-progress.component.scss']
})
export class WorkflowTrackProgressComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  showCollapes: any = '';
  placementId: any;
  constructor( private activatedRoute: ActivatedRoute, ) { }
  collapsToggle(ids:any) {
    if(this.showCollapes == ids){
      this.showCollapes = '';
    }
    else{
      this.showCollapes = ids
    }
  }
  notStartedLists = [
    {
      checkbox: '',
      student_id: 's3515996',
      name: 'Sarah',
      email: 'sarah@marriott.com',
      status: 'Not Started',
      actions: ''
    },
  ]
  pendingLists = [
    {
      checkbox: '',
      student_id: 's3515996',
      name: 'Sarah',
      email: 'sarah@marriott.com',
      status: 'Not Started',
      file: '',
      actions: ''
    },
  ]
  displayedNotStartedListsColumns: string[] = ['checkbox', 'student_id', 'name',  'email', 'status', 'actions']
  displayedPendingListsColumns: string[] = ['checkbox', 'student_id', 'name',  'email', 'status', 'file', 'actions']
  dataSource: MatTableDataSource<any>;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.placementId = params.get('placement_id'); 
    });
  }


}
