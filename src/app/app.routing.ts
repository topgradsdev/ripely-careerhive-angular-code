import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent, StaffDefaultLayoutComponent, StudentDefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { AuthguardGuard } from './authguard.guard';
import { LoginInitialComponent } from './pages/auth/login-initial/login-initial.component';
import { StudentLoginComponent } from './pages/auth/student-login/student-login.component';
import { AdminGuard } from './guards/admin-guard';
import { LoggedUserGuard } from './guards/logged-user-guard';
import { StaffGuard } from './guards/staff-guard';
import { StudentGuard } from './guards/student-guard';
import { EmployerLoginComponent } from './pages/auth/employer-login/employer-login.component';
import { StaffLoginComponent } from './pages/auth/staff-login/staff-login.component';
import { EmployeeGuard } from './guards/employee-guard';
import { StudentTermsAndConditionsComponent } from './pages/student-terms-and-conditions/student-terms-and-conditions.component';
import { EmployerRegisterComponent } from './pages/auth/employer-register/employer-register.component';
import { AdminOnboardingComponent } from './pages/auth/admin-onboarding/admin-onboarding.component';
import { UnderMaintenanceComponent } from './views/error/under-maintenance/under-maintenance.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { StudentLoginCallBackComponent } from './pages/auth/student-login-callback/student-login-callback.component';


export const routes: Routes = [
  { path: 'maintenance', component: UnderMaintenanceComponent },
  // { path: '**', redirectTo: 'maintenance' },
  {
    path: '',
    redirectTo: 'login/callback',
    pathMatch: 'full',
  },
  {
    path: 'login-initial',
    component: StudentLoginComponent,
    canActivate: [LoggedUserGuard],
    data: {
      title: 'Login Initial'
    }
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [LoggedUserGuard],
    data: {
      title: 'Login Page'
    }
  },
  // {
  //   path: 'staff-login',
  //   component: StaffLoginComponent,
  //   data: {
  //     title: 'Login Page'
  //   }
  // },
  {
    path: 'student-login',
    component: StudentLoginComponent,
    canActivate: [LoggedUserGuard],
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'login/callback',
    component: StudentLoginCallBackComponent,
    // canActivate: [LoggedUserGuard],
    data: {
      title: 'Login Page'
    }
  },

  //  { path: 'login/callback', component: CallbackComponent },
  {
    path: 'employer-login',
    component: EmployerLoginComponent,
    canActivate: [LoggedUserGuard],
    data: {
      title: 'Employer Login'
    }
  },
  {
    path: 'employer-register',
    component: EmployerRegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'forgetPassword',
    component: ForgetPasswordComponent,
    data:{
      title: 'Forget Passowrd'
    }
  },
  {
      path: 'reset-password',
      // canActivate: [AdminGuard],
      canActivate: [LoggedUserGuard],
      component: ResetPasswordComponent,
      data:{
        title: 'Reset Passowrd'
      }
    },

    {
      path: 'reset-password/:verification/:token/:type',
      // canActivate: [AdminGuard],
      canActivate: [LoggedUserGuard],
      component: ResetPasswordComponent,
      data:{
        title: 'Reset Passowrd'
      }
    },
  
    {
      path: 'admin-onboarding',
      canActivate: [AdminGuard],
      component: AdminOnboardingComponent,
      data:{
        title: 'Admin Onboarding'
      }
    },
  {
    path: 'admin',
    canActivate: [AuthguardGuard],
    component: DefaultLayoutComponent,
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AdminGuard]
      },
    ]
  },
  {
    path: 'student',
    canActivate: [StudentGuard],
    loadChildren: () => import('./pages/student-side/student-side.module').then(m => m.StudentSideModule)
  },
  // {
  //   path: 'staff',
  //   canActivate: [StaffGuard],
  //   loadChildren: () => import('./pages/staff/staff.module').then(m => m.StaffModule)
  // },
  {
    path: 'change-password',
    pathMatch: 'full',
    canActivate: [AdminGuard],
    component: ChangePasswordComponent
  },
  {
    path: 'employer',
    canActivate: [EmployeeGuard],
    loadChildren: () => import('./pages/employer-side/employer-side.module').then(m => m.EmployerSideModule)
  },
  {
    path: 'student-terms-and-conditions',
    component: StudentTermsAndConditionsComponent,
    loadChildren: () => import('./pages/student-terms-and-conditions/student-terms-and-conditions.module').then(m => m.StudentTermsAndConditionsModule)
  },
  {
    path: 'form',
    // canActivate: [EmployeeGuard],
    loadChildren: () => import('./pages/form-completion/form-completion.module').then(m => m.FormCompletionModule)
  },
  { 
   path: '**',
   pathMatch: 'full',
   component: P404Component
  }
];

// { relativeLinkResolution: 'legacy' }
//  { useHash: false,  scrollPositionRestoration: 'enabled' }
@NgModule({
  imports: [ RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
