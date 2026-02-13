import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import moment from 'moment';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-employer-placement',
  templateUrl: './employer-placement.component.html',
  styleUrls: ['./employer-placement.component.scss']
})
export class EmployerPlacementComponent implements OnInit {
  employerStudentData = [];
  employerStudentData1 = [];
  userDetail = null;
  searchQuery = "";

  constructor(private service: TopgradserviceService, private router: Router) { }

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.employerPlacementGroupDetail();
    this.employerPlacementGroupDetail1();
  }
  stage:any = 'ongoing';
  employerPlacementGroupDetail() {
    const payload = {
      // placement_id: this.userDetail?.placement_id,
      company_id: this.userDetail?._id,
      contact_person_id: this.userDetail?.contact_person_id,
      stage:this.stage,
      type:"internship"
    }
    this.service.getEmployerStudent(payload).subscribe(response => {
      if(this.stage=='ongoing'){
          // this.employerStudentData1 = [];
        this.employerStudentData = response.result ? response.result : [];
      this.employerStudentData.forEach(data => {
        data.days = [
          { name: 'Monday', selected: false },
          { name: 'Tuesday', selected: false },
          { name: 'Wednesday', selected: false },
          { name: 'Thursday', selected: false },
          { name: 'Friday', selected: false },
           { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
        ];
        data.days.forEach(day => { 
          const found = data?.student_info?.available_days?.split(',').find(days => days === day.name);
          if (found) {
            day.selected = true;
          }
        });
      })
      }
      // else{
      //   this.employerStudentData1 = response.result ? response.result : [];
      //   this.employerStudentData1.forEach(data => {
      //     data.days = [
      //       { name: 'Monday', selected: false },
      //       { name: 'Tuesday', selected: false },
      //       { name: 'Wednesday', selected: false },
      //       { name: 'Thursday', selected: false },
      //       { name: 'Friday', selected: false }
      //     ];
      //     data.days.forEach(day => { 
      //       const found = data?.student_info?.available_days?.split(',').find(days => days === day.name);
      //       if (found) {
      //         day.selected = true;
      //       }
      //     });
      //   })
      // }
      
    });
  }

   employerPlacementGroupDetail1() {
    const payload = {
      // placement_id: this.userDetail?.placement_id,
      company_id: this.userDetail?._id,
      contact_person_id: this.userDetail?.contact_person_id,
      stage:'completed',
      type:"internship"
    }
    this.service.getEmployerStudent(payload).subscribe(response => {
      // if(this.stage=='ongoing'){
      //   this.employerStudentData = response.result ? response.result : [];
      // this.employerStudentData.forEach(data => {
      //   data.days = [
      //     { name: 'Monday', selected: false },
      //     { name: 'Tuesday', selected: false },
      //     { name: 'Wednesday', selected: false },
      //     { name: 'Thursday', selected: false },
      //     { name: 'Friday', selected: false }
      //   ];
      //   data.days.forEach(day => { 
      //     const found = data?.student_info?.available_days?.split(',').find(days => days === day.name);
      //     if (found) {
      //       day.selected = true;
      //     }
      //   });
      // })
      // }else{
      // this.employerStudentData = [];
        this.employerStudentData1 = response.result ? response.result : [];
        this.employerStudentData1.forEach(data => {
          data.days = [
            { name: 'Monday', selected: false },
            { name: 'Tuesday', selected: false },
            { name: 'Wednesday', selected: false },
            { name: 'Thursday', selected: false },
            { name: 'Friday', selected: false },
            { name: 'Saturday', selected: false },
            { name: 'Sunday', selected: false }
          ];
          data.days.forEach(day => { 
            const found = data?.student_info?.available_days?.split(',').find(days => days === day.name);
            if (found) {
              day.selected = true;
            }
          });
        })
      // }
      
    });
  }

  goToDetail(data) {
    this.router.navigate(['/employer/placements/details'], {queryParams: {placement_id: data?.placement_id, student_id: data?.student_id, vacancy_id: data?.vacancy_id, type:this.stage}})
  }
}
