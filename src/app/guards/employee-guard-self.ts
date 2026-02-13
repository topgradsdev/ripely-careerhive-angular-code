import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TopgradserviceService } from '../topgradservice.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuardSelf implements CanActivate {

  constructor(
    private employerService: TopgradserviceService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
      const role = JSON.parse(localStorage.getItem("userDetail"))?._id;
     const payload = {
      _id: role
    }
    return this.employerService.getEmployerProfile(payload).pipe(
      map(employerProfile => {
        console.log("employerProfile", employerProfile);
        if (
          employerProfile?.record?.self_source_step === 'onbording'
        ) {
          return true;
        }  if (
          employerProfile?.record?.self_source_step === 'create_vacancy'
        ) {
          this.router.navigate(['/employer/vacancies/create-vacancies-self']);
        }else{
           this.router.navigate(['/employer/dashboard']);
        }

        // Redirect to another page if condition fails
       
        return false;
      })
    );
  }
}
