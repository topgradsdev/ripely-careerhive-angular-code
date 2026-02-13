import { Component, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export {};

export interface Counselor {
  id: string;
  name: string;
  lname: string;
  email: string;
  status: boolean;
}
declare global {
   interface Window {
      Calendly: any;
   }
}

@Component({
  selector: 'app-calendly',
  templateUrl: './calendly.component.html',
  styleUrls: ['./calendly.component.scss']
})
export class CalendlyComponent implements OnInit {
  counselorList: Counselor[] = [];
  displayedColumns: string[] = ['id', 'name', 'lname', 'email', 'status'];
  dataSource: MatTableDataSource<Counselor>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalRecords: any;
  topPage: any;

  counselorForm: FormGroup;

  constructor(private service: TopgradserviceService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  //   window.Calendly.initInlineWidget({
  //     url: "https://calendly.com/vaibhav-vjs",
  //     parentElement: document.querySelector('.calendly-inline-widget'),
  //     prefill: {}
  //  });
    this.intializeCounselorForm();
  this.getCounselorList();
  }

  getPageSizeOptions() {
    return [5, 10, 50, 100];
  }

  getCounselorList() {
    const obj = {
      id: "",
      status: ""
    };
    this.service.getCounselor(obj).subscribe((res: any) => {
      this.counselorList = res.data;
    })
  }

  intializeCounselorForm() {
    this.counselorForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
    });
  }

  createCounselor() {
    if(this.counselorForm.invalid){
      this.counselorForm.markAllAsTouched();
      return;
    }

    let obj:any= {
      first_name: this.counselorForm.controls.first_name.value,
      last_name: this.counselorForm.controls.last_name.value,
      email: this.counselorForm.controls.email.value
    }

    this.service.createCounselor(obj).subscribe((res: any) => {
      this.getCounselorList();
      this.service.showMessage({
        message:"Employer account created Successfully"
      });        
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }
}
