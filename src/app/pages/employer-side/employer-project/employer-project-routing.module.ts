import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeGuard } from '../../../guards/employee-guard';
import { ViewProfileComponent } from '../../../shared/components/employer/view-profile/view-profile.component';
import { EmployerStudentFormComponent } from '../../../shared/components/employer/student-form/employer-student-form.component';
import { EmployerProjectComponent } from './employer-project.component';
import { EmployerProjectDetailsComponent } from '../employer-project-details/employer-project-details.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmployeeGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerProjectComponent
      },
      {
        path: 'details',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerProjectDetailsComponent
      },
      {
        path: 'view-profile',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: ViewProfileComponent
      },
      {
        path: 'employer-student-form',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerStudentFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerProjectRoutingModule { }
