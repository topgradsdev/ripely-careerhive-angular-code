import { Component, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileIconService } from '../../../shared/file-icon.service';
import * as CronofyElements from 'cronofy-elements';
import { MatStepper } from '@angular/material/stepper';
import { HttpResponseCode } from 'src/app/shared/enum';

@Component({
  selector: 'app-employer-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('submithcaafModal') public submithcaafModal: ModalDirective;
  sortBy: string = 'alpha';
  asc = true;
  vacanciesList = [];
  activeList = [];
  archivedList = [];
  job_details: any;
  skills = [];
  skillsevent = [];
  searchQuery = '';
  status = 'Ongoing';
  userProfile = null;
  notesList: any = [];
  displayColumns: string[] = [
    'name',
    'placement',
    'start_date',
    'end_date',
    'action',
  ];

  displayInterviewColumns: string[] = [
    'name',
    'vacancy',
    'interview_date'
  ];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: TopgradserviceService,
    private router: Router,
    private fileIconService: FileIconService
  ) {}
  taskDetail: any;
  getSafeSvg(documentName: string) {
    return this.fileIconService.getFileIcon(documentName);
  }
  today = this.formatDate(new Date());

  formatDate(date: Date): string {
    const day = date.getDate();
    const suffix = this.getOrdinalSuffix(day);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate.replace(/\d+/, `${day}${suffix}`);
  }

  getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // 4th to 20th always get 'th'
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  getFirstLetter(name: string) {
    return name ? name[0] : '';
  }
  ngAfterViewInit() {
    this.onginglists.sort = this.sort;

    // Example initialization of the Agenda Element:
    // CronofyElements.Agenda({
    //     target_id: "cronofy-calendar",
    //     demo: true
    // });

    CronofyElements.AvailabilityRules({
      element_token:
        '5gZYMsXutCu2MpOHOxg4X_eMrJhRE39N-nuTBfFtONE1c0giH-43gx8FZdFMxawDhaczfntrVmBQw1V1B286sA',
      target_id: 'cronofy-calendar',
      availability_rule_id: 'work_hours',
      config: {
        start_time: '08:00',
        end_time: '18:00',
        duration: 60,
      },
      styles: {
        colors: {
          available: 'green',
          unavailable: 'red',
        },
        prefix: 'custom-name',
      },
      tzid: 'Etc/UTC',
    });
  }

  // displayColumn() {
  //   this.displayColumns = this.columns.map(column => column.name);
  // }
  ngOnInit(): void {
    console.log(this.onginglists);
    this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
    if(this.userProfile?.change_password){
      this.router.navigate(['employer/change-password']);
    }
    this.getCompanyDetail();
    this.getlatesthcaafList();
    this.getAllPlacementByType(this.ongingpage, 'Ongoing');
    this.getAllInterviewType(this.interviewpage, 'Upcoming')
    this.getAllRecentVacancies(this.recentVacanciepage);
    this.getEmployerProfile();
    // this.getAllActiveVacancies();
    // this.getAllArchivedVacancies();
    // let obj = {
    //   'job_title': "",
    // }
    // this.service.getJobSkills(obj).subscribe(res => {
    //   this.skills = res.data
    // });
    this.gethcaafList();
  }


  interviewlists: any = new MatTableDataSource<any>();
  interviewpage: any = 0;
  interviewlimit: any = 4;
  totalinterview: any = 0;
  totalinterviewList: any = 0;
  getAllInterviewType(page, status) {
    this.interviewpage = 0;
    this.interviewlimit = 4;
    this.totalinterview = 0;
    this.totalinterviewList = 0;
    this.interviewpage = page;
    this.interviewlimit = 4;
    let body = {
      company_id: this.userProfile._id,
      limit: this.interviewlimit,
      offset: page,
      interview_status: status,
      contact_person_id: this.userProfile?.contact_person_id,
    };

    this.service.InterviewByCompany(body).subscribe(
      (res) => {
        console.log('res', res);
        if (res.status == 200) {
          // this.addnote = false
          if (res.count <= this.interviewlimit) {
            this.interviewlimit = res.count?res.count:res.data.length;
          }

          // let totalPages_pre = (res.count/this.notelimit)
          // this.totalNotes = (search.total % page_size) == 0 ? totalPages_pre : totalPages_pre + 1
          this.totalinterviewList = res.count?res.count:res.data.length;
          this.totalinterview = Math.ceil(res.count / this.interviewlimit);
          console.log(' this.totalNotes', this.totalinterview);
          this.interviewlists = res.data;
        } else {
          this.interviewlists = [];
          // this.totalNoteList =0;
          // this.notelimit =0;
          // this.service.showMessage({ message: res.msg });
        }
      },
      (err) => {
        this.interviewlists = [];
        if (err?.status == 204) {
        } else {
          this.service.showMessage({
            message: err.error.errors.msg
              ? err.error.errors.msg
              : 'Something went Wrong',
          });
        }
      }
    );
  }

  getInterviewStartIndex() {
    return this.interviewpage * this.interviewlimit + 1;
  }

  getInterviewEndIndex() {
    const endIndex =
      this.interviewpage * this.interviewlimit + this.interviewlists.length;
    return endIndex > this.totalinterviewList ? this.totalinterviewList : endIndex;
  }



  employerProfile: any = null;

  getEmployerProfile() {
    const payload = {
      _id: this.userProfile?._id,
    };
    this.service.getEmployerProfile(payload).subscribe((response) => {
      this.employerProfile = response.record;
    });
  }

  // onginglist = new MatTableDataSource([
  //   { first_name: 'John', last_name: 'Doe', display_name: 'John Doe', assigned_to: 'Manager 1' },
  //   { first_name: 'Jane', last_name: 'Smith', display_name: 'Jane Smith', assigned_to: 'Manager 2' }
  // ]);

  onginglists: any = new MatTableDataSource<any>();
  ongingpage: any = 0;
  onginglimit: any = 4;
  totalonging: any = 0;
  totalongingList: any = 0;
  getAllPlacementByType(page, status) {
    this.ongingpage = 0;
    this.onginglimit = 4;
    this.totalonging = 0;
    this.totalongingList = 0;
    this.ongingpage = page;
    this.onginglimit = 4;
    let body = {
      company_id: this.userProfile._id,
      limit: this.onginglimit,
      offset: page,
      status: status,
      contact_person_id: this.userProfile?.contact_person_id,
    };

    this.service.get_placements_of_company(body).subscribe(
      (res) => {
        console.log('res', res);
        if (res.status == 200) {
          // this.addnote = false
          if (res.count <= this.onginglimit) {
            this.onginglimit = res.count;
          }

          // let totalPages_pre = (res.count/this.notelimit)
          // this.totalNotes = (search.total % page_size) == 0 ? totalPages_pre : totalPages_pre + 1
          this.totalongingList = res.count;
          this.totalonging = Math.ceil(res.count / this.onginglimit);
          console.log(' this.totalNotes', this.totalonging);
          this.onginglists = res.result;
        } else {
          this.onginglists = [];
          // this.totalNoteList =0;
          // this.notelimit =0;
          // this.service.showMessage({ message: res.msg });
        }
      },
      (err) => {
        this.onginglists = [];
        if (err?.status == 204) {
        } else {
          this.service.showMessage({
            message: err.error.errors.msg
              ? err.error.errors.msg
              : 'Something went Wrong',
          });
        }
      }
    );
  }

  getStartIndex() {
    return this.ongingpage * this.onginglimit + 1;
  }

  getEndIndex() {
    const endIndex =
      this.ongingpage * this.onginglimit + this.onginglists.length;
    return endIndex > this.totalongingList ? this.totalongingList : endIndex;
  }

  updateHcaafApprovalStatus(){
      const body = {
      _id: this.hcaafData?._id,
      hcaaf_approval_status:'done'
    };
    this.service.updateHcaafApprovalStatus(body).subscribe(
      (response: any) => {
        this.getlatesthcaafList();
      console.log("response", response)
      },
      (err) => {
      }
    );
  }
hcaafData:any = [];
  getlatesthcaafList(){
     const body = {
      company_id: this.userProfile?._id,
    };
    this.service.getLatestSubmittedHcaafForm(body).subscribe(
      (response: any) => {
        if(response.hcaafData){
          this.hcaafData = response.hcaafData;
        }else{
          this.hcaafData = [];
        }
        console.log("response", response.hcaafData)
      },
      (err) => {
      this.hcaafData = [];
      }
    );
  }
  hcaafList: any = [];

  async gethcaafList() {
    const body = {
      company_id: this.userProfile?._id,
      staff_status: 'completed',
      employee_status: 'completed',
    };
    await this.service.getSubmittedHcaafForm(body).subscribe(
      (response: any) => {
        console.log('response', response);
        // if (response.status == 200) {
        this.hcaafList = [...response.records];
        this.getHcaafPendingList();
        // } else {
        //   this.hcaafList = [];
        // }
      },
      (err) => {
        this.getHcaafPendingList();
      }
    );
  }

  hcaafPending: any = [];

  getCheckValid(item) {
    if (item.status) {
      return true;
    } else {
      return false;
    }
    item?.status && item?.status == 'pending';
  }
  getStatus(data) {
    return (
      new Date().getTime() >= new Date(data.valid_from).getTime() &&
      new Date().getTime() <= new Date(data.valid_to).getTime()
    );
  }

  goToDetail(data) {
    // this.router.navigate(['/employer/ongoing/ongoing-details'], {
    //   queryParams: {
    //     placement_id: data?.placement_id,
    //     student_id: data?.student_id,
    //     vacancy_id: data?.vacancy_id,
    //   },
    // });

    this.router.navigate(['/employer/placements/details'], {queryParams: {placement_id: data?.placement_id, student_id: data?.student_id, vacancy_id: data?.vacancy_id, type:this.status.toLowerCase()}})
  }

  getHcaafPendingList() {
    const body = {
      company_id: this.userProfile?._id,
      staff_status: 'pending',
      employee_status: 'pending',
    };
    this.service.getEmployerHcaafTask(body).subscribe(async (response: any) => {
      console.log('response', response, 'response');
      if (response.status == 200) {
        this.hcaafPending = await [...response.result];

        await this.hcaafPending.map((el) => {
          el.staus = 'pending';
        });
        // this.hcaafList = await [...this.hcaafList, ...this.hcaafPending];

        console.log('this.hcaafList', this.hcaafList);
      } else {
        this.hcaafPending = [];
      }
    });
    this.getHcaafPendingList1();
  }

  hcaafPending1: any = [];
  getHcaafPendingList1() {
    const body = {
      company_id: this.userProfile?._id,
      staff_status: 'pending',
      employee_status: 'completed',
    };
    this.service.getEmployerHcaafTask(body).subscribe(async (response: any) => {
      console.log('response', response, 'response');
      if (response.status == 200) {
        this.hcaafPending1 = await [...response.result];

        await this.hcaafPending1.map((el) => {
          el.staus = 'pending';
        });
        this.hcaafList = await [...this.hcaafList, ...this.hcaafPending1];

        console.log('this.hcaafList', this.hcaafList);
      } else {
        this.hcaafPending1 = [];
      }
    });
  }

  getFirstname() {
    // if (this.countDetail) {
    //   let find = this.countDetail?.contact_person?.find(
    //     (el) => el.preferred_contact
    //   );
    //   if (find) {
    //     return find.first_name;
    //   }
    // }
    return this.userProfile?.first_name
  }
  countDetail: any = {};
  getCompanyDetail() {
    const payload = {
      company_id: this.userProfile?._id,
    };
    this.service.get_company_detail(payload).subscribe((res: any) => {
      this.countDetail = res.result;
    });
  }

  recentVacancies: any = [];
  recentVacanciepage: any = 0;
  recentVacancielimit: any = 4;
  totalrecentVacancie: any = 0;
  totalrecentVacancieList: any = 0;
  getAllRecentVacancies(page) {
    // const payload = {
    //   limit: 10,
    //   offset:0,
    //   company_id: this.userProfile?._id
    // }
    // this.service.get_recent_vacancies(payload).subscribe((res: any) => {
    //   this.recentVacancies = res.result;
    // });

    this.recentVacanciepage = page;
    this.recentVacancielimit = 4;
    let body = {
      view_type: 'employer',
      company_id: this.userProfile._id,
      limit: this.recentVacancielimit,
      offset: page,
      contact_person_id: this.userProfile?.contact_person_id,
      preferred_contact: this.userProfile?.preferred_contact
        ? this.userProfile?.preferred_contact
        : false,
    };
    this.service.get_recent_vacancies(body).subscribe(
      (res) => {
        console.log('res', res);
        if (res.status == 200) {
          // this.addnote = false
          if (res.count <= this.recentVacancielimit) {
            this.recentVacancielimit = res.count;
          }

          // let totalPages_pre = (res.count/this.notelimit)
          // this.totalNotes = (search.total % page_size) == 0 ? totalPages_pre : totalPages_pre + 1
          this.totalrecentVacancieList = res.count;
          this.totalrecentVacancie = Math.ceil(
            res.count / this.recentVacancielimit
          );
          console.log(' this.totalNotes', this.totalrecentVacancie);
          this.recentVacancies = res.result;
        } else {
          this.recentVacancies = [];
          // this.totalNoteList =0;
          // this.notelimit =0;
          // this.service.showMessage({ message: res.msg });
        }
      },
      (err) => {
        this.recentVacancies = [];
        if (err?.status == 204) {
        } else {
          this.service.showMessage({
            message: err.error.errors.msg
              ? err.error.errors.msg
              : 'Something went Wrong',
          });
        }
      }
    );
  }

  getVacanciesStartIndex() {
    return this.recentVacancies.length === 0
      ? 0
      : this.recentVacanciepage * this.recentVacancielimit + 1;
  }

  getVacanciesEndIndex() {
    const endIndex =
      this.getVacanciesStartIndex() + this.recentVacancies.length - 1;
    return endIndex > this.totalrecentVacancieList
      ? this.totalrecentVacancieList
      : endIndex;
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
    };
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
    const url = `${window.location.origin}/employer/vacancies/${
      this.job_details._id
    }/${this.convertToSlug(this.job_details.job_title)}`;

    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url);
  }

  facebook() {
    const url = `${window.location.origin}/employer/vacancies/${
      this.job_details._id
    }/${this.convertToSlug(this.job_details.job_title)}`;
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url);
  }

  whatsapp() {
    const url = `${window.location.origin}/employer/vacancies/${
      this.job_details._id
    }/${this.convertToSlug(this.job_details.job_title)}`;
    window.open('https://api.whatsapp.com/send/?text=' + url + '&app_absent=0');
  }

  twitter() {
    const url = `${window.location.origin}/employer/vacancies/${
      this.job_details._id
    }/${this.convertToSlug(this.job_details.job_title)}`;
    window.open(
      'http://twitter.com/share?text=TopGrad&url=' + url + '&hashtags=#job'
    );
  }

  copyLink() {
    const url = `${window.location.origin}/employer/vacancies/${
      this.job_details._id
    }/${this.convertToSlug(this.job_details.job_title)}`;
    this.copy(url);

    const sel: any = document.querySelector('.link_copy');

    if (sel) {
      sel.style.display = 'block';
      setTimeout(function () {
        sel.style.display = 'none';
      }, 1000);
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
    this.skillsevent = this.job_details?.skills.map((jobSkill) => {
      const found = this.skills.find((skill) => skill._id === jobSkill);
      if (found) {
        jobSkill = found;
      }
      return jobSkill;
    });
  }

  editVacancy() {
    this.router.navigate(['/employer/vacancies/create-vacancies'], {
      queryParams: { id: this.job_details._id },
    });
  }

  updateVacanciesStatus(status) {
    const payload = {
      _ids: [this.job_details?._id],
      status: status,
    };
    this.service.updateVacanciesStatus(payload).subscribe(
      (res) => {
        this.service.showMessage({
          message: 'Vacancy status changed successfully',
        });
        // this.getAllActiveVacancies();
        // this.getAllArchivedVacancies();
      },
      (err) => {
        this.service.showMessage({
          message: err.error.errors
            ? err.error.errors.msg
            : 'Something went Wrong',
        });
      }
    );
  }

  deleteVacancy() {
    const payload = {
      _ids: [this.job_details?._id],
    };
    this.service.deleteVacancy(payload).subscribe(
      (res) => {
        this.service.showMessage({
          message: 'Vacancy deleted changed successfully',
        });
        // this.getAllActiveVacancies();
        // this.getAllArchivedVacancies();
      },
      (err) => {
        this.service.showMessage({
          message: err.error.errors
            ? err.error.errors.msg
            : 'Something went Wrong',
        });
      }
    );
  }

  studentFormDetail: any;

  currentUserType = 'employer';

  get visibleStepIndexes() {
    return this.multiStepForm
      .map((step, index) => {
        // If permissions or user type is missing, default to true (step visible)
        const canRead = step.permissions?.[this.currentUserType]?.read ?? true;
        return canRead ? index : -1;
      })
      .filter(index => index !== -1);
  }


  isLastVisibleStep(index: number): boolean {
    const visible = this.visibleStepIndexes;
    return index === visible[visible.length - 1];
  }


  openModel(data) {
    console.log('data', data);
    this.studentFormDetail = data.form_fields;
    // this.getStudentTaskForm(data.hcaaf_form_id);
    // this.studentFormDetail = data;
    console.log("this.studentFormDetail", this.studentFormDetail);
    this.taskDetail = data;
     if (this.studentFormDetail?.type === 'simple') {
        this.singleStepForm = this.studentFormDetail?.fields;
        this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));
      } else if (this.studentFormDetail?.type === 'multi_step') {
     
        this.multiStepForm = this.studentFormDetail?.fields;
        this.multiStepForm.forEach(el=>{
           el.component.forEach(field => this.manageFieldVisibility(field, el.component));
        })

      }
    this.submithcaafModal.show();
    const self = this;
    // setTimeout(() => {
    //   self.initializeSignatures();
    // }, 5000);
  }
  singleStepForm = null;
  multiStepForm = null;

  async getStudentTaskForm(formId) {
    this.service
      .getSubmittedHcaafFormDetailById({ _id: formId })
      .subscribe((response) => {
        this.studentFormDetail = response.data[0].form_fields;
        // if(this.studentFormDetail.form_fields?.type == "multi_step"){
        //   this.studentFormDetail?.form_fields?.fields.map(el=>{
        //     el.component.map(e=>{
        //       if(e.id=="single" || e.id=="multi"){
        //         e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
        //       }
        //     })
        //   })
        // }else{
        //   this.studentFormDetail?.form_fields?.fields.map(e=>{
        //       if(e.id=="single" || e.id=="multi"){
        //         e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
        //       }
        // })
        // }

        if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = this.studentFormDetail?.fields;
        } else if (this.studentFormDetail?.type === 'multi_step') {
          this.multiStepForm = this.studentFormDetail?.fields;
        }
      });
  }
  public showAll = false;

  public toggleShowMore(): void {
    this.showAll = !this.showAll;
  }

  checkIsFormValid(formFields) {
    // form.id !== 'checkbox' &&
    if (formFields && formFields.length > 0) {
      return formFields.some(
        (form) =>
          (form.id !== 'signature' &&
            form.id !== 'checkbox' &&
            form.elementData?.required &&
            !form.elementData?.value) ||
          (form.id === 'signature' &&
            form.elementData.items.some(
              (item) =>
                item.item === 'Employer' &&
                (!item?.signature || Object.keys(item.signature).length === 0)
            ))
      );
    } else {
      return true;
    }
  }

  checkFieldPermission(permissions) {
    // if (this.taskDetail?.employee_status !== 'completed') {
    if (permissions?.employee.write && permissions?.employee.read) {
      return 'editable';
    } else if (!permissions?.employee.write && permissions?.employee.read) {
      return 'readOnly';
    } else {
      return 'hidden';
    }
    // }
  }

  checkDropDownFieldPermission(permissions) {
    if (this.studentFormDetail?.staff_status !== 'completed') {
      if (permissions?.staff.write && permissions?.staff.read) {
        return false;
      } else if (!permissions?.staff.write && permissions?.staff.read) {
        return true;
      } else {
        return true;
      }
    }
  }

  checkIsFormValidSubmit(formFields) {
    // form.id !== 'checkbox' &&
    if (formFields && formFields.length > 0) {
      return formFields.some(
        (form) =>
          (form.id !== 'signature' &&
            form.id !== 'checkbox' &&
            form.elementData?.required &&
            !form.elementData?.value) ||
          (form.id === 'signature' &&
            form.elementData.items.some(
              (item) =>
                item.item === 'Staff' &&
                (!item?.signature || Object.keys(item.signature).length === 0)
            ))
      );
    } else {
      return true;
    }
  }

