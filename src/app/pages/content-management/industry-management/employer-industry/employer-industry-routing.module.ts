import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerIndustryComponent } from './employer-industry.component';

const routes: Routes = [
  {
    path:'',
    component:EmployerIndustryComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerIndustryRoutingModule { }
