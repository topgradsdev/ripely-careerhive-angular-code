import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { Location } from '@angular/common';
// import { PlacementEligibleStudentsComponent } from '../placement-eligible-students/placement-eligible-students.component';
// import { PlacementsTabComponent } from '../placements-tab/placements-tab.component';

@Component({
  selector: 'app-system-rule-detail',
  templateUrl: './system-rule-details.component.html',
  styleUrls: ['./system-rule-details.component.scss']
})
export class SystemRuleDetailComponent implements OnInit {
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
  statusClass = [
    { type: 'Placed', class: 'green' },
    { type: 'Interviewed', class: 'yellow' },
    { type: 'Interviewing', class: 'yellow' },
    { type: 'Shortlisted', class: 'pink' },
    { type: 'Rejected', class: 'red' },
    { type: 'In Progress', class: 'yellow' },
    { type: 'Not Placed', class: 'pink' },
    { type: 'Conditional Approval', class: 'yellow' },
    { type: 'Deferred', class: 'red' },
    { type: 'Inactive', class: 'red' }
  ];

  priorityClass = [
    { type: 'Low', class: 'pink' },
    { type: 'Medium', class: 'yellow' },
    { type: 'High', class: 'red' },
  ]
  search:any = "";
  systemRules:any = [];
  displayColumns:any =  [];
  companyColumns:any =[];
 
     columns = [
     { name: 'icon_alumi', visible: true },
     // { name: 'checkbox', visible: true },
     // { name: 'student_id', visible: true },
     { name: 'student_code', visible: true },
     { name: 'full_name', visible: true },
     { name: 'first_name', visible: true },
     { name: 'middle_name', visible: true },
     { name: 'last_name', visible: true },
     { name: 'preferred_name', visible: true },
     { name: 'username', visible: true },
     { name: 'phone_no', visible: true },
     { name: 'advocate_care_history', visible: true },
     { name: 'degree_level', visible: true },
     { name: 'majors', visible: true },
     { name: 'class_level', visible: true },
     { name: 'minors', visible: true },
     { name: 'gpa', visible: true },
     { name: 'credit_points', visible: true },
     { name: 'unit_name', visible: true },
     { name: 'unit_code', visible: true },
     { name: 'delivery_mode', visible: true },
     { name: 'work_authorization', visible: true },
     { name: 'program_type', visible: true },
     { name: 'applicant_type', visible: true },
     { name: 'geographic_preferences', visible: true },
     { name: 'affiliations', visible: true },
     { name: 'assignedTo', visible: true },
     { name: 'priority', visible: true },
     { name: 'status', visible: true },
     { name: 'placement_group', visible: true },
     { name: 'cohort_start_date', visible: true },
     { name: 'cohort_end_date', visible: true },
     { name: 'certificates', visible: true },  
     { name: 'home_campus', visible: true },
     { name: 'resume_level', visible: true },
     { name: 'placement_doc_status', visible: true },
     { name: 'primaryEmail', visible: true },
     { name: 'permanent_email', visible: true },
     { name: 'gender', visible: true },
     { name: 'date_of_birth', visible: true },
     { name: 'course_code', visible: true },
     { name: 'graduation_date', visible: true },
     { name: 'course_name', visible: true },
     { name: 'address', visible: true },
     { name: 'nationality', visible: true },
     { name: 'addressLine1', visible: true },
     { name: 'suburb', visible: true },
     { name: 'state', visible: true },
     { name: 'postcode', visible: true },
     { name: 'country', visible: true },
     { name: 'mobile', visible: true },
     { name: 'permanentAddress', visible: true },
     { name: 'permanent_suburb', visible: true },
     { name: 'permanent_state', visible: true },
     { name: 'permanent_country', visible: true },
     { name: 'language_proficiencies', visible: true },
     { name: 'rights', visible: true },
     { name: 'internship_start_date', visible: true },
     { name: 'internship_end_date', visible: true },
     { name: 'semester_name', visible: true },
     { name: 'year', visible: true },
     { name: 'alum', visible: true },
     { name: 'advocate_incident_history', visible: true },
     { name: 'accommodate_accessibility', visible: true },
     { name: 'ABN', visible: true },
     { name: 'last_login', visible: true },
     { name: 'lastupdatedby', visible: true },
     { name: 'lastupdate', visible: true },
     // { name: 'actions', visible: true }
   ];
 
   dropDownColumns = [
     // { name: 'checkbox', visible: true },
     // { name: 'student_id', visible: true },
     // { name: 'student_code', visible: true },
     // { name: 'full_name', visible: true },
     { name: 'first_name', visible: true },
     { name: 'middle_name', visible: true },
     { name: 'last_name', visible: true },
     { name: 'preferred_name', visible: true },
     { name: 'username', visible: true },
     { name: 'phone_no', visible: true },
     { name: 'advocate_care_history', visible: true },
     { name: 'degree_level', visible: true },
     { name: 'majors', visible: true },
     { name: 'class_level', visible: true },
     { name: 'minors', visible: true },
     { name: 'gpa', visible: true },
     { name: 'credit_points', visible: true },
     { name: 'unit_name', visible: true },
     { name: 'unit_code', visible: true },
     { name: 'delivery_mode', visible: true },
     { name: 'work_authorization', visible: true },
     { name: 'program_type', visible: true },
     { name: 'applicant_type', visible: true },
     { name: 'geographic_preferences', visible: true },
     { name: 'affiliations', visible: true },
     { name: 'assignedTo', visible: true },
     { name: 'priority', visible: true },
     { name: 'status', visible: true },
     { name: 'placement_group', visible: true },
     { name: 'cohort_start_date', visible: true },
     { name: 'cohort_end_date', visible: true },
     { name: 'certificates', visible: true },  
     { name: 'home_campus', visible: true },
     { name: 'resume_level', visible: true },
     { name: 'placement_doc_status', visible: true },
     { name: 'primaryEmail', visible: true },
     { name: 'permanent_email', visible: true },
     { name: 'gender', visible: true },
     { name: 'date_of_birth', visible: true },
     { name: 'course_code', visible: true },
     { name: 'graduation_date', visible: true },
     { name: 'course_name', visible: true },
     { name: 'address', visible: true },
     { name: 'nationality', visible: true },
     { name: 'addressLine1', visible: true },
     { name: 'suburb', visible: true },
     { name: 'state', visible: true },
     { name: 'postcode', visible: true },
     { name: 'country', visible: true },
     { name: 'mobile', visible: true },
     { name: 'permanentAddress', visible: true },
     { name: 'permanent_suburb', visible: true },
     { name: 'permanent_state', visible: true },
     { name: 'permanent_country', visible: true },
     { name: 'language_proficiencies', visible: true },
     { name: 'rights', visible: true },
     { name: 'internship_start_date', visible: true },
     { name: 'internship_end_date', visible: true },
     { name: 'semester_name', visible: true },
     { name: 'year', visible: true },
     { name: 'alum', visible: true },
     { name: 'advocate_incident_history', visible: true },
     { name: 'accommodate_accessibility', visible: true },
     { name: 'ABN', visible: true },
     { name: 'last_login', visible: true },
     { name: 'lastupdatedby', visible: true },
     { name: 'lastupdate', visible: true },
     // { name: 'actions', visible: true }
   ]
 
 
    displayedColumns: string[] = [
     // 'type_company',
     // 'checkbox',
     'company_name',
     'vacancies',
     'company_description',
     'address',
     'suburb',
     'state',
     'postal_code',
     'abn_acn',
     'no_of_employees',
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
     // 'actions'
 
 
     // 'company_code',
     // 'email',
     // 'location',
     // 'company_label',
     // 'company_type',
     // 'lead_source',
     // 'company_tax_id',
     // 'hcaaf_expiry',
     
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
     
   ]
 
