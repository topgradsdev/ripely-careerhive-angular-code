import { NgModule } from '@angular/core';
import { EventBrightComponent } from './event-bright.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: EventBrightComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventBrightRoutingModule { }
