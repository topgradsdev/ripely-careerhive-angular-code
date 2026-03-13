import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HttpResponseCode } from '../../../shared/enum';
import { debounceTime, distinctUntilChanged, finalize, lastValueFrom, of, Subject, switchMap, take, tap } from 'rxjs';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoaderService } from '../../../loaderservice.service';
import { LoaderCustomService } from 'src/app/loadercustomservice.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})

export class StudentsListComponent implements AfterViewInit {
  userForm: FormGroup;
  activeFilter: string = null;
  currentNotes: any = 'empty'
  @ViewChild('closeCreatePlacementModal') closeCreatePlacementModal;
  @ViewChild('closeResendOTPEmailStudentModal') closeResendOTPEmailStudentModal;
  @ViewChild('closeResendOTPEmailStudentBulkModal') closeResendOTPEmailStudentBulkModal;
  
  @ViewChild('reminderToStaffDone') reminderToStaffDone: ModalDirective;
  @ViewChild('successSendBulkEmail') successSendBulkEmail: ModalDirective;

  
  @ViewChild('addColumnPopup') addColumnPopup: ModalDirective;
  @ViewChild('addNewColumnPopup') addNewColumnPopup: ModalDirective;
  
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
  
  
  selectedParameters:any="";
  asignNextStep: boolean;
  filters = [
    { name: 'Simulation Groups', field: 'placementGroups', selected: false },
    { name: 'Major', field: 'major', selected: false },
    { name: 'Minor', field: 'minor', selected: false },
    { name: 'Priority', field: 'priority', selected: false },
    { name: 'Status', field: 'status', selected: false },
    { name: 'Assigned To', field: 'assigned_to', selected: false },
    { name: 'Location', field: 'post_code', selected: false },
    { name: 'Cohort start date', field: 'cohort_start_date', selected: false },
    { name: 'Cohort end date', field: 'cohort_end_date', selected: false },
    { name: 'Graduation date', field: 'graduation_date', selected: false },
    { name: 'WAM', field: 'gpa', selected: false },
    { name: 'Campus', field: 'campus', selected: false },
    { name: 'Year', field: 'year', selected: false },
    { name: 'internship start date', field: 'internship_start_date', selected: false },
    { name: 'internship end date', field: 'internship_end_date', selected: false },
    { name: 'Alumni', field: 'alumni', selected: false },
    { name: 'Course code', field: 'course_code', selected: false },
    { name: 'Placement Type', field: 'placementType', selected: false },
    { name: 'Degree Level', field: 'degree_level', selected: false },
    { name: 'Work Rights', field: 'work_authorization', selected: false },
    { name: 'Nationality', field: 'nationality', selected: false },
    { name: 'Course Name', field: 'course_name', selected: false },
    { name: 'Advocate Incident History', field: 'advocate_incident_history', selected: false },
    { name: 'Advocate Care History', field: 'advocate_care_history', selected: false },
    { name: 'Accessibility', field: 'accommodate_accessibility', selected: false },
    { name: 'Credit Point', field: 'credit_points', selected: false },
    { name: 'Unit Name', field: 'unit_name', selected: false },
    { name: 'Unit Code', field: 'unit_code', selected: false },
    { name: 'Delivery Mode', field: 'delivery_mode', selected: false },
    // { name: 'enrolment_date', selected: false },
    // { name: 'approvals', selected: false },
    // { name: 'Monthly Cohort', field: 'monthly_cohort', selected: false },
    // { name: 'course start date', field: 'course_start_date', selected: false },
    // { name: 'course end date', field: 'course_end_date', selected: false },
  
    // { name: 'Resume Level', field: 'resume_level', selected: false },
    // { name: 'Area', field: 'area', selected: false },
   
   
    
    // { name: 'Placement Doc Status', field: 'placement_doc_received', selected: false },
    // { name: 'Course Code', field: 'course_code', selected: false },
   
  ];



  get filteredParametes() {
    if (!this.selectedParameters) {
      return this.filters;
    }

    return this.filters.filter(company =>
      company.name.toLowerCase().includes(this.selectedParameters.toLowerCase())
    );
  }
  
  displayColumns: string[];
  columns = [
    { name: 'icon_alumi', visible: true },
    { name: 'checkbox', visible: true },
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
    { name: 'actions', visible: true }
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
  .map(col => {
  let label = col.name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());

  // Custom exceptions (exact matches)
  const customLabels: { [key: string]: string } = {
    lastupdatedby: 'Last Updated By',
    lastupdate: 'Last Update',
    primaryEmail: 'University Email',
    permanent_email: 'Permanent Email',
    alum:"Alumni",
    phone_no:"Phone No.",
    gpa:"WAM",
    addressLine1:"Address Line 01",
    permanentAddress:"Permanent Address",
    advocate_incident_history:"Incident History"
  };

  if (customLabels[col.name]) {
    label = customLabels[col.name];
  }

  return {
    ...col,
    label,
    value: col.name
  };
});
  // .map(col => ({
  //   ...col,
  //   label: this.formatColumnLabel(col.name)
  // }));
// .map(key => ({
//   label: key.name
//     .replace(/_/g, ' ')                   // Replace underscores with spaces
//     .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between camelCase words
//     .replace(/\b\w/g, c => c.toUpperCase()), // Capitalize first letters
//   name: key.name,
//   visible: true
// }));

  formatColumnLabel(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
  addStudentToPlacementColumn = ['_id', 'first_name', 'last_name', 'primary_email'];
  
selectedColumn:any = '';
direction:any = 'left';
selectedColumnToAdd: string = '';
openModelAddColumn(direction: 'left' | 'right', referenceCol: string){
  this.direction = direction;
  this.selectedColumn = referenceCol;
  this.selectedColumnToAdd = '';
  this.addColumnPopup.show();
}

openModelNewAddColumn(){
  this.addNewColumnPopup.show();
}

addColumn(): void {

  if (!this.selectedColumnToAdd || !this.selectedColumn) {
    console.warn("Column to add or reference column is not selected.");
    return;
  }

  // Remove the column if it already exists in displayColumns
  this.displayColumns = this.displayColumns.filter(col => col !== this.selectedColumnToAdd);

  // Find the index of the reference column
  const referenceIndex = this.displayColumns.findIndex(col => col === this.selectedColumn);
  if (referenceIndex === -1) {
    console.error("Reference column not found in the display columns.");
    return;
  }

  // Calculate insert position
  const insertIndex = this.direction === 'left' ? referenceIndex : referenceIndex + 1;

  // Insert new column name at the correct index
  this.displayColumns.splice(insertIndex, 0, this.selectedColumnToAdd);

  // Remove the added column from dropDownColumns
  this.dropDownColumns = this.dropDownColumns.filter(col => col.name !== this.selectedColumnToAdd);


  this.saveStudentColumn(this.displayColumns);
  // localStorage.setItem('displayColumns', JSON.stringify(this.displayColumns));

  // Reset state and hide popup
  this.selectedColumnToAdd = '';
  this.addColumnPopup?.hide();
}

 addNewColumn() {
    if (!this.selectedColumnToAdd) {
      console.warn("Column to add is not selected.");
      return;
    }

    // Avoid duplicates
    const existingIndex = this.displayColumns.indexOf(this.selectedColumnToAdd);
    if (existingIndex !== -1) {
      // If already present, remove it first
      this.displayColumns.splice(existingIndex, 1);
    }

    // Insert before the last column
    const insertIndex = Math.max(this.displayColumns.length - 1, 0);
    this.displayColumns.splice(insertIndex, 0, this.selectedColumnToAdd);

    // Save the updated columns
    this.saveStudentColumn(this.displayColumns);

    // Reset and close modal
    this.selectedColumnToAdd = '';
    this.addNewColumnPopup?.hide();
  }

get visibleColumns() {
  return this.columns.filter(col => this.displayColumns.includes(col.name));
}

// Add Column
// addColumn(direction: 'left' | 'right', referenceCol: string) {
//   const index = this.displayColumns.indexOf(referenceCol);
//   const newCol = `newCol_${Date.now()}`; // Example dynamic name
//   if (direction === 'right') {
//     this.displayColumns.splice(index + 1, 0, newCol);
//   } else {
//     this.displayColumns.splice(index, 0, newCol);
//   }
//   // Define how to render the new column if needed
// }
// moveColumn(direction: 'left' | 'right', columnName: string) {
//   const index = this.columns.findIndex(col => col.name === columnName);
//   console.log("index", index, columnName);
//   if (index === -1) return;

//   if (direction === 'left' && index > 0) {
//     [this.columns[index - 1], this.columns[index]] = [this.columns[index], this.columns[index - 1]];
//   } else if (direction === 'right' && index < this.columns.length - 1) {
//     [this.columns[index], this.columns[index + 1]] = [this.columns[index + 1], this.columns[index]];
//   }
//   // Trigger change detection by assigning a new reference
//   this.columns = [...this.columns]; 

//   this.updateDisplayedColumns();
// }

moveColumn(direction: 'left' | 'right', columnName: string) {
  const visibleColumns = this.columns.filter(col => col.visible);
  const index = visibleColumns.findIndex(col => col.name === columnName);
  if (index === -1) return;

  const targetIndex = direction === 'left' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= visibleColumns.length) return;

  // Get actual indices in the full columns array
  const colA = visibleColumns[index];
  const colB = visibleColumns[targetIndex];

  const fullIndexA = this.columns.findIndex(col => col.name === colA.name);
  const fullIndexB = this.columns.findIndex(col => col.name === colB.name);

  // Swap in full columns list
  [this.columns[fullIndexA], this.columns[fullIndexB]] = [this.columns[fullIndexB], this.columns[fullIndexA]];

  // Trigger change detection
  this.columns = [...this.columns];
  this.updateDisplayedColumns();
}


removeColumn(columnName: string) {
  const col = this.columns.find(c => c.name === columnName);
  if (col) {
    col.visible = false;
    this.updateDisplayedColumns();
  }
}

updateDisplayedColumns() {
  // Only columns with visible: true are shown
  this.displayColumns = this.columns
    .filter(col => col.visible)
    .map(col => col.name);
  this.saveStudentColumn(this.displayColumns);
  // localStorage.setItem('displayColumns', JSON.stringify(this.displayColumns));
}

showDisplayedColumns(){
    this.displayColumns = this.columns
    .filter(col => col.visible)
    .map(col => col.name);
// this.saveStudentColumn(this.displayColumns);
    // console.log('this.displayColumns', this.displayColumns)
}

saveStudentColumn(column){
  this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
   const payload = {
      'type':'student',
      created_by: this.userDetail._id,
      columns:column,
      updated_by: this.userDetail._id,
    }
    this.service.saveColumnStudent(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.getColumnStudents();
      } else {
        
      }
    }, (err)=>{
      console.log("error", err);
    })
}

getColumnStudents(){
  // this.showDisplayedColumns();
  // return false;
  this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
   const payload = {
     'type':'student',
      created_by: this.userDetail._id
    }
    this.service.getColumnStudents(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        if(response.data && response.data.columns){
          this.displayColumns = response.data.columns;
          // Set visibility in `columns` based on stored list
          this.columns.forEach(col => {
            col.visible = this.displayColumns.includes(col.name);
          });
        }else{
          this.showDisplayedColumns();
        }
      } else {
        this.showDisplayedColumns();
      }
    }, (err)=>{
       this.showDisplayedColumns();
      console.log("error", err);
    })
}

 checkColumnExist(){
    if(this.displayColumns.length>5){
      return false;
    }else{
      return true;
    }
  }

