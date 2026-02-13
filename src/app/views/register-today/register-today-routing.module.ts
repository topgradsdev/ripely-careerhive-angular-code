import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterTodayComponent } from './register-today.component';

const routes: Routes = [

	{
		path:'',
		component: RegisterTodayComponent
	}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterTodayRoutingModule { }
