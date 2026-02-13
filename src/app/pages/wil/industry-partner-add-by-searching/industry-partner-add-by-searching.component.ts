import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-industry-partner-add-by-searching',
  templateUrl: './industry-partner-add-by-searching.component.html',
  styleUrls: ['./industry-partner-add-by-searching.component.scss']
})
export class IndustryPartnerAddBySearchingComponent implements OnInit {
  control = new FormControl();
  industryPartnersList: any = []
  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = ['checkbox', 'company_name', 'location', 'abn_acn', 'no_of_employees', 'student_placed', 'placement_groups', 'contact_01_name', 'contact_01_title', 'contact_01_primary_email', 'contact_01_primary_phone', 'contact_02_name', 'contact_02_title', 'contact_02_primary_email', 'contact_02_primary_phone',]
  dataSource: MatTableDataSource<any>;
  @ViewChild('industryTbSort') industryTbSort = new MatSort();

}
