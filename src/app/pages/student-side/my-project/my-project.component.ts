import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import moment from 'moment';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-my-project',
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.scss']
})
export class MyProjectComponent implements OnInit {
  employerStudentData = [];
  employerStudentData1 = [];
  userDetail = null;
  searchQuery = "";

  constructor(private service: TopgradserviceService, private router: Router) { }

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userSDetail"));
    this.employerPlacementGroupDetail();
    this.employerPlacementGroupDetail1();
  }
  stage:any = 'ongoing';
  employerPlacementGroupDetail() {
    const payload = {
      // placement_id: this.userDetail?.placement_id,
      student_id: this.userDetail?._id,
      stage:"ongoing",
      "type":"project"
    }
    this.service.getProjectEmployerStudent(payload).subscribe(response => {
      console.log("response", response);
      if(this.stage=='ongoing'){
        this.employerStudentData = response.result ? response.result : [];
        this.showFullEmails = new Array(this.employerStudentData.length).fill(false);
      }
    });
  }

    employerPlacementGroupDetail1() {
    const payload = {
      // placement_id: this.userDetail?.placement_id,
      student_id: this.userDetail?._id,
      stage:'completed',
      "type":"project"
    }
    this.service.getProjectEmployerStudent(payload).subscribe(response => {
      console.log("response", response);
      if(this.stage=='ongoing'){
        this.employerStudentData1= response.result ? response.result : [];
        this.showFullEmails = new Array(this.employerStudentData1.length).fill(false);
      }
    });
  }

  goToDetail(data) {
    this.router.navigate(['/student/my-project/details'], {queryParams: {placement_id: data?.placement_id, student_id: data?.student_id, vacancy_id: data?.vacancy_id, id:data._id, type:this.stage}})
  }

  showFullEmails: boolean[] = [];
  toggleEmail(index: number) {
    this.showFullEmails[index] = !this.showFullEmails[index];
  }

  maskEmail(email: string): string {
   if(email){
    const [local, domain] = email.split('@');
        if (!local || !domain) return email;
        // const firstChar = local.charAt(0);
        // ${firstChar}
        const masked = '*'.repeat(local.length - 1);
        return `${masked}@${domain}`;
      }else{
        return '';
      }
    
  }
}
