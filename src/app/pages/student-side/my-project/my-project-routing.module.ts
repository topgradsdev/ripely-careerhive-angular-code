import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProfileComponent } from '../../../shared/components/employer/view-profile/view-profile.component';
import { EmployerStudentFormComponent } from '../../../shared/components/employer/student-form/employer-student-form.component';
import {  MyProjectComponent } from './my-project.component';
import { StudentGuard } from '../../../guards/student-guard';
import { MyProjectDetailsComponent } from '../my-project-details/my-project-details.component';
import { MyProjectDetailsRoutingModule } from '../my-project-details/my-project-details-routing.module';

const routes: Routes = [
  {
    path: '',
    canActivate: [StudentGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: MyProjectComponent
      },
      {
        path: 'details',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: MyProjectDetailsComponent
      },
      {
        path: 'view-profile',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: ViewProfileComponent
      },
      {
        path: 'employer-student-form',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: EmployerStudentFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProjectRoutingModule { }
