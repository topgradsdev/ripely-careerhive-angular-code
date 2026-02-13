import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsCompanyComponent } from './analytics-company.component';
import { AnalyticsCompanyFilteringComponent } from './analytics-company-filtering/analytics-company-filtering.component';
import { CompanyCreateNewFilterComponent } from './company-create-new-filter/company-create-new-filter.component';

const routes: Routes = [
  {
    path: '',
		component: AnalyticsCompanyComponent
  },
  {
    path: 'filtering',
		component: AnalyticsCompanyFilteringComponent
  },
  {
    path: 'create-new-filter',
		component: CompanyCreateNewFilterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsCompanyRoutingModule { }
