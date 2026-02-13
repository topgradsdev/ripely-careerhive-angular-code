import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpResponseCode } from '../../../shared/enum';
import { TopgradserviceService } from '../../../topgradservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-blacklist-company-import-via-excel',
  templateUrl: './blacklist-company-import-via-excel.component.html',
  styleUrls: ['./blacklist-company-import-via-excel.component.scss']
})
export class BlacklistCompanyImportViaExcelComponent implements OnInit {
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
  companiesList: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'company_name',
    // 'company_code',
    // 'location',
    'abn_acn',
    // 'no_of_employees',
    // 'company_phone',
    // // 'vacancies',
    // 'site_status',
    // 'web_address',
    // 'lead_source',
    // 'conversion_status',
    // 'created_by',
    // 'date_created',
    // 'last_updated_by',
    // 'last_updated',
    // 'last_hcaaf_update',
    // 'hcaaf_expiry',
    // 'student_placed',
    // 'placement_groups',
    // 'contact_01_first_name',
    // 'contact_01_last_name',
    // 'contact_01_title',
    // 'contact_01_primary_email',
    // 'contact_01_secondary_email',
    // 'contact_01_primary_phone',
    // 'contact_01_secondary_phone',
    // 'contact_01_created_by',
    // 'contact_01_created_date',
    // 'contact_01_updated_by',
    // 'contact_01_last_updated',
    // 'contact_02_first_name',
    // 'contact_02_last_name',
    // 'contact_02_title',
    // 'contact_02_primary_email',
    // 'contact_02_secondary_email',
    // 'contact_02_primary_phone',
    // 'contact_02_secondary_phone',
    // 'contact_02_created_by',
    // 'contact_02_created_date',
    // 'contact_02_updated_by',
    // 'contact_02_last_updated',
    // 'contact_03_first_name',
    // 'contact_03_last_name',
    // 'contact_03_title',
    // 'contact_03_primary_email',
    // 'contact_03_secondary_email',
    // 'contact_03_primary_phone',
    // 'contact_03_secondary_phone',
    // 'contact_03_created_by',
    // 'contact_03_created_date',
    // 'contact_03_updated_by',
    // 'contact_03_last_updated',
    // 'whs_check',
    // 'company_concent_to_use_logo',
  ];
  eligiblePartnerListDisplayedColumns: string[] = [
    'company_name',
    // 
    // 
    // 
    // 
    // 'campus',
    'abn_acn',
    'address',
    'suburb',
    'state',
    'postal_code',
    'no_of_employees',
    'vacancies',
    'company_description',
    // 'address',
    // 'suburb',
    // 'state',
    // 'postal_code',
    // 'abn_acn',
    // 'no_of_employees',
    'company_phone',
    'company_alias',
    'company_industry',
    'parent_company',
    'site_status',
    'web_address',
    'lead_source',
    'conversion_status',
    'account_manager',
    'created_by',
    'date_created',
    'last_updated_by',
    'last_updated',
    'hcaaf_status',
    'last_hcaaf_update',
    'student_placed',
    'vacancy_count',
    'prefeered_contact',
    'whs_check',
    'company_concent_to_use_logo',
    // 'company_phone',
    // 'lead_source',
    // 'conversion_status',
    // 'created_by',
    // 'student_placed',
    // 'placement_groups',
    // 'contact_01_first_name',
    // 'contact_01_last_name',
    // 'contact_01_title',
    // 'contact_01_primary_email',
    // 'contact_01_primary_phone',
    // 'contact_02_first_name',
    // 'contact_02_last_name',
    // 'contact_02_title',
    // 'contact_02_primary_email',
    // 'contact_02_primary_phone',
    // 'contact_03_first_name',
    // 'contact_03_last_name',
    // 'contact_03_title',
    // 'contact_03_primary_email',
    // 'contact_03_primary_phone'
  ];
  companyData :any= [
  { company_name: "Test Company 1", abn_acn: "38 094 477 175" },
  { company_name: "Test Company 2", abn_acn: "51 824 753 556" },
  { company_name: "Test Company 3", abn_acn: "88 000 014 675" },
  { company_name: "Test Company 4", abn_acn: "88 000 014 675" },
  { company_name: "Test Company 5", abn_acn: "16 009 661 901" }
];
  dataSource: MatTableDataSource<any>;

  fileName: any;
  file: any;
  @Input() placementGroupId;
  @Output() industryPartnerUpdates = new EventEmitter();
  uploadId = "";

  constructor(
    private service: TopgradserviceService,
    private router: Router
    ) { }
 userDetail:any= null;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.companyData);

    // alert("calling")
     this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
  }

  returnBack() {
    this.industryPartnerUpdates.emit('back');
  }

  getFile(event) {
    this.fileName = event.target.files[0]?.name;
    this.uploadIndustryPartnerByExcel(event);
    event.target.value = "";
  }

  uploadIndustryPartnerByExcel(event) {
    const formData = new FormData();
    formData.append('partners', event.target.files[0]);
    if (this.router.url.indexOf("wil-companies-list") == -1) {
      formData.append('placement_id', this.placementGroupId);
    }

    formData.append('last_updated_by', `${this.userDetail.first_name} ${this.userDetail.last_name}`);
    this.service.uploadblacklistCompnayViaExcel(formData).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({message: response.msg});
      }
      this.uploadId = response?.upload_id;
    }, err => {
      this.fileName = "";
      if (err?.status === 600) {
      //   const element = document.getElementById("errorPopup");
      //  element.click();
        this.service.showMessage({
          message: 'No new data found in the CSV file.'
        });
      } else {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      }
    });
  }

  getUploadedPartnerList() {
    const payload = {
      upload_id: this.uploadId
    };
    this.service.getBlcklistUpldCmpns(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        console.log('Full API Response:', response); // Log the full response for debugging
        this.companiesList = new MatTableDataSource(response.result);
      } else {
        console.error('Error in response:', response);
      }
    }, err => {
      console.error('API Error:', err);
    });
  }
  
   @ViewChild('successConfirm') successConfirm: ModalDirective;

  confirm() {    
    const payload = {
      upload_id: this.uploadId
    }
    this.service.approveUploadedBloacklistCompanies(payload).subscribe((response: any) => {
      this.successConfirm.show();
      // this.industryPartnerUpdates.emit("confirm");
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    });
  }

  closePop(){
    this.successConfirm.hide();
    this.industryPartnerUpdates.emit("confirm")
  }
  
  downloadPartnerTemplate() {
    this.service.downloadBlackListTemplate();
  }

}