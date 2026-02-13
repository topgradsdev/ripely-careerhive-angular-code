import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentAndReportingComponent } from './incident-and-reporting.component';

const routes: Routes = [
  {
		path: '',
		component: IncidentAndReportingComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentAndReportingRoutingModule { }
