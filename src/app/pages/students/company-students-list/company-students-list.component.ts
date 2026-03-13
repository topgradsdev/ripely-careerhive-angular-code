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
  selector: 'app-company-students-list',
  templateUrl: './company-students-list.component.html',
  styleUrls: ['./company-students-list.component.scss']
})

export class CompanyStudentsListComponent implements AfterViewInit {
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


  // { name: 'Simulation Groups', field: 'placementGroups', selected: false },
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
    { name: 'checkbox', visible: true },
    { name: 'name', visible: true },
    { name: 'email', visible: true },
    { name: 'departments', visible: true },
    { name: 'internshipStartDate', visible: true },
    { name: 'internshipEndDate', visible: true },
    { name: 'supervisor', visible: true },
    { name: 'actions', visible: true }
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
        if(this.type=='ongoing'){
          this.selectedIndex = 1;
          this.btnTabs(1);
        }else {
          this.selectedIndex = 2;
          this.btnTabs(2);
        }
        this.getEmployerProfile();
        this.getEligibleStudents();
        this.studentFilterOptions();
      }
    });
  
    // this.getPlacementGroups("");

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
    this.getEligibleStudents();
    this.filterApply = false;
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
    const payload = {
      _id:this.companyId,
      limit: this.paginationObj.pageSize,
      // student_filter:this.status,
      offset: this.paginationObj.pageIndex,
      currently_placed: this.selectedIndex === 1 ? true : false
    }

    if(this.searchCriteria.keywords){
      payload['search'] = this.searchCriteria.keywords;
      this.filterApply = false;
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
    }

    if(this.filters && this.filters.length){
      let previousFilterList = [...this.filterList];
      console.log("this.filterParameters", this.filterParameters);
            this.filterList = [];
            let isValid = true;
            await this.filters.forEach(async(filter) => {
              // let value = this.filterParameters[filter.field];
            
            if (filter.selected) {
              this.filterApply = true;
                this.filterList.push(filter.name);
                // console.log(this.filterList);
                // Handle date fields
                if (filter.field === 'internship_start_date') {
                    Object.assign(payload, {
                        internship_start_sdate: moment(this.filterParameters.internship_start_sdate).format("DD/MM/YYYY"),
                        internship_start_edate: moment(this.filterParameters.internship_start_edate).format("DD/MM/YYYY"),
                    });
                } else if (filter.field === 'internship_end_date') {
                    Object.assign(payload, {
                        internship_end_sdate: moment(this.filterParameters.internship_end_sdate).format("DD/MM/YYYY"),
                        internship_end_edate: moment(this.filterParameters.internship_end_edate).format("DD/MM/YYYY"),
                    });
                // }  else if (filter.field === 'supervisor') {
                //     Object.assign(payload, {
                //       _id: this.companyId});
                // }  
                } else if (filter.field === 'assigned') {
                  let value =  this.filterParameters[filter.field];
                  Object.assign(payload, {  assigned_staff_id: value});
                } else {
                    this.filterParameters[filter.field]
                      // Handle other fields
                      let value =  this.filterParameters[filter.field];
                      Object.assign(payload, { [filter.field]: value});

                      console.log("payloadpayload", payload, filter.field,  this.filterParameters[filter.field]);
                  }
            } else {
                // Validate filter parameters
              await Object.entries(this.filterParameters).forEach(async([key, value]) => {
                    if (value) {
                    
                      let find = await this.filters.find(el=>el.field==key);
                    
                      if(find){
                        if (Array.isArray(value) && value.length > 0 && !find.selected) {
                          console.log(key, value); 
                          this.service.showMessage({
                              message: "Please select the checkbox for filter parameters.",
                          });
                          isValid = false;
                          return true;
                      } else if (typeof value === "object" && Object.keys(value).length > 0 && !find.selected) {
                          this.service.showMessage({
                              message: "Please select the checkbox for filter parameters.",
                          });
                          isValid = false;
                          return true;
                      } else if (typeof value !== "object" && typeof value !== "function" && !find.selected) {
                          this.service.showMessage({
                              message: "Please select the checkbox for filter parameters.",
                          });
                          isValid = false;
                          return true;
                      }
                      }

                      
                    }
                });
            }
            
           
          });
            // Stop execution if validation fails
            if (await !isValid) {
              return;
            }

            let find =await this.filters.find(el=>el.selected);
            if(find){
              this.filterApply = true;
            }else{
              this.filterApply = false;
            }
            
            if (JSON.stringify(previousFilterList) !== JSON.stringify(this.filterList)) {
                this.paginationObj = {
                          length: 0,
                          pageIndex: this.paginationObj.pageIndex,
                          pageSize: this.paginationObj.pageSize,
                          previousPageIndex: 0,
                          changed: true,
                      };
                  } else {
                      console.log("Filter list unchanged, skipping pagination reset.");
                  }
                    
          await this.closeFilterModal.ripple.trigger.click();
    }else{
      this.filterApply = false;
    }

    this.service.getCompnaystudentListHQ(payload).subscribe(async(response: any) => {
      if (response.code == HttpResponseCode.SUCCESS) {
        this.paginationObj.length =await response.count?response.count:response.data;
        console.log("response", response);
        if(this.filterApply){
          this.filterCount =  response.count?response.count: response.data.length;
        }
        this.studentList =await response.data;
        this.eligibleStudentList =await new MatTableDataSource(response.data);
        await this.eligibleStudentList?.data.forEach(student => {
          student.selected = false;
        })
        this.eligibleStudentList.sort =await this.studentTbSort;
       
        this.resetCheckBox();
        console.log("this.eligibleStudentList", this.eligibleStudentList);
      } else {
        
        this.eligibleStudentList = [];
        this.studentList =[];
        this.paginationObj.length = 0;
      }
    })
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
    if(student){
      student.first_name = student.student_first_name;
      student.last_name =  student.student_last_name;
      student.email =  student.student_email;
      student.email_id =  student.student_email;
      this.isCheck = this.eligibleStudentList.data.some(student => student.selected);
      const selectedStudents = this.eligibleStudentList?.data.filter(student => student.selected);
      this.selectedStudent = student;
      await selectedStudents.map(el=>{
        el.first_name = el.student_first_name;
        el.last_name =  el.student_last_name;
        el.email =  el.student_email;
        el.email_id =  el.student_email;
        
      })
      console.log("this.selectedStudent", this.selectedStudent);
      // this.staffForm.reset();
      // this.partnerForm.reset();
      // this.placementTypeForm.reset();

      this.selectedRecords = selectedStudents.length === 0 ? [this.selectedStudent] : selectedStudents;
      console.log("this.selectedRecords", this.selectedRecords);
      if (this.selectedRecords?.length == this.eligibleStudentList.data.length) {
        this.selectAllStdnt = true;
      } else {
        this.selectAllStdnt = false;
      }
    }else{
      this.eligibleStudentList.data.map(el=>{
        if(el.selected){
          el.selected = false;
        }
      })
    }
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
}