import { Component, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../../topgradservice.service';
import {HttpResponseCode} from '../../../../shared/enum';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-company-create-new-filter',
  templateUrl: './company-create-new-filter.component.html',
  styleUrls: ['./company-create-new-filter.component.scss']
})
export class CompanyCreateNewFilterComponent implements OnInit {
  analyticsSelectedFilter: string;
  analyticsFilter = null;
  allDropdownFilters = [];
  selectedTable = {
    id: null,
    row: null,
    col: null,
    isEdit: false
  }
  tableDetail = null;
  analyticsProcessForm: FormGroup;
  filter = {
    label: "",
    field: "",
    input_type: "",
    values: null
  }
  dateRange = {
    start: null,
    end: null
  }

  selectedFilters = [];
  isPreviewFilter = false;
  edit_filter = false;
  minDate: any; 
  maxDate: any;
  selectedFilterIndex = null;

  displayedPlacementColumns: string[] = ['placement_group','code','start_date','end_date', 'status' ]
  displayedColumns: string[] = [
    'checkbox',
    'company_name',
    'company_code',
    'location',
    'abn_acn',
    'no_of_employees',
    'company_phone',
    // 'vacancies',
    'site_status',
    'web_address',
    'lead_source',
    'conversion_status',
    'created_by',
    'date_created',
    'last_updated_by',
    'last_updated',
    'last_hcaaf_update',
    'hcaaf_expiry',
    'student_placed',
    'placement_groups',
    'contact_01_first_name',
    'contact_01_last_name',
    'contact_01_title',
    'contact_01_primary_email',
    'contact_01_secondary_email',
    'contact_01_primary_phone',
    'contact_01_secondary_phone',
    'contact_01_created_by',
    'contact_01_created_date',
    'contact_01_updated_by',
    'contact_01_last_updated',
    'contact_02_first_name',
    'contact_02_last_name',
    'contact_02_title',
    'contact_02_primary_email',
    'contact_02_secondary_email',
    'contact_02_primary_phone',
    'contact_02_secondary_phone',
    'contact_02_created_by',
    'contact_02_created_date',
    'contact_02_updated_by',
    'contact_02_last_updated',
    'contact_03_first_name',
    'contact_03_last_name',
    'contact_03_title',
    'contact_03_primary_email',
    'contact_03_secondary_email',
    'contact_03_primary_phone',
    'contact_03_secondary_phone',
    'contact_03_created_by',
    'contact_03_created_date',
    'contact_03_updated_by',
    'contact_03_last_updated',
    'whs_check',
    'company_concent_to_use_logo',
    'actions'
  ]
  dataSource: MatTableDataSource<any>;

  placementLists = [
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    
  ]

  @ViewChild('companiesTbSort') companiesTbSort = new MatSort();
  companiesList: any = [];
  selectAllComp = false;
  selectedRecords = [];
  isCheck = false;
  searchCriteria = {
    keywords: null
  }

  constructor(
    private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getNewFilters();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params) {
        this.selectedTable = {
          id: params?.id,
          row: params?.row,
          col: params?.col,
          isEdit: params?.isEdit === "true" ? true : false
        }
        this.getTableById();
      }
    });
    this.analyticsProcessForm = this.fb.group({
      process_name: ["", Validators.required]
    });
  }

  onChangeSearchKeyword(searchFor: string) {
    if (this.searchCriteria.keywords.length >= 3) {
      // this.paginationObj.pageIndex = 0;
      this.searchCompany();
    } else {
      this.previewAnalyticFilter(false);
    }
  }

  searchCompany() {
    this.service.searchCompany(this.searchCriteria).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.companiesList = new MatTableDataSource(response.result);
        this.companiesList.data.forEach(company => {
          company.selected = false;
        });
        this.companiesList.sort = this.companiesTbSort;
      } else {
        this.companiesList = [];
      }
    })
  }

  goToCompanyProfile(company) {
    this.router.navigate(['/admin/wil/view-company-details'], {queryParams: {company_id: company._id}});
  }

  getCompaniesList() {
    const payload = {
      limit: 10,
      offset: 0
    }
    this.service.getCompaniesList(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        response.result = response.result.map(company => {
          return this.service.transformContactPersonObj(company);
        });
        this.companiesList = new MatTableDataSource(response.result);
        this.companiesList.data.forEach(company => {
          company.selected = false;
        });
        this.companiesList.sort = this.companiesTbSort;
      } else {
        this.companiesList = [];
      }
    })
  }

  exportPartnerData(type) {
    const selectedCompanies = this.companiesList.data.filter(company => company.selected);
    const payload = {
      type, 
      company_id: selectedCompanies.length > 0 ? selectedCompanies.map(company => company._id) : undefined
    } 
    this.service.exportPartners(payload).subscribe((res: any) => {
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
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
    this.selectedRecords = this.companiesList.data.filter(company => company.selected);
  }

  selectCompany() {
    this.isCheck = this.companiesList.data.some(company => company.selected);
    this.selectedRecords = this.companiesList.data.filter(company => company.selected);
    if (this.selectedRecords?.length != this.companiesList.data.length) {
      this.selectAllComp = false;
    }
  }

  editFilter(){
    this.edit_filter = !this.edit_filter;
  }

  getTableById() {
    let payload = {_id: this.selectedTable.id};
    this.service.getTables(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.tableDetail = data.data[0];
        const filter = this.tableDetail?.filter_details[this.selectedTable?.row + '-' + this.selectedTable?.col];
        this.analyticsProcessForm.patchValue({
          process_name: filter?.process_name
        });
        this.selectedFilters = filter?.filters ? filter?.filters : [];
        this.previewAnalyticFilter(false);
      }
    })
  }

  getNewFilters() {
    let payload = {category:"company"};
    this.service.getFilter(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.allDropdownFilters = data.data;
      }
    })
  }

  onSelectFilter(event) {
    this.analyticsFilter = this.allDropdownFilters.find(filter => filter._id === event);
  }

  previewAnalyticFilter(isSave) {
    if (this.analyticsProcessForm.invalid) {
      this.analyticsProcessForm.markAllAsTouched();
      return;
    }
    const payload = {
      _id: this.selectedTable?.id,
      filter_details: {
        row: this.selectedTable?.row,
        col: this.selectedTable?.col,
        process_name: this.analyticsProcessForm.value.process_name,
        filters: this.selectedFilters,
        saved: isSave,
        preview: true
      }
    }
    this.service.updateFilter(payload).subscribe(res => {
      if (isSave) {
        this.service.showMessage({
          message: "Analytics filter submitted successfully"
        });
        if (!this.selectedTable?.isEdit) {
          this.router.navigate(['/admin/analytics/analytics-companies']);
        }
      } else {
        this.isPreviewFilter = true;
      }
      res.data = res.data.map(company => {
        return this.service.transformContactPersonObj(company);
      });
      this.companiesList = new MatTableDataSource(res.data);
      this.companiesList.data.forEach(company => {
        company.selected = false;
      });
      this.displayedColumns = this.displayedColumns.filter(column => {
        const found = this.selectedFilters.find(filter => filter.field === column);
        if (found || (column === 'checkbox' || column === 'company_name' || column === 'actions')) {
          return column;
        }
      });
      this.companiesList.sort = this.companiesTbSort;
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  addFilters(isEdit?) {
    const found = this.selectedFilters?.find(filter => filter.field === this.analyticsFilter?.field_details?.field)
    if (found) {
      this.service.showMessage({
        message: 'Filter already selected.'
      });
      return;
    }
    if (!isEdit) {
      this.selectedFilters.push({
        ...this.analyticsFilter?.field_details,   
        isEdit: false,     
        values: this.analyticsFilter?.field_details?.input_type === 'date-range' ? ({start: this.dateRange?.start, end: this.dateRange?.end}) : (this.filter?.values ? this.filter?.values.join(', ') : 'Show All')
      });
    } else {
      this.selectedFilters[this.selectedFilterIndex].isEdit = false;
    }
    
    this.analyticsFilter = null;
    this.analyticsSelectedFilter = null;
    this.filter = {
      label: '',
      field: '',
      input_type: '',
      values: null
    }
  }

  deleteFilter() {
    this.selectedFilters.splice(this.selectedFilterIndex, 1);
  }

  cancel() {
    this.router.navigate(['/admin/analytics/analytics-companies']);
  }

  clearAllFilters() {
    this.selectedFilters = [];
  }

  onDateRangeStart(event) {
    this.minDate = event.value;
  }
  
  onDateRangeEnd(event) {
    this.maxDate = event.value;
  }

  editSelectedFilter(i) {
    this.selectedFilterIndex = i;
    this.selectedFilters[i].isEdit = true;
    this.selectedFilters[i].values = this.selectedFilters[i].input_type === 'date-range' ? this.selectedFilters[i].values : this.selectedFilters[i].values?.split(', ')
  }
}
