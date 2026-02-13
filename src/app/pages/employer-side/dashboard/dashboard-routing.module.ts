import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeGuard } from '../../../guards/employee-guard';
import { DashboardComponent } from './dashboard.component';
import { VacanciesDetailsComponent } from '../vacancies-details/vacancies-details.component';
import { EmployerVacancyComponent } from '../employer-vacancy/employer-vacancy.component';
import { ViewProfileComponent } from '../../../shared/components/employer/view-profile/view-profile.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmployeeGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: DashboardComponent
      },
      // {
      //   path: 'vacancies-details',
      //   pathMatch: 'full',
      //   canActivate: [EmployeeGuard],
      //   component: VacanciesDetailsComponent
      // },
      // {
      //   path: 'create-vacancies',
      //   pathMatch: 'full',
      //   canActivate: [EmployeeGuard],
      //   component: EmployerVacancyComponent
      // },
      // {
      //   path: 'view-profile',
      //   pathMatch: 'full',
      //   canActivate: [EmployeeGuard],
      //   component: ViewProfileComponent
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
