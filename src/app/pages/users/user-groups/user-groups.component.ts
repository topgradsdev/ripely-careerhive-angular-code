import { CUSTOM_ELEMENTS_SCHEMA, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpResponseCode } from '../../../shared/enum';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  selectedIndex = 1;
displayedDeletionColumns:any = [];
deletionList:any = [];
  // Form control and data
  userGroupForm: FormGroup;
  permissions = [];
  permissionsGroupList = [];
  selectedGroup = null;
  selectedGroupPermissons = null;
  selectedGroupId = null;
  password = null;
  pass = "password";
  // Table columns
  displayedColumns: string[] = ['title', 'is_view', 'is_write'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private service: TopgradserviceService,
    private fb: FormBuilder,
    private router: Router
  ) {}


  onEyeClick(field: any, type: any) {
    console.log(field)
    if (field == 'pass') {
      this.pass = type
    }
  }


  ngOnInit(): void {
    this.getAllPermissionsList();
    this.getAllPermissionGroup();

    // Form initialization with validation
    this.userGroupForm = this.fb.group({
      group_name: ['', [Validators.required]],
      permissions: ['', [Validators.required]]
    });
  }

  // Fetch list of all permissions
  getAllPermissionsList() {
    this.service.getAllPermissionsList().subscribe(res => {
      console.log("resresres", res);
      if (res.status === HttpResponseCode.SUCCESS) {
        this.permissions = res.result.map(permission => ({
          ...permission,
          is_view: false,
          is_write: false
        }));
      } else {
        this.handleErrorMessage(res.msg);
      }
    }, err => {
      this.handleErrorMessage(err.error.errors?.msg || 'Something went wrong');
    });
  }

  // Fetch all permission groups
  getAllPermissionGroup() {
    this.service.getAllPermissionsGroup().subscribe(res => {
      if (res.status === HttpResponseCode.SUCCESS) {
        console.log("res", res);
        this.permissionsGroupList = res.result;
      } else {
        this.handleErrorMessage(res.msg);
      }
    }, err => {
      this.handleErrorMessage(err.error.errors?.msg || 'Something went wrong');
    });
  }

  // Handle permission toggle and form patch
  addPermission(type: string, permission: any) {
    if (type === 'write' && permission.is_write) {
      permission.is_view = true;
    }

    const permissions = this.permissions.filter(p => p.is_view || p.is_write)
      .map(p => ({
        module: p.title,
        is_view: p.is_view,
        is_write: p.is_write
      }));

    this.userGroupForm.patchValue({ permissions });
    this.userGroupForm.markAllAsTouched();
  }

  // Create new user group
  createUserGroup() {
    if (this.userGroupForm.invalid) {
      this.userGroupForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.userGroupForm.value };

    this.service.createPermissionGroup(payload).subscribe(res => {
      this.getAllPermissionGroup();
    }, err => {
      this.handleErrorMessage(err.error.errors?.msg || 'Something went wrong');
    });
  }

  // Password check before delete
  checkPassword() {
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      email_id: userDetail?.email,
      password: this.password
    };
    return this.service.confirmPassword(payload).toPromise().catch(error => {
      this.handleErrorMessage(error?.error?.errors?.msg);
    });
  }

  // Delete a user group
  async deleteUserGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== 'success') return;

    const payload = {
      group_id: this.selectedGroup?._id
    };

    this.service.deleteUserGroup(payload).subscribe(res => {
      if (res.status === HttpResponseCode.SUCCESS) {
        this.service.showMessage({ message: 'User group deleted successfully' });
        this.getAllPermissionGroup();
      } else {
        this.handleErrorMessage(res.msg);
      }
    }, err => {
      this.handleErrorMessage(err.error.errors?.msg || 'Something went wrong');
    });
  }

  // Edit a user group
  editUserGroup() {
    this.router.navigate(['/admin/users/placement-manager'], { queryParams: { groupId: this.selectedGroup?._id } });
  }

  // Get permissions for a selected group
  getUserPermissionByGrouId() {
    const payload = {
      permission_id: this.selectedGroupId
    };
  
    this.service.getUserPermissionByGrouId(payload).subscribe(res => {
      if (res.status === HttpResponseCode.SUCCESS && res.result.length > 0) {
        this.selectedGroupPermissons = res.result[0];
      } else {
        this.selectedGroupPermissons = null; // Set to null if no data found
        this.service.showMessage({ message: res.msg });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors?.msg || 'Something went wrong'
      });
    });
  }
  
  

  // Copy permissions from selected group
  copySelectedGroupPermission() {
    if (!this.selectedGroupPermissons?.permissions) return;

    this.userGroupForm.patchValue({ permissions: this.selectedGroupPermissons.permissions });

    this.permissions.forEach(permission => {
      const findPermission = this.selectedGroupPermissons.permissions.find(groupPermission => groupPermission.module === permission.title);
      permission.is_view = findPermission?.is_view || false;
      permission.is_write = findPermission?.is_write || false;
    });
  }

  // Reset form and popup details
  resetPopupDetail() {
    this.userGroupForm.reset();
    this.selectedGroupId = null;
    this.permissions.forEach(permission => {
      permission.is_view = false;
      permission.is_write = false;
    });
  }

  // View users with selected group permissions
  viewUsers() {
    this.router.navigate(['/admin/users/view-users-list'], { queryParams: { permissionId: this.selectedGroup?._id } });
  }

  // Handle error message display
  handleErrorMessage(message: string) {
    this.service.showMessage({ message });
  }
}
