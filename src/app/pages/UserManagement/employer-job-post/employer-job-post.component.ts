import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatHorizontalStepper, MatStep, MatStepper } from '@angular/material/stepper';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-employer-job-post',
  templateUrl: './employer-job-post.component.html',
  styleUrls: ['./employer-job-post.component.scss']
})
export class EmployerJobPostComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  minDate: any = Date;
  myControl = new FormControl('');

  maxDate: any = Date;
  employer_job_post_id: string = "";
  days: any
  flength: any
  a: any
  b: any
  error: any
  isedit: boolean = false;
  maxChars = 8;
  suburb: any = ''
  city: any
  state: any
  country: any
  checkenable1: boolean = false
  checkenable2: boolean = false
  checkenable3: boolean = false
  ifChecked: boolean = false
  checked: boolean = true
  woktypeValue: any
  cover_letter: boolean = true
  check1 = false
  check2 = false
  check3 = false
  QuestionsIndex: any = 0

  date: any = new Date();

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  selectedCar: any = [3];

  rights: any = [
    // 'Student Visa','Full Time Work Rights','Citizen/Permanent Resident','Citizen/Permanent Resident','Any' 
    { id: 1, name: 'Student Visa' },
    { id: 2, name: 'Full Time Work Rights' },
    { id: 3, name: 'Citizen/Permanent Resident' },
    { id: 4, name: 'Any' },
  ];

  // skills = [
  //     { id: 1, name: 'Jira' },
  //     { id: 2, name: 'Figma' },
  //     { id: 3, name: 'Python' },
  //     { id: 4, name: 'Adobe Photoshop' },
  //     { id: 5, name: 'Adobe Illustrator' },
  //     { id: 6, name: 'Angular' },
  //     { id: 7, name: 'PHP' },
  // ];

  control = new FormControl();
  streets: string[] = ['Ludhiana', 'Chandigarh', 'Gurgaon'];
  titles: any = [];

  workType: any[] = [{ value: 'apprenticeship', name: 'Apprenticeship' }, { value: 'job', name: 'Employment' }, { value: 'Internship', name: 'Internship' }];
  contractType: any[] = [{ value: 'any', name: 'Any' }, { value: 'full_time', name: 'Full Time' }, { value: 'part_time', name: 'Part Time' }, { value: 'casual', name: 'Casual' }, { value: 'temp_contract', name: 'Temp/Contract' }];
  essentials: FormGroup;
  currentTabEmp: any = 'custom';
  field: any;
  field1: any;
  accesstoken: any
  field2: any;
  field3: any;
  inputValue: any;
  editorForm: FormGroup;
  jobDetailsForm: FormGroup;
  description: any;
  screeningForm: FormGroup;
  Optionalform: FormGroup;
  industrylist: any = [];
  skillsLength = 0;
  buttonName: any = 'never'
  skills: any;
  button: any;
  descr: any;
  skillsevent: any;
  industry: any;
  industryName: any = "Select";
  companyName: any;
  web_url: any;
  is_web_url: boolean = false;
  searchValue: any = '';
  searchValue1: any = '';
  searchValue2: any = '';
  searchValue3: any = '';
  minCurrentDate: any = Date;
  any: boolean = false;
  arr: any = [];
  heading: any;
  contractTypeName: any;
  draftIcon: any;
  draftresp: any;
  searchValue4: any;
  cust: boolean = true
  maxValue: any;
  minValue: any;
  successPage: boolean = false;
  googlePlaceOptions: any = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    // types: ["establishment"],
    types: ['(regions)']
  }
  address: any;

  addressEvent: any;
  aaaa: any;
  draftDetail: any;
  industryId: any;
  rights1: any = [];
  contractTypeValue: any;
  question_answers: any = [];
  new_arr: any;
  searchValue5: any;
  applicant_notified: any;
  @ViewChild('employerStepper', {read:MatStepper}) employerStepper:MatStepper;

  steps: MatStep[] = [];
  isNotifyToEmployer: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef

  ) {
    //this.currentTabEmp= 'custom'
    this.essentials = this.fb.group({
      'companyName': ['', [Validators.required]],
      'companyTitle': ['', [Validators.required, Validators.maxLength(64)]],
      'industry': ['', [Validators.required]],
      'location': ['', [Validators.required]],
      'latitude': ['', Validators.required],
      'longitude': ['', Validators.required],
      'rights': ['', [Validators.required]],
      'private_advertiser': [false],
      'remote_working': [false],
      'make_it_requirement': [false],
      'is_web_url': [false],
      'web_url': ['']
    })

    this.setDescription();

    if (this.route.snapshot.params["id"]) {
      this.employer_job_post_id = this.route.snapshot.params["id"];
    }

    this.editorForm = this.fb.group({
      'about': ['', [Validators.required, Validators.minLength(50)]],
      'job_resp': ['', [Validators.required, Validators.minLength(50)]],
      'qualfctn_exp': ['', [Validators.required, Validators.minLength(50)]],
    })
    this.jobDetailsForm = this.fb.group({
      'description': ['', [Validators.required, Validators.minLength(150)]],
      'workType': ['', [Validators.required]],
      'contractType': ['', [Validators.required]],
      'skills': ['', [Validators.required]]
    })
    this.screeningForm = this.fb.group({
      'cover_letter': [true],
      'additional_question': [false],
      'Questions': this.fb.array([]),
    })
    this.Optionalform = this.fb.group({
      'deadline_date': ['', []],
      'default_deadline': [false],
      'on_going_ad_post': [false],
      'expected_start_date': ['',],
      'minimum_sal': ['', [Validators.maxLength(8)]],
      'maximum_sal': ['', [Validators.maxLength(8)]],
      'sal_type': ['year', Validators.required],
      'disclose_salary': [false]
    })



  }

  validateScore(
    control: AbstractControl
  ): ValidationErrors | null {
    console.log(control.get("maximum_sal"))
    if (control && control.get("maximum_sal") && control.get("minimum_sal")) {
      const highscore = control.get("maximum_sal")?.value;
      console.log('highscore: ', highscore);
      const lowscore = control.get("minimum_sal")?.value;
      console.log('lowscore: ', lowscore);
      return ((lowscore) > (highscore)) ? { scoreError: true } : null
    }
    return null;
  }

  checkOrg: boolean = false;
  getMultipleSkillsByIds(ids: any) {
    var obj = {
      skills_ids: ids
    }
    this.service.getSkillDetailsFromArrayOfIds(obj).subscribe((res: any) => {
      this.skills = res.data
      this.skillsLength = this.skills.length
      this.skillsevent = this.skills
      // console.log("abcdefghijklmnopqrstuvwxyz", this.skills, res);
    })
  }
  // draftdetails() {
  //   var obj = {
  //     employer_job_id: this.route.snapshot.params["id"]
  //   }
  //   this.service.draftdetails(obj).subscribe((data: any) => {
  //     console.log("dattaaaaa", data);
  //     this.currentTabEmp = 'custom';

  //     this.draftDetail = data.data
  //     this.buttonName = data.data.applicant_notified
  //     this.getMultipleSkillsByIds(this.draftDetail.skills)
  //     setTimeout(() => {
  //       this.industrylist.find((s: any) => {
  //         if (s._id == this.draftDetail.industry_id) {
  //           this.industryName = s.name
  //           this.industryId = s._id
  //         }
  //       })
  //       this.Optionalform.patchValue({
  //         default_deadline: this.draftDetail.default_deadline,
  //         on_going_ad_post: this.draftDetail.on_going_ad_post

  //       })

  //       var date1 = new Date();
  //       var date2 = new Date(this.draftDetail.deadline_date);
  //       var Difference_In_Time = date2.getTime() - date1.getTime();

  //       var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  //       console.log(Difference_In_Days.toFixed(0))
  //       this.days = Difference_In_Days.toFixed(0)
  //       console.log(this.days)

  //       this.workType.find((s: any) => {
  //         s.value == this.draftDetail.work_type
  //         //  this.contractTypeName = s.name
  //         this.woktypeValue = s.value
  //       })
  //       this.contractType.find((s: any) => {
  //         s.value == this.draftDetail.contract_type
  //         this.contractTypeName = s.name
  //         this.contractTypeValue = s.value
  //       })
  //       if (this.draftDetail.additional_question == true) {
  //         this.ifChecked = true
  //       }
  //       if (this.draftDetail.additional_question == false) {
  //         this.ifChecked = false
  //       }
  //       if (this.draftDetail.default_deadline == true) {
  //         this.check1 = true
  //       }
  //       if (this.draftDetail.default_deadline == false) {
  //         this.check1 = false
  //       }
  //       if (this.draftDetail.disclose_salary == true) {
  //         this.check2 = true
  //       }
  //       if (this.draftDetail.disclose_salary == false) {
  //         this.check2 = false
  //       }
  //       // this.draftDetail.question_answers.find((s:any)=>{
  //       //     this.draftDetail.question_answers.slice(s._id)
  //       //     console.log("QUESANS====",this.draftDetail.question_answers);

  //       // })
  //       this.new_arr = this.draftDetail.question_answers.map((val: any) => {
  //         this.additems(val.question);

  //         delete val._id
  //         return val
  //       })


  //       console.log("yipeeeeeee", this.new_arr)
  //       this.draftDetail?.work_rights.forEach((item: any) => {
  //         if (item != 'Any') {
  //           this.rights = [
  //             { id: 1, name: 'Student Visa' },
  //             { id: 2, name: 'Full Time Work Rights' },
  //             { id: 3, name: 'Citizen/Permanent Resident' },
  //             { id: 4, name: 'Any', disabled: 'Any' },
  //           ];
  //         }
  //       })

  //       for (let i = 0; i < this.draftDetail?.work_rights?.length; i++) {
  //         for (let j = 0; j < this.rights?.length; j++) {
  //           if (this.rights[j]?.name == this.draftDetail?.work_rights[i]) {
  //             this.rights1.push(this.rights[j])
  //           }
  //         }

  //         // console.log("selectedAttributes====", this.rights1);
  //       }
  //       // this.essentials.patchValue({
  //       //   rights:this.rights1
  //       // })
  //       this.city = this.draftDetail.city
  //       this.state = this.draftDetail.state
  //       this.country = this.draftDetail.country
  //       this.address = this.draftDetail.formatted_address
  //       this.flength = this.draftDetail.address_components_length
  //       this.suburb = this.draftDetail.suburb;
  //       this.is_web_url = this.draftDetail?.is_web_url;
  //       this.web_url = this.draftDetail?.web_url;
  //       if (this.draftDetail) {
  //         console.log("DRAFT DETAILS====", this.draftDetail);
  //         // this.rights=this.rights1
  //         if (localStorage.getItem('convert')) {


  //           this.essentials.patchValue({
  //             companyName: this.companyName,
  //             companyTitle: this.draftDetail?.job_title,
  //             location: this.draftDetail?.job_location?.name,
  //             latitude: this.draftDetail?.job_location?.latitude,
  //             longitude: this.draftDetail?.job_location?.longitude,
  //             industry: this.industryId,
  //             rights: this.draftDetail.work_rights,
  //             private_advertiser: this.draftDetail?.advertise_company,
  //             remote_working: this.draftDetail?.remote_work,
  //             make_it_requirement: this.draftDetail?.make_it_requirement,
  //             is_web_url: this.draftDetail?.is_web_url,
  //             web_url: this.draftDetail?.web_url
  //           })
  //         } else {
  //           this.essentials.patchValue({
  //             companyName: this.draftDetail?.company_name,
  //             companyTitle: this.draftDetail?.job_title,
  //             location: this.draftDetail?.job_location?.name,
  //             latitude: this.draftDetail?.job_location?.latitude,
  //             longitude: this.draftDetail?.job_location?.longitude,
  //             industry: this.industryId,
  //             rights: this.draftDetail.work_rights,
  //             private_advertiser: this.draftDetail?.advertise_company,
  //             remote_working: this.draftDetail?.remote_work,
  //             make_it_requirement: this.draftDetail?.make_it_requirement,
  //             is_web_url: this.draftDetail?.is_web_url,
  //             web_url: this.draftDetail?.web_url
  //           })
  //         }
  //         this.jobDetailsForm.patchValue({
  //           description: this.draftDetail.job_description,
  //           workType: this.getWorkTypedraft(this.draftDetail.work_type),
  //           contractType: this.draftDetail.contract_type,
  //           skills: this.draftDetail.skills,
  //         })
  //         this.editorForm.patchValue({
  //           description: this.draftDetail.job_description,

  //         })
  //         console.log('cdscscsdcdscs', this.editorForm)
  //         this.screeningForm.patchValue({
  //           cover_letter: this.draftDetail?.cover_letter,
  //           additional_question: this.draftDetail?.additional_question,
  //           // Questions:  this.new_arr,
  //         })
  //         if (localStorage.getItem('convert')) {



  //         } else {
  //           this.Optionalform.patchValue({
  //             deadline_date: this.draftDetail?.deadline_date,
  //             default_deadline: this.draftDetail?.default_deadline,
  //             on_going_ad_post: this.draftDetail?.on_going_ad_post,
  //             expected_start_date: this.draftDetail?.expected_start_date,
  //             minimum_sal: Number(this.draftDetail?.salary?.minimum_sal).toLocaleString(),
  //             maximum_sal: Number(this.draftDetail?.salary?.maximum_sal).toLocaleString(),
  //             sal_type: this.draftDetail?.salary?.sal_type,
  //             disclose_salary: this.draftDetail?.disclose_salary

  //           })
  //         }
  //         this.minsal()
  //         this.maxsal()
  //         this.check3 = this.draftDetail?.disclose_salary
  //         this.description = this.draftDetail.job_description
  //         // console.log('this.Optionalform: ', this.Optionalform);
  //       }
  //     }, 3000);
  //     //     this.industrylist.find((s:any)=>{
  //     //         s._id==this.draftDetail.industry_id
  //     //         this.industryName=s.name
  //     //         this.industryId=s._id
  //     //     })
  //     //     for(let i =0; i<this.draftDetail?.work_rights?.length; i++){
  //     //         for(let j=0; j<this.rights?.length; j++){
  //     //             if(this.rights[j]?.name==this.draftDetail?.work_rights[i]){
  //     //                 this.selectedAttributes.push(this.rights[j])
  //     //             }
  //     //         }
  //     //         console.log("selectedAttributes====",this.selectedAttributes);
  //     //     }


  //     //     if (this.draftDetail) {
  //     //         console.log("DRAFT DETAILS====",this.draftDetail);

  //     //         this.essentials.patchValue({
  //     //             companyName: this.draftDetail?.company_name,
  //     //             companyTitle: this.draftDetail?.job_title,
  //     //             location: this.draftDetail?.job_location.name,
  //     //             latitude: this.draftDetail?.job_location.latitude,
  //     //             longitude:this.draftDetail?.job_location.longitude,
  //     //             industry: this.industryId,
  //     //             rights: this.draftDetail.work_rights,
  //     //             private_advertiser: this.draftDetail?.advertise_company,
  //     //             remote_working: this.draftDetail?.remote_work
  //     //         })
  //     //         this.jobDetailsForm.patchValue({
  //     //             description: this.draftDetail.job_description,
  //     //             workType: this.draftDetail.work_type,
  //     //             contractType: this.draftDetail.contract_type,
  //     //             skills: this.skills,
  //     //         })
  //     //   }

  //     console.log("this.draftDetail.skills", this.jobDetailsForm)
  //   })
  // }


  setDescription(): void {
    this.description = `
                <h4 style="
                color: #545465; margin-bottom:-10px;">About the Company</h4>
                <p class=""></p>
                <h4 style="
                color: #545465; margin-bottom:-10px;">Job Roles/Responsibilities</h4>
                <p class=""></p>
                <h4 style="
                color: #545465; margin-bottom:-10px;">Qualifications/Experience</h4>
                <p class=""></p>`
  }
  ngOnInit() {
    this.cust = true
    console.log(this.currentTabEmp)
    this.currentTabEmp = 'guided';

    this.getAccesstoken();
    console.log("rightss=====>", this.rights);
    if (localStorage.getItem('edit')) {
      this.isedit = true
    }
    this.getProfile();
    this.industryList()
    if (this.route.snapshot.params["id"]) {
      // this.draftdetails()
      //     if (this.draftDetail) {
      //         console.log("DRAFT DETAILS====",this.draftDetail);

      //         this.essentials.patchValue({
      //             companyName: this.draftDetail?.company_name,
      //             companyTitle: this.draftDetail?.job_title,
      //             location: this.draftDetail?.job_location,
      //             industry: this.aaaa,
      //             rights: this.draftDetail?.work_rights,
      //             private_advertiser: this.draftDetail?.advertise_company,
      //             remote_working: this.draftDetail?.remote_work
      //         })
      //         this.jobDetailsForm.patchValue({
      //             description: this.draftDetail.job_description,
      //             workType: this.draftDetail.work_type,
      //             contractType: this.draftDetail.contract_type,
      //             skills: this.skills,
      //         })
      //   }
    }

    else {
      this.getMultipleSkillsByIds(this.route.snapshot.queryParams.skills)
      this.essentials.patchValue({
        companyTitle: this.route.snapshot.queryParams.job_title,
        location: this.route.snapshot.queryParams.locationname,
        latitude: this.route.snapshot.queryParams.locationlat,
        longitude: this.route.snapshot.queryParams.locationlong,
      })
      this.jobDetailsForm.patchValue({
        skills: this.route.snapshot.queryParams.skills
      })
    }

    // this.jobTitle=this.route.snapshot.queryParams.job_title
    // this.location=this.route.snapshot.queryParams.location
    this.cover_letter = true
    this.minCurrentDate = new Date();
    var maxNewDate = new Date();
    this.maxDate = new Date(maxNewDate.getFullYear(), maxNewDate.getMonth() + 3, maxNewDate.getDate());
    this.minDate = new Date(maxNewDate.getFullYear(), maxNewDate.getMonth(), this.minCurrentDate.getDate() + 3);
    // console.log(this.minDate, this.maxDate, this.minCurrentDate, maxNewDate);

    $('.loc_choose').hide();
    // $('.nex_btn').click(function(){
    // 	if ($(this).hasClass('finl_tab')) {
    // 		$('.insid_info').html('<h2>All done! Preview Your Job Post</h2>');
    // 	}else{
    // 		$('.insid_info').html('<h2>Create your job in just 4 easy steps!</h2>');
    // 	}
    // 	$('.search_process').slideUp();
    // 	$(this).closest('.search_process').next('.search_process').slideDown();
    // });
    // $('.prev_btn').click(function(){
    // 	if ($(this).hasClass('back_finl_tab')) {
    // 		$('.insid_info').html('<h2>Create your job in just 4 easy steps!</h2>');
    // 	}
    // 	$('.search_process').slideUp();
    // 	$(this).closest('.search_process').prev('.search_process').slideDown();
    // });
  }
  reload() {
    this.successPage = false;
  }
  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  scrollToMessage(messageId: any) {
    // inside ngAfterViewInit() to make sure the list items render or inside ngAfterViewChecked() if you are anticipating live data using @Inputs
    const messageToScrollTo = document.getElementById(messageId)
    // null check to ensure that the element actually exists
    if (messageToScrollTo) {
      messageToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }
  onKeydown(event: any) {
    if (event.key === "Enter") {
      console.log(event);
    }
  }

  workrights(e: any) {

    this.rights = e


    if (this.rights.find((e: any) => e.name == 'Any')) {

      this.rights = [
        { id: 1, name: 'Student Visa', disabled: 'Any' },
        { id: 2, name: 'Full Time Work Rights', disabled: 'Any' },
        { id: 3, name: 'Citizen/Permanent Resident', disabled: 'Any' },
        { id: 4, name: 'Any' },
      ];
      if (this.rights.find((e: any) => e.name == 'Any')) {
        this.any = true
      }
      this.any = false
    }
    else if (this.rights.find((e: any) => e.name != 'Any')) {
      this.rights = [
        { id: 1, name: 'Student Visa' },
        { id: 2, name: 'Full Time Work Rights' },
        { id: 3, name: 'Citizen/Permanent Resident' },
        { id: 4, name: 'Any', disabled: 'Any' },
      ];
    }
    else {
      this.rights = [
        { id: 1, name: 'Student Visa' },
        { id: 2, name: 'Full Time Work Rights' },
        { id: 3, name: 'Citizen/Permanent Resident' },
        { id: 4, name: 'Any' },
      ];
    }
  }
  getProfile() {
    this.service.getProfile(this.employer_job_post_id).subscribe(res => {
      // console.log("fdfdfdfdf", res.profile);
      this.companyName = res.profile.company_name
    },
      err => {
        // console.log(err);
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        })
      })
  }
  hello(e: any) {
    // console.log("helllooooooo", e);
    this.industryName = e.option.viewValue
    // console.log("helllooooooo", this.industryName);

  }
  getTimeSlotsAccToSelectedDate(date: any) {
    console.log(date)
    var date1 = new Date();
    var date2 = new Date(date);
    var Difference_In_Time = date2.getTime() - date1.getTime();

    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days.toFixed(0))
    this.days = Difference_In_Days.toFixed(0)
    console.log(this.days)
  }
  hello2(e: any) {
    // console.log("helllooooooo", e);
    this.contractTypeName = e.option.viewValue
    // console.log("helllooooooo", this.contractTypeName);

  }
  search(e: any) {
    // console.log("search value====", e);
    this.searchValue = e.target.value
    this.industryList()
  }
  search1(e: any) {
    // console.log("search value====", e);
    this.searchValue1 = e.target.value
    this.streets = ['Ludhiana', 'Chandigarh', 'Gurgaon'];
    this.streets = this.streets.filter((s: any) => s.includes(this.searchValue1))
  }
  search2(e: any) {
    this.searchValue2 = e.target.value
    this.workType = [{ value: 'Apprenticeship', name: 'Apprenticeship' }, { value: 'job', name: 'Employment' }, { value: 'Internship', name: 'Internship' }];
    this.workType = this.workType.filter((s: any) => s.name.includes(this.searchValue2))
  }
  search3(e: any) {
    this.searchValue3 = e.target.value
    this.contractType = [{ value: 'Full Time', name: 'Full Time' }, { value: 'Part Time', name: 'Part Time' }, { value: 'casual', name: 'Casual' }, { value: 'temp_contract', name: 'Temp/Contract' }];
    this.contractType = this.contractType.filter((s: any) => s.name.includes(this.searchValue3))
  }
  industryList() {
    let param = 'search='
    this.service.getIndustry(param).subscribe(res => {
      console.log(res)
      console.log("DSFDFDFDFDSFdsf", res);
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.industrylist = res.data
      this.industrylist = this.industrylist.filter((s: any) => s.name.includes(this.searchValue))

    })

  }
  search4(e: any) {
    if (e.target.value == '') {
      return
    } else {
      this.searchValue4 = e.target.value
      this.skillsList()

    }

  }
  getAccesstoken() {
    this.service.gettokenskill().subscribe((res: any) => {
      this.accesstoken = res.data.access_token
      //  this.savedSearchList = res.data;
      // this.savedSearchCount = res.count
    });
  }
  skillsList() {
    let a = this.searchValue4.replace(/%20/g, " ");

    let param = 'search=' + a + '&token_type=Bearer&access_token=' + this.accesstoken
    let obj = {
      'search': a,
      'token_type': 'Bearer',
      'access_token': this.accesstoken
    }
    this.service.getSkillList(obj).subscribe(res => {
      // console.log("===========================", res);
      this.skills = res.data

    })
  }
  search5(e: any) {
    this.searchValue5 = e.target.value
    this.getTitleList()
  }
  getTitleList() {
    this.service.getJobTitleSuggestions(this.searchValue5).subscribe((res: any) => {
      this.titles = res.data
      console.log("TITLESSS=============", this.titles);

    })
  }
  onChangeAnalyst(e: any) {

    this.skillsLength = e.length
    this.skillsevent = e

    console.log("eventttttt===========", this.skillsLength);

  }
  fun2(stepper: MatStepper) {

    // console.log("hheyyyyyy please",this.currentTabEmp,this.editorForm,this.jobDetailsForm,this.skillsLength);
    if (this.currentTabEmp == 'guided') {
      this.description = `
            <div style="margin-bottom:22px !important;">
              <h4 style="
              color: #545465; margin-bottom:-10px;">About the Company</h4>
              <p class="">${this.editorForm.value.about}</p>
            </div>
            <div style="margin-bottom:22px !important;">
              <h4 style="
              color: #545465; margin-bottom:-10px;">Job Roles/Responsibilities</h4>
              <p class="">${this.editorForm.value.job_resp}</p>
            </div>
            <div style="margin-bottom:22px !important;">
              <h4 style="
              color: #545465; margin-bottom:-10px;">Qualifications/Experience</h4>
              <p class="">${this.editorForm.value.qualfctn_exp}</p></div>`
      this.jobDetailsForm.value.description = this.description
      console.log(this.jobDetailsForm.value.description, this.description)
    }

    if (this.currentTabEmp == 'guided' && this.editorForm.invalid) {
      this.checkOrg = false;
      this.editorForm.markAllAsTouched()
    }
    else if (((this.jobDetailsForm.invalid) && (this.jobDetailsForm.controls['description'].status == 'INVALID' && this.editorForm.invalid)) || (this.skillsLength < 3)) {
      this.checkOrg = false;
      this.jobDetailsForm.markAllAsTouched()

    } else {
      this.getProfileSun();

      this.checkOrg = true;
      stepper.next();

    }

    console.log("JOBDETAILSssssssssssssssssssssssss=============", this.jobDetailsForm);
  }
  question() {
    console.log("SCreeening=============", this.screeningForm);

  }
  minsal(e?: any) {
    console.log("dsfdsfdsfdsfdf", e);
    this.maxValue = this.Optionalform.value.maximum_sal
    this.minValue = e ? e.target.value : this.Optionalform.value.minimum_sal
    // console.log("this.minValue this.maxValue1",this.minValue,this.maxValue);

    console.log('parseInt(this.maxValue): ', parseInt(this.maxValue));
    console.log('parseInt(this.minValue): ', parseInt(this.minValue));
    if (parseInt(this.minValue) > parseInt(this.maxValue)) {
      this.maxValue = 0
      // console.log("erewrwerrrrrrrrr",this.maxValue);

    }

    //   this.Optionalform.controls['maximum_sal'].setValidators([Validators.min(parseInt(this.minValue))])
    //  this.Optionalform.controls['maximum_sal'].updateValueAndValidity()
    console.log('this.Optionalform: ', this.Optionalform);
    console.log(this.Optionalform.value.minimum_sal)
    this.a = parseInt(this.Optionalform.value.minimum_sal.replace(/,/g, '')),
      this.b = parseInt(this.Optionalform.value.maximum_sal.replace(/,/g, '')),
      console.log(this.a, this.b)
    if (this.a > this.b) {
      this.error = "Maximum salary must be greater than Minimum salary."
      return;
    } else {
      this.error = ""
    }
  }
  maxsal(e?: any) {
    console.log("dsfdsfdsfdsfdf", e, (this.Optionalform.value.maximum_sal), this.Optionalform.value.maximum_sal.replace(/,/g, ''));

    this.maxValue = e ? e.target.value : this.Optionalform.value.maximum_sal
    this.minValue = this.Optionalform.value.minimum_sal
    // console.log("this.minValue this.maxValue2",this.minValue,this.maxValue);

    if (parseInt(this.maxValue) < parseInt(this.minValue)) {
      this.maxValue = 0
      // console.log("erewrwerrrrrrrrr",this.maxValue);
    }
    // this.Optionalform.value.minimum_sal= Number( this.Optionalform.value.minimum_sal)
    this.a = parseInt(this.Optionalform.value.minimum_sal.replace(/,/g, '')),
      this.b = parseInt(this.Optionalform.value.maximum_sal.replace(/,/g, '')),
      console.log(this.a, this.b)
    if (this.a > this.b) {
      this.error = "Maximum salary must be greater than Minimum salary."
      return;
    } else {
      this.error = ""
    }
  }
  optional() {
    console.log("optionallllllllllllllll=============", this.Optionalform, this.a, this.b);
    if (this.a > this.b) {
      //     this.error = "Maximum salary must be greater than Minimum salary."
      console.log('a')
      return;
    } else {
      this.error = ""
    }
    if (!this.Optionalform.valid) {
      return;
    }
    this.heading = this.Optionalform

  }
  getProfileSun(): SafeHtml {
    this.descr = this.sanitizer.bypassSecurityTrustHtml(this.jobDetailsForm?.value?.description)
    return true
    console.log(this.descr)
  }
  optional_back() {
    delete this.heading
  }
  changeTab(e: any) {
    // console.log("FgdfdfgdfgdfgdfgDFGDFGFGFDgfdfgf", e);
    this.currentTabEmp = e
    // if (this.editorForm.invalid) {
    //     this.editorForm.markAllAsTouched()
    //     this.currentTabEmp = 'guided'
    // }
    // else {
    //     this.currentTabEmp = e
    // }
    // console.log("Forrmmmmmmmmmmmmmmmmmmmmmmm===========", this.editorForm);
    // this.about = this.editorForm.value.about
    this.description = `
          <h4 style="
          color: #545465; margin-bottom:-10px;">About the Company</h4>
          <p class="">${this.editorForm.value.about}</p>
          <h4 style="
          color: #545465; margin-bottom:-10px;">Job Roles/Responsibilities</h4>
          <p class="">${this.editorForm.value.job_resp}</p>
          <h4 style="
          color: #545465; margin-bottom:-10px;">Qualifications/Experience </h4>
          <p class="">${this.editorForm.value.qualfctn_exp}</p>`

  }
  input_flds1(e: any) {
    // console.log("inputtttttttttttttt========", e);
    this.field1 = e
  }
  input_flds2(e: any) {
    // console.log("inputtttttttttttttt========", e);
    this.field2 = e
  }
  input_flds3(e: any) {
    // console.log("inputtttttttttttttt========", e);
    this.field3 = e
  }

  checkevent1(event: { checked: boolean; }) {
    // console.log("checkevent1", event);
    if (event.checked == true) {
      this.checkenable1 = true
    }
    else {
      this.checkenable1 = false
    }
  }
  checkevent2(event: { checked: boolean; }) {
    // console.log("checkevent1", event);
    if (event.checked == true) {
      this.checkenable2 = true
    }
    else {
      this.checkenable2 = false
    }

  }
  checkevent3(event: { checked: boolean; }) {
    // console.log("checkevent1", event);
    if (event.checked == true) {
      this.checkenable3 = true
    }
    else {
      this.checkenable3 = false
    }

  }
  checkscreen(event: { checked: boolean; }) {
    // console.log("checkevent1", event);
    if (event.checked == true) {
      this.ifChecked = true
    }
    else {
      this.ifChecked = false
    }

  }
  checkscreen1(event: { checked: boolean; }) {
    // console.log("checkevent1", event);
    if (event.checked == true) {
      this.cover_letter = true
    }
    else {
      this.cover_letter = false
    }

  }
  fun(stepper: MatStepper) {
    console.log(this.essentials.value)
    for (let prop in this.essentials.value) {
      if (prop == "location" && this.addressEvent) {
        this.essentials.value[prop] = {
          name: this.address,
          latitude: this.essentials.value.latitude,
          longitude: this.essentials.value.longitude
        }
        this.essentials.value[prop] = this.essentials.value[prop]
      }
      else if (prop == "location" && !this.addressEvent) {
        this.essentials.value[prop] = {
          name: this.essentials.controls.location.value,
          latitude: this.essentials.value.latitude,
          longitude: this.essentials.value.longitude
        }
        this.essentials.value[prop] = this.essentials.value[prop]
      }

    }

    if (this.essentials.invalid) {
      this.checkOrg = false;
      this.essentials.markAllAsTouched()

    } else {
      this.checkOrg = true;
      if (!this.isedit) {
        this.changeTab('custom');
      }
      stepper.next();
    }

    console.log("Formmmmmmmmmmmmm========", this.essentials);
  }
  questionArr(): FormArray {
    return this.screeningForm.controls["Questions"] as FormArray;

  }
  newquestionArr(question?: string): FormGroup {

    return this.fb.group({
      'question': [question, [Validators.required, Validators.maxLength(120)]],

    })

  }



  additems(question?: any) {
    // this.showingAppendOptions()
    console.log(this.screeningForm.controls["Questions"].value, this.screeningForm.controls["Questions"])




    if (this.QuestionsIndex < 5) {
      this.questionArr().push(this.newquestionArr(question));
      this.QuestionsIndex = (this.QuestionsIndex + 1)
    }
    else {
      // console.log("Use Only 5 question")

    }

  }
  removeitems(QuestionsIndex: number) {

    this.questionArr().removeAt(QuestionsIndex)
    this.QuestionsIndex = (this.QuestionsIndex - 1)


  }
  changebutton(e: any) {
    // console.log("change butoon", e);
    this.buttonName = e.target.name
    this.button = e.target.innerHTML

  }

  showOptions1(value: boolean) {
    if (value == false) {
      this.check1 = true
      this.Optionalform.controls["deadline_date"].clearValidators();
      this.Optionalform.controls['deadline_date'].setValidators([Validators.required]);
      this.Optionalform.controls['deadline_date'].updateValueAndValidity();

    } else {
      this.check1 = false
      this.Optionalform.controls["deadline_date"].clearValidators();
      this.Optionalform.controls['deadline_date'].updateValueAndValidity();
    }
  }

  showOptions2(value: boolean) {
    if (value == false) {
      this.check2 = true
      this.Optionalform.controls["expected_start_date"].clearValidators();
      this.Optionalform.controls['expected_start_date'].setValidators([Validators.required]);
      this.Optionalform.controls['expected_start_date'].updateValueAndValidity();
    } else {
      this.check2 = false
      this.Optionalform.controls["expected_start_date"].clearValidators();
      this.Optionalform.controls['expected_start_date'].updateValueAndValidity();
    }
  }
  showOptions3(value: boolean) {
    // console.log("optional form===========", this.Optionalform);

    if (value == false) {
      this.check3 = true
      this.Optionalform.controls["minimum_sal"].clearValidators();
      this.Optionalform.controls['minimum_sal'].setValidators([Validators.required]);
      this.Optionalform.controls["maximum_sal"].clearValidators();
      this.Optionalform.controls['maximum_sal'].setValidators([Validators.required]);
      this.Optionalform.controls['minimum_sal'].updateValueAndValidity();
      this.Optionalform.controls['maximum_sal'].updateValueAndValidity();
    } else {
      this.check3 = false
      this.Optionalform.controls["minimum_sal"].clearValidators();
      this.Optionalform.controls["maximum_sal"].clearValidators();
      this.Optionalform.controls['minimum_sal'].updateValueAndValidity();
      this.Optionalform.controls['maximum_sal'].updateValueAndValidity();
    }
  }

  handleAddressChange(event: any) {
    console.log("address change", event);
    this.addressEvent = event
    let latitude, longitude, location = '';

    this.flength = event.address_components.length

    if (event.geometry && event.name && event.formatted_address) {
      for (let i = 0; i < event.address_components.length; i++) {
        // console.log(event.address_components[i].types)
        if (event.address_components[i].types[0] == "administrative_area_level_1") {
          console.log('yes', event.address_components[i])
          this.state = event.address_components[i].long_name
        }
        if (event.address_components[i].types[0] == "administrative_area_level_2") {
          console.log('yes', event.address_components[i])
          this.city = event.address_components[i].long_name
        }
        if (event.address_components[i].types[0] == "locality" || event.address_components[i].types[0] == "colloquial_area") {
          console.log('yes', event.address_components[i])
          this.suburb = event.address_components[i].long_name

        }
        if (event.address_components[i].types[0] == "country") {
          console.log('yes', event.address_components[i])
          this.country = event.address_components[i].long_name

        }
      }
      this.essentials.controls['latitude'].patchValue(JSON.parse(JSON.stringify(event.geometry.location)).lat);
      this.essentials.controls['longitude'].patchValue(JSON.parse(JSON.stringify(event.geometry.location)).lng);
      console.log("Adressssss", this.essentials);


      this.address = event.formatted_address

    }
  }
  employerJobPost() {
    console.log('this.essentials.value.make_it_requirement', this.essentials.value.make_it_requirement)
    for (let prop in this.essentials.value) {
      if (prop == "location" && this.addressEvent) {
        this.essentials.value[prop] = {
          name: this.address,
          latitude: this.essentials.value.latitude,
          longitude: this.essentials.value.longitude
        }
        this.essentials.value[prop] = this.essentials.value[prop]
      }
      else if (prop == "location" && !this.addressEvent) {
        this.essentials.value[prop] = {
          name: this.essentials.controls.location.value,
          latitude: this.essentials.value.latitude,
          longitude: this.essentials.value.longitude
        }
        this.essentials.value[prop] = this.essentials.value[prop]
      }

    }

    var obj: any = {
      make_it_requirement: this.essentials.value.make_it_requirement,

      company_name: this.essentials.value.companyName,
      advertise_company: this.essentials.value.private_advertiser,
      job_title: this.essentials.value.companyTitle,
      industry_id: this.essentials.value.industry,
      job_location: this.essentials.value.location,
      remote_work: this.essentials.value.remote_working,
      work_rights: this.essentials.value.rights,
      work_type: this.getWorkType(this.jobDetailsForm.value.workType),
      contract_type: this.jobDetailsForm.value.contractType,
      skills: this.jobDetailsForm.value.skills,
      cover_letter: this.screeningForm.value.cover_letter,
      additional_question: this.screeningForm.value.additional_question,
      question_answers: this.screeningForm.value.Questions,
      default_deadline: this.Optionalform.value.default_deadline,
      on_going_ad_post: this.Optionalform.value?.on_going_ad_post,
      deadline_date: this.Optionalform.value.deadline_date,
      expected_start_date: this.Optionalform.value.expected_start_date,
      disclose_salary: this.Optionalform.value.disclose_salary,
      applicant_notified: this.applicant_notified,
      job_description: this.jobDetailsForm.value.description,
      //  city: this.city,
      //   state: this.state,
      //   country: this.country,
      //   suburb: this.suburb,
      formatted_address: this.address,
      address_components_length: this.flength,
      salary: { "minimum_sal": this.Optionalform.value.minimum_sal.replace(/,/g, ''), "maximum_sal": this.Optionalform.value.maximum_sal.replace(/,/g, ''), "sal_type": this.Optionalform.value.sal_type },
      web_url: this.essentials.value.web_url,
      is_web_url: this.essentials.value.is_web_url,
    }
    console.log(obj)
    if (this.essentials.value.make_it_requirement == false) {
      obj.make_it_requirement = 'false'

    }
    if (this.employer_job_post_id) {
      // obj.employer_job_post_id = this.employer_job_post_id;
      obj.user_id = this.employer_job_post_id;
    }

    //  obj.employer_job_post_id = this.essentials.value.make_it_requirement;



    for (let property in obj) {
      // console.log("werwerwretgfregt", property);


      if (!obj[property]) {
        if (!(property === 'is_web_url' || property === "web_url" || property === "on_going_ad_post")) {
          delete obj[property];
        }
      }
    }
    this.Optionalform.value.minimum_sal = parseInt(this.Optionalform.value.minimum_sal),
      this.Optionalform.value.maximum_sal = parseInt(this.Optionalform.value.maximum_sal)

    obj.is_draft = false
    obj.cover_letter = this.screeningForm.value.cover_letter,
      console.log("objjeeccttttt", obj);
    obj['is_notify_to_employer'] = this.isNotifyToEmployer;
    this.service.employerJobPost(obj).subscribe(res => {
      // console.log("responseeeee", res);
      this.successPage = true
      localStorage.removeItem('edit')
      if (localStorage.getItem('convert')) {
        // this.convert()
      }
    }, err => {
      // console.log(err);

      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      })
    })
  }
  convert() {
    let obj = {
      shortlist_id: this.employer_job_post_id
    }
    this.service.converttoAd(obj).subscribe((res) => {
      //this.jobList();
      this.router.navigate(['/employer/employer-job-creation/' + res.employer_job_post_id]);
      localStorage.removeItem('convert')
    });
  }
  getWorkType(workType: string): string {
    console.log(workType)
    if (workType == "job") {
      return "job"
    } else if (workType == "Internship") {
      return "internship"
    } else if (workType == "apprenticeship") {
      return "apprenticeship"
    } else {
      return "";
    }

  }
  getWorkTypedraft(workType: string): string {
    console.log(workType)
    if (workType == "job") {
      return "job"
    } else if (workType == "internship") {
      return "Internship"
    } else if (workType == "apprenticeship") {
      return "apprenticeship"
    } else {
      return "";
    }

  }

  employersaveDraft(i: any) {
    // console.log("dsfdsfdsfdsfdsfdfdsfdsf", i);
    this.draftIcon = i
    if (this.currentTabEmp == 'guided') {
      this.description = `
              <h4 style="
              color: #545465; margin-bottom:-10px;">About the Company</h4>
              <p class="">${this.editorForm.value.about}</p>
              <h4 style="
              color: #545465; margin-bottom:-10px;">Job Roles/Responsibilities</h4>
              <p class="">${this.editorForm.value.job_resp}</p>
              <h4 style="
              color: #545465; margin-bottom:-10px;">Qualifications/Experience</h4>
              <p class="">${this.editorForm.value.qualfctn_exp}</p>`
      this.jobDetailsForm.value.description = this.description
      console.log(this.jobDetailsForm.value.description, this.description)
    }
    var obj: any = {
      is_draft: true,
      company_name: this.essentials.value.companyName,
      advertise_company: this.essentials.value.private_advertiser,
      job_title: this.essentials.value.companyTitle,
      industry_id: this.essentials.value.industry,
      job_location: this.essentials.value.location,
      remote_work: this.essentials.value.remote_working,
      work_rights: this.essentials.value.rights,
      make_it_requirement: this.essentials.value.make_it_requirement,
      work_type: this.getWorkType(this.jobDetailsForm.value.workType),
      contract_type: this.jobDetailsForm.value.contractType,
      skills: this.jobDetailsForm.value.skills,
      cover_letter: this.screeningForm.value.cover_letter,
      additional_question: this.screeningForm.value.additional_question,
      question_answers: this.screeningForm.value.Questions,
      default_deadline: this.Optionalform.value.default_deadline,
      on_going_ad_post: this.Optionalform.value.on_going_ad_post,
      deadline_date: this.Optionalform.value.deadline_date,
      expected_start_date: this.Optionalform.value.expected_start_date,
      disclose_salary: this.Optionalform.value.disclose_salary,
      applicant_notified: this.applicant_notified,
      job_description: this.jobDetailsForm.value.description,
      //  applicant_notified 
      //  city: this.city,
      //   state: this.state,
      //   country: this.country,
      //   suburb: this.suburb,
      formatted_address: this.address,
      address_components_length: this.flength,
      salary: { "minimum_sal": this.Optionalform.value.minimum_sal.replace(/,/g, ''), "maximum_sal": this.Optionalform.value.maximum_sal.replace(/,/g, ''), "sal_type": this.Optionalform.value.sal_type },
      web_url: this.essentials.value.web_url,
      is_web_url: this.essentials.value.is_web_url
    }

    if (this.employer_job_post_id) {
      obj.employer_job_post_id = this.employer_job_post_id;
    }


    // for (let property in obj) {
    //   // console.log("werwerwretgfregt", property);


    //   if (!obj[property]) {

    //     delete obj[property];
    //   }
    // }
    // console.log("objjeeccttttt", obj);
    this.service.employerJobPost(obj).subscribe(res => {
      // console.log("ho gya ...oye balle balle", res);
      this.draftresp = res.code
      delete this.draftIcon
      this.employer_job_post_id = res.data._id

      // console.log("rwejrhtjhrehkjteyuytuytrutu", this.draftresp);

      this.service.showMessage({
        message: "Draft has been saved Successfully"
      })
    }, err => {
      // console.log(err);
      delete this.draftIcon

      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      })
    })
  }

  clearLocation() {
    this.essentials.patchValue({
      latitude: "",
      longitude: ""
    })
  }

  cancelJobPost() {
    if (Object.keys(this.route.snapshot.queryParams).length) { //if query params exists job posting is from search graduate page 
      this.router.navigate(
        ["/employersList"],
        {
          queryParamsHandling: 'preserve'
        }
      )
    } else {   //otherwise go back to the main job post page
      this.router.navigateByUrl('/employersList');
    }
  }
  applicant_notifiedOption(type: any) {
    this.applicant_notified = type
    this.buttonName = type
  }

  showingAppendOptions() {
    var appendopts: any = document.querySelector('.employerAdding_question');
    console.log(appendopts)
    var dynamicAdd: any = document.querySelector('.dynamic_inpt');
    appendopts.style.display = 'none';
    dynamicAdd.style.display = 'flex';
  }

  selectedWebSiteURL(ev: any) {
    if (ev.value) {
      const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w $?#+=&%@\-]*/?';
      this.essentials.controls['web_url'].setValidators([Validators.required, Validators.pattern(reg)]);
      this.essentials.controls['web_url'].markAsDirty();
      this.web_url = '';
      this.essentials.patchValue({
        web_url: ''
      });
    } else {
      this.essentials.controls['web_url'].clearValidators();
      this.essentials.controls['web_url'].setErrors(null);
      this.web_url = '';
      this.essentials.patchValue({
        web_url: ''
      });
    }
    this.cdr.detectChanges();
  }

  onGoingJobPost(ev: any) {
    this.showOptions1(true);
    this.Optionalform.patchValue({
      default_deadline: false
    });
  }
}
