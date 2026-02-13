import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-placement-manager',
  templateUrl: './placement-manager.component.html',
  styleUrls: ['./placement-manager.component.scss']
})
export class PlacementManagerComponent implements OnInit {
  showCollapes : boolean;
  permissions = [];
  selectedGroupId = null;
  selectedGroupPermissons = null;
  userGroupForm: FormGroup;

  constructor(private service: TopgradserviceService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.groupId) {
        this.selectedGroupId = params.groupId;
        this.getAllPermissionsList();
        this.userGroupForm = this.fb.group({
          group_name: ['', [Validators.required]],
          permissions: ['', [Validators.required]]
        });
      }
    });
  }

  getAllPermissionsList() {
    this.service.getAllPermissionsList().subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.permissions = res.result;
        this.permissions.forEach((permission) => {
          permission.is_view = false;
          permission.is_write = false;
        });
        this.getUserPermissionByGrouId();
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

  getUserPermissionByGrouId() {
    const payload = {
      permission_id: this.selectedGroupId
    }
    this.service.getUserPermissionByGrouId(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.selectedGroupPermissons = res.result[0];
        this.userGroupForm.patchValue({
          group_name: this.selectedGroupPermissons?.group_name,
          permissions: this.selectedGroupPermissons?.permissions
        });
        this.permissions.forEach((permission) => {
          const findPermission = this.selectedGroupPermissons?.permissions?.find(groupPermission => groupPermission.module === permission.title);
          if (findPermission) {
            permission.is_view = findPermission.is_view;
            permission.is_write = findPermission.is_write;
          }
          if (permission.is_write) {
            permission.is_view = true;
          }
        });
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

  collapsToggle() {
    this.showCollapes = !this.showCollapes;
  }

  addPermission(type, permission) {
    if (type === 'write' && permission.is_write) {
      permission.is_view = true;
    }
    const permissions = this.permissions.map(permission => {
      if (permission.is_view || permission.is_write) {
        return {
          module: permission.title,
          is_view: permission.is_view,
          is_write: permission.is_write
        }
      }
    })
    this.userGroupForm.patchValue({
      permissions: permissions.filter(permission => permission != undefined)
    });
    this.userGroupForm.markAllAsTouched();
  }

  updateUserGroup() {
    if (this.userGroupForm.invalid) {
      this.userGroupForm.markAllAsTouched();
      return;
    }
    const payload = {
      permission_id: this.selectedGroupId,
      ...this.userGroupForm.value
    }

    this.service.updatePermissionGroup(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: 'User group permissions updated successfully'
        });
        this.router.navigate(['/admin/users/user-group']);
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

  resetChanges() {
    this.getAllPermissionsList();
  }

}
