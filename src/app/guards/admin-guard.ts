import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TopgradserviceService } from '../topgradservice.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private service: TopgradserviceService, private router: Router){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const role = JSON.parse(localStorage.getItem("userDetail"))?.role;
        const userSDetail = JSON.parse(localStorage.getItem("userSDetail"));
        if(userSDetail && userSDetail.role=="student"){
           this.router.navigate(['/student/dashboard']);
        }else if(!this.service.getToken() || role != "admin") {
        // this.service.showMessage({
        //   message: "Please Login First"
        // })
        this.router.navigate(['login']);
        return false;
      }
      else{
        return true;
      }
  }



  
}
