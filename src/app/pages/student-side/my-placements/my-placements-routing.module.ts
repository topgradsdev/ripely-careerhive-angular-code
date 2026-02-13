import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboradingCompanyComponent } from '../onborading-company/onborading-company.component';
import { StudentGuard } from 'src/app/guards/student-guard';
import { MyPlacementsComponent } from './my-placements.component';

const routes: Routes = [
  //  {
  //     path: '',
  //     canActivate: [StudentGuard],
  //     component: MyPlacementsComponent,
  //     data: {
  //       title: 'Student'
  //     },
  //   children: [
 
  //   ]
  //  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPlacementsRoutingModule { }
