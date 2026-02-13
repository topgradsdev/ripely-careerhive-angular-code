import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { FileIconService } from '../../../shared/file-icon.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  selectedVacancyId = null;
  vacancyDetail:any = {};
  skillsevent = [];
  private httpWithoutInterceptor: HttpClient;
  constructor(private service: TopgradserviceService,
    private router:Router,
     private activatedRoute: ActivatedRoute, private http: HttpClient, private httpBackend: HttpBackend, private fileIconService: FileIconService) { 
      this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }


  redirectType:any = null
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

  getInitials(name: string | undefined): string {
    if (!name) return '';
  
    const words = name.split(' '); // Split name by spaces
    const firstInitial = words[0]?.charAt(0) || ''; // First letter of first word
    const secondInitial = words.length > 1 ? words[1]?.charAt(0) || '' : ''; // First letter of second word (if exists)
    
    return firstInitial + secondInitial; // Return initials
  }
  
  viewFile(index,data) {
    if (data.url) {
      // Open the file URL in a new tab
      window.open(data.url, '_blank');
    } else {
      console.error('File URL is not available.');
    }
  }

  downloadFile(index,data) {
    console.log("data" , data)
    // window.open(data.url, '_blank');
    this.httpWithoutInterceptor.get(data.url, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = data.name;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  } 
  
  selectedCompany:any = {};
  getVacancyById() {
    const obj = {
      _id: this.selectedVacancyId
    }
    this.service.getVacancyById(obj).subscribe((res: any) => {
      this.selectedCompany = res.create_by[0];
      this.vacancyDetail = res.data[0];
      this.getJobSkills();
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

      navigateToProjectTab() {
      const redirectData = sessionStorage.getItem("redirect");
      
      if (redirectData || this.redirectType) {
        const parsed = JSON.parse(redirectData);
        this.router.navigate(['/admin/wil/view-company-details'], {
          queryParams: {
            company_id: parsed?.company_id ?? this.vacancyDetail?.company_id,
            tab: parsed?.tab ?? this.redirectType
          }
        });
      } else {
        this.router.navigate(['/admin/wil/wil-vacancies-list'], {
          queryParams: { tab: 'project' }
        });
      }
    }

}
