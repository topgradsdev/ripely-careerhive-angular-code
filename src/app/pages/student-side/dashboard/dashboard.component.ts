import { Component, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { HttpResponseCode } from '../../../shared/enum';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isPlacementTypeSubmitted = false;
  placementTypeData = null;
  placements = {
    ongoing: [],
    completed: [],
    pending: []
  }
  quickNotes = "";
  isAddNotes = false;
  isEditNotes = false;
  notesList = [];
  userProfile = null;
  studentVacancyDetail = null;
  studentProfile = null;
  completedPlacementWorkFlow = [];
  onGoingPlacementWorkFlow = [];
  completedTaskCountOfOngoing = 0;
  pendingTaskOfOngoing = [];
  pendingTaskOfPrePlacement = [];
  displayProfileSection = false;
  displayMessage = false;
  displayPlacementTypeSection = false;
  totalWorkingHours = 0;
  completedWorkingHours = 0;
  workingHoursDetail = null;
  terminatedStudentDetail = null;
  is_placement:boolean = false;

  constructor(private service: TopgradserviceService, private router: Router, private ngZone: NgZone) { }

  // ngOnInit(): void {
  //   this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
  //   this.isPlacementTypeSubmitted = false;
  //   if (this.userProfile?.placement_type) {
  //     this.isPlacementTypeSubmitted = true;
  //     this.placementTypeData = this.userProfile?.placement_type;
  //   }
  //   this.getAllNotes();
  //   this.getOngoingStudentVacancyDetail();
  //  this.getStudentProfile();
  //  const displayProfileSection = localStorage.getItem('displayProfileSection');
  //  if(displayProfileSection) {
  //   this.displayProfileSection = JSON.parse(displayProfileSection);
  //  }
  //  const displayPlacementTypeSection = localStorage.getItem('displayPlacementTypeSection');
  //  if(displayPlacementTypeSection) {
  //   this.displayPlacementTypeSection = JSON.parse(displayPlacementTypeSection);
  //  }
  //  this.getWorkingHourForStudent();
  // }

  placementGroupDetails:any = {};
  getPlacementGroupDetails() {
    let payload = { id: this.studentProfile?.placement_id };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      this.placementGroupDetails = response.result;
        this.isPlacementTypeSubmitted = false;
        if (this.placementGroupDetails && this.placementGroupDetails.is_publish) {
          this.displayMessage = true;
          if (this.studentProfile && this.studentProfile?.placement_type) {
            this.isPlacementTypeSubmitted = true;
            this.placementTypeData = this.studentProfile?.placement_type;
            // this.hidePlacementType = true;
          }else{
            this.isPlacementTypeSubmitted = false;
            // this.hidePlacementType = true;
            this.placementTypeData = null;

          }
        }else{
          this.displayMessage = false;
          this.isPlacementTypeSubmitted = true;
          // this.hidePlacementType = true;
        }
    }, (err)=>{
      this.displayMessage = false;
    });
  }


  formatDate(date: Date): string {
    const day = date.getDate();
    const suffix = this.getOrdinalSuffix(day);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate.replace(/\d+/, `${day}${suffix}`);
  }
  getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // 4th to 20th always get 'th'
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  // @HostListener('window:load', ['$event'])
  //   onWindowLoad(event: Event) {
  //     console.log('✅ Window fully loaded:', event);
      
  //     // Run inside Angular zone for stability
  //     this.ngZone.runOutsideAngular(() => {
  //       setTimeout(() => {
  //         this.ngZone.run(() => {
  //           this.afterWindowLoaded();
  //         });
  //       }, 500); // slight delay ensures DOM + Angular init complete
  //     });
  //   }


  //   private isPageRefresh(): boolean {
  //   const flag = sessionStorage.getItem('isRefresh');
  //   if (flag) {
  //     // remove flag after one use
  //     sessionStorage.removeItem('isRefresh');
  //     return true; // Fresh login or navigation, skip auto logout
  //   }

  //   // Detect actual browser reload
  //   const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  //   const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
  //   return isReload;
  // }

  //     private afterWindowLoaded() {
  //       if (this.isPageRefresh()) {
  //         console.log('🔁 Page refresh detected — skipping logout');
  //         return;
  //       }
    
  //       const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
  //       if (!user?._id) {
  //         console.log('⚠️ No valid user found in localStorage.');
  //         return;
  //       }
    
  //       console.log("👤 User detected:", user);
    
      
  //         const body = {
  //         student_id: user._id,
  //         type: 'student'
  //       };
  //         const apiUrl = `${environment.SERVER_URL}auth/auto-logout`; // adjust the endpoint path
  //         this.http.post(apiUrl, body).subscribe({
  //           next: (res: any) => {
  //             console.log("✅ Auto logout response:", res);
  //             if (res.result === 'success') {
  //               this.sessionSync.tabclose(user._id);
  //               // sessionStorage.setItem('isRefresh', 'true'); 
  //               this.sessionSync.logoutStudent(user._id);
  //               localStorage.clear();
  //               sessionStorage.clear();
  //               this.router.navigate(['/student-login']);
  //             }
  //           },
  //           error: (err) => {
  //             console.error("❌ Auto logout API failed:", err);
  //           }
  //         });
    
    
  //       console.log('🏁 Finished after window load logic');
  //     }



  today = this.formatDate(new Date());
  ngOnInit(): void {

    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
   
    if(this.userProfile?.change_password){
      this.router.navigate(['student/change-password']);
    }
    this.isPlacementTypeSubmitted = true; //138
   
    this.getAllNotes();
    this.checkPlacementExist();
    this.getInterviewList(this.invitePage);
    this.getCompletedList(this.completedPage)
    this.getUpcomingList(this.upcomingPage);
    this.getOngoingStudentVacancyDetail();
    this.getStudentProfile();
    this.employerPlacementGroupDetail();
    const displayProfileSection = localStorage.getItem('displayProfileSection');
    if(displayProfileSection) {
      this.displayProfileSection = JSON.parse(displayProfileSection);
    }
    const displayPlacementTypeSection = localStorage.getItem('displayPlacementTypeSection');
    if(displayPlacementTypeSection) {
      this.displayPlacementTypeSection = JSON.parse(displayPlacementTypeSection);
    }
    this.getWorkingHourForStudent();
  }
  pendingTaskOfCompleted:any = [];

  getWorkFlowTask(stage) {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      stage: stage,
      student_id: this.userProfile?._id,
      workflow_type_id: this.userProfile?.placement_type?.placement_type_id
    }
    this.service.getWorkFlowTaskNew(payload).subscribe((response: any) => {

      console.log("response", response);
//Ongoing
      this.onGoingPlacementWorkFlow = response.result  && response.result.Ongoing ? response.result.Ongoing : [];
        this.completedTaskCountOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'completed')?.length;
        this.pendingTaskOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'lock' || task.task_status === 'pending');
//Pre-Placement
      const result = response.result && response.result.PrePlacement ? response.result.PrePlacement : [];
      this.pendingTaskOfPrePlacement = result.filter(task => task.task_status === 'lock' || task.task_status === 'pending');
      console.log("this.pendingTaskOfPrePlacement", this.pendingTaskOfPrePlacement)

// Completed
      this.completedPlacementWorkFlow = response.result && response.result.Completed ? response.result.Completed : [];
      this.pendingTaskOfCompleted = this.completedPlacementWorkFlow.filter(task => task.task_status === 'lock' || task.task_status === 'pending');
      // if (stage === 'Ongoing') {
        
      // } else if (stage === 'Pre-Placement') {
        
      // } else {
       
      // }
    });
  }

  taskStatus(status) {
    const taskStatus = {
      lock: "Locked",
      pending: "In Progress",
      completed: "Completed"
    }
    return taskStatus[status];
  }

  async getStudentProfile() {
    this.service.getStudentProfile({}).subscribe(async (res: any) => {
      res.record.student_id = res.record?._id;
      // if (res.record?.placement_type_id && res.record?.placementType) {
        res.placement_type = res.placement_type ? res.placement_type : {};
        // res.placement_type.placement_type_id = res.record?.placement_type_id;
       

        if (typeof res.placement_type === 'string') {
            res.placement_type = {
              name: res.placement_type,
              placementType:res.record?.placementType,
              placement_type_id: res.record?.placement_type_id,
            };
          } else if (typeof res.placement_type === 'object') {
            res.placement_type.placement_type_id = res.record?.placement_type_id;
            res.placement_type.placementType = res.record?.placementType;
          }

        if(res.record && !res.record.student_profile){
          this.router.navigate(['student/onboarding']);
        }
        // if (this.userProfile.placement_type) {
        if (!this.userProfile['placement_type']) {
          this.userProfile['placement_type'] = {}; // initialize as empty object
        }

        this.userProfile['placement_type']['placement_type_id'] = res.record?.placement_type_id;
        this.userProfile['placement_type']['placementType'] = res.record?.placement_type;

        // optional: keep these if needed at the root
        this.userProfile['placement_type_id'] = res.record?.placement_type_id;
        this.userProfile['placementType'] = res.record?.placement_type;
        // }
        if(res.record?.placement_id){
          this.userProfile.placement_id = res.record?.placement_id
        }

        const response = await this.getCompanyAllocation();
        this.userProfile.company_allocation = [];
        if (response?.result) {
          this.userProfile.company_allocation.push(response?.result);
        }

        setTimeout(() => {
          localStorage.setItem('student-l', "true");
          if(!localStorage.getItem('student-l')){
             localStorage.setItem('userSDetail', JSON.stringify(this.userProfile));
          }
        }, 1000);
   
      // }
      this.studentProfile = { ...res?.record, ...res?.placement_type, ...res?.placement_group_info};
      await this.getPlacementGroupDetails();
      await this.getWorkFlowTask('Pre-Placement');
      // await this.getWorkFlowTask('Ongoing');
      // await this.getWorkFlowTask('Completed');
      
      if (this.studentProfile?.is_terminated) {
        this.getTerminatedComment()
      }
    });
  }

  tabType:boolean = false;
  onTabChange(event: MatTabChangeEvent) {

    this.getStudentProfile();
    console.log("event", event, event.index);
    if(event.index===1){
      this.tabType = true;
      this.employerPlacementGroupDetail();
      return false;
      // this.getProjectWorkFlowTask(this.employerStudentData[event.index].placement_id, this.employerStudentData[event.index].placement_type_id);
    }else{
      this.tabType = false;
      this.getOngoingStudentVacancyDetail();
      this.getWorkFlowTask('Pre-Placement');
    }
    // if (event.index === 0) {  // Ongoing tab index (first tab = 0)

    // }
  }
  onGoingProjectPlacementWorkFlow:any = [];
  completedProjectTaskCountOfOngoing:any = [];
  pendingProjectTaskOfOngoing:any = [];
   pendingProjectTaskOfPrePlacement:any = [];
    completedProjectPlacementWorkFlow:any = [];

  getProjectWorkFlowTask(placement_id, placement_type_id) {
    console.log("placement_id, placement_type_id", placement_id, placement_type_id)
    const payload = {
      placement_id: placement_id,
      stage: "Pre-Placement",
      student_id: this.userProfile?._id,
      workflow_type_id: placement_type_id
    }
    this.service.getProjectWorkFlowTaskNew(payload).subscribe((response: any) => {

      console.log("response", response);
//Ongoing
      this.onGoingProjectPlacementWorkFlow = response.result  && response.result.Ongoing ? response.result.Ongoing : [];
        this.completedProjectTaskCountOfOngoing = this.onGoingProjectPlacementWorkFlow.filter(task => task.task_status === 'completed')?.length;
        this.pendingProjectTaskOfOngoing = this.onGoingProjectPlacementWorkFlow.filter(task => task.task_status === 'lock' || task.task_status === 'pending');


//Pre-Placement
      const result = response.result && response.result.PrePlacement ? response.result.PrePlacement : [];
      this.pendingProjectTaskOfPrePlacement = result.filter(task => task.task_status === 'lock' || task.task_status === 'pending');
      console.log("this.pendingTaskOfPrePlacement", this.pendingProjectTaskOfPrePlacement)

// Completed
      this.completedProjectPlacementWorkFlow = response.result && response.result.Completed ? response.result.Completed : [];
      this.pendingTaskOfCompleted = this.completedProjectPlacementWorkFlow.filter(task => task.task_status === 'lock' || task.task_status === 'pending');


      console.log("pendingTaskOfOngoing", this.pendingTaskOfOngoing, "pendingTaskOfPrePlacement", this.pendingProjectTaskOfPrePlacement, "pendingTaskOfCompleted", this.pendingTaskOfCompleted)
    });
  }

  goToDetailProject(data) {
    console.log("this.", this.stage)
    this.router.navigate(['/student/my-project/details'], {queryParams: {placement_id: data?.placement_id, student_id: data?.student_id, vacancy_id: data?.vacancy_id, id:data._id, type:'ongoing'}})
  }

  selectedTabIndex = 0;

  selectTab(event) {
    this.selectedTabIndex = event.index;
    console.log("this.employerStudentData[event.index]", this.employerStudentData[event.index]);
    this.getProjectWorkFlowTask(this.employerStudentData[event.index].placement_id, this.employerStudentData[event.index].placement_type_id);
  }

  stage:any = 'Pre-Placement';
  employerStudentData:any = [];
  employerStudentDataTab:any = [];
  employerPlacementGroupDetail() {
    const payload = {
      student_id: this.userProfile?._id,
      stage:'this.stage',
      "type":"project"
    }
    this.service.getProjectEmployerStudent(payload).subscribe(response => {
      if(response.status==200){
        this.employerStudentData = response.result ? response.result : [];

        this.employerStudentDataTab = this.employerStudentData.filter(el=>el.placement_type_id);
        console.log(" this.employerStudentDataTab",  this.employerStudentDataTab);

        if(this.employerStudentDataTab.length>0){
          this.getProjectWorkFlowTask(this.employerStudentDataTab[0].placement_id, this.employerStudentDataTab[0].placement_type_id);
        }
       
      }else{
        this.employerStudentData = [];
      }
    });
  }

  async getCompanyAllocation() {
    const payload = {
      student_id: this.userProfile?._id
    }
    return this.service.getCompanyAllocationForStudent(payload).toPromise();
  }

  getTerminatedComment() {
    const payload = {
      student_id: this.studentProfile?.student_id
    };
    this.service.getTerminateStudentDetail(payload).subscribe((response: any) => {
      this.terminatedStudentDetail = response?.result;
    });
  }

  studentVacancylength:any = 0;
  studentVacancyArray :any = [];
  getOngoingStudentVacancyDetail() {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id,
      workflow_type_id: this.userProfile?.placement_type?.placement_type_id
    };
    this.service.getOngoingStudentVacancyDetail(payload).subscribe((response: any) => {
      console.log("responseresponse", response);
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentVacancylength = response?.result ? response?.result.length : 0;
        console.log("this.studentVacancylength", this.studentVacancylength);
        this.studentVacancyArray =  response?.result ? response?.result : [];
        this.studentVacancyDetail = response?.result ? response?.result[0] : null;
      }else{
        this.studentVacancylength = 0;
        this.studentVacancyArray = [];
        this.studentVacancyDetail = null
      }
      
    }, err => {
      this.studentVacancylength = 0;
      this.studentVacancyArray = [];
      this.studentVacancyDetail = null
      // this.service.showMessage({
      //   message: err.msg ? err.msg : 'Something went Wrong'
      // });
    });
  }

  getAllNotes() {
    const payload = {

    }
    this.service.getStudentNotes(payload).subscribe((res: any) => {  
      this.notesList = res.data;  
      this.notesList.forEach(note => {
        note.isEdit = false;
      });
    });
  }


  checkPlacementExist() {
    const payload = {
      student_id:this.userProfile._id
    }
    this.service.checkPlacmentExist(payload).subscribe((res: any) => {  
     if(res.status ==200){
      this.is_placement = false;
     }else if(res.status == 204){
       this.is_placement = true;
     }
    });
  }

  addNotes() {
    this.isAddNotes = true;
    this.notesList.forEach(note => {
      note.isEdit = false;
    });
  }

  createNotes() {
    const payload = {
      description: this.quickNotes
    }
    this.service.createStudentNotes(payload).subscribe((res: any) => {  
      this.isAddNotes = false;
      this.quickNotes = "";  
      this.getAllNotes();   
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  updateNotes(note) {
    const payload = {
      description: note.description,
      _id: note._id
    }
    this.service.updateStudentNotes(payload).subscribe((res: any) => { 
      this.getAllNotes();   
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  deleteNotes(note) {
    const payload = {
      _ids: [note._id]
    }
    this.service.deleteStudentNotes(payload).subscribe((res: any) => {  
      this.isAddNotes = false;
      this.quickNotes = "";
      this.getAllNotes();     
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  cancelUpdateNotes(note) {
    this.getAllNotes();
  }

  goToMyPlacementTab(stage) {
    this.router.navigate(['/student/my-placements'], {queryParams: {stage}});
  }

  goToMyProjectTab(stage, data) {
    console.log(" data",  data);
    this.router.navigate(['/student/my-project/details'], {queryParams: {placement_id: data?.placement_id, student_id: data?.student_id, vacancy_id: data?.vacancy_id, id:data.project_id, type:'ongoing'}})
    // this.router.navigate(['/student/my-project'], {queryParams: {stage}});
  }

  closePlacementTypeSection() {
    this.displayPlacementTypeSection = false;
    localStorage.setItem('displayPlacementTypeSection', JSON.stringify(false));
  }

  closeProfileSection() {
    this.displayProfileSection = false;
    localStorage.setItem('displayProfileSection', JSON.stringify(false));
  }

  closeDisplayMessage() {
    this.displayMessage = false;
    console.log(this.userProfile);
    // localStorage.setItem('displayMessage', JSON.stringify(false));
    const payload = {
      placement_description_remove:true,
      _id:this.userProfile._id
    }
    this.service.updateStudentFlag(payload).subscribe((res: any) => {  
      this.getStudentProfile();
    });
  }

  getWorkingHourForStudent() {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id
    }
    this.service.getWorkingHourForStudent(payload).subscribe((response: any) => {
      this.workingHoursDetail = response.result ? response?.result : [];
      this.totalWorkingHours = response?.result?.total_working_hours ? response?.result?.total_working_hours : 0;
      this.workingHoursDetail.map(workingHour => parseInt(workingHour.working_hours));
      this.workingHoursDetail.forEach(workingHour => {
        this.completedWorkingHours = this.completedWorkingHours + parseInt(workingHour.working_hours);        
      });
    });
  }

  deleteTerminatedComment() {
    const payload = {
      student_id: this.studentProfile?.student_id
    }
    this.service.deleteTerminatedStudentComment(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.getTerminatedComment();
      } else {
        this.service.showMessage({
          message: res.msg
        });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
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

  
parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') {
    // console.error('Invalid date string:', dateStr);
    return null;
  }

  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    // console.error('Date string format should be DD/MM/YYYY:', dateStr);
    return null;
  }

  const [day, month, year] = parts.map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    // console.error('Invalid numeric values in date string:', dateStr);
    return null;
  }

  return new Date(year, month - 1, day); // JS months are 0-indexed
}

 getInternshipDuration(start: string, end: string): string {
  if(start && end){
    const startDate = this.parseDate(start);
      const endDate = this.parseDate(end);

      if (!startDate || !endDate) {
        console.error('Invalid start or end date:', { start, end });
        return 'Invalid date(s)';
      }

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const weeks = Math.floor(totalDays / 7);
      const days = totalDays % 7;

      const weekStr = weeks === 0 ? '' : `${weeks} week${weeks === 1 ? '' : 's'}`;
      const dayStr = days === 0 ? '' : `${days} day${days === 1 ? '' : 's'}`;

      if (!weekStr && !dayStr) return 'No duration';
      if (weekStr && dayStr) return `${weekStr} and ${dayStr}`;
      return weekStr || dayStr;
    }else{
      return '';
    }
  }


  inviteColumns: string[] = [
    'company_name',
    'vacancy',
    'vacancy_location',
    'arrangement',
    'interview',
    'actions'
  ]
  upcomingColumns: string[] = [
    'company_name',
    'vacancy',
    'vacancy_location',
    'interview',
    'interview_date',
    'interview_time',
    'actions'
  ]
  completeColumns: string[] = [
    'company_name',
    'vacancy',
    'vacancy_location',
    'interview',
    'interview_date',
    'interview_time',
  ]

  // paginationObj = {
  //   length: 0,
  //   pageIndex: 0,
  //   pageSize: 10,
  //   previousPageIndex: 0,
  //   changed:false
  // }

  onInterviewTabChange(event: MatTabChangeEvent){
    console.log("event", event);
    if(event.index==0){
      this.getInterviewList(this.invitePage);
    }else  if(event.index==1){
      this.getUpcomingList(this.upcomingPage);
    }else  if(event.index==2){
      this.getCompletedList(this.completedPage);
    }

  //    this.paginationObj = {
  //     length: 0,
  //     pageIndex: 0,
  //     pageSize: 10,
  //     previousPageIndex: 0,
  //     changed:true
  //   }
  }

  // async getPaginationData(event) {
  //   this.paginationObj = event;
  //   this.getInterviewList();
  // }
  // inviteList:any = [];
  // completedList:any = [];

  invitePage: number = 0;
  inviteLimit: number = 5;
  totalInvitePages: number = 0;
  totalInviteList: number = 0;
  inviteList: any[] = [];
getInterviewList(page: number = 0) {
  this.invitePage = page;

  let payload = {
    limit: this.inviteLimit,
    offset: this.invitePage * this.inviteLimit,   // ✅ important for paging
    student_id: this.userProfile._id,
    interview_status: "invite_sent" // "invite_sent" / "upcoming" / "completed"
  };

  this.service.getInterviewList(payload).subscribe(
    res => {
      if (res.status === 200) {
        this.totalInviteList = res.total;  // assuming API returns `total`
        this.totalInvitePages = Math.ceil(this.totalInviteList / this.inviteLimit);
        this.inviteList = res.result;
      } else {
        this.inviteList = [];
        this.service.showMessage({
          message: res.msg ? res.msg : 'Something went Wrong'
        });
      }
    },
    err => {
      this.inviteList = [];
      this.service.showMessage({
        message: err.error.errors?.msg || 'Something went Wrong'
      });
    }
  );
}

// === Display counters ===
get startInviteIndex(): number {
  if (this.totalInviteList === 0) return 0;
  return (this.invitePage * this.inviteLimit) + 1;
}

get endInviteIndex(): number {
  if (this.totalInviteList === 0) return 0;
  return Math.min(
    (this.invitePage + 1) * this.inviteLimit,
    this.totalInviteList
  );
}

// === Page navigation ===
onNextInvitePage() {
  if (this.invitePage < this.totalInvitePages - 1) {
    this.getInterviewList(this.invitePage + 1);
  }
}

onPrevInvitePage() {
  if (this.invitePage > 0) {
    this.getInterviewList(this.invitePage - 1);
  }
}

upcomingPage: number = 0;
upcomingLimit: number = 5;
totalUpcomingPages: number = 0;
totalUpcomingList: number = 0;
upcomingList: any[] = [];

// Fetch list with pagination
getUpcomingList(page: number = 0) {
  this.upcomingPage = page;

  let payload = {
    limit: this.upcomingLimit,
    offset: this.upcomingPage * this.upcomingLimit, // ✅ correct offset
    student_id: this.userProfile._id,
    interview_status: "upcoming"
  };

  this.service.getInterviewList(payload).subscribe(
    res => {
      if (res.status === 200) {
        this.totalUpcomingList = res.total;   // API should return total count
        this.totalUpcomingPages = Math.ceil(this.totalUpcomingList / this.upcomingLimit);
        this.upcomingList = res.result;
      } else {
        this.upcomingList = [];
        this.service.showMessage({
          message: res.msg ? res.msg : 'Something went Wrong'
        });
      }
    },
    err => {
      this.upcomingList = [];
      this.service.showMessage({
        message: err.error.errors?.msg || 'Something went Wrong'
      });
    }
  );
}

// === Display counters ===
get startUpcomingIndex(): number {
  if (this.totalUpcomingList === 0) return 0;
  return (this.upcomingPage * this.upcomingLimit) + 1;
}

get endUpcomingIndex(): number {
  if (this.totalUpcomingList === 0) return 0;
  return Math.min(
    (this.upcomingPage + 1) * this.upcomingLimit,
    this.totalUpcomingList
  );
}

// === Page navigation ===
onNextUpcomingPage() {
  if (this.upcomingPage < this.totalUpcomingPages - 1) {
    this.getUpcomingList(this.upcomingPage + 1);
  }
}

onPrevUpcomingPage() {
  if (this.upcomingPage > 0) {
    this.getUpcomingList(this.upcomingPage - 1);
  }
}


completedPage: number = 0;
completedLimit: number = 5;
totalCompletedPages: number = 0;
totalCompletedList: number = 0;
completedList: any[] = [];

// Fetch list with pagination
getCompletedList(page: number = 0) {
  this.completedPage = page;

  let payload = {
    limit: this.completedLimit,
    offset: this.completedPage * this.completedLimit, // ✅ correct offset
    student_id: this.userProfile._id,
    interview_status: "completed"
  };

  this.service.getInterviewList(payload).subscribe(
    res => {
      if (res.status === 200) {
        this.totalCompletedList = res.total;   // assuming API returns total
        this.totalCompletedPages = Math.ceil(this.totalCompletedList / this.completedLimit);
        this.completedList = res.result;
      } else {
        this.completedList = [];
        this.service.showMessage({
          message: res.msg ? res.msg : 'Something went Wrong'
        });
      }
    },
    err => {
      this.completedList = [];
      this.service.showMessage({
        message: err.error.errors?.msg || 'Something went Wrong'
      });
    }
  );
}

// === Display counters ===
get startCompletedIndex(): number {
  if (this.totalCompletedList === 0) return 0;
  return (this.completedPage * this.completedLimit) + 1;
}

get endCompletedIndex(): number {
  if (this.totalCompletedList === 0) return 0;
  return Math.min(
    (this.completedPage + 1) * this.completedLimit,
    this.totalCompletedList
  );
}

// === Page navigation ===
onNextCompletedPage() {
  if (this.completedPage < this.totalCompletedPages - 1) {
    this.getCompletedList(this.completedPage + 1);
  }
}

onPrevCompletedPage() {
  if (this.completedPage > 0) {
    this.getCompletedList(this.completedPage - 1);
  }
}

@ViewChild('previewInterview') public previewInterview: ModalDirective;
selectedInterview:any = {};

goToCompanyProfile(data){
  this.selectedInterview = data;
  console.log("this.selectedInterview", this.selectedInterview);
  this.previewInterview.show(); 
}

copied = false;
tooltipText = 'Copy link';

copyMeetingLink(link: string) {
  if (!link) return;

  navigator.clipboard.writeText(link).then(() => {
    this.copied = true;
    this.tooltipText = 'Copied to clipboard';
    setTimeout(() => {
      this.copied = false;
      this.tooltipText = 'Copy link';
    }, 2000);
  });
}


  async closeToogle(item){
    if (item.toggle) {
      item.toggle = false;
      return;
    }

    // Close all others
    this.pendingProjectTaskOfPrePlacement.forEach(workflow => {
      workflow.toggle = false;
    });
    this.pendingProjectTaskOfOngoing.forEach(workflow => {
      workflow.toggle = false;
    });
    this.pendingTaskOfCompleted.forEach(workflow => {
      workflow.toggle = false;
    });

    // Open the clicked item
    item.toggle = true;
    this.getProjectWorkFlowTask(item.placement_id, item.placement_type_id);
  }


}
