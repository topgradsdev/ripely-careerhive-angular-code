import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminsComponent } from './admins/admins.component';
import { StaffMemberComponent } from './staff-member/staff-member.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { PlacementManagerComponent } from './placement-manager/placement-manager.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserActivityListComponent } from './user-activity-list/user-activity-list.component';
import { ViewUserSuperAdminComponent } from './view-user-super-admin/view-user-super-admin.component';
import { ViewUsersListComponent } from './view-users-list/view-users-list.component';

const routes: Routes = [
  {
		path: 'admins',
		component: AdminsComponent
	},
  {
		path: 'staff-member',
		component: StaffMemberComponent
	},
  {
		path: 'user-group',
		component: UserGroupsComponent
	}, 
	{
		path: 'placement-manager',
		component: PlacementManagerComponent
	}, 
	{
		path: 'user-profile',
		component: UserProfileComponent
	}, 
	{
		path: 'my-profile',
		component: ViewUserSuperAdminComponent
	}, 
	{
		path: 'user-activity',
		component: UserActivityListComponent
	}, 
	{
		path: 'view-users-list',
		component: ViewUsersListComponent
	}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
