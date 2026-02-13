import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AdminsComponent } from './admins/admins.component';
import { StaffMemberComponent } from './staff-member/staff-member.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { PlacementManagerComponent } from './placement-manager/placement-manager.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserActivityListComponent } from './user-activity-list/user-activity-list.component';
import { ViewUserSuperAdminComponent } from './view-user-super-admin/view-user-super-admin.component';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { ViewUsersListComponent } from './view-users-list/view-users-list.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    AdminsComponent,
    StaffMemberComponent,
    UserGroupsComponent,
    PlacementManagerComponent,
    UserProfileComponent,
    UserActivityListComponent,
    ViewUserSuperAdminComponent,
    ViewUsersListComponent,

  ],
  imports: [
    InfiniteScrollModule,
    CommonModule,
    UsersRoutingModule,
    NgSelectModule,
    EditorModule,
    MaterialModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ]
})
export class UsersModule { }
