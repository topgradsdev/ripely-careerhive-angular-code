import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { FilePickerComponent, FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpResponseCode } from '../../enum';
import { FileIconService } from '../../file-icon.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  userDetail: any;
  preference : boolean;
 
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false }
  ];

  selectedDetailTabIndex = 0; 
  isEditContact:boolean = false;
  isEditAdminInfo:boolean = false;
  isthreeInfo:boolean = false;
   contactInfo: FormGroup;
   miscellaneousdetailForm: FormGroup;
   educationdetailForm: FormGroup;
  basicProfileForm: FormGroup;
  travelPreference = 0;

  hidden_blocks: any = {
    work_experience: "",
    education: "",
    licenses: ""
  }

  edit_indexes: any = {
    work_experience: null,
    education: null,
    licenses: null
  }

  media: any = {
    work_experience: [],
    education: [],
    licenses: [],
    documents:[],
  }

  workExperienceForm: FormGroup;
  jobPreferenceForm: FormGroup;
  educationForm: FormGroup;
  licenseForm: FormGroup;
  aboutForm: FormGroup;
  visaForm: FormGroup;
  isEditContactDetail = false;
  isUploadVisa = false;
  isUploadResume = false;
  uploadedVisaFile = null;
  uploadedResumeFile = null;

  companyList = [];
  unilist = [];
  jobSkills = [];
  defaultCompanyImg: string = "https://www.wodonnell.com/wp-content/uploads/2019/02/business-placeholder.png";

  licenses = [
    {name: 'Own Private Transport', selected: false },
    {name: 'Australian Driving License', selected: false },
    {name: 'White Card', selected: false },
    {name: 'Working with Children’s Check', selected: false },
    {name: 'Police Check', selected: false }
  ]

  @Input() studentProfile: any;
  @Output() studentProfileEmit = new EventEmitter();

  googlePlaceOptions: any = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    types: ['(regions)']
  }

  submittedDocuments = [];
  submittedForms = [];
  selectedForm = null;
  slicedDocuments = [];
  slicedForms = [];
  activityLogs = [];
