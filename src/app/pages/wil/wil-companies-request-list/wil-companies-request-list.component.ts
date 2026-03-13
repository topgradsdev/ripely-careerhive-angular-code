import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import moment from 'moment';
import { LoaderService } from '../../../loaderservice.service';
import { MatTooltip } from '@angular/material/tooltip';
import { Location } from '@angular/common';
import Quill from 'quill';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-wil-companies-request-list',
  templateUrl: './wil-companies-request-list.component.html',
  styleUrls: ['./wil-companies-request-list.component.scss']
})
export class WilCompaniesRequestListComponent implements OnInit {
  jobSkills: any = [];
  essentials: FormGroup;
  routeForm: FormGroup;
  selectedJobSkills: any = [];
  selectedCompany: any = {};
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }
  @ViewChild('approveCompany') approveCompany: ModalDirective;
  @ViewChild('disapproveCompany') disapproveCompany: ModalDirective;
  @ViewChild('removeCompany') removeCompany: ModalDirective;
  @ViewChild('successPlace') successPlace: ModalDirective;
  
  @ViewChild('removeCompanySuccess') removeCompanySuccess: ModalDirective;
  
  
  limitOffset = {
    limit: this.paginationObj.pageSize,
    offset: this.paginationObj.pageIndex
  }
  searchCriteria = {
    keywords: null
  }
  placementGroups = [];




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



  addCompanyToPlacementColumn = ['company_code', 'company_name', 'location', 'abn_acn']

  constructor(private service: TopgradserviceService, private router: Router, private fb: FormBuilder, 
    private ngxPermissionService: NgxPermissionsService, private cdRef: ChangeDetectorRef, private loader: LoaderService, private location: Location,   private sanitizer: DomSanitizer) { }
  activeFilter:any = { name: 'placementGroups', value: '' };
  filters = [
    { name: "placementGroups", label: "Simulation Group", selected: false, value: "" },
    { name: "currently_placed", label: "Currently Placed", selected: false, value: "" },
    { name: "location", label: "Location", selected: false, value: "", suburb:'' },
    { name: "no_of_employees", label: "No. of Employees", selected: false, value: "" },
    { name: "lead_source", label: "Lead Source", selected: false, value: "" },
    { name: "conversion_status", label: "Conversion Status", selected: false, value: "" },
    { name: "created_by", label: "Created By", selected: false, value: "" },
    { name: "site_status", label: "Site Status", selected: false, value: "" },
    { name: "last_updated_by", label: "Last Updated By", selected: false, value: "" },
    // { name: "last_hcaaf_date", label: "Last HCAAF Update", selected: false, value: "" },
    { name: "hcaaf_expiry", label: " HCAAF Expiry", selected: false, value: "" },
    { name: "whs_check", label: "WHS", selected: false, value: "" },
    { name: "company_concent_to_use_logo", label: "Site Consent to use Logo", selected: false, value: "" },
    { name: "industries", label: "Industries", selected: false, value: "" },
    // { name: "currently_placed", label: "Currently Placed", selected: false, value: "" },
   
    // { name: "hcaaf_status", label: "HCAAF Status", selected: false, value: "" },
   
   
   
    // { name: "campus", label: "Campus", selected: false, value: "" },
    //
    // { name: "suburb", label: "Suburb", selected: false, value: "" },
    // { name: "state", label: "State", selected: false, value: "" },
    // { name: "post_code", label: "Post Code", selected: false, value: "" },
  ];

  applyFilter(filter) {
    this.activeFilter = filter;
  }

  isAddNewIndustryPartners = false;

  overAllCount:any = {
   pending_company_count:0,
   pending_onbording_count:0,
   rejected_count:0
  }
  companiesList: any = []
  placemenGroupIds = [];
  placemenGroupVacnacyIds = [];
  isCheck = false;
  selectedRecords:any = [];
  displayedPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']
  displayedCompanyPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']
  displayedCompanyPreferredColumns: string[] = ['contact_name', 'department', 'title', 'primary_email', 'primary_phone']
  displayedCompanyVacanciesColumns: string[] = ['no', 'name', 'vacancy_type', 'allocated', 'placed']

  displayedColumns: string[] = [
    'checkbox',
    'company_name',
    'requested_by',
    'request_date',
    'abn_acn',
    // 'location',
    'contact',
    'vacancy',
    'actions'
  ]
   displayedColumns1: string[] = [
    'checkbox',
    'company_name',
    'requested_by',
    'request_date',
    'abn_acn',
    // 'location',
    'contact',
    'actions'
  ]

   
  getDisplayedColumns(): string[] {
  if (this.self_source_status === 'pending' && this.self_source_step === '') {
    return this.displayedColumns;
  }
  return this.displayedColumns1;
}

  approveStep:boolean = false;

  dropDownColumns:any =[
    { name: "Vacancies", value: "vacancies" },
    { name: "Address", value: "address" },
    { name: "Suburb", value: "suburb" },
    { name: "State", value: "state" },
    { name: "Postcode", value: "postal_code" },
    { name: "Company Description", value: "company_description" },
    { name: "ABN/ACN", value: "abn_acn" },
    { name: "No. Of Employees", value: "no_of_employees" },
    { name: "Company Phone", value: "company_phone" },
    { name: "Company Alias", value: "company_alias" },
    { name: "Company Industry", value: "company_industry" },
    { name: "Site Status", value: "site_status" },
    { name: "Web Address", value: "web_address" },
    { name: "Conversion Status", value: "conversion_status" },
    { name: "Created By", value: "created_by" },
    { name: "Date Created", value: "date_created" },
    { name: "Last Updated By", value: "last_updated_by" },
    { name: "Last Updated", value: "last_updated" },
    { name: "HCAAF Status", value: "hcaaf_status" },
    { name: "Last HCAAF Update", value: "last_hcaaf_update" },
    { name: "Students Placed", value: "student_placed" },
    { name: "Simulation Group", value: "vacancy_count" },
    { name: "WHS Check", value: "whs_check" },
    { name: "Site Consent To Use Logo", value: "company_concent_to_use_logo" }
  ]

  company: any;
  companyPlacementGroup = [];
  @ViewChild('companiesTbSort') companiesTbSort = new MatSort();
  selectAllComp: any;
  companyFilters = [];

  reminderForm:FormGroup;
  isWILWritePermission = false;

  @ViewChild('addColumnPopup') addColumnPopup: ModalDirective;
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
    // this.addNewColumnPopup.show();
  }

  checkColumnExist(){
    if(this.displayedColumns.length>3){
      return false;
    }else{
      return true;
    }
  }


  
  showDisplayedColumns(){
      this.displayedColumns = this.displayedColumns
      .map(col => col);
  }
  

  ngAfterViewInit() {
    // this.activeFilter = this.filters[0].field;
    // this.eligibleStudentList.sort = this.sort;
   this.showDisplayedColumns();
    // this.getColumnStudents();
    //  setTimeout(() => {
    //   // this.approveCompany.show();
    //   this.tooltip.show(); // Open the tooltip after view init
    //     //  this.tooltip.disabled = true;
    // }, 500);
 
    //  this.loadDisplayColumnsFromLocalStorage();
    // this.prepareDisplayColumnFilter();
  }

  @ViewChild('tooltip') tooltip!: MatTooltip;

  ngOnInit(): void {
    this.getCompaniesList();
    this.getEmailCategories();
    this.FormBuilder();
   
    // this.selectCategory();
    // this.getPlacementGroups("");
    // this.companyFilterOptions();
    // setTimeout(() => {
    //     this.SaveAsFavoriteFilter.show();
    // }, 200);
    //  console.log("formattedColumns", this.formattedColumns);
    // this.getStaffMembers();
    // this.reminderForm = this.fb.group({
    //   staff_id: ["", [Validators.required]],
    //   description: ["", [Validators.required]]
    // });

    // this.routeForm = this.fb.group({
    //   'contacts': ['', [Validators.required]]
    // });
    // this.getsaveFilter(this.notepage);
    // this.getotherFilter();

  }

  // companyFilterOptions() {
  //   this.service.companyFilterOptions().subscribe((response: any) => {
  //     if (response.status == HttpResponseCode.SUCCESS) {
  //       this.companyFilters = response.result;
  //     }
  //   })
  // }

  // getTitle(){
  //   return 'Selected Parameters: '+this.filterList.join(', ');
  // }


  onCheckboxChange(event: MatCheckboxChange, filter): void {
 
  
    if (event.checked) {
      console.log('Checkbox is selected');
      // Add logic for when the checkbox is selected, if needed.
    } else {
      console.log('Checkbox is deselected');
     
      this.filters.forEach((el:any) => {
        if (filter.name === el.name) {
          filter.value = [];
          // this.activeFilter[filter.name].value = []
          el.value = []; // Corrected 'field' to 'filter.field'
        }
      });
    }
  }
  

  resetfilter(){
    // this.hcaaf_start_sdate = null;
    // this.hcaaf_end_sdate = null;
    // this.last_hcaaf_sdate = null;
    // this.last_hcaaf_edate = null;
    this.activeFilter = { name: 'placementGroups', value: '' };
    this.filters.map((el:any)=>{
      el.selected = false;
      if (Array.isArray(el.value) && el.value.length > 0) {
        el.value =[];
      }else{
        el.value = "";
      }
    })
  this.paginationObj = {
    length: 0,
    pageIndex: this.paginationObj.pageIndex,
    pageSize: this.paginationObj.pageSize,
    previousPageIndex: 0,
    changed: true,
  }; 
  }

  
  status:any = '';
  async callApi(s){
    console.log("this.filters", this.filters);
    // this.filters.forEach(el=>{
    //   if(el.selected){
    //     el.selected =false
    //   }
    //   if (el.name) {
    //     if(el.field === 'course_start_date'){
    //       this.filterParameters.course_start_sdate = null
    //       this.filterParameters.course_start_edate = null
    //     }else if(el.field === 'course_end_date'){
    //       this.filterParameters.course_end_sdate = null
    //       this.filterParameters.course_end_edate = null
    //     }else if(el.field === 'internship_start_date'){
    //       this.filterParameters.internship_start_sdate = null
    //       this.filterParameters.internship_start_edate = null
    //     }else if(el.field === 'internship_end_date'){
    //       this.filterParameters.internship_end_sdate = null
    //       this.filterParameters.internship_end_edate = null
    //     }else{
    //       this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
    //     }
    //   }
    // })
    this.status = s;
    // this.getCompaniesList();
      if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchCompany();
    }else if (!this.searchCriteria.keywords) {
      this.getCompaniesList();
    } else{
      this.getCompaniesList();
    }
  }
  self_source_status:any = 'pending'; //rejected
  self_source_step:any = ''; //onbording
  getCompaniesList() {
    let  payload = {
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex,
      self_source_status:this.self_source_status,
    }
    if(this.self_source_step){
      payload['self_source_step'] = this.self_source_step
    }
     if(this.searchCriteria.keywords){
      payload['search_query'] = this.searchCriteria.keywords
    }

    this.loader.show();
    this.service.getPendingCompaniesList(payload).subscribe(async(response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        // await response.result.forEach(row => this.changetype('company_type', row));
        this.overAllCount.companies = response.companies;
        this.overAllCount.pending_company_count = response.pending_company_count;
        this.overAllCount.pending_onbording_count = response.pending_onbording_count;
        this.overAllCount.rejected_count = response.rejected_count;
        this.paginationObj.length = response.count;
        this.companiesList = new MatTableDataSource(response.result);
        this.companiesList.data.forEach(company => {
          company.selected = false;
        });
        this.selectAllComp = false;
        this.companiesList.sort = this.companiesTbSort;
        this.loader.hide();
        this.resetCheckBox();
      } else {
          this.overAllCount.companies = 0;
          this.overAllCount.pending_company_count = 0;
          this.overAllCount.pending_onbording_count = 0;
          this.overAllCount.rejected_count = 0;
          this.companiesList = new MatTableDataSource([]);
          this.companiesList = [];
          this.loader.hide();
      }
    },(err)=>{
        this.overAllCount.companies = 0;
        this.overAllCount.pending_company_count = 0;
        this.overAllCount.pending_onbording_count = 0;
        this.overAllCount.rejected_count = 0;
        this.companiesList = new MatTableDataSource([]);
        this.companiesList = [];
        this.loader.hide();
    })
  }

  reset(){
    this.placementGroups = null;
    this.placemenGroupIds = null;
    this.selectedStudentTemplate = null;
    this.selectedTemplate = null;
    this.showCollapes= null;
    this.showCollapes1= null;
    this.FormBuilder();

    this.workingHourForm.patchValue({
      student: false, // default unchecked,
      is_supervisor: false // default unchecked
    });
  }
  type:any = 'internship';
  async onSelectionChange(selectedItems: any) {
    console.log('Selected items:', selectedItems, this.selectedRecords);
    this.placemenGroupVacnacyIds = [];
    let find = this.placementGroups.find(el => el._id === selectedItems);

    if (find) {
        if (find.category_id === "65a21e64fa6a8e4f5b252994") {
            if (this.selectedRecords.length === 1) {
                this.type = 'project';
                this.openModelPlacement(find._id);
            } else {
                // this.alertPGProject.show();
                setTimeout(() => {
                    this.placemenGroupIds = null;
                    this.cdRef.detectChanges(); // Force UI update
                }, 100);
            }
        }else{
          this.type = 'internship';
          this.openModelPlacement(find._id);
        }
    } else {
        this.type = 'internship';
        this.openModelPlacement('');
    }
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

resetForm(){
  this.selectedInactiveRecords = [];
    this.selectedRecords = [];
    this.placemenGroupIds = [];
    this.placementGroups= [];
    this.FormBuilder();
    
  // this.addCompanyPlacement.hide();
    // if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
    //   this.searchCompany();
    // }else if (this.filters.length>0) {
    //   let find = await this.filters.find(el=>el.selected);
    //   if(find){
    //     this.filterCompanies();
    //   }else{
    //     this.getCompaniesList();
    //   }
    // } else if (!this.searchCriteria.keywords) {
    //   this.getCompaniesList();
    // } else{
    //   this.getCompaniesList();
    // }
    
    // this.placemenGroupIds = null;
    // this.placemenGroupVacnacyIds = this.type === 'internship' ? [] : null;
    this.companiesList.data.map(company => {
      company.selected=false;
    });
}
  selectedInactiveRecords: any = [];
  selectCompany() {
    this.isCheck = this.companiesList.data.some(company => company.selected);
    this.selectedRecords = this.companiesList.data.filter(company => company.selected && company.site_status != "Blacklisted" && company.site_status != "Inactive");

    this.selectedInactiveRecords = this.companiesList.data.filter(company => company.selected && (company.site_status == "Blacklisted" || company.site_status == "Inactive"));
    // this.getCompanyContactList();
    console.log(" this.selectedRecords", this.selectedRecords, this.selectedInactiveRecords)
    if (this.selectedRecords?.length != this.companiesList.data.length) {
      this.selectAllComp = false;
    }
  }

  resetCheckBox(){
    this.companiesList.data.map(company => {
      company.selected=false;
    });
    this.selectedRecords = [];
    this.isCheck = false;
  }
  isManualFilter: boolean = false;

  async getPaginationData(event) {
    this.paginationObj = event;
    console.log("this.event", event)
    //  if (this.isManualFilter) {
    //   this.isManualFilter = false; // reset for next pagination
    //   return;
    // }
    if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchCompany();
    }else if (!this.searchCriteria.keywords) {
      this.getCompaniesList();
    } else{
      this.getCompaniesList();
    }
    this.resetCheckBox();
  }

  back(){
      if(this.self_source_status==='pending' || this.self_source_step=='onbording'){
        this.self_source_step = ''; 
      }
     if(this.self_source_status==='rejected'){
        this.self_source_status='pending';
         this.self_source_step = '';
      }
       this.getCompaniesList();
  }
  onChangeSearchKeyword(searchFor: string) {
    if (this.searchCriteria.keywords.length >= 3) {
      this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: true,
    };
      this.searchCompany();
    } else if(!this.searchCriteria.keywords){
      this.getCompaniesList();
    }
  }

  searchCompany() {
    if (!this.searchCriteria.keywords.trim(' ')) {
      this.paginationObj = {
          length: 0,
          pageIndex: this.paginationObj.pageIndex,
          pageSize: this.paginationObj.pageSize,
          previousPageIndex: 0,
          changed: true,
      };
    }
     this.getCompaniesList();
  }

  goToCompanyProfile(company) {
    this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: company._id } });
  }

  clearModel() {
    this.placemenGroupIds = [];
    this.placemenGroupVacnacyIds = [];
  }

  selectAllCompany() {
    for (let company of this.companiesList.data) {
      if (this.selectAllComp) {
        company['selected'] = true;
      } else {
        company['selected'] = false;
      }
      this.isCheck = company['selected'];
    }
    this.selectedRecords = this.companiesList.data.filter(company => company.selected && company.site_status != "Blacklisted" && company.site_status != "Inactive");

    // this.selectedInactiveRecords = this.companiesList.data.filter(company => company.selected && (company.site_status == "Blacklisted" || company.site_status == "Inactive"));

    console.log(this.selectedRecords, this.selectedInactiveRecords)
  }


  async changeStatus(key, data) {
      //  this.clearData();
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchCompany();
    } else if (!this.searchCriteria.keywords) {
      this.getCompaniesList();
    } else{
      this.getCompaniesList();
    }
     
      return;
    }
    const payload = {
      [key]: data[key],
      comapny_id: [data._id]
    }
    this.service.updateComapniesStatus(payload).subscribe(async(res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Company status updated successfully"
        });
        if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
          this.searchCompany();
        }else if (!this.searchCriteria.keywords) {
          this.getCompaniesList();
        } else{
          this.getCompaniesList();
        }
      } else {
        this.service.showMessage({
          message: res.msg
        });
      }
    });
  }


  // async checkExist(){
  //   console.log(":this.placemenGroupIds", this.placemenGroupIds);
  //   let find = await this.placementGroups.find(el=>el._id ==  this.placemenGroupIds);
  //     console.log("find", find)

  //     // return false;
  //   if(find && find.is_vacancy && find.category_id !="65a21e05fa6a8e4f5b252993"){
  //      this.placement = find;
  //     //  this.addCompanyPlacement.hide();
  //     // this.successAssignPGExist.show();
  //   }else{
  //      this.addToPlacementGroup();
  //   }
  //   return false;
  // }


  vacncies:any = [];
  openModelPlacement(id){

    const payload = {
      company_ids: this.selectedRecords.map(el=>el._id),
      type:this.type,
      placement_id:id
    }

    this.service.getVacancyByCompany(payload).subscribe((res: any) => {
      if (res.status === HttpResponseCode.SUCCESS) {
        // this.addCompanyPlacement.show();
        this.vacncies = res.data;
      }
    })


   
  }

  reSendOtpEmail() {
    let body = {
      "company_id" :this.selectedCompany._id,
      "contact_person":this.routeForm.value.contacts
    };
    this.service.resendOTPEamilCompany(body).subscribe(res => {
      if (res.status == 200) {
        this.service.showMessage({ message: res.msg });
        this.routeForm.reset()
        // this.closeResendOTPEmailModal.ripple.trigger.click();
        // this.emailSendSuccess.show();
        this.selectedCompany = {};
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
    this.service.deleteCompanyNote(body).subscribe(res => {
      if (res.status == 200) {
        this.addnote = false;
        this.getNotes(this.notepage);
        this.selectedNode = null;
        // this.closeConfirmDeleteModal.ripple.trigger.click();
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

  notepage:any = 0;
  notelimit:any = 5;
  totalNotes:any = 0
  totalNoteList:any = 0
  noteList:any = [];
  getNotes(page){
    this.notepage = page;
    this.notelimit = 5;
    let body = {
      "company_id": this.selectedCompany._id,
      "limit": this.notelimit,
      "offset": page,
     }
    this.service.getCompanyNote(body).subscribe(res => {

      console.log("res", res);
      if (res.status == 200) {
        // this.addnote = false
        if(res.count <= this.notelimit){
          this.notelimit = res.count;
        }

        // let totalPages_pre = (res.count/this.notelimit)
        // this.totalNotes = (search.total % page_size) == 0 ? totalPages_pre : totalPages_pre + 1
        this.totalNoteList = res.count;
        this.totalNotes = Math.ceil(res.count/this.notelimit);
        console.log(" this.totalNotes",  this.totalNotes);
        this.noteList  = res.result;
      } else {
        this.noteList  =[];
        // this.totalNoteList =0;
        // this.notelimit =0;
        // this.service.showMessage({ message: res.msg });
      }
    }, err => {
      this.noteList  = [];
      if(err?.status == 204){

      }else{
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
      }

    }
    );
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
        "company_id": this.selectedCompany._id,
        "created_by": this.userDetail._id,
        "description": this.note 
       }
      this.service.updateCompanyNote(body).subscribe(res => {
        if (res.status == 200) {
          this.addnote = false;
          this.selectedNode = null;
          this.getNotes(this.notepage);
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
        "company_id": this.selectedCompany._id,
        "created_by": this.userDetail._id,
        "description": this.note 
       }

       console.log("body", body)
      this.service.addCompanyNote(body).subscribe(res => {
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


  reminderToStaff() {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
        "company_id": this.selectedCompany._id,
        "type": "company",
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
        // this.closeReminderModal.ripple.trigger.click();
        // this.reminderToStaffDone.show()
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

  staffName:any = '';
  async getStaffvalue(){
    console.log(this.reminderForm.value.staff_id, this.staffList);
    if(this.reminderForm.value.staff_id){
      const staff =await this.staffList.find(staff => staff._id === this.reminderForm.value.staff_id);
      console.log("staff", staff)
      this.staffName = staff?.first_name + " " + staff?.last_name;
    }
  }

  // getStaffName(id) {
  //   console.log("id", id);
  //   if(id){
  //     const staff = this.staffList.find(staff => staff._id === id);
  //     console.log("staff", staff)
  //     return staff?.first_name + " " + staff?.last_name;
  //   }
  // }
  
  staffList:any = [];
  getStaffMembers() {
    this.service.getStaffMembers({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffList = response.result;
      }
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
  selectedGroups = new Set<string>(); // Or Set<number> depending on your ID type

  toggleSelection(group: any, event: Event) {
    event.stopPropagation(); // Prevents dropdown from closing

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
        // Add the item if checked
        this.placemenGroupVacnacyIds = [...this.placemenGroupVacnacyIds, group._id];
        this.selectedGroups.add(group._id);
    } else {
        // Remove the item if unchecked
        this.placemenGroupVacnacyIds = this.placemenGroupVacnacyIds.filter(id => id !== group._id);
        this.selectedGroups.delete(group._id);
    }
}

toggleSelection1(group: any) {
  this.placemenGroupVacnacyIds = [group._id];
}
isSelected(group: any): boolean {
  return this.placemenGroupVacnacyIds.includes(group._id);
}

  rows = [
    { type: null },
    { type: 'WIL Placements' },
    { type: 'Invalid Option' }, // will show "None"
    { type: 'Jobs & Hiring' },
    { type: 'WIL Projects' }
  ];

  validOptions = [
    '',
    'WIL Placements',
    'Jobs & Hiring',
    'WIL Projects '
  ];

  // isValidType(type: any): boolean {
  //   if(type.company_type){
  //     return this.validOptions.includes(type.company_type);
  //   }else{
  //     type.company_type = null
  //     return true;
  //   }
   
  // }

 changetype(key: string, row: any) {
  const values = row[key] || [];
  console.log("values", values);
  if (values.length === 0) {
    row.displayText = 'None';
  } else if (values.length === 1) {
    row.displayText = values[0];
  } else {
    row.displayText = `${values.length}`;
  }

  console.log('Changed:', row.displayText, values);
  // this.updateCampany(row, values);
}

 updateCampany(data, values) {
  data.company_type = values;
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
        "company_id": data._id,
        "company_type": values
    }
    this.service.CompanyListUpdateKey(payload).subscribe(async(res: any) => {
      if(res.status == 200){
        this.service.showMessage({
          message: res.msg
        });
         if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchCompany();
    }else if (!this.searchCriteria.keywords) {
      this.getCompaniesList();
    } else{
      this.getCompaniesList();
    }
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
    console.log("data", data);
    const placementId =  data._id;
    const navigationExtras = {
      // queryParams: { redirectTo: 'eligible-students' },
      state: { type: 'view' }
    };
    this.router.navigate(['admin/wil/placement-groups', placementId], navigationExtras);
  }


  gotoPlacementProject(item){
      this.closemodelPgList.ripple.trigger.click();
      // queryParams: {redirectTo: 'eligible-students'}
    const navigationExtras = {state:{type: 'view'}};
    this.router.navigate(['admin/wil/placement-groups/project/'+item._id], navigationExtras);
  }

  // contactList: any = [];
  // getContactList(id) {
  //   this.service.getContactList({company_id:id}).subscribe((res:any) => {
    
  //     if (res.status == 200) {
  //       this.contactList = res.data;
  //       this.contactList = this.contactList.map(c => ({
  //         ...c,
  //         fullName: `${c.first_name} ${c.last_name}`
  //       }));
  //     } else {
  //         this.contactList = [];
  //     }
  //   }, err => {
  //     this.service.showMessage({
  //       message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //     });
  //   })
  // }



  favoriteFilter:boolean = false;
  selectedFilter:any = null;

  //  get filteredParametes() {
  //   if (!this.selectedParameters) {
  //     return this.filters;
  //   }

  //   return this.filters.filter(company =>
  //     company.name.toLowerCase().includes(this.selectedParameters.toLowerCase())
  //   );
  // }


  async callFilter(data){
      // this.filters = data.filters;
      // this.filterApply = true;
      // console.log("this.", this.filters)
      // // this.filters = this.filters.map((option)=>{
      // //   const val = this.filterParameters[option.field];
      // //   return {
      // //     ...option,
      // //     selected:
      // //       Array.isArray(val) ? val.length > 0 :
      // //       typeof val === 'string' ? val.trim() !== '' :
      // //       typeof val === 'number' ? true :
      // //       val !== null && val !== undefined
      // //   };
      // // })

      // console.log("this.111", this.filters)


      // this.filterCompanies()
    }

   

   goBack() {
    this.location.back();
  }
  @ViewChild('placeholderModel', { static: false }) placeholderModel!: ModalDirective;

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
        this.cdRef.detectChanges(); 
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
  workingHourForm: FormGroup;

    FormBuilder(){
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


      @ViewChild('dynamicContainer', { static: false }) dynamicContainer!: ElementRef;
      @ViewChild('dynamicStudentContainer', { static: false }) dynamicStudentContainer!: ElementRef;
    
      // ngAfterViewInit() {
      //   console.log(this.dynamicContainer.nativeElement.innerHTML); // Ensure it logs properly
      // }
      
    
    
      approveCompanySubmit() {
        // const supervisor = this.getSupervisorDetail(this.workingHourForm.value.supervisor)
    
    
    
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
          student_id:this.selectedCompany.created_by_id,
          vacancy_id:this.selectedCompany.vacancy_id,
          //.map(el=>el.created_by_id),
          company_id:[this.selectedCompany._id],
          self_source_status:'approve',
          // send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
          // student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
          // send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
          // supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
          // student_html:shtml?shtml:undefined,
          // employer_html:html?html:undefined,
        }
        this.service.companyApprove(payload).subscribe(res => {
          // this.lockCandidate(true);
          // this.service.showMessage({ message: 'Working hours added successfully' });
          this.selectedStudentTemplate = null;
          this.selectedTemplate = null;
          this.approveStep = false;
          // this.FormBuilder();
          // this.approveCompany.hide();
            // this.getCompaniesList();
          this.selectAllComp = false;
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
      }



      disapproveCompanySubmit() {
        // const supervisor = this.getSupervisorDetail(this.workingHourForm.value.supervisor)
    
    
    
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
         student_id:this.selectedRecords.map(el=>el.created_by_id),
          company_id:this.selectedRecords.map(el=>el._id),
          self_source_status:'rejected',
          send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
          student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
          send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
          supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
          student_html:shtml?shtml:undefined,
          employer_html:html?html:undefined,
        }
        this.service.companyApproveRejct(payload).subscribe(res => {
          // this.lockCandidate(true);
          // this.service.showMessage({ message: 'Working hours added successfully' });
          this.selectedStudentTemplate = null;
          this.selectedTemplate = null;
          this.approveStep = false;
          this.FormBuilder();
          this.disapproveCompany.hide();
          this.getCompaniesList();
          this.selectAllComp = false;
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
      }


      length:any= 0;

      removeCompanySubmit(){

      //   let shtml = '';
      //     // Get the dynamic container element
      //   if(this.dynamicStudentContainer && this.dynamicStudentContainer.nativeElement){
      //     const containerStudentElement = this.dynamicStudentContainer.nativeElement;
    
      //     // Hide the toolbar
      //     const stoolbar = containerStudentElement.querySelector('.ql-toolbar');
      //     if (stoolbar) {
      //       stoolbar.style.display = 'none';
      //     }
          
      //     // Hide any additional toolbars with `.ql-hidden`
      //     const stoolbar1 = containerStudentElement.querySelector('.ql-hidden');
      //     if (stoolbar1) {
      //       stoolbar1.style.display = 'none';
      //     }
       
      //       // Hide any additional toolbars with `.ql-hidden`
      //       const sattachment = containerStudentElement.querySelector('.attachment');
      //       if (sattachment) {
      //        sattachment.style.display = 'none';
      //       }
          
      //     // Replace <quill-editor> with a <div>
      //     const squillEditor = containerStudentElement.querySelector('quill-editor');
      //     if (squillEditor) {
      //       const divElement = document.createElement('div');
      //       divElement.innerHTML = squillEditor.innerHTML;
      //       squillEditor.replaceWith(divElement);
      //     }
          
      //     // Hide all <input> elements inside the container
      //     const sinputs = containerStudentElement.querySelectorAll('input');
      //     sinputs.forEach((input) => {
      //       input.style.display = 'none';
      //     });
          
      //     // Now get the updated HTML
      //     const sfullHtml = containerStudentElement.innerHTML;
          
      //     // Construct the email template
      //     shtml = `
      //     <app-html-email-preview>
      //       <html lang="en">
      //         <head>
      //           <meta charset="utf-8">
      //           <meta http-equiv="X-UA-Compatible" content="IE=edge">
      //           <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      //           <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
      //         </head>
      //         <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
      //           <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
      //             <tbody>
      //               ${sfullHtml}
      //             </tbody>
      //           </table>
      //         </body>
      //       </html>
      //     </app-html-email-preview>
      //     `;
      //   }
       
      //   let html = '';
      //   if(this.dynamicContainer && this.dynamicContainer.nativeElement){
      // // Get the dynamic container element
      // const containerElement = this.dynamicContainer.nativeElement;
    
      // // Hide the toolbar
      // const toolbar = containerElement.querySelector('.ql-toolbar');
      // if (toolbar) {
      //   toolbar.style.display = 'none';
      // }
      
      // // Hide any additional toolbars with `.ql-hidden`
      // const toolbar1 = containerElement.querySelector('.ql-hidden');
      // if (toolbar1) {
      //   toolbar1.style.display = 'none';
      // }
    
      //   // Hide any additional toolbars with `.ql-hidden`
      //   const attachment = containerElement.querySelector('.attachment');
      //   if (attachment) {
      //    attachment.style.display = 'none';
      //   }
      
      // // Replace <quill-editor> with a <div>
      // const quillEditor = containerElement.querySelector('quill-editor');
      // if (quillEditor) {
      //   const divElement = document.createElement('div');
      //   divElement.innerHTML = quillEditor.innerHTML;
      //   quillEditor.replaceWith(divElement);
      // }
      
      // // Hide all <input> elements inside the container
      // const inputs = containerElement.querySelectorAll('input');
      // inputs.forEach((input) => {
      //   input.style.display = 'none';
      // });
      
      // // Now get the updated HTML
      // const fullHtml = containerElement.innerHTML;
      
      // // Construct the email template
      //  html = `
      // <app-html-email-preview>
      //   <html lang="en">
      //     <head>
      //       <meta charset="utf-8">
      //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
      //       <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      //       <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
      //     </head>
      //     <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
      //       <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
      //         <tbody>
      //           ${fullHtml}
      //         </tbody>
      //       </table>
      //     </body>
      //   </html>
      // </app-html-email-preview>
      // `;
    
      //   }
       
        this.length = this.selectedRecords.length;
        const payload = {
          student_id:this.selectedRecords.map(el=>el.created_by_id),
          company_id:this.selectedRecords.map(el=>el._id),
          // this.selectedCompany._id,
          // self_source_status:'rejected',
          // send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
          // student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
          // send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
          // supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
          // student_html:shtml?shtml:undefined,
          // employer_html:html?html:undefined,
        }
        this.service.companyRemove(payload).subscribe(res => {
          // this.lockCandidate(true);
          // this.service.showMessage({ message: 'Working hours added successfully' });
          this.selectedStudentTemplate = null;
          this.selectedTemplate = null;
          this.approveStep = false;
          this.FormBuilder();
          this.removeCompany.hide();
          this.removeCompanySuccess.show();
          this.getCompaniesList();
          this.selectAllComp = false;
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
      }


  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
     { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
  ];
  async statusChange(){
      // console.log("this.changeStatusStudent", this.changeStatusStudent,  this.CompaniesData, this.changeStatusStudent.company_info.company_id);

      // let find =await this.CompaniesData.find(el=> el.company_id == this.changeStatusStudent.company_info.company_id);

      // if(find){
      //   let student =await find.students['data'].find(el=> el.student_id == this.changeStatusStudent.student_id);
      //   if(student){
      //     student.status = this.oldStatus? this.oldStatus:'';
      //   }
      // }

      // this.changeStatusStudent = {};
  }


  onApproveCompany(row: any) {
    // alert("data")
    this.reset();
    this.selectedCompany = row;
    this.selectedRecords = [row];
    row.selected = true;
    this.approveStep = false;
    this.getCompanyContactList(row);
    this.approveCompany.show();
  }
  companyContactList: any = [];
  getCompanyContactList(data) {
    console.log("data", data);
    // alert("data")
    this.service.getCompanyContactList({company_id:data._id}).subscribe((res:any) => {
    
      if (res.status == HttpResponseCode.SUCCESS) {
        this.companyContactList = res.data;
        this.companyContactList = this.companyContactList.map(c => ({
          ...c,
          fullName: `${c.first_name} ${c.last_name}`
        }));
        this.workingHourForm.patchValue({
            supervisor:data?.placement_supervisor
        })
        console.log("this.companyContactList" , this.companyContactList)
      } else {
          this.companyContactList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
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
        placement_id: this.selectedCompany.placement_id,
        student_id: this.selectedCompany?.created_by_id,
        internship_start_date: moment(this.workingHourForm.value.internship_start_date).format("YYYY-MM-DD"),
        internship_end_date: moment(this.workingHourForm.value.internship_end_date).format("YYYY-MM-DD"),
        company_id: this.selectedCompany?._id,
        vacancy_id: this.selectedCompany?.vacancy_id,
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
      this.service.submitWorkingHourFromPendingCompany(payload).subscribe(res => {
        // this.lockCandidate(true);
       
        if(res.status == 200 ){
          if(res.msg==="This student is already placed in another vacancy."){
            this.service.showMessage({ message: res.msg });
            // this.getPlacementStudents();
            // this.getPlacementCompany();
          
          
          }else{
            //  this.service.showMessage({ message: res.msg?res.msg:'Working hours added successfully' });
            // this.editStudent("Placed");
            this.successPlace.show();
            this.getCompaniesList();
            this.selectedStudentTemplate = null;
            this.selectedTemplate = null;
            this.FormBuilder()
          }
           
        }
        //     this.getCompaniesList();
        // this.selectedStudentTemplate = null;
        // this.selectedTemplate = null;
        // this.FormBuilder()
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
  

}


