import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerBIPageComponent } from './power-bi/power-bi-page.component';

const routes: Routes = [
  {
    path: '',
    component: PowerBIPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowerBIRoutingModule { }
