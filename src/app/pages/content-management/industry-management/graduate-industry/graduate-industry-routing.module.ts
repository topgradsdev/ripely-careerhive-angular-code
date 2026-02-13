import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraduateIndustryComponent } from './graduate-industry.component';

const routes: Routes = [
  {
    path:'',
    component:GraduateIndustryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraduateIndustryRoutingModule { }
