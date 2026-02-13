import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HttpResponseCode } from '../../../shared/enum';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';

@Component({
  selector: 'app-company-incident-reporting-list',
  templateUrl: './company-incident-reporting-list.component.html',
  styleUrls: ['./company-incident-reporting-list.component.scss']
})

export class CompanyIncidentReportingListComponent implements AfterViewInit {
  userForm: FormGroup;
  activeFilter: string = null;
  currentNotes: any = 'empty'
  @ViewChild('closeCreatePlacementModal') closeCreatePlacementModal;
  @ViewChild('closeResendOTPEmailStudentModal') closeResendOTPEmailStudentModal;
  @ViewChild('closeResendOTPEmailStudentBulkModal') closeResendOTPEmailStudentBulkModal;
  
  @ViewChild('reminderToStaffDone') reminderToStaffDone: ModalDirective;
  @ViewChild('successSendBulkEmail') successSendBulkEmail: ModalDirective;
  

  @ViewChild('closeReminderModal') closeReminderModal
  @ViewChild('closeNoteModal') closeNoteModal;
  @ViewChild('closeConfirmDeleteModal') closeConfirmDeleteModal;


  // { name: 'Placement Groups', field: 'placementGroups', selected: false },
  // { name: 'Major', field: 'major', selected: false },
  // { name: 'Priority', field: 'priority', selected: false },
  // { name: 'Status', field: 'status', selected: false },
  // { name: 'assigned_to', field: 'assigned_to', selected: false },
  // { name: 'Location', field: 'post_code', selected: false },
  // { name: 'course_start_date', field: 'course_start_date', selected: false },
  // { name: 'course_end_date', field: 'course_end_date', selected: false },
  // { name: 'school', field: 'school', selected: false },
  // { name: 'Campus', field: 'campus', selected: false },
  // { name: 'Resume Level', field: 'resume_level', selected: false },
  // { name: 'internship_start_date', field: 'internship_start_date', selected: false },
  // { name: 'internship_end_date', field: 'internship_end_date', selected: false },
  // { name: 'Placement Doc Status', field: 'placement_doc_received', selected: false },
  // { name: 'Course Code', field: 'course_code', selected: false },
  
  
  asignNextStep: boolean;
  filters = [
    { name: 'Assigned To', field: 'assigned', selected: false },
    { name: 'start date', field: 'internship_start_date', selected: false },
    { name: 'end date', field: 'internship_end_date', selected: false },
    // { name: 'Supervisor', field: 'supervisor', selected: false },
  ];
  displayColumns: string[];
  columns = [
    // { name: 'checkbox', visible: true },
    
  ];
  addStudentToPlacementColumn = ['first_name', 'last_name', 'primary_email'];
  
  dataSource: any;
  columnRows = [];
  asignNextSteps() {
    this.asignNextStep = !this.asignNextStep
  }
  overAllCount = {
    eligibleStudent: null,
    pendingApproval: null,
    pendingPlacement: null,
    placed: null,
    terminated:null,
  }

  @ViewChild(MatSort) sort: MatSort;

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

  eligibleStudentList: any;
  addStudentList: any;
  isAddNewStudent = false;
  selectedStudent: any;
  staffForm: FormGroup;

  reminderForm: FormGroup;
  partnerForm: FormGroup;
  placementTypeForm: FormGroup;
  staffList = [
    // {
    //   _id: 111,
    //   name: "Bob Harrison",
    //   designation: "Placement Coordinator"
    // },
    // {
    //   _id: 111,
    //   name: "Ciela Jones",
    //   designation: "Admin"
    // }
  ];
  placementTypes = [

  ]
  selectedRecords = [];

  filterParameters = {
    assigned: [],
    // supervisor: [],
    internship_start_sdate: null,
    internship_start_edate: null
    ,internship_end_sdate: null,
    internship_end_edate: null
  }

  searchCriteria = {
    keywords: null
  }

  selectedStudentsCanAddToPlacementGroup = [];

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
  isCheck = false;
  selectAllStdnt: any;
  @ViewChild('studentTbSort') studentTbSort = new MatSort();
  studentFilters = null;
  placementGroups = [];
  placemenGroupIds = [];
  selectedPlacementGroupToAdd: any = {};

  @ViewChild('allStudentAddPopUp') allStudentAddPopUp;
  @ViewChild('partialStudentAddPopup') partialStudentAddPopup;
  @ViewChild('noStudentsAddPopUp') noStudentsAddPopUp;

  vacancyStudentDetail = [];
  studentVacancyColumns = ['company_name', 'state', 'job_title', 'status'];

  selectedIndex = 1;

  constructor(private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router, private location: Location, private activatedRoute: ActivatedRoute) {
    this.userForm = fb.group({});
  }
  type:any= '';
  companyId:any = '';
  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params.company_id) {
        this.companyId = params.company_id;
        this.type = params.type;
        this.getEmployerProfile();
        this.getEligibleStudents();
        this.studentFilterOptions();
      }
    });
    this.getStaffMembers();
  }

  employerProfile:any = {};
  getEmployerProfile() {
    const payload = {
      _id: this.companyId
    }
    this.service.getEmployerProfile(payload).subscribe(response => {
      this.employerProfile = response.record;
      console.log("this.employerProfile", this.employerProfile);
      // this.basicProfileForm.patchValue(response.record);
    });
  }
  btnTabs(index: number) {
    this.selectedIndex = index;
     this.eligibleStudentList.data = [];
     this.studentList = [];
    this.getEligibleStudents();
  //   this.filterApply = false;
  //   this.filters.forEach(el=>{
  //     if(el.selected){
  //       el.selected =false
  //     }
  //     if (el.field) {
  //       if(el.field === 'internship_start_date'){
  //         this.filterParameters.internship_start_sdate = null
  //         this.filterParameters.internship_start_edate = null
  //       }else if(el.field === 'internship_end_date'){
  //         this.filterParameters.internship_end_sdate = null
  //         this.filterParameters.internship_end_edate = null
  //       }else{
  //         this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
  //       }
  //     }
  //   })
  }

  

  getStaffMembers() {
    this.service.getStaffMembers({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffList = response.result;
      }
    })
  }

  studentFilterOptions() {
    this.service.companystudentFilterOptions({company_id:this.companyId}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentFilters = response.result;
        console.log("this.studentFilters", this.studentFilters);
      }
    })
  }
  status:any = '';

  callApi(s){
    this.status = s;
    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }
      if (el.field) {
        if(el.field === 'internship_start_date'){
          this.filterParameters.internship_start_sdate = null
          this.filterParameters.internship_start_edate = null
        }else if(el.field === 'internship_end_date'){
          this.filterParameters.internship_end_sdate = null
          this.filterParameters.internship_end_edate = null
        }else{
          this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
        }
      }
    })
    
    this.getEligibleStudents();
  }

  handleCancel() {
    // this.resetCheckBox();
    // Handle cancel action
  }

  handleSend() {
    this.resetCheckBox();
    // Handle send action
  }

  resetCheckBox(){
    this.eligibleStudentList?.data.map(student => {
      student.selected = false;
    })
    this.isCheck = false;
    this.selectedRecords = [];
  }

  filterCount:any = 0;
  studentList:any = [];
  // async getEligibleStudents() {
  //   const payload = {
  //     _id:this.companyId,
  //     limit: this.paginationObj.pageSize,
  //     // student_filter:this.status,
  //     offset: this.paginationObj.pageIndex,
  //     currently_placed: this.selectedIndex === 1 ? false : true
  //   }

  //   if(this.searchCriteria.keywords){
  //     payload['search'] = this.searchCriteria.keywords;
  //   }

  //   if(this.filters && this.filters.length){
  //     let previousFilterList = [...this.filterList];
  //           this.filterList = [];
  //           let isValid = true;
  //           await this.filters.forEach(async(filter) => {
  //             // let value = this.filterParameters[filter.field];
            
  //           if (filter.selected) {
  //               this.filterList.push(filter.name);
  //               console.log(this.filterList);
  //               // Handle date fields
  //               if (filter.field === 'internship_start_date') {
  //                   Object.assign(payload, {
  //                       internship_start_sdate: moment(this.filterParameters.internship_start_sdate).format("DD/MM/YYYY"),
  //                       internship_start_edate: moment(this.filterParameters.internship_start_edate).format("DD/MM/YYYY"),
  //                   });
  //               } else if (filter.field === 'internship_end_date') {
  //                   Object.assign(payload, {
  //                       internship_end_sdate: moment(this.filterParameters.internship_end_sdate).format("DD/MM/YYYY"),
  //                       internship_end_edate: moment(this.filterParameters.internship_end_edate).format("DD/MM/YYYY"),
  //                   });
  //               } else {
  //                 this.filterParameters[filter.field]
  //                   // Handle other fields
  //                   let value =  this.filterParameters[filter.field];
  //                   Object.assign(payload, { [filter.field]: value});

  //                   console.log("payloadpayload", payload, filter.field,  this.filterParameters[filter.field]);
  //               }
  //           } else {
  //               // Validate filter parameters
  //             await Object.entries(this.filterParameters).forEach(async([key, value]) => {
  //                   if (value) {
                    
  //                     let find = await this.filters.find(el=>el.field==key);
                    
  //                     if(find){
  //                       if (Array.isArray(value) && value.length > 0 && !find.selected) {
  //                         console.log(key, value); 
  //                         this.service.showMessage({
  //                             message: "Please select the checkbox for filter parameters.",
  //                         });
  //                         isValid = false;
  //                         return true;
  //                     } else if (typeof value === "object" && Object.keys(value).length > 0 && !find.selected) {
  //                         this.service.showMessage({
  //                             message: "Please select the checkbox for filter parameters.",
  //                         });
  //                         isValid = false;
  //                         return true;
  //                     } else if (typeof value !== "object" && typeof value !== "function" && !find.selected) {
  //                         this.service.showMessage({
  //                             message: "Please select the checkbox for filter parameters.",
  //                         });
  //                         isValid = false;
  //                         return true;
  //                     }
  //                     }

                      
  //                   }
  //               });
  //           }
            
            
  //         });
  //           // Stop execution if validation fails
  //           if (await !isValid) {
  //             return;
  //           }
            
  //           if (JSON.stringify(previousFilterList) !== JSON.stringify(this.filterList)) {
  //               this.paginationObj = {
  //                         length: 0,
  //                         pageIndex: this.paginationObj.pageIndex,
  //                         pageSize: this.paginationObj.pageSize,
  //                         previousPageIndex: 0,
  //                         changed: true,
  //                     };
  //                 } else {
  //                     console.log("Filter list unchanged, skipping pagination reset.");
  //                 }
                    
  //         await this.closeFilterModal.ripple.trigger.click();
  //       }

  //   this.service.getCompnaystudentList(payload).subscribe(async(response: any) => {
  //     if (response.code == HttpResponseCode.SUCCESS) {
  //       this.paginationObj.length =await response.count?response.count:response.data;
  //       console.log("response", response);
  //       this.studentList =await response.data;
  //       this.eligibleStudentList =await new MatTableDataSource(response.data);
  //       await this.eligibleStudentList?.data.forEach(student => {
  //         student.selected = false;
  //       })
  //       this.eligibleStudentList.sort =await this.studentTbSort;
       
  //       this.resetCheckBox();
  //       console.log("this.eligibleStudentList", this.eligibleStudentList);
  //     } else {
        
  //       this.eligibleStudentList = [];
  //       this.studentList =[];
  //       this.paginationObj.length = 0;
  //     }
  //   })
  // }
  async getEligibleStudents() {
    let payload = {
      company_id:this.companyId,
      type:this.selectedIndex == 2? 'student':'employee',
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex
    }

    if(this.searchCriteria.keywords){
      payload['search'] = this.searchCriteria.keywords;
    }

    // if(this.filters && this.filters.length){
    //   let previousFilterList = [...this.filterList];
    //   console.log("this.filterParameters", this.filterParameters);
    //         this.filterList = [];
    //         let isValid = true;
    //         await this.filters.forEach(async(filter) => {
    //           // let value = this.filterParameters[filter.field];
            
    //         if (filter.selected) {
    //           this.filterApply = true;
    //             this.filterList.push(filter.name);
    //             // console.log(this.filterList);
    //             // Handle date fields
    //             if (filter.field === 'internship_start_date') {
    //                 Object.assign(payload, {
    //                     internship_start_sdate: moment(this.filterParameters.internship_start_sdate).format("DD/MM/YYYY"),
    //                     internship_start_edate: moment(this.filterParameters.internship_start_edate).format("DD/MM/YYYY"),
    //                 });
    //             } else if (filter.field === 'internship_end_date') {
    //                 Object.assign(payload, {
    //                     internship_end_sdate: moment(this.filterParameters.internship_end_sdate).format("DD/MM/YYYY"),
    //                     internship_end_edate: moment(this.filterParameters.internship_end_edate).format("DD/MM/YYYY"),
    //                 });
    //             // }  else if (filter.field === 'supervisor') {
    //             //     Object.assign(payload, {
    //             //       _id: this.companyId});
    //             // }  
    //             } else if (filter.field === 'assigned') {
    //               let value =  this.filterParameters[filter.field];
    //               Object.assign(payload, {  assigned_staff_id: value});
    //             } else {
    //                 this.filterParameters[filter.field]
    //                   // Handle other fields
    //                   let value =  this.filterParameters[filter.field];
    //                   Object.assign(payload, { [filter.field]: value});

    //                   console.log("payloadpayload", payload, filter.field,  this.filterParameters[filter.field]);
    //               }
    //         } else {
    //             // Validate filter parameters
    //           await Object.entries(this.filterParameters).forEach(async([key, value]) => {
    //                 if (value) {
                    
    //                   let find = await this.filters.find(el=>el.field==key);
                    
    //                   if(find){
    //                     if (Array.isArray(value) && value.length > 0 && !find.selected) {
    //                       console.log(key, value); 
    //                       this.service.showMessage({
    //                           message: "Please select the checkbox for filter parameters.",
    //                       });
    //                       isValid = false;
    //                       return true;
    //                   } else if (typeof value === "object" && Object.keys(value).length > 0 && !find.selected) {
    //                       this.service.showMessage({
    //                           message: "Please select the checkbox for filter parameters.",
    //                       });
    //                       isValid = false;
    //                       return true;
    //                   } else if (typeof value !== "object" && typeof value !== "function" && !find.selected) {
    //                       this.service.showMessage({
    //                           message: "Please select the checkbox for filter parameters.",
    //                       });
    //                       isValid = false;
    //                       return true;
    //                   }
    //                   }

                      
    //                 }
    //             });
    //         }
            
           
    //       });
    //         // Stop execution if validation fails
    //         if (await !isValid) {
    //           return;
    //         }

    //         let find =await this.filters.find(el=>el.selected);
    //         if(find){
    //           this.filterApply = true;
    //         }else{
    //           this.filterApply = false;
    //         }
            
    //         if (JSON.stringify(previousFilterList) !== JSON.stringify(this.filterList)) {
    //             this.paginationObj = {
    //                       length: 0,
    //                       pageIndex: this.paginationObj.pageIndex,
    //                       pageSize: this.paginationObj.pageSize,
    //                       previousPageIndex: 0,
    //                       changed: true,
    //                   };
    //               } else {
    //                   console.log("Filter list unchanged, skipping pagination reset.");
    //               }
                    
    //       await this.closeFilterModal.ripple.trigger.click();
    // }else{
    //   this.filterApply = false;
    // }


    if(this.selectedIndex == 2){
      this.columns = [
        { name: 'ID', visible: true },
    { name: 'Vacancy_Title', visible: true },
    { name: 'Reported_By', visible: true },
    { name: 'Student_ID', visible: true },
    { name: 'Supervisor_Name', visible: true },
    { name: 'Date_Reported', visible: true },
    { name: 'Status', visible: true },
    { name: 'Date_Closed', visible: true },
    { name: 'actions', visible: true }
      ]
    }else {
      this.columns = [
        { name: 'ID', visible: true },
    { name: 'Vacancy_Title', visible: true },
    { name: 'Reported_By', visible: true },
    { name: 'Student_ID', visible: true },
    // { name: 'Supervisor_Name', visible: true },
    { name: 'Date_Reported', visible: true },
    { name: 'Status', visible: true },
    { name: 'Date_Closed', visible: true },
    { name: 'actions', visible: true }
      ]
    }
    this.service.getIncidentReportByTypeId(payload).subscribe(async(response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.paginationObj.length =await response.total?response.total:response.result;
        this.studentList =await response.result;
        this.eligibleStudentList =await new MatTableDataSource(response.result);
      
        this.eligibleStudentList.sort =await this.eligibleStudentList;
      } else {
        
        this.eligibleStudentList = [];
        this.studentList =[];
        this.paginationObj.length = 0;
      }
    })
  }

getStatus(status: string) {
  switch (status) {
    case 'to_do':
      return 'To Do' // yellow
    case 'in_progress':
      return "In Progress" // blue
    case 'closed':
      return "Closed" // green
    default:
      return "N/A" // grey
  }
}


  getSuperviser(data: any[]): string {
    if (data && data.length > 0) {
      const supervisor = data.find(el => el.preferred_contact);
      return supervisor ? `${supervisor.first_name} ${supervisor.last_name}` : '';
    }
    return '';
  }
  
 
  ngAfterViewInit() {
    this.activeFilter = this.filters[0].field;
    // this.eligibleStudentList.sort = this.sort;
    this.displayColumn();
    this.prepareDisplayColumnFilter();
  }

  applyFilter(filter) {
    // console.log("filter", filter);
    this.activeFilter = filter.field=="state"?"post_code":filter.field;
  }

  prepareDisplayColumnFilter() {
    const numberOfRows = 1;
    this.columnRows = this.divideArrayIntoRows(this.columns, numberOfRows);
  }

  divideArrayIntoRows(originalArray, numberOfRows) {
    const rows = [];
    const itemsPerRow = Math.ceil(originalArray.length / numberOfRows);

    for (let i = 0; i < numberOfRows; i++) {
      const start = i * itemsPerRow;
      const end = start + itemsPerRow;
      const row = originalArray.slice(start, end);
      rows.push(row);
    }

    return rows;
  }

  displayColumn() {
    this.displayColumns = this.columns.map(column => column.name);
  }

  showHideColumn(column, event: MatCheckboxChange) {
    this.columns.find(col => {
      if (col.name === column) {
        col.visible = event.checked;
      }
    });
  }

  applyShowHideColumnFilter() {
    this.displayColumns = [];
    this.columns.forEach((col) => {
      if (col.visible) {
        this.displayColumns.push(col.name)
      }
    })
  }

  getPaginationData(event) {
    this.paginationObj = event;
    console.log("this.filterList", this.filterList)
    if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.getEligibleStudents()
    // } else if (!this.searchCriteria.keywords) {
    //   if(this.filterList && this.filterList.length>0){
    //     this.getEligibleStudents()
    //   }else{
    //     this.getEligibleStudents();
    //   }
    }else{
      this.getEligibleStudents()
    }
    console.log("calling")
    this.resetCheckBox();
  }

  // getStaffName(id) {
  //   const staff = this.staffList.find(staff => staff._id === id);
  //   return staff?.first_name + " " + staff?.last_name;
  // }


  exportStudentData1(type) {
  
    const payload = {
      type,
      company_id:this.companyId,
      student_id:  this.selectedRecords.length > 0 ?  this.selectedRecords.map(student => student._id) : undefined,
      currently_placed: this.selectedIndex === 1 ? true : false
    }
    this.service.exportCompanyStudents(payload).subscribe((res: any) => {
      console.log("res", res);
      this.resetCheckBox();
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  async selectStudent(student) {
    this.receiver_type = null;
    if(student){
      // student.first_name = student.first_name;
      // student.last_name =  student.last_name;
      // student.email =  student.email_id;
      // student.email_id =  student.email_id;
      // this.isCheck = this.eligibleStudentList.data.some(student => student.selected);
      // const selectedStudents = this.eligibleStudentList?.data.filter(student => student.selected);
      this.selectedStudent = student;
      // await selectedStudents.map(el=>{
      //   el.first_name = el.student_first_name;
      //   el.last_name =  el.student_last_name;
      //   el.email =  el.student_email;
      //   el.email_id =  el.student_email;
        
      // })
      this.selectedRecords = [this.selectedStudent];
      console.log("this.selectedRecords", this.selectedRecords);
      // if (this.selectedRecords?.length == this.eligibleStudentList.data.length) {
      //   this.selectAllStdnt = true;
      // } else {
      //   this.selectAllStdnt = false;
      // }
    }else{

    }
  }
 @ViewChild('viewSubmithcaafModal') viewSubmithcaafModal: ModalDirective;
  taskDetail:any
  studentFormDetail:any;
  singleStepForm:any;
  multiStepForm:any;
  viewForm(student){
    this.viewSubmithcaafModal.show();
    this.taskDetail = student;
    this.studentFormDetail = student['form_fields'];
    if (this.studentFormDetail?.type === 'simple') {
      this.singleStepForm = this.studentFormDetail?.fields;
        this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));
    } else {
      this.multiStepForm = this.studentFormDetail?.fields;
      this.multiStepForm.forEach(el=>{
        el.component.forEach(field => this.manageFieldVisibility(field, el.component));
      })
    }
  }
  receiver_type:any = ''
  selectSupervisore(student){
    this.receiver_type = 'company'
    this.selectedStudent = student;
     this.selectedStudent.first_name = student.supervisor.split(' ')[0];
     this.selectedStudent.last_name = student.supervisor.split(' ')[1];
      this.selectedStudent.email = student.supervisor_email;
      //  this.selectedStudent = student;
    this.selectedRecords = [this.selectedStudent];
  }

  selectAllStudent() {
    for (let student of this.eligibleStudentList?.data) {
      if (this.selectAllStdnt) {
        student['selected'] = true;
      } else {
        student['selected'] = false;
      }
      this.isCheck = student['selected'];
    }
    this.selectedRecords = this.eligibleStudentList?.data.filter(student => student.selected);
  }

 

  selectPlacementType(event) {
    const placementType = this.placementTypes.find(placement => placement.workflow_type_id === event)
    this.placementTypeForm.patchValue({
      placementType: placementType.type,
      placement_type_id: placementType.workflow_type_id
    });
  }

  viewProfile(student) {
    this.router.navigate(['/admin/wil/view-student-profile'], { queryParams: { id: student._id } });
  }

  // onSelectMajor(event) {
  //   this.filterParameters.major.push(event.target.value);
  //   event.target.value = '';
  // }

  removeFilterItem(index, from) {
    this.filterParameters[from].splice(index, 1);
    this.filterParameters[from] = [...this.filterParameters[from]]
  }




  onCheckboxChange(event: MatCheckboxChange, filter): void {
    console.log('Checkbox changed:', event.checked);
    console.log('this.filters:', this.filters, 'this.filterParameters:', this.filterParameters, 'filter:', filter);
  
    filter.selected = event.checked;

    if (event.checked) {
      console.log('Checkbox is selected');
      // Add logic for when the checkbox is selected, if needed.
    } else {
      console.log('Checkbox is deselected');
      this.filters.forEach((el) => {
        if (filter.field === el.field) {
          this.filterParameters[filter.field] = []; // Corrected 'field' to 'filter.field'

        }
        if(filter.field === 'internship_start_date'){
          this.filterParameters.internship_start_sdate = null
          this.filterParameters.internship_start_edate = null
        }
        if(filter.field === 'internship_end_date'){
          this.filterParameters.internship_end_sdate = null
          this.filterParameters.internship_end_edate = null
        }
      });
    }
  }
  


  filterApply:boolean = false;
  filterList:any = [];
  @ViewChild('closeFilterModal') closeFilterModal;
  // async onApplyFilter() {
  //   let previousFilterList = [...this.filterList];
  //   // this.paginationObj = {
  //   //   length: 0,
  //   //   pageIndex: this.paginationObj.pageIndex,
  //   //   pageSize: this.paginationObj.pageSize,
  //   //   previousPageIndex: 0,
  //   //   changed:true
  //   // }
  //   let payload =await {
  //     limit: this.paginationObj.pageSize,
  //     offset: this.paginationObj.pageIndex,
  //   }
  //   console.log("this.filters", this.filters, "this.filterParameters", this.filterParameters);
  //   this.filterList = [];
  //   let isValid = true;
  //   await this.filters.forEach(async(filter) => {
  //     // let value = this.filterParameters[filter.field];
    
  //   if (filter.selected) {
  //       this.filterList.push(filter.name);
  //       console.log(this.filterList);
    
  //       // Update the field for 'Location' if selected
  //       if (filter.name === 'Location') {
  //           filter.field = "state";
  //       }
    
  //       // Handle date fields
  //       if (filter.field === 'monthly_cohort') {
  //           Object.assign(payload, {
  //               monthly_cohort_sdate: moment(this.filterParameters.monthly_cohort_sdate).format("DD/MM/YYYY"),
  //               monthly_cohort_edate: moment(this.filterParameters.monthly_cohort_edate).format("DD/MM/YYYY"),
  //           });
  //       } else if (filter.field === 'course_start_date') {
  //           Object.assign(payload, {
  //               course_start_sdate: moment(this.filterParameters.course_start_sdate).format("DD/MM/YYYY"),
  //               course_start_edate: moment(this.filterParameters.course_start_edate).format("DD/MM/YYYY"),
  //           });
  //       } else if (filter.field === 'course_end_date') {
  //           Object.assign(payload, {
  //               course_end_sdate: moment(this.filterParameters.course_end_sdate).format("DD/MM/YYYY"),
  //               course_end_edate: moment(this.filterParameters.course_end_edate).format("DD/MM/YYYY"),
  //           });
  //       } else if (filter.field === 'internship_start_date') {
  //           Object.assign(payload, {
  //               internship_start_sdate: moment(this.filterParameters.internship_start_sdate).format("DD/MM/YYYY"),
  //               internship_start_edate: moment(this.filterParameters.internship_start_edate).format("DD/MM/YYYY"),
  //           });
  //       } else if (filter.field === 'internship_end_date') {
  //           Object.assign(payload, {
  //               internship_end_sdate: moment(this.filterParameters.internship_end_sdate).format("DD/MM/YYYY"),
  //               internship_end_edate: moment(this.filterParameters.internship_end_edate).format("DD/MM/YYYY"),
  //           });
  //       } else {
  //         this.filterParameters[filter.field]
  //           // Handle other fields
  //           let value =  this.filterParameters[filter.field];
  //           Object.assign(payload, { [filter.field]: value});

  //           console.log("payloadpayload", payload, filter.field,  this.filterParameters[filter.field]);
  //       }
  //   } else {
  //       // Validate filter parameters
  //      await Object.entries(this.filterParameters).forEach(async([key, value]) => {
  //           if (value) {
            
  //             let find = await this.filters.find(el=>el.field==key);
            
  //             if(find){
  //               if (Array.isArray(value) && value.length > 0 && !find.selected) {
  //                 console.log(key, value); 
  //                 this.service.showMessage({
  //                     message: "Please select the checkbox for filter parameters.",
  //                 });
  //                 isValid = false;
  //                 return true;
  //             } else if (typeof value === "object" && Object.keys(value).length > 0 && !find.selected) {
  //                 this.service.showMessage({
  //                     message: "Please select the checkbox for filter parameters.",
  //                 });
  //                 isValid = false;
  //                 return true;
  //             } else if (typeof value !== "object" && typeof value !== "function" && !find.selected) {
  //                 this.service.showMessage({
  //                     message: "Please select the checkbox for filter parameters.",
  //                 });
  //                 isValid = false;
  //                 return true;
  //             }
  //             }

               
  //           }
  //       });
  //   }
    
    
  // });
  //   // Stop execution if validation fails
  //   if (await !isValid) {
  //     return;
  //   }
    
  //   if (JSON.stringify(previousFilterList) !== JSON.stringify(this.filterList)) {
  //     this.paginationObj = {
  //         length: 0,
  //         pageIndex: this.paginationObj.pageIndex,
  //         pageSize: this.paginationObj.pageSize,
  //         previousPageIndex: 0,
  //         changed: true,
  //     };
  // } else {
  //     console.log("Filter list unchanged, skipping pagination reset.");
  // }
    
  //  await this.closeFilterModal.ripple.trigger.click();

  //   payload['is_archive'] = this.selectedIndex === 1 ? false : true;
  //   this.service.studentFilter(payload).subscribe((response) => {
  //     if (response.status == HttpResponseCode.SUCCESS) {
  //       // if(this.filterList.length>0){
  //       //   this.filterApply = true;
  //       // }
  //       this.filterApply = true;
  //       this.filterCount =  response.count?response.count: response.result.length;
  //       this.eligibleStudentList = new MatTableDataSource(response.result);
  //       this.paginationObj.length = response.count?response.count: response.result.length;
  //       this.eligibleStudentList?.data.forEach(student => {
  //         student.selected = false;
  //       })
  //       this.eligibleStudentList.sort = this.studentTbSort;
  //       this.resetCheckBox();
  //     } else {
  //       this.filterApply = true;
  //       this.filterCount = 0;
  //       this.studentList = [];
  //       this.eligibleStudentList = [];
  //       this.service.showMessage({
  //         message: "Students not found for applied filters"
  //       });
  //     }
  //   })
  // }

  getFirstLetter(assignedTo) {
    if (assignedTo) {
      let split = assignedTo.split(' ');
      let firstName = split[0];
      let lastName = split[1];
      return `${firstName.charAt(0)} ${lastName.charAt(0)}`;
    }
  }

  onChangeSearchKeyword() {
    if (this.searchCriteria.keywords.length >= 3) {
      this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: true,
    };
      this.getEligibleStudents()
      this.resetCheckBox();
    } else if (!this.searchCriteria.keywords) {
      this.getEligibleStudents();
      this.resetCheckBox();
    }
  }

  searchEligibleStudents() {
    const payload = {
      ...this.searchCriteria,
      offset:this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize,
      is_archive: this.selectedIndex === 1 ? false : true
    }
    this.service.searchStudent(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.paginationObj.length = response.count;
        this.eligibleStudentList = new MatTableDataSource(response.result);
        this.eligibleStudentList.sort = this.studentTbSort;
        this.resetCheckBox();
      } else {
        this.paginationObj.length = 0;
        this.eligibleStudentList = [];
      }
    })
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
  
  getTitle(){
    return 'Selected Parameters: '+this.filterList.join(', ');
  }
  


  updateCheckBox(data) {
    const payload = {
      student_id: data._id,
      ...data
    };
    console.log("payload", payload);
    // return false
    if (Object.keys(payload).length > 0) {
      this.editStudentCheckBox(payload);
    }
  }

  editStudentCheckBox(payload) {
    this.service.editStudentCheckBox(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Student data updated successfully"
      });
      this.getEligibleStudents();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  gotoProfile(data){
    this.router.navigate(["/admin/wil/view-student-profile"], {queryParams: {id: data.student_id}});
  }

  goBack() {
    this.location.back();
  }
  


   errorMessage:any = null;
  processEnd:boolean = false;
  processEndObj:any = null;
  disbaledBtnLogic:boolean = false;
  stopnext:boolean = false;


checkFieldLogic(changedField: any, fields: any[]) {
  console.log("changedField, fields", changedField, ' == = = ', fields, ' = = == = = = ', this.processEnd, this.stopnext);

  if (this.studentFormDetail?.type === 'simple' || this.studentFormDetail?.type === 'multi_step') {
    this.manageFieldVisibility(changedField, fields);
  }

  if (this.processEnd || this.stopnext) {
    console.log("this.processEndObj", this.processEndObj)
      // const passed = this.checkCondition(fieldValue, logic, targetField);
      if(this.processEndObj.index == changedField.index){
        // let logic = changedField.logic || {};
        let logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
        const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
        console.log("passed", passed);
        if(!passed){
          this.errorMessage = null;
          changedField.is_message = false;
          changedField.message = "";

          // if (logic.action === "end_process") {
          //   this.processEnd = false;
          // }
          // if (logic.action === "block_submission") {
          //   this.stopnext = false;
          // }
          this.processEnd = false;
          this.stopnext = false;
          this.disbaledBtnLogic = false;
          this.processEndObj = null
        }

     }
    console.log("this.processEndObj", this.processEndObj);
    return;
  }
  const logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  // --- find the field we check the value of ---
  const targetField = fields.find(f => f.name === logic.field_name);
  if (!targetField) return;

  const fieldValue = targetField.elementData?.value;

  console.log("fieldValuefieldValue", fieldValue);
  // const passed = fieldValue || logic.action == "hide_field" || logic.action == "show_field"?this.checkCondition(fieldValue, logic, targetField):false;

  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // logic.action === "show_field";

  console.log("shouldCheck", shouldCheck)
const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;

  console.log("Checking:", targetField.name, "Value:", fieldValue, "Rule:", logic, "Passed:", passed);

  // --- find field to hide/show ---
  let hideShowField: any = null;
  if (logic.hide_show_field && this.studentFormDetail?.type === 'multi_step') {
    const section = this.multiStepForm.find(el => el.name === logic.action_page_type);
    hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
  } else {
    hideShowField = logic.hide_show_field
      ? fields.find(f => f.name === logic.hide_show_field)
      : null;
  }

  console.log("targetField", passed)

  if (passed) {
    switch (logic.action) {
      case "show_message":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "block_submission":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || "Form submission blocked";
        break;

      case "hide_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // hideShowField.elementData.value = null;
          }
        }
        // hideShowField.hidden = true;
        // // hideShowField.elementData.value = null;
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = false;
        }
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || "Process ended";
        break;
    }
  } else {
    // --- Reset states if condition fails ---
    switch (logic.action) {
      case "hide_field":

      
       if (hideShowField) {
        hideShowField.hidden = false;
        if (hideShowField.elementData) {
          // hideShowField.elementData.value = null;
        }
      }
        targetField.is_message = false;
        targetField.message = "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // hideShowField.elementData.value = null;
          }
        }
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_message":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;   // ✅ unlock when condition fails
        break;

      case "block_submission":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;     // ✅ unlock when condition fails
        break;

      default:
        break;
    }
  }

  this.recalculateEndProcess(fields);
}

private recalculateEndProcess(fields: any[]) {
  let disableFound = false;

  for (const field of fields) {
    const logic = field.logic;
    if (!logic) continue;

    // If already in processEnd/stopnext mode, verify if condition still holds
    // if (this.processEnd || this.stopnext) {
    //   console.log("this.processEndObj", this.processEndObj, "field", field)
    //   if (this.processEndObj?.index === field.index) {
    //     const passed = this.checkCondition(field.elementData?.value, logic, field);
    //     console.log("Re-checking condition for end_process:", passed);

    //     if (!passed) {
    //       // Reset because condition no longer holds
    //       this.errorMessage = null;
    //       field.is_message = false;
    //       field.message = "";

    //       this.processEnd = false;
    //       this.stopnext = false;
    //       this.disbaledBtnLogic = false;
    //       this.processEndObj = null;
    //     }
    //   }
    //   continue; // don’t exit loop, keep checking other fields
    // }

    // Normal case: check condition fresh

    let shouldCheck =
    field.elementData?.value !== undefined &&
    field.elementData?.value !== null &&
    field.elementData?.value !== "" ||
    field.id == "checkbox" || logic.action === "show_field"
    
    const passed = shouldCheck?this.checkCondition(field.elementData?.value, logic, field):false;
    console.log("passed", passed, "field", field, "login", passed && (logic.action === "end_process" || logic.action === "block_submission"))
    if (passed && (logic.action === "end_process" || logic.action === "block_submission")) {
      disableFound = true;
      this.processEndObj = { index: field.index, action: logic.action };
      break;
    }
  }

  // Apply final state if not already reset
  if (!this.processEnd && !this.stopnext) {
    this.disbaledBtnLogic = disableFound;
    this.processEnd = disableFound;
    this.stopnext = disableFound;
  }

  console.log("Recalculated end_process:", {
    disableFound,
    processEnd: this.processEnd,
    stopnext: this.stopnext,
    processEndObj: this.processEndObj
  });
}


private checkCondition(fieldValue: any, rule: any, targetField: any): boolean {

  console.log("fieldValue: any, rule: any, targetField", fieldValue, rule, targetField)
  const value = rule.value;
  const fieldType =
    targetField?.elementData?.type ||
    targetField?.logic?.type ||
    targetField?.id;

  console.log("fieldType", fieldType);

  // if (fieldValue == null || fieldValue === '') return false;

  // --- TEXT FIELD (by length) ---
  if (fieldType === 'single-line' || fieldType === 'multi-line') {
    const length = fieldValue?.toString().replace(/\n/g, '').trim()?.length || null;
    if(length == null){
      return false;
    }
    const ruleNum = Number(value);
    switch (rule.is) {
      case 'eq': return length === ruleNum;
      case 'neq': return length !== ruleNum;
      case 'lt': return length < ruleNum;
      case 'gt': return length > ruleNum;
      case 'lte': return length <= ruleNum;
      case 'gte': return length >= ruleNum;
      default: return false;
    }
  }

  // --- NUMBER FIELD ---
  // if (fieldType === 'number') {
  //   const numVal = Number(fieldValue);
  //   if (isNaN(numVal)) return false;

  //   let mainCheck = true;

  //   // first rule check (eq, gt, lt etc.)
  //   if (rule.and_number !== undefined && rule.and_number !== null && rule.and_number !== '') {
  //     const numRule = Number(rule.and_number);
  //     switch (rule.is) {
  //       case 'eq': mainCheck = numVal === numRule; break;
  //       case 'neq': mainCheck = numVal !== numRule; break;
  //       case 'lt': mainCheck = numVal < numRule; break;
  //       case 'gt': mainCheck = numVal > numRule; break;
  //       case 'lte': mainCheck = numVal <= numRule; break;
  //       case 'gte': mainCheck = numVal >= numRule; break;
  //     }
  //   }

  //   // second rule check (and_number, to_number, number_grather)
  //   let secondCheck = true;
  //   if (rule.number_grather && rule.and_number !== '') {
  //     const andNum = Number(rule.and_number);
  //     const toNum = Number(rule.to_number);
  //     switch (rule.number_grather) {
  //       case 'eq': secondCheck = numVal === andNum; break;
  //       case 'neq': secondCheck = numVal !== andNum; break;
  //       case 'lt': secondCheck = numVal < andNum; break;
  //       case 'gt': secondCheck = numVal > andNum; break;
  //       case 'lte': secondCheck = numVal <= andNum; break;
  //       case 'gte': secondCheck = numVal >= andNum; break;
  //       case 'between': secondCheck = numVal >= andNum && numVal <= toNum; break;
  //     }
  //   }

  //   return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
  // }

  if (fieldType === 'number') {
  const numVal = Number(fieldValue);
  if (isNaN(numVal)) return false;

  let mainCheck = true;

  // First operator check (is)
  if (rule.is && rule.and_number !== '') {
    const numRule = Number(rule.and_number);
    switch (rule.is) {
      case 'eq': mainCheck = numVal === numRule; break;
      case 'neq': mainCheck = numVal !== numRule; break;
      case 'lt': mainCheck = numVal < numRule; break;
      case 'gt': mainCheck = numVal > numRule; break;
      case 'lte': mainCheck = numVal <= numRule; break;
      case 'gte': mainCheck = numVal >= numRule; break;
    }
  }

  // Second operator check (number_grather / between)
  let secondCheck = true;
  if (rule.number_grather) {
    const andNum = Number(rule.and_number);
    const toNum = rule.to_number ? Number(rule.to_number) : null;

    switch (rule.number_grather) {
      case 'eq': secondCheck = numVal === toNum; break;
      case 'neq': secondCheck = numVal !== toNum; break;
      case 'lt': secondCheck = numVal < toNum; break;
      case 'gt': secondCheck = numVal > toNum; break;
      case 'lte': secondCheck = numVal <= toNum; break;
      case 'gte': secondCheck = numVal >= toNum; break;
      case 'between':
        if (toNum !== null) {
          secondCheck = numVal >= andNum && numVal <= toNum;
        } else {
          secondCheck = false; // invalid rule definition
        }
        break;
    }
  }
  console.log("rule.number_grather ? (mainCheck && secondCheck) : mainCheck", rule.number_grather , (mainCheck && secondCheck) , mainCheck, secondCheck)

  return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
}


  // --- DATE/TIME FIELD ---
 if (fieldType === 'date') {
    const fieldDateObj = new Date(fieldValue);
    const ruleDateObj = new Date(value);

    if (isNaN(fieldDateObj.getTime()) || isNaN(ruleDateObj.getTime())) return false;

    // Zero out the time part
    fieldDateObj.setHours(0, 0, 0, 0);
    ruleDateObj.setHours(0, 0, 0, 0);

    const fieldDate = fieldDateObj.getTime();
    const ruleDate = ruleDateObj.getTime();

    switch (rule.is) {
      case 'eq': return fieldDate === ruleDate;
      case 'neq': return fieldDate !== ruleDate;
      case 'lt': return fieldDate < ruleDate;
      case 'gt': return fieldDate > ruleDate;
      case 'lte': return fieldDate <= ruleDate;
      case 'gte': return fieldDate >= ruleDate;
      default: return false;
    }
  }

  if (fieldType === 'time') {
  // Convert both fieldValue and rule.value (e.g. "4:05 PM") into minutes since midnight
  const parseTime = (timeStr) => {
    if (!timeStr) return NaN;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return NaN;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3] ? match[3].toUpperCase() : null;

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes; // total minutes since midnight
  };

  const fieldTime = parseTime(fieldValue);
  const ruleTime = parseTime(value);

  if (isNaN(fieldTime) || isNaN(ruleTime)) return false;

  switch (rule.is) {
    case 'eq': return fieldTime === ruleTime;
    case 'neq': return fieldTime !== ruleTime;
    case 'lt': return fieldTime < ruleTime;
    case 'gt': return fieldTime > ruleTime;
    case 'lte': return fieldTime <= ruleTime;
    case 'gte': return fieldTime >= ruleTime;
    default: return false;
  }
}


  // --- CHECKBOX / RADIO / MULTISELECT ---
//   if (fieldType === 'checkbox' || fieldType === 'radio' || Array.isArray(fieldValue)) {
//     // Collect selected values properly for checkbox
//     let selectedValues: any[] = [];
//     if (fieldType === 'checkbox' && targetField.elementData?.items) {
//       selectedValues = targetField.elementData.items
//         .filter((item: any) => item.selected)
//         .map((item: any) => item.item);
//     } else {
//       selectedValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
//     }

//     const ruleValues = Array.isArray(value) ? value : [value];
//     switch (rule.is) {
//       case 'includes': return ruleValues.some(v => selectedValues.includes(v));
//       case 'not_includes': return ruleValues.every(v => !selectedValues.includes(v));
//       default: return false;
//     }
//   }

//   if (fieldType === 'likert-scale' || fieldType === "likert") {
//   const likertItems: string[] = targetField?.elementData?.items?.map((i: any) => i.item) || [];

//   if (!likertItems.length) return false;

//   const fieldIndex = likertItems.indexOf(fieldValue) + 1;
//   let ruleIndex = -1;

//   if (Array.isArray(value) && value.length > 0) {
//     ruleIndex = likertItems.indexOf(value[0]) + 1;
//   } else if (typeof value === "string") {
//     ruleIndex = likertItems.indexOf(value) + 1;
//   }

//   if (fieldIndex <= 0 || ruleIndex <= 0) return false;

//   switch (rule.is) {
//     case 'eq': return fieldIndex === ruleIndex;
//     case 'neq': return fieldIndex !== ruleIndex;
//     case 'lt': return fieldIndex < ruleIndex;
//     case 'gt': return fieldIndex > ruleIndex;
//     case 'lte': return fieldIndex <= ruleIndex;
//     case 'gte': return fieldIndex >= ruleIndex;
//     default: return false;
//   }
// }

 if (fieldType === 'likert-scale' || fieldType === 'likert') {
  // Get selected value(s)
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  const likertOrder = targetField.elementData?.items?.map(it => it.item) || [];

  const selectedRank = likertOrder.indexOf(selectedValues[0]);
  const ruleRank = likertOrder.indexOf(ruleValues[0]);

  console.log('Likert selected:', selectedValues[0], 'rule:', ruleValues[0], 'comparison:', rule.is);

  switch (rule.is) {
    case 'eq':
      return selectedValues[0] === ruleValues[0];

    case 'neq':
      return selectedValues[0] !== ruleValues[0];

    case 'includes':
      return ruleValues.includes(selectedValues[0]);

    case 'not_includes':
      return !ruleValues.includes(selectedValues[0]);

    case 'gte':
      return selectedRank >= ruleRank;

    case 'lte':
      return selectedRank <= ruleRank;

    case 'gt':
      return selectedRank > ruleRank;

    case 'lt':
      return selectedRank < ruleRank;

    default:
      return false;
  }
}


  // --- existing checkbox/radio/array logic ---
// RADIO / CHECKBOX / MULTISELECT (replace your current block with this)
// if (fieldType === 'radio' || fieldType === 'checkbox' || Array.isArray(fieldValue)) {
//   // build selectedValues array:
//   let selectedValues: any[] = [];

//   // checkbox: read items[].selected
//   if (fieldType === 'checkbox' && targetField.elementData?.items) {
//     selectedValues = targetField.elementData.items
//       .filter((it: any) => !!it.selected)
//       .map((it: any) => it.item);
//   }
//   // if fieldValue is already an array (multi-select), use it
//   else if (Array.isArray(fieldValue)) {
//     selectedValues = fieldValue.slice();
//   }
//   // radio / single-select: single value -> array
//   else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
//     selectedValues = [fieldValue];
//   } else {
//     selectedValues = [];
//   }


//   const ruleValues = Array.isArray(value) ? value : [value];
//   console.log("selectedValues", selectedValues, ruleValues)
//   switch (rule.is) {
//     // exact match: selectedValues must contain exactly the same items as ruleValues
//     case 'eq':
//       // both arrays equal (order-agnostic)
//     if (selectedValues.length !== ruleValues.length) return false;
//       return ruleValues.every(rv => selectedValues.includes(rv));

//     case 'neq':
//       if (selectedValues.length !== ruleValues.length) return true;
//       return !ruleValues.every(rv => selectedValues.includes(rv));

//     // any match: true if any rule value is present in selectedValues
//     case 'includes':
//       return ruleValues.some(rv => selectedValues.includes(rv));

//     // none of the rule values are present
//     case 'not_includes':
//       return ruleValues.every(rv => !selectedValues.includes(rv));

//     default:
//       return false;
//   }
// }

if (fieldType === 'radio' || Array.isArray(fieldValue)) {
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  console.log("ruleValues", ruleValues, "selectedValues", selectedValues)
  switch (rule.is) {
    case 'eq':
      if (selectedValues.length !== ruleValues.length) return false;
      return ruleValues.every(rv => selectedValues.includes(rv));

    case 'neq':
      if (selectedValues.length !== ruleValues.length) return true;
      return !ruleValues.every(rv => selectedValues.includes(rv));

    case 'includes':
      return selectedValues.length > 0 && ruleValues.some(rv => selectedValues.includes(rv));

    case 'not_includes':
      // treat empty selection as false
      if (!selectedValues.length) return false;
      return !ruleValues.some(rv => selectedValues.includes(rv));

    default:
      return false;
  }
}

// console.log("fieldType",fieldType)

if (fieldType === 'checkbox') {
  const selectedValues: string[] = targetField.elementData?.items
    ?.filter((item: any) => item.selected)
    .map((item: any) => {
      // Adjust here depending on your data structure
      return (item.value || item.item || item.label || '').toString().trim().toLowerCase();
    }) || [];

  const ruleValues: string[] = (Array.isArray(value) ? value : [value])
    .map(v => (v ?? '').toString().trim().toLowerCase());


    console.log('Selected Values:', selectedValues);
    console.log('Rule Values:', ruleValues);

    if(selectedValues.length == 0){
      return false
    }

  switch (rule.is) {
    case 'includes':
      return ruleValues.some(rv => selectedValues.includes(rv));
    case 'not_includes':
      return ruleValues.every(rv => !selectedValues.includes(rv));
    case 'eq':
      return selectedValues.length === ruleValues.length &&
             ruleValues.every(rv => selectedValues.includes(rv));
    case 'neq':
      return !(selectedValues.length === ruleValues.length &&
               ruleValues.every(rv => selectedValues.includes(rv)));
    default:
      return false;
  }
}



if (fieldType === 'dropdown') {
  // actual selected value from dropdown
  const selectedValue = targetField.elementData?.value || '';

  // normalize rule values into array
  const ruleValues = Array.isArray(value) ? value : [value];

  switch (rule.is) {
    case 'eq':
    case 'includes':
      // Match if selected value equals any of the rule values
      return ruleValues.includes(selectedValue);

    case 'neq':
    case 'not_includes':
      // Match if selected value does NOT equal any of the rule values
      return !ruleValues.includes(selectedValue);

    default:
      return false;
  }
}


  // --- DEFAULT STRING/OTHER ---
  switch (rule.is) {
    case 'eq': return fieldValue == value;
    case 'neq': return fieldValue != value;
    default: return false;
  }
}


manageFieldVisibility(changedField: any, fields: any[]) {
  // const logic = changedField.logic || {};
  const logic =  Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  let targetField: any;
  let hideShowField: any = null;

  if (this.studentFormDetail?.type === 'multi_step' && logic.hide_show_field) {
    const section = this.multiStepForm.find(el => el.name === logic.action_page_type);
    targetField = fields.find(f => f.name === logic.field_name);
   if(!targetField?.elementData?.value || targetField?.elementData?.value == "Nah"){
    hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
    }
  } else {
    targetField = fields.find(f => f.name === logic.field_name);
   if(!targetField?.elementData?.value || targetField?.elementData?.value == "Nah"){
    hideShowField = logic.hide_show_field ? fields.find(f => f.name === logic.hide_show_field) : null;
    }
  }

  if (!targetField) return;

  //   if (this.processEnd || this.stopnext) {
  //     // const passed = this.checkCondition(fieldValue, logic, targetField);
  //     if(this.processEndObj.index == changedField.index){
  //       let logic = changedField.logic || {};
  //       const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
  //       console.log("passed", passed);
  //       if(!passed){
  //         this.errorMessage = null;
  //         changedField.is_message = false;
  //         changedField.message = "";
  //         this.processEnd = false;
  //         this.stopnext = false;
  //         this.disbaledBtnLogic = false;
  //         this.processEndObj = null
  //       }

  //     }
  //   console.log("this.processEndObj", this.processEndObj);
  //   return;
  // }

  const fieldValue = targetField.elementData?.value;
  console.log("fieldValue", fieldValue)
  console.log("logic", logic);
  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // ||
  // (logic.action === "hide_field" && (logic.is!='lt' || logic.is!='lte'))
  // (logic.action === "show_field" && (logic.is=='lt' || logic.is=='lte'));

if(logic.action === "hide_field"){
  console.log("shouldCheck", shouldCheck, logic.action)
}
  

const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;
  console.log("passed", passed);
  // --- handle hide/show / end_process / block_submission ---
  if (passed) {
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) hideShowField.hidden = true;
        break;

      case 'hide_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        break;

      case 'show_message':
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || '';
        break;

      case 'block_submission':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || 'Form submission blocked';
        break;

      case 'end_process':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || 'Process ended';
        break;
    }
  } else {
    // --- reset only for actions that are not end_process / block_submission ---
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'hide_field':
        if (hideShowField) hideShowField.hidden = false;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'show_message':
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'block_submission':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'end_process':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;
    }
  }

  console.log('manageFieldVisibility ->', {
    targetField,
    hideShowField,
    passed,
    action: logic.action
  });
}


  checkIsFormValidSubmit(formFields) {
    //
    if (formFields && formFields.length > 0) {
      return formFields.some(form => (form.id !== 'signature' &&  form.id !== 'checkbox' &&  form.elementData?.required && !form.elementData?.value) ||
        (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))));
    } else {
      return true;
    }
  }
}