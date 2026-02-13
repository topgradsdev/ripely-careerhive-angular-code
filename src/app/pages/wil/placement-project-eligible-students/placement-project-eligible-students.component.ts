import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {HttpResponseCode} from '../../../shared/enum';
import { Utils } from '../../../shared/utility';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-placement-project-eligible-students',
  templateUrl: './placement-project-eligible-students.component.html',
  styleUrls: ['./placement-project-eligible-students.component.scss']
})
export class PlacementProjectEligibleStudentsComponent implements OnInit {
  id: any;
  showButtonHeaders: boolean;
  searchCriteria = {
    keywords: null
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('closeLockCandidateModal') closeLockCandidateModal;
  @ViewChild('closeUnLockCandidateModal') closeUnLockCandidateModal;
  @ViewChild('workflowAssignError') workflowAssignError: ModalDirective;
  @ViewChild('assignToPlacementTypeDone') assignToPlacementTypeDone: ModalDirective;
  
  @Input() updatedPlacementDetail;
  workingHourForm: FormGroup;
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

  @ViewChild('placeholderModel', { static: false }) placeholderModel!: ModalDirective;
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
     { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
  ];
  selectedKey:any = '';
  selectedType:any = '';
  editorContent = '';  // Stores editor content
  editor:Quill;
  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
        ['link']  ,
        ['custom-button']  // Custom button added to toolbar
      ],
      handlers: {
        'custom-button': () => this.insertCustomElement()  // Custom button click handler
      }
    }
    // toolbar: [
    //   ['bold', 'italic', 'underline', 'strike'],        
    //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
    //   ['link']  ,
    //   ['placeholder']   
    // ]
  };


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
     private sanitizer: DomSanitizer,
    private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef
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
    monthly_cohort_edate: null
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
    { name: 'Placement Type', field: 'placementType', selected: false }
  ];
  // displayedColumns: string[] = ['checkbox', 'student_id', 'first_name', 'last_name', 'major', 'assignedTo', 'priority', 'status', 'workflow', 'actions']
  displayedColumns: string[] = ['checkbox', 'student_id', 'first_name', 'last_name', 'major', 'assignedTo', 'priority', 'workflow', 'status', 'actions']
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
       this.getPlacementGroupDetails()
    });
    this.FormBuilder();
    this.getEligibleStudents();
    this.getEmailCategories();
    this.studentFilterOptions();
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
      placement_type_id: ['']
    });
    this.getStaffMembers();
    this.getPlcamentTypes();
    this.activeFilter = this.filters[0].field;
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    console.log("updatedPlacementDetail", this.updatedPlacementDetail);
  }

  FormBuilder(){
    this.workingHourForm = this.fb.group({
      supervisor: ["", Validators.required],
      staff_id: ["", Validators.nullValidator],
      project_start_date: ["", Validators.required],
      project_end_date: ["", Validators.required],

      internship_days: ["", Validators.nullValidator],
      working_hours: ["", Validators.nullValidator],


      // email
      student: [false, Validators.nullValidator],
      student_category: ["", Validators.nullValidator],
      student_template: ["", Validators.nullValidator],
      is_supervisor: [false, Validators.nullValidator],
      supervisor_category: ["", Validators.nullValidator],
      supervisor_template: ["", Validators.nullValidator],

      student_html: ["", Validators.nullValidator],
      employer_html: ["", Validators.nullValidator],
      

    })
  }

  ngOnChanges(): void {
    
    this.getPlcamentTypes();
  }
  placementGroupDetails:any
  imageURL: string = '../../../../assets/img/banner_linkedin.svg';
  getPlacementGroupDetails() {
    let payload = { id: this.placementId };
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
    this.cleardata();
    this.getPlcamentTypes();
    this.getEligibleStudents();
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
        console.log(" this.staffList",  this.staffList)
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
      }
    })
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
    this.filters.forEach(filter => {
      if (filter.selected) {
        let value = this.filterParameters[filter.field];
        let key = filter.field;
        if (filter.field === 'monthly_cohort') {
          Object.assign(payload, {monthly_cohort_sdate: moment(this.filterParameters.monthly_cohort_sdate).format("dd/mm/yyyy"), monthly_cohort_edate: moment(this.filterParameters.monthly_cohort_edate).format("dd/mm/yyyy")});
        } else {
          Object.assign(payload, {[filter.field]: value});
        }
      }
    });
    payload['placement_id'] = [this.id];
    this.service.studentFilter(payload).subscribe((response) => {
      if (response.status == HttpResponseCode.SUCCESS) {

        console.log("response.result", response.result);
        this.eligibleStudentData = [...this.eligibleStudentData, ...response.result];
        
        this.paginationObj.length = response.result.length;
        this.eligibleStudentData?.data.forEach(student => {
          student.selected = false;
          if (!student.assigned_to) {
            student.assigned_to = 'No Staff Assign';
          }
          if (!student.priority) {
            student.priority = 'Medium';
          }
        })
         this.eligibleStudentList = new MatTableDataSource(this.eligibleStudentData);
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
        }else{
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

  cleardata(){
this.paginationObj.pageIndex=0;
      this.eligibleStudentList = new MatTableDataSource<any>([]);
      this.eligibleStudentList.data = []; 
      this.eligibleStudentData = [];
  }
  eligibleStudentData:any = [];
  filterCount:any = 0;
  getEligibleStudents() {
    const payload = {
      "is_archive":this.isArchive,
      placement_id: this.id,
      student_filter:this.status,
      limit: this.paginationObj.pageSize, 
      offset: this.paginationObj.pageIndex
    }
      // getProjectEligibleStudents(data: any): Observable<any> {
    
    this.service.getProjectEligibleStudents(payload).subscribe((response: any) => {
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
          student => !this.eligibleStudentData.some(s => s._id === student._id)
        );
        this.eligibleStudentData = [...this.eligibleStudentData, ...filteredData];
        
        
        if(this.status == "is_placed_students"){
          this.filterCount = this.overAllCount.placed
        }else  if(this.status == "is_pending_placement"){
          this.filterCount = this.overAllCount.pendingPlacement
        }else if(this.status == "is_pending_approvals"){
          this.filterCount = this.overAllCount.pendingApproval
        }

        this.eligibleStudentData.forEach(student => {
          student.selected = false;
          if (!student.assigned_to) {
            student.assigned_to = 'No Staff Assign';
          }
          if (!student.priority) {
            student.priority = 'Medium';
          }
        })
        this.eligibleStudentList = new MatTableDataSource(this.eligibleStudentData);
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
    this.showButtonHeaders = this.eligibleStudentList.data.some(student => student.selected);
    this.selectedRecords = this.eligibleStudentList.data.filter(student => student.selected);
    if (this.selectedRecords?.length == this.eligibleStudentList.length) {
      this.selectAllStdnt = true;
    } else {
      this.selectAllStdnt = false;
    }
  }

  selectAllStudent() {
    for (let student of this.eligibleStudentList) {
      if (this.selectAllStdnt) {
        student['selected'] = true;
      } else {
        student['selected'] = false;
      }
      this.showButtonHeaders = student['selected'];
    }
    this.selectedRecords = this.eligibleStudentList.data.filter(student => student.selected);
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
          student => !this.eligibleStudentData.some(s => s._id === student._id)
        );
        this.eligibleStudentData = [...this.eligibleStudentData, ...filteredData];
        this.eligibleStudentList = new MatTableDataSource(this.eligibleStudentData);
      } else {
        // this.eligibleStudentList = [];
      }
    })
  }

  async onPriorityUpdate(event, student) {
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
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
    console.log("this.eligibleStudentList.data.length", this.eligibleStudentList.data.length)
    if(this.paginationObj.length<10)return;
     if (this.eligibleStudentList?.data.length >= this.paginationObj.length) return;
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
      this.cleardata();
      this.getEligibleStudents();
    } else {
      this.isAddNewStudent = false;
      this.cleardata();
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

   reset(){
    this.FormBuilder()
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
      placement_type_id: placementType.workflow_type_id
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
          message: "Student terminated successfully"
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
    // const payload = {
    //   student_id: this.selectedStudent.map(student => student._id),
    //   placementType: this.placementTypeForm.value.placementType,
    //   placement_type_id: this.placementTypeForm.value.placement_type_id,
    //   placement_student_progress:this.student_progress?this.student_progress:''
    // };
    // this.editStudent(payload);

    let user = JSON.parse(localStorage.getItem('userDetail'));
    const result = this.selectedStudent.map(student => ({
      student_id: student._id,  // or student.id depending on your object
      old_placement_type_id: student.placement_type_id
    }));
    let payload = {
         
      placement_type:this.placementTypeForm.value.placementType,
      placement_type_id:this.placementTypeForm.value.placement_type_id,
      placement_id: this.id,
      student_id: this.selectedStudent.map(student => student._id).toString(),
      company_id: this.selectedStudent.map(student => student.company_id).toString(),
      vacancy_id: this.selectedStudent.map(student => student.vacancy_id).toString(),
      status: this.selectedStudent.map(student => student.project_status).toString(),
      placement_student_progress:this.student_progress?this.student_progress:'',
      placementType: this.placementTypeForm.value.placementType,
      "old_placement_type_ids":result,
      last_created_by: user.first_name+' '+ user.last_name, 
      last_created_by_id: user._id, 
      // placement_type_id[{"student_id": "68f0c85dfed1a1c2235afb6f", "old_placement_type_id": "6901ec86c5ec2286cc5a3b94"}]
 
    };
    this.service.projectEditStudentStatus(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Placement Type selected successfully"
        });
        this.assignToPlacementTypeDone.show();
        this.cleardata();
        this.getEligibleStudents()
      }else{
        this.workflowAssignError.show()  
      }
    })

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
    })
  }

  selectStudent1(row){
    this.currentStudent = row;
  }

  removeStudent(){

    console.log("selectedStudent", this.selectedStudent);
    // return false;
    this.service.removeStudentFromProjectPlacementGroup({student_id:this.selectedStudent[0]._id, placement_id: this.id}).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Student terminated successfully"
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


  selectCandidateToLock(candidate) {
    // console.log("candidate", candidate)
    if(candidate.company_info){
      this.selectedCandidateForLock = candidate;
    }else{
      candidate['company_info'] = this.dataSource?.data.find((company: any) => company.company_id === candidate.company_id);
      this.selectedCandidateForLock = candidate;
    }
    this.getCompanyContactList();

   
    console.log("selectedCandidateForLock", this.selectedCandidateForLock);
  }

  contactList:any = [];
  getCompanyContact(){
    this.service.getContactList({company_id:this.selectedCandidateForLock?.company_id}).subscribe((res:any) => {
      if (res.status == 200) {
        this.contactList = res.data;
        this.contactList = this.contactList.map(c => ({
          ...c,
          fullName: `${c.first_name} ${c.last_name}`
        }));
        console.log("this.selectedCandidateForLock", this.selectedCandidateForLock)
        this.workingHourForm.patchValue({
            supervisor:this.selectedCandidateForLock?.company_info?.placement_supervisor
        })
      } else {
          this.contactList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  companyContactList: any = [];
  getCompanyContactList() {
      this.service.getCompanyContactList({company_id:this.selectedCandidateForLock?.company_id}).subscribe((res:any) => {
      
        if (res.status == HttpResponseCode.SUCCESS) {
          this.companyContactList = res.data;
          this.companyContactList = this.companyContactList.map(c => ({
            ...c,
            fullName: `${c.first_name} ${c.last_name}`
          }));
          this.workingHourForm.patchValue({
              supervisor:this.selectedCandidateForLock?.company_info?.placement_supervisor
          })
          console.log("this.companyContactListthis.companyContactList", this.companyContactList)
        } else {
            this.companyContactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
  

  selectedCandidateForLock = null;
  oldStatus:any = '';
  changeStatusStudent:any = {};
  showCollapes:any = '';
  showCollapes1:any = '';
  async changeStudentStatus1(event, student) {
    console.log("event, student", event.value, student, this.oldStatus);

    // return false
    // student.project_status = this.oldStatus?this.oldStatus:student.project_status;
    this.oldStatus = this.oldStatus?this.oldStatus:student.project_status;
    console.log(this.oldStatus, "this.oldStatus = ")
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      this.cleardata();
      this.getEligibleStudents();
      return;
    }
    if (event.value == 'Placed') {
      this.selectCandidateToLock(student);
      this.changeStatusStudent = student;
      document.getElementById('openWorkingHour')?.click();
      console.log("click to open ", document.getElementById('openWorkingHour'))
      return false;
    } else {
       let user = JSON.parse(localStorage.getItem('userDetail'));
      let payload = {
        status: event.value,
        placement_id: this.id,
        student_id: student._id,
        company_id: student.company_id,
        vacancy_id: student.vacancy_id,
        last_created_by: user.first_name+' '+ user.last_name, 
        last_created_by_id: user._id, 
      };
      this.service.projectEditStudentStatus(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: response.msg });
          this.cleardata();
          this.getEligibleStudents();
        }
      })
    }
  }

  categories:any = [];
  getEmailCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
        this.categories = response.data;
    });
  }

  async statusChange(){
    // console.log("this.changeStatusStudent", this.changeStatusStudent, this.changeStatusStudent.company_info.company_id);

    await this.eligibleStudentList.find(el=> {
      console.log("el._id == this.changeStatusStudent._id", el._id == this.changeStatusStudent._id, el._id , this.changeStatusStudent._id)
      if(el._id == this.changeStatusStudent._id){
        console.log("elelelle console", this.oldStatus)
        el.project_status = this.oldStatus? this.oldStatus:'';
      }
    });

    // if(find){
    //   // let student =await find.students['data'].find(el=> el.student_id == this.changeStatusStudent.student_id);
    //   // if(student){
    //     find.status = this.oldStatus? this.oldStatus:'';
    //   // }
    // }

    this.changeStatusStudent = {};
}

collapsToggle(ids: any) {
  if (this.showCollapes == ids) {
    this.showCollapes = '';
  }
  else {
    this.showCollapes = ids
  }
}

collapsToggle1(ids: any) {
  if (this.showCollapes1 == ids) {
    this.showCollapes1 = '';
  }
  else {
    this.showCollapes1 = ids
  }
}
getSupervisorDetail(email) {
   return this.companyContactList.find(company => company._id === email);
  // return this.selectedCandidateForLock?.company_info?.contact_person?.find(company => company.primary_email === email);
}

getStaffDetail(email) {
  console.log("this.staffList", this.staffList, email)
  return this.staffList?.find(company => company._id === email);
}

@ViewChild('dynamicContainer', { static: false }) dynamicContainer!: ElementRef;
@ViewChild('dynamicStudentContainer', { static: false }) dynamicStudentContainer!: ElementRef;

  async addWorkingHours() {
    const supervisor = await this.getSupervisorDetail(this.workingHourForm.value.supervisor)
    const staff =this.workingHourForm.value.staff_id?await this.getStaffDetail(this.workingHourForm.value.staff_id):null
console.log("staff", staff, this.workingHourForm.value.staff_id);


    let shtml = '';
      // Get the dynamic container element
    if(this.dynamicStudentContainer && this.dynamicStudentContainer.nativeElement){
      const containerStudentElement = this.dynamicStudentContainer.nativeElement;

      // Hide the toolbar
      const stoolbar = containerStudentElement.querySelector('.ql-toolbar');
      if (stoolbar) {
        stoolbar.style.display = 'none';
      }
      
      // Hide any additional toolbars with `.ql-hidden`
      const stoolbar1 = containerStudentElement.querySelector('.ql-hidden');
      if (stoolbar1) {
        stoolbar1.style.display = 'none';
      }
   
        // Hide any additional toolbars with `.ql-hidden`
        const sattachment = containerStudentElement.querySelector('.attachment');
        if (sattachment) {
         sattachment.style.display = 'none';
        }
      
      // Replace <quill-editor> with a <div>
      const squillEditor = containerStudentElement.querySelector('quill-editor');
      if (squillEditor) {
        const divElement = document.createElement('div');
        divElement.innerHTML = squillEditor.innerHTML;
        squillEditor.replaceWith(divElement);
      }
      
      // Hide all <input> elements inside the container
      const sinputs = containerStudentElement.querySelectorAll('input');
      sinputs.forEach((input) => {
        input.style.display = 'none';
      });
      
      // Now get the updated HTML
      const sfullHtml = containerStudentElement.innerHTML;
      
      // Construct the email template
      shtml = `
      <app-html-email-preview>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
          </head>
          <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
            <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
              <tbody>
                ${sfullHtml}
              </tbody>
            </table>
          </body>
        </html>
      </app-html-email-preview>
      `;
    }
   
    let html = '';
    if(this.dynamicContainer && this.dynamicContainer.nativeElement){
  // Get the dynamic container element
  const containerElement = this.dynamicContainer.nativeElement;

  // Hide the toolbar
  const toolbar = containerElement.querySelector('.ql-toolbar');
  if (toolbar) {
    toolbar.style.display = 'none';
  }
  
  // Hide any additional toolbars with `.ql-hidden`
  const toolbar1 = containerElement.querySelector('.ql-hidden');
  if (toolbar1) {
    toolbar1.style.display = 'none';
  }

    // Hide any additional toolbars with `.ql-hidden`
    const attachment = containerElement.querySelector('.attachment');
    if (attachment) {
     attachment.style.display = 'none';
    }
  
  // Replace <quill-editor> with a <div>
  const quillEditor = containerElement.querySelector('quill-editor');
  if (quillEditor) {
    const divElement = document.createElement('div');
    divElement.innerHTML = quillEditor.innerHTML;
    quillEditor.replaceWith(divElement);
  }
  
  // Hide all <input> elements inside the container
  const inputs = containerElement.querySelectorAll('input');
  inputs.forEach((input) => {
    input.style.display = 'none';
  });
  
  // Now get the updated HTML
  const fullHtml = containerElement.innerHTML;
  
  // Construct the email template
   html = `
  <app-html-email-preview>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
      </head>
      <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
        <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
          <tbody>
            ${fullHtml}
          </tbody>
        </table>
      </body>
    </html>
  </app-html-email-preview>
  `;

    }
   

    const payload = {
      placement_id: this.id,
      student_id: this.selectedCandidateForLock?._id,
      project_start_date: moment(this.workingHourForm.value.project_start_date).format("YYYY-MM-DD"),
      project_end_date: moment(this.workingHourForm.value.project_end_date).format("YYYY-MM-DD"),
      company_id: this.selectedCandidateForLock?.company_id,
      vacancy_id: this.selectedCandidateForLock?.vacancy_id,
      // internship_days: this.workingHourForm.value.internship_days,
      // working_hours: this.workingHourForm.value.working_hours,
      supervisor_id:this.workingHourForm.value.supervisor,
      supervisor: supervisor.first_name + ' ' + supervisor.last_name,
      primary_email: supervisor.primary_email,
      primary_phone: supervisor.primary_phone,
      staff_id: this.workingHourForm.value.staff_id,
      staff_name: staff?.first_name + ' ' + staff?.last_name,
      staff_email: staff?.email,
      staff_phone: staff?.phone,
      status: "Placed",
      send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
      student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
      send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
      supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
      student_html:shtml?shtml:undefined,
      employer_html:html?html:undefined,
    }
    this.service.placeStudent(payload).subscribe(res => {
      // this.lockCandidate(true);
      this.service.showMessage({ message: 'Working hours added successfully' });
      this.getEligibleStudents();
      this.editStudent("Placed");
      this.selectedStudentTemplate = null;
      this.selectedTemplate = null;
     
      this.FormBuilder()
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  emailTemplateStudentList:any = [];

  selectCategoryStudent(event) {
    const payload = {
      category_id: event
    }
    this.service.getEmailTemplateByCategoryId(payload).subscribe((response: any) => { 
      this.emailTemplateStudentList = response.result;
    });
  }


  emailTemplateList:any = [];

  selectCategory(event) {
    const payload = {
      category_id: event
    }
    this.service.getEmailTemplateByCategoryId(payload).subscribe((response: any) => { 
      this.emailTemplateList = response.result;
    });
  }

  selectDays(selectedDay) {
    selectedDay.selected = !selectedDay.selected;
    const filteredSelectedDay = this.days.filter(day => day.selected);
    this.workingHourForm.patchValue({
      internship_days: filteredSelectedDay.map(day => day.name)?.join()
    });
  }


  selectedTemplate:any = {};

  async selectTemplate(event) {
    const foundTemplate =await this.emailTemplateList.find(template => template._id === event);
    console.log("foundTemplate", foundTemplate)
    if (foundTemplate) {
      // this.emailReminder.patchValue({
      //   subject: foundTemplate?.subject,
      //   message: foundTemplate?.message
      // });
      this.selectedTemplate = foundTemplate;
      this.selectedTemplate.widgets.values.forEach((email: any) => {
        if (email.data.id=="text") {
          this.workingHourForm.patchValue({
            employer_html: email.data.elementData.value
          })
        //  this.text = email.data.elementData.value;
        }
      });
      this.selectedTemplate.widget = this.sanitizer.bypassSecurityTrustHtml(foundTemplate.widgets.html);
    }
  }
  selectedStudentTemplate:any = '';

  async selectTemplate1(event) {
    const foundTemplate =await this.emailTemplateStudentList.find(template => template._id === event);
    console.log("foundTemplate", foundTemplate)
    if (foundTemplate) {
      // this.emailReminder.patchValue({
      //   subject: foundTemplate?.subject,
      //   message: foundTemplate?.message
      // });
      this.selectedStudentTemplate = foundTemplate;
      this.selectedStudentTemplate.widgets.values.forEach((email: any) => {
        if (email.data.id=="text") {
          this.workingHourForm.patchValue({
            student_html: email.data.elementData.value
          })
        //  this.text = email.data.elementData.value;
        }
      });
      this.selectedStudentTemplate.widget = this.sanitizer.bypassSecurityTrustHtml(foundTemplate.widgets.html);
    }
  }


@ViewChild('searchpInput') searchpInput: ElementRef;
  chooseValue(){
      // const range = this.editor.getSelection(true);  
      // if (range) {
      //   // const elementHtml = '<button class="custom-btn" (click)="handleClick()">Click me</button>';
      //   this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
        
      // }
      if (this.editor) {
        const range = this.editor.getSelection(true);  // Get the current cursor position
    
        if (range) {
            // this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
            // Prepare the placeholder text to be inserted
            const placeholderText = `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`;
    
            // Insert the placeholder text at the current cursor position
            this.editor.clipboard.dangerouslyPasteHTML(range.index, placeholderText);
    
            // Compute the new cursor position
            const newIndex = range.index + placeholderText.length - 10;
    
            // Move the cursor to the end of the inserted placeholder text with a slight delay
            setTimeout(() => {
                console.log("Setting cursor position to:", newIndex);
                this.editor.setSelection(newIndex, 0);
                this.editor.focus();  // Ensure focus remains in the editor
            }, 10); // Delay ensures Quill processes the update
        } else {
            console.log("No valid selection found in the editor");
        }
    }
      setTimeout(() => {
        if (this.selectedType) {
          this.getKey();
        }
      }, 200);
      this.placeholderModel.hide();
      // this.selectedType = '';
      this.selectedItem = '';
      this.selectedKey = '';
      // this.placeholderList = [];
      // this.filteredplaceholderList = [];
      // this.copyPlacementTypes();
    }
    selectedItem:any = '';
    placeholderList:any = [];
  
    //open model
    insertCustomElement() {
      // this.selectedType = '';
      this.selectedItem = '';
      this.selectedKey = '';
      // this.placeholderList = [];
      // this.filteredplaceholderList = [];
      // this.copyPlacementTypes();
      // this.closeSendEmailModal.ripple.trigger.click();
      // this.placeholderModel = this.modalService.show(this.placeholderModel, {
      //   ignoreBackdropClick: true,
      //   keyboard: false,
      // });
   
      this.placeholderModel.show();
    
      setTimeout(() => {
        this.cdr.detectChanges(); 
        if (this.searchpInput) {
          this.searchpInput.nativeElement.focus();
        }
      }, 300); 
      console.log("this.placeholderModel", this.placeholderModel);
  
    }
  
  
    filteredplaceholderList:any = [];
    copyPlacementTypes(){
      this.filteredplaceholderList = this.placeholderList;
      // console.log("this.allPlacementTypes", this.filteredplaceholderList);
    }
  
    getKey(){
      this.placeholderList = [];
      this.filteredplaceholderList =  [];
      var obj = {
        type: this.selectedType.toLowerCase()
      }
      this.service.getEmailTemplateKey(obj).subscribe(res => {
        // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
        if (res.status == 200) {
          this.placeholderList = res.db_fields;
          this.copyPlacementTypes();
        } else {
          this.placeholderList = [];
        }
       
      }, err => {
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }
  
    search(){
  
    }
  
    @ViewChild('searchInput') searchInput!: ElementRef;
  
    setFocus() {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0);
    }
  
    applyFilter1(filterValue) {
  
      this.selectedKey = filterValue.target.value
      this.filteredplaceholderList = this.placeholderList.filter(item => {
        return item.title?.toString().toLowerCase().includes(this.selectedKey.toLowerCase());
      });
  
    }
  
  
    onEditorCreated(quill: Quill) {
      this.editor = quill;
      this.editor.focus()
    }
    onContentChanged = (event, data) =>{
      if (event.html) {
        data.data.elementData.value = event.html;
        // console.log("event.html", event.html)
      }
    }
    onSelectionChanged(event: any): void {
      console.log('Selection Changed:', event);
    }
}
