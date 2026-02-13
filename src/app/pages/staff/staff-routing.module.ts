import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffDefaultLayoutComponent } from '../../containers';
import { StaffGuard } from '../../guards/staff-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [StaffGuard],
    component: StaffDefaultLayoutComponent,
    data: {
      title: 'Staff'
    },
    children: [
     
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
