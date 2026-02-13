import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin-guard';
import { AnalyticsStudentModule } from './analytics-student/analytics-student.module';
import { AnalyticsCompanyModule } from '../analytics/analytics-company/analytics-company.module';

const routes: Routes = [
  {
    path: 'analytics-students',
    canActivate: [AdminGuard],
    loadChildren: () => import('../analytics/analytics-student/analytics-student.module').then(m => AnalyticsStudentModule)
  },
  {
    path: 'analytics-companies',
    canActivate: [AdminGuard],
    loadChildren: () => import('../analytics/analytics-company/analytics-company.module').then(m => AnalyticsCompanyModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