loadDisplayColumnsFromLocalStorage() {
  const stored = localStorage.getItem('displayColumns');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        this.displayColumns = parsed;

        // Set visibility in `columns` based on stored list
        this.columns.forEach(col => {
          col.visible = this.displayColumns.includes(col.name);
        });
      }
    } catch (e) {
      console.error("Failed to parse displayColumns from localStorage", e);
    }
  } else {
    // fallback: first time load
    this.updateDisplayedColumns();
  }
}
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
    placementGroups: [],
    major: [],
    priority: [],
    campus: [],
    status: [],
    post_code: [],
    area: [],
    monthly_cohort: [],
    resume_level: [],
    placement_doc_received: [],
    course_code: [],
    placementType: [],
    monthly_cohort_sdate: null,
    monthly_cohort_edate: null,
    course_start_sdate: null,
    course_start_edate: null,
    course_end_sdate: null,
    course_end_edate: null,
    internship_start_sdate: null,
    internship_start_edate: null
    ,internship_end_sdate: null,
    internship_end_edate: null,
    cohort_start_sdate: null,
    cohort_start_edate: null,
    cohort_end_sdate: null,
    cohort_end_edate: null,
    graduation_sdate: null,
    graduation_edate: null,
    credit_min_points:null,
    credit_max_points:null,
    gpa_min_points:null,
    gpa_max_points:null
  }
  gpaError:any = null;

  validateGPARange() {
  const min = this.filterParameters.gpa_min_points;
  const max = this.filterParameters.gpa_max_points;

  if (min > max) {
    this.gpaError = "Maximum WAM must be greater than or equal to Minimum WAM";
  } else {
    this.gpaError = null;
  }
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
    private router: Router,private loader: LoaderCustomService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.userForm = fb.group({});
  }

   ngAfterViewInit() {
    this.activeFilter = this.filters[0].field;
    // this.eligibleStudentList.sort = this.sort;
    // this.displayColumn();
    this.getColumnStudents();
    //  this.loadDisplayColumnsFromLocalStorage();
    this.prepareDisplayColumnFilter();
  }
