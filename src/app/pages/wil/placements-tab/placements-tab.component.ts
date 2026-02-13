
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxPermissionsService } from 'ngx-permissions';
import Quill from 'quill';
@Component({
  selector: 'app-placements-tab',
  templateUrl: './placements-tab.component.html',
  styleUrls: ['./placements-tab.component.scss'], animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlacementsTabComponent implements OnInit {
  id: any;
  connectedDropLists: string[] = [];
 @Input() updatedPlacementDetail;

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Student>>;
  @ViewChild('closeAllocateToCompanyModal') closeAllocateToCompanyModal;
  @ViewChild('closeLockCandidateModal') closeLockCandidateModal;
  @ViewChild('confirmunallocate') confirmunallocate;
  @ViewChild('closeUnLockCandidateModal') closeUnLockCandidateModal;
  @ViewChild('closeLockCompanyModal') closeLockCompanyModal;
  @ViewChild('closeUnLockCompanyModal') closeUnLockCompanyModal;

  @ViewChild('confirmEmailSend') confirmEmailSend: ModalDirective;
  @ViewChild('confirmEmailSendSuccess') confirmEmailSendSuccess: ModalDirective;
  @ViewChild('alreadyPlacedModel') alreadyPlacedModel: ModalDirective;
  @ViewChild('hcaafpopupExpire') hcaafpopupExpire: ModalDirective;
  @ViewChild('hcaafpopupExpireSoon') hcaafpopupExpireSoon: ModalDirective;
  @ViewChild('confirmAutoMatch') confirmAutoMatch: ModalDirective;
  @ViewChild('confirmAutoMatchSuccess') confirmAutoMatchSuccess: ModalDirective;
  @ViewChild('actionRequired') actionRequired: ModalDirective;
  @ViewChild('showCompanies') showCompanies: ModalDirective;
  @ViewChild('lockCandidatePlacementStep2Done') lockCandidatePlacementStep2Done: ModalDirective;

  
  @ViewChild('placeholderModel', { static: false }) placeholderModel!: ModalDirective;
  
  applyAutoMatch:boolean = false;
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


  showCollapes:any = '';
  showCollapes1:any = '';
  allocateToCompany: FormGroup;
  dataSource: MatTableDataSource<Company>;
  CompaniesData: Company[] = [];
  companyVaccancy = [];
  columnsToDisplay = ['accrodion', 'company_name', 'job_id', 'location', 'vacancies', 'allocated', 'actions'];
  innerDisplayedColumns = ['first_name', 'last_name', 'status', 'actions', 'menus'];

  innerDisplayedColumns1 = ['blank', 'first_name', "student_id", 'location', 'Preference', 'skill', 'action'];
  expandedElement: Company | null;
  selectedStudent: any;
  selectedCompany: any;
  password: string;
  searchCriteria = {
    student: null,
    company: null,
  }
  selectedCandidateForLock = null;
  workingHourForm: FormGroup;
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
    { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
  ];
  isInvalidVaccancy: boolean = false;
  companyAllStudents = [];
  isWILWritePermission = false;

  constructor(
   
    private activatedRoute: ActivatedRoute,
    private service: TopgradserviceService,
    private router: Router,
    private fb: FormBuilder,
     private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef
  ) { }
  studentList = []
  displayedColumns: string[] = ['student_id', 'name', 'last_name', 'priority', 'getVacancyCount', 'company', 'actions'];

  vacancyStudentDetail = [];
  studentVacancyColumns = ['company_name', 'state', 'job_title', 'status'];


  settings = [
    // { id: 1, title: 'Candidate Preferred Distance', distance:0, enabled: false, toogle: false },
    { id: 2, title: 'Candidate’s Industry Preference', enabled: false, toogle: false },
    { id: 3, title: 'Position Title Match', enabled: false, toogle: false },
    { id: 4, title: 'Skills Percentage Match', skill:null, enabled: false, toogle: false },
    { id: 5, title: 'Advanced Settings', enabled: true, allocation:"1",vacancy:"1.25" , toogle: true },
  ];





  onSliderChangeskill(event: any) {
    console.log("event", event);
    this.settings[2].skill = event;
  }
  onSliderChange(event: any) {
    console.log("event", event);
    // this.settings[0].distance = event;
  }

  openAutoMatch(){
    this.settings = [
      // { id: 1, title: 'Candidate Preferred Distance', distance:0, enabled: false, toogle: false },
      { id: 2, title: 'Candidate’s Industry Preference', enabled: false, toogle: false },
      { id: 3, title: 'Position Title Match', enabled: false, toogle: false },
      { id: 4, title: 'Skills Percentage Match', skill:null, enabled: false, toogle: false },
      { id: 5, title: 'Advanced Settings', enabled: true, allocation:"1",vacancy:"1.25" , toogle: true },
    ];
  }

 isAnyToggleTrue(): boolean {
    return this.settings
      .filter(item => item.id !== 5)   // ignore id 5
      .some(item => item.enabled === true);
  }

  circumference = 2 * Math.PI * 27; // radius = 27
  dashoffset: number = 0;
  colorClass: string = 'green';
  // setProgress(number = 0) {
  //   this.dashoffset = this.circumference - (number / 100) * this.circumference;

  //   if (number < 30) {
  //     this.colorClass = 'yellow';
  //   } else if (number < 60) {
  //     this.colorClass = 'red';
  //   } else {
  //     this.colorClass = 'green';
  //   }
  // }

  getDashoffset(value: number): number {
    return this.circumference - (value / 100) * this.circumference;
  }

  getColorClass(value: number): string {
    if (value < 30) return 'yellow-stroke';
    if (value < 60) return 'orange-stroke';
    if (value < 80) return 'green-stroke';
    return 'dark-green-stroke';
  }

  getStrokeColor(value: number): string {
  if (value < 30) return '#F2C94C';
  if (value < 60) return '#FF8F00';
  if (value < 80) return '#26C296';
  return '#4FA352';
}
  maxAllocations = 1;
  maxPerVacancy = '1.5x';
  perVacancyOptions = ['1x', '1.5x', '2x', '3x'];
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

  refreshData() {
    // Replace with your API call
    this.ngOnInit();
  }

  placementGroupDetails:any ;
   getPlacementOverviewDetails() {
      let payload = { id: this.id };
      this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
     
          this.placementGroupDetails = response.result;
         
         
          // this.showPreview();
        }
      })
    }


    onStartDateChange(event: any): void {
      const startDate = event.value;
      const type =this.placementGroupDetails?.internship_end_date_type;
      const duration =this.placementGroupDetails?.internship_end_day;

    if (!startDate || !duration) return;

      const endDate = new Date(startDate);

      if (type === 'week') {
        // add (N weeks * 7 days)
        endDate.setDate(endDate.getDate() + duration * 7);
      } else if (type === 'day') {
        // add (N days)
        endDate.setDate(endDate.getDate() + duration);
      }

      this.workingHourForm.get('internship_end_date')?.setValue(endDate);
    
    }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.allocateToCompany = new FormGroup({
      company: new FormControl(null, [Validators.required]),
      vacancy: new FormControl(null, [Validators.required]),
    })
    this.getPlacementOverviewDetails();
    this.subscribeEvents();
    this.getPlacementStudents();
     this.getPlacementPendingStudents();
    this.getPlacementCompany();
    this.getPlacementCompanyList();
    this.getEmailCategories();
    // COMPANIES.forEach(company => {
    //   if (company.students && Array.isArray(company.students) && company.students.length) {
    //     this.CompaniesData = [...this.CompaniesData, {...company, students: new MatTableDataSource(company.students)}];
    //   } else {
    //     this.CompaniesData = [...this.CompaniesData, company];
    //   }
    // });
    setTimeout(() => {
      this.connectedDropLists = this.CompaniesData.map((company:any) => 'company-' + company._id);
       this.connectedDropLists.push('studentDropList');
      this.dataSource = new MatTableDataSource(this.CompaniesData);
      this.dataSource.sort = this.sort;
    
    },100);
    

    this.FormBuilder();
  }
  FormBuilder(){
      this.days = [
        { name: 'Monday', selected: false },
        { name: 'Tuesday', selected: false },
        { name: 'Wednesday', selected: false },
        { name: 'Thursday', selected: false },
        { name: 'Friday', selected: false },
        { name: 'Saturday', selected: false },
        { name: 'Sunday', selected: false }
      ];
    this.workingHourForm = this.fb.group({
      supervisor: ["", Validators.required],
      internship_start_date: ["", Validators.required],
      internship_end_date: ["", Validators.required],
      internship_days: ["", Validators.required],
      working_hours: ["", Validators.required],


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
  subscribeEvents() {
    this.service.evntEmitter.subscribe((data) => {
      this.id = data.placement_id
      this.getPlacementStudents();
       this.getPlacementPendingStudents();
    })
  }

  categories:any = [];
  getEmailCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
        this.categories = response.data;
    });
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


  getPlacementStudents() {
    const payload = {
      placement_id: this.id
    }
    this.service.getStudentForPlacement(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentList = response.result;
      }
    });
  }
  studentPendingList = [];
  getPlacementPendingStudents() {
    const payload = {
      placement_id: this.id
    }
    this.service.getPendingStudentForPlacement(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentPendingList = response.result;
      }else{
        this.studentPendingList = [];
      }
    });
  }

  getPlacementCompany() {
    const payload = {
      placement_id: this.id
    }
    this.service.getPlacementCompany(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.CompaniesData = response.result;
        //   this.CompaniesData.map((el:any) => {
        //         el._oldStatus = el.status;
        //  });
        
        this.CompaniesData.forEach(company => {
          let payload = {
            placement_id: this.id,
            company_id: company['company_id'],
            vacancy_id: company['_id']
          }
          this.service.getPlacementStudentByCompany(payload).subscribe((data: any) => {
            if (data.status) {
              data.result && data.result.map(el => {
                el._oldStatus = el.status;
              });
              company['students'] = new MatTableDataSource(data.result);
            }
          });
        });

        console.log(" this.CompaniesData",  this.CompaniesData);
        this.dataSource = new MatTableDataSource(this.CompaniesData);
        this.dataSource.sort = this.sort;
      }
    });
  }


  companies:any = [];

  getPlacementCompanyList() {
    const payload = {
      placement_id: this.id
    }
    this.service.getPlacementCompanyList(payload).subscribe((response: any) => {
     if (response.status == HttpResponseCode.SUCCESS) {
        this.companies = response.result;
      }
    });
  }

  getCompanyStudents(company) {
    const payload = {
      company_id: company._id
    }
    return this.service.getStudentByCompany(payload);
  }

  toggleRow(element: Company) {
    element.students && (element.students as MatTableDataSource<Student>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Student>).sort = this.innerSort.toArray()[index]);
    this.selectedCompany = element;
  }

// allocations
  // toggleRow1(element: any) {
  //   console.log("element", element, this.expandedElement);
  //   element.allocate_students && element.allocate_students.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
  //   this.cd.detectChanges();
  //   this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Student>).sort = this.innerSort.toArray()[index]);
  //   this.selectedCompany = element;
  // }
    toggleRow1(element: any) {
    console.log('element', element, this.expandedElement);

    // toggle expand/collapse
    if (element.allocate_students && element.allocate_students.length) {
      this.expandedElement = this.expandedElement === element ? null : element;
    }

    this.cd.detectChanges();

    // keep inner tables sortable
    this.innerTables.forEach((table, index) => {
      (table.dataSource as MatTableDataSource<Student>).sort = this.innerSort.toArray()[index];
    });

    this.selectedCompany = element;
  }

  // applyFilter(filterValue: string) {
  //   this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Student>).filter = filterValue.trim().toLowerCase());
  // }
  activeFilter: string = null;
  filters = {
    PRIORITY: 'priority',
    ALLOCATION_STATUS: 'allocation_status',
    COMPANY: 'company',
    LOCATION: 'location',
    VACANCIES: 'vacancies',
    ALLOCATED: 'allocated'
  }
  applyFilter(filter) {
    this.activeFilter = filter;
  }

  ngAfterViewInit() {
    this.activeFilter = this.filters.PRIORITY;
    // this.activeFilter = this.filters.LOCATION;
  }

  onClickStudent(student, company_id?) {    
    this.selectedStudent = student;
    if (company_id) {
      this.selectedStudent['company_id'] = company_id;
    }
    console.log("this.selectedStudent", this.selectedStudent);
  }

  onClickCompany(company) {
    this.selectedCompany = company;
    console.log("this.selectedCompany", this.selectedCompany);
  }

  async onChangeCompany(event) {
    console.log("event", event);
    let find = await this.companies.find(el=>el._id == event.value);

    this.selectedCompany = find;
    let payload = {
      company_id: event.value,
      status: 'active',
      placement_id: this.id,
    }
    this.service.getCompanyVaccancy(payload).subscribe((response: any) => {
      if (response.code == HttpResponseCode.SUCCESS) {
        this.companyVaccancy = response.data;
      }
    });
  }

  reset(){
    this.FormBuilder()
  }
  onCancelAllocateCompany() {
    this.allocateToCompany.reset();
    this.closeAllocateToCompanyModal.ripple.trigger.click();
  }

  currentDate = new Date();
  millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;

  checkDateDifference(date, compnaydata, element) {
  
    if(date){
       if(compnaydata.hcaaf_signed_by_staff == 'completed' && compnaydata.hcaaf_signed_by_employee == 'completed'){
          const MILLISECONDS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;

          const [day, month, year] = date.split('/').map(Number);
          const endDate = new Date(year, month - 1, day);
          const currentDate = new Date();
        
          // 1️⃣ Expired
          if (endDate.getTime() < currentDate.getTime()) {
            element.color = '#E60028';
            element.message = "This company’s HCAAF is unavailable or has expired!";
            return true;
          }

          // Weeks left
          const timeDifference = endDate.getTime() - currentDate.getTime();
          const weeksDifference = Math.floor(timeDifference / MILLISECONDS_PER_WEEK);

          // 2️⃣ Orange warning — less than 1/4 of validity period left
          const totalValidityWeeks = 6 * 4; // approx. weeks in the validity
          const quarterValidityWeeks = totalValidityWeeks / 4;

          if (weeksDifference <= quarterValidityWeeks) {
            element.color = '#F47761';
            element.message = `This company’s HCAAF has less than 12 weeks until expiry!`;
            return true;
          }

          // 3️⃣ Yellow warning — less than 12 weeks left
          if (weeksDifference <= 12) {
            // element.color = '#FFD700';
            // element.message = `This company’s HCAAF has less than ${weeksDifference} weeks until expiry!`;
            element.color = '#F47761';
            element.message = `This company’s HCAAF has less than 12 weeks until expiry!`;
            return true;
          }

          // ✅ Safe
          return false;
        
        }else{
         
          if(compnaydata.hcaaf_signed_by_employee == "pending"){
            element.message = "This company's HCAAF is pending approval by Employee"
            return true;
          }else if(compnaydata.hcaaf_signed_by_staff == "pending"){
            element.message = "This company's HCAAF is pending approval by Staff";
            return true;
          }
          return false;
        }

    }else{
        element.color = '#E60028';
        element.message = "This company’s HCAAF is unavailable or has expired!";
        return true;
    }
   
  }


  allocateCompany() {
    if (this.allocateToCompany.valid) {
      let payload = {
        placement_id: this.id,
        student_id: this.selectedStudent._id,
        company_id: this.allocateToCompany.value.company,
        vacancy_id: this.allocateToCompany.value.vacancy
      }
      this.selectedDropRow =  this.selectedCompany;
      this.selectedDropRow.company_id = this.selectedCompany._id;
      this.selectedDropRow._id = this.allocateToCompany.value.vacancy;
      // vacancy_id
      this.selectedDropRow['companyDetails'] = this.selectedCompany;
      this.selectedDropRow['student_info'] = this.selectedStudent;

      console.log( this.selectedDropRow, " this.selectedDropRow");
      this.closeAllocateToCompanyModal.ripple.trigger.click();

      if(!this.selectedCompany.hcaaf_expiry){
        this.hcaafpopupExpire.show();
        return
      }
    if(this.selectedCompany.hcaaf_signed_by_staff == "pending"){
         this.hcaafpopupExpire.show();
    }else if(this.selectedCompany.hcaaf_signed_by_employee == "pending"){
     this.hcaafpopupExpire.show();
    }else if(this.selectedCompany.hcaaf_expiry){
          const MILLISECONDS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
          const [day, month, year] = this.selectedCompany.hcaaf_expiry.split('/').map(Number);
          const endDate = new Date(year, month - 1, day);
          const currentDate = new Date();
          console.log("endDate", endDate);
           // Weeks left
          const timeDifference = endDate.getTime() - currentDate.getTime();
          const weeksDifference = Math.floor(timeDifference / MILLISECONDS_PER_WEEK);
          // 2️⃣ Orange warning — less than 1/4 of validity period left
          const totalValidityWeeks = 6 * 4; // approx. weeks in the validity
          const quarterValidityWeeks = totalValidityWeeks / 4;
          // 1️⃣ Expired
          if (endDate.getTime() < currentDate.getTime()) {
            this.hcaafpopupExpire.show();
          }else if (weeksDifference <= quarterValidityWeeks) {
            this.hcaafpopupExpireSoon.show();
          }else if (weeksDifference <= 12) {
           this.hcaafpopupExpireSoon.show();
          }else{
             this.confirmEmailSend.show();
          }
    }else{
      this.confirmEmailSend.show();

    }

      // return false
      this.service.allocateToCompany(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.getPlacementStudents();
          this.getPlacementPendingStudents();
          this.getPlacementCompany();
          this.closeAllocateToCompanyModal.ripple.trigger.click();

          if(!this.selectedCompany.hcaaf_expiry){
            this.hcaafpopupExpire.show();
            return
          }
          
   if(this.selectedCompany.hcaaf_signed_by_staff == "pending"){
         this.hcaafpopupExpire.show();
    }else if(this.selectedCompany.hcaaf_signed_by_employee == "pending"){
     this.hcaafpopupExpire.show();
    }else if(this.selectedCompany.hcaaf_expiry){
          const MILLISECONDS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
          const [day, month, year] = this.selectedCompany.hcaaf_expiry.split('/').map(Number);
          const endDate = new Date(year, month - 1, day);
          const currentDate = new Date();
          console.log("endDate", endDate);
           // Weeks left
          const timeDifference = endDate.getTime() - currentDate.getTime();
          const weeksDifference = Math.floor(timeDifference / MILLISECONDS_PER_WEEK);
          // 2️⃣ Orange warning — less than 1/4 of validity period left
          const totalValidityWeeks = 6 * 4; // approx. weeks in the validity
          const quarterValidityWeeks = totalValidityWeeks / 4;
          // 1️⃣ Expired
          if (endDate.getTime() < currentDate.getTime()) {
            this.hcaafpopupExpire.show();
          }else if (weeksDifference <= quarterValidityWeeks) {
            this.hcaafpopupExpireSoon.show();
          }else if (weeksDifference <= 12) {
           this.hcaafpopupExpireSoon.show();
          }else{
             this.confirmEmailSend.show();
          }
    }else{
          this.confirmEmailSend.show();
    }
          this.service.showMessage({ message: 'Candidate allocated successfully' });
          


        } else {
          this.service.showMessage({ message: response.msg });
        }
      })
    } else {
      this.allocateToCompany.markAllAsTouched();
    }
  }

  lockCandidate(lockStatus) {
    let payload = {
      locked: lockStatus,
      student_id: this.selectedStudent?._id
    }
    this.service.lockCandidate(payload).subscribe((response: any) => {
      if (response.code == HttpResponseCode.SUCCESS) {
        let message: string = null;
        if (lockStatus) {
          message = 'Candidate locked successfully';
          this.closeLockCandidateModal.ripple.trigger.click()
        } else {
          message = 'Candidate unlocked successfully';
          this.closeUnLockCandidateModal.ripple.trigger.click();
        }
        this.getPlacementStudents();
         this.getPlacementPendingStudents();
        this.getPlacementCompany();
        this.service.showMessage({ message: message });
      }
    })
  }

  removeCandidate() {
    let userDetails = JSON.parse(localStorage.getItem('userDetail'));
    let loginPayload = {
      email: userDetails?.email,
      password: this.password,
      type: "admin"
    }

    this.service.login(loginPayload).subscribe((response: any) => {
      // if (response.code == HttpResponseCode.SUCCESS) {
      let removeCandidatePayload = { password: this.password }
      this.service.removeStudent(removeCandidatePayload).subscribe((response: any) => {
        if (response.code == HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: 'Candidate removed successfully' });
          this.getPlacementStudents();
           this.getPlacementPendingStudents();
        }
      })
      // }
    })
  }

  lockCompany(lockStatus) {
    let payload = {
      locked: lockStatus,
      company_id: this.selectedCompany?.company_id,
      vacancy_id: this.selectedCompany?._id
    }
    this.service.lockCompany(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        let message: string = null;
        if (lockStatus) {
          message = 'Vacancy locked successfully';
          this.closeLockCompanyModal.ripple.trigger.click()
        } else {
          message = 'Vacancy unlocked successfully';
          this.closeUnLockCompanyModal.ripple.trigger.click();
        }

        this.getPlacementCompany();
        this.service.showMessage({ message: message });
      } else {
        this.service.showMessage({ message: response.msg });
      }
    })
  }

  removeCompany() {
    let userDetails = JSON.parse(localStorage.getItem('userDetail'));
    let loginPayload = {
      email: userDetails?.email,
      password: this.password,
      type: "admin"
    }
    this.service.login(loginPayload).subscribe((response: any) => {
      let removeCompanyPayload = { password: this.password };
      this.service.removeCompany(removeCompanyPayload).subscribe((response: any) => {
        if (response.code == HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: 'Company removed successfully' });
          // this.getPlacementCompany();
        }
      })
    })
  }

  async onPriorityUpdate(event, student) {
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      this.getPlacementStudents();
       this.getPlacementPendingStudents();
      return;
    }
    let payload = {
      priority: student.priority,
      student_id: [student._id],
      placement_id: this.id,
    }

    this.service.editEligibleStudent(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({ message: response.msg });
      }
    })
  }

  onChangeSearchKeyword(searchFor: string) {
    if (searchFor === 'student') {
      if (this.searchCriteria.student.length >= 3) {
      //   this.paginationObj = {
      //     length: 0,
      //     pageIndex: 0,
      //     pageSize: this.paginationObj.pageSize,
      //     previousPageIndex: 0,
      //     changed: true,
      // };
        this.searchStudents();
      } else if (!this.searchCriteria.student) {
        this.getPlacementStudents();
        this.getPlacementPendingStudents();
      }
    } else {
      if (this.searchCriteria.company.length >= 3) {
        this.searchCompany();
      } else if (!this.searchCriteria.company) {
        this.getPlacementCompany();
      }
    }
  }

  searchStudents() {
    let payload = {
      keywords: this.searchCriteria.student,
      placement_id: this.id,
      limit:100,
      is_archive:  false
    }
    this.service.searchStudent(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentList = response.result;
        this.studentPendingList = response.result;
      } else {
        this.studentList = [];
        this.studentPendingList = [];
      }
    })
  }

  searchCompany() {
    let payload = {
      keywords: this.searchCriteria.company,
      placement_id: this.id
    }
    this.service.searchCompanyPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.CompaniesData = response.result;
        this.CompaniesData.forEach(company => {
          this.service.getStudentByCompany({ company_id: company['_id'] }).subscribe((data: any) => {
            if (data.code) {
              company['students'] = new MatTableDataSource(data.data);
            }
          });
        });
        this.dataSource = new MatTableDataSource(this.CompaniesData);
        this.dataSource.sort = this.sort;
      } else {
        this.CompaniesData = [];
        this.dataSource = new MatTableDataSource(this.CompaniesData);
      }
    })
  }

  unAllocateStudent(){
    console.log(this.changeStatusStudent);
    this.service.removeCmpnyAllcntn({allocation_id:this.changeStatusStudent._id}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message:response.msg
        });
        this.getPlacementCompany();
      } else {
        this.service.showMessage({
          message:response.msg?response.msg:'Something went Wrong'
        });
      }
      this.changeStatusStudent = {};
      this.confirmunallocate.ripple.trigger.click()
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  changeStatusStudent:any = {};

  viewProfile1(student) {
    this.router.navigate(['/admin/wil/view-student-profile'], { queryParams: { id: student._id } });
  }

  async statusChange(){
      console.log("this.changeStatusStudent", this.oldStatus, "this.oldStatus", this.changeStatusStudent,  this.CompaniesData, this.changeStatusStudent.company_info.company_id);

      // let find =await this.CompaniesData.filter(el=> el.company_id == this.changeStatusStudent.company_info.company_id);
      // console.log("find", find)
      // if(find && find.length>0){
      //   let student =await find.students['data'].find(el=> el.student_id == this.changeStatusStudent.student_id );
      //   if(student){
      //     student.status = student._oldStatus?student._oldStatus:this.oldStatus? this.oldStatus:'Application';
      //   }
      // }

      this.CompaniesData.forEach(company => {
      if (company.company_id == this.changeStatusStudent.company_info.company_id) {
        if (company.students && company.students['data']) {
          company.students['data'].forEach((student: any) => {
            if (
              student.student_id == this.changeStatusStudent.student_id &&
              student.vacancy_id == this.changeStatusStudent.vacancy_id
            ) {
              student.status =
                student._oldStatus ??
                this.oldStatus ??
                'Application';
            }
          });
        }
      }
    });


      this.changeStatusStudent = {};
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
        } else {
            this.companyContactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
  
    alreadyPlace:any = null;
async checkPlaced(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    this.service.checkStudentAlreadyPlaced({
      student_id: this.selectedCandidateForLock?.student_id,
      status: "Placed"
    }).subscribe(
      async(res: any) => {
        if (res.status === HttpResponseCode.SUCCESS && res.data && res.data.length>0) {

          this.alreadyPlace =res.data;
          //  this.selectedCandidateForLock.status = this.oldStatus;
           let find =await this.CompaniesData.find(el=> el.company_id == this.changeStatusStudent.company_info.company_id);

            if(find){
              let student =await find.students['data'].find(el=> el.student_id == this.changeStatusStudent.student_id);
              if(student){
                student.status = this.oldStatus? this.oldStatus:'';
              }
            }
          resolve(true);   // student is already placed
        } else {
          resolve(false);  // student not placed
        }
      },
      (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Something went Wrong'
        });
        reject(err);
      }
    );
  });
}

  

  oldStatus:any = '';
  async changeStudentStatus(event, student, oldStatus) {
    console.log("event, student", event, student, oldStatus)
    this.oldStatus = oldStatus;
    console.log(this.oldStatus, "this.oldStatus = ")
    // return;
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      this.getPlacementCompany();
      return;
    }
    if (event?.value === 'Placed') {
      this.selectCandidateToLock(student);
      this.changeStatusStudent = student;
      let check = await this.checkPlaced();
      console.log(check, "check")
      if(check){
       setTimeout(()=>{
         this.alreadyPlacedModel.show();
       }, 500)
      }else{
       document.getElementById('openWorkingHour')?.click();
      }
   
     
      return false;
    } else {
          let user = JSON.parse(localStorage.getItem('userDetail'));
      let payload = {
        status: event.value,
        placement_id: student.placement_id,
        student_id: student.student_id,
        company_id: student.company_id,
        vacancy_id: student.vacancy_id,
        last_created_by: user.first_name+' '+ user.last_name, 
        last_created_by_id: user._id, 
      };
      this.service.editStudentStatus(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: response.msg });
          console.log("this.selectedCandidateForLock", this.selectedCandidateForLock, this.dataSource.data);
          // this.dataSource.data.map((el:any)=>{
          //   if(el.company_id ==student.company_id && el._id===student.vacancy_id){
          //     el.students.data.map(e=>{
          //       e.status = event.value
          //     })
          //   }
          // })
          // this.getPlacementStudents();
          // this.getPlacementCompany();
        }
      })
    }
  }

  goToCompanyProfile(company) {
    
    this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: company.company_id } });
  }

  selectCandidateToLock(candidate) {
    if(candidate.company_info){
      this.selectedCandidateForLock = candidate;
    }else{
      candidate['company_info'] = this.dataSource?.data.find((company: any) => company.company_id === candidate.company_id);
      this.selectedCandidateForLock = candidate;
    }
    this.getCompanyContactList();
    console.log("selectedCandidateForLock", this.selectedCandidateForLock);
  }

  selectDays(selectedDay) {
    selectedDay.selected = !selectedDay.selected;
    const filteredSelectedDay = this.days.filter(day => day.selected);
    this.workingHourForm.patchValue({
      internship_days: filteredSelectedDay.map(day => day.name)?.join()
    });
  }

  getSupervisorDetail(email) {
    return this.companyContactList.find(company => company._id === email);
  }

  @ViewChild('dynamicContainer', { static: false }) dynamicContainer!: ElementRef;
  @ViewChild('dynamicStudentContainer', { static: false }) dynamicStudentContainer!: ElementRef;

  // ngAfterViewInit() {
  //   console.log(this.dynamicContainer.nativeElement.innerHTML); // Ensure it logs properly
  // }
  


  addWorkingHours() {
    const supervisor = this.getSupervisorDetail(this.workingHourForm.value.supervisor)
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
      student_id: this.selectedCandidateForLock?.student_id,
      internship_start_date: moment(this.workingHourForm.value.internship_start_date).format("YYYY-MM-DD"),
      internship_end_date: moment(this.workingHourForm.value.internship_end_date).format("YYYY-MM-DD"),
      company_id: this.selectedCandidateForLock?.company_id,
      vacancy_id: this.selectedCandidateForLock?.vacancy_id,
      internship_days: this.workingHourForm.value.internship_days,
      working_hours: this.workingHourForm.value.working_hours,
      supervisor_id:this.workingHourForm.value.supervisor,
      supervisor: supervisor.first_name + ' ' + supervisor.last_name,
      primary_email: supervisor.primary_email,
      primary_phone: supervisor.primary_phone,
      status: "Placed",
      send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
      student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
      send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
      supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
      student_html:shtml?shtml:undefined,
      employer_html:html?html:undefined,
    }
    this.service.submitWorkingHourFromAdmin(payload).subscribe(res => {
      // this.lockCandidate(true);
     
      if(res.status == 200 ){
        if(res.msg==="This student is already placed in another vacancy."){
          this.service.showMessage({ message: res.msg });
          // this.getPlacementStudents();
          // this.getPlacementCompany();
          console.log("this.selectedCandidateForLock", this.selectedCandidateForLock, this.dataSource);
          this.dataSource.data.map((el:any)=>{
            if(el.company_id ==this.selectedCandidateForLock.company_id && el._id===this.selectedCandidateForLock.vacancy_id){
              el.students.data.map(e=>{
                e.status = "Placed";
              })
            }
          })
        }else{
           this.service.showMessage({ message: res.msg?res.msg:'Working hours added successfully' });
          this.editStudent("Placed");
          this.lockCandidatePlacementStep2Done.show();
        }
         
      }
      this.selectedStudentTemplate = null;
      this.selectedTemplate = null;
      this.FormBuilder()
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  editStudent(status) {
      let user = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      // student_id: [this.selectedCandidateForLock?.student_id],
      status: status,
      placement_id: this.selectedCandidateForLock.placement_id,
      student_id: this.selectedCandidateForLock.student_id,
      company_id: this.selectedCandidateForLock.company_id,
      vacancy_id: this.selectedCandidateForLock.vacancy_id,

      send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
      student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
      send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
      supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
      last_created_by: user.first_name+' '+ user.last_name, 
      last_created_by_id: user._id, 
    };
    this.service.editStudentStatus(payload).subscribe((res: any) => {
      this.getPlacementStudents();
       this.getPlacementPendingStudents();
      // this.getPlacementCompany();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  checkFieldInvalid(field) {
    return this.allocateToCompany.get(field)?.invalid && (this.allocateToCompany.get(field)?.dirty || this.allocateToCompany.get(field)?.touched);
  }

  checkValue(event, company) {
    if (isNaN(event) || event < 0 || event > 99) {
      this.service.showMessage({ message: 'Please enter a valid number between 0 to 99' });
      this.isInvalidVaccancy = true;
      return;
    }
    this.isInvalidVaccancy = false;
    const payload = {
      company_id: company._id,
      placement_id: this.id,
      vacancies: event
    }
    this.service.updateCompaniesStatus(payload).subscribe((res: any) => {
      this.service.showMessage({ message: "Company detail updated successfully" });
    })
  }

  getAllStudentsOfComapany(companyStudents) {
    companyStudents?.data.forEach(students => {
      students.student_info.forEach(studentInfo => {
        this.companyAllStudents.push(studentInfo);
      });
    });
  }

  selectedDropRow:any;
  selectedDropRowbtn:boolean = false;

  onStudentDropSucess(data, status){
    

    // if(status){
      let payload = {
        placement_id: this.id,
        student_id: data.student_info._id,
        company_id: data ? data.company_id : this.selectedCompany?.company_id,
        vacancy_id: data ? data?._id : this.selectedCompany?._id,
        send_mail_to_company:status
      }
  
      console.log("payload", payload);
      this.selectedDropRowbtn = true;
  
      if(this.openAgain){
         this.service.resendAllocationEmail(payload).subscribe((response: any) => {
            console.log("response", response);
           
            if (response.status == HttpResponseCode.SUCCESS) {
              this.getPlacementStudents();
               this.getPlacementPendingStudents();
              this.getPlacementCompany();
              this.confirmEmailSend.hide();
              this.getPlacementCompanyList();
              this.openAgain = false;
              this.selectedDropRowbtn = false;
              if(status){
                this.confirmEmailSendSuccess.show();
              }else{
                this.selectedDropRow = {};
                this.service.showMessage({ message: 'Candidate allocated successfully' });
                this.confirmEmailSend.hide();
              }
            } else {
              this.selectedDropRowbtn = false;
              this.confirmEmailSend.hide();
              this.getPlacementCompanyList();
              this.service.showMessage({ message: response.msg });
            }
          })
      }else{
        this.service.allocateToCompany(payload).subscribe((response: any) => {
          if (response.status == HttpResponseCode.SUCCESS) {
            this.getPlacementStudents();
             this.getPlacementPendingStudents();
            this.getPlacementCompany();
            this.confirmEmailSend.hide();
            this.getPlacementCompanyList();
            this.selectedDropRowbtn = false;
            if(status){
              this.confirmEmailSendSuccess.show();
            }else{
              this.selectedDropRow = {};
              this.confirmEmailSend.hide();
              this.service.showMessage({ message: 'Candidate allocated successfully' });
            }
           
          } else {
            this.confirmEmailSend.hide();
            this.getPlacementCompanyList();
            this.selectedDropRowbtn = false;
            this.service.showMessage({ message: response.msg });
          }
        })
      }
    // }else{
    //   this.confirmEmailSend.hide();
    // }
  
  }
  async onStudentDrop(event, element) {
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      return;
    }
    console.log("event, element", event, element, event.data)
    this.selectedDropRow =  element;
    this.selectedDropRow['student_info'] = event.data;
    console.log("this.selectedDropRow", this.selectedDropRow)

    if(!element.companyDetails.hcaaf_expiry){
        this.hcaafpopupExpire.show();
        return
    }
    if(element.companyDetails.hcaaf_signed_by_staff == "pending"){
         this.hcaafpopupExpire.show();
    }else if(element.companyDetails.hcaaf_signed_by_employee == "pending"){
     this.hcaafpopupExpire.show();
    }else if(element.companyDetails.hcaaf_expiry){
          const MILLISECONDS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
          const [day, month, year] = element.companyDetails.hcaaf_expiry.split('/').map(Number);
          const endDate = new Date(year, month - 1, day);
          const currentDate = new Date();
          console.log("endDate", endDate);
           // Weeks left
          const timeDifference = endDate.getTime() - currentDate.getTime();
          const weeksDifference = Math.floor(timeDifference / MILLISECONDS_PER_WEEK);
          // 2️⃣ Orange warning — less than 1/4 of validity period left
          const totalValidityWeeks = 6 * 4; // approx. weeks in the validity
          const quarterValidityWeeks = totalValidityWeeks / 4;
          // 1️⃣ Expired
          if (endDate.getTime() < currentDate.getTime()) {
            this.hcaafpopupExpire.show();
          }else if (weeksDifference <= quarterValidityWeeks) {
            this.hcaafpopupExpireSoon.show();
          }else if (weeksDifference <= 12) {
           this.hcaafpopupExpireSoon.show();
          }else{
             this.confirmEmailSend.show();
          }
    }else{
       this.confirmEmailSend.show();
    }
    return false;
  }

  openAgain:boolean = false;
  openResendApp(data){
    this.selectedDropRowbtn = false;
    console.log("data", data, this.selectedCompany);
    this.selectedCompany['student_info'] = data['student_info'];
    this.openAgain = true;
    this.selectedDropRow = this.selectedCompany;

    if(!this.selectedCompany.hcaaf_expiry){
        this.hcaafpopupExpire.show();
        return
      }
    if(this.selectedCompany.hcaaf_signed_by_staff == "pending"){
         this.hcaafpopupExpire.show();
    }else if(this.selectedCompany.hcaaf_signed_by_employee == "pending"){
     this.hcaafpopupExpire.show();
    }else if(this.selectedCompany.hcaaf_expiry){
          const MILLISECONDS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
          const [day, month, year] = this.selectedCompany.hcaaf_expiry.split('/').map(Number);
          const endDate = new Date(year, month - 1, day);
          const currentDate = new Date();
          console.log("endDate", endDate);
           // Weeks left
          const timeDifference = endDate.getTime() - currentDate.getTime();
          const weeksDifference = Math.floor(timeDifference / MILLISECONDS_PER_WEEK);
          // 2️⃣ Orange warning — less than 1/4 of validity period left
          const totalValidityWeeks = 6 * 4; // approx. weeks in the validity
          const quarterValidityWeeks = totalValidityWeeks / 4;
          // 1️⃣ Expired
          if (endDate.getTime() < currentDate.getTime()) {
            this.hcaafpopupExpire.show();
          }else if (weeksDifference <= quarterValidityWeeks) {
            this.hcaafpopupExpireSoon.show();
          }else if (weeksDifference <= 12) {
           this.hcaafpopupExpireSoon.show();
          }else{
             this.confirmEmailSend.show();
          }
    }else{
      this.confirmEmailSend.show();
    }
    return false;
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

  viewProfile(student) {
    console.log("student", student)
    this.router.navigate(['/admin/wil/view-student-profile'], { queryParams: { id: student._id } });
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
    total:any ={
      student:0,
      vacancies:0,
      total_companies_allocated:0
    }

    allocations:any = [];
    AllocationdataSource = new MatTableDataSource<any>(this.allocations);
    callAutoMatchApi(){
      let body  = {
          placement_id:this.id
      }
      this.settings.forEach(el=>{
        if(el.enabled && el.id == 3){
            body['position_title_match'] = true;
        }else if(el.enabled && el.id == 4){
            body['skills_match'] = true;
            body['skills_value'] = el.skill;
        }else if(el.enabled && el.id == 2){
            body['industry_preference'] = true;
        } else if(el.enabled && el.id == 5){
            body['student_allocation_limit'] = el.allocation;
            body['vacancy_allocation_limit'] = el.vacancy;
        }
        // else if(el.enabled && el.id == 1){
        //     body['position_distance'] = true;
        //     body['position_distance_value'] = el.distance;
        // }
      });

      this.service.autoAllocateStudents(body).subscribe(async(res) => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.allocations = res.allocations;
         this.allocations =await this.allocations.map(item => ({
            ...item,
            removed: false,
            allocate_students: (item.allocate_students ?? []).map(s => ({
              ...s,
              removed: false
            }))
          }));
         
          this.total.student = res.total_allocated_students;
          this.total.vacancies = res.total_vacancies_allocated;
          this.total.total_companies_allocated = res.total_companies_allocated;
          console.log("this.allocations", this.allocations)
          this.AllocationdataSource = new MatTableDataSource<any>(this.allocations);
          this.AllocationdataSource.filterPredicate = (data: any, filter: string): boolean => {
            // Normalize filter text
            const searchTerm = filter.trim().toLowerCase();

            // Match company name
            const companyName = (data.companyDetails?.company_name || '').toLowerCase();

            // You can add more fields if needed
            const jobTitle = (data.job_title || '').toLowerCase();
            const jobId = (data._id || '').toLowerCase();

            return (
              companyName.includes(searchTerm) ||
              jobTitle.includes(searchTerm) ||
              jobId.includes(searchTerm)
            );
          };
          if(this.allocations.length>0){
            this.applyAutoMatch = true;
          }else{
            this.actionRequired.show();
          }
          // this.showCompanies.show()
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
      // applyAutoMatch = true
      
      // this.confirmAutoMatch.show();
    }

    removeAll(element: any) {
      console.log("element", element);
      element.removed = true;
      element.allocate_students.forEach((s: any) => (s.removed = true));
        console.log(" this.allocations filter",  this.allocations)
    }

    undoAll(element: any) {
      console.log("element", element);
      element.removed = false;
      element.allocate_students.forEach((s: any) => (s.removed = false));
    }

    // removeStudent(element: any, student: any) {
    //    console.log("element", element, student);
    //   student.removed = true;
    // }

    removeStudent(company: any, student: any) {
      console.log("element", company, student);
      student.removed = true;

      // Check how many are not yet removed
      const remaining = (company.allocate_students ?? []).filter(s => !s.removed);

      if (remaining.length === 0) {
        // If no students left → mark company as removed
        company.removed = true;
      }else{
         company.removed = false;
      }
    }

    undoStudent(company: any, student: any) {
      console.log("element", company, student);
      student.removed = false;

      // Count how many students are still active (not removed)
      const activeStudents = (company.allocate_students ?? []).filter(s => !s.removed);

      if (activeStudents.length > 0) {
        // Company should not be marked as removed if at least one student is active
        company.removed = false;
      } else {
        // If all students are removed → company stays removed
        company.removed = true;
      }

    }


    submitAutoMatch(){
      // console.log("this.allocations", this.allocations, this.AllocationdataSource)
      //  console.log(" this.allocations",  this.allocations)
      let array = this.allocations
      // keep only non-removed companies
      .filter(company => !company.removed)
      // also clean their allocate_students arrays
      .map(company => ({
        ...company,
        allocate_students: (company.allocate_students ?? []).filter(s => !s.removed)
      }));

      // console.log(" this.allocations filter",  this.allocations, array)
      // return 
      let body = {
        allocation_data:array,
        placement_id:this.id
      };
         this.service.addAutoAllocateStudents(body).subscribe(res => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.showCompanies.hide();
          this.confirmAutoMatch.hide();
          this.confirmAutoMatchSuccess.show()
          this.confirmAutoMatchSuccess.show();
          this.applyAutoMatch = true;
          this.ngOnInit();
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

    
  
    applySearchFilter() {
      this.AllocationdataSource.filter = this.searchCriteria.company.trim().toLowerCase();
    }
}

export interface Company {
  accrodion: string;
  company_id: string;
  company_name: any;
  job_id: string;
  location: string;
  vacancies: string;
  allocated: string;
  actions: string;
  students?: Student[] | MatTableDataSource<Student>;
}

export interface Student {
  _id: string,
  first_name: string;
  last_name: string;
  status: any;
  actions: string;
  menus: string;
}

export interface CompanyDataSource {
  company_name: any;
  job_id: string;
  location: string;
  vacancies: string;
  allocated: string;
  actions: string;
  students?: MatTableDataSource<Student>;
}

const COMPANIES: Company[] = [
  {
    accrodion: '',
    company_id: '',
    company_name: '',
    job_id: "512",
    location: "Melbourne, VIC",
    vacancies: "",
    allocated: '',
    actions: '',
    students: [
      {
        _id: "",
        first_name: "",
        last_name: "",
        status: "",
        actions: '',
        menus: '',
      },
      {
        _id: "",
        first_name: "",
        last_name: "",
        status: "",
        actions: '',
        menus: '',
      },

    ]
  },
  {
    accrodion: '',
    company_id:'',
    company_name: '',
    job_id: "512",
    location: "Melbourne, VIC",
    vacancies: "",
    allocated: '',
    actions: '',
    students: [
      {
        _id: "",
        first_name: "",
        last_name: "",
        status: "",
        actions: '',
        menus: '',
      },
      {
        _id: "",
        first_name: "",
        last_name: "",
        status: "",
        actions: '',
        menus: '',
      },

    ]
  },


  


];

