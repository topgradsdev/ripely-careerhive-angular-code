import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxListComponent } from './sandbox-list/sandbox-list.component';
import { CreateSandboxComponent } from './create-sandbox/create-sandbox.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage',
    pathMatch: 'full'
  },
  {
    path: 'manage',
    component: SandboxListComponent
  },
  {
    path: 'create',
    component: CreateSandboxComponent
  },
  {
    path: 'edit/:id',
    component: CreateSandboxComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxLibraryRoutingModule { }
