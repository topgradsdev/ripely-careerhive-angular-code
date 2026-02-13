import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { VacanciesDetailsComponent } from './vacancies-details/vacancies-details.component';
import { EmployeeDefaultLayoutComponent } from '../../containers/employee-default-layout';
import { EmployeeGuard } from '../../guards/employee-guard';
import { EmployerVacancyComponent } from './employer-vacancy/employer-vacancy.component';
import { EmployerSupportComponent } from './employer-support/employer-support.component';
import { EmployerCompletedPlacementComponent } from './employer-completed-placement/employer-completed-placement.component';
import { EmployerOngoingPlacementComponent } from './employer-ongoing-placement/employer-ongoing-placement.component';
import { EmployerOngoingPlacementDetailsComponent } from './employer-ongoing-placement-details/employer-ongoing-placement-details.component';
import { MyCompanyProfileComponent } from './my-company-profile/my-company-profile.component';
import { EmployerSiteVisitsDetailsComponent } from './employer-site-visits-details/employer-site-visits-details.component';
import { EmployerOnboardingComponent } from './employer-onboarding/employer-onboarding.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ViewCompanyProfileComponent } from './view-company-profile/view-company-profile.component';
import { MySiteVisitsDetailsComponent } from './my-company-profile/my-site-visits-details/my-site-visits-details.component';
import { MyViewSiteVisitsDetailsComponent } from './view-company-profile/my-view-site-visits-details/my-view-site-visits-details.component';
import { EmployerOnboardingSelfComponent } from './employer-onboarding-self/employer-onboarding-self.component';
import { EmployeeGuardSelf } from 'src/app/guards/employee-guard-self';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmployeeGuard],
    component: EmployeeDefaultLayoutComponent,
    data: {
      title: 'Employer'
    },
    children: [
      {
        path: 'dashboard',
        canActivate: [EmployeeGuard],
        loadChildren: () => import('../employer-side/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'vacancies',
        canActivate: [EmployeeGuard],
        loadChildren: () => import('../employer-side/vacancies/vacancies.module').then(m => m.VacanciesModule)
      },
      {
        path: 'change-password',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: ChangePasswordComponent
      },
      {
        path: 'employer-support',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerSupportComponent
      },
      {
        path: 'completed',
        canActivate: [EmployeeGuard],
        loadChildren: () => import('../employer-side/employer-completed-placement/employer-completed-placement.module').then(m => m.EmployerCompletedPlacementModule)
      },
      {
        path: 'ongoing',
        canActivate: [EmployeeGuard],
        loadChildren: () => import('../employer-side/employer-ongoing-placement/employer-ongoing-placement.module').then(m => m.EmployerOngoingPlacementModule)
      },


      {
        path: 'placements',
        canActivate: [EmployeeGuard],
        loadChildren: () => import('../employer-side/employer-placement/employer-placement.module').then(m => m.EmployerPlacementModule)
      },

      {
        path: 'projects',
        canActivate: [EmployeeGuard],
        loadChildren: () => import('../employer-side/employer-project/employer-project.module').then(m => m.EmployerProjectModule)
      },
      {
        path: 'my-company-profile',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: MyCompanyProfileComponent
      },
      {
        path: 'view-company-details',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: ViewCompanyProfileComponent
      },
      {
        path: 'site-visits-details',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerSiteVisitsDetailsComponent
      },
      {
        path: 'my-site-visits-details',
        component: MySiteVisitsDetailsComponent
      },
      {
        path: 'view-site-visits-details',
        component: MyViewSiteVisitsDetailsComponent
      },
      
      {
        path: 'onboarding',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerOnboardingComponent
      },

      {
        path: 'onboarding-self',
        pathMatch: 'full',
        canActivate: [EmployeeGuardSelf],
        component: EmployerOnboardingSelfComponent,
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerSideRoutingModule { }
