import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {HttpResponseCode} from '../../../shared/enum';
import { Utils } from '../../../shared/utility';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
  selector: 'app-placement-eligible-students',
  templateUrl: './placement-eligible-students.component.html',
  styleUrls: ['./placement-eligible-students.component.scss']
})
export class PlacementEligibleStudentsComponent implements OnInit {
  id: any;
  showButtonHeaders: boolean;
  searchCriteria = {
    keywords: null
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('closeLockCandidateModal') closeLockCandidateModal;
  @ViewChild('closeUnLockCandidateModal') closeUnLockCandidateModal;

  @Input() updatedPlacementDetail;

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
  isAddNewStudent: boolean = false;

  isArchive: boolean = false;


  selectedStudent: any;
  staffForm: FormGroup;
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
  placementTypes = []
  selectedRecords = [];
  activeFilter: string = null;
  studentFilters = null;

  vacancyStudentDetail = [];
  studentDetail = null;
  studentVacancyColumns = ['company_name', 'state', 'job_title', 'status'];
  comment = null;
  userDetail = null;

  constructor(
    private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    public utils: Utils,
    private fb: FormBuilder,
    private ngxPermissionService: NgxPermissionsService
    ) { }

  overAllCount = {
    eligibleStudent: 0,
    pendingApproval: 0,
    pendingPlacement: 0,
    placed: 0,
  }
  editEligibleStudent = {
    student_id: [],
    priority: null,
    status: null,
  }
  eligibleStudentList: any;
  filterParameters = {
    placementGroups: [],
    major: [],
    priority:[],
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

    interview_score_min: null,
    interview_score_max: null,
    written_assessment_min: null,
    written_assessment_max: null,


    form_id: null,
    form_field_name: null,
    form_score_min: null,
    form_score_max: null,

  }

  filters = [
    // { name: 'Placement Groups', field: 'placementGroups', selected: false },
    // { name: 'Major', field: 'major', selected: false },
    { name: 'Priority', field: 'priority', selected: false },
    { name: 'Status', field: 'status', selected: false },
    // { name: 'assigned_to', selected: false },
    // { name: 'enrolment_date', selected: false },
    // { name: 'approvals', selected: false },
    // { name: 'Monthly Cohort', field: 'monthly_cohort', selected: false },
    // { name: 'campus', selected: false },
    // { name: 'Resume Level', field: 'resume_level', selected: false },
    // { name: 'Area', field: 'area', selected: false },
    // { name: 'Location', field: 'post_code', selected: false },
    // { name: 'Placement Doc Status', field: 'placement_doc_received', selected: false },
    // { name: 'Course Code', field: 'course_code', selected: false },
    { name: 'Placement Type', field: 'placementType', selected: false },
    { name: 'Interview Score', field: 'interview_score', selected: false },
    { name: 'Forms', field: 'forms', selected: false },
    // { name: 'Written assessment', field: 'written_assessment', selected: false }
  ];
  // displayedColumns: string[] = ['checkbox', 'student_id', 'first_name', 'last_name', 'major', 'assignedTo', 'priority', 'status', 'workflow', 'actions']
  displayedColumns: string[] = ['checkbox', 'student_id', 'student_name', 'assignedTo', 'allocatedTo', 'interview_status', 'priority',  'Placement', 'Supervisor', 'internship_start_date', 'internship_end_date', 'placement_type', 'actions']
  dataSource: MatTableDataSource<any>;
  statusClass = [
    {type: 'Placed', class: 'green'},
    {type: 'Interviewed', class: 'yellow'},
    {type: 'Interviewing', class: 'yellow'},
    {type: 'Shortlisted', class: 'pink'},
    {type: 'Rejected', class: 'red'},
    {type: 'In Progress', class: 'yellow'},
    {type: 'Not Placed', class: 'pink'},
    {type: 'Conditional Approval', class: 'yellow'},
    {type: 'Deferred', class: 'red'},
    {type: 'Inactive', class: 'red'}
  ];
  priorityClass = [
    {type: 'Low', class: 'pink'},
    {type: 'Medium', class: 'yellow'},
    {type: 'High', class: 'red'},
  ]
  selectAllStdnt = false;
  isWILWritePermission = false;
  placementId:any;
  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.placementId = params.get('id');
      this.getPlacementGroupDetails()
    });
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.getEligibleStudents();
    this.studentFilterOptions();
    this.studentPFilterOptions();
    this.studentFilterForm();
    this.staffForm = this.fb.group({
      staff_id: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });

    this.partnerForm = this.fb.group({
      partner_id: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });

    this.placementTypeForm = this.fb.group({
      placementType: ["", [Validators.required]],
      placement_type_id: [''],
      self_source:['']
    });
    this.getStaffMembers();
    this.getPlcamentTypes();
    this.activeFilter = this.filters[0].field;
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    console.log("updatedPlacementDetail", this.updatedPlacementDetail);
  }
  imageURL: string = '../../../../assets/img/banner_linkedin.svg';
  
  ngOnChanges(): void {
     console.log(this.updatedPlacementDetail);
    if(this.updatedPlacementDetail){
       this.imageURL = this.updatedPlacementDetail.background?this.updatedPlacementDetail.background:this.imageURL;
    }
    this.getPlacementGroupDetails();
    this.getPlcamentTypes();
  }
  placementGroupDetails:any

  getPlacementGroupDetails() {
    let payload = { id: this.id };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      this.placementGroupDetails = response.result;
      this.imageURL = this.placementGroupDetails.background?this.placementGroupDetails.background:this.imageURL;
      console.log(
        " this.placementGroupDetails",  this.placementGroupDetails
      )
    });
  }



  refreshData() {
    // Replace with your API call
    this.getPlcamentTypes();
    this.cleardata();
    this.getEligibleStudents();
    this.getPlacementGroupDetails();
  }

  getPlcamentTypes() {
    let payload = {placement_id: this.id};
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result;
      }
    });
  }

  getStaffMembers() {
    this.service.getStaffMembers({}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffList = response.result;
      }
    })
  }

  applyFilter(filter) {
    this.activeFilter = filter.field;
  }

  
  studentFilterOptions() {
    this.service.studentFilterOptions().subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentFilters = response.result;
      //   const notallowedKeys = [
      //   'placementGroups',
      // ];

      // this.studentFilters = Object.keys(response.result)
      //   .filter(key => !notallowedKeys.includes(key))
      //   .reduce((obj: any, key: string) => {
      //     obj[key] = response.result[key];
      //     return obj;
      //   }, {});
        console.log("this.studentFilters", this.studentFilters)
        this.studentPFilterOptions()
      }
    })
  }
  studentPFilterOptions(){
    this.service.studentpFilterOptions({placement_id:this.id}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentFilters['placementType'] = response.result?.placementType;
      }
    })
  }
  
  formOptions:any = [];
  studentFilterForm(){
     this.service.studentFilterFormOptions({placement_id:this.id}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.formOptions = response.result;
        console.log("this.studentFilters", this.formOptions)
      }
    })
  }

// onScoreInput(event: Event, type: 'min' | 'max') {
//   const input = event.target as HTMLInputElement;
//   let value = input.value;

//   // ────────────────────────────────────────────────
//   // Remember if user had trailing dot before cleaning
//   const hadTrailingDot = value.endsWith('.');
//   // ────────────────────────────────────────────────

//   // 1. Keep only valid characters (digits + max one dot)
//   value = value
//     .replace(/[^0-9.]/g, '')
//     .replace(/(\..*)\./g, '$1'); // keep only first dot

//   // 2. Auto-add leading zero if starts with dot
//   if (value.startsWith('.')) {
//     value = '0' + value;
//   }

//   // 3. Split parts safely
//   const parts = value.split('.');
//   let integer = parts[0] || '0';
//   let decimal = parts[1] || '';

//   // 4. Enforce business rules
//   let numInt = Number(integer);
//   if (numInt < 1) numInt = 1;
//   if (numInt > 5) numInt = 5;
//   integer = numInt.toString();

//   if (integer === '5') {
//     decimal = '';
//   } else {
//     decimal = decimal.slice(0, 1);
//   }

//   // 5. Rebuild final displayed value
//   let finalValue = integer;

//   // ──────────────────────────────────────────────────────────────
//   // Keep trailing dot if:
//   //   - user just typed it, or
//   //   - had trailing dot before sanitization (important for Enter)
//   //   - and integer is not 5
//   // ──────────────────────────────────────────────────────────────
//   const shouldShowTrailingDot =
//     (value.endsWith('.') || hadTrailingDot) &&
//     integer !== '5' &&
//     decimal === '';   // only if no decimal digits yet

//   if (shouldShowTrailingDot) {
//     finalValue += '.';
//   } else if (decimal) {
//     finalValue += '.' + decimal;
//   }

