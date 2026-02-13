import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponseCode } from '../../../../shared/enum';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-student-create-new-process',
  templateUrl: './student-create-new-process.component.html',
  styleUrls: ['./student-create-new-process.component.scss']
})

export class StudentCreateNewProcessComponent implements OnInit {
  analyticsSelectedFilter: string;
  analyticsFilter: any;
  placementLists:any;
  displayedPlacementColumns:any = [];
  dateRange = {
    start: null,
    end: null
  }
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

  selectedFilters = [];
  isPreviewFilter = false;
  edit_filter = false;
  minDate: any; 
  maxDate: any;
  selectedFilterIndex = null;

  studentList: any = [
  ]
  displayedColumns: string[] = ['checkbox', 'student_id',
   'first_name', 'major', 'primary_email', 'secondary_email', 'mobile', 'course_start_date', 'course_end_date', 'dob', 'gender', 'internship_start_date', 'internship_end_date', 'hours_weeks', 'placement_doc_received', 'companyName', 'actions'];

  dataSource: MatTableDataSource<any>;
  @ViewChild('studentTbSort') studentTbSort = new MatSort();
  selectAllStud = false;
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

  getAllStudents() {
    const payload = {
      limit: 10, 
      offset: 0
    }
    this.service.getEligibleStudents(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentList = new MatTableDataSource(response.result);
        this.studentList?.data.forEach(student => {
          student.selected = false;
        })
        this.studentList.sort = this.studentTbSort;
      } else {
        this.studentList = [];
      }
    })
  }

  goToCompanyProfile(company) {
    this.router.navigate(['/admin/wil/view-company-details'], {queryParams: {company_id: company._id}});
  }

  selectAllStudent() {
    for (let company of this.studentList.data) {
      if (this.selectAllStud) {
        company['selected'] = true;
      } else {
        company['selected'] = false;
      }
      this.isCheck = company['selected'];
    }
    this.selectedRecords = this.studentList.data.filter(company => company.selected);
  }

  exportStudentData(type) {
    const payload = {
      type,
      student_id: this.selectedRecords.length > 0 ? this.selectedRecords.map(student => student._id) : undefined,
    } 
    this.service.exportStudents(payload).subscribe((res: any) => {
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  selectStudent() {
    this.isCheck = this.studentList.data.some(student => student.selected);
    this.selectedRecords = this.studentList.data.filter(company => company.selected);
    if (this.selectedRecords?.length != this.studentList.data.length) {
      this.selectAllStud = false;
    }
  }

  onChangeSearchKeyword() {
    if (this.searchCriteria.keywords.length >= 3) {
      
      this.searchEligibleStudents();
    } else if(!this.searchCriteria.keywords) {
      this.previewAnalyticFilter(false);
    }
  }

  searchEligibleStudents() {
    const payload = {
      ...this.searchCriteria
    }
    this.service.searchStudent(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentList = new MatTableDataSource(response.result);
        this.studentList.sort = this.studentTbSort;
      } else {
        this.studentList = [];
      }
    })
  }

  editFilter() {
    this.edit_filter = !this.edit_filter;
  }

  getTableById() {
    let payload = { _id: this.selectedTable.id };
    this.service.getStudentTables(payload).subscribe((data) => {
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
    let payload = { category: "student" };
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
    const filters = [];
    this.selectedFilters.forEach(filter => {
      if (filter && filter.input_type === "dropdown-mini") {
        filter.values = filter.values.split(', ')
      }
      filters.push(filter);
    });
    const payload = {
      _id: this.selectedTable?.id,
      filter_details: {
        row: this.selectedTable?.row,
        col: this.selectedTable?.col,
        process_name: this.analyticsProcessForm.value.process_name,
        filters: filters,
        saved: isSave,
        preview: true
      }
    }
    this.service.updateStudentFilter(payload).subscribe(res => {
      if (isSave) {
        this.service.showMessage({
          message: "Analytics filter submitted successfully"
        });
        if (!this.selectedTable?.isEdit) {
          this.router.navigate(['/admin/analytics/analytics-students']);
        }
      } else {
        this.isPreviewFilter = true;
      }
      this.studentList = new MatTableDataSource(res.data);
        this.studentList?.data.forEach(student => {
          student.selected = false;
        })
        this.displayedColumns = this.displayedColumns.filter(column => {
          const found = this.selectedFilters.find(filter => filter.field === column);
          if (found || (column === 'checkbox' || column === 'student_id' || column === 'first_name' || column === 'actions')) {
            return column;
          }
        });
        this.studentList.sort = this.studentTbSort;

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
    this.router.navigate(['/admin/analytics/analytics-students']);
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