getValueInsideSingleBracket(input: unknown): string[] {
    try {
      if (!input) {
        return [];
      }

      let text = '';

      if (Array.isArray(input)) {
        text = input.join(' ');
      } else if (typeof input === 'string') {
        text = input;
      } else {
        console.warn('Invalid input type:', input);
        return [];
      }

      const regex = /\(([^)]+)\)/g;
      const matches = [...text.matchAll(regex)];

      return matches.map(match => match[1]);
    } catch (error) {
      console.error('getValueInsideSingleBracket error:', error);
      return [];
    }
}

  uploadFile(event, field) {
    const files: FileList = event.target.files;

    if (files[0].size > field?.elementData?.size * 1048576) {
      this.service.showMessage({
        message:
          'Please select file less than ' + field?.elementData?.size + ' MB',
      });
      return;
    }

    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        field.elementData.value =
          field.elementData.value?.length > 0 ? field.elementData.value : [];
        field.elementData.value.push(resp);
      });
    });

    event.target.value = '';
  }
  submitdisabled: boolean = false;

  submitForm(status = '') {
    if (this.studentFormDetail?.type === 'simple') {
      // if (this.signaturePads.length > 0) {
      //   this.getFile(() => {
      //     this.submitWorkflowttachment(this.singleStepForm);
      //   });
      // } else {
      this.submitWorkflowttachment(this.singleStepForm, status);
      // }
    } else if (this.studentFormDetail?.type === 'multi_step') {
      // if (this.signaturePads.length > 0) {
      //   this.getFile(() => {
      //     this.submitWorkflowttachment(this.multiStepForm);
      //   });
      // } else {
      this.submitWorkflowttachment(this.multiStepForm,status);
      // }
    }
  }

    @ViewChild('multiStepFormStepper1') stepper!: MatStepper;

  submitWorkflowttachment(fields, status) {
    const payload = {
      company_id: this.userProfile?._id,
      hcaaf_form_id:this.hcaafData.hcaaf_form_id,
      _id:this.hcaafData._id,
      employer_hcaaf_id: this.hcaafData.employer_hcaaf_id,
      task_status: 'completed',
      employee_status:status ? 'pending':'completed',
      staff_status: 'pending',
      employee_form_status:status?status:'submit',
      form_title: this.hcaafData.form_title,
      submitted_by: this.userProfile?.role,
      //  "employer_hcaaf_id": "66bc4d107bf036f45a939171",
      form_fields: { fields, type: this.studentFormDetail?.type },
      employer_name: this.userProfile?.companyupdateHcaafApprovalStatus_name,
    };
    this.service.submitHcaafForm(payload).subscribe(
      (res) => {
        if(status){
           this.service.showMessage({
          message: 'Agreement Forms saved successfully',
        });
        }else{
           this.service.showMessage({
          message: 'Agreement Forms submitted successfully',
        });
        }
       
         if (this.stepper) {
          this.stepper.selectedIndex = 0; // Go to the desired step
          // this.onStepChange(index);           // Optional: call a function for logic
        }
        this.submitdisabled = false;
        // this.goBack();
        this.getlatesthcaafList();
        this.submithcaafModal.hide();
        this.gethcaafList();
      },
      (err) => {
        this.service.showMessage({
          message: err.error.errors
            ? err.error.errors.msg
            : 'Something went Wrong',
        });
      }
    );
  }

  tasks = [
    {
      name: 'New To Do List',
      completed: false,
      subtasks: [
        {
          completed: false,
          name: 'denmo',
        },
        {
          completed: false,
          name: 'denmo',
        },
      ],
    },
  ];

  editTask(task) {
    task.edit = true;
  }

  onApprove() {
    console.log('update');
  }

  onReject(task) {
    task.edit = false;
    console.log('close');
  }

  addTask() {
    this.tasks.push({ name: 'New To Do List', completed: false, subtasks: [] });
  }
  taskDelete() {}
  deleteTask(task: any) {
    task.delete = true;
    // this.tasks = this.tasks.filter(t => t !== task);
  }

  toggleTask(task: any) {
    task.completed = !task.completed;
  }

  addSubtask(task: any) {
    task.showSubtaskInput = true;
  }

  saveSubtask(task: any) {
    if (task.newSubtask) {
      task.subtasks.push({ name: task.newSubtask, completed: false });
      task.newSubtask = '';
      task.showSubtaskInput = false;
    }
  }

  deleteSubtask(task: any, subtask: any) {
    task.subtasks = task.subtasks.filter((st) => st !== subtask);
  }

  toggleSubtask(subtask: any) {
    subtask.completed = !subtask.completed;
  }

  async downloadPDF(url: string, filename: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('There was an error downloading the PDF:', error);
      this.downloadFile(url);
    }
  }

  async viewPDF(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);
      window.open(blobURL, '_blank');
      window.URL.revokeObjectURL(blobURL);
    } catch (error) {
      console.error('There was an error viewing the PDF:', error);
      this.downloadFile(url);
    }
  }

  downloadFile(url: string) {
    window.open(url);
  }
  @ViewChild('viewSubmithcaafModal') viewSubmithcaafModal: ModalDirective;
  vertical: boolean = false;
  studentFormDetailStatus:any;
  showFormView(item) {
    this.viewSubmithcaafModal.show();
       this.studentFormDetailStatus = item;
    // this.studentFormDetail = item
    this.studentFormDetail = item['form_fields'];

    console.log(
      'this.studentFormDetailthis.studentFormDetail',
      this.studentFormDetail
    );
    if (this.studentFormDetail?.type === 'simple') {
      this.singleStepForm = this.studentFormDetail?.fields;
    } else {
      this.multiStepForm = this.studentFormDetail?.fields;
    }
  }

  formSubmitted: boolean = false;

  onNextOrSubmit(data, stepper: MatStepper, type) {
      console.log("data", data);

   let fields = data?.component?data?.component:data;
   console.log("fields", fields);

    // Determine access level helper
    const getAccessLevel = (permissions) => {
      if (permissions?.employee?.write && permissions?.employee?.read) {
        return 'editable';
      } else if (!permissions?.employee?.write && permissions?.employee?.read) {
        return 'readOnly';
      } else {
        return 'hidden';
      }
    };

    // Skip validation if all fields are just descriptions
     const onlyDescriptions = fields.every(
          field => field.elementData?.type === 'description'
        );

        if (onlyDescriptions) {
          if (this.studentFormDetail?.type === 'multi_step') {
            const findIndex = this.multiStepForm.findIndex(
              f => f.name === data.name
            );

            const isLastStep = findIndex === this.multiStepForm.length - 1;

            // 🔹 If NOT last step → move next
            if (!isLastStep && findIndex > -1) {
              const nextStep = this.multiStepForm[findIndex + 1];

              nextStep?.component.forEach(field => {
                this.checkFieldLogic(field, nextStep?.component);
              });

              stepper.next();
              return;
            }

            // 🔹 If LAST step → submit
            if (isLastStep) {
              this.submitForm();
              this.submitdisabled = true;
              return;
            }
          }

          stepper.next();
          return;
        }


    // Validate only editable + required fields
    const isInvalid = fields.some((field) => {
      const accessLevel = getAccessLevel(field.elementData?.permissions);
      const isEditable = accessLevel === 'editable'; // only check editable fields
      const isRequired = field.elementData?.required;
      const isDescription = field.elementData?.type === 'description';

      if (!isEditable || isDescription || !isRequired) {
        return false; // skip validation if not editable, not required, or description
      }

      // Now check value based on type
      const hasValue =
        field.elementData?.type === 'checkbox'
          ? field.elementData?.items?.some((item) => item.selected)
          : !!field.elementData?.value;

      return !hasValue;
    });

    console.log('isInvalid', isInvalid);

     fields.forEach(field => {
        this.checkFieldLogic(field, fields)
    });

   if (isInvalid || this.stopnext || this.disbaledBtnLogic || this.processEnd) {
      this.formSubmitted = true;
      return false;
    } else {
      this.formSubmitted = false;
      if (type === 'submit') {
        this.submitForm();
        this.submitdisabled = true;
      } else {
        if (this.studentFormDetail?.type === 'multi_step') {
        const findIndex = this.multiStepForm.findIndex(f => f.name === data.name);
          console.log("findIndex", findIndex);

          if (findIndex > -1 && findIndex + 1 < this.multiStepForm.length) {
            let mfields = this.multiStepForm[findIndex + 1];
            console.log("mfields", mfields);
            mfields?.component.forEach(field => {
              // if(!field.elementData.value){
                this.checkFieldLogic(field, mfields?.component)
              // }
            });
          }
        }
        stepper.next();
      }
    }
  }

  isAnyItemSelected(items: any[]): boolean {
    return items?.some((item) => item.selected);
  }
  isFieldInvalid(field): boolean {
    const access = this.checkFieldPermission(field.elementData?.permissions);
    const isEditable = access === 'editable';
    const isRequired = field.elementData?.required;

    let hasValue = false;

    if (field.elementData?.type === 'checkbox') {
      hasValue = this.isAnyItemSelected(field.elementData?.items);
    } else if (field.elementData?.type === 'attachment') {
      hasValue =
        field.elementData?.value && field.elementData?.value.length > 0;
    } else {
      hasValue = !!field.elementData?.value;
    }

    return this.formSubmitted && isEditable && isRequired && !hasValue;
  }

  onCheckboxChange(field) {
  // When user changes a checkbox, re-check validity
  if (field.elementData?.type === 'checkbox') {
    const hasSelected = this.isAnyItemSelected(field.elementData?.items);
    // console.log("hasSelected", hasSelected);
    // If at least one selected, clear error state for this field
    field.elementData.value = hasSelected ? true : null;
  }
}

  errorMessage:any = null;
  processEnd:boolean = false;
  processEndObj:any = null;
  disbaledBtnLogic:boolean = false;
  stopnext:boolean = false;


