import { CUSTOM_ELEMENTS_SCHEMA, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { HttpResponseCode } from '../../../shared/enum';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link']
    ]
  };
  selectedAdmin:any = null;
  @ViewChild(MatSort) sort: MatSort;
  userForm: FormGroup;
  selectedIndex = 1;
  pass: String = 'password'
  @NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })

  displayedInactiveColumns: string[] = ['first_name', 'last_name', 'email', 'is_onboarding', 'createdAt', 'deactivationDate', 'actions'];
  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'is_onboarding', 'createdAt', 'activity', 'actions'];
  dataSource: MatTableDataSource<any>;

  btnTabs(index: number) {
    // return;
    this.searchKeyword = '';
    this.selectedIndex = index;
    this.getAllAdmin();
  }

  allActiveAdminList: any = [];
  allInactiveAdminList: any = [];
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }
  searchKeyword = '';
  @ViewChild('activeTbSort') activeTbSort = new MatSort();
  @ViewChild('inactiveTbSort') inactiveTbSort = new MatSort();
  // selectedAdmin = null;
  password = null;

  constructor(private fb: FormBuilder, private service: TopgradserviceService, private router: Router) { }
userDetail:any;
  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
    });
    this.getAllAdmin();
  }

  searchAdmins() {
    if (this.searchKeyword.trim() === '') {
      this.getAllAdmin();
      return;
    }
    this.paginationObj = {
      length: 0,
      pageIndex: 0,
      pageSize: this.paginationObj.pageSize,
      previousPageIndex: 0,
      changed: true,
  };
    const payload = {
      keywords: this.searchKeyword,
      admin_type:"admin",
      is_active: this.selectedIndex === 1 ? true : false
    }
    this.service.searchAdmins(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        if (this.selectedIndex === 1) {
          // this.paginationObj.length = res.total;
          this.allActiveAdminList = new MatTableDataSource(res.result);
          this.allActiveAdminList.sort = this.activeTbSort;
        } else {
          this.allInactiveAdminList = new MatTableDataSource(res.result);
          this.allInactiveAdminList.sort = this.inactiveTbSort;
        }
      } else {
        this.allActiveAdminList = [];
        this.allInactiveAdminList = [];
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

  getAllAdmin() {
    const payload = {
      // limit: this.paginationObj.pageSize,
      // offset: this.paginationObj.pageIndex,
      is_active: this.selectedIndex === 1 ? true : false
    }
    this.service.getAllAdmin(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        if (this.selectedIndex === 1) {
          // this.paginationObj.length = res.total;
          this.allActiveAdminList = new MatTableDataSource(res.result);
          this.allActiveAdminList.sort = this.activeTbSort;
        } else {
          this.allInactiveAdminList = new MatTableDataSource(res.result);
          this.allInactiveAdminList.sort = this.inactiveTbSort;
        }
      } else {
        this.service.showMessage({
          message: res.msg
        });
        this.allActiveAdminList = [];
        this.allInactiveAdminList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  onEyeClick(field: any, type: any) {
    if (field == 'pass') {
      this.pass = type
    }
  }

  createAdmin() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.userForm.value
    }

    this.service.createAdmin(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.getAllAdmin();
        document.getElementById('success-staff')?.click();
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

  deactivateAdmin() {
    const payload = {
      admin_id: this.selectedAdmin.map(admin => admin._id)?.join(),
      status: 'inactive',
      first_name: this.selectedAdmin.map(admin => admin.first_name)?.join()
    }
    this.updateAdmin(payload);
  }

  reactivateAdmin() {
    const payload = {
      admin_id: this.selectedAdmin.map(admin => admin._id)?.join(),
      status: 'active',
      first_name: this.selectedAdmin.map(admin => admin.first_name)?.join()
    }
    this.updateAdmin(payload);
  }

  checkPassword() {
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      email_id: userDetail?.email,
      password: this.password
    }
    return this.service.confirmPassword(payload).toPromise().catch((error) => {
      this.service.showMessage({message: error?.error?.errors?.msg});
    });
  }

  async updateAdmin(payload) {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== 'success') {
      return true;
    }
    this.service.updateAdminStaff(payload).subscribe(res => {
      this.service.showMessage({
        message: "Admin status updated Successfully"
      });
      this.selectedAdmin = null;
      this.getAllAdmin();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  goToUserDetail(admin) {
    this.router.navigate(['/admin/users/user-profile'], {queryParams: {from: 'admin', adminId: admin?._id}});
  }

  getPaginationData(event) {
    this.paginationObj = event;
    this.getAllAdmin();
  }


  activeFilter = {name: 'schools', value: ''};
  filters = [
    // { name: "schools", label: "School Name", selected: false, value: ""},
    // { name: "job_location", label: "Location", selected: false, value: ""},
    // { name: "vacancy_range", label: "Vacancies", selected: false, value: ""},
    // { name: "POST_DATE", label: "Post Date", selected: false, value: ""},
  ];

  applyFilter(filter) {
    this.activeFilter = filter;
  }
  filterApply:boolean = false;
  filterList:any = [];
  getTitle(){
    return 'Selected Parameters: '+this.filterList.join(', ');
  }

  callApi(){
    // this.filters.forEach(el=>{
    //   if(el.selected){
    //     el.selected =false
    //   }
    //   if (el.field) {
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
   this.getAllAdmin();
  }

  filterVacancies() {
    // const payload = {};
    // this.filters.forEach(filter => {
    //   if (filter.selected && filter.name !== "vacancy_range") {
    //     Object.assign(payload, {[filter.name]: filter.value});
    //   }
    //   if (filter.name === "vacancy_range" && filter.selected) {
    //       payload['min_vacancies'] = this.min_vacancies;
    //       payload['max_vacancies'] = this.max_vacancies;
    //   }
    // });
    
    // this.service.filterVacancies(payload).subscribe((res: any) => {
    //   if (res.status == HttpResponseCode.SUCCESS) {
    //     if (this.selectedIndex === 2) {
    //       this.archivedList = res.record;
    //       this.archivedList.forEach(list => {
    //         list.selected = false;
    //         list.company_name = list.company_info[0]?.company_name;
    //         list.location = list.job_location?.name;
    //       });
    //       this.archivedList = new MatTableDataSource(this.archivedList);
    //       this.archivedList.sort = this.archivedTbSort;
    //     } else {
    //       this.activeList = res.record;
    //       this.activeList.forEach(list => {
    //         list.selected = false;
    //         list.company_name = list.company_info[0]?.company_name;
    //         list.location = list.job_location?.name;
    //       });
    //       this.activeList = new MatTableDataSource(this.activeList);
    //       this.activeList.sort = this.activeTbSort;
    //     }
    //   } else {
    //     this.service.showMessage({
    //       message: "Vacancies not found for applied filters"
    //     });
    //   }
    // });
  }

}
