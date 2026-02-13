import { Component, Input, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { Router } from '@angular/router';
import moment from 'moment';
// import { Label } from 'ng2-charts';
import { HttpResponseCode } from '../../../../shared/enum';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { FileIconService } from '../../../../shared/file-icon.service';

@Component({
  selector: 'app-download-tab-project',
  templateUrl: './download-tab-project.component.html',
  styleUrls: ['./download-tab-project.component.scss']
})
export class DownloadTabProjectComponent implements OnInit {

  showDetails: boolean;
  showCollapes: any = '';
  currentTaskTab: any = 'task_progress';
  @Input() studentProfile: any;
  userProfile = null;
  studentVacancyDetail = null;
  completedPlacementWorkFlow = [];
  private httpWithoutInterceptor: HttpClient;
  constructor(private service: TopgradserviceService, private router: Router,  private http: HttpClient, private httpBackend: HttpBackend, private fileIconService: FileIconService) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }
 
  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }
  ngOnInit(): void {
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.userProfile.placement_id = this.studentProfile.placement_id;
    this.userProfile.placement_type = this.studentProfile.placement_type;
    this.userProfile.company_allocation = this.studentProfile.company_allocation;
    this.getPlacementProjectDetail();
  }

  projectDetails:any = {};
  selectedCompany:any = {};
  getPlacementProjectDetail(){
    let payload = { placement_id: this.studentProfile.placement_id };
    this.service
      .getPlacementGroupProjectDetails(payload)
      .subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.projectDetails = response.data[0];
          this.selectedCompany = response.data[0].company_info[0];

          console.log("this.projectDetailsthis.projectDetails", this.projectDetails)
        }else{
          // this.projectDetails = {};
          // this.selectedCompany ={}
        }
      });
  }
  viewFile(index, data) {
    console.log("data", data)
    if (data.url) {
      // Open the file URL in a new tab
      window.open(data.url, '_blank');
    } else {
      console.error('File URL is not available.');
    }
  }

  downloadFile(index, file) {
    console.log("encodeURI(file.url.trim())", encodeURI(file.url.trim()))
    // window.open(file.url, '_blank');
    this.httpWithoutInterceptor.get(encodeURI(file.url.trim()), { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  } 

}