  displayedCompanyVacanciesColumns: string[] = ['no', 'name', 'vacancy_type', 'allocated', 'placed'];
  displayedPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']
  displayedCompanyPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']
  displayedCompanyPreferredColumns: string[] = ['contact_name', 'department', 'title', 'primary_email', 'primary_phone']

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: TopgradserviceService, private location : Location) {
  }
  id:any = null;
  type:any = null;
  userDetail:any = null;
  ngOnInit(){
     this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
     this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.type = params.get('type');
      if(this.type == "Students"){
        this.getColumnStudents();
      }else{
        this.getCompanyColumnStudents();
      }
      this.loadData();
    });
  }

  ngAfterViewInit() {
    //  this.getColumnStudents();
    //  this.getCompanyColumnStudents();
    //  this.loadDisplayColumnsFromLocalStorage();
    // this.prepareDisplayColumnFilter();
  }

  getColumnStudents() {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail') || '{}');
    
    const payload = {
      type: 'student',
      created_by: this.userDetail._id
    };

    console.log("payload", payload);

    this.service.getColumnStudents(payload).subscribe(
      (response: any) => {
        if (response.status === HttpResponseCode.SUCCESS) {
          if (response.data && response.data.columns) {
            // Remove "actions" column cleanly
            this.displayColumns = response.data || response.data.columns.filter((col: string) => col !== 'actions' && col !== 'checkbox');

            // Update visibility flags in columns array
            this.columns.forEach(col => {
              col.visible = this.displayColumns.includes(col.name);
            });
          } else {
            this.showDisplayedColumns();
          }
        } else {
          this.showDisplayedColumns();
        }
      },
      (err) => {
        console.log("error", err);
        this.showDisplayedColumns();
      }
    );
  }

  
  showDisplayedColumns(){
    this.displayColumns = this.columns
    .filter(col => col.visible)
    .map(col => col.name);
// this.saveStudentColumn(this.displayColumns);
    // console.log('this.displayColumns', this.displayColumns)
}


  getClassNames(studentStatus) {
    let className = 'custom_dorp_select ';
    const stsClass = this.statusClass.find(status => status.type === studentStatus);
    if (stsClass) {
      return `${className} ${stsClass.class}`;
    }
  }

  getPriorityClassNames(studentPriority) {
    let className = 'custom_dorp_select ';
    const priorityClass = this.priorityClass.find(priority => priority.type === studentPriority);
    if (priorityClass) {
      return `${className} ${priorityClass.class}`;
    }
  }

  getStatusClassNames(studentPriority) {
    let className = 'custom_dorp_select ';
    const priorityClass = this.priorityClass.find(priority => priority.type === studentPriority);
    if (priorityClass) {
      return `${className} ${priorityClass.class}`;
    }
  }

 getFirstLetter(assignedTo) {
    if (assignedTo) {
      let split = assignedTo.split(' ');
      let firstName = split[0];
      let lastName = split[1];
      return `${firstName.charAt(0)} ${lastName.charAt(0)}`;
    }
  }

 getCompanyColumnStudents() {
  this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
  const payload = {
    type: 'company',
    created_by: this.userDetail._id
  };

  this.service.getColumnStudents(payload).subscribe(
    (response: any) => {
      if (response.status === HttpResponseCode.SUCCESS) {
        if (response.data && response.data.columns) {
          // Remove "actions" column
          this.displayedColumns = response.data.columns.filter((col: string) => col !== 'actions'  && col !== 'checkbox');
          console.log("this.displayedColumns", this.displayedColumns)
          this.displayedColumns.forEach((col:any) => {
            if( col !== 'actions'){
               col.visible = this.displayedColumns.includes(col);
            }
           
          });
          // Update visibility in columns array
          // this.companyColumns.forEach(col => {
          //   col.visible = this.displayedColumns.includes(col.name);
          // });
        } else {
          this.showDisplayedColumnsC();
        }
      } else {
        this.showDisplayedColumnsC();
      }
    },
    (err) => {
      console.error("Error:", err);
      this.showDisplayedColumnsC();
    }
  );
}

   showDisplayedColumnsC(){
    this.displayedColumns = this.columns
    .filter(col => col.visible)
    .map(col => col.name);
// this.saveStudentColumn(this.displayColumns);
    // console.log('this.displayColumns', this.displayColumns)
}
    
 


  loadData(){
    let payload = {
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex,
      _id:this.id
    }
    if(this.search){
      payload['search'] = this.search;
    }
    // this.loader.show();
    this.service.getPurgePolicyPendingData(payload).subscribe(async(response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.systemRules = response.data;
        this.paginationObj.length = response.totalCount || (response?.data?.length ?? 0);
      } else {
        this.systemRules = [];
      }
    },(err)=>{
      this.systemRules = [];
    })
  }


    // filter:boolean = true;
  getPaginationData(event) {
    this.paginationObj = event;
    this.loadData();
  }
  
  goBack(){
    this.location.back();
  }
company:any = null;
  companyVacancies:any = [];
    getCompanyVacancies(company) {
      this.companyVacancies = [];
      let payload = {
        company_id: company._id
      }
      this.company = company;
      this.service.getCompanyVacancies(payload).subscribe((res: any) => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.companyVacancies = res.result;
        } else {
          this.companyVacancies = [];
        }
      })
    }
  
    companyPlacementGroup:any = [];
  getCompanyPlacementGroup(company) {
    this.companyPlacementGroup = [];
    let payload = {
      company_id: company._id
    }
    this.company = company;
    this.service.getCompanyPlacementGroup(payload).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        console.log("this.companyPlacementGroup", this.companyPlacementGroup);
        this.companyPlacementGroup = res.result;
      } else {
        this.companyPlacementGroup = [];
      }
    })
  }

  companyPreferredContact:any = [];
  getCompanyPreferredContact(company) {
    this.companyPlacementGroup = [];
    let payload = {
      company_id: company._id
    }
    this.company = company;
    this.service.getCompanyPreferredContact(payload).subscribe((res: any) => {
      if (res.code == HttpResponseCode.SUCCESS) {
        console.log("this.companyPreferredContact", this.companyPreferredContact);
        this.companyPreferredContact = res.result;
      } else {
        this.companyPreferredContact = [];
      }
    })
  }

  viewProfile(student) {
    this.router.navigate(['/admin/wil/view-student-profile'], { queryParams: { id: student._id } });
  }

   goToCompanyProfile(company) {
    this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: company._id } });
  }

    //  displayedStudentPGColumns: string[] = ['code', 'title', 'industry', 'category', 'published', 'student', 'placement_type']
    displayedStudentPGColumns: string[] = ['code', 'title', 'placement_type', 'category']
  
  selectedStudents:any = {};
    studentPGs:any = [];
      getStudentPG(student) {
        this.studentPGs = [];
        let payload = {
          student_id: student._id
        }
        this.selectedStudents = student;
        this.service.getStudentPGs(payload).subscribe((res: any) => {
          if (res.status == HttpResponseCode.SUCCESS) {
            this.studentPGs = res.result;
          } else {
            this.studentPGs = [];
          }
        })
      }

}