activeTabIndex = 0; // default to first tab

  constructor(private fb: FormBuilder, private fileIconService: FileIconService,
    private service: TopgradserviceService, private http: HttpClient, private sanitizer: DomSanitizer) { }
    searchKeyword:any = '';
    filteredActivities() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) return this.activityLogs;

      return this.activityLogs
        .map((activity) => {
          // Match at parent level (module/sub_module)
          const matchesParent =
            activity.module?.toLowerCase().includes(keyword) ||
            activity.sub_module?.toLowerCase().includes(keyword);

          // Filter inner activities
          const filteredSub = activity.activities.filter((a) =>
            a.activity.toLowerCase().includes(keyword)
          );

          // Include the item only if parent or child matches
          if (matchesParent || filteredSub.length > 0) {
            return { ...activity, activities: filteredSub.length ? filteredSub : activity.activities };
          }

          return null;
        })
        .filter((a) => a !== null);
    }
    
    
    getSafeSvg(documentName: string) {
     return this.fileIconService.getFileIcon(documentName);
    }
    setSelectedEmail(email: any): void {
      this.selectedEmail = { ...email }; // creates a new reference
    console.log("this.selectedEmail", this.selectedEmail)
    }

    ngOnChanges() {
      this.formBuilder();
      this.getStudentProfile();
      console.log("studentProfile", this.studentProfile);
      this.getStudentProfileById(this.documentpage);
      this.getActivityLogs();
      this.getInterviewVideo();
    }


      onDetailTabChanged(event){
    console.log("event", event);
    this.selectedDetailTabIndex = event.index;
  }

    documentpage:any = 1;
    documentlimit:any = 5;
    totaldocuments:any = 0
    totaldocumentList:any = 0
    getStudentProfileById(page) {
      // console.log("page", page);
      this.documentpage = page;
      this.documentlimit = 5;
      const payload = {
        _id: this.studentProfile.student_id,
        "documents_limit": this.documentlimit,
        "documents_offset": this.documentpage-1
      }
      this.service.getStudentProfileById(payload).subscribe((res: any) => {
        // this.documents = res.record.documents;
        // if(res.documents_count <= this.documentlimit){
        //   this.documentlimit = res.documents_count;
        // }
        // this.totaldocumentList = res.documents_count;
        // this.totaldocuments = Math.ceil(res.documents_count/this.documentlimit);
        // console.log(" this.totalNotes",  this.totaldocuments);
        // this.studentProfile = { ...res?.record[0], ...res?.placement_type };
        this.documents = res.record.documents || []; // Handle empty documents array
        this.totaldocumentList = res.documents_count || 0; // Set total document count
        this.totaldocuments = Math.ceil(this.totaldocumentList / this.documentlimit); // Calculate total pages
        console.log("Pagination Info:", {
          totalRecords: this.totaldocumentList,
          totalPages: this.totaldocuments,
          currentPage: this.documentpage,
        });

        this.contactInfo.patchValue({
         address_line_1: res.record.address_line_01,
         email: res.record.email,
         permanent_email: res.record.permanent_email,
         phone_no: res.record.phone_no,
         post_code: res.record.postal_code,
         postal_code: res.record.postal_code,
         suburb: res.record.suburb,
         state: res.record.state,
         country: res.record.country,
         username:res.record.username,
         address: res.record.address,
         permanent_address: res.record.permanent_address,
        })

      this.miscellaneousdetailForm.patchValue({
        accessibility: res.record.accessibility,
        internship_start_date:res.record.internship_start_date,
        internship_end_date: res.record.internship_end_date,
        geographic_preferences: res.record.geographic_preferences,
        advocate_incident_history:res.record.advocate_incident_history,
        advocate_care_history:res.record.advocate_care_history,
      });

      this.educationdetailForm = this.fb.group({
        alumni: res.record.alumni,
        home_campus: res.record.home_campus,
        certificates: res.record.certificates,
        graduation_date: res.record.graduation_date,
        delivery_mode: res.record.delivery_mode,
      });

      // this.contactInfo = this.fb.group({
      //   address_line_1: ["", Validators.required],
      //   email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      //   permanent_email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      //   phone_no: ["", Validators.required],
      //   post_code: ['', Validators.required],
      //   suburb: ['', Validators.nullValidator],
      //   state: ['', Validators.nullValidator],
      //   country: ['', Validators.nullValidator],
      // });
        
  
      });
    }
  
     removeCharacter() {
    this.contactInfo.controls.primary_phone.patchValue(this.contactInfo.value.primary_phone.replace(/[^\dA-Z]/g, ''));
    this.contactInfo.controls.secondary_phone.patchValue(this.contactInfo.value.secondary_phone.replace(/[^\dA-Z]/g, ''));
    this.basicProfileForm.controls.postal_code.patchValue(this.basicProfileForm.value.postal_code.replace(/[^\dA-Z]/g, ''));
  }


  addSpacesInNumberPrimaryPhone() {
    // Remove non-numeric characters
    const rawNumber = this.contactInfo.value.phone_no.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the form control value with the formatted number
    this.contactInfo.controls.phone_no.patchValue(formattedNumber.trim());
  
    // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      this.contactInfo.controls.phone_no.setErrors({ pattern: true });
      return;
    }
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      this.contactInfo.controls.phone_no.setErrors({ pattern: true });
      return;
    }
  }


  addSpacesInNumberSecondaryPhone() {
    // Remove non-numeric characters
    const rawNumber = this.contactInfo.value.secondary_phone.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the form control value with the formatted number
    this.contactInfo.controls.secondary_phone.patchValue(formattedNumber.trim());
  
    // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      this.contactInfo.controls.secondary_phone.setErrors({ pattern: true });
      return;
    }
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      this.contactInfo.controls.secondary_phone.setErrors({ pattern: true });
      return;
    }
  }

    formBuilder(){

      this.contactInfo = this.fb.group({
        address_line_1: ["", Validators.required],
        email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
        permanent_email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
        phone_no: ["", Validators.required],
        post_code: ['', Validators.required],
        postal_code: [''],
        suburb: ['', Validators.nullValidator],
        state: ['', Validators.nullValidator],
        country: ['', Validators.nullValidator],
        username: ['', Validators.nullValidator],
        address: ['', Validators.nullValidator],
        permanent_address: ['', Validators.nullValidator],
      });

      this.miscellaneousdetailForm  = this.fb.group({
        accessibility: ['', Validators.required],
        internship_start_date: ["", Validators.required],
        internship_end_date: ["", Validators.required],
        geographic_preferences: ['', Validators.required],
        advocate_incident_history: ['', Validators.nullValidator],
        advocate_care_history: ['', Validators.nullValidator]
      });

      this.educationdetailForm = this.fb.group({
        alumni: ["", Validators.required],
        home_campus: ["", Validators.required],
        certificates: ['', Validators.required],
        graduation_date: ['', Validators.nullValidator],
        delivery_mode: ['', Validators.nullValidator]
      });

      
      this.basicProfileForm = this.fb.group({
        first_name: [""],
        last_name: [""],
        flexibleSchedule: [false],
        dob: [''],
        travelPreference: [],
        availableDays: [''],
        image: ['']
      });
  
      this.licenseForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(64)]],
        issuing_organization: ['', Validators.maxLength(64)],
        issuing_date: [''],
        expiry_date: [''],
        no_expiry: [false]
      })
  
      this.aboutForm = this.fb.group({
        phone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
        email_secondery: ['', [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
        addressLine1: ['', Validators.required],
        post_code: ['', Validators.required],
        suburb: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', [Validators.required]]
      });
  
      this.visaForm = this.fb.group({
        vgn: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required]
      });
  
      this.jobPreferenceForm = this.fb.group({
        jobPreferences: this.fb.array([ 
          this.fb.group({
            expertise: ["", Validators.nullValidator],
            jobTitle: ["", Validators.required],
            skills: [[]],
            selectedSkills: [[]]
          })
        ])
      });
    }
 
  ngOnInit(): void {
    
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));

    this.formBuilder();
    // this.getJobSkills();
    this.jobTitleList();
    this.getStudentProfile();

    this.searchControl.valueChanges.subscribe((searchText: string) => {
      this.filteredOptions = this._filterOptions(searchText);
    });
  }

  private _filterOptions(searchText: string): string[] {
    const lowerSearchText = searchText.toLowerCase();
    return this.jobTitles.filter(option => option.name.toLowerCase().includes(lowerSearchText) || option.code.toString().toLowerCase().includes(lowerSearchText));
  }
  filteredOptions: string[];
  searchControl = new FormControl();
  jobTitles:any = [];

  jobTitleList() {
    let param = { search: '' };
    this.service.getJobTitle(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.jobTitles = res.data;
      this.filteredOptions = this.jobTitles;
    })

  }

limit = 10;          // number of records per load
offset = 0;          // current offset
activitLimit = 0;    // total records in backend
isLoading = false;   // prevent multiple calls

allActivityLogs: any[] = [];  // full dataset from API


onSearchChange() {
  // Reset scroll & data
  this.activityLogs = [];
  this.allActivityLogs = [];
  // Fetch new data with search filter
  this.getActivityLogs();
}



onScrollDown() {
  // stop if already loading or all data shown
  if (this.isLoading) return;
  if (this.activityLogs.length >= this.allActivityLogs.length) return;
  this.loadMore();
}

getActivityLogs() {
  this.isLoading = true;

  const payload: any = {
    student_id: this.studentProfile.student_id,
  };

  if (this.searchKeyword?.trim()) payload.search = this.searchKeyword.trim();

  this.service.getActivityLogs(payload).subscribe({
    next: (res) => {
      if (res.status === HttpResponseCode.SUCCESS) {
        // store full data (all records from API)
        this.allActivityLogs = res.result || [];

        // initialize visible list with first 20
        this.activityLogs = this.allActivityLogs.slice(0, this.limit);
      }
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;
      this.service.showMessage({
        message:
          err.error?.errors?.msg ||
          'Something went wrong while loading activities',
      });
    },
  });
}