//   // 6. Update model only if meaningfully changed
//   const previousValue = type === 'min'
//     ? this.filterParameters.interview_score_min
//     : this.filterParameters.interview_score_max;

//   // For model: prefer number without trailing dot
//   const modelValue = shouldShowTrailingDot ? integer : finalValue;

//   if (modelValue !== previousValue) {
//     if (type === 'min') this.filterParameters.interview_score_min = modelValue;
//     else this.filterParameters.interview_score_max = modelValue;
//   }

//   // 7. Set displayed value
//   input.value = finalValue;

//   // Cursor logic (improved a bit)
//   const cursor = input.selectionStart ?? 0;
//   let newCursor = finalValue.length; // default to end

//   if (hadTrailingDot || value.endsWith('.')) {
//     newCursor = integer.length + 1; // right after dot
//   } else if (value.includes('.') && cursor > value.indexOf('.') + 1) {
//     newCursor = Math.min(cursor, finalValue.length);
//   }

//   setTimeout(() => {
//     input.setSelectionRange(newCursor, newCursor);
//   }, 0);

//   // 8. Validation
//   const minVal = Number(this.filterParameters.interview_score_min || 0);
//   const maxVal = Number(this.filterParameters.interview_score_max || 0);
//   this.scoreError = !isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal;
// }

