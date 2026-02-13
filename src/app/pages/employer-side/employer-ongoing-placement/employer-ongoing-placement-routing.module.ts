import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeGuard } from '../../../guards/employee-guard';
import { EmployerOngoingPlacementComponent } from './employer-ongoing-placement.component';
import { EmployerOngoingPlacementDetailsComponent } from '../employer-ongoing-placement-details/employer-ongoing-placement-details.component';
import { ViewProfileComponent } from '../../../shared/components/employer/view-profile/view-profile.component';
import { EmployerStudentFormComponent } from '../../../shared/components/employer/student-form/employer-student-form.component';
import { ReportIncidentEmployerFormComponent } from 'src/app/shared/components/employer/report-incident-employer-form/report-incident-employer-form.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmployeeGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerOngoingPlacementComponent
      },
      {
        path: 'ongoing-details',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerOngoingPlacementDetailsComponent
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
      },
        {
        path: 'report-incident-student-form',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: ReportIncidentEmployerFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerOngoingPlacementRoutingModule { }
