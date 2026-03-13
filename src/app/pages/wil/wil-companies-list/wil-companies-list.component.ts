import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
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
import { LoaderCustomService } from 'src/app/loadercustomservice.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-wil-companies-list',
  templateUrl: './wil-companies-list.component.html',
  styleUrls: ['./wil-companies-list.component.scss']
})
export class WilCompaniesListComponent implements OnInit {
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
  @ViewChild('addCompanyPlacement') addCompanyPlacement: ModalDirective;
  @ViewChild('closeResendOTPEmailModal') closeResendOTPEmailModal;
  @ViewChild('closeNoteModal') closeNoteModal;
  @ViewChild('closeConfirmDeleteModal') closeConfirmDeleteModal;

  @ViewChild('addNewColumnPopup') addNewColumnPopup: ModalDirective;
  @ViewChild('reminderToStaffDone') reminderToStaffDone: ModalDirective;
  @ViewChild('closeReminderModal') closeReminderModal
  @ViewChild('alertPGProject') alertPGProject: ModalDirective;
  @ViewChild('successAssignPG') successAssignPG: ModalDirective;
  @ViewChild('successAssignPGExist') successAssignPGExist: ModalDirective;
  @ViewChild('emailSendSuccess') emailSendSuccess: ModalDirective;
  
  limitOffset = {
    limit: this.paginationObj.pageSize,
    offset: this.paginationObj.pageIndex
  }
  searchCriteria = {
    keywords: null
  }
  placementGroups = [];

  addCompanyToPlacementColumn = ['company_code', 'company_name', 'location', 'abn_acn']

  constructor(private service: TopgradserviceService, private router: Router, private fb: FormBuilder, 
    private ngxPermissionService: NgxPermissionsService, private cdRef: ChangeDetectorRef, private loader: LoaderCustomService, private ngZone:NgZone) { }
  activeFilter:any = { name: 'placementGroups', value: '' };
  filters = [
    { name: "placementGroups", label: "Simulation Group", selected: false, value: "" },
    { name: "currently_placed", label: "Currently Placed", selected: false, value: "" },
    { name: "location", label: "Location", selected: false, value: "", suburb:'' },
    // { name: "post_code", label: "Location", selected: false, value: "" },
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
   
    { name: "hcaaf_status", label: "HCAAF Status", selected: false, value: "" },
    { name: "job_title", label: "Vacancy Title", selected: false, value: ""},
   
   
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
    companies: 0,
    pending_placement: 0,
    placed: 0,
    total_vacancies: 0,
    pending_company_count:0
  }
  companiesList: any = []
  placemenGroupIds = [];
  placemenGroupVacnacyIds = [];
  isCheck = false;
  selectedRecords = [];
  displayedPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']
  displayedCompanyPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']
  displayedCompanyPreferredColumns: string[] = ['contact_name', 'department', 'title', 'primary_email', 'primary_phone']
  displayedCompanyVacanciesColumns: string[] = ['no', 'name', 'vacancy_type', 'allocated', 'placed']

  displayedColumns: string[] = [
    // 'type_company',
    'checkbox',
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
    'actions'


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

//   dropDownColumns:any = [
//     {
//         "name": "Company Code/ID",
//         "value": "company_code"
//     },
//     {
//         "name": "Vacancies",
//         "value": "vacancies"
//     },
//     {
//         "name": "Email",
//         "value": "email"
//     },
//     {
//         "name": "Address",
//         "value": "address"
//     },
//     {
//         "name": "Suburb",
//         "value": "suburb"
//     },
//     {
//         "name": "State",
//         "value": "state"
//     },
//     {
//         "name": "Postcode",
//         "value": "postal_code"
//     },
//     {
//         "name": "Location",
//         "value": "location"
//     },
//     {
//         "name": "Company Label",
//         "value": "company_label"
//     },
//     {
//         "name": "Company Description",
//         "value": "company_description"
//     },
//     {
//         "name": "Company Alias",
//         "value": "company_alias"
//     },
//     {
//         "name": "Company Industry",
//         "value": "company_industry"
//     },
//     {
//         "name": "Company Type",
//         "value": "company_type"
//     },
//     {
//         "name": "ABN/ACN",
//         "value": "abn_acn"
//     },
//     {
//         "name": "No. Of Employees",
//         "value": "no_of_employees"
//     },
//     {
//         "name": "Company Phone",
//         "value": "company_phone"
//     },
//     {
//         "name": "Simulation Group",
//         "value": "vacancy_count"
//     },
//     {
//         "name": "Site Status",
//         "value": "site_status"
//     },
//     {
//         "name": "Web Address",
//         "value": "web_address"
//     },
//     {
//         "name": "Lead Source",
//         "value": "lead_source"
//     },
//     {
//         "name": "Conversion Status",
//         "value": "conversion_status"
//     },
//     {
//         "name": "Created By",
//         "value": "created_by"
//     },
//     {
//         "name": "Date Created",
//         "value": "date_created"
//     },
//     {
//         "name": "Last Updated By",
//         "value": "last_updated_by"
//     },
//     {
//         "name": "Last Updated",
//         "value": "last_updated"
//     },
//     {
//         "name": "HCAAF Status",
//         "value": "hcaaf_status"
//     },
//     {
//         "name": "Last HCAAF Update",
//         "value": "last_hcaaf_update"
//     },
//     {
//         "name": "Company Tax Id",
//         "value": "company_tax_id"
//     },
//     {
//         "name": "HCAAF Expiry",
//         "value": "hcaaf_expiry"
//     },
//     {
//         "name": "Students Placed",
//         "value": "student_placed"
//     },
//     {
//         "name": "Contact 01 First Name",
//         "value": "contact_01_first_name"
//     },
//     {
//         "name": "Contact 01 Last Name",
//         "value": "contact_01_last_name"
//     },
//     {
//         "name": "Contact 01 Title",
//         "value": "contact_01_title"
//     },
//     {
//         "name": "Contact 01 Primary Email",
//         "value": "contact_01_primary_email"
//     },
//     {
//         "name": "Contact 01 Secondary Email",
//         "value": "contact_01_secondary_email"
//     },
//     {
//         "name": "Contact 01 Primary Phone",
//         "value": "contact_01_primary_phone"
//     },
//     {
//         "name": "Contact 01 Secondary Phone",
//         "value": "contact_01_secondary_phone"
//     },
//     {
//         "name": "Contact 01 Created By",
//         "value": "contact_01_created_by"
//     },
//     {
//         "name": "Contact 01 Created Date",
//         "value": "contact_01_created_date"
//     },
//     {
//         "name": "Contact 01 Updated By",
//         "value": "contact_01_updated_by"
//     },
//     {
//         "name": "Contact 01 Last Updated",
//         "value": "contact_01_last_updated"
//     },
//     {
//         "name": "Contact 02 First Name",
//         "value": "contact_02_first_name"
//     },
//     {
//         "name": "Contact 02 Last Name",
//         "value": "contact_02_last_name"
//     },
//     {
//         "name": "Contact 02 Title",
//         "value": "contact_02_title"
//     },
//     {
//         "name": "Contact 02 Primary Email",
//         "value": "contact_02_primary_email"
//     },
//     {
//         "name": "Contact 02 Secondary Email",
//         "value": "contact_02_secondary_email"
//     },
//     {
//         "name": "Contact 02 Primary Phone",
//         "value": "contact_02_primary_phone"
//     },
//     {
//         "name": "Contact 02 Secondary Phone",
//         "value": "contact_02_secondary_phone"
//     },
//     {
//         "name": "Contact 02 Created By",
//         "value": "contact_02_created_by"
//     },
//     {
//         "name": "Contact 02 Created Date",
//         "value": "contact_02_created_date"
//     },
//     {
//         "name": "Contact 02 Updated By",
//         "value": "contact_02_updated_by"
//     },
//     {
//         "name": "Contact 02 Last Updated",
//         "value": "contact_02_last_updated"
//     },
//     {
//         "name": "Contact 03 First Name",
//         "value": "contact_03_first_name"
//     },
//     {
//         "name": "Contact 03 Last Name",
//         "value": "contact_03_last_name"
//     },
//     {
//         "name": "Contact 03 Title",
//         "value": "contact_03_title"
//     },
//     {
//         "name": "Contact 03 Primary Email",
//         "value": "contact_03_primary_email"
//     },
//     {
//         "name": "Contact 03 Secondary Email",
//         "value": "contact_03_secondary_email"
//     },
//     {
//         "name": "Contact 03 Primary Phone",
//         "value": "contact_03_primary_phone"
//     },
//     {
//         "name": "Contact 03 Secondary Phone",
//         "value": "contact_03_secondary_phone"
//     },
//     {
//         "name": "Contact 03 Created By",
//         "value": "contact_03_created_by"
//     },
//     {
//         "name": "Contact 03 Created Date",
//         "value": "contact_03_created_date"
//     },
//     {
//         "name": "Contact 03 Updated By",
//         "value": "contact_03_updated_by"
//     },
//     {
//         "name": "Contact 03 Last Updated",
//         "value": "contact_03_last_updated"
//     },
//     {
//         "name": "WHS Check",
//         "value": "whs_check"
//     },
//     {
//         "name": "Site Consent To Use Logo",
//         "value": "company_concent_to_use_logo"
//     }
// ];

  // formattedColumns = this.dropDownColumns.map(col => ({
  //   name: col
  //     .split('_')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' '),
  //   value: col,
  // }));

   


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
     {
        "name": "Lead Source",
        "value": "lead_source"
    },
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
    this.addNewColumnPopup.show();
  }

