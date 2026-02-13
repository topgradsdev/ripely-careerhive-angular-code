import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeGuard } from '../../../guards/employee-guard';
import { VacanciesComponent } from './vacancies.component';
import { VacanciesDetailsComponent } from '../vacancies-details/vacancies-details.component';
import { EmployerVacancyComponent } from '../employer-vacancy/employer-vacancy.component';
import { ViewProfileComponent } from '../../../shared/components/employer/view-profile/view-profile.component';
import { EmployerProjectCreateComponent } from '../employer-create-project/employer-create-project.component';
import { EmployerVacancSelfCreateComponent } from '../employer-vacancy-self-create/employer-vacancy-self-create.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmployeeGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: VacanciesComponent
      },
      {
        path: 'vacancies-details',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: VacanciesDetailsComponent
      },
      {
        path: 'create-vacancies',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerVacancyComponent
      },
        {
        path: 'create-vacancies-self',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerVacancSelfCreateComponent
      },
      {
        path: 'create-project',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerProjectCreateComponent
      },
      {
        path: 'view-profile',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: ViewProfileComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacanciesRoutingModule { }
