import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit {
  Detail: any;

  constructor(private Service: TopgradserviceService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.getReportDetail();
  }

  getReportDetail(){
    var obj ={
      id:this.route.snapshot.paramMap.get('id')
    }
    this.Service.ReportsDetail(obj).subscribe(data => {
      console.log("applications report detail is ====>", data)
      this.Detail=data.data[0];
      console.log("details========>>>",this.Detail);
      
    })
  }

  navigate(){
    this.location.back();
  }

}
