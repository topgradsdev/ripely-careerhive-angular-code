import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-email-sent-list',
  templateUrl: './email-sent-list.component.html',
  styleUrls: ['./email-sent-list.component.scss']
})
export class EmailSentListComponent implements OnInit {

  constructor() { }

  emailList: any = [
    {
      checkbox: '',
      email_id: '',
      recipient_name : '',
      recipient_type : '',
      subject: '',
      sent_at: '',
      status: '',
      email: '',
      action: ''
    }
  ];
  ngOnInit(): void {
  }
  displayedColumns: string[] = [
    'checkbox',
    'email_id',
    'recipient_name',
    'recipient_type',
    'subject',
    'sent_at',
    'status',
    'email',
    'actions'
  ];
  dataSource = this.emailList;
  @ViewChild(MatTable) table: MatTable<any>;
  activeFilter = {name: 'FILE_DUE_DATE', value: ''};
  filters = [
    
    { name: "FILE_DUE_DATE", label: "Due Date", selected: false, value: ""},
    { name: "STATUS", label: "Status", selected: false, value: ""},
    { name: "ASSIGNED_TO", label: "Assigned to", selected: false, value: ""},
    { name: "SUBMITED_DATE", label: "Submit Date", selected: false, value: ""},
    
  ];
  applyFilter(filter) {
    this.activeFilter = filter;
  }

  searchForms(){
    
  }
}
