import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  sortBy: string = "alpha";
  asc = false;
  vacanciesList = [];
  activeList = [];
  archivedList = [];
  job_details: any;
  skills = [];
  skillsevent = [];
  searchQuery = "";
  status = 'active';
  userProfile = null;

  constructor(private service: TopgradserviceService,
    private router: Router) { }

  ngOnInit(): void {

    const fullUrl = window.location.href;
    let code: string | null = null;
    let state: string | null = null;

    if (fullUrl.includes('?')) {
      const searchParams = new URLSearchParams(fullUrl.split('?')[1]);
      console.log("searchParams", searchParams)
      code = searchParams.get('code');
      state = searchParams.get('state');


    }

    if (code) {
      // Send message to opener window
      if (window.opener) {
        window.opener.postMessage(
          { type: 'CRONOFY_AUTH_SUCCESS', code, state },
          window.location.origin
        );
        // ✅ Important: Close popup after message
        window.close();
      } else {
        console.warn('No opener window found. Popup cannot close automatically.');
      }
    }



    this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
    this.getAllActiveVacancies();
    this.getAllArchivedVacancies();
    let obj = {
      'job_title': "",
    }
    this.service.getJobSkills(obj).subscribe(res => {
      this.skills = res.data
    });
  }

  getAllActiveVacancies() {
    const payload = {
      // status: 'active',
      // company_id: this.userProfile?._id
      view_type:"employer",
      sort_by: this.sortBy,
      sort_type: this.asc ? 'asc' : 'desc',
      status: this.status,
      company_id: this.userProfile?._id,
      is_posted_vacancy:true,
      contact_person_id :this.userProfile?.contact_person_id,
      preferred_contact :this.userProfile?.preferred_contact?this.userProfile?.preferred_contact:false,
    }
    this.service.getAllVacancies(payload).subscribe((res: any) => {
      this.activeList = res.data;
    });
  }

  getAllArchivedVacancies() {
    const payload = {
      // status: 'inactive',
      // company_id: this.userProfile?._id
      sort_by: this.sortBy,
      view_type:"employer",
      sort_type: this.asc ? 'asc' : 'desc',
      status: 'inactive',
      company_id: this.userProfile?._id,
      is_posted_vacancy:true,
      contact_person_id :this.userProfile?.contact_person_id,
      preferred_contact :this.userProfile?.preferred_contact?this.userProfile?.preferred_contact:false,
    }
    this.service.getAllVacancies(payload).subscribe((res: any) => {
      this.archivedList = res.data;
    });
  }

  sortVacancies() {
    const payload = {
      sort_by: this.sortBy,
      sort_type: this.asc ? 'asc' : 'desc',
      status: this.status,
      company_id: this.userProfile?._id,
      is_posted_vacancy:true,
      contact_person_id :this.userProfile?.contact_person_id,
      preferred_contact :this.userProfile?.preferred_contact?this.userProfile?.preferred_contact:false,
       view_type:"employer",
    }
    this.service.sortVacancies(payload).subscribe((res: any) => {
      if (this.status === 'active') {
        this.activeList = res.data;
      } else {
        this.archivedList = res.data;
      }
    });
  }

  convertToSlug(Text: string) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  linkedIn() {

    const url = `${window.location.origin}/employer/vacancies/${this.job_details._id}/${this.convertToSlug(this.job_details.job_title)}`;

    window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + url)
  }

  facebook() {
    const url = `${window.location.origin}/employer/vacancies/${this.job_details._id}/${this.convertToSlug(this.job_details.job_title)}`;
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + url)
  }

  whatsapp() {
    const url = `${window.location.origin}/employer/vacancies/${this.job_details._id}/${this.convertToSlug(this.job_details.job_title)}`;
    window.open("https://api.whatsapp.com/send/?text=" + url + "&app_absent=0")
  }

  twitter() {
    const url = `${window.location.origin}/employer/vacancies/${this.job_details._id}/${this.convertToSlug(this.job_details.job_title)}`;
    window.open("http://twitter.com/share?text=TopGrad&url=" + url + "&hashtags=#job")
  }

  copyLink() {
    const url = `${window.location.origin}/employer/vacancies/${this.job_details._id}/${this.convertToSlug(this.job_details.job_title)}`;
    this.copy(url);

    const sel: any = document.querySelector(".link_copy");

    if (sel) {

      sel.style.display = "block";
      setTimeout(function () {
        sel.style.display = "none";
      }, 1000)
    }
    this.service.showMessage({
      message: 'Link copied',
    });
  }

  copy(text: string) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }

  getVacancyDetails(vacancy) {
    this.job_details = vacancy;
    this.skillsevent = this.job_details?.skills.map(jobSkill => {
      const found = this.skills.find(skill => skill._id === jobSkill);
      if (found) {
        jobSkill = found;
      }
      return jobSkill;
    });
  }

  editVacancy() {
    if(this.job_details.type=="project"){
      this.router.navigate(["/employer/vacancies/create-project"], { queryParams: { id: this.job_details._id, type: this.job_details.type} })
    }else{
      this.router.navigate(["/employer/vacancies/create-vacancies"], { queryParams: { id: this.job_details._id, type: this.job_details.type} })
    }
    
  }

  updateVacanciesStatus(status) {
    const payload = {
      _ids: [this.job_details?._id],
      status: status
    }
    this.service.updateVacanciesStatus(payload).subscribe(res => {
      this.service.showMessage({
        message: "Vacancy status changed successfully"
      });
      this.getAllActiveVacancies();
      this.getAllArchivedVacancies();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  deleteVacancy() {
    const payload = {
      _ids: [this.job_details?._id]
    }
    this.service.deleteVacancy(payload).subscribe(res => {
      this.service.showMessage({
        message: "Vacancy deleted changed successfully"
      });
      this.getAllActiveVacancies();
      this.getAllArchivedVacancies();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

}
