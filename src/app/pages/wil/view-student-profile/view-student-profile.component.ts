import { Component, OnInit,ViewChild, ChangeDetectorRef } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpResponseCode } from '../../../shared/enum';
import { SessionSyncService } from 'src/app/session-sync.service';
import { IdleTimeoutService } from 'src/app/idle-timeout.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-view-student-profile',
  templateUrl: './view-student-profile.component.html',
  styleUrls: ['./view-student-profile.component.scss']
})
export class ViewStudentProfileComponent implements OnInit {
  @ViewChild('removeFlagModel') removeFlagModel: ModalDirective;
  @ViewChild('alertLogin') alertLogin: ModalDirective;
  @ViewChild('impersonateModel') impersonateModel: ModalDirective;
  @ViewChild('closeAddFlagModal') closeAddFlagModal;
  @ViewChild('closeremoveFlagModal') closeremoveFlagModal;

  
  studentProfile = null;
  aboutForm: FormGroup;
  isEdit: boolean = false;
  selectedRecords: any
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
     { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
  ];
  completedPlacementWorkFlow = [];
  onGoingPlacementWorkFlow = [];
  completedTaskCountOfOngoing = 0;
  pendingTaskOfOngoing = [];
  pendingTaskOfPrePlacement = [];
  studentId:any = "";
  loadedTabs: Set<string> = new Set(['details']);
  activeTab: string = 'details'; 
  constructor(private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private location: Location, private fb: FormBuilder, private cdr: ChangeDetectorRef, private router:Router, private sessionSync: SessionSyncService, private idleService: IdleTimeoutService) { }

  ngOnInit(): void {
    this.formValidation();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.studentId  = params.id;
        this.getStudentProfileById(params.id);
      }
    });
  }

  onSliderChange(event: any) {
    console.log("event", event);
    this.travelPreference = event;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Mark the tab as loaded
    if (!this.loadedTabs.has(tab)) {
      this.loadedTabs.add(tab);

      // Simulate data loading for specific tabs
      this.loadOngoingPlacementData();
    }

    // Trigger UI update
    this.cdr.detectChanges();
  }

  loadOngoingPlacementData(): void {
    // Simulate an API call for ongoing placement data
    setTimeout(() => {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.id) {
          this.studentId  = params.id;
          this.getStudentProfileById(params.id);
        }
      });
      // Explicitly trigger change detection
      this.cdr.detectChanges();
    }, 1000); // Simulated delay
  }

  today: any = new Date();

  formValidation() {
    this.aboutForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      middle_name: [''],
      preferred_name: [''],
      pronouns:[''],
      student_code: ['', Validators.required],
      address_line_01: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      available_days: ["",],
      travel_preference: [40],
      availableDays: [''],
      image: [, Validators.nullValidator],
    });
  }
  // getWorkFlowTask(stage) {
  //   const payload = {
  //     placement_id: this.studentProfile?.placement_id,
  //     stage: stage,
  //     student_id: this.studentProfile?.student_id,
  //     workflow_type_id: this.studentProfile?.placement_type?.placement_type_id
  //   }
  //   this.service.getWorkFlowTask(payload).subscribe((response: any) => {
  //     if (stage === 'Ongoing') {
  //       this.onGoingPlacementWorkFlow = response.result ? response.result : [];
  //     } else if (stage === 'Pre-Placement') {
  //       this.pendingTaskOfPrePlacement = response.result ? response.result : [];;
  //     } else {
  //       this.completedPlacementWorkFlow = response.result ? response.result : [];
  //     }
  //   });
  // }

  travelPreference: any = 0;

  formatDob(dob: string): string {
    if (!dob) return '';
    const [day, month, year] = dob.split('/');
    console.log("`${month}/${day}/${year}`", `${month}/${day}/${year}`)
    return `${month}/${day}/${year}`;
  }

  private parseDob(dob: any): Date | '' {
  if (!dob) {
    return '';
  }

  const rawDate = new Date(dob);

  // If raw date is valid, return it
  if (!isNaN(rawDate.getTime())) {
    return rawDate;
  }

  // Try formatting if invalid
  const formatted = this.formatDob(dob);
  const formattedDate = new Date(formatted);

  return !isNaN(formattedDate.getTime()) ? formattedDate : '';
}


  getStudentProfileById(id) {
    this.service.getStudentProfileById({ _id: id }).subscribe((res: any) => {
      let student_code = res.record.student_id;
      res.record.student_id = res.record?._id;
      this.studentProfile = { ...res?.record, ...res?.placement_type, ...res?.placement_group_info };
      // this.travelPreference = 0;
      console.log("  this.studentProfile", this.studentProfile)
      this.aboutForm.patchValue({
        first_name: this.studentProfile && this.studentProfile.first_name ? this.studentProfile.first_name : '',
        last_name: this.studentProfile && this.studentProfile.last_name ? this.studentProfile.last_name : '',
        student_code: student_code ? student_code : '',
        address_line_01: this.studentProfile && this.studentProfile.address_line_01 ? this.studentProfile.address_line_01 : '',
        date_of_birth: this.parseDob(this.studentProfile?.date_of_birth),
        travel_preference: this.studentProfile && this.studentProfile.travel_preference ? this.studentProfile.travel_preference : '',
        availableDays: this.studentProfile && this.studentProfile.availableDays ? this.studentProfile.availableDays : '',
        middle_name:this.studentProfile && this.studentProfile.middle_name ? this.studentProfile.middle_name : '',
      preferred_name: this.studentProfile && this.studentProfile.preferred_name ? this.studentProfile.preferred_name : '',
      pronouns: this.studentProfile && this.studentProfile.pronouns ? this.studentProfile.pronouns : '',
      })
      this.travelPreference = this.studentProfile && this.studentProfile.travel_preference && this.studentProfile.travel_preference!='undefined' ? Number(this.studentProfile.travel_preference) : 0;
      // itemHeight

      this.onSliderChange(this.travelPreference);
      this.imageUrl = this.studentProfile.image && this.studentProfile.image.url ? this.studentProfile.image.url : this.studentProfile.image?this.studentProfile.image:'';
      if(res.record?.available_days){
        this.days.forEach(day => {
          const found = res.record?.available_days?.split(',').find(days => days === day.name);
          if (found) {
            day.selected = true;
          }
        });
      }
   

      // this.getWorkFlowTask('Pre-Placement');
      // this.getWorkFlowTask('Ongoing');
      // this.getWorkFlowTask('Completed');
    });
  }

 goBack() {
  console.log("back", window.history)
  const impersonate = localStorage.getItem('impersonate');
  const check = sessionStorage.getItem('r_url');

  // 1️⃣ If redirected from report page
  if (check === 'report') {
    sessionStorage.removeItem('r_url'); // optional cleanup
    this.router.navigate(['/admin/incident-and-reporting']);
    return;
  }

  // 2️⃣ If in impersonation mode
  if (impersonate === 'true') {
    localStorage.removeItem('impersonate');
    this.router.navigate(['/admin/students/students-list']);
    return;
  }

  // 3️⃣ Otherwise, go back if possible, else fallback to student list
  const navState = window.history.state;
 console.log("back", navState)
  if (navState && navState.navigationId > 1) {
      let navigated = false;

      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd), take(1))
        .subscribe(() => {
          navigated = true;
          console.log('Successfully navigated back!');
        });

      this.location.back();

      setTimeout(() => {
        if (!navigated) {
          console.log('Back navigation failed, redirecting manually');
          this.router.navigate(['/admin/students/students-list']);
        }
      }, 500);
  } else {
     console.log("true")

    this.router.navigate(['/admin/students/students-list']);
  }
}


  fileToUpload: any;
  imageUrl: any = '';
  onFileSelected(file: FileList) {
    // this.form.patchValue({image:file});
    this.fileToUpload = file[0];
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }
  
  setnone(){
    this.aboutForm.patchValue({
      preferred_name:''
    })
  }

  formatDobmonth(dob: string): string {
    if (!dob) return '';
    const [day, month, year] = dob.split('/');
    return `${day}/${month}/${year}`;
  }

  editProfile() {
    // console.log(this.days, " =-= = = = = = = ");
    // return false;
    let body = this.aboutForm.value;

    console.log("body", body);
    body['firstname']= body.first_name;
    body['firstname']= body.first_name;
    body['middlename']= body.middle_name;
    body['preferredname']= body.preferred_name;
    // body['preferredname']= body.preferred_name;
    // pronouns
    if(body.date_of_birth){
       body['date_of_birth']=new Date(body.date_of_birth).toISOString() ;
    }
    body.student_pid = this.studentId?this.studentId:this.studentProfile && this.studentProfile._id ? this.studentProfile._id : 0;
    body.travel_preference = this.travelPreference;
    body.available_days = this.days.filter(el => el.selected).map(e => e.name).toString();

    const formData = new FormData();
    for (var key in body) {
      if (key == "image") {
        if (this.fileToUpload && this.fileToUpload.name) {
          formData.append("image", this.fileToUpload, this.fileToUpload.name);
        }
      } else {
        // if (body[key]) {
        //   formData.append(key, body[key]);
        // }
         formData.append(key, body[key]);
      }
    }
    console.log("formData", formData);
    this.service.updateProfileStudent(formData).subscribe((res: any) => {
      console.log("res", res)
      if (res.code == 200) {
        this.service.showMessage({ message: res.msg });
        this.isEdit = false;
        this.ngOnInit();
      } else {
        this.service.showMessage({ message: res.msg });
      }
    }, err => {
      console.log("hjjhgjhghjgjhghjgjhghjg", err);

      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    });

  }

  userDetail:any;
  flagComment:any = "";
  updateFlagStudent(status){
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    let body = {
      "student_id": this.studentProfile.student_id,
      "is_flagged": status,
      "flag_comment": this.flagComment,
      "flagged_by" :{staff_id: this.userDetail._id, staff_name: this.userDetail.first_name+" "+this.userDetail.last_name}
    }
    this.service.updateflagStudent(body).subscribe((res: any) => {
      console.log("res", res)
      if (res.status == 200) {
        this.service.showMessage({ message: res.msg });
        this.ngOnInit();
        
      } else {
        this.service.showMessage({ message: res.msg });
      }
      if(status){
        this.closeAddFlagModal.ripple.trigger.click();
      }else{
        this.closeremoveFlagModal.ripple.trigger.click();
       }
     
    }, err => {
      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    });


    console.log("body", body);
    // 

  }

  checkFieldPermission(permissions) {
    // if (this.studentProfile?.staff_status !== 'completed') {
      if (permissions?.staff.write && permissions?.staff.read) {
        return 'editable';
      } else if (!permissions?.staff.write && permissions?.staff.read) {
        return 'readOnly';
      } else {
        return 'hidden';
      }
    // }
  }

  // gotoPlacement(data){
  //   console.log("data", data, data.placement_id);
  //   // const navigationExtras = {queryParams: {redirectTo: 'eligible-students'}, state:{type: 'view'}};
  //   this.router.navigate(['admin/wil/placement-groups/'+data.placement_id?data.placement_id:data._id]);
  //   // 
  // }

  // gotoPlacementProject(data, item){
  //   console.log("data", data, item._id);
  //   // const navigationExtras = {queryParams: {redirectTo: 'eligible-students'}, state:{type: 'view'}};
  //   this.router.navigate(['admin/wil/placement-groups/project/'+item._id]);
  //   // 
  // }

 @ViewChild('closemodelPgList') closemodelPgList;
  gotoPlacement(data: any) {
     this.closemodelPgList.ripple.trigger.click();
    console.log("data", data, data.placement_id);
    const placementId = data.placement_id ? data.placement_id : data._id;
    const navigationExtras = {
      queryParams: { redirectTo: 'eligible-students' },
      state: { type: 'view' }
    };
    this.router.navigate(['admin/wil/placement-groups', placementId], navigationExtras);
  }


  gotoPlacementProject(data, item){
     this.closemodelPgList.ripple.trigger.click();
    const navigationExtras = {queryParams: {redirectTo: 'eligible-students'}, state:{type: 'view'}};
    this.router.navigate(['admin/wil/placement-groups/project/'+item._id], navigationExtras);
  }


  displayedStudentPGColumns: string[] = ['code', 'title', 'placement_type', 'category']
  
  selectedStudents:any = {};
    studentPGs:any = [];
      getStudentPG(student) {
        console.log("student", student);
        this.studentPGs = [];
        let payload = {
          student_id: student.student_id
        }
        this.selectedStudents = student;
        this.service.getStudentPGs(payload).subscribe((res: any) => {
          if (res.status == HttpResponseCode.SUCCESS) {
            this.studentPGs = res.result;
          } else {
            this.studentPGs = [];
          }
        })
      }
  

      handleClick() {
         this.impersonateModel.show();
        // if (this.studentProfile.is_login) {
        //   this.alertLogin.show();
        // } else {
        //   this.impersonateModel.show();
        // }
      }

      loginStudent(student){
        console.log("student", student)
          let body = {
            email:student.email,
            type:'student',
            admin_data:this.userDetail || JSON.parse(localStorage.getItem('userDetail'))
          }
         this.service.impersonateLogin(body).subscribe((res: any) => {
          console.log("res", res)
          if (res.token) {
            res.data['is_admin'] = true;
           
            localStorage.setItem('impersonate', "true");
            // this.sessionSync.initializeSocketConnection();
            setTimeout(()=>{
              this.sessionSync.broadcastAdminToStudent(res.data.email);
            }, 500)
            localStorage.setItem("userSDetail", JSON.stringify(res.data));
            localStorage.setItem("token", res.token);
            this.impersonateModel.hide();
            setTimeout(()=>{
              this.idleService.startTracking(student.student_id);
            }, 500)
            this.router.navigate(['student/dashboard']);
          } else {
            this.impersonateModel.hide();
            this.alertLogin.hide();
            console.log("res", res)
          }
        }, (err)=>{
          if(err.error.code){
            this.impersonateModel.hide();
            this.alertLogin.show();
          }
          console.log(err.error, "error")
        })
      }


  closeModalAndNavigate() {
    const modalEl = document.getElementById('viewStudentPG');
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.setAttribute('aria-hidden', 'true');
      modalEl.style.display = 'none';
      modalEl.removeAttribute('inert');
    }

    // Fix focus leak
    const focusTarget = document.querySelector('body') as HTMLElement;
    if (focusTarget) focusTarget.focus();

    // Try going back first, else navigate manually
    // this.safeBackOrRedirect();
  }

   getFormatePronouns(value: string): string {
      if (value) {
        return (
          '(' +
          value
            .split('_')                        // split by underscore
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each part
            .join('/') +                       // join with slash
          ')'
        );
      } else {
        return '';
      }
    }
}
