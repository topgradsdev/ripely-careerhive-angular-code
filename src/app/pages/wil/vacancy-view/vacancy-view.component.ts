import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-vacancy-view',
  templateUrl: './vacancy-view.component.html',
  styleUrls: ['./vacancy-view.component.scss']
})
export class VacancyViewComponent implements OnInit {
  selectedVacancyId = null;
  vacancyDetail = null;
  skillsevent = [];
  constructor(private service: TopgradserviceService,
     private activatedRoute: ActivatedRoute, private location:Location, private router: Router) { 
    
  }

   navigateToProjectTab() {
      const redirectData = sessionStorage.getItem("redirect");
      
      if (redirectData || this.redirectType) {
        const parsed = JSON.parse(redirectData);
        this.router.navigate(['/admin/wil/view-company-details'], {
          queryParams: {
            company_id: parsed.company_id?parsed.company_id:this.vacancyDetail.company_id,
            tab: parsed.tab? parsed.tab:this.redirectType
          }
        });
      } else {
        this.router.navigate(['/admin/wil/wil-vacancies-list']);
      }
    }

  gotoback(){
    this.location.back()
  }

  redirectType:any = null;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.selectedVacancyId = params.id;
        this.getVacancyById();
      }
      if (params.type) {
          this.redirectType = params.type;
      }
    });
  }

  getVacancyById() {
    const obj = {
      _id: this.selectedVacancyId
    }
    this.service.getVacancyById(obj).subscribe((res: any) => {
      this.vacancyDetail = res.data[0];
      console.log("this.vacancyDetail", this.vacancyDetail);
      // this.getJobSkills();
    });
  }

  getJobSkills() {
    const obj = {
      job_title: this.vacancyDetail?.job_title
    }
    this.service.getJobSkills(obj).subscribe((res: any) => {
      const skills = this.vacancyDetail?.skills.split(',');
      this.skillsevent = skills.map(skill => {
       return res.data.find(skillR => skillR._id === skill);
      });
    });
  }

     getApplication(item){
      if(item && item.application_receivers_info){
        return item?.application_receivers_info?.map(user => user.full_name).join(', ')
      }else{
        return '';
      }
      
    }

    getInitials(name: string | undefined): string {
    if (!name) return '';
  
    const words = name.split(' '); // Split name by spaces
    const firstInitial = words[0]?.charAt(0) || ''; // First letter of first word
    const secondInitial = words.length > 1 ? words[1]?.charAt(0) || '' : ''; // First letter of second word (if exists)
    
    return firstInitial + secondInitial; // Return initials
  }
  
}
