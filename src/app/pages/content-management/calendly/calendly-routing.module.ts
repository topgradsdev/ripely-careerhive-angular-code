import { NgModule } from '@angular/core';
import { CalendlyComponent } from './calendly.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: CalendlyComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendlyRoutingModule { }
