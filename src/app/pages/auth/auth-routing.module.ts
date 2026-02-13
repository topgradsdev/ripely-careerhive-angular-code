import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin-guard';
import { AnalyticsModule } from '../analytics/analytics.module';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { StudentLoginCallBackComponent } from './student-login-callback/student-login-callback.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent, // /login
    children: [
       {
        path: '',
        component: LoginComponent,
        children:[
           {
            path: 'callback', // ✅ now matches /login/callback
            component: StudentLoginCallBackComponent,
            data: { title: 'Login Callback' }
          }
        ]
      },
     
    ]
  }
];

// const routes: Routes = [
//   {
//     path: 'login',
//     component: LoginComponent, // /login
//     // canActivate: [AdminGuard]
//   },
//   {
//     path: 'callback',
//     component: StudentLoginCallBackComponent, // /login/callback
//     data: { title: 'Login Callback' }
//   }
// ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
