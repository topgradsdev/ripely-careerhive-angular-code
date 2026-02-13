import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-view-users-list',
  templateUrl: './view-users-list.component.html',
  styleUrls: ['./view-users-list.component.scss']
})
export class ViewUsersListComponent implements OnInit {
  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'is_onboarding', 'createdAt', 'activity', 'actions'];
  userList: any = [];
  searchKeyword = null;
  permissionId = null;
  @ViewChild('userTbSort') userTbSort = new MatSort();
selectedAdmin:any;
  constructor(private service: TopgradserviceService, private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.permissionId) {
        this.permissionId = params.permissionId;
        this.getAllUsers();
      }
    });
  }

  ngOnInit(): void {

  }

  searchUsers() {
    if (this.searchKeyword.trim() === '') {
      this.getAllUsers();
      return;
    }
    const payload = {
      keywords: this.searchKeyword
    }
    this.service.searchAdmins(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
          this.userList = new MatTableDataSource(res.result);
          this.userList.sort = this.userTbSort;
      } else {
        this.userList = [];
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

  getAllUsers() {
    const payload = {
      permission_id: this.permissionId
    }
    this.service.getUserList(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.userList = new MatTableDataSource(res.result);
        this.userList.sort = this.userTbSort;
    } else {
      this.userList = [];
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

  goToUserDetail(user) {
    console.log("user", user)
    this.router.navigate(['/admin/users/user-profile'], {queryParams: {from: 'staff', adminId: user?.admin_id}});
  }
}