loading:boolean = false;

  ngOnInit(): void {

   
    this.searchSubject.pipe(
  debounceTime(300),
  // Remove or customize distinctUntilChanged
  // distinctUntilChanged(),
  switchMap(keyword => {
    if (keyword && keyword.length >= 3) {
      this.paginationObj.pageIndex = 0;
      this.studentList = []; // reset on new search

      const payload = {
        ...this.searchCriteria,
        keywords: keyword,
        offset: this.paginationObj.pageIndex,
        limit: this.paginationObj.pageSize,
        is_archive: this.selectedIndex === 1 ? false : true
      };

      this.loader.show();
      this.loading = true;

      return this.service.searchStudent(payload).pipe(
        finalize(() => { 
          this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this.loader.hide();
          });
          this.loading = false;
         })
      );
    } else {
      this.eligibleStudentList.data = [];
      this.getEligibleStudents();
      return of(null);
    }
  })
).subscribe((response: any) => {
  if (!response) return;

  if (response.status === HttpResponseCode.SUCCESS) {
    this.paginationObj.length = response.count;

    this.studentList = response.result || [];
    this.eligibleStudentList.data = [...this.studentList];
    this.eligibleStudentList.sort = this.studentTbSort;
    this.cdr.detectChanges();

    // this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
    //   this.loader.hide();
    // });
  }
});

    this.getEligibleStudents();
    this.studentFilterOptions();
    this.getPlacementGroups("");
    this.getotherFilter();

    this.staffForm = this.fb.group({
      staff_id: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });

    this.reminderForm = this.fb.group({
      staff_id: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });


    
    this.partnerForm = this.fb.group({
      partner_id: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });

    this.placementTypeForm = this.fb.group({
      placementType: ["", [Validators.required]],
      placement_type_id: [""]
    });
    this.getStaffMembers();
     this.getsaveFilter(this.notepage);
  }

  btnTabs(index: number) {
    this.selectedIndex = index;

 
    this.searchCriteria.keywords = '';
    this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: true,
    };
    this.eligibleStudentList = new MatTableDataSource<any>([]);
    this.eligibleStudentList.data = []; 
    this.studentList = []; 
    if(index==2){
      setTimeout(() => {
        console.log('Tab 2 active - ready for infinite scroll');
        this.cdr.detectChanges();
      }, 1000);
    }
    this.getEligibleStudents();
    this.filterApply = false;
    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }

      
      if (el.field) {
        if(el.field === 'course_start_date'){
          this.filterParameters.course_start_sdate = null
          this.filterParameters.course_start_edate = null
        }else if(el.field === 'course_end_date'){
          this.filterParameters.course_end_sdate = null
          this.filterParameters.course_end_edate = null
        }else if(el.field === 'internship_start_date'){
          this.filterParameters.internship_start_sdate = null
          this.filterParameters.internship_start_edate = null
        }else if(el.field === 'internship_end_date'){
          this.filterParameters.internship_end_sdate = null
          this.filterParameters.internship_end_edate = null
        }else if(el.field === 'cohort_end_date'){
          this.filterParameters.cohort_end_sdate = null
          this.filterParameters.cohort_end_edate = null
        }else if(el.field === 'cohort_start_date'){
          this.filterParameters.cohort_start_sdate = null
          this.filterParameters.cohort_start_edate = null
        }else if(el.field === 'graduation_date'){
          this.filterParameters.graduation_sdate = null
          this.filterParameters.graduation_edate = null
        }else if(el.field === 'credit_points'){
          this.filterParameters.credit_max_points = null
          this.filterParameters.credit_min_points = null
        }else if(el.field === 'gpa'){
          this.filterParameters.gpa_min_points = null
          this.filterParameters.gpa_max_points = null
        }else{
          this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
        }
      }
    })
  }

  getPlcamentTypes(placementId) {
    if (!placementId) {
      return;
    }
    let payload = { placement_id: placementId };
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result;
      }
    });
  }

  getPlacementGroups(event) {
    const payload = {
      status: 'active',
      limit: 1000,
      offset: 0,
      keywords: event?.target?.value
    }
    // this.service.getPlacementGroups(payload).subscribe((res: any) => {
    //   this.placementGroups = res.result;
    // });
    this.service.getPublishPlacementGroups(payload).subscribe((res: any) => {
      this.placementGroups = res.result;
    });

  }

  getStaffMembers() {
    this.service.getStaffMembers({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffList = response.result;
      }
    })
  }

  studentFilterOptions() {
    this.service.studentFilterOptions().subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentFilters = response.result;
        // console.log("this.studentFilters", this.studentFilters);
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
        if(el.field === 'course_start_date'){
          this.filterParameters.course_start_sdate = null
          this.filterParameters.course_start_edate = null
        }else if(el.field === 'course_end_date'){
          this.filterParameters.course_end_sdate = null
          this.filterParameters.course_end_edate = null
        }else if(el.field === 'internship_start_date'){
          this.filterParameters.internship_start_sdate = null
          this.filterParameters.internship_start_edate = null
        }else if(el.field === 'internship_end_date'){
          this.filterParameters.internship_end_sdate = null
          this.filterParameters.internship_end_edate = null
        }else if(el.field === 'cohort_end_date'){
          this.filterParameters.cohort_end_sdate = null
          this.filterParameters.cohort_end_edate = null
        }else if(el.field === 'cohort_start_date'){
          this.filterParameters.cohort_start_sdate = null
          this.filterParameters.cohort_start_edate = null
        }else if(el.field === 'graduation_date'){
          this.filterParameters.graduation_sdate = null
          this.filterParameters.graduation_edate = null
        }else if(el.field === 'credit_points'){
          this.filterParameters.credit_max_points = null
          this.filterParameters.credit_min_points = null
        }else if(el.field === 'gpa'){
          this.filterParameters.gpa_min_points = null
          this.filterParameters.gpa_max_points = null
        }else{
          this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
        }
      }
    });
    this.paginationObj = {
      length: 0,
      pageIndex: 0,
      pageSize: this.paginationObj.pageSize,
      previousPageIndex: 0,
      changed: true,
    };
    
    if (this.eligibleStudentList) {
        this.eligibleStudentList.data = [];
    //  this.eligibleStudentList._updateChangeSubscription(); // Force table to update

    }
    this.eligibleStudentList = new MatTableDataSource<any>([]);
    this.eligibleStudentList.data = []; 
    this.studentList = []; 
    this.getEligibleStudents();
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
  getEligibleStudents() {
     this.filterApply = false;
    const payload = {
      limit: this.paginationObj.pageSize,
      student_filter:this.status,
      offset: this.paginationObj.pageIndex,
      is_archive: this.selectedIndex === 1 ? false : true
    }
    this.loader.show();
    this.service.getEligibleStudents(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.filterApply = false;
        this.overAllCount.eligibleStudent = response.eligibleStudent;
        this.overAllCount.pendingApproval = response.pendingApproval;
        this.overAllCount.pendingPlacement = response.pendingPlacement;
        this.overAllCount.placed = response.placed;
        this.overAllCount.terminated = response.terminated;
        this.paginationObj.length = response.total;

        const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.studentList.some(s => s._id === student._id)
        );

        this.studentList = [...this.studentList, ...filteredData];
        if(this.status == "is_placed_students"){
          this.filterCount = this.overAllCount.placed
        }else  if(this.status == "is_pending_placement"){
          this.filterCount = this.overAllCount.pendingPlacement
        }else if(this.status == "is_pending_approvals"){
          this.filterCount = this.overAllCount.pendingApproval
        }else if(this.status == "is_terminated_students"){
          this.filterCount = this.overAllCount.terminated
        }

        this.eligibleStudentList = new MatTableDataSource(this.studentList);
        
        // if (this.eligibleStudentList) {
        //   // Append new data to existing data
        //   this.eligibleStudentList.data = [...this.eligibleStudentList.data, ...response.result];
        // } else {
        //   // First time assignment
        //   this.eligibleStudentList = new MatTableDataSource(response.result);
        // }
        this.eligibleStudentList?.data.forEach(student => {
          student.selected = false;
        })
        this.eligibleStudentList.sort = this.studentTbSort;
          this.cdr.detectChanges();

        // Run loader hide inside Angular zone after render
        this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
          this.loader.hide();
        });
        this.resetCheckBox();
        // console.log("this.eligibleStudentList", this.eligibleStudentList);
      } else {
        
        // this.eligibleStudentList = [];
        // this.studentList =[];
        // this.overAllCount.eligibleStudent = 0;
        // this.overAllCount.pendingApproval = 0;
        // this.overAllCount.pendingPlacement = 0;
        // this.overAllCount.placed = 0;
        // this.overAllCount.terminated =0;
        // this.paginationObj.length = 0;
         this.loader.hide();
      }
    })
  }

  notes(e: any) {
    this.currentNotes = e;
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
   isManualFilter: boolean = false;

   resetfilter(){
      this.filterList = [];
      this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: false,
      };
   }

  //  @ViewChild(MatTable) table!: MatTable<any>;

  // filter:boolean = true;
  getPaginationData(event) {
    this.paginationObj = event;
    //   if (this.isManualFilter) {
    //   this.isManualFilter = false; // reset for next pagination
    //   return;
    // }
    // this.filterApply = true;

    console.log("this.filterList", this.filterList);
    // console.log("this.filterList", this.filterList)
    if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      // if (this.eligibleStudentList) {
      //   this.eligibleStudentList.data = [];
      //   // this.eligibleStudentList._updateChangeSubscription(); // Force table to update
      // }
      this.searchEligibleStudents()
      // alert("search")
      //  this.searchSubject.next(this.searchCriteria.keywords);
    } else if (!this.searchCriteria.keywords) {
      if(this.filterList && this.filterList.length>0){
        // if (this.eligibleStudentList) {
        //     this.eligibleStudentList.data = [];
        // // this.eligibleStudentList._updateChangeSubscription(); // Force table to update

        // }
    
        this.onApplyFilter()
      }else{
        this.getEligibleStudents();
      }
    }else{
      if(this.filterList && this.filterList.length>0){
        // if (this.eligibleStudentList) {
        //     this.eligibleStudentList.data = [];
        // // this.eligibleStudentList._updateChangeSubscription(); // Force table to update

        // }
      
        this.onApplyFilter()
      }else{
        this.getEligibleStudents();
      }
    }
    this.resetCheckBox();
  }


  
  onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.eligibleStudentList.data.length, this.eligibleStudentList.data.length>=this.paginationObj.length, this.eligibleStudentList.data.length<=this.paginationObj.length  )
    // if(this.paginationObj.length<10)return;
      if ((this.eligibleStudentList?.data?.length || 0) >= (this.paginationObj?.length || 0)) {
        return; // already loaded all items
      }
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

  // getStaffName(id) {
  //   const staff = this.staffList.find(staff => staff._id === id);
  //   return staff?.first_name + " " + staff?.last_name;
  // }


  staffName:any = '';
  async getStaffvalue(){
    // console.log(this.reminderForm);
    console.log(this.reminderForm.value.staff_id, this.staffList);
    if(this.reminderForm.value.staff_id){
      const staff =await this.staffList.find(staff => staff._id === this.reminderForm.value.staff_id);
      // console.log("staff", staff)
      this.staffName = staff?.first_name + " " + staff?.last_name;
    }
    if(this.staffForm.value.staff_id){
      const staff =await this.staffList.find(staff => staff._id === this.staffForm.value.staff_id);
      // console.log("staff", staff)
      this.staffName = staff?.first_name + " " + staff?.last_name;
    }
  }

  editStudent(payload) {
    this.service.editStudent(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Student data updated successfully"
      });
         if (this.searchCriteria.keywords ) {
          // this.searchEligibleStudents()
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
           this.searchSubject.next(this.searchCriteria.keywords);
        } else if (!this.searchCriteria.keywords) {
          if(this.filterList && this.filterList.length>0){
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.onApplyFilter()
          }else{
            this.getEligibleStudents();
          }
        }else{
          if(this.filterList && this.filterList.length>0){
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.onApplyFilter()
          }else{
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.getEligibleStudents();
          }
        }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  changeSelecStatus(student) {
    const payload = {
      student_id: [student._id],
      status: student.status
    };
    this.editStudent(payload);
  }



  onAlumniChange(event: MatCheckboxChange, row: any): void {
  console.log('Checkbox changed:', event.checked, 'for row:', row);
  // row.alumni = event.checked;
  // You can handle further logic here like calling a service or updating the backend
   const payload = {
      student_id: [row._id],
      alumni: event.checked
    };
    this.editStudent(payload);
}


 onDeliveryModeChange(row: any): void {
  // console.log('Checkbox changed:', event.checked, 'for row:', row);
  // row.alumni = event.checked;
  // You can handle further logic here like calling a service or updating the backend
   const payload = {
      student_id: [row._id],
      delivery_mode: row.delivery_mode
    };
    this.editStudent(payload);
}

 onApplicantTypeChange(row: any): void {
  // console.log('Checkbox changed:', event.checked, 'for row:', row);
  // row.alumni = event.checked;
  // You can handle further logic here like calling a service or updating the backend
   const payload = {
      student_id: [row._id],
      applicant_type: row.applicant_type
    };
    this.editStudent(payload);
}



  getNewStudents(event) {
    if (event === "back") {
      this.isAddNewStudent = false;
    } else if (event === "next") {
        if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
          // this.searchEligibleStudents()
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
           this.searchSubject.next(this.searchCriteria.keywords);
        } else if (!this.searchCriteria.keywords) {
          if(this.filterList && this.filterList.length>0){
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.onApplyFilter()
          }else{
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.getEligibleStudents();
          }
        }else{
          if(this.filterList && this.filterList.length>0){
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.onApplyFilter()
          }else{
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.getEligibleStudents();
          }
        }
    } else {
      this.isAddNewStudent = false;
         if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      // this.searchEligibleStudents()
      this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
       this.searchSubject.next(this.searchCriteria.keywords);
    } else if (!this.searchCriteria.keywords) {
      if(this.filterList && this.filterList.length>0){
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.onApplyFilter()
      }else{
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.getEligibleStudents();
      }
    }else{
      if(this.filterList && this.filterList.length>0){
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.onApplyFilter()
      }else{
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.getEligibleStudents();
      }
    }
    }
  }

  exportStudentData(type) {
    // console.log("selectedRecords" , this.selectedRecords, this.eligibleStudentList.data)
    const payload = {
      type,
      // student_id:  this.eligibleStudentList.data.length > 0 ?  this.eligibleStudentList.data.map(student => student._id) : undefined,
      is_archive:this.selectedIndex === 1 ? false : true,
      // student_id: this.selectedRecords.length > 0 ? this.selectedRecords.map(student => student._id) : undefined,
    }
    this.service.exportStudents(payload).subscribe((res: any) => {
      // console.log("res", res);
      this.resetCheckBox();
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  exportStudentData1(type) {
  
    const payload = {
      type,
      student_id:  this.selectedRecords.length > 0 ?  this.selectedRecords.map(student => student._id) : undefined,
      is_archive:this.selectedIndex === 1 ? false : true,
      // student_id: this.selectedRecords.length > 0 ? this.selectedRecords.map(student => student._id) : undefined,
    }
    this.service.exportStudents(payload).subscribe((res: any) => {
      // console.log("res", res);
      this.resetCheckBox();
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  selectStudent(student) {
    if(student){
      this.isCheck = this.eligibleStudentList.data.some(student => student.selected);
      const selectedStudents = this.eligibleStudentList?.data.filter(student => student.selected);
      this.selectedStudent = student;
      this.staffForm.reset();
      this.partnerForm.reset();
      this.placementTypeForm.reset();
      this.selectedRecords = selectedStudents.length === 0 ? [this.selectedStudent] : selectedStudents;
      if (this.selectedRecords?.length == this.eligibleStudentList.data.length) {
        this.selectAllStdnt = true;
      } else {
        this.selectAllStdnt = false;
      }
      this.getPlcamentTypes(student?.placement_id);
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

  assignToStaff() {
    const payload = {
      student_id: [this.selectedStudent._id],
      staff_id: this.staffForm.value.staff_id,
      assign_staff_description: this.staffForm.value.description
    };
    this.editStudent(payload);
  }

  assignToPartner() {
    const payload = {
      student_id: [this.selectedStudent._id],
      partner_id: this.partnerForm.value.staff_id,
      assign_partner_description: this.partnerForm.value.description
    };
    this.editStudent(payload);
  }

  selectPlacementType(event) {
    const placementType = this.placementTypes.find(placement => placement.workflow_type_id === event)
    this.placementTypeForm.patchValue({
      placementType: placementType.type,
      placement_type_id: placementType.workflow_type_id
    });
  }

  assignPlacementType() {
    const payload = {
      student_id: [this.selectedStudent._id],
      placementType: this.placementTypeForm.value.placementType,
      placement_type_id: this.placementTypeForm.value.placement_type_id
    };
    this.editStudent(payload);
  }

  changeStudentPriority(student) {
    const payload = {
      student_id: [student._id],
      priority: student.priority
    };
    this.editStudent(payload);
  }

  changeSelectLevel(student) {
    const payload = {
      student_id: [student._id],
      resume_level: student.resume_level
    };
    this.editStudent(payload);
  }

  changePlacementDocReceived(student) {
    const payload = {
      student_id: [student._id],
      placement_doc_received: student.placement_doc_received
    };
    this.editStudent(payload);
  }

  changeStudentStatus(student) {
    const payload = {
      student_id: [student._id],
      status: student.status
    };
    this.editStudent(payload);
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
    // console.log('Checkbox changed:', event.checked);
    // console.log('this.filters:', this.filters, 'this.filterParameters:', this.filterParameters, 'filter:', filter);
  
    filter.selected = event.checked;

    if (event.checked) {
      // console.log('Checkbox is selected');
      // Add logic for when the checkbox is selected, if needed.
    } else {
      // console.log('Checkbox is deselected');
      this.filters.forEach((el) => {
        console.log("filter.field", filter.field, el.field)
        if (filter.field === el.field) {
          this.filterParameters[filter.field] = []; // Corrected 'field' to 'filter.field'
          if(el.field==="post_code"){
            this.filterParameters['state'] = '';
            this.filterParameters['suburb'] = '';
          }
        }
        


        if(filter.field === 'course_start_date'){
          this.filterParameters.course_start_sdate = null
          this.filterParameters.course_start_edate = null
        }
        if(filter.field === 'course_end_date'){
          this.filterParameters.course_end_sdate = null
          this.filterParameters.course_end_edate = null
        }
        if(filter.field === 'internship_start_date'){
          this.filterParameters.internship_start_sdate = null
          this.filterParameters.internship_start_edate = null
        }
        if(filter.field === 'internship_end_date'){
          this.filterParameters.internship_end_sdate = null
          this.filterParameters.internship_end_edate = null
        }

        if(el.field === 'gpa'){
          this.filterParameters.gpa_min_points = null
          this.filterParameters.gpa_max_points = null
        }

        if(el.field === 'credit_points'){
          this.filterParameters.credit_max_points = null
          this.filterParameters.credit_min_points = null
        }

        if(filter.field === 'cohort_end_date'){
          this.filterParameters.cohort_end_sdate = null
          this.filterParameters.cohort_end_edate = null
        }
        //  if(filter.field === 'cohort_end_date'){
        //   this.filterParameters.cohort_end_sdate = null
        //   this.filterParameters.cohort_end_edate = null
        // }
        if(filter.field === 'cohort_start_date'){
          this.filterParameters.cohort_start_sdate = null
          this.filterParameters.cohort_start_edate = null
        }if(filter.field === 'graduation_date'){
          this.filterParameters.graduation_sdate = null
          this.filterParameters.graduation_edate = null
        }
      });
    }
  }

   addFilter() {
    console.log("this.filterParameters", this.filterParameters)
   }
  

   async callFilter(data){

    this.paginationObj = {
          length: 0,
          pageIndex: this.paginationObj.pageIndex,
          pageSize: this.paginationObj.pageSize,
          previousPageIndex: 0,
          changed: false,
    }; 
    this.filterParameters = data.filters;
    // Reset scroll position
    const container = document.querySelector('.table-responsive');
    if (container) container.scrollTop = 0;
    // this.filterApply = true;
    console.log("this.", this.filters)

    const fieldMapping: Record<string, string[]> = {
    internship_start_date: ["internship_start_sdate", "internship_start_edate"],
    internship_end_date: ["internship_end_sdate", "internship_end_edate"],
    course_start_date: ["course_start_sdate", "course_start_edate"],
    course_end_date: ["course_end_sdate", "course_end_edate"],
    cohort_start_date: ["cohort_start_sdate", "cohort_start_edate"],
    cohort_end_date: ["cohort_end_sdate", "cohort_end_edate"],
    graduation_date: ["graduation_sdate", "graduation_edate"],
    credit_points: ["credit_min_points", "credit_max_points"],
    gpa: ["gpa_min_points", "gpa_max_points"],
  };

// // ✅ Unified filter processing
// this.filters = this.filters.map((option) => {
//   // Get all keys that correspond to this option
//   const keys = fieldMapping[option.field] || [option.field];

//   // Collect values from filterParameters
//   const values = keys.map((k) => this.filterParameters[k]);

//   // Determine if this option should be marked selected
//   const isSelected = values.some((val) => {
//     if (Array.isArray(val)) return val.length > 0;
//     if (typeof val === "string") return val.trim() !== "";
//     if (typeof val === "number") return true;
//     return val != null;
//   });

//   // Handle special cases that need activeFilter updates
//   if (isSelected) {
//     switch (option.field) {
//       case "cohort_start_date":
//       case "cohort_end_date":
//       case "graduation_date":
//       case "credit_points":
//       case "gpa":
//         this.activeFilter = option.field;
//         break;

//       case "state":
//         this.activeFilter = "post_code";
//         break;
//     }
//   }

//   return { ...option, selected: isSelected };
// });



this.filters = this.filters.map((option) => {
  const keys = fieldMapping[option.field] || [option.field];

  // Collect all possible values for this option
  const values = keys.map((k) => data.filters[k]);

    // Collect all possible values for this option
  // const values = keys.map((k) => data.filters[k]);
  switch (option.field) {
    case 'course_start_date':
      if (this.filterParameters.course_start_sdate || this.filterParameters.course_start_edate) {
        option.selected = true;
      }
      break;

    case 'course_end_date':
      if (this.filterParameters.course_end_sdate || this.filterParameters.course_end_edate) {
        option.selected = true;
      }
      break;

    case 'internship_start_date':
      if (this.filterParameters.internship_start_sdate || this.filterParameters.internship_start_edate) {
        option.selected = true;
          this.activeFilter = 'internship_start_date';
      }
      break;

    case 'internship_end_date':
      if (this.filterParameters.internship_end_sdate || this.filterParameters.internship_end_edate) {
        option.selected = true;
         this.activeFilter = 'internship_end_date';
      }
      break;

    case 'cohort_start_date':
      if (this.filterParameters.cohort_start_sdate || this.filterParameters.cohort_start_edate) {
        option.selected = true;
        this.activeFilter = 'cohort_start_date';
      }
      break;

    case 'cohort_end_date':
      if (this.filterParameters.cohort_end_sdate || this.filterParameters.cohort_end_edate) {
        option.selected = true;
        this.activeFilter = 'cohort_end_date';
      }
      break;

    case 'graduation_date':
      if (this.filterParameters.graduation_sdate || this.filterParameters.graduation_edate) {
        option.selected = true;
        this.activeFilter = 'graduation_date';
      }
      break;

    case 'credit_points':
      if (this.filterParameters.credit_min_points || this.filterParameters.credit_max_points) {
        option.selected = true;
        this.activeFilter = 'credit_points';
      }
      break;

    case 'gpa':
      if (this.filterParameters.gpa_min_points || this.filterParameters.gpa_max_points) {
        option.selected = true;
        this.activeFilter = 'gpa';
      }
      break;

    case 'state':
      if (this.filterParameters['state'] || this.filterParameters['suburb']) {
        option.selected = true;
        this.activeFilter = 'post_code';
      }
      break;
  }

  // return {
  //   ...option,
  //   selected: option.selected || ( // ✅ keep `true` if already set
  //     Array.isArray(val) ? val.length > 0 :
  //     typeof val === 'string' ? val.trim() !== '' :
  //     typeof val === 'number' ? true :
  //     val !== null && val !== undefined
  //   )
  // };
   const selected = values.some((val) => {
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "string") return val.trim() !== "";
    if (typeof val === "number") return true;
    return val != null;
  });
  this.eligibleStudentList = new MatTableDataSource<any>([]);
  this.eligibleStudentList.data = []; 
  this.studentList = []; 

  return { ...option, selected };
});
  this.cleardata();
    console.log("this.111", this.filters)

    

    this.onApplyFilter()
   }


   cleardata(){
    this.paginationObj.pageIndex=0;

    // Reset scroll position
    const container = document.querySelector('.table-responsive');
    if (container) container.scrollTop = 0;
     this.eligibleStudentList = new MatTableDataSource<any>([]);
    this.eligibleStudentList.data = []; 
    this.studentList = []; 
   }
  filterApply:boolean = false;
  filterList:any = [];
  @ViewChild('closeFilterModal') closeFilterModal;
  async onApplyFilter() {
    // alert("filter");
    this.isManualFilter = true;
    this.paginationObj = {
          length: 0,
          pageIndex: this.paginationObj.pageIndex,
          pageSize: this.paginationObj.pageSize,
          previousPageIndex: 0,
          changed: false,
    }; 
   
    console.log("this.paginationObj", this.paginationObj, this.filters);


    let previousFilterList = [...this.filterList];
    const payload = {
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex
    };
    // console.log("this.filters", this.filters, "this.filterParameters", this.filterParameters);
    this.filterList = [];
    let isValid = true;
    await this.filters.forEach(async(filter) => {
      // let value = this.filterParameters[filter.field];
    
    if (filter.selected) {
        this.filterList.push(filter.name);
        // console.log(this.filterList);
    
        // Update the field for 'Location' if selected
        if (filter.name === 'Location') {
            filter.field = "state";
        }
        console.log("filter.field", filter.field);
    
        // Handle date fields
        if (filter.field === 'monthly_cohort') {
            Object.assign(payload, {
                monthly_cohort_sdate: moment(this.filterParameters.monthly_cohort_sdate).format("DD/MM/YYYY"),
                monthly_cohort_edate: moment(this.filterParameters.monthly_cohort_edate).format("DD/MM/YYYY"),
            });
        } else if (filter.field === 'placementGroups') {
          console.log(this.filterParameters[filter.field], "this.filterParameters[filter.field]")
         let projectPlacementGroups = [];
        let placementGroups = [];

        this.filterParameters[filter.field].forEach(el => {
         const projectMatches = this.studentFilters.placementGroups
          .filter(e => e._id === el && e.type === 'project')
          .map(e => e._id); // Only keep _id

        const placementMatches = this.studentFilters.placementGroups
          .filter(e => e._id === el && e.type !== 'project')
          .map(e => e._id);

          projectPlacementGroups.push(...projectMatches);
          placementGroups.push(...placementMatches);
        });
    //       "placementGroups": [
    //     "682add60067f0b306ad97c09"
    // ],
    // "projectPlacementGroups": [ "6809c7a1d4ed2d64202f03a4" ],

            Object.assign(payload, {
                projectPlacementGroups: projectPlacementGroups,
                placementGroups: placementGroups,
            });
        } else if (filter.field === 'course_start_date') {
            Object.assign(payload, {
                course_start_sdate: moment(this.filterParameters.course_start_sdate).format("DD/MM/YYYY"),
                course_start_edate: moment(this.filterParameters.course_start_edate).format("DD/MM/YYYY"),
            });
        } else if (filter.field === 'course_end_date') {
            Object.assign(payload, {
                course_end_sdate: moment(this.filterParameters.course_end_sdate).format("DD/MM/YYYY"),
                course_end_edate: moment(this.filterParameters.course_end_edate).format("DD/MM/YYYY"),
            });
        } else if (filter.field === 'internship_start_date') {
            Object.assign(payload, {
                internship_start_sdate: moment(this.filterParameters.internship_start_sdate).format("DD/MM/YYYY"),
                internship_start_edate: moment(this.filterParameters.internship_start_edate).format("DD/MM/YYYY"),
            });
        } else if (filter.field === 'cohort_start_date') {
            Object.assign(payload, {
                cohort_start_sdate: moment(this.filterParameters.cohort_start_sdate).format("DD/MM/YYYY"),
                cohort_start_edate: moment(this.filterParameters.cohort_start_edate).format("DD/MM/YYYY"),
            });
        }  else if (filter.field === 'cohort_end_date') {
            Object.assign(payload, {
                cohort_end_sdate: moment(this.filterParameters.cohort_end_sdate).format("DD/MM/YYYY"),
                cohort_end_edate: moment(this.filterParameters.cohort_end_edate).format("DD/MM/YYYY"),
            });
        }  else if (filter.field === 'graduation_date') {
            Object.assign(payload, {
                graduation_sdate: moment(this.filterParameters.graduation_sdate).format("DD/MM/YYYY"),
                graduation_edate: moment(this.filterParameters.graduation_edate).format("DD/MM/YYYY"),
            });
        }  else if (filter.field === 'internship_end_date') {
            Object.assign(payload, {
                internship_end_sdate: moment(this.filterParameters.internship_end_sdate).format("DD/MM/YYYY"),
                internship_end_edate: moment(this.filterParameters.internship_end_edate).format("DD/MM/YYYY"),
            });
        }  else if (filter.field === 'credit_points') {
            Object.assign(payload, {
                credit_min_points: this.filterParameters.credit_min_points,
                credit_max_points: this.filterParameters.credit_max_points,
            });
        }  else if (filter.field === 'gpa') {
            Object.assign(payload, {
                gpa_min_points: this.filterParameters.gpa_min_points,
                gpa_max_points: this.filterParameters.gpa_max_points,
            });
        }  else if (filter.field === 'state') {

          console.log({
                state: this.filterParameters['state'],
                suburb: this.filterParameters['suburb'],
                post_code: this.filterParameters['post_code'],
            })
            Object.assign(payload, {
                state: this.filterParameters['state'],
                suburb: this.filterParameters['suburb'],
                post_code: this.filterParameters['post_code'],
            });
        } else {
          this.filterParameters[filter.field]
            // Handle other fields
            let value =  this.filterParameters[filter.field];
            Object.assign(payload, { [filter.field]: value});

            // console.log("payloadpayload", payload, filter.field,  this.filterParameters[filter.field]);
        }
    }
    
    // else {
    //     // Validate filter parameters
    //    await Object.entries(this.filterParameters).forEach(async([key, value]) => {
    //         if (value) {
            
    //           let find = await this.filters.find(el=>el.field==key);
            
    //           if(find){
    //             if (Array.isArray(value) && value.length > 0 && !find.selected) {
    //               // console.log(key, value); 
    //               this.service.showMessage({
    //                   message: "Please select the checkbox for filter parameters.",
    //               });
    //               isValid = false;
    //               return true;
    //           } else if (typeof value === "object" && Object.keys(value).length > 0 && !find.selected) {
    //               this.service.showMessage({
    //                   message: "Please select the checkbox for filter parameters.",
    //               });
    //               isValid = false;
    //               return true;
    //           } else if (typeof value !== "object" && typeof value !== "function" && !find.selected) {
    //               this.service.showMessage({
    //                   message: "Please select the checkbox for filter parameters.",
    //               });
    //               isValid = false;
    //               return true;
    //           }
    //           }

               
    //         }
    //     });
    // }
    
    
  });
    // Stop execution if validation fails
    if (await !isValid) {
      return;
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
      // console.log("Filter list unchanged, skipping pagination reset.");
  }
    
   await this.closeFilterModal.ripple.trigger.click();
    this.loader.show();
    payload['is_archive'] = this.selectedIndex === 1 ? false : true;

    console.log("payload", payload);
    if(this.selectedFilter && this.selectedFilter._id){
      this.filterApply = true;
      this.status= false;
    }else{
     
    }
    
    
    this.service.studentFilter(payload).subscribe((response) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        // if(this.filterList.length>0){
        //   this.filterApply = true;
        // }
          if(this.selectedFilter && this.selectedFilter._id){
            this.status= false;
          }else{
             this.filterApply = true;
          }
       
        this.filterCount =  response.count?response.count: response.result.length;
        this.studentList = [...this.studentList, ...response.result];
        this.eligibleStudentList = new MatTableDataSource(this.studentList);
        // this.eligibleStudentList.data = [...this.eligibleStudentList.data, ...response.result];
        //  if (this.eligibleStudentList) {
        //   // Append new data to existing data
        //   this.eligibleStudentList.data = [...this.eligibleStudentList.data, ...response.result];
        // } else {
        //   // First time assignment
        //   this.eligibleStudentList = new MatTableDataSource(response.result);
        // }
        this.paginationObj.length = response.count?response.count: response.result.length;
        this.eligibleStudentList?.data.forEach(student => {
          student.selected = false;
        })
        this.eligibleStudentList.sort = this.studentTbSort;
        this.cdr.detectChanges();

        // Run loader hide inside Angular zone after render
        this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
          this.loader.hide();
        });
        this.resetCheckBox();
      } else {
        this.filterApply = true;
        this.filterCount = 0;
        // this.studentList = [];
        // this.eligibleStudentList = [];
        this.service.showMessage({
          message: "Students not found for applied filters"
        });
         this.loader.hide();
      }
    })
  }

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
    this.filterList=[]; 
    this.filterApply = false; 
    this.resetfilter()
      // this.searchEligibleStudents()
      this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
      this.searchSubject.next(this.searchCriteria.keywords);
      this.resetCheckBox();
    } else if (!this.searchCriteria.keywords) {
      this.eligibleStudentList = new MatTableDataSource<any>([]);
      this.eligibleStudentList.data = []; 
      this.studentList = []; 
      this.getEligibleStudents();
      this.resetCheckBox();
    }
  }

  isSearchResponse:boolean = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  searchEligibleStudents() {
    // this.studentList = [];
    const payload = {
      ...this.searchCriteria,
      offset:this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize,
      is_archive: this.selectedIndex === 1 ? false : true
    }
    this.isSearchResponse = true;
    this.loader.show();
    this.service.searchStudent(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.paginationObj.length = response.count;
        // this.studentList = [...this.studentList, ...response.result];
        const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.studentList.some(s => s._id === student._id)
        );

        console.log("filteredData", filteredData);

        this.studentList = [...this.studentList, ...filteredData];
        console.log("filterthis.studentListedData", this.studentList);
        this.eligibleStudentList.data = [...this.studentList];
        this.eligibleStudentList.sort = this.studentTbSort;
        this.loader.hide();
        this.isSearchResponse = false;
        this.resetCheckBox();
      } else {
        this.paginationObj.length = 0;
        // this.eligibleStudentList = [];
        this.loader.hide();
        this.isSearchResponse = false;
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

  getStatusClassNames(studentPriority) {
    let className = 'custom_dorp_select ';
    const priorityClass = this.priorityClass.find(priority => priority.type === studentPriority);
    if (priorityClass) {
      return `${className} ${priorityClass.class}`;
    }
  }

  type:any = '';

  async validateCanAddToPlacementGroup() {
    this.selectedStudentsCanAddToPlacementGroup = this.eligibleStudentList.data.filter(company => company.selected).map(company => company._id);
    this.selectedPlacementGroupToAdd = this.placementGroups.find(placemenGroup => placemenGroup._id == this.placemenGroupIds);

    if (this.selectedStudentsCanAddToPlacementGroup.length === 0) {
      return;
    }

    const payload = {
      student_ids: this.selectedStudentsCanAddToPlacementGroup
    }

    let find =await this.placementGroups.find(el=>el._id===this.placemenGroupIds);

    if(find.category_id == "65a21e64fa6a8e4f5b252994"){
      this.type = "project";
    }else{
      this.type = "internship";
    }

    this.service.getUnplacementStudent(payload).subscribe((res: any) => {
      if (res.status != HttpResponseCode.SUCCESS) {
       
        if(find.category_id == "65a21e64fa6a8e4f5b252994"){
          this.addStudentList = new MatTableDataSource(res.result);
          this.allStudentAddPopUp.ripple.trigger.click();
         
          this.addToPlacementGroup();
          return;
        }else{
          
        //No students can be added in a Simulation Group
        this.noStudentsAddPopUp.ripple.trigger.click();
        }
      } else if (res.result.length && res.result.length != this.selectedStudentsCanAddToPlacementGroup.length) {
        //Partial students can be added in a Simulation Group
        
        if(find.category_id == "65a21e64fa6a8e4f5b252994"){
          this.addStudentList = new MatTableDataSource(res.result);
          this.allStudentAddPopUp.ripple.trigger.click();
          this.addToPlacementGroup();
          return;
        }else{
          this.type = "internship";
          this.addStudentList = new MatTableDataSource(res.result);
          this.partialStudentAddPopup.ripple.trigger.click();
        }
      } else {
        //All students can be added in a Simulation Group
        this.addStudentList = new MatTableDataSource(res.result);
        this.allStudentAddPopUp.ripple.trigger.click();
        this.addToPlacementGroup();
      }
      this.selectedRecords = [];
    })

 
  }

  addToPlacementGroup() {

    const selectedStudents = this.addStudentList.data.map(company => company._id);
    let selectedStudentsCanAddToPlacementGroup = this.eligibleStudentList.data.filter(company => company.selected).map(company => company._id);

    // console.log(" this.selectedStudentsCanAddToPlacementGroup",  selectedStudentsCanAddToPlacementGroup)

    if(this.type == 'project'){
      this.addStudentList.data = selectedStudentsCanAddToPlacementGroup;
    }
    const payload = {
      student_ids:this.type == 'project'? selectedStudentsCanAddToPlacementGroup:selectedStudents ,
      placement_id: this.placemenGroupIds,
      type:this.type
    }

    // console.log("payload", payload);

    // return false;

    this.service.updateStudentPlacement(payload).subscribe((res: any) => {
      if (res.status === HttpResponseCode.SUCCESS) {
        // this.addStudentList.data = [];
        this.placemenGroupIds = null;
        if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
          // this.searchEligibleStudents()
          this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
          this.searchSubject.next(this.searchCriteria.keywords);
        } else if (!this.searchCriteria.keywords) {
          if(this.filterList && this.filterList.length>0){
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.paginationObj.pageIndex = 0;
            this.onApplyFilter()
          }else{
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
           this.paginationObj.pageIndex = 0;
            this.getEligibleStudents();
          }
        }else{
          if(this.filterList && this.filterList.length>0){
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.paginationObj.pageIndex = 0;
            this.onApplyFilter()
          }else{
            this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
            this.paginationObj.pageIndex = 0;
            this.getEligibleStudents();
          }
        }
        this.service.showMessage({ message: res.msg });
      }
    })
  }

  working_hours: any;
  changeStudentHours(student) {
    // console.log(student, "- - - - - -", this.working_hours);
    // return false;
    // if (this.working_hours && student.id) {
    // console.log("editCompnayeditCompnayeditCompnay")
    const payload = {
      student_id: [student._id],
      hours_weeks: this.working_hours
    };
    this.editStudent(payload);
    this.closeCreatePlacementModal.ripple.trigger.click();
    // }

  }

  getVacancyStudent(student) {
    this.selectedStudent = student;
    const payload = {
      student_id: student._id
    }
    this.vacancyStudentDetail = [];
    this.service.getVacancyStudent(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.vacancyStudentDetail = res.result;
      } else {
        this.service.showMessage({
          message: res.msg
        });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  reSendOtpEmail() {
    let body = {
      "student_id" :[this.selectedStudent._id]
    };
    this.service.resendOTPEamilStudent(body).subscribe(res => {
      if (res.status == 200) {
        this.service.showMessage({ message: res.msg });
        this.closeResendOTPEmailStudentModal.ripple.trigger.click();
        this.selectedStudent = {};
      } else {
        this.service.showMessage({ message: res.msg });
      }
    }, err => {

      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );


  }


  reSendOtpEmailBulk() {
    let body = {
      "student_id" : this.selectedRecords.length > 0 ? this.selectedRecords.map(student => student._id) : undefined,
    };
    this.service.resendOTPEamilStudent(body).subscribe(res => {
      if (res.status == 200) {
      
        this.closeResendOTPEmailStudentBulkModal.ripple.trigger.click();
        this.successSendBulkEmail.show();
        this.service.showMessage({ message: res.msg });
        this.selectedStudent = {};
        this.selectedRecords = [];
        this.isCheck = false;
      } else {
        this.service.showMessage({ message: res.msg });
      }
    }, err => {

      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );
  }


 
  addnote:boolean = false;
  note:any = '';
  selectedNode:any 
  deleteNote(){
   
    let body = {
      "_id": this.selectedNode._id,
    }
    this.service.deleteStudentNote(body).subscribe(res => {
      if (res.status == 200) {
        this.addnote = false;
        this.selectedNode = null;
        this.getNotes(this.notepage);
        this.closeConfirmDeleteModal.ripple.trigger.click();
      } else {
        this.service.showMessage({ message: res.msg });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );
  }

  notepage: number = 0;
notelimit: number = 5;
totalNotes: number = 0;
totalNoteList: number = 0;
noteList: any[] = [];

getNotes(page: number) {
  this.notepage = page;

  const body = {
    student_id: this.selectedStudent._id,
    limit: this.notelimit,
    offset: this.notepage // ✅ Corrected!
  };

  this.service.getStudentNote(body).subscribe(
    (res) => {
      if (res.status === 200) {
        this.totalNoteList = res.count;
        this.totalNotes = Math.ceil(res.count / this.notelimit);
        this.noteList = res.result;
      } else {
        this.noteList = [];
      }
    },
    (err) => {
      this.noteList = [];
      this.service.showMessage({
        message: err?.error?.errors?.msg || 'Something went wrong'
      });
    }
  );
}
  

get startNoteIndex(): number {
  return this.totalNoteList === 0 ? 0 : this.notepage * this.notelimit + 1;
}

get endNoteIndex(): number {
  return Math.min((this.notepage + 1) * this.notelimit, this.totalNoteList);
}

onNextPageN() {
  if (this.notepage < this.totalNotes - 1) {
    this.getNotes(this.notepage + 1);
  }
}

onPrevPageN() {
  if (this.notepage > 0) {
    this.getNotes(this.notepage - 1);
  }
}


  userDetail:any;
  createNote(){
    if(!this.note){
      this.service.showMessage({ message: "Note Required!" });
      return false;
    }
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));

    if(this.selectedNode){
      let body = {
        "_id": this.selectedNode._id,
        "student_id": this.selectedStudent._id,
        "created_by": this.userDetail._id,
        "description": this.note 
       }
      this.service.updateStudentNote(body).subscribe(res => {
        if (res.status == 200) {
          this.addnote = false;
          this.getNotes(this.notepage);
          this.selectedNode = null;
          this.service.showMessage({ message: res.msg });
          // this.closeResendOTPEmailModal.ripple.trigger.click();
          // this.selectedCompany = {};
  
        } else {
          this.service.showMessage({ message: res.msg });
        }
      }, err => {
  
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }else{
      let body = {
        "student_id": this.selectedStudent._id,
        "created_by": this.userDetail._id,
        "description": this.note 
       }

       console.log("body", body)
      this.service.addStudentNote(body).subscribe(res => {
        if (res.status == 200) {
          this.getNotes(this.notepage);
          this.addnote = false;
          this.selectedNode = null;
          this.service.showMessage({ message: res.msg });
          // this.closeResendOTPEmailModal.ripple.trigger.click();
          // this.selectedCompany = {};
  
        } else {
          this.service.showMessage({ message: res.msg });
        }
      }, err => {
  
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }
   

  }

  reactivateStudent() {
    const payload = {
      student_id: this.selectedRecords.map(student => student._id),
      is_archive: false
    }
    this.editStudent(payload);
  }


  reminderToStaff() {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
        "student_id": this.selectedStudent._id,
        "type": "student",
        "description": this.reminderForm.value.description,
        "created_by":this.userDetail._id,
        "assigned_staff_name": this.staffName,
        "assigned_staff_id": this.reminderForm.value.staff_id,
    }
    this.service.reminderAdd(payload).subscribe((res: any) => {
      if(res.status == 200){
        this.service.showMessage({
          message: res.msg
        });
        this.closeReminderModal.ripple.trigger.click();
        this.reminderToStaffDone.show()
      }else{
        this.service.showMessage({
          message: res.msg
        });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  @ViewChild('closemodelPgList') closemodelPgList;

  gotoPlacement(data: any) {
     this.closemodelPgList.ripple.trigger.click();
    console.log("data", data, data.placement_id);
    const placementId = data.placement_id ? data.placement_id : data._id;
    const navigationExtras = {
      queryParams: { redirectTo: 'eligible-students' },
      state: { type: 'view' }
    };
    this.router.navigate(['admin/wil/placement-groups', placementId], navigationExtras);
  }


  gotoPlacementProject(data, item){
     this.closemodelPgList.ripple.trigger.click();
    const navigationExtras = {queryParams: {redirectTo: 'eligible-students'}, state:{type: 'view'}};
    this.router.navigate(['admin/wil/placement-groups/project/'+item._id], navigationExtras);
  }
  getTitle(){
    return 'Selected Parameters: '+this.filterList.join(', ');
  }
  


  updateCheckBox(data) {
    const payload = {
      student_id: data._id,
      ...data
    };
    // console.log("payload", payload);
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
        if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      // this.searchEligibleStudents()
      this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
       this.searchSubject.next(this.searchCriteria.keywords);
    } else if (!this.searchCriteria.keywords) {
      if(this.filterList && this.filterList.length>0){
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.onApplyFilter()
      }else{
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.getEligibleStudents();
      }
    }else{
      if(this.filterList && this.filterList.length>0){
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.onApplyFilter()
      }else{
        this.eligibleStudentList = new MatTableDataSource<any>([]);
            this.eligibleStudentList.data = []; 
            this.studentList = []; 
        this.getEligibleStudents();
      }
    }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  handleCancel() {
    // this.resetCheckBox();
    // Handle cancel action
  }

  handleSend() {
    this.resetCheckBox();
    // Handle send action
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


  //  onGPAInputChange(value: any, type: 'min' | 'max') {
  //   const strValue = String(value).trim();

  //   // Remove invalid characters
  //   const sanitized = strValue.replace(/[^0-9.]/g, '');
  //   const parts = sanitized.split('.');

  //   // Reject if multiple decimal points
  //   if (parts.length > 2) return;

  //   let num = parseFloat(sanitized);
  //   if (isNaN(num)) return;

  //   // Clamp between 1 and 3.5
  //   if (num < 1) num = 1;
  //   else if (num > 3.5) num = 3.5;

  //   // Round to 1 decimal
  //   num = parseFloat(num.toFixed(1));

  //   console.log("num", num, type)
  //   // Assign to model
  //   if (type === 'min') {
  //     this.filterParameters.gpa_min_points = parseFloat(num.toFixed(1));;
  //   } else {
  //     this.filterParameters.gpa_max_points = parseFloat(num.toFixed(1));;
  //   }
  // }

  favoriteFilter:boolean = false;
  selectedFilter:any = null;
//     {
//     "placementGroups": [
//         "680f6e6edc669b1bb86203a5"
//     ],
//     "major": [
//         "Data Science"
//     ],
//     "priority": [],
//     "campus": [],
//     "status": [],
//     "post_code": [],
//     "area": [],
//     "monthly_cohort": [],
//     "resume_level": [],
//     "placement_doc_received": [],
//     "course_code": [],
//     "placementType": [],
//     "monthly_cohort_sdate": null,
//     "monthly_cohort_edate": null,
//     "course_start_sdate": null,
//     "course_start_edate": null,
//     "course_end_sdate": null,
//     "course_end_edate": null,
//     "internship_start_sdate": null,
//     "internship_start_edate": null,
//     "internship_end_sdate": null,
//     "internship_end_edate": null,
//     "cohort_start_sdate": null,
//     "cohort_start_edate": null,
//     "cohort_end_sdate": null,
//     "cohort_end_edate": null,
//     "graduation_sdate": null,
//     "graduation_edate": null,
//     "credit_min_points": null,
//     "credit_max_points": null,
//     "gpa_min_points": null,
//     "gpa_max_points": null,
//     "minor": [
//         "Business Analysis"
//     ]
// };
  showSavedFilter:boolean = false;
  onGPAInputChange(value: any, type: 'min' | 'max', inputElement: HTMLInputElement) {
    const strValue = String(value).trim();

    // Remove non-numeric characters except dot
    const sanitized = strValue.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');

    // Reject if more than one decimal
    if (parts.length > 2) return;

    let num = parseFloat(sanitized);
    if (isNaN(num)) return;

    // Clamp between 1 and 3.5
    if (num < 1) num = 1;
    else if (num > 100) num = 100;

    // Round to 1 decimal place
    num = parseFloat(num.toFixed(0));

    // Update model and force input to reflect it
    setTimeout(() => {
      if (type === 'min') {
        this.filterParameters.gpa_min_points = num;
      } else {
        this.filterParameters.gpa_max_points = num;
      }
    });

    if (inputElement) {
      inputElement.value = num.toString();
    }
  }


  callfilterbothApi(){
    // if (this.eligibleStudentList) {
    //     this.eligibleStudentList.data = []; 
    // // this.eligibleStudentList._updateChangeSubscription(); // Force table to update
    // }
    // this.studentList = []; 
    this.getsaveFilter(this.notepage);
    this.getotherFilter(false);
  }


  saveFilterpage: number = 0;
saveFilterlimit: number = 8;
totalsaveFilter: number = 0;
totalsaveFilterList: number = 0;
saveFilterList: any[] = [];

getsaveFilter(page: number) {
  this.saveFilterpage = page;
  this.userDetail = JSON.parse(localStorage.getItem('userDetail') || '{}');

  let body = {
    created_by: this.userDetail._id,
    filter_type: 'saved',
    type: 'student',
    limit: this.saveFilterlimit,
    offset: page 
  };

  this.service.getSaveFilterList(body).subscribe(
    res => {
      if (res.status === 200) {
        this.totalsaveFilterList = res.total;
        this.totalsaveFilter = Math.ceil(this.totalsaveFilterList / this.saveFilterlimit);
        this.saveFilterList = res.result;
      } else {
        this.saveFilterList = [];
      }
    },
    err => {
      this.saveFilterList = [];
      this.service.showMessage({
        message: err.error.errors?.msg || 'Something went Wrong'
      });
    }
  );
}

// // === Display counters ===
// get startsaveFilterIndex(): number {
//   if (this.totalsaveFilterList === 0) return 0;

//   // First page starts at 1, subsequent pages start at 2
//   return this.saveFilterpage === 0
//     ? 1
//     : 2;
// }

// get endsaveFilterIndex(): number {
//   if (this.totalsaveFilterList === 0) return 0;

//   // First page ends at either limit or total
//   if (this.saveFilterpage === 0) {
//     return Math.min(this.saveFilterlimit, this.totalsaveFilterList);
//   }

//   // Other pages always end at the total
//   return this.totalsaveFilterList;
// }
get startsaveFilterIndex(): number {
  if (this.totalsaveFilterList === 0) return 0;
  // (page index * limit) + 1
  return (this.saveFilterpage * this.saveFilterlimit) + 1;
}

get endsaveFilterIndex(): number {
  if (this.totalsaveFilterList === 0) return 0;
  // Min between (page index + 1) * limit and total items
  return Math.min(
    (this.saveFilterpage + 1) * this.saveFilterlimit,
    this.totalsaveFilterList
  );
}


// === Page navigation ===
onNextPage() {
  if (this.saveFilterpage < this.totalsaveFilter - 1) {
    this.getsaveFilter(this.saveFilterpage + 1);
  }
}

onPrevPage() {
  if (this.saveFilterpage > 0) {
    this.getsaveFilter(this.saveFilterpage - 1);
  }
}

  
   recentFilters:any =[];
   displayFilters:any =[];

   getotherFilter(status = true){
       this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let body = {created_by:this.userDetail._id, filter_type:'saved', type:'student'}
      this.service.getRecentDisplayFilters(body).subscribe(async(res) => {
  
        if (res.status === 200) {
         this.recentFilters = res.recent_result;
         this.displayFilters = res.display_result;

       
         if(status){
           await this.displayFilters.map(async(el)=>{

          el['count'] =await this.getFilterListCount(el);
          console.log("el['count']",el['count'])
         })
         console.log("this.displayFilters", this.displayFilters);
         }
        } else {
          this.recentFilters = [];
           this.displayFilters = [];
          // this.service.showMessage({ message: res.msg });
        }
      }, err => {
        this.recentFilters = [];
           this.displayFilters = [];
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }


    
 
 async getFilterListCount(data) {
  //  alert("filter count");
  this.isManualFilter = true;
  // this.paginationObj = {
  //   length: 0,
  //   pageIndex: this.paginationObj.pageIndex,
  //   pageSize: this.paginationObj.pageSize,
  //   previousPageIndex: 0,
  //   changed: false,
  // };
  // console.log("this.paginationObj", this.paginationObj, data.filters);

  // let previousFilterList = [...this.filterList];
  const payload: any = {
    limit:1000000,
    offset: 0,
 };

 const fieldMapping: Record<string, string[]> = {
  internship_start_date: ["internship_start_sdate", "internship_start_edate"],
  internship_end_date: ["internship_end_sdate", "internship_end_edate"],
  course_start_date: ["course_start_sdate", "course_start_edate"],
  course_end_date: ["course_end_sdate", "course_end_edate"],
  cohort_start_date: ["cohort_start_sdate", "cohort_start_edate"],
  cohort_end_date: ["cohort_end_sdate", "cohort_end_edate"],
  graduation_date: ["graduation_sdate", "graduation_edate"],
  credit_points: ["credit_min_points", "credit_max_points"],
  gpa: ["gpa_min_points", "gpa_max_points"],
};


  // this.filters = this.filters.map((option)=>{
  //   // if(option.field=="internship_start_sdate" || option.field=="internship_start_sdate"){
  //   //     option['internship_startdate'] = null;
  //   // }
  //   const val = data.filters[option.field];
    
  //   return {
  //     ...option,
  //     selected:
  //       Array.isArray(val) ? val.length > 0 :
  //       typeof val === 'string' ? val.trim() !== '' :
  //       typeof val === 'number' ? true :
  //       val !== null && val !== undefined
  //   };
  // })
  this.filters = this.filters.map((option) => {
  const keys = fieldMapping[option.field] || [option.field];

  // Collect all possible values for this option
  const values = keys.map((k) => data.filters[k]);

  // Decide selected if any value is truthy / non-empty
  const selected = values.some((val) => {
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "string") return val.trim() !== "";
    if (typeof val === "number") return true;
    return val != null;
  });

  return { ...option, selected };
});

  this.filterList = [];
  for (const filter of this.filters) {
    
    if (!filter.selected) continue;

    this.filterList.push(filter.name);

    if (filter.name === 'Location') {
      filter.field = "state";
    }

   

    switch (filter.field) {
      case 'monthly_cohort':
        Object.assign(payload, {
          monthly_cohort_sdate: moment(data.filters.monthly_cohort_sdate).format("DD/MM/YYYY"),
          monthly_cohort_edate: moment(data.filters.monthly_cohort_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'placementGroups': {
        const projectPlacementGroups = [];
        const placementGroups = [];

        data.filters[filter.field].forEach(el => {
          const projectMatches = this.studentFilters.placementGroups
            .filter(e => e._id === el && e.type === 'project')
            .map(e => e._id);

          const placementMatches = this.studentFilters.placementGroups
            .filter(e => e._id === el && e.type !== 'project')
            .map(e => e._id);

          projectPlacementGroups.push(...projectMatches);
          placementGroups.push(...placementMatches);
        });

        Object.assign(payload, {
          projectPlacementGroups,
          placementGroups,
        });
        break;
      }

      case 'course_start_date':
        Object.assign(payload, {
          course_start_sdate: moment(data.filters.course_start_sdate).format("DD/MM/YYYY"),
          course_start_edate: moment(data.filters.course_start_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'course_end_date':
        Object.assign(payload, {
          course_end_sdate: moment(data.filters.course_end_sdate).format("DD/MM/YYYY"),
          course_end_edate: moment(data.filters.course_end_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'internship_start_date':
        Object.assign(payload, {
          internship_start_sdate: moment(data.filters.internship_start_sdate).format("DD/MM/YYYY"),
          internship_start_edate: moment(data.filters.internship_start_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'cohort_start_date':
        Object.assign(payload, {
          cohort_start_sdate: moment(data.filters.cohort_start_sdate).format("DD/MM/YYYY"),
          cohort_start_edate: moment(data.filters.cohort_start_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'cohort_end_date':
        Object.assign(payload, {
          cohort_end_sdate: moment(data.filters.cohort_end_sdate).format("DD/MM/YYYY"),
          cohort_end_edate: moment(data.filters.cohort_end_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'graduation_date':
        Object.assign(payload, {
          graduation_sdate: moment(data.filters.graduation_sdate).format("DD/MM/YYYY"),
          graduation_edate: moment(data.filters.graduation_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'internship_end_date':
        Object.assign(payload, {
          internship_end_sdate: moment(data.filters.internship_end_sdate).format("DD/MM/YYYY"),
          internship_end_edate: moment(data.filters.internship_end_edate).format("DD/MM/YYYY"),
        });
        break;

      case 'credit_points':
        Object.assign(payload, {
          credit_min_points: data.filters.credit_min_points,
          credit_max_points: data.filters.credit_max_points,
        });
        break;

      case 'gpa':
        Object.assign(payload, {
          gpa_min_points: data.filters.gpa_min_points,
          gpa_max_points: data.filters.gpa_max_points,
        });
        break;

      case 'state':
        Object.assign(payload, {
          state: data.filters['state'],
          suburb: data.filters['suburb'],
          post_code: data.filters['post_code'],
        });
        break;

      default:
        Object.assign(payload, {
          [filter.field]: data.filters[filter.field],
        });
    }
  }

  payload['is_archive'] = this.selectedIndex === 1 ? false : true;
  this.filterList = [];
  this.filters = this.filters.map((option) => {
    option.selected = false;
    return option;
  });

  return new Promise((resolve, reject) => {
    this.service.studentFilter(payload).subscribe({
      next: (response) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          resolve(response.count ? response.count : response.result.length);
        } else {
          resolve(0);
        }
      },
      error: (err) => {
        console.error("Error in studentFilter", err);
        reject(0);
      }
    });
  });
}


//  get startsaveFilterIndex(): number {
//   if (this.totalsaveFilterList === 0) return 0;

//   return this.saveFilterpage === 0
//     ? 1
//     : 2; // Always 2 for second page
// }

// get endsaveFilterIndex(): number {
//   if (this.totalsaveFilterList === 0) return 0;

//   return Math.min(
//     (this.saveFilterpage === 0
//       ? this.saveFilterlimit
//       : this.totalsaveFilterList), // On later pages, end at total
//     this.totalsaveFilterList
//   );
// }

  
  // get endsaveFilterIndex(): number {
  //   return this.totalsaveFilterList === 0 ? 0 : this.saveFilterpage * this.saveFilterlimit + 1;
  // }

  // get endsaveFilterIndex(): number {
  //   return Math.min((this.saveFilterpage + 1) * this.saveFilterlimit, this.totalsaveFilterList);
  // }
// onNextPage() {
//   if (this.saveFilterpage < this.totalsaveFilter - 1) {
//     this.getsaveFilter(this.saveFilterpage + 1);
//   }
// }

// onPrevPage() {
//   if (this.saveFilterpage > 0) {
//     this.getsaveFilter(this.saveFilterpage - 1);
//   }
// }
previewFilter() {
   this.filters.map((option)=>{
      option.selected = false;
     })
     this.filterParameters = {
      placementGroups: [],
      major: [],
      priority: [],
      campus: [],
      status: [],
      post_code: [],
      area: [],
      monthly_cohort: [],
      resume_level: [],
      placement_doc_received: [],
      course_code: [],
      placementType: [],
      monthly_cohort_sdate: null,
      monthly_cohort_edate: null,
      course_start_sdate: null,
      course_start_edate: null,
      course_end_sdate: null,
      course_end_edate: null,
      internship_start_sdate: null,
      internship_start_edate: null,
      internship_end_sdate: null,
      internship_end_edate: null,
      cohort_start_sdate: null,
      cohort_start_edate: null,
      cohort_end_sdate: null,
      cohort_end_edate: null,
      graduation_sdate: null,
      graduation_edate: null,
      credit_min_points:null,
      credit_max_points:null,
      gpa_min_points:null,
      gpa_max_points:null
    }
  this.filterParameters = this.selectedFilter?.filters;
  this.showSavedFilter = false;

  

  // Set activeFilter based on preferred order
  const orderedFields = [
    'placementGroups',
    'major',
    'priority',
    'campus',
    'status',
    'post_code',
    'area',
    'monthly_cohort',
    'resume_level',
    'placement_doc_received',
    'course_code',
    'placementType',
    'monthly_cohort_sdate',
    'monthly_cohort_edate',
    'course_start_sdate',
    'course_start_edate',
    'course_end_sdate',
    'course_end_edate',
    'internship_start_sdate',
    'internship_start_edate',
    'internship_end_sdate',
    'internship_end_edate',
    'cohort_start_sdate',
    'cohort_start_edate',
    'cohort_end_sdate',
    'cohort_end_edate',
    'graduation_sdate',
    'graduation_edate',
    'credit_min_points',
    'credit_max_points',
    'gpa_min_points',
    'gpa_max_points'
  ];

  for (const field of orderedFields) {
    const val = this.filterParameters[field];
    if ((Array.isArray(val) && val.length > 0) ||
        (typeof val === 'string' && val.trim() !== '') ||
        (typeof val === 'number' && val !== null && val !== undefined)) {
      this.activeFilter = field;
      break;
    }
  }
  console.log("this.activeFilter", this.activeFilter)

  // Update filters with selected state
  this.filters = this.filters.map((option) => {
    const val = this.filterParameters[option.field];
    console.log("val", val, option)
    switch (option.field) {
      case 'course_start_date':
        if (this.filterParameters.course_start_sdate || this.filterParameters.course_start_edate) {
          option.selected = true;
          // this.activeFilter = 'course_start_date';
        }
        break;

      case 'course_end_date':
        if (this.filterParameters.course_end_sdate || this.filterParameters.course_end_edate) {
          option.selected = true;
          // this.activeFilter = 'course_end_date';
        }
        break;

      case 'internship_start_date':
        if (this.filterParameters.internship_start_sdate || this.filterParameters.internship_start_edate) {
          option.selected = true;
          this.activeFilter = 'internship_start_date';
        }
        break;

      case 'internship_end_date':
        if (this.filterParameters.internship_end_sdate || this.filterParameters.internship_end_edate) {
          option.selected = true;
          this.activeFilter = 'internship_end_date';
        }
        break;

      case 'cohort_start_date':
        if (this.filterParameters.cohort_start_sdate || this.filterParameters.cohort_start_edate) {
          option.selected = true;
          this.activeFilter = 'cohort_start_date';
        }
        break;

      case 'cohort_end_date':
        if (this.filterParameters.cohort_end_sdate || this.filterParameters.cohort_end_edate) {
          option.selected = true;
          this.activeFilter = 'cohort_end_date';
        }
        break;

      case 'graduation_date':
        if (this.filterParameters.graduation_sdate || this.filterParameters.graduation_edate) {
          option.selected = true;
          this.activeFilter = 'graduation_date';
        }
        break;

      case 'credit_points':
        if (this.filterParameters.credit_min_points || this.filterParameters.credit_max_points) {
          option.selected = true;
          this.activeFilter = 'credit_points';
        }
        break;

      case 'gpa':
        if (this.filterParameters.gpa_min_points || this.filterParameters.gpa_max_points) {
          option.selected = true;
          this.activeFilter = 'gpa';
        }
        break;

      case 'state':
        if (this.filterParameters['state'] || this.filterParameters['suburb']) {
          option.selected = true;
          this.activeFilter = 'post_code';
        }
        break;
    }

    // Fallback selection logic
    return {
      ...option,
      selected: option.selected || (
        Array.isArray(val) ? val.length > 0 :
        typeof val === 'string' ? val.trim() !== '' :
        typeof val === 'number' ? true :
        val !== null && val !== undefined
      )
    };
  });

  this.status = null;

  // Bootstrap tab switch
  const parametersTabTrigger = document.querySelector('a[href="#parameters"]');
  if (parametersTabTrigger) {
    const tab = new (window as any).bootstrap.Tab(parametersTabTrigger);
    tab.show();
  }

  this.cdr.detectChanges();
  // console.log("this.filterParameters:", this.filterParameters);
}



  // previewFilter(){
  //   this.filterParameters=this.selectedFilter?.filters;
  //   this.showSavedFilter= false;
  //   console.log("this.", this.filters)
  //   this.filters = this.filters.map((option)=>{
  //      const val = this.filterParameters[option.field];


  //     case 'course_start_date':
  //       if(this.filterParameters.course_start_sdate || this.filterParameters.course_start_edate){
  //         option.selected = true;
  //       }
  //       break;

  //     case 'course_end_date':
  //        if(this.filterParameters.course_end_sdate || this.filterParameters.course_end_edate){
  //         option.selected = true;
  //       }
  //       break;

  //     case 'internship_start_date':
   
  //         if(this.filterParameters.internship_start_sdate || this.filterParameters.internship_start_sdate){
  //         option.selected = true;
  //       }
  //       break;

  //     case 'cohort_start_date':

  //         if(this.filterParameters.cohort_start_sdate || this.filterParameters.cohort_start_sdate){
  //         option.selected = true;
  //       }
     
  //       break;

  //     case 'cohort_end_date':

  //         if(this.filterParameters.cohort_end_sdate || this.filterParameters.cohort_end_sdate){
  //         option.selected = true;
  //       }
     
  //       break;

  //     case 'graduation_date':
  //        if(this.filterParameters.graduation_sdate || this.filterParameters.graduation_sdate){
  //         option.selected = true;
  //       }
     
  //       break;

  //     case 'internship_end_date':
  //         if(this.filterParameters.internship_end_sdate || this.filterParameters.internship_end_edate){
  //         option.selected = true;
  //       }
     
  //       break;

  //     case 'credit_points':
  //             if(this.filterParameters.credit_min_points || this.filterParameters.credit_min_points){
  //         option.selected = true;
  //       }
  //       break;

  //     case 'gpa':
  //               if(this.filterParameters.gpa_min_points || this.filterParameters.gpa_max_points){
  //         option.selected = true;
  //       }
  //       break;

  //     case 'state':
  //             if(this.filterParameters['state'] || this.filterParameters['gpa_maxsuburb_points']){
  //         option.selected = true;
  //       }
  //     return {
  //       ...option,
  //       selected:
  //         Array.isArray(val) ? val.length > 0 :
  //         typeof val === 'string' ? val.trim() !== '' :
  //         typeof val === 'number' ? true :
  //         val !== null && val !== undefined
  //     };
  //   })
  //   this.status= null;


  //   const parametersTabTrigger = document.querySelector('a[href="#parameters"]');
  //   console.log("parametersTabTrigger", parametersTabTrigger)
  // if (parametersTabTrigger) {
  //   // Bootstrap 5 way to activate tab
  //   const tab = new (window as any).bootstrap.Tab(parametersTabTrigger);
  //   tab.show();
  // }
  //    console.log("this.filterParameters", this.filterParameters)
  // }
  
  setFilterTab(){

    //  this.filters.map((option)=>{
    //   const val = this.filterParameters[option.field];
    //   // console.log("val", val);
     
    //   if ((Array.isArray(val) && val.length > 0) ||
    //     (typeof val === 'string' && val.trim() !== '') ||
    //     (typeof val === 'number' && val !== null && val !== undefined)) {
    //      option.selected = true;
    //   }else{
    //      option.selected = false;
    //   }
    //  })

    //  this.filterParameters = {
    //   placementGroups: [],
    //   major: [],
    //   priority: [],
    //   campus: [],
    //   status: [],
    //   post_code: [],
    //   area: [],
    //   monthly_cohort: [],
    //   resume_level: [],
    //   placement_doc_received: [],
    //   course_code: [],
    //   placementType: [],
    //   monthly_cohort_sdate: null,
    //   monthly_cohort_edate: null,
    //   course_start_sdate: null,
    //   course_start_edate: null,
    //   course_end_sdate: null,
    //   course_end_edate: null,
    //   internship_start_sdate: null,
    //   internship_start_edate: null
    //   ,internship_end_sdate: null,
    //   internship_end_edate: null,
    //   cohort_start_sdate: null,
    //   cohort_start_edate: null,
    //   cohort_end_sdate: null,
    //   cohort_end_edate: null,
    //   graduation_sdate: null,
    //   graduation_edate: null,
    //   credit_min_points:null,
    //   credit_max_points:null,
    //   gpa_min_points:null,
    //   gpa_max_points:null
    // }
    const parametersTabTrigger = document.querySelector('a[href="#parameters"]');
      // console.log("parametersTabTrigger", parametersTabTrigger)
    if (parametersTabTrigger) {
      // Bootstrap 5 way to activate tab
      const tab = new (window as any).bootstrap.Tab(parametersTabTrigger);
      tab.show();
    }
    this.rename = "";
    this.favoriteName = "";
  }

//   {
//     "placementGroups": [
//         "680f6e6edc669b1bb86203a5"
//     ],
//     "major": [
//         "Data Science"
//     ],
//     "priority": [],
//     "campus": [],
//     "status": [],
//     "post_code": [],
//     "area": [],
//     "monthly_cohort": [],
//     "resume_level": [],
//     "placement_doc_received": [],
//     "course_code": [],
//     "placementType": [],
//     "monthly_cohort_sdate": null,
//     "monthly_cohort_edate": null,
//     "course_start_sdate": null,
//     "course_start_edate": null,
//     "course_end_sdate": null,
//     "course_end_edate": null,
//     "internship_start_sdate": null,
//     "internship_start_edate": null,
//     "internship_end_sdate": null,
//     "internship_end_edate": null,
//     "cohort_start_sdate": null,
//     "cohort_start_edate": null,
//     "cohort_end_sdate": null,
//     "cohort_end_edate": null,
//     "graduation_sdate": null,
//     "graduation_edate": null,
//     "credit_min_points": null,
//     "credit_max_points": null,
//     "gpa_min_points": null,
//     "gpa_max_points": null,
//     "minor": [
//         "Business Analysis"
//     ]
// }



  rename:any = "";
  favoriteName:any = "";
  @ViewChild('renameFilter') renameFilter: ModalDirective;
  @ViewChild('SaveAsFavoriteFilter') SaveAsFavoriteFilter: ModalDirective;
  @ViewChild('removeFavoriteFilter') removeFavoriteFilter: ModalDirective;
  @ViewChild('addDisplayFilter') addDisplayFilter: ModalDirective;
  @ViewChild('removeDisplayFilter') removeDisplayFilter: ModalDirective;


  get isAnyFilterSelected(): boolean {
  return this.filteredParametes?.some(filter => {
    if (!filter.selected) {
      return false;
    }
    const val = this.filterParameters?.[filter.field];

    // Check if value exists
    if (Array.isArray(val)) {
      return val.length > 0;
    }
    if (typeof val === 'string') {
      return val.trim() !== '';
    }
    if (typeof val === 'number') {
      return true; // any number counts as existing
    }

    switch (filter.field) {
      case 'course_start_date':
        if (this.filterParameters.course_start_sdate || this.filterParameters.course_start_edate) return true;
        break;
      case 'course_end_date':
        if (this.filterParameters.course_end_sdate || this.filterParameters.course_end_edate)  return true;
        break;
      case 'internship_start_date':
        if (this.filterParameters.internship_start_sdate || this.filterParameters.internship_start_edate)  return true;
        break;
      case 'internship_end_date':
        if (this.filterParameters.internship_end_sdate || this.filterParameters.internship_end_edate)  return true;
        break;
      case 'cohort_start_date':
        if (this.filterParameters.cohort_start_sdate || this.filterParameters.cohort_start_edate)  return true;
        break;
      case 'cohort_end_date':
        if (this.filterParameters.cohort_end_sdate || this.filterParameters.cohort_end_edate)  return true;
        break;
      case 'graduation_date':
        if (this.filterParameters.graduation_sdate || this.filterParameters.graduation_edate)  return true;
        break;
      case 'credit_points':
        if (this.filterParameters.credit_min_points || this.filterParameters.credit_max_points) return true;
        break;
      case 'gpa':
        if (this.filterParameters.gpa_min_points || this.filterParameters.gpa_max_points) return true;
        break;
      case 'state':
        if (this.filterParameters['state'] || this.filterParameters['suburb'])  return true;
        break;
    }
    return val !== null && val !== undefined;
  }) || false;

    this.filters = this.filters.map((option) => {
    const val = this.filterParameters[option.field];

    switch (option.field) {
      case 'course_start_date':
        if (this.filterParameters.course_start_sdate || this.filterParameters.course_start_edate) {
          option.selected = true;
          // this.activeFilter = 'course_start_date';
        }
        break;

      case 'course_end_date':
        if (this.filterParameters.course_end_sdate || this.filterParameters.course_end_edate) {
          option.selected = true;
          // this.activeFilter = 'course_end_date';
        }
        break;

      case 'internship_start_date':
        if (this.filterParameters.internship_start_sdate || this.filterParameters.internship_start_edate) {
          option.selected = true;
          // this.activeFilter = 'internship_start_date';
        }
        break;

      case 'internship_end_date':
        if (this.filterParameters.internship_end_sdate || this.filterParameters.internship_end_edate) {
          option.selected = true;
          // this.activeFilter = 'internship_end_date';
        }
        break;

      case 'cohort_start_date':
        if (this.filterParameters.cohort_start_sdate || this.filterParameters.cohort_start_edate) {
          option.selected = true;
          this.activeFilter = 'cohort_start_date';
        }
        break;

      case 'cohort_end_date':
        if (this.filterParameters.cohort_end_sdate || this.filterParameters.cohort_end_edate) {
          option.selected = true;
          this.activeFilter = 'cohort_end_date';
        }
        break;

      case 'graduation_date':
        if (this.filterParameters.graduation_sdate || this.filterParameters.graduation_edate) {
          option.selected = true;
          this.activeFilter = 'graduation_date';
        }
        break;

      case 'credit_points':
        if (this.filterParameters.credit_min_points || this.filterParameters.credit_max_points) {
          option.selected = true;
          this.activeFilter = 'credit_points';
        }
        break;

      case 'gpa':
        if (this.filterParameters.gpa_min_points || this.filterParameters.gpa_max_points) {
          option.selected = true;
          this.activeFilter = 'gpa';
        }
        break;

      case 'state':
        if (this.filterParameters['state'] || this.filterParameters['suburb']) {
          option.selected = true;
          this.activeFilter = 'post_code';
        }
        break;
    }

    // Fallback selection logic
    return {
      ...option,
      selected: option.selected || (
        Array.isArray(val) ? val.length > 0 :
        typeof val === 'string' ? val.trim() !== '' :
        typeof val === 'number' ? true :
        val !== null && val !== undefined
      )
    };
  });
}


  saveFilter(type?){
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    let data = {
      name:this.favoriteName?this.favoriteName:this.selectedFilter && this.selectedFilter.name?this.selectedFilter.name: this.filterList.join(', '),
      filters:this.filterParameters,
      created_by:this.userDetail._id,
      created_by_name:this.userDetail.first_name+' '+this.userDetail.last_name,
      filter_type: type ?type:'recent', //"recent/saved/display",
      type: "student"//"student/company"
    }
    this.service.saveFilter(data).subscribe((response) => {
      if (response.status == HttpResponseCode.SUCCESS) {
          this.favoriteName = '';
          this.rename ='';
          this.getsaveFilter(this.notepage);
          // this.getotherFilter();
      } else {
        this.service.showMessage({
          message: "Students not found for applied filters"
        });
      }
    })
  }


  updateFilter(type?){
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    let data = {
      name:this.favoriteName?this.favoriteName:this.rename?this.rename:undefined,
      filter_type: type ?type:undefined, //"recent/saved/display",
      filter_id:this.selectedFilter._id
      // type: "student"//"student/company"
    }
    this.service.updateFilters(data).subscribe((response) => {
      if (response.status == HttpResponseCode.SUCCESS) {
          this.selectedFilter = null;
          this.rename ='';
          this.favoriteName = '';
          this.getsaveFilter(this.notepage);
           this.getotherFilter();
      } else {
        this.service.showMessage({
          message: "Students not found for applied filters"
        });
      }
    })
  }

  renameFilterSubmit(){
    if(this.rename){
      this.updateFilter();
      this.renameFilter.hide();
    }
      // this.renameFilter.hide();
  }

  saveAsFavoriteSubmit(){
    if(this.favoriteName){
      if(this.selectedFilter && this.selectedFilter._id){
         this.updateFilter('saved');
      }else{
        this.saveFilter('saved');
      }
     
      this.SaveAsFavoriteFilter.hide();
    }
  
  }

  removeFavoriteSubmit(){
    this.updateFilter('recent');
    this.removeFavoriteFilter.hide();
  }
  addDisplaySubmit(){
    this.updateFilter('display');
    this.addDisplayFilter.hide();
  }
  removeDisplaySubmit(){
    this.updateFilter('saved');
    this.removeDisplayFilter.hide();
  } 

  renameform(item){
    this.selectedFilter = item;
    this.rename=item.name;
  }
}