onScoreInput(event: Event, type: 'min' | 'max') {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Keep only valid characters (digits + max one dot)
  value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); 

  // Allow empty input
  if (value === '') {
    if (type === 'min') this.filterParameters.interview_score_min = '';
    else this.filterParameters.interview_score_max = '';
    input.value = '';
    this.scoreError = false;
    return;
  }

  // Auto-add leading zero if starts with dot
  if (value.startsWith('.')) {
    value = '0' + value;
  }

  // Split parts safely
  const parts = value.split('.');
  let integer = parts[0] || '0';
  let decimal = parts[1] || '';

  // Enforce integer part 1–5 only if it’s a number
  let numInt = Number(integer);
  if (!isNaN(numInt)) {
    if (numInt < 1) numInt = 1;
    if (numInt > 5) numInt = 5;
    integer = numInt.toString();
  }

  // Decimal rules
  if (integer === '5') {
    decimal = '';           // no decimal if integer is 5
  } else {
    decimal = decimal.slice(0, 1); // max 1 decimal digit
  }

  // Rebuild final displayed value
  let finalValue = integer;
  if (decimal || value.includes('.')) {
    finalValue += '.' + decimal;
  }

  // Special case: user just typed the dot → keep it visible
  if (value.endsWith('.') && integer !== '5') {
    finalValue = integer + '.';
  }

  // Update model & input
  if (type === 'min') this.filterParameters.interview_score_min = finalValue;
  else this.filterParameters.interview_score_max = finalValue;

  input.value = finalValue;

  // Restore cursor position safely
  const cursor = input.selectionStart ?? 0;
  setTimeout(() => {
    input.setSelectionRange(cursor, cursor);
  }, 0);

  // Min ≤ Max validation
  const minVal = Number(this.filterParameters.interview_score_min || 0);
  const maxVal = Number(this.filterParameters.interview_score_max || 0);
  this.scoreError = !isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal;
}


  fieldName:any = [];
  async onFormChange(formId: string) {
    console.log('Selected form id:', formId);
    this.fieldName = [];
    let find = await this.formOptions.find(el=> el.task_id === formId)
    if(find){
      console.log("find", find)
      if(find?.form_fields && find?.form_fields?.type === "multi_step" ){
        find?.form_fields?.fields.forEach(el=>{
          el.component.forEach(e=>{
            if(e.id==="number"){
              this.fieldName.push({
                page:el.name,
                field:e.name,
                value:el.name+ ' - ' +e.name
              })
            }
          })
        })
      }else{
        find?.form_fields?.fields.forEach(el=>{
         if(el.id==="number"){
              this.fieldName.push({
                page:'',
                field:el.name,
                value:el.name
              })
            }
        })
      }

      console.log("this.fieldName", this.fieldName)
    }
  }

 
  // filters = [
  //   // { name: 'Placement Groups', field: 'placementGroups', selected: false },
  //   // { name: 'Major', field: 'major', selected: false },
  //   { name: 'Priority', field: 'priority', selected: false },
  //   { name: 'Status', field: 'status', selected: false },
  //   // { name: 'assigned_to', selected: false },
  //   // { name: 'enrolment_date', selected: false },
  //   // { name: 'approvals', selected: false },
  //   // { name: 'Monthly Cohort', field: 'monthly_cohort', selected: false },
  //   // { name: 'campus', selected: false },
  //   // { name: 'Resume Level', field: 'resume_level', selected: false },
  //   // { name: 'Area', field: 'area', selected: false },
  //   // { name: 'Location', field: 'post_code', selected: false },
  //   // { name: 'Placement Doc Status', field: 'placement_doc_received', selected: false },
  //   // { name: 'Course Code', field: 'course_code', selected: false },
  //   { name: 'Placement Type', field: 'placementType', selected: false },
  //   { name: 'Interview Score', field: 'interview_score', selected: false },
  //   { name: 'Forms', field: 'forms', selected: false },
  //   // { name: 'Written assessment', field: 'written_assessment', selected: false }
  // ];

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
          
  
  
          if(filter.field === 'interview_score'){
            this.filterParameters.interview_score_max = null
            this.filterParameters.interview_score_min = null
          }
          if(filter.field === 'forms'){
            this.filterParameters.form_id = null
            this.filterParameters.form_field_name = null
            this.filterParameters.form_score_max = null
            this.filterParameters.form_score_min = null
          }
          // if(filter.field === 'course_start_date'){
          //   this.filterParameters.course_start_sdate = null
          //   this.filterParameters.course_start_edate = null
          // }
          // if(filter.field === 'course_end_date'){
          //   this.filterParameters.course_end_sdate = null
          //   this.filterParameters.course_end_edate = null
          // }
          // if(filter.field === 'internship_start_date'){
          //   this.filterParameters.internship_start_sdate = null
          //   this.filterParameters.internship_start_edate = null
          // }
          // if(filter.field === 'internship_end_date'){
          //   this.filterParameters.internship_end_sdate = null
          //   this.filterParameters.internship_end_edate = null
          // }
  
          // if(el.field === 'gpa'){
          //   this.filterParameters.gpa_min_points = null
          //   this.filterParameters.gpa_max_points = null
          // }
  
          // if(el.field === 'credit_points'){
          //   this.filterParameters.credit_max_points = null
          //   this.filterParameters.credit_min_points = null
          // }
  
          // if(filter.field === 'cohort_end_date'){
          //   this.filterParameters.cohort_end_sdate = null
          //   this.filterParameters.cohort_end_edate = null
          // }
          // //  if(filter.field === 'cohort_end_date'){
          // //   this.filterParameters.cohort_end_sdate = null
          // //   this.filterParameters.cohort_end_edate = null
          // // }
          // if(filter.field === 'cohort_start_date'){
          //   this.filterParameters.cohort_start_sdate = null
          //   this.filterParameters.cohort_start_edate = null
          // }if(filter.field === 'graduation_date'){
          //   this.filterParameters.graduation_sdate = null
          //   this.filterParameters.graduation_edate = null
          // }
        });
      }
    }

  onApplyFilter() {
    this.paginationObj = {
      length: 0,
      pageIndex: 0,
      pageSize: this.paginationObj.pageSize,
      previousPageIndex: 0,
      changed:true
    }
    let payload = {}
    console.log("this.filters", this.filters)
    // this.filters.forEach(filter => {
    //   if (filter.selected) {
    //     let value = this.filterParameters[filter.field];
    //     let key = filter.field;
    //     if (filter.field === 'monthly_cohort') {
    //       Object.assign(payload, {monthly_cohort_sdate: moment(this.filterParameters.monthly_cohort_sdate).format("dd/mm/yyyy"), monthly_cohort_edate: moment(this.filterParameters.monthly_cohort_edate).format("dd/mm/yyyy")});
    //     }
    //     if (filter.field === 'interview_score') {
    //       Object.assign(payload, {interview_score_min: this.filterParameters.interview_score_min, interview_score_max: this.filterParameters.interview_score_max});
    //     }
    //     if (filter.field === 'written_assessment') {
    //        Object.assign(payload, {written_assessment_min: this.filterParameters.written_assessment_min, written_assessment_max: this.filterParameters.written_assessment_max});
    //     }
    //     if (filter.field === 'forms') {
    //        Object.assign(payload, {form_id: this.filterParameters.form_id, form_field_name: this.filterParameters.form_field_name, form_score_min: this.filterParameters.form_score_min, form_score_max: this.filterParameters.form_score_max});
    //     }else {
    //       Object.assign(payload, {[filter.field]: value});
    //     }
    //   }
    // });
    this.filters.forEach(filter => {
  if (!filter.selected) return;

  const key = filter.field;
  const value = this.filterParameters[key];

  switch (key) {
    case 'monthly_cohort':
      Object.assign(payload, {
        monthly_cohort_sdate: moment(this.filterParameters.monthly_cohort_sdate).format("DD/MM/YYYY"),
        monthly_cohort_edate: moment(this.filterParameters.monthly_cohort_edate).format("DD/MM/YYYY")
      });
      break;

    case 'interview_score':
      Object.assign(payload, {
        interview_score_min: this.filterParameters.interview_score_min,
        interview_score_max: this.filterParameters.interview_score_max
      });
      break;

    case 'written_assessment':
      Object.assign(payload, {
        written_assessment_min: this.filterParameters.written_assessment_min,
        written_assessment_max: this.filterParameters.written_assessment_max
      });
      break;

    case 'forms':
      Object.assign(payload, {
        form_id: this.filterParameters.form_id,
        form_field_name: this.filterParameters.form_field_name,
        form_score_min: this.filterParameters.form_score_min,
        form_score_max: this.filterParameters.form_score_max
      });
      break;

    default:
      // For all other fields, assign normally
      Object.assign(payload, { [key]: value });
      break;
  }
});

    payload['placement_id'] = [this.id];
    this.service.studentFilter(payload).subscribe((response) => {
      if (response.status == HttpResponseCode.SUCCESS) {

        console.log("response.result", response.result);
        this.eligibleStudentdata = [...this.eligibleStudentdata, ...response.result]
        this.eligibleStudentList = new MatTableDataSource(this.eligibleStudentdata);
        this.paginationObj.length = response.result.length;
        this.eligibleStudentList?.data.forEach(student => {
          student.selected = false;
          if (!student.assigned_to) {
            student.assigned_to = 'No Staff Assign';
          }
          if (!student.priority) {
            student.priority = 'Medium';
          }
        })
        this.eligibleStudentList.sort = this.sort;
      } else {
        // this.eligibleStudentList = [];
        this.service.showMessage({
          message: "Students not found for applied filters"
        });
      }
    })
  }

  callApi(){
    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }
      if (el.field) {
        if(el.field === 'monthly_cohort'){
          this.filterParameters.monthly_cohort_sdate = null
          this.filterParameters.monthly_cohort_edate = null
        }if(el.field === 'interview_score'){
          this.filterParameters.interview_score_min = null
          this.filterParameters.interview_score_max = null
        }if(el.field === 'written_assessment'){
          this.filterParameters.written_assessment_min = null
          this.filterParameters.written_assessment_max = null
        }if(el.field === 'written_assessment'){
          this.filterParameters.form_id = null
          this.filterParameters.form_field_name = null
           this.filterParameters.form_score_min = null
          this.filterParameters.form_score_max = null
        }
        else{
          this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
        }
      }
    })
    this.isArchive = !this.isArchive;
     this.cleardata();
    this.getEligibleStudents();
  }

  status:any = '';
  callApiFilter(s){
    this.status = s;
     this.cleardata();
    this.getEligibleStudents();
  }
  filterCount:any = 0;

  cleardata(){
this.paginationObj.pageIndex=0;
    this.eligibleStudentList = new MatTableDataSource<any>([]);
    this.eligibleStudentList.data = []; 
    this.eligibleStudentdata = [];
  }
eligibleStudentdata:any = [];
  getEligibleStudents() {
    const payload = {
      "is_archive":this.isArchive,
      placement_id: this.id,
      student_filter:this.status,
      limit: this.paginationObj.pageSize, 
      offset: this.paginationObj.pageIndex
    }
    this.service.getEligibleStudents(payload).subscribe((response: any) => {
      console.log("response", response);
      if (response.status == HttpResponseCode.SUCCESS) {
        this.overAllCount.eligibleStudent = response.eligibleStudent;
        this.overAllCount.pendingApproval = response.pendingApproval;
        this.overAllCount.pendingPlacement = response.pendingPlacement;
        this.overAllCount.placed = response.placed;
        this.paginationObj.length = response.total;

           const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.eligibleStudentdata.some(s => s._id === student._id)
        );
        this.eligibleStudentdata = [...this.eligibleStudentdata, ...filteredData];
        if(this.status == "is_placed_students"){
          this.filterCount = this.overAllCount.placed
        }else  if(this.status == "is_pending_placement"){
          this.filterCount = this.overAllCount.pendingPlacement
        }else if(this.status == "is_pending_approvals"){
          this.filterCount = this.overAllCount.pendingApproval
        }

        this.eligibleStudentdata.forEach(student => {
          student.selected = false;
          if (!student.assigned_to) {
            student.assigned_to = 'No Staff Assign';
          }
          if (!student.priority) {
            student.priority = 'Medium';
          }
        })
        this.eligibleStudentList = new MatTableDataSource(this.eligibleStudentdata);
        this.eligibleStudentList.sort = this.sort;
      } else {
        // this.eligibleStudentList = [];
        // this.overAllCount.eligibleStudent = 0;
        // this.overAllCount.pendingApproval = 0;
        // this.overAllCount.pendingPlacement = 0;
        // this.overAllCount.placed = 0;
        // this.paginationObj.length = 0;
      }
    })
  }

  onCheckEligibleStudent(event) {
  //   this.eligibleStudentList = Array.isArray(this.eligibleStudentList) 
  // ? this.eligibleStudentList 
  // : [];
  console.log("this.eligibleStudentList", this.eligibleStudentList)

    this.showButtonHeaders = this.eligibleStudentList.data.some(student => student.selected);
    this.selectedRecords = this.eligibleStudentList.data.filter(student => student.selected);
    if (this.selectedRecords?.length == this.eligibleStudentList.length) {
      this.selectAllStdnt = true;
    } else {
      this.selectAllStdnt = false;
    }
  }

  // selectAllStudent() {
  //   for (let student of this.eligibleStudentList) {
  //     if (this.selectAllStdnt) {
  //       student['selected'] = true;
  //     } else {
  //       student['selected'] = false;
  //     }
  //     this.showButtonHeaders = student['selected'];
  //   }
  //   this.selectedRecords = this.eligibleStudentList.filter(student => student.selected);
  // }

  selectAllStudent() {
    this.eligibleStudentList.forEach(student => student.selected = this.selectAllStdnt);
    this.showButtonHeaders = this.selectAllStdnt;
    this.selectedRecords = this.eligibleStudentList.filter(student => student.selected);
    this.selectedStudent = this.selectedRecords;
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
     this.cleardata();
      this.searchEligibleStudents()
    } else if(!this.searchCriteria.keywords) {
       this.cleardata();
      this.getEligibleStudents();
    }
  }

  searchEligibleStudents() {
    const payload = {
      placement_id: this.id,
      ...this.searchCriteria,
      ...this.limitOffset,
      is_archive: this.isArchive
    }
    this.service.searchEligileStudents(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.paginationObj.length = response.count;
          const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.eligibleStudentdata.some(s => s._id === student._id)
        );
        this.eligibleStudentdata = [...this.eligibleStudentdata, ...filteredData];
         this.eligibleStudentList = new MatTableDataSource(this.eligibleStudentdata);
      } else {
        // this.eligibleStudentList = [];
      }
    })
  }

  async onPriorityUpdate(event, student) {
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
       this.cleardata();
      this.getEligibleStudents();
      return;
    }
    let payload = {
      student_id: [student._id],
      priority: student.priority,
      placement_id: this.id,
    }
    this.service.editEligibleStudent(payload).subscribe((response: any) => {
      this.service.showMessage({message: response.msg});
      if (response.status == HttpResponseCode.SUCCESS) {
        // this.service.showMessage({message: response.msg});
      }
    })
  }

  onStatusUpdate(event, student) {
    let payload = {
      student_id: [student._id],
      status: event,
       placement_id: this.id,
    }
    this.service.editEligibleStudent(payload).subscribe((response: any) => {
      this.service.showMessage({message: response.msg});
      if (response.status == HttpResponseCode.SUCCESS) {
        // this.service.showMessage({message: response.msg});
      }
    })
  }

  onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.eligibleStudentList.length)
    if(this.paginationObj.length<10)return;
     if (this.eligibleStudentList.length >= this.paginationObj.length) return;
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
    this.getEligibleStudents();
  }

  addNewStudents() {
    this.isAddNewStudent = true;
  }

  getStaffName(id) {
    const staff = this.staffList.find(staff => staff._id === id);
    return staff?.first_name + " " + staff?.last_name;
  }

  editStudent(payload) {
    payload['placement_id'] = this.id;
    this.service.editStudent(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Student data updated successfully"
      });
       this.cleardata();
      this.getEligibleStudents();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getNewStudents(event) {
    if (event === "back") {
      this.isAddNewStudent = false;
    } else if (event === "next") {
      this.getEligibleStudents();
    } else {
      this.isAddNewStudent = false;
      this.getEligibleStudents();
    }
  }

  exportStudentData(type) {
    const payload = {
      type,
      student_id: this.selectedRecords.length > 0 ? this.selectedRecords.map(student => student._id) : undefined,
      placement_id: this.id,
      is_archive: this.isArchive,
    } 
    this.service.exportStudents(payload).subscribe((res: any) => {
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  selectStudent(student) {
    this.selectedStudent = this.eligibleStudentList.data.filter(student => student.selected);
    this.staffForm.reset();
    this.partnerForm.reset();
    this.placementTypeForm.reset();
    this.selectedRecords = this.selectedStudent;
  }

  assignToStaff() {
    const payload = {
      student_id: this.selectedStudent.map(student => student._id),
      staff_id: this.staffForm.value.staff_id,
      assign_staff_description: this.staffForm.value.description
    };
    this.editStudent(payload);
  }

  assignToPartner() {
    const payload = {
      student_id: this.selectedStudent.map(student => student._id),
      partner_id: this.partnerForm.value.staff_id,
      assign_partner_description: this.partnerForm.value.description
    };
    this.editStudent(payload);
  }

  setupHide:boolean = false;
  selectPlacementType(event) {
    this.setupHide = false;
    const placementType = this.placementTypes.find(placement => placement.workflow_type_id === event)
    this.placementTypeForm.patchValue({
      placementType: placementType.type,
      placement_type_id: placementType.workflow_type_id,
      self_source: placementType.self_source
    });

    let body ={
      "placement_id": this.id,
      "workflow_type_id": placementType.workflow_type_id,
      "student_id":  this.currentStudent?this.currentStudent._id: this.selectedStudent.length ?this.selectedStudent[0]._id:null
    }
    this.service.getSubmittedTaskByWrkflwTyp(body).subscribe((res: any) => {
   console.log("res", res);
    if(res.status === 200){
      this.setupHide = res.result;
    }else{
      this.setupHide = false;
    }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })

  }

 
  
  changeStudentPriority(student) {
    const payload = {
      student_id: [student._id],
      priority: student.priority
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
    this.router.navigate(['/admin/wil/view-student-profile'], {queryParams: {id: student._id}});
  }
  
  onLockStudent(lockStatus) {
    const selectedStudent = this.selectedStudent.map(student => student._id);
    let payload = {
      locked: lockStatus,
      student_id: selectedStudent.length ? selectedStudent[0] : null
    }
    this.service.lockCandidate(payload).subscribe((response: any) => {
      if (response.code == HttpResponseCode.SUCCESS) {
        lockStatus ? this.closeLockCandidateModal.ripple.trigger.click() : this.closeUnLockCandidateModal.ripple.trigger.click()
        this.cleardata();
        this.getEligibleStudents();
        this.service.showMessage({message: 'Candidate locked successfully'});

      }
    })
  }

  getClassNames(studentStatus) {
    let className = 'custom_dorp_select ';
    const stsClass = this.statusClass.find(status=> status.type === studentStatus);
    if (stsClass) {
      return `${className} ${stsClass.class}`;
    }
  }

  getPriorityClassNames(studentPriority) {
    let className = 'custom_dorp_select ';
    const priorityClass = this.priorityClass.find(priority=> priority.type === studentPriority);
    if (priorityClass) {
      return `${className} ${priorityClass.class}`;
    }
  }

  getVacancyStudent(student) {
    this.studentDetail = student;
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

  terminatePLacement() {
    const payload = {
      placement_id:this.id?this.id:null,
      student_id: this.selectedStudent.map(student => student._id).join(),
      comment: this.comment,
      staff_name: this.userDetail?.first_name + ' ' + this.userDetail?.last_name
    }
    this.selectedStudent.map(student => {return student.selected = false});
    this.service.terminateStudent(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Internship terminated successfully"
        });
         this.cleardata();
        this.getEligibleStudents();
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


  assignPlacementType() {
    const payload = {
      student_id: this.selectedStudent.map(student => student._id),
      placementType: this.placementTypeForm.value.placementType,
      placement_type_id: this.placementTypeForm.value.placement_type_id,
      placement_student_progress:this.student_progress?this.student_progress:'',
      self_source:this.placementTypeForm.value.self_source
    };
    this.editStudent(payload);

    this.currentStudent = {};
  }

  student_progress:any;
  currentStudent:any ={};
  setPlaacemntType(row){
    console.log("row", row);
    // this.currentStudent = row;
    this.placementTypeForm.patchValue({
      "placementType":row.placementType,
      placement_type_id:row.placement_type_id,
       self_source:row.placement_type_id,
    })
  }

  selectStudent1(row){
    this.currentStudent = row;
  }

  removeAll(){

  }

  // removeStudent(){

  //   console.log("selectedStudent", this.selectedStudent);
  //   if(this.selectedStudent.length>1){
  //     for(let i =0 ; i<this.selectedStudent.length; i++){
  //       this.service.removeStudentFromPlacementGroup({student_id:this.selectedStudent[i]._id}).subscribe(res => {
  //         if (res.status == HttpResponseCode.SUCCESS) {
  //         } else {
  //         }
  //       }, err => {
  //         this.service.showMessage({
  //           message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //         });
  //       })
  //       if(i == this.selectedStudent.length-1){
  //             this.selectedStudent = []
  //             this.service.showMessage({
  //               message: "Student removed from Placement Group successfully"
  //             });
  //             this.getEligibleStudents();
  //       }
  //     }
        
      
  //   }else{
  //     this.service.removeStudentFromPlacementGroup({student_id:this.selectedStudent[0]._id}).subscribe(res => {
  //       if (res.status == HttpResponseCode.SUCCESS) {
  //         this.service.showMessage({
  //           message: "Student removed from Placement Group successfully"
  //         });
  //         this.selectedStudent = []
  //         this.getEligibleStudents();
  //       } else {
  //         this.service.showMessage({
  //           message: res.msg
  //         });
  //       }
  //     }, err => {
  //       this.service.showMessage({
  //         message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //       });
  //     })
  //   }
  //   return false;
    
  // }

  async removeStudent() {
  console.log("selectedStudent", this.selectedStudent);

  // return false;
  if (!this.selectedStudent || this.selectedStudent.length === 0) {
    this.service.showMessage({ message: "No students selected." });
    return;
  }

  try {
    // Run all removal requests in parallel
    const requests = this.selectedStudent.map(student =>
      this.service.removeStudentFromPlacementGroup({ student_id: student._id }).toPromise()
    );

    const results = await Promise.allSettled(requests);

    // Check if all succeeded
    const allSuccess = results.every(
      r => r.status === 'fulfilled' && r.value?.status === HttpResponseCode.SUCCESS
    );

    if (allSuccess) {
      this.service.showMessage({
        message: "Student(s) removed from Placement Group successfully"
      });
    } else {
      this.service.showMessage({
        message: "Some students could not be removed. Please try again."
      });
    }

    // Reset list and refresh students
    // this.eligibleStudentList.map(student => student.selected = false);
    this.showButtonHeaders = false;
    this.selectedStudent = [];
     this.cleardata();
    this.getEligibleStudents();

  } catch (err) {
    console.error("Error removing students:", err);
    this.service.showMessage({
      message: err?.error?.errors?.msg || "Something went wrong while removing students."
    });
  }

  return false;
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


    scoreError = false;

  validateScoreRange() {
    const min = this.filterParameters.interview_score_min;
    const max = this.filterParameters.interview_score_max;

    // Clamp min and max between 1 and 5
    if (min != null) {
      this.filterParameters.interview_score_min = Math.min(Math.max(min, 1), 5);
    }
    if (max != null) {
      this.filterParameters.interview_score_max = Math.min(Math.max(max, 1), 5);
    }

    // Auto-fill max if empty
    if ((this.filterParameters.interview_score_min != null) && !this.filterParameters.interview_score_max) {
      this.filterParameters.interview_score_max = this.filterParameters.interview_score_min;
    }

    // Auto-fill min if empty
    if ((this.filterParameters.interview_score_max != null) && !this.filterParameters.interview_score_min) {
      this.filterParameters.interview_score_min = this.filterParameters.interview_score_max;
    }

    // Ensure min <= max
    this.scoreError =
      this.filterParameters.interview_score_min >
      this.filterParameters.interview_score_max;
  }

  preventInvalidScore(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'
    ];

    if (allowedKeys.includes(event.key)) return;

    const value = event.target as HTMLInputElement;
    const currentValue = value.value;

    // Allow numbers 1-5 only
    if (!/[1-5]/.test(event.key) || currentValue.length >= 1) {
      event.preventDefault();
    }
  }

}