checkFieldLogic(changedField: any, fields: any[]) {
  console.log("changedField, fields", changedField, ' == = = ', fields, ' = = == = = = ', this.processEnd, this.stopnext);

  if (this.studentFormDetail?.type === 'simple' || this.studentFormDetail?.type === 'multi_step') {
    this.manageFieldVisibility(changedField, fields);
  }

  if (this.processEnd || this.stopnext) {
    console.log("this.processEndObj", this.processEndObj)
      // const passed = this.checkCondition(fieldValue, logic, targetField);
      if(this.processEndObj.index == changedField.index){
        // let logic = changedField.logic || {};
        let logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
        const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
        console.log("passed", passed);
        if(!passed){
          this.errorMessage = null;
          changedField.is_message = false;
          changedField.message = "";

          // if (logic.action === "end_process") {
          //   this.processEnd = false;
          // }
          // if (logic.action === "block_submission") {
          //   this.stopnext = false;
          // }
          this.processEnd = false;
          this.stopnext = false;
          this.disbaledBtnLogic = false;
          this.processEndObj = null
        }

     }
    console.log("this.processEndObj", this.processEndObj);
    return;
  }
  const logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  // --- find the field we check the value of ---
  const targetField = fields.find(f => f.name === logic.field_name);
  if (!targetField) return;

  const fieldValue = targetField.elementData?.value;

  console.log("fieldValuefieldValue", fieldValue);
  // const passed = fieldValue || logic.action == "hide_field" || logic.action == "show_field"?this.checkCondition(fieldValue, logic, targetField):false;

  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // logic.action === "show_field";

  console.log("shouldCheck", shouldCheck)
const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;

  console.log("Checking:", targetField.name, "Value:", fieldValue, "Rule:", logic, "Passed:", passed);

  // --- find field to hide/show ---
  let hideShowField: any = null;
  if (logic.hide_show_field && this.studentFormDetail?.type === 'multi_step') {
    const section = this.multiStepForm.find(el => el.name === logic.action_page_type);
    hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
  } else {
    hideShowField = logic.hide_show_field
      ? fields.find(f => f.name === logic.hide_show_field)
      : null;
  }

  console.log("targetField", passed)

  if (passed) {
    switch (logic.action) {
      case "show_message":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "block_submission":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || "Form submission blocked";
        break;

      case "hide_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // // hideShowField.elementData.value = null;
          }
        }
        // hideShowField.hidden = true;
        // // hideShowField.elementData.value = null;
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = false;
        }
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || "Process ended";
        break;
    }
  } else {
    // --- Reset states if condition fails ---
    switch (logic.action) {
      case "hide_field":

      
       if (hideShowField) {
        hideShowField.hidden = false;
        if (hideShowField.elementData) {
          // hideShowField.elementData.value = null;
        }
      }
        targetField.is_message = false;
        targetField.message = "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // hideShowField.elementData.value = null;
          }
        }
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_message":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;   // ✅ unlock when condition fails
        break;

      case "block_submission":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;     // ✅ unlock when condition fails
        break;

      default:
        break;
    }
  }

  this.recalculateEndProcess(fields);
}

private recalculateEndProcess(fields: any[]) {
  let disableFound = false;

  for (const field of fields) {
    const logic = field.logic;
    if (!logic) continue;

    // If already in processEnd/stopnext mode, verify if condition still holds
    // if (this.processEnd || this.stopnext) {
    //   console.log("this.processEndObj", this.processEndObj, "field", field)
    //   if (this.processEndObj?.index === field.index) {
    //     const passed = this.checkCondition(field.elementData?.value, logic, field);
    //     console.log("Re-checking condition for end_process:", passed);

    //     if (!passed) {
    //       // Reset because condition no longer holds
    //       this.errorMessage = null;
    //       field.is_message = false;
    //       field.message = "";

    //       this.processEnd = false;
    //       this.stopnext = false;
    //       this.disbaledBtnLogic = false;
    //       this.processEndObj = null;
    //     }
    //   }
    //   continue; // don’t exit loop, keep checking other fields
    // }

    // Normal case: check condition fresh

    let shouldCheck =
    field.elementData?.value !== undefined &&
    field.elementData?.value !== null &&
    field.elementData?.value !== "" ||
    field.id == "checkbox" || logic.action === "show_field"
    
    const passed = shouldCheck?this.checkCondition(field.elementData?.value, logic, field):false;
    console.log("passed", passed, "field", field, "login", passed && (logic.action === "end_process" || logic.action === "block_submission"))
    if (passed && (logic.action === "end_process" || logic.action === "block_submission")) {
      disableFound = true;
      this.processEndObj = { index: field.index, action: logic.action };
      break;
    }
  }

  // Apply final state if not already reset
  if (!this.processEnd && !this.stopnext) {
    this.disbaledBtnLogic = disableFound;
    this.processEnd = disableFound;
    this.stopnext = disableFound;
  }

  console.log("Recalculated end_process:", {
    disableFound,
    processEnd: this.processEnd,
    stopnext: this.stopnext,
    processEndObj: this.processEndObj
  });
}


private checkCondition(fieldValue: any, rule: any, targetField: any): boolean {

  console.log("fieldValue: any, rule: any, targetField", fieldValue, rule, targetField)
  const value = rule.value;
  const fieldType =
    targetField?.elementData?.type ||
    targetField?.logic?.type ||
    targetField?.id;

  console.log("fieldType", fieldType);

  // if (fieldValue == null || fieldValue === '') return false;

  // --- TEXT FIELD (by length) ---
  if (fieldType === 'single-line' || fieldType === 'multi-line') {
    const length = fieldValue?.toString().replace(/\n/g, '').trim()?.length || null;
    if(length == null){
      return false;
    }
    const ruleNum = Number(value);
    switch (rule.is) {
      case 'eq': return length === ruleNum;
      case 'neq': return length !== ruleNum;
      case 'lt': return length < ruleNum;
      case 'gt': return length > ruleNum;
      case 'lte': return length <= ruleNum;
      case 'gte': return length >= ruleNum;
      default: return false;
    }
  }

  // --- NUMBER FIELD ---
  // if (fieldType === 'number') {
  //   const numVal = Number(fieldValue);
  //   if (isNaN(numVal)) return false;

  //   let mainCheck = true;

  //   // first rule check (eq, gt, lt etc.)
  //   if (rule.and_number !== undefined && rule.and_number !== null && rule.and_number !== '') {
  //     const numRule = Number(rule.and_number);
  //     switch (rule.is) {
  //       case 'eq': mainCheck = numVal === numRule; break;
  //       case 'neq': mainCheck = numVal !== numRule; break;
  //       case 'lt': mainCheck = numVal < numRule; break;
  //       case 'gt': mainCheck = numVal > numRule; break;
  //       case 'lte': mainCheck = numVal <= numRule; break;
  //       case 'gte': mainCheck = numVal >= numRule; break;
  //     }
  //   }

  //   // second rule check (and_number, to_number, number_grather)
  //   let secondCheck = true;
  //   if (rule.number_grather && rule.and_number !== '') {
  //     const andNum = Number(rule.and_number);
  //     const toNum = Number(rule.to_number);
  //     switch (rule.number_grather) {
  //       case 'eq': secondCheck = numVal === andNum; break;
  //       case 'neq': secondCheck = numVal !== andNum; break;
  //       case 'lt': secondCheck = numVal < andNum; break;
  //       case 'gt': secondCheck = numVal > andNum; break;
  //       case 'lte': secondCheck = numVal <= andNum; break;
  //       case 'gte': secondCheck = numVal >= andNum; break;
  //       case 'between': secondCheck = numVal >= andNum && numVal <= toNum; break;
  //     }
  //   }

  //   return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
  // }

  if (fieldType === 'number') {
  const numVal = Number(fieldValue);
  if (isNaN(numVal)) return false;

  let mainCheck = true;

  // First operator check (is)
  if (rule.is && rule.and_number !== '') {
    const numRule = Number(rule.and_number);
    switch (rule.is) {
      case 'eq': mainCheck = numVal === numRule; break;
      case 'neq': mainCheck = numVal !== numRule; break;
      case 'lt': mainCheck = numVal < numRule; break;
      case 'gt': mainCheck = numVal > numRule; break;
      case 'lte': mainCheck = numVal <= numRule; break;
      case 'gte': mainCheck = numVal >= numRule; break;
    }
  }

  // Second operator check (number_grather / between)
  let secondCheck = true;
  if (rule.number_grather) {
    const andNum = Number(rule.and_number);
    const toNum = rule.to_number ? Number(rule.to_number) : null;

    switch (rule.number_grather) {
      case 'eq': secondCheck = numVal === toNum; break;
      case 'neq': secondCheck = numVal !== toNum; break;
      case 'lt': secondCheck = numVal < toNum; break;
      case 'gt': secondCheck = numVal > toNum; break;
      case 'lte': secondCheck = numVal <= toNum; break;
      case 'gte': secondCheck = numVal >= toNum; break;
      case 'between':
        if (toNum !== null) {
          secondCheck = numVal >= andNum && numVal <= toNum;
        } else {
          secondCheck = false; // invalid rule definition
        }
        break;
    }
  }
  console.log("rule.number_grather ? (mainCheck && secondCheck) : mainCheck", rule.number_grather , (mainCheck && secondCheck) , mainCheck, secondCheck)

  return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
}


  // --- DATE/TIME FIELD ---
 if (fieldType === 'date') {
    const fieldDateObj = new Date(fieldValue);
    const ruleDateObj = new Date(value);

    if (isNaN(fieldDateObj.getTime()) || isNaN(ruleDateObj.getTime())) return false;

    // Zero out the time part
    fieldDateObj.setHours(0, 0, 0, 0);
    ruleDateObj.setHours(0, 0, 0, 0);

    const fieldDate = fieldDateObj.getTime();
    const ruleDate = ruleDateObj.getTime();

    switch (rule.is) {
      case 'eq': return fieldDate === ruleDate;
      case 'neq': return fieldDate !== ruleDate;
      case 'lt': return fieldDate < ruleDate;
      case 'gt': return fieldDate > ruleDate;
      case 'lte': return fieldDate <= ruleDate;
      case 'gte': return fieldDate >= ruleDate;
      default: return false;
    }
  }

  if (fieldType === 'time') {
  // Convert both fieldValue and rule.value (e.g. "4:05 PM") into minutes since midnight
  const parseTime = (timeStr) => {
    if (!timeStr) return NaN;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return NaN;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3] ? match[3].toUpperCase() : null;

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes; // total minutes since midnight
  };

  const fieldTime = parseTime(fieldValue);
  const ruleTime = parseTime(value);

  if (isNaN(fieldTime) || isNaN(ruleTime)) return false;

  switch (rule.is) {
    case 'eq': return fieldTime === ruleTime;
    case 'neq': return fieldTime !== ruleTime;
    case 'lt': return fieldTime < ruleTime;
    case 'gt': return fieldTime > ruleTime;
    case 'lte': return fieldTime <= ruleTime;
    case 'gte': return fieldTime >= ruleTime;
    default: return false;
  }
}


  // --- CHECKBOX / RADIO / MULTISELECT ---
//   if (fieldType === 'checkbox' || fieldType === 'radio' || Array.isArray(fieldValue)) {
//     // Collect selected values properly for checkbox
//     let selectedValues: any[] = [];
//     if (fieldType === 'checkbox' && targetField.elementData?.items) {
//       selectedValues = targetField.elementData.items
//         .filter((item: any) => item.selected)
//         .map((item: any) => item.item);
//     } else {
//       selectedValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
//     }

//     const ruleValues = Array.isArray(value) ? value : [value];
//     switch (rule.is) {
//       case 'includes': return ruleValues.some(v => selectedValues.includes(v));
//       case 'not_includes': return ruleValues.every(v => !selectedValues.includes(v));
//       default: return false;
//     }
//   }

//   if (fieldType === 'likert-scale' || fieldType === "likert") {
//   const likertItems: string[] = targetField?.elementData?.items?.map((i: any) => i.item) || [];

//   if (!likertItems.length) return false;

//   const fieldIndex = likertItems.indexOf(fieldValue) + 1;
//   let ruleIndex = -1;

//   if (Array.isArray(value) && value.length > 0) {
//     ruleIndex = likertItems.indexOf(value[0]) + 1;
//   } else if (typeof value === "string") {
//     ruleIndex = likertItems.indexOf(value) + 1;
//   }

//   if (fieldIndex <= 0 || ruleIndex <= 0) return false;

//   switch (rule.is) {
//     case 'eq': return fieldIndex === ruleIndex;
//     case 'neq': return fieldIndex !== ruleIndex;
//     case 'lt': return fieldIndex < ruleIndex;
//     case 'gt': return fieldIndex > ruleIndex;
//     case 'lte': return fieldIndex <= ruleIndex;
//     case 'gte': return fieldIndex >= ruleIndex;
//     default: return false;
//   }
// }

 if (fieldType === 'likert-scale' || fieldType === 'likert') {
  // Get selected value(s)
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  const likertOrder = targetField.elementData?.items?.map(it => it.item) || [];

  const selectedRank = likertOrder.indexOf(selectedValues[0]);
  const ruleRank = likertOrder.indexOf(ruleValues[0]);

  console.log('Likert selected:', selectedValues[0], 'rule:', ruleValues[0], 'comparison:', rule.is);

  switch (rule.is) {
    case 'eq':
      return selectedValues[0] === ruleValues[0];

    case 'neq':
      return selectedValues[0] !== ruleValues[0];

    case 'includes':
      return ruleValues.includes(selectedValues[0]);

    case 'not_includes':
      return !ruleValues.includes(selectedValues[0]);

    case 'gte':
      return selectedRank >= ruleRank;

    case 'lte':
      return selectedRank <= ruleRank;

    case 'gt':
      return selectedRank > ruleRank;

    case 'lt':
      return selectedRank < ruleRank;

    default:
      return false;
  }
}


  // --- existing checkbox/radio/array logic ---
// RADIO / CHECKBOX / MULTISELECT (replace your current block with this)
// if (fieldType === 'radio' || fieldType === 'checkbox' || Array.isArray(fieldValue)) {
//   // build selectedValues array:
//   let selectedValues: any[] = [];

//   // checkbox: read items[].selected
//   if (fieldType === 'checkbox' && targetField.elementData?.items) {
//     selectedValues = targetField.elementData.items
//       .filter((it: any) => !!it.selected)
//       .map((it: any) => it.item);
//   }
//   // if fieldValue is already an array (multi-select), use it
//   else if (Array.isArray(fieldValue)) {
//     selectedValues = fieldValue.slice();
//   }
//   // radio / single-select: single value -> array
//   else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
//     selectedValues = [fieldValue];
//   } else {
//     selectedValues = [];
//   }


//   const ruleValues = Array.isArray(value) ? value : [value];
//   console.log("selectedValues", selectedValues, ruleValues)
//   switch (rule.is) {
//     // exact match: selectedValues must contain exactly the same items as ruleValues
//     case 'eq':
//       // both arrays equal (order-agnostic)
//     if (selectedValues.length !== ruleValues.length) return false;
//       return ruleValues.every(rv => selectedValues.includes(rv));

//     case 'neq':
//       if (selectedValues.length !== ruleValues.length) return true;
//       return !ruleValues.every(rv => selectedValues.includes(rv));

//     // any match: true if any rule value is present in selectedValues
//     case 'includes':
//       return ruleValues.some(rv => selectedValues.includes(rv));

//     // none of the rule values are present
//     case 'not_includes':
//       return ruleValues.every(rv => !selectedValues.includes(rv));

//     default:
//       return false;
//   }
// }

if (fieldType === 'radio' || Array.isArray(fieldValue)) {
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  console.log("ruleValues", ruleValues, "selectedValues", selectedValues)
  switch (rule.is) {
    case 'eq':
      if (selectedValues.length !== ruleValues.length) return false;
      return ruleValues.every(rv => selectedValues.includes(rv));

    case 'neq':
      if (selectedValues.length !== ruleValues.length) return true;
      return !ruleValues.every(rv => selectedValues.includes(rv));

    case 'includes':
      return selectedValues.length > 0 && ruleValues.some(rv => selectedValues.includes(rv));

    case 'not_includes':
      // treat empty selection as false
      if (!selectedValues.length) return false;
      return !ruleValues.some(rv => selectedValues.includes(rv));

    default:
      return false;
  }
}

// console.log("fieldType",fieldType)

if (fieldType === 'checkbox') {
  const selectedValues: string[] = targetField.elementData?.items
    ?.filter((item: any) => item.selected)
    .map((item: any) => {
      // Adjust here depending on your data structure
      return (item.value || item.item || item.label || '').toString().trim().toLowerCase();
    }) || [];

  const ruleValues: string[] = (Array.isArray(value) ? value : [value])
    .map(v => (v ?? '').toString().trim().toLowerCase());


    console.log('Selected Values:', selectedValues);
    console.log('Rule Values:', ruleValues);

    if(selectedValues.length == 0){
      return false
    }

  switch (rule.is) {
    case 'includes':
      return ruleValues.some(rv => selectedValues.includes(rv));
    case 'not_includes':
      return ruleValues.every(rv => !selectedValues.includes(rv));
    case 'eq':
      return selectedValues.length === ruleValues.length &&
             ruleValues.every(rv => selectedValues.includes(rv));
    case 'neq':
      return !(selectedValues.length === ruleValues.length &&
               ruleValues.every(rv => selectedValues.includes(rv)));
    default:
      return false;
  }
}



if (fieldType === 'dropdown') {
  // actual selected value from dropdown
  const selectedValue = targetField.elementData?.value || '';

  // normalize rule values into array
  const ruleValues = Array.isArray(value) ? value : [value];

  switch (rule.is) {
    case 'eq':
    case 'includes':
      // Match if selected value equals any of the rule values
      return ruleValues.includes(selectedValue);

    case 'neq':
    case 'not_includes':
      // Match if selected value does NOT equal any of the rule values
      return !ruleValues.includes(selectedValue);

    default:
      return false;
  }
}


  // --- DEFAULT STRING/OTHER ---
  switch (rule.is) {
    case 'eq': return fieldValue == value;
    case 'neq': return fieldValue != value;
    default: return false;
  }
}


manageFieldVisibility(changedField: any, fields: any[]) {
  // const logic = changedField.logic || {};
  const logic =  Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  let targetField: any;
  let hideShowField: any = null;

  if (this.studentFormDetail?.type === 'multi_step' && logic.hide_show_field) {
    const section = this.multiStepForm.find(el => el.name === logic.action_page_type);
    targetField = fields.find(f => f.name === logic.field_name);
   if(!targetField?.elementData?.value || targetField?.elementData?.value == "Nah"){
    hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
    }
  } else {
    targetField = fields.find(f => f.name === logic.field_name);
   if(!targetField?.elementData?.value || targetField?.elementData?.value == "Nah"){
    hideShowField = logic.hide_show_field ? fields.find(f => f.name === logic.hide_show_field) : null;
    }
  }

  if (!targetField) return;

  //   if (this.processEnd || this.stopnext) {
  //     // const passed = this.checkCondition(fieldValue, logic, targetField);
  //     if(this.processEndObj.index == changedField.index){
  //       let logic = changedField.logic || {};
  //       const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
  //       console.log("passed", passed);
  //       if(!passed){
  //         this.errorMessage = null;
  //         changedField.is_message = false;
  //         changedField.message = "";
  //         this.processEnd = false;
  //         this.stopnext = false;
  //         this.disbaledBtnLogic = false;
  //         this.processEndObj = null
  //       }

  //     }
  //   console.log("this.processEndObj", this.processEndObj);
  //   return;
  // }

  const fieldValue = targetField.elementData?.value;
  console.log("fieldValue", fieldValue)
  console.log("logic", logic);
  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // ||
  // (logic.action === "hide_field" && (logic.is!='lt' || logic.is!='lte'))
  // (logic.action === "show_field" && (logic.is=='lt' || logic.is=='lte'));

if(logic.action === "hide_field"){
  console.log("shouldCheck", shouldCheck, logic.action)
}
  

const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;
  console.log("passed", passed);
  // --- handle hide/show / end_process / block_submission ---
  if (passed) {
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) hideShowField.hidden = true;
        break;

      case 'hide_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        break;

      case 'show_message':
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || '';
        break;

      case 'block_submission':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || 'Form submission blocked';
        break;

      case 'end_process':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || 'Process ended';
        break;
    }
  } else {
    // --- reset only for actions that are not end_process / block_submission ---
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'hide_field':
        if (hideShowField) hideShowField.hidden = false;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'show_message':
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'block_submission':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'end_process':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;
    }
  }

  console.log('manageFieldVisibility ->', {
    targetField,
    hideShowField,
    passed,
    action: logic.action
  });
}



  deleteObj:any =null;
 confirmDetete(index: number, file: any) {
  if (!this.deleteObj) {
    this.deleteObj = {};
  }

  this.deleteObj.index = index;
  this.deleteObj.file = file;
  this.confirmationDelete.show();
}
 @ViewChild('confirmationDelete') public confirmationDelete: ModalDirective;




deleteFile(index, form) {
    if (!Array.isArray(form)) {
      console.error("❌ Error: form is not an array!", form);
      return;
    }
    if (index < 0 || index >= form.length) {
      console.error("❌ Error: Invalid index!", index);
      return;
    }

    this.service.deleteFileS3({file_url:form[index].url}).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
    
        console.log("🗑️ Deleting file:", form[index]);
        form.splice(index, 1);
        console.log("✅ Updated form:", form);
         this.deleteObj = null;
  this.confirmationDelete.hide();
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

}