loadMore() {
  this.isLoading = true;
  const nextItems = this.allActivityLogs.slice(
    this.activityLogs.length,
    this.activityLogs.length + this.limit
  );

  // append next 20 items
  this.activityLogs = [...this.activityLogs, ...nextItems];

  this.isLoading = false;
}


  addSpacesInNumber() {
    // Remove non-numeric characters
    const rawNumber = this.aboutForm.value.phone.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the form control value with the formatted number
    this.aboutForm.controls.phone.patchValue(formattedNumber.trim());
  
    // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      this.aboutForm.controls.phone.setErrors({ pattern: true });
      return;
    }
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      this.aboutForm.controls.phone.setErrors({ pattern: true });
      return;
    }
  }
  

  get jobPreferenceArray(): FormArray {
    return this.jobPreferenceForm.controls["jobPreferences"] as FormArray;
  }

  getJobSkills(event?: any) {
    // this.jobPreferenceArray.controls.forEach((preference: any) => {
      const obj = {
        search: event.target.value
      }
      this.service.getSkills(obj).subscribe((res: any) => {
        this.jobSkills = res.data;
      });
    // });
  }

  selectedRecords:any;
  getStudentProfile() {

    console.log("this.studentProfile", this.studentProfile);
  //   const payload = {
  //     _id: this.studentId
  //   }
  // this.service.getStudentProfileById(payload).subscribe((res: any) => {
      // this.studentProfile = { ...res?.record[0], ...res?.placement_type };
      this.days.forEach(day => { 
        const found = this.studentProfile?.available_days?.split(',').find(days => days === day.name);
        if (found) {
          day.selected = true;
        }
      });

      this.selectedRecords = [this.studentProfile];
      this.basicProfileForm.patchValue({
        first_name: this.studentProfile?.first_name,
        last_name: this.studentProfile?.last_name,
        flexibleSchedule: this.studentProfile?.flexible_schedule,
        dob: this.studentProfile?.dob,
        travelPreference: this.studentProfile?.travel_preference,
        availableDays: this.studentProfile?.available_days,
        image: this.studentProfile?.image
      });
      this.travelPreference = this.studentProfile?.travel_preference;

      this.aboutForm.patchValue({
        phone_no: this.studentProfile?.phone_no,
        email: this.studentProfile?.email,
        email_secondery: this.studentProfile?.email_secondery,
        addressLine1: this.studentProfile?.address,
        post_code: this.studentProfile?.postal_code,
        suburb: this.studentProfile?.suburb,
        state: this.studentProfile?.state,
        country: this.studentProfile?.country,
        permanent_address: this.studentProfile?.permanent_address,
      });

      if (this.studentProfile?.licenses?.length > 0) {
        this.licenses.forEach(license => {
          license.selected = this.studentProfile.licenses.some(lic => lic.name === license.name);
        });
      }
    // });
    if(this.studentProfile?.student_id){
      this.getNotes(this.notepage);
    }
    this.getSubmittedDocuments(this.formpage);
    this.getSubmitteddDeclinedDocuments(this.formdDeclinedpage);
    this.getEmails(this.emailpage);
  }

  emitEvent() {
    console.log("this.studentProfile", this.studentProfile);
    this.studentProfileEmit.emit(this.studentProfile?.student_id);
  }

  getDuration(dateFrom: any, dateTo: any) {

    function getWords(monthCount: number) {
      function getPlural(number: number, word: any) {
        return number === 1 && word.one || word.other;
      }

      var months = { one: 'Month', other: 'Months' },
        years = { one: 'Year', other: 'Years' },
        m = monthCount % 12,
        y = Math.floor(monthCount / 12),
        result = [];

      y && result.push(y + ' ' + getPlural(y, years));
      m && result.push(m + ' ' + getPlural(m, months));
      return result.join(' and ');
    }

    let diff = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    // diff = diff + 1
    return getWords(diff)
  }

  downloadFile(url: string) {
    window.open(url);
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

      // Open the blob URL in a new tab
      const newTab = window.open(blobURL, '_blank');
      if (!newTab) {
        throw new Error('Failed to open new tab');
      }

      // Revoke the blob URL after a delay to ensure the PDF is loaded
      setTimeout(() => {
        window.URL.revokeObjectURL(blobURL);
      }, 1000); // Adjust timeout as needed

    } catch (error) {
      console.error('There was an error viewing the PDF:', error);
      this.downloadFile(url);
    }
  }


  getFile(event) {
    const formData = new FormData();
    formData.append('media', event.target.files[0]);
    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.basicProfileForm.patchValue({
        image: resp.url
      });
    });
    event.target.value = "";
  }

  getExperienceUploadedFile(event) {
    this.media.work_experience = [];
    event.target.files.forEach(file => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        this.media.work_experience.push(resp);
      });
    });
    event.target.value = "";
  }

  getEducationUploadedFile(event) {
    this.media.education = [];
    event.target.files.forEach(file => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        this.media.education.push(resp);
      });
    });
    event.target.value = "";
  }

  getLicensingUploadedFile(event) {
    this.media.licenses = [];
    event.target.files.forEach(file => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        this.media.licenses.push(resp);
      });
    });
    event.target.value = "";
  }

  getUploadedVisaFile(event) {
    if (event.target.files[0].size > 5000971) {
      this.service.showMessage({
        message: 'Please select file less than 5 MB'
      });
      return;
    }
    const formData = new FormData();
    formData.append('media', event.target.files[0]);
    this.service.uploadVisaMedia(formData).subscribe((resp: any) => {
      this.uploadedVisaFile = resp;
    });
    event.target.value = "";
  }

  uploadStudentVisa() {
    if (!this.uploadedVisaFile) {
      return;
    }
    const payload = {
      visa: {
        visaFile: this.uploadedVisaFile,
        ...this.visaForm.value
      },
      _id: this.studentProfile?.student_id
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student visa uploaded successfully"
      });
      this.uploadedVisaFile = null;
      this.isUploadVisa = false;
      this.emitEvent();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getUploadedResumeFile(event) {
    if (event.target.files[0].size > 5000971) {
      this.service.showMessage({
        message: 'Please select file less than 5 MB'
      });
      return;
    }
    const formData = new FormData();
    formData.append('media', event.target.files[0]);
    this.service.uploadResumeMedia(formData).subscribe((resp: any) => {
      this.uploadedResumeFile = resp;
    });
  }

  uploadStudentResume() {
    if (!this.uploadedResumeFile) {
      return;
    }
    this.uploadedResumeFile['is_approved'] = true;
    const payload = {
      resume: this.uploadedResumeFile,
      _id: this.studentProfile?.student_id
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student resume uploaded successfully"
      });
      this.uploadedResumeFile = null;
      this.isUploadResume = false;
      this.emitEvent();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  preferenceEdit() {
    this.preference = !this.preference;

    console.log("this.studentProfile?.job_preference", this.studentProfile?.job_preference);
    if (this.studentProfile?.job_preference?.length > 0) {
    this.jobPreferenceArray.clear();
    this.studentProfile.job_preference.forEach(preference => {
      this.jobPreferenceArray.push(this.fb.group({
        expertise: preference.expertise,
        jobTitle: preference.jobTitle,
        skills: preference.skills,
        selectedSkills: [preference.selectedSkills]
      }));
    });
  }
  }

  removeJobSkills(skillIndex, i) {
    this.jobPreferenceArray.controls[i].value.selectedSkills.splice(skillIndex, 1);
  }

  onChangeAnalyst(e, i) {
    if (this.jobPreferenceArray.controls[i].value.selectedSkills.length >= 10) {
      return;
    }
    this.jobPreferenceArray.controls[i].patchValue({
      skills: []
    });
    const found = this.jobPreferenceArray.controls[i].value.selectedSkills.find(skill => skill._id === e._id);
    if (!found) {
      this.jobPreferenceArray.controls[i].value.selectedSkills.push(e);
    }
  }

  updateJobPreferences() {
    if (this.jobPreferenceForm.invalid) {
      this.jobPreferenceForm.markAllAsTouched();
      return;
    }
    this.service.updateStudentProfile({
      job_preference: this.jobPreferenceForm.value.jobPreferences,
      _id: this.studentProfile?.student_id
    }).subscribe(resp => {
      this.service.showMessage({
        message: "Job Preferences updated successfully",
      });
      this.preferenceEdit();
      this.jobPreferenceForm.reset();
      this.emitEvent();
    }, (err) => {
      this.service.handleError(err);
    })
  }

  submitStudentProfile() {
    if (this.basicProfileForm.invalid) {
      this.basicProfileForm.markAllAsTouched();
      return;
    }
    const selectedDays = [];
    this.days.forEach(day => { 
      if (day.selected) {
        selectedDays.push(day.name);
      }
    });
    this.basicProfileForm.patchValue({
      availableDays: selectedDays.join()
    });
    const payload = {
      first_name: this.basicProfileForm.value.first_name,
      last_name: this.basicProfileForm.value.last_name,
      available_days: this.basicProfileForm.value.availableDays,
      flexible_schedule: this.basicProfileForm.value.flexibleSchedule,
      travel_preference: this.travelPreference,
      image: this.basicProfileForm.value.image,
      dob: this.basicProfileForm.value.dob
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student profile submitted successfully"
      });
      this.emitEvent();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  deleteRecord(section: string) {
    if (this.hidden_blocks[section] == 'edit') {
      if (section == "work_experience") {
        this.studentProfile.work_experience.splice(this.edit_indexes[section], 1);
        this.updateWorkExperienceData();
      }
    }
    this.hideShow(section, "");
  }

  saveWorkExperience() {
    if (!this.workExperienceForm.valid) {
      this.workExperienceForm.markAllAsTouched()
      return;
    }
    const obj = { ...this.workExperienceForm.value }
    if (this.hidden_blocks.work_experience == "edit") {
      // obj.media = this.studentProfile.work_experience[this.edit_indexes.work_experience].media ? this.studentProfile.work_experience[this.edit_indexes.work_experience].media : [];
      this.studentProfile.work_experience[this.edit_indexes.work_experience] = obj;
      this.studentProfile.work_experience[this.edit_indexes.work_experience].media = [];
      if (this.media?.work_experience.length > 0) {
        for (let i = 0; i < this.media.work_experience.length; i++) {
          this.studentProfile.work_experience[this.edit_indexes.work_experience].media.push(this.media.work_experience[i]);
        }
      }
    } else {
      obj.media = this.media.work_experience;
      this.studentProfile.work_experience.push(obj);
    }
    this.media.work_experience = [];
    this.updateWorkExperienceData();
  }

  updateWorkExperienceData() {
    this.service.updateStudentProfile({
      work_experience: this.studentProfile.work_experience
    }).subscribe(resp => {
      this.service.showMessage({
        message: "Work Experience updated successfully",
      });
      this.hideShow('work_experience', '');
      this.workExperienceForm.reset();
      this.emitEvent();
    }, (err) => {
      this.service.handleError(err);
    })

  }

  hideShow(type1: string, type2: string) {
    this.hidden_blocks[type1] = type2
 
    if (type2 != "edit") {
      this.media = [];
      this.edit_indexes = {
        work_experience: null,        
        education: null,        
      }
      if (type1 == "work_experience") {
        this.workExperienceForm.reset()
      } 
      if (type1 == "education") {
        this.educationForm.reset()
      } 
    }
    this.emitEvent();
  }

  noExpiry() {
    if (this.licenseForm.controls.no_expiry.value) {
      this.licenseForm.get('expiry_date')?.clearValidators();
      this.licenseForm.get('expiry_date')?.disable();
    } else {
      this.licenseForm.get('expiry_date')?.enable();
      this.licenseForm.get('expiry_date')?.setValidators([Validators.required]);
    }
    this.licenseForm.get('expiry_date')?.updateValueAndValidity();
  }

  onLicensingStartDateSelection() {
    const issueDate = new Date(this.licenseForm.controls.issuing_date.value).getTime();
    const expiryDate = new Date(this.licenseForm.controls.expiry_date.value).getTime();
    if (issueDate && expiryDate) { 
      if (issueDate >= expiryDate) {
        this.licenseForm.get('issuing_date')?.setErrors({incorrect: true});
      } else {
        this.licenseForm.get('issuing_date')?.setErrors(null);
        this.licenseForm.get('expiry_date')?.setErrors(null);
      }
    }
  }

  onLicensingEndDateSelection() {
    const issueDate = new Date(this.licenseForm.controls.issuing_date.value).getTime();
    const expiryDate = new Date(this.licenseForm.controls.expiry_date.value).getTime();
    if (issueDate && expiryDate) {
      if (issueDate >= expiryDate) {
        this.licenseForm.get('expiry_date')?.setErrors({incorrect: true});
      } else {
        this.licenseForm.get('issuing_date')?.setErrors(null);
        this.licenseForm.get('expiry_date')?.setErrors(null);
      }
    }
  }

  editWorkExperienceData(index: number) {
    let workExperienceObj = this.studentProfile.work_experience[index]
    console.log("workExperienceObj", workExperienceObj);

    this.workExperienceForm.patchValue(workExperienceObj)
    this.edit_indexes.work_experience = index;
    this.media.work_experience = workExperienceObj?.media ? workExperienceObj.media : [];
    this.stillInRole();
  }

  editEducationData(index: number) {
    let educationObj = this.studentProfile.education[index];
    this.educationForm.patchValue(educationObj);
    this.edit_indexes.education = index;
    this.media.education = educationObj?.media ? educationObj.media : [];
    this.currentlyStudying();
  }

  onExperienceStartDateSelection() {
    const startDate = new Date(this.workExperienceForm.controls.start_date.value).getTime();
    const endDate = new Date(this.workExperienceForm.controls.end_date.value).getTime();
    if (startDate && endDate) { 
      if (startDate >= endDate) {
        this.workExperienceForm.get('start_date')?.setErrors({incorrect: true});
      } else {
        this.workExperienceForm.get('start_date')?.setErrors(null);
        this.workExperienceForm.get('end_date')?.setErrors(null);
      }
    }
  }

  onExperienceEndDateSelection() {
    const startDate = new Date(this.workExperienceForm.controls.start_date.value).getTime();
    const endDate = new Date(this.workExperienceForm.controls.end_date.value).getTime();
    if (startDate && endDate) {
      if (startDate >= endDate) {
        this.workExperienceForm.get('end_date')?.setErrors({incorrect: true});
      } else {
        this.workExperienceForm.get('start_date')?.setErrors(null);
        this.workExperienceForm.get('end_date')?.setErrors(null);
      }
    }
  }

  stillInRole() {
    if (this.workExperienceForm.controls.still_in_role.value) {
      this.workExperienceForm.get('end_date')?.clearValidators();
      this.workExperienceForm.get('end_date')?.disable();
    } else {
      this.workExperienceForm.get('end_date')?.enable();
      this.workExperienceForm.get('end_date')?.setValidators([Validators.required]);
    }
    this.workExperienceForm.get('end_date')?.updateValueAndValidity();
  }

  getCompanyList(event: any) {
    if (event.target.value) {
      const payload = {
        search: event.target.value
      }
      this.service.getCompanyList(payload).subscribe(res => {
        this.companyList = res.record
      })
    } else {
      this.companyList = []
    }
  }

  uniList(event: any) {
    if (event.target.value) {
      const payload = {
        search: event.target.value
      }
      this.service.getindustrylist(payload).subscribe(res => {
        this.unilist = res.data
      })
    } else {
      this.unilist = []
    }
  }

  setCompanyLogo(url: string, section: string) {
    if (section == "work_experience") {
      this.workExperienceForm.patchValue({
        company_logo: url
      })
    }
  }

  
  public removeMedia(index, section: string) {
    this.media[section].splice(index, 1);
  }

  editContactDetail() {
    this.isEditContactDetail = true;
    this.aboutForm.patchValue({
      phone_no: this.studentProfile?.phone_no,
      email: this.studentProfile?.email,
      permanent_email: this.studentProfile?.permanent_email,
      addressLine1: this.studentProfile?.address,
      post_code: this.studentProfile?.postal_code,
      suburb: this.studentProfile?.suburb,
      country: this.studentProfile?.country,
      state: this.studentProfile?.record.state,
      permanent_address: this.studentProfile?.record.permanent_address,
    });
  }

  submitAboutForm() {
    if (this.aboutForm.invalid) {
      this.aboutForm.markAllAsTouched();
      return;
    }
    const payload = {
      phone_no: this.aboutForm.value.phone,
      email: this.aboutForm.value.email,
      address: this.aboutForm.value.addressLine1,
      addressLine1: this.aboutForm.value.addressLine1,
      permanent_email: this.aboutForm.value.permanent_email,
      postal_code: this.aboutForm.value.post_code,
      suburb: this.aboutForm.value.suburb,
      state: this.aboutForm.value.state,
      country: this.aboutForm.value.country,
      _id: this.studentProfile?.student_id
    }
    this.service.updateStudentProfile(payload).subscribe(resp => {
      this.service.showMessage({
        message: "Contact details updated succesfully",
      });
      this.isEditContactDetail = false;
      this.emitEvent();
    }, (err) => {
      this.service.handleError(err);
    })
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

 currentlyStudying() {
  if (this.educationForm.controls.currently_studying.value) {
    this.educationForm.get('end_date')?.clearValidators();
    this.educationForm.get('end_date')?.disable();
  } else {
    this.educationForm.get('end_date')?.enable();
    this.educationForm.get('end_date')?.setValidators([Validators.required]);
  }
  this.educationForm.get('end_date')?.updateValueAndValidity();
}


  saveEducation() {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }
    let obj = {
      ...this.educationForm.value
    }

    if (this.hidden_blocks.education == "edit") {
      // obj.media = this.studentProfile.education[this.edit_indexes.education].media ? this.studentProfile.education[this.edit_indexes.education].media : []
      this.studentProfile.education[this.edit_indexes.education] = obj;
      this.studentProfile.education[this.edit_indexes.education].media = [];

      if (this.media?.education.length > 0) {
        for (let i = 0; i < this.media.education.length; i++) {
          this.studentProfile.education[this.edit_indexes.education].media.push(this.media.education[i]);
        }
      }
    } else {
      obj.media = this.media.education;
      this.studentProfile.education.push(obj);
    }
    this.media.education = [];
    this.updateEducationData()
  }

  updateEducationData() {
    this.service.updateStudentProfile({
      education: this.studentProfile.education
    }).subscribe(resp => {

      this.service.showMessage({
        message: "Education updated successfully",
      });

      this.hideShow('education', '')
      this.educationForm.reset()
      this.emitEvent();
    }, (err) => {
      this.service.handleError(err);
    })
  }

  onEducationStartDateSelection() {
    const startDate = new Date(this.educationForm.controls.start_date.value).getTime();
    const endDate = new Date(this.educationForm.controls.end_date.value).getTime();
    if (startDate && endDate) { 
      if (startDate >= endDate) {
        this.educationForm.get('start_date')?.setErrors({incorrect: true});
      } else {
        this.educationForm.get('start_date')?.setErrors(null);
        this.educationForm.get('end_date')?.setErrors(null);
      }
    }
  }

  onEducationEndDateSelection() {
    const startDate = new Date(this.educationForm.controls.start_date.value).getTime();
    const endDate = new Date(this.educationForm.controls.end_date.value).getTime();
    if (startDate && endDate) {
      if (startDate >= endDate) {
        this.educationForm.get('end_date')?.setErrors({incorrect: true});
      } else {
        this.educationForm.get('start_date')?.setErrors(null);
        this.educationForm.get('end_date')?.setErrors(null);
      }
    }
  }

  saveLicenses() {
    if (this.licenseForm.invalid) {
      this.licenseForm.markAllAsTouched()
      return;
    }

    let obj = {
      ...this.licenseForm.value,
    }
    // this.studentProfile.licenses[this.edit_indexes.licenses].media = [];
    if (this.hidden_blocks.licenses == "edit") {
      this.studentProfile.licenses[this.edit_indexes.licenses] = obj;
      this.studentProfile.licenses[this.edit_indexes.licenses].media = [];
      if (this.media?.licenses.length > 0) {
        for (let i = 0; i < this.media.licenses.length; i++) {
          this.studentProfile.licenses[this.edit_indexes.licenses].media.push(this.media.licenses[i]);
        }
      }
    } else {
      obj.media = this.media.licenses;
      this.studentProfile.licenses.push(obj);
    }
    this.media.licenses = [];
    this.updateLicenseData();
  }

  updateLicenseData() {
    this.service.updateStudentProfile({
      // licenses: this.studentProfile.licenses,
      licenses: this.licenses.filter(license => license.selected),
      _id: this.studentProfile?.student_id
    }).subscribe(resp => {
      this.service.showMessage({
        message: "Licenses updated successfully",
      });
      this.hideShow('licenses', '')
      this.licenseForm.reset();

     this.emitEvent();
    }, (err) => {
      this.service.handleError(err);
    })
  }

  editLicenseData(index: number) {
    let licenseObj = this.studentProfile.licenses[index];

    this.licenseForm.patchValue(licenseObj)
    this.edit_indexes.licenses = index;
    this.media.licenses = licenseObj?.media ? licenseObj.media : [];
    this.noExpiry();
    
  }

  onVisaStartDateSelection() {
    const startDate = new Date(this.visaForm.controls.start_date.value).getTime();
    const endDate = new Date(this.visaForm.controls.end_date.value).getTime();
    if (startDate && endDate) { 
      if (startDate >= endDate) {
        this.visaForm.get('start_date')?.setErrors({incorrect: true});
      } else {
        this.visaForm.get('start_date')?.setErrors(null);
        this.visaForm.get('end_date')?.setErrors(null);
      }
    }
  }

  onVisaEndDateSelection() {
    const startDate = new Date(this.visaForm.controls.start_date.value).getTime();
    const endDate = new Date(this.visaForm.controls.end_date.value).getTime();
    if (startDate && endDate) {
      if (startDate >= endDate) {
        this.visaForm.get('end_date')?.setErrors({incorrect: true});
      } else {
        this.visaForm.get('start_date')?.setErrors(null);
        this.visaForm.get('end_date')?.setErrors(null);
      }
    }
  }

  handleAddressChange(event: any) {
    if (event.geometry && event.name && event.formatted_address) {
      this.aboutForm.patchValue({
        addressLine1: event.formatted_address
      });
    }
  }

  formpage:any = 1;
  formlimit:any = 5;
  totalforms:any = 0
  totalformList:any = 0
  getSubmittedDocuments(page) {

    // if (page < 1) page = 1;
    // if (page > this.totalforms) page = this.totalforms;


    this.formpage = page;
    this.formlimit = 5;
    const payload = {
      student_id: this.studentProfile?.student_id,
      "limit": this.formlimit,
      "offset": this.formpage-1
    }
    this.service.getSubmittedStudentDocuments(payload).subscribe((res: any) => {
      // this.submittedDocuments = res.records.filter(record => record.task_type === 'attachments');
      // this.submittedForms = res.records.filter(record => record.task_type === 'form');
      // this.hideShowDocuments(3);
      // this.hideShowForms(3);

      // console.log(this.submittedForms, "this.submittedForms", res);
      // this.submittedForms = res.records;
      // if(res.record_count <= this.formlimit){
      //   this.formlimit = res.record_count;
      //   console.log("this.formlimit", this.formlimit)
      // }
      // this.totalformList = res.record_count?res.record_count:0;
      // console.log(res.record_count/this.formlimit, "res.record_count/this.formlimit", res.record_count, this.formlimit)
      
      // this.totalforms = Math.ceil(res.record_count/5);
      // console.log(" this.totalNotes form",  this.totalforms, this.formpage);
      this.submittedForms = res.records || [];
      this.totalformList = res.record_count || 0;
      this.totalforms = Math.ceil(this.totalformList / this.formlimit);
  
      console.log("Pagination Details:", {
        totalRecords: this.totalformList,
        totalPages: this.totalforms,
        currentPage: this.formpage,
      });

    });
  }


  submittedDeclinedForms:any = []
 formdDeclinedpage:any = 1;
  formdDeclinedlimit:any = 5;
  totaldDeclinedforms:any = 0
  totalformdDeclinedList:any = 0
  getSubmitteddDeclinedDocuments(page) {
    this.formdDeclinedpage = page;
    this.formdDeclinedlimit = 5;
    const payload = {
      student_id: this.studentProfile?.student_id,
      "limit": this.formdDeclinedlimit,
      "offset": this.formdDeclinedpage-1,
      user_type:'student'
    }
    this.service.getSubmittedStudentDeclinedDocuments(payload).subscribe((res: any) => {
      this.submittedDeclinedForms = res.records || [];
      this.totalformdDeclinedList = res.record_count || 0;
      this.totaldDeclinedforms = Math.ceil(this.totalformdDeclinedList / this.formdDeclinedlimit);
  
      console.log("Pagination Details:", {
        totalRecords: this.totalformdDeclinedList,
        totalPages: this.totaldDeclinedforms,
        currentPage: this.formdDeclinedpage,
      });

    });
  }


  updateSubmittedDocuments(value) {
    this.slicedDocuments = this.submittedDocuments.slice(0, value);
  }

  updateSubmittedForms(value) {
    this.slicedForms = this.submittedForms.slice(0, value);
  }

  hideShowDocuments(value) {
    this.updateSubmittedDocuments(value);
  }

  hideShowForms(value) {
    this.updateSubmittedForms(value);
  }


  @ViewChild('closeConfirmDeleteModal') closeConfirmDeleteModal;
  addnote:boolean = false;
  note:any = '';
  selectedNode:any 
  deleteNote(){
   
    let body = {
      "_id": this.selectedNode._id,
    }
    this.service.deleteStudentNote(body).subscribe(res => {
      if (res.status == 200) {
        this.addnote = false;
        this.getNotes(this.notepage);
        this.selectedNode = null;
        this.closeConfirmDeleteModal.ripple.trigger.click();
      } else {
        this.service.showMessage({ message: res.msg });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );
  }

 notepage: number = 0;
notelimit: number = 5;
totalNotes: number = 0;
totalNoteList: number = 0;
noteList: any[] = [];

getNotes(page: number) {
  this.notepage = page;

  const body = {
    student_id: this.studentProfile?.student_id,
    limit: this.notelimit,
    offset: this.notepage // ✅ Corrected!
  };

  this.service.getStudentNote(body).subscribe(
    (res) => {
      if (res.status === 200) {
        this.totalNoteList = res.count;
        this.totalNotes = Math.ceil(res.count / this.notelimit);
        this.noteList = res.result;
      } else {
        this.noteList = [];
      }
    },
    (err) => {
      this.noteList = [];
      this.service.showMessage({
        message: err?.error?.errors?.msg || 'Something went wrong'
      });
    }
  );
}
  

get startNoteIndex(): number {
  return this.totalNoteList === 0 ? 0 : this.notepage * this.notelimit + 1;
}

get endNoteIndex(): number {
  return Math.min((this.notepage + 1) * this.notelimit, this.totalNoteList);
}

onNextPage() {
  if (this.notepage < this.totalNotes - 1) {
    this.getNotes(this.notepage + 1);
  }
}

onPrevPage() {
  if (this.notepage > 0) {
    this.getNotes(this.notepage - 1);
  }
}

  @ViewChild('closeAddNoteModal') closeAddNoteModal;

  createNote(){
    if(!this.note){
      this.service.showMessage({ message: "Note Required!" });
      return false;
    }
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));

    if(this.selectedNode){
      let body = {
        "_id": this.selectedNode._id,
        "student_id": this.studentProfile?.student_id,
        "created_by": this.userDetail._id,
        "description": this.note 
       }
      this.service.updateStudentNote(body).subscribe(res => {
        if (res.status == 200) {
          this.closeAddNoteModal.ripple.trigger.click();
          this.note = '';
          this.selectedNode = null;
          this.getNotes(this.notepage);
          this.service.showMessage({ message: res.msg });
          // this.closeResendOTPEmailModal.ripple.trigger.click();
          // this.selectedCompany = {};
  
        } else {
          this.service.showMessage({ message: res.msg });
        }
      }, err => {
  
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }else{
      let body = {
        "student_id":this.studentProfile?.student_id,
        "created_by": this.userDetail._id,
        "description": this.note 
       }

       console.log("body", body)
      this.service.addStudentNote(body).subscribe(res => {
        if (res.status == 200) {
          this.getNotes(this.notepage);
          this.closeAddNoteModal.ripple.trigger.click();
          this.note = '';
          this.selectedNode = null;
          this.service.showMessage({ message: res.msg });
          // this.closeResendOTPEmailModal.ripple.trigger.click();
          // this.selectedCompany = {};
  
        } else {
          this.service.showMessage({ message: res.msg });
        }
      }, err => {
  
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }
   

  }

  submissionCreate:boolean = false;
  files = [];
  
 getFilDoc(event: Event) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  // Ensure this.media.documents is initialized
  this.media.documents = this.media?.documents ?? [];

  for (const file of filesArray) {
    if (file.size > 5242880) { // 5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });

      // Clear input so user can reselect the same file
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.media.documents.push(resp);
    });
  }

  // ✅ Clear input after all processing
  input.value = '';
}

  removeFile(index) {
    this.media.documents.splice(index, 1);
  }

  documents:any = [];

  updateCompanySubmission() {
    const payload = {
      _id: this.studentProfile?.student_id,
      documents:  [...this.media.documents] 
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student Documents uploaded successfully"
      });
      this.uploadedVisaFile = null;
      this.isUploadVisa = false;
      this.emitEvent();
     this.submissionCreate = false;
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
    this.getStudentProfile();
  }


  selectedIndex:any =0;

  onTabChanged(event){
    this.selectedIndex = event.index;
  }


  emailpage:any = 1;
  emaillimit:any = 5;
  totalemails:any = 0
  totalemailList:any = 0
  selectedEmail:any = {};
  submittedEmail: any = [];
  getEmails(page) {
    this.emailpage = page;
    this.emaillimit = 5;
    const payload = {
      "email_id": this.studentProfile.email,
      "receiver_type": "student",
      "limit": this.emaillimit,
      "offset": this.emailpage-1
    }
    this.service.getSentEmails(payload).subscribe((res: any) => {
      // this.submittedDocuments = res.records.filter(record => record.task_type === 'attachments');
      // this.submittedForms = res.records.filter(record => record.task_type === 'form');
      // this.hideShowDocuments(3);
      // this.hideShowForms(3);

      // this.submittedEmail = res.data;
      // console.log("this.submittedEmail", this.submittedEmail);
      // if(res.record_count <= this.emaillimit){
      //   this.emaillimit = res.record_count;
      // }
      // this.totalemailList = res.record_count;
      // this.totalemails = Math.ceil(res.record_count/this.emaillimit);
      // console.log(" this.totalNotes",  this.totalemails);


      this.submittedEmail = res.data || [];  // Handle empty data array
      this.totalemailList = res.record_count || 0;  // Set total email count
  
      // Total number of pages
      this.totalemails = Math.ceil(this.totalemailList / this.emaillimit);
      
      console.log("Pagination Info:", {
        totalRecords: this.totalemailList,
        totalPages: this.totalemails,
        currentPage: this.emailpage,
      });

    });
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


   editStudentCheckBox(payload) {
    this.service.editStudentCheckBox(payload).subscribe(async(res: any) => {
      this.service.showMessage({
        message: "Student data updated successfully"
      });
      await this.getStudentProfileById(this.documentpage);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }



  async submitContactInfo(){
    console.log("this.studentProfile", this.studentProfile);
    this.contactInfo.value['_id'] = this.studentProfile.student_id;
    // this.contactInfo.value['address'] = this.contactInfo.value.address_line_1,
     this.contactInfo.value['address_line_01'] = this.contactInfo.value.address_line_1,
    this.contactInfo.value['postal_code'] = this.contactInfo.value.post_code
     this.service.editStudentCheckBox(this.contactInfo.value).subscribe(async(res: any) => {
      this.service.showMessage({
        message: "Student data updated successfully"
      });

    
      this.studentProfile['phone_no']  = this.contactInfo.value.phone_no
      this.studentProfile['address_line_1']  = this.contactInfo.value.address_line_1
      this.studentProfile['address_line_01']  = this.contactInfo.value.address_line_1
      this.studentProfile['address']  = this.contactInfo.value.address
      this.studentProfile['postal_code']  = this.contactInfo.value.post_code
      this.studentProfile['username']  = this.contactInfo.value.username
      this.studentProfile['state']  = this.contactInfo.value.state
      this.studentProfile['suburb']  = this.contactInfo.value.suburb
      this.studentProfile['permanent_email']  = this.contactInfo.value.phone_no
      this.studentProfile['permanent_address']  = this.contactInfo.value.permanent_address

      await this.getStudentProfileById(this.documentpage);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
    // await this.getStudentProfileById(this.documentpage);
    this.isEditContact = false;
    this.isthreeInfo=false;
    this.isEditAdminInfo=false;
  }
  submitEducationInfo(){
     this.educationdetailForm.value['_id'] = this.studentProfile._id;
    this.editStudentCheckBox(this.educationdetailForm.value);
    this.isEditContact = false;
    this.isthreeInfo=false;
    this.isEditAdminInfo=false;
  }

  submitMiscellaneousInfo(){
    this.miscellaneousdetailForm.value['_id'] = this.studentProfile._id;
    this.editStudentCheckBox(this.miscellaneousdetailForm.value);
    this.isEditContact = false;
    this.isthreeInfo=false;
    this.isEditAdminInfo=false;
  }

    getVideoUrl(data){
      if(data && data.video_url){
         // YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
          const youtubeMatch = data.video_url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          );
          if (youtubeMatch) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
          }

          // Vimeo: https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
          const vimeoMatch = data.video_url.match(
            /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
          );
          if (vimeoMatch) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}`);
          }
      }else{
          return null;
      }

    }

    getSafeUrl(videoUrl: string): SafeResourceUrl | null {
      if (!videoUrl) return null;

      // YouTube
      const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytMatch) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${ytMatch[1]}`);
      }

      // Vimeo
      const vimeoMatch = videoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
      if (vimeoMatch) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}`);
      }

      return null;
    }

  @ViewChild('previewVideoInterview') public previewVideoInterview: ModalDirective;
   
    interviewListWithSafeUrls: { video_url: string, safeUrl: SafeResourceUrl | null }[] = [];

    interviewList:any = [];
    selectedInterview:any = null;
    async getInterviewVideo(){
      this.service.getVideoInterview({student_id:this.studentProfile.student_id}).subscribe(async(res: any) => {
        if(res.status==200){
          this.interviewList = res.data;
          this.interviewListWithSafeUrls = this.interviewList.map(video => ({
            ...video,
            safeUrl: this.getSafeUrl(video.video_url)
          }));
        }else{
          this.service.showMessage({
            message: res.msg ? res.msg : 'Something went Wrong'
          });
          this.interviewList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
      // await this.getStudentProfileById(this.documentpage);
      this.isEditContact = false;
      this.isthreeInfo=false;
      this.isEditAdminInfo=false;
    }
    updateChart() {
      this.radarChartData.datasets[0].data = this.ratings.map(r => r.value);
      this.radarChartData = { ...this.radarChartData }; // trigger change detection
      // this.chart?.update(); 
      this.calculateOverallRating();
    }
     ratings = [
      { label: 'Communication & Coherence',name: 'Communication', value: 0 },
      { label: 'Critical Thinking',name: 'Critical Thinking', value: 0 },
      { label: 'Skills',name: 'Skills', value: 0 },
      { label: 'Teamwork & Collaboration', name: 'Teamwork', value: 0 },
      { label: 'Relevance & Content', name: 'Relevance', value: 0 },
    ];
  
     // Chart labels
    public radarChartLabels: string[] = this.ratings.map(r => r.name);

  
    // Radar chart data
    public radarChartData: ChartData<'radar'> = {
      labels: this.radarChartLabels,
      datasets: [
        {
          data: this.ratings.map(r => r.value),
          label: 'Ratings',
          fill: true,
          backgroundColor: 'rgba(63,81,181,0.2)',  // transparent blue
          borderColor: '#3f51b5',                  // blue border
          pointBackgroundColor: '#3f51b5',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3f51b5'
        }
      ]
    };
  
    public radarChartType: ChartType = 'radar';
  
    public radarChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      scales: {
        r: {
          ticks: {
            display: false // hide numbers (0,1,2,3,4,5)
          },
          angleLines: { color: '#e5e5e5' },
          grid: { color: '#f2f2f2' },
          pointLabels: { 
            color: '#333',
            font: { size: 12 }
          },
          suggestedMin: 0,
          suggestedMax: 5
        }
      },
      plugins: {
        legend: { display: false }
      }
    };

    updateRecords(data){
      this.ratings = data?.ratings?data?.ratings:this.ratings;
      console.log("this.ratings", this.ratings);
      this.selectedInterview = data;
      this.updateChart();
      this.previewVideoInterview.show();
    }


      overallRating = 0;



    calculateOverallRating() {
      if (!this.ratings || this.ratings.length === 0) {
        this.overallRating = 0;
        return;
      }

      const total = this.ratings.reduce((sum, item) => sum + (item.value || 0), 0);
      this.overallRating = +(total / this.ratings.length).toFixed(1);
    }


}