  checkColumnExist(){
    if(this.displayedColumns.length>3){
      return false;
    }else{
      return true;
    }
  }

  
  addColumn(): void {

  if (!this.selectedColumnToAdd || !this.selectedColumn) {
    console.warn("Column to add or reference column is not selected.");
    return;
  }

  // Remove the column if it already exists in displayColumns to avoid duplicates
  this.displayedColumns = this.displayedColumns.filter(col => col !== this.selectedColumnToAdd);

  // Find the index of the reference column
  const referenceIndex = this.displayedColumns.findIndex(col => col === this.selectedColumn);
  if (referenceIndex === -1) {
    console.error("Reference column not found in the display columns.");
    return;
  }

  // Calculate insert position
  const insertIndex = this.direction === 'left' ? referenceIndex : referenceIndex + 1;

  // Insert new column name at the correct index
  this.displayedColumns.splice(insertIndex, 0, this.selectedColumnToAdd);

  // Persist changes
  this.saveStudentColumn(this.displayedColumns);

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
    const existingIndex = this.displayedColumns.indexOf(this.selectedColumnToAdd);
    if (existingIndex !== -1) {
      // If already present, remove it first
      this.displayedColumns.splice(existingIndex, 1);
    }

    // Insert before the last column
    const insertIndex = Math.max(this.displayedColumns.length - 1, 0);
    this.displayedColumns.splice(insertIndex, 0, this.selectedColumnToAdd);

    // Save the updated columns
    this.saveStudentColumn(this.displayedColumns);

    // Reset and close modal
    this.selectedColumnToAdd = '';
    this.addNewColumnPopup?.hide();
  }
  get visibleColumns() {
    return this.displayedColumns.filter(col => this.displayedColumns.includes(col));
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
  //   const index = this.displayedColumns.findIndex(col => col === columnName);
  //   if (index === -1) return; // column not found
  
  //   if (direction === 'left' && index > 0) {
  //     // Swap with previous column
  //     [this.displayedColumns[index - 1], this.displayedColumns[index]] = [this.displayedColumns[index], this.displayedColumns[index - 1]];
  //   } else if (direction === 'right' && index < this.displayedColumns.length - 1) {
  //     // Swap with next column
  //     [this.displayedColumns[index], this.displayedColumns[index + 1]] = [this.displayedColumns[index + 1], this.displayedColumns[index]];
  //   }
  
  //   this.updateDisplayedColumns();
  // }

  moveColumn(direction: 'left' | 'right', columnName: string) {
    const index = this.displayedColumns.findIndex(col => col === columnName);
    if (index === -1) return; // Column not found

    const isLeft = direction === 'left';
    const targetIndex = isLeft ? index - 1 : index + 1;

    // Check bounds
    if (targetIndex < 0 || targetIndex >= this.displayedColumns.length) return;

    // Swap columns
    [this.displayedColumns[index], this.displayedColumns[targetIndex]] = 
      [this.displayedColumns[targetIndex], this.displayedColumns[index]];

    // Reassign new reference to trigger change detection
    this.displayedColumns = [...this.displayedColumns];

    this.updateDisplayedColumns(); // Optional, depending on your logic
  }

  
  // removeColumn(columnName: string) {
  //   const col = this.displayedColumns.find(c => c === columnName);
  //   if (col) {
  //     // col.visible = false;
  //     this.updateDisplayedColumns();
  //   }
  // }

  removeColumn(columnName: string) {
    const index = this.displayedColumns.findIndex(c => c === columnName);
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);  // Actually remove the column
      this.updateDisplayedColumns();           // Optional: if you're syncing state elsewhere
    }
  }
  
  updateDisplayedColumns() {
    // Only columns with visible: true are shown
    this.displayedColumns = this.displayedColumns.map(col => col);
    this.saveStudentColumn(this.displayedColumns);
    // localStorage.setItem('displayColumns', JSON.stringify(this.displayColumns));
  }
  
  showDisplayedColumns(){
      this.displayedColumns = this.displayedColumns
      .map(col => col);
  }
  
  saveStudentColumn(column){
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
     const payload = {
       'type':'company',
        created_by: this.userDetail._id,
        columns:column,
        updated_by: this.userDetail._id,
      }
      this.service.saveColumnStudent(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
         
        } else {
          
        }
      }, (err)=>{
        console.log("error", err);
      })
  }
  
  getColumnStudents(){
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
     const payload = {
       'type':'company',
        created_by: this.userDetail._id
      }
      this.service.getColumnStudents(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          if(response.data){
            // this.showDisplayedColumns();
            this.displayedColumns = response.data.columns;
            // Set visibility in `columns` based on stored list
            this.displayedColumns.forEach((col:any) => {
              col.visible = this.displayedColumns.includes(col);
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
  
  
  loadDisplayColumnsFromLocalStorage() {
    const stored = localStorage.getItem('displayColumns');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.displayedColumns = parsed;
  
          // Set visibility in `columns` based on stored list
          // this.columns.forEach(col => {
          //   col.visible = this.displayColumns.includes(col.name);
          // });
        }
      } catch (e) {
        console.error("Failed to parse displayColumns from localStorage", e);
      }
    } else {
      // fallback: first time load
      this.updateDisplayedColumns();
    }
  }

  ngAfterViewInit() {
    // this.activeFilter = this.filters[0].field;
    // this.eligibleStudentList.sort = this.sort;
    // this.displayColumn();
    this.getColumnStudents();
     setTimeout(() => {
      this.tooltip.show(); // Open the tooltip after view init
        //  this.tooltip.disabled = true;
    }, 0);
 
    //  this.loadDisplayColumnsFromLocalStorage();
    // this.prepareDisplayColumnFilter();
  }

    @ViewChild('tooltip') tooltip!: MatTooltip;

  ngOnInit(): void {
    this.getCompaniesList();
    this.getPlacementGroups("");
    this.companyFilterOptions();
    // setTimeout(() => {
    //     this.SaveAsFavoriteFilter.show();
    // }, 200);
    //  console.log("formattedColumns", this.formattedColumns);
    this.getStaffMembers();
    this.reminderForm = this.fb.group({
      staff_id: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });

    this.routeForm = this.fb.group({
      'contacts': ['', [Validators.required]]
    });
    this.getsaveFilter(this.notepage);
    this.getotherFilter();

  }

  companyFilterOptions() {
    this.service.companyFilterOptions().subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.companyFilters = response.result;
      }
    })
  }

  getTitle(){
    return 'Selected Parameters: '+this.filterList.join(', ');
  }

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


        if(filter.name === 'hcaaf_expiry'){
          this.hcaaf_start_sdate = null
          this.hcaaf_end_sdate = null
        }
        if(filter.name === 'last_hcaaf_date'){
         this.last_hcaaf_sdate = null
          this.last_hcaaf_edate = null
        }
        if(filter.name === 'location'){
          el['suburb'] = [];
          el['value'] = [];
           el['state'] = [];
        }
        
      });
      
    }
  }
  

  resetfilter(){
    this.hcaaf_start_sdate = null;
    this.hcaaf_end_sdate = null;
    this.last_hcaaf_sdate = null;
    this.last_hcaaf_edate = null;
    this.activeFilter = { name: 'placementGroups', value: '' };
    this.filters.map((el:any)=>{
      el.selected = false;
      if (Array.isArray(el.value) && el.value.length > 0) {
        el.value =[];
        el.state =[];
      }else{
        el.value = "";
         el.state = '';
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
  
  filterList:any = []
  filterApply:boolean = false;
  filterApplylength:any = 0;
  hcaaf_start_sdate:any="";
  hcaaf_end_sdate:any=""
  last_hcaaf_sdate:any="";
  last_hcaaf_edate:any=""
  @ViewChild('closeFilterModal') closeFilterModal;
  async filterCompanies() {
     this.isManualFilter = true;
     this.paginationObj = {
          length: 0,
          pageIndex: this.paginationObj.pageIndex,
          pageSize: this.paginationObj.pageSize,
          previousPageIndex: 0,
          changed: false,
    }; 
    console.log("this.paginationObj", this.paginationObj);
    let previousFilterList = [...this.filterList];
    const payload = {
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex
    };
    this.filterList= [];
    let isValid = true; 
    console.log("this.filters", this.filters, this.activeFilter);
    await this.filters.forEach(async (filter:any) => {
      if (filter.selected) {
        // Add selected filter labels to the filter list
        this.filterList.push(filter.label);
    
        // Handle 'hcaaf_expiry' filter specifically
        if (filter.name === "hcaaf_expiry") {
          payload['hcaaf_expiry_sdate'] = moment(this.hcaaf_start_sdate).format("DD/MM/YYYY");
          payload['hcaaf_expiry_edate'] = moment(this.hcaaf_end_sdate).format("DD/MM/YYYY");
          filter.value = {
            hcaaf_expiry_sdate:this.hcaaf_start_sdate,
            hcaaf_expiry_edate:this.hcaaf_end_sdate
          }
        } else  if (filter.name === "last_hcaaf_date") {
          payload['last_hcaaf_sdate'] =  moment(this.last_hcaaf_sdate).format("DD/MM/YYYY");
          payload['last_hcaaf_edate'] = moment(this.last_hcaaf_edate).format("DD/MM/YYYY"); 
            filter.value = {
            last_hcaaf_sdate:this.last_hcaaf_sdate,
            last_hcaaf_edate:this.last_hcaaf_edate
          }
        } else  if (filter.name ==="location") {
          Object.assign(payload, { [filter.name]: filter.value, suburb: filter.suburb,  state: filter.state  });
          filter.suburb = filter.suburb;
          filter.state = filter.state;
        } else {
          // Add other filters to the payload
          Object.assign(payload, { [filter.name]: filter.value });
        }
      } else {

        if(this.activeFilter.value.length>0){
          let find = await this.filters.find(el=>el.name==this.activeFilter.name)
          // If the filter value exists but checkbox is not selected, show a message
        if(find && !find.selected){
              this.service.showMessage({
                message: "Please select the checkbox for filter parameters.",
              });
            isValid = false;  // Exit early on error
            }
          }
        // else {
        //   this.filters.forEach(el=>{
        //     if(!el.selected){
        //       console.log("el.value", el.value)
        //       if (Array.isArray(el.value) && el.value.length > 0) {
        //         console.log("come 2")
        //         this.service.showMessage({
        //             message: "Please select the checkbox for filter parameters.",
        //         });
        //         isValid = false;
        //         return true;
        //     } else if (typeof el.value === "object" && Object.keys(el.value).length > 0) {
        //       console.log("come 1")
        //         this.service.showMessage({
        //             message: "Please select the checkbox for filter parameters.",
        //         });
        //         isValid = false;
        //         return true;
        //     } else if (el.value ) {
        //       console.log("come")
        //         this.service.showMessage({
        //             message: "Please select the checkbox for filter parameters.",
        //         });
        //         isValid = false;
        //         return true;
        //     }
        //     }
        //   })
        // }
      }
    });
    
    // Exit if filters are invalid
    if (!isValid) {
      return;  // Stop further execution and do not call API
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
    this.closeFilterModal.ripple.trigger.click();

    this.filterApply = true;
    this.loader.show();
    if(this.selectedFilter && this.selectedFilter._id){

    }else{
      // this.saveFilter();
    }
  
    this.service.filterCompanies(payload).subscribe(async(res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        // this.filterApplylength = res?.result?.length;
        res.result = res.result.map(company => {
          return this.service.transformContactPersonObj(company);
        });
        await res.result.forEach(row => this.changetype('company_type', row));
        // this.paginationObj.length = res?.result?.length;
         this.companieData = [...this.companieData, ...res.result];
        this.companiesList = new MatTableDataSource(this.companieData);
        this.companiesList.data.forEach(company => {
          company.selected = false;
        });

        this.filterApplylength =res?.count?res?.count: res?.result?.length;
        this.paginationObj.length = res?.count?res?.count: res?.result?.length;
        this.companiesList.sort = this.companiesTbSort;
        this.cdRef.detectChanges();

        // Run loader hide inside Angular zone after render
        this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
          this.loader.hide();
        });
        this.resetCheckBox();
      } else {

        this.companiesList = new MatTableDataSource([]);
        this.companiesList = [];
        this.filterApplylength = 0;
         this.loader.hide();
        this.service.showMessage({
          message: "Companies not found for applied filters"
        });
      }
    },(err)=>{
      this.filterApplylength = 0;
      this.companiesList = new MatTableDataSource([]);
      this.companiesList = [];
       this.loader.hide();
    })
  }


  ApplyHcaafFilter(){
    let body = {
        "limit": 10,
        "offset": 0,
        "hcaaf_status": [
            "Pending"
        ]
    };
    this.filterApply = true;
    this.service.filterCompanies(body).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.filterApplylength = res?.count?res?.count: res?.result?.length;
        res.result = res.result.map(company => {
          return this.service.transformContactPersonObj(company);
        });
        // this.paginationObj.length = res?.result?.length;
        
        this.companieData = [...this.companieData, ...res.result];
        this.companiesList = new MatTableDataSource(this.companieData);
        this.companiesList.data.forEach(company => {
          company.selected = false;
        });

        this.paginationObj.length = res?.count?res?.count: res?.result?.length;
        this.companiesList.sort = this.companiesTbSort;
      } else {

        this.companiesList = new MatTableDataSource([]);
        this.companiesList = [];
        this.service.showMessage({
          message: "Companies not found for applied filters"
        });
      }
    },(err)=>{
      this.filterApplylength = ''
      this.companiesList = new MatTableDataSource([]);
      this.companiesList = [];
    })
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
         this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
      this.searchCompany();
    }else if (this.filters.length>0) {
      let find = await this.filters.find(el=>el.selected);
      if(find){
         this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
        this.filterCompanies();
      }else{
         this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
        this.getCompaniesList();
      }
    } else if (!this.searchCriteria.keywords) {
       this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
      this.getCompaniesList();
    } else{
       this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
      this.getCompaniesList();
    }
  }

  companieData:any = [];

  getCompaniesList() {
    this.activeFilter = { name: 'placementGroups', value: '' };
    this.filters.forEach(filter => {
      if (filter.selected) {
        filter.selected = false;
      }
    });
    const payload = {
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex
    }
    this.loader.show();
    this.service.getCompaniesList(payload).subscribe(async(response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        // response.result =await response.result.map(company => {
        //   // this.changetype('company_type', company);
        //   return this.service.transformContactPersonObj(company);
        // });
        await response.result.forEach(row => this.changetype('company_type', row));

      //   for (const row of this.rows) {
      //   if (row?.company_type) {
      //     await this.changetype('company_type', row);
      //   }
      // }
        this.overAllCount.companies = response.companies;
        this.overAllCount.placed = response.placed;
        this.overAllCount.total_vacancies = response.total_vacancies;
        this.overAllCount.pending_placement = response.pending_placement;
        this.overAllCount.pending_company_count = response.pending_company_count;
        this.paginationObj.length = response.count;
        this.companieData = [...this.companieData, ...response.result];
        this.companiesList = new MatTableDataSource(this.companieData);


       
        this.companiesList.data.forEach(company => {
          company.selected = false;
        });
        this.companiesList.sort = this.companiesTbSort;
           this.cdRef.detectChanges();

        // Run loader hide inside Angular zone after render
        this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
          this.loader.hide();
        });
        this.resetCheckBox();
      } else {
        this.companiesList = new MatTableDataSource([]);
        this.companiesList = [];
          this.loader.hide();
      }
    },(err)=>{
      this.companiesList = new MatTableDataSource([]);
      this.companiesList = [];
        this.loader.hide();
    })
  }

  addNewIndustryPartners() {
    this.isAddNewIndustryPartners = true;
  }

  getNewIndustryPartners(event) {
    if (event === "back") {
      this.isAddNewIndustryPartners = false;
    } else if (event === "next") {
      if (this.searchCriteria.keywords) {
         this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
        this.searchCompany();
        }else{
           this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
        this.getCompaniesList();
        }
    } else {
      this.isAddNewIndustryPartners = false;
      if (this.searchCriteria.keywords) {
         this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
        this.searchCompany();
        }else{
           this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
        this.getCompaniesList();
        }
    }
  }

  exportPartnerData(type) {
    const selectedCompanies = this.companiesList.data.filter(company => company.selected);
    const payload = {
      type,
      company_id: selectedCompanies.length > 0 ? selectedCompanies.map(company => company._id) : undefined
    }
    this.service.exportPartners(payload).subscribe((res: any) => {
      this.resetCheckBox();
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  reset(){
    this.placementGroups = null;
    this.placemenGroupIds = null;
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
                this.alertPGProject.show();
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

resetForm(){
  this.selectedInactiveRecords = [];
    this.selectedRecords = [];
    this.placemenGroupIds = [];
    this.placementGroups= [];
  this.addCompanyPlacement.hide();
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


  getPlacementGroups(event) {
    const payload = {
      status: 'active',
      limit: 1000,
      offset: 0,
      keywords: event?.target?.value
    }
    this.service.getPlacementGroupForCompanyList(payload).subscribe((res: any) => {
      this.placementGroups = res.result;
    });
  }

  updateCompaniesStatus() {
    const selectedCompanies = this.companiesList.data.filter(company => company.selected);
    if (selectedCompanies.length === 0) {
      return;
    }
    const payload = {
      comapny_id: selectedCompanies[selectedCompanies.length - 1]['_id'],
      placementGroups: this.placemenGroupIds
    }
    this.service.updateCompaniesStatus(payload).subscribe(async(res: any) => {
      this.service.showMessage({
        message: "Company detail updated successfully"
      });
     if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchCompany();
    }else if (this.filters.length>0) {
      let find = await this.filters.find(el=>el.selected);
      if(find){
        this.filterCompanies();
      }else{
        this.getCompaniesList();
      }
    } else if (!this.searchCriteria.keywords) {
      this.getCompaniesList();
    } else{
      this.getCompaniesList();
    }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  selectedInactiveRecords: any = [];
  selectCompany() {
    this.isCheck = this.companiesList.data.some(company => company.selected);
    this.selectedRecords = this.companiesList.data.filter(company => company.selected && company.site_status != "Blacklisted" && company.site_status != "Inactive");

    this.selectedInactiveRecords = this.companiesList.data.filter(company => company.selected && (company.site_status == "Blacklisted" || company.site_status == "Inactive"));

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


   onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.companiesList.data.length)
    if(this.paginationObj.length<10)return;
     if (this.companiesList?.data.length >= this.paginationObj.length) return;
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


  async getPaginationData(event) {
    this.paginationObj = event;
    console.log("this.event", event)
    //  if (this.isManualFilter) {
    //   this.isManualFilter = false; // reset for next pagination
    //   return;
    // }
    if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchCompany();
    }else if (this.filters.length>0) {
      let find = await this.filters.find(el=>el.selected);
      if(find){
        this.filterCompanies();
      }else{
        this.getCompaniesList();
      }
    } else if (!this.searchCriteria.keywords) {
      this.getCompaniesList();
    } else{
      this.getCompaniesList();
    }
    this.resetCheckBox();
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
     this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
      this.searchCompany();
    } else if(!this.searchCriteria.keywords){
       this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
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
    const payload = {
      ...this.searchCriteria,
      offset:this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize
    }
  this.loader.show();
    this.service.searchCompany(payload).subscribe(async (response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        response.result = response.result.map(company => {
          return this.service.transformContactPersonObj(company);
        });
        await response.result.forEach(row => this.changetype('company_type', row));
        
        this.paginationObj.length = response.count;
        const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.companieData.some(s => s._id === student._id)
        );


        this.companieData = [...this.companieData, ...filteredData];
        this.companiesList = new MatTableDataSource(this.companieData);
        this.companiesList.data.forEach(company => {
          company.selected = false;
        });
        this.companiesList.sort = this.companiesTbSort;
           this.cdRef.detectChanges();

        // Run loader hide inside Angular zone after render
        this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
          this.loader.hide();
        });
        this.resetCheckBox();
      } else {
        this.paginationObj.length = 0;
        this.companiesList = [];
        this.loader.hide();
      }
    })
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

    this.selectedInactiveRecords = this.companiesList.data.filter(company => company.selected && (company.site_status == "Blacklisted" || company.site_status == "Inactive"));

    console.log(this.selectedRecords, this.selectedInactiveRecords)
  }

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

  async changeStatus(key, data) {
       this.clearData();
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('WIL_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchCompany();
    }else if (this.filters.length>0) {
      let find = await this.filters.find(el=>el.selected);
      if(find){
        this.filterCompanies();
      }else{
        this.getCompaniesList();
      }
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
        }else if (this.filters.length>0) {
          let find = await this.filters.find(el=>el.selected);
          if(find){
            this.filterCompanies();
          }else{
            this.getCompaniesList();
          }
        } else if (!this.searchCriteria.keywords) {
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

  clearData(){
     this.companiesList = new MatTableDataSource<any>([]);
        this.companiesList.data = []; 
        this.companieData = []; 
  }


  async checkExist(){
    console.log(":this.placemenGroupIds", this.placemenGroupIds);
    let find = await this.placementGroups.find(el=>el._id ==  this.placemenGroupIds);
      console.log("find", find)

      // return false;
    if(find && find.is_vacancy && find.category_id !="65a21e05fa6a8e4f5b252993"){
       this.placement = find;
       this.addCompanyPlacement.hide();
      this.successAssignPGExist.show();
    }else{
       this.addToPlacementGroup();
    }
    return false;
  }

  placement:any = {};
  async addToPlacementGroup() {
    // const selectedCompanies = this.companiesList.data.filter(company => company.selected).map(company => company._id);

    // if (selectedCompanies.length === 0) {
    //   return;
    // }

    // const payload = {
    //   company_ids: selectedCompanies,
    //   placementGroups: this.placemenGroupIds
    // }

    // this.service.updateCompanyPlacement(payload).subscribe((res: any) => {
    //   if (res.status === HttpResponseCode.SUCCESS) {
    //     this.getCompaniesList();
    //     this.service.showMessage({ message: res.msg });
    //     this.addCompanyPlacement.hide();
    //     this.placemenGroupIds = [];
    //     this.placemenGroupVacnacyIds = [];
    //   }
    // })

    const selectedCompanies = this.companiesList.data.filter(company => company.selected).map(company => company._id);

    if (selectedCompanies.length === 0) {
      return;
    }

    const payload = {
      company_ids: selectedCompanies,
      placementGroups: this.placemenGroupIds
    }

    console.log("payload", payload, this.placemenGroupVacnacyIds, selectedCompanies)

    // return false
    let selected = this.placemenGroupVacnacyIds

    let array: any[] = [];

    if(!Array.isArray(this.placemenGroupVacnacyIds)){
      this.placemenGroupVacnacyIds = [this.placemenGroupVacnacyIds];
    }
    selectedCompanies.forEach(el=>{
      array.push({
        "company_id": el,  // Store company_id
        "vacancy_ids": this.placemenGroupVacnacyIds // Start with this vacancy ID
    });
    })
    // for (const el of this.vacncies) {
    //     let find = selectedCompanies.find(e => e == el.company_id);
    
    //     if (find) {
         
    //         // let f = array.find(li => li.company_id == el.company_id);
    //         // if (f) {
    //         //     f.vacancy_ids.push(el._id);  // Push vacancy ID
    //         // } else {
    //         //     array.push({
    //         //         "company_id": el.company_id,  // Store company_id
    //         //         "vacancy_ids": this.placemenGroupVacnacyIds // Start with this vacancy ID
    //         //     });
    //         // }
    //     }
    // }
    
    console.log(array);
    


    let data = {
      "placement_id": this.placemenGroupIds,
      "data": array
  }
  // this.placement =await this.placementGroups.find(el=>el._id == this.placemenGroupIds);
  // this.placement['vcancy'] =await this.vacncies.find(el=>el._id == this.placemenGroupVacnacyIds)
  // this.addCompanyPlacement.hide();
  // // this.placemenGroupIds = [];
  // // this.placemenGroupVacnacyIds = [];
  // this.successAssignPG.show();
  // console.log("this.placemenGroupVacnacyIds", data, this.placemenGroupVacnacyIds, this.vacncies);
  // return false;


  // return false;
  this.placement =await this.placementGroups.find(el=>el._id == this.placemenGroupIds);
  this.placement['vcancy'] =await this.vacncies.find(el=>el._id == this.placemenGroupVacnacyIds)
    this.service.updateProjectPlacement(data).subscribe((res: any) => {
      if (res.status === HttpResponseCode.SUCCESS) {
        this.service.showMessage({ message: res.msg });
        this.getPlacementGroups("");
        this.successAssignPGExist.hide();
        this.addCompanyPlacement.hide();
        this.successAssignPG.show();
        
      }
    })
  }


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
        this.closeResendOTPEmailModal.ripple.trigger.click();
        this.emailSendSuccess.show();
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
    }else if (this.filters.length>0) {
      let find = await this.filters.find(el=>el.selected);
      if(find){
        this.filterCompanies();
      }else{
        this.getCompaniesList();
      }
    } else if (!this.searchCriteria.keywords) {
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
    setTimeout(() => {
        this.router.navigate(['admin/wil/placement-groups', placementId], navigationExtras);
    }, 500);
  
  }


  gotoPlacementProject(item){
    this.closemodelPgList.ripple.trigger.click();
      // queryParams: {redirectTo: 'eligible-students'}
    const navigationExtras = {state:{type: 'view'}};
    setTimeout(() => {
        this.router.navigate(['admin/wil/placement-groups/project/'+item._id], navigationExtras);
    }, 500);
   
  }

  contactList: any = [];
  getContactList(data) {
    this.selectedCompany = data
    if(this.selectedCompany?.is_child){
        this.service.getCompanyContactList({company_id:data._id}).subscribe((res:any) => {
    
        if (res.status == 200) {
          this.contactList = res.data;
          this.contactList = this.contactList.map(c => ({
            ...c,
            fullName: `${c.first_name} ${c.last_name}`
          }));
        } else {
            this.contactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }else{
       this.service.getContactList({company_id:data._id}).subscribe((res:any) => {
    
        if (res.status == 200) {
          this.contactList = res.data;
          this.contactList = this.contactList.map(c => ({
            ...c,
            fullName: `${c.first_name} ${c.last_name}`
          }));
        } else {
            this.contactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
  }



  favoriteFilter:boolean = false;
  selectedFilter:any = null;

   get filteredParametes() {
    if (!this.selectedParameters) {
      return this.filters;
    }

    return this.filters.filter(company =>
      company.name.toLowerCase().includes(this.selectedParameters.toLowerCase())
    );
  }


  addAllVacancies() {
    if (!this.vacncies || this.vacncies.length === 0) {
      return;
    }

    // select all vacancy ids
    this.placemenGroupVacnacyIds = this.vacncies.map(v => v._id);

    // mark all as checked
    this.selectedGroups.clear();
    this.vacncies.forEach(v => this.selectedGroups.add(v._id));
  }

  async callFilter(data){
      this.clearData();
    this.selectedFilter = data;
      // console.log("data.filters", data.filters);
      await data.filters.map((el:any)=>{
        console.log(el, el.filters)
        if(el.selected){
            if (el.name === "hcaaf_expiry") {
            this.hcaaf_start_sdate = el.value.hcaaf_expiry_sdate;
            this.hcaaf_end_sdate = el.value.hcaaf_end_sdate;
            } else  if (el.name === "last_hcaaf_date") {
              this.last_hcaaf_sdate = el.value.last_hcaaf_sdate;
            this.last_hcaaf_edate = el.value.last_hcaaf_edate;
            } else  if (el.name ==="location") {
                this.activeFilter[el.name] = el.value;
                this.activeFilter.suburb = el.suburb;
                this.activeFilter.state = el.state;
            } else{
               this.activeFilter.name = el.name
              this.activeFilter.value = el.value
            }
          
        }
       })


      this.filters = data.filters;
      this.filterApply = true;
      // console.log("this.", this.filters)
      // this.filters = this.filters.map((option)=>{
      //   const val = this.filterParameters[option.field];
      //   return {
      //     ...option,
      //     selected:
      //       Array.isArray(val) ? val.length > 0 :
      //       typeof val === 'string' ? val.trim() !== '' :
      //       typeof val === 'number' ? true :
      //       val !== null && val !== undefined
      //   };
      // })

      console.log("this.111", this.filters)

     
      this.filterCompanies()
    }

    
    callfilterbothApi(){
      this.getsaveFilter(this.notepage);
      this.getotherFilter();
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
    type: 'company',
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
  
  getotherFilter() {
  this.userDetail = JSON.parse(localStorage.getItem('userDetail') || '{}');
  let body = {
    created_by: this.userDetail._id,
    filter_type: 'saved',
    type: 'company'
  };

  this.service.getRecentDisplayFilters(body).subscribe(
    async (res) => {
      if (res.status === 200) {
        this.recentFilters = res.recent_result || [];
        this.displayFilters = res.display_result || [];

        // Use for...of so async/await works in sequence
        for (let el of this.displayFilters) {
          console.log(" await this.getCount(el)",  await this.getCount(el))

          await el.filters.map((le:any)=>{
            if(le.selected){
                if (le.name === "hcaaf_expiry") {
                this.hcaaf_start_sdate = le.value.hcaaf_expiry_sdate;
                this.hcaaf_end_sdate = le.value.hcaaf_end_sdate;
                } else  if (le.name === "last_hcaaf_date") {
                  this.last_hcaaf_sdate = le.value.last_hcaaf_sdate;
                this.last_hcaaf_edate = le.value.last_hcaaf_edate;
                } 
                // else  if (le.name ==="location") {
                //     this.activeFilter[le.name] = le.value;
                //     this.activeFilter.suburb = le.suburb;
                // } else{
                //   this.activeFilter.value = le.value
                // }
            }
          })
          el.count = await this.getCount(el); 
        }

        console.log("displayFilters", this.displayFilters)
      } else {
        this.recentFilters = [];
        this.displayFilters = [];
      }
    },
    (err) => {
      this.recentFilters = [];
      this.displayFilters = [];
      this.service.showMessage({
        message:
          err.error?.errors?.msg || 'Something went Wrong'
      });
    }
  );
}


async getCount(filterData): Promise<number> {
  // Local pagination object
  const paginationObj = {
    length: 0,
    pageIndex: this.paginationObj?.pageIndex ?? 0,
    pageSize: this.paginationObj?.pageSize ?? 10,
    previousPageIndex: 0,
    changed: false,
  };

  // Build payload locally so we never mutate global state
  const payload: any = {
    limit: paginationObj.pageSize,
    offset: paginationObj.pageIndex
  };

  if (!Array.isArray(filterData.filters)) {
    console.warn("Invalid filters for:", filterData);
    return 0;
  }

  // Local filter list
  const localFilterList: string[] = [];

  for (const filter of filterData.filters) {
    if (filter.selected) {
      localFilterList.push(filter.label);

      if (filter.name === "hcaaf_expiry") {
        payload.hcaaf_expiry_sdate = moment(this.hcaaf_start_sdate).format("DD/MM/YYYY");
        payload.hcaaf_expiry_edate = moment(this.hcaaf_end_sdate).format("DD/MM/YYYY");
      } 
      else if (filter.name === "last_hcaaf_date") {
        payload.last_hcaaf_sdate = moment(this.last_hcaaf_sdate).format("DD/MM/YYYY");
        payload.last_hcaaf_edate = moment(this.last_hcaaf_edate).format("DD/MM/YYYY");
      } 
      else if (filter.name === "location") {
        payload[filter.name] = filter.value;
        payload.suburb = filter.suburb;
        if(filter.state){
           payload.state = filter.state;
        }
      } 
      else {
        payload[filter.name] = filter.value;
      }
    }
  }

  // Return a promise resolving with the count
  return new Promise<number>((resolve) => {
    this.service.filterCompanies(payload).subscribe({
      next: (res) => {
        if (res?.status === HttpResponseCode.SUCCESS) {
          resolve(res?.count ?? (res?.result?.length ?? 0));
        } else {
          resolve(0);
        }
      },
      error: (err) => {
        console.error("Error fetching company count:", err);
        resolve(0);
      }
    });
  });
}


  // get startsaveFilterIndex(): number {
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
  
    previewFilter(){
      console.log("this.selectedFilter",this.selectedFilter);
      this.filters=this.selectedFilter?.filters;
      // this.showSavedFilter= false;
      console.log("this.", this.filters)


      this.activeFilter.name = '';

       this.filters.forEach((el:any)=>{
        if(el.selected){
          if(!this.activeFilter.name){
            this.activeFilter.name = el.name;
            if (el.name === "hcaaf_expiry") {
            this.hcaaf_start_sdate = el.value.hcaaf_expiry_sdate;
            this.hcaaf_end_sdate = el.value.hcaaf_end_sdate;
            } else  if (el.name === "last_hcaaf_date") {
              this.last_hcaaf_sdate = el.value.last_hcaaf_sdate;
              this.last_hcaaf_edate = el.value.last_hcaaf_edate;
            } else  if (el.name ==="location") {
                // Object.assign(el, { [el.name]: el.value, suburb:el.suburb });
                this.activeFilter[el.name] = el.value;
                this.activeFilter.suburb = el.suburb;
                this.activeFilter.state = el.state;
              // filter.suburb = filter.suburb;
            } else{
              this.activeFilter.value = el.value
            }
          }
        }
       })
       console.log("this.filters", this.filters);
      // this.filters = this.filters.map((option)=>{
      //    const val = this.activeFilter[option.label];
      //   return {
      //     ...option,
      //     selected:
      //       Array.isArray(val) ? val.length > 0 :
      //       typeof val === 'string' ? val.trim() !== '' :
      //       typeof val === 'number' ? true :
      //       val !== null && val !== undefined
      //   };
      // })
      // this.status= null;
  
  
      const parametersTabTrigger = document.querySelector('a[href="#parameters"]');
      console.log("parametersTabTrigger", parametersTabTrigger)
    if (parametersTabTrigger) {
      // Bootstrap 5 way to activate tab
      const tab = new (window as any).bootstrap.Tab(parametersTabTrigger);
      tab.show();
    }
    
     this.cdRef.detectChanges();
       console.log("this.filterParameters", this.activeFilter)
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
  
  
    selectedParameters:any="";
    rename:any = "";
    favoriteName:any = "";
    @ViewChild('renameFilter') renameFilter: ModalDirective;
    @ViewChild('SaveAsFavoriteFilter') SaveAsFavoriteFilter: ModalDirective;
    @ViewChild('removeFavoriteFilter') removeFavoriteFilter: ModalDirective;
    @ViewChild('addDisplayFilter') addDisplayFilter: ModalDirective;
    @ViewChild('removeDisplayFilter') removeDisplayFilter: ModalDirective;
  
  
    get isAnyFilterSelected(): boolean {
      return this.filters?.some(filter => filter.selected);
    }
  
    saveFilter(type?){
       this.filters = this.filters.map((el: any) => {
        if (el.selected) {
          if (el.name === "hcaaf_expiry") {
             el.value = {};
            el.value['hcaaf_expiry_sdate'] = this.hcaaf_start_sdate;
            el.value['hcaaf_end_sdate'] = this.hcaaf_end_sdate;
          } 
          else if (el.name === "last_hcaaf_date") {
             el.value = {};
            el.value['last_hcaaf_sdate'] = this.last_hcaaf_sdate;
            el.value['last_hcaaf_edate'] = this.last_hcaaf_edate;
          } 
            else if (el.name === "location") {
            // Initialize el.value as an object if it's not already
            if (typeof el.value !== 'object' || el.value === null) {
              el.value = {};
            }
            el.value['suburb'] = this.activeFilter.suburb;
              el.value['state'] = this.activeFilter.state;
            el.value['location'] = this.activeFilter.location;
          }

        }
        return el;
      });
      //  return false;


      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let data = {
        name:this.favoriteName?this.favoriteName:this.filterList.join(', '),
        filters:this.filters,
        created_by:this.userDetail._id,
        created_by_name:this.userDetail.first_name+' '+this.userDetail.last_name,
        filter_type: type ?type:'recent', //"recent/saved/display",
        type: "company"//"student/company"
        
      }
      this.service.saveFilter(data).subscribe((response) => {
        if (response.status == HttpResponseCode.SUCCESS) {
            this.favoriteName = '';
            this.rename ='';
              this.filters.forEach((el:any)=>{
              if(el.selected){
                if(!this.activeFilter.name){
                  this.activeFilter.name = el.name;
                  if (el.name === "hcaaf_expiry") {
                  this.hcaaf_start_sdate = el.value.hcaaf_expiry_sdate;
                  this.hcaaf_end_sdate = el.value.hcaaf_end_sdate;
                  } else  if (el.name === "last_hcaaf_date") {
                    this.last_hcaaf_sdate = el.value.last_hcaaf_sdate;
                    this.last_hcaaf_edate = el.value.last_hcaaf_edate;
                  } else  if (el.name ==="location") {
                      // Object.assign(el, { [el.name]: el.value, suburb:el.suburb });
                      this.activeFilter[el.name] = el.value;
                      this.activeFilter.suburb = el.suburb;
                      this.activeFilter.state = el.state;
                    // filter.suburb = filter.suburb;
                  } else{
                    this.activeFilter.value = el.value
                  }
                }
              }
            })
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
    // this.filters = this.filters.map((el: any) => {
    //     if (el.selected) {
    //       if (el.name === "hcaaf_expiry") {
    //          el.value = {};
    //         el.value['hcaaf_expiry_sdate'] = this.hcaaf_start_sdate;
    //         el.value['hcaaf_end_sdate'] = this.hcaaf_end_sdate;
    //       } 
    //       else if (el.name === "last_hcaaf_date") {
    //          el.value = {};
    //         el.value['last_hcaaf_sdate'] = this.last_hcaaf_sdate;
    //         el.value['last_hcaaf_edate'] = this.last_hcaaf_edate;
    //       } 
    //       else if (el.name === "location") {
    //         el.value['suburb'] = this.activeFilter.suburb;
    //         el.value['location'] = this.activeFilter.location;
    //       }
    //     }
    //     return el;
    //   });

    //    console.log("this.filters", this.filters)
      //  return false;
      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let data = {
        name:this.favoriteName?this.favoriteName:this.rename?this.rename:undefined,
        filter_type: type ?type:undefined, //"recent/saved/display",
        filter_id:this.selectedFilter._id,
        // filters:this.filters,
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

    setFilterTab(){
    const parametersTabTrigger = document.querySelector('a[href="#parameters"]');
      console.log("parametersTabTrigger", parametersTabTrigger)
    if (parametersTabTrigger) {
      // Bootstrap 5 way to activate tab
      const tab = new (window as any).bootstrap.Tab(parametersTabTrigger);
      tab.show();
    }
    this.rename = "";
    this.favoriteName = "";
      this.selectedFilter = null;
      // setTimeout(()=>{
      //    this.activeFilter.value = null;
      // }, 300)
  }

  onVacancyRemoved(event){
      console.log("event", event)
      if (this.selectedGroups.has(event._id)) {
        this.selectedGroups.delete(event._id);
      }
  }
}

