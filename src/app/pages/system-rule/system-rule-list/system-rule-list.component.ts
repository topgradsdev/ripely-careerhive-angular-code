import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import {HttpResponseCode, PlacementGroupStatus} from '../../../shared/enum';
import { Utils } from '../../../shared/utility';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RulesService } from 'src/app/services/rules.service';
@Component({
  selector: 'app-system-rule-list',
  templateUrl: './system-rule-list.component.html',
  styleUrls: ['./system-rule-list.component.scss']
})

export class SystemRuleListComponent implements OnInit {
  
  @ViewChild('removeCompany') removeCompany: ModalDirective;
  @ViewChild('removeCompanySuccess') removeCompanySuccess: ModalDirective;
  search = '';
  selectedRule:any = null;

  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }
  limitOffset = {
    limit: this.paginationObj.pageSize,
    offset: this.paginationObj.pageIndex
  }

  constructor(private service: TopgradserviceService, public utils: Utils, private rulesService: RulesService) { }


  get hasPendingData(): boolean {
    return this.systemRules?.some(item => item?.pending_data > 0) ?? false;
  }
  ngOnInit(): void {
    this.loadRules();
    // this.createPlacementGroup = new FormGroup({
    //   background: new FormControl('', []),
    //   title: new FormControl('', [Validators.required]),
    //   code: new FormControl('', Validators.required),
    //   description: new FormControl('', Validators.nullValidator),
    //   category_id: new FormControl('', Validators.required),
    //   industry_id: new FormControl('', Validators.required),
    //   staff_id: new FormControl('', Validators.required),
    //   // start_date: new FormControl(''),
    //   // end_date: new FormControl('')
    // });
    // this.confirmPassword = new FormGroup({
    //   password: new FormControl('', [Validators.required])
    // });
    // this.getPlacementGroupsCount();
    // this.getPlacementGroups(this.placementGroupStatus);
    // this.getPlacementCategories();
    // this.getPlacementIndustries();
    // this.getStaffMembers();
  }

  cleardata(){
this.paginationObj.pageIndex=0;
      this.originalSystemRules = [];
      this.systemRules =[];
  }
  loadRules() {
    // this.systemRules = this.rulesService.getAll();
    // this.originalSystemRules = [...this.systemRules];

    let payload = {
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex
    }
    if(this.search){
      payload['search'] = this.search;
    }
    // this.loader.show();
    this.service.getPurgePolicy(payload).subscribe(async(response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        // if(this.search){
        //    this.systemRules = [...response.data];
        // }else{
          
        // }

          const newData = response.data || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.systemRules.some(s => s._id === student._id)
        );
         this.systemRules = [...this.systemRules, ...filteredData];
       
        this.originalSystemRules = [...this.systemRules];
        this.paginationObj.length = response.count;
      } else {
        this.systemRules = [];
        this.originalSystemRules = [];
          // this.loader.hide();
      }
    },(err)=>{
      this.systemRules = [];
      this.originalSystemRules = [];
    })
  }

  
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';
    return `${first}${second}`;
  }
  
  displayedSystemRuleColumns: string[] = [ 
    'name', 
    'user_type', 
    'cycle_period', 
    'condition',
    'pending_data',
    'created_by',
    'actions'
  ];


  systemRules:any = [
  // {
  //   "_id": 1,
  //   "name": "Inactive Student Deletion 1",
  //   "target": "Students",
  //   "duration": "2 Years",
  //   "condition": "Years of Inactivity",
  //   "value": 0,
  //   "created_by": "Adi Baskara",
  //   "created_date": "24 June 2025"
  // },
  // {
  //   "_id": 2,
  //   "name": "Inactive Company Deletion",
  //   "target": "Companies",
  //   "duration": "3 Months",
  //   "condition": "Months of Inactivity",
  //   "value": 0,
  //   "created_by": "Adi Baskara",
  //   "created_date": "24 June 2025"
  // },
  // {
  //   "_id": 3,
  //   "name": "Blacklisted Companies 3 Months",
  //   "target": "Companies",
  //   "duration": "3 Months",
  //   "condition": "Months of Inactivity",
  //   "value": 0,
  //   "created_by": "Adi Baskara",
  //   "created_date": "24 June 2025"
  // },
  // {
  //   "_id": 4,
  //   "name": "Test Rule",
  //   "target": "Companies",
  //   "duration": "1 Year",
  //   "condition": "Years after being Blacklisted",
  //   "value": 0,
  //   "created_by": "Adi Baskara",
  //   "created_date": "24 June 2025"
  // },
  // {
  //   "_id": 5,
  //   "name": "Postgraduates 2 years",
  //   "target": "Students",
  //   "duration": "2 Years",
  //   "condition": "Months of Inactivity",
  //   "value": 0,
  //   "created_by": "Adi Baskara",
  //   "created_date": "24 June 2025"
  // }
];


originalSystemRules = []; // keep original data

applyFilter(event: Event | string) {
  const filterValue = typeof event === 'string'
    ? event
    : (event.target as HTMLInputElement).value;

  this.search = filterValue.trim().toLowerCase();

  this.systemRules = this.originalSystemRules.filter(rule =>
    Object.values(rule).some(val =>
      String(val).toLowerCase().includes(this.search)
    )
  );
}


removeRule(){
    // this.rulesService.delete(this.selectedRule?._id);
    this.service.deletePurgePolicy({_id:this.selectedRule?._id}).subscribe(async(response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.removeCompany.hide();
        this.removeCompanySuccess.show();
        this.cleardata();
        this.loadRules();
      } else {
        this.systemRules = [];
        this.originalSystemRules = [];
          // this.loader.hide();
      }
    },(err)=>{
      this.systemRules = [];
      this.originalSystemRules = [];
    })

   
  
}

 onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.originalSystemRules.length)
    if(this.paginationObj.length<10)return;
     if (this.originalSystemRules?.length >= this.paginationObj.length) return;
      // alert("calling")
      // Simulate pagination event object
      const nextPageEvent = {
        pageIndex: this.paginationObj?.pageIndex + 1 || 0,
        pageSize: this.paginationObj?.pageSize || 20,
        length: this.paginationObj?.length || 0
      };

      // Call your existing pagination logic
      this.getPaginationData(nextPageEvent);
    // }


    // this.loading = false;
  }

   getPaginationData(event) {
    this.paginationObj = event;

    this.loadRules();
    
  }


}
