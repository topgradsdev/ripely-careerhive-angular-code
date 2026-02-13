import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { FilePickerComponent, FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpResponseCode } from '../../../enum';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  preference : boolean;
  studentProfile = null;
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false }
  ];

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
    documents: []
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
  ];

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

  constructor(private fb: FormBuilder, private service: TopgradserviceService, private http: HttpClient, private location: Location, private activatedRoute: ActivatedRoute, private fileIconService:FileIconService) { }
 

  getSafeSvg(documentName: string): SafeHtml {
     return this.fileIconService.getFileIcon(documentName);
    }
  ngOnChanges() {
   
  }

  student_id:any = '';
  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.student_id = params['id'];
      this.getStudentProfile();
     
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

    this.workExperienceForm = this.fb.group({
      job_title: ['', [Validators.required, Validators.maxLength(64)]],
      company_name: ['', [Validators.required, Validators.maxLength(64)]],
      company_logo: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      still_in_role: [false],
      description: ['']
    });

    this.educationForm = this.fb.group({
      institution: ['', [Validators.required, Validators.maxLength(64)]],
      edu_logo: [''],
      qualification: ['', [Validators.required, Validators.maxLength(64)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      currently_studying: [''],
      description: [''],
    });

    this.licenseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(64)]],
      issuing_organization: ['', Validators.maxLength(64)],
      issuing_date: [''],
      expiry_date: [''],
      no_expiry: [false]
    });

    this.visaForm = this.fb.group({
      vgn: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });

    this.aboutForm = this.fb.group({
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      email_secondery: ['', [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      addressLine1: ['', Validators.required],
      postCode: ['', Validators.required],
      // suburb: ['', Validators.required],
      // state: ['', Validators.required],
      // country: ['', [Validators.required]]
    });

    this.jobPreferenceForm = this.fb.group({
      jobPreferences: this.fb.array([ 
        this.fb.group({
          expertise: ["", Validators.nullValidator],
          jobTitle: ["", Validators.required],
          skills: [""],
          selectedSkills: [[]]
        })
      ])
    });
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

  selectedRecords:any ;

  getStudentProfile() {
    this.service.getStudentProfile({_id:this.student_id}).subscribe((res: any) => {
      res.record.student_id = res.record?._id;
    
      // this.slicedForms.push(res.record?.placement_type);
      // console.log("this.slicedForms", this.slicedForms);

      this.studentProfile = { ...res?.record, ...res?.placement_type, ...res?.placement_group_info };
      this.days.forEach(day => { 
        const found = res.record?.available_days?.split(',').find(days => days === day.name);
        if (found) {
          day.selected = true;
        }
      });
      this.selectedRecords = [res.studentProfile];


      this.basicProfileForm.patchValue({
        first_name: res.record?.first_name,
        last_name: res.record?.last_name,
        flexibleSchedule: res.record?.flexible_schedule,
        dob: res.record?.dob,
        travelPreference: res.record?.travel_preference,
        availableDays: res.record?.available_days,
        image: res.record?.image
      });
      this.travelPreference = res.record?.travel_preference;
    
      this.aboutForm.patchValue({
        phone: res.record.phone_no,
        email: res.record.email,
        email_secondery: res.record.email_secondery,
        addressLine1: res.record.address,
        postCode: res.record.postal_code,
        // suburb: res.record.suburb,
        // state: res.record.state,
        // country: res.record.country,
      });
      this.studentProfile.work_experience = this.studentProfile.work_experience ? this.studentProfile.work_experience : [];
      if (this.studentProfile.work_experience?.length > 0) {
        this.studentProfile.work_experience = this.studentProfile.work_experience.map((val: any) => {
          //for calculating difference between start and end date
          val.first_date = new Date(val.start_date);
          val.second_date = val.still_in_role ? new Date() : new Date(val.end_date);
          val.duration = this.getDuration(val.first_date, val.second_date);
          return val
        })
      }

      this.studentProfile.licenses = this.studentProfile.licenses ? this.studentProfile.licenses : [];
      this.studentProfile.education = this.studentProfile.education ? this.studentProfile.education : [];
      if (this.studentProfile?.licenses?.length > 0) {
        this.licenses.forEach(license => {
          license.selected = this.studentProfile.licenses.some(lic => lic.name === license.name);
        });
      }

      this.getSubmittedDocuments(this.formpage);
      this.getStudentProfileById(this.documentpage);
      this.getEmails(this.emailpage);
    });
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
      window.open(blobURL, '_blank');
      window.URL.revokeObjectURL(blobURL);
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
      }
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student visa uploaded successfully"
      });
      this.uploadedVisaFile = null;
      this.isUploadVisa = false;
      this.getStudentProfile();
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
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student resume uploaded successfully"
      });
      this.uploadedResumeFile = null;
      this.isUploadResume = false;
      this.getStudentProfile();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  preferenceEdit() {
    this.preference = !this.preference;
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
      job_preference: this.jobPreferenceForm.value.jobPreferences
    }).subscribe(resp => {
      this.service.showMessage({
        message: "Job Preferences updated successfully",
      });
      this.preferenceEdit();
      this.jobPreferenceForm.reset();
      this.getStudentProfile();
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
      this.getStudentProfile();
      localStorage.setItem('profileImage', JSON.stringify(this.basicProfileForm.value.image));
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
      this.getStudentProfile();
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
        licenses: null,      
      }
      if (type1 == "work_experience") {
        this.workExperienceForm.reset()
      } 
      if (type1 == "education") {
        this.educationForm.reset()
      } 
      if (type1 == "licenses") {
        this.licenseForm.reset()
      } 
    }
    this.getStudentProfile();
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
      email_secondery: this.aboutForm.value.email_secondery,
      postal_code: this.aboutForm.value.postCode,
      // suburb: this.aboutForm.value.suburb,
      // state: this.aboutForm.value.state,
      // country: this.aboutForm.value.country,
    }
    this.service.updateStudentProfile(payload).subscribe(resp => {
      this.service.showMessage({
        message: "Contact details updated succesfully",
      });
      this.isEditContactDetail = false;
      this.getStudentProfile();
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
      this.getStudentProfile();
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
      ...this.licenseForm.value
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
      // licenses: this.studentProfile.licenses
      licenses: this.licenses.filter(license => license.selected)
    }).subscribe(resp => {
      this.service.showMessage({
        message: "Licenses updated successfully",
      });
      this.hideShow('licenses', '')
      this.licenseForm.reset();

     this.getStudentProfile();
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
    this.formpage = page;
    this.formlimit = 5;
    const payload = {
      student_id: this.studentProfile?.student_id,
      "limit": this.formlimit,
      "offset": this.formpage-1
    }
    // vdnjkc
    this.service.getSubmittedStudentDocuments(payload).subscribe((res: any) => {

      console.log("resresresresres", res);
      // this.submittedDocuments = res.records.filter(record => record.task_type === 'attachments');
      // this.submittedForms = res.records.filter(record => record.task_type === 'form');

      this.submittedForms = res.records;
      if(res.record_count <= this.formlimit){
        this.formlimit = res.record_count;
      }
      this.totalformList = res.record_count;
      this.totalforms = Math.ceil(res.record_count/this.formlimit);
      console.log(" this.totalNotes",  this.totalforms);


      // this.hideShowDocuments(3);
      // this.hideShowForms(3);
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




  submissionCreate:boolean = false;
  files = [];
  
 getFilDoc(event: Event) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  // Convert FileList to array
  const filesArray = Array.from(fileList);

  // Ensure media.documents is initialized
  this.media.documents = this.media?.documents ?? [];

  filesArray.forEach(file => {
    if (file.size > 5242880) { // 5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });

      // Clear input to allow selecting same file again
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.media.documents.push(resp);
    });
  });

  // ✅ Clear file input after all uploads
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
      this.getStudentProfileById(this.documentpage);
      // this.emitEvent();
     this.submissionCreate = false;
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })

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
      this.documents = res.record.documents;
      if(res.documents_count <= this.documentlimit){
        this.documentlimit = res.documents_count;
      }
      this.totaldocumentList = res.documents_count;
      this.totaldocuments = Math.ceil(res.documents_count/this.documentlimit);
      console.log(" this.totalNotes",  this.totaldocuments);

    });
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
  submittedEmail:any = [];
  getEmails(page) {
    this.emailpage = page;
    this.emaillimit = 5;
    const payload = {
      "company_id": this.studentProfile._id,
      "receiver_type": "student",
      "limit": this.emaillimit,
      "offset": this.emailpage-1
    }
    this.service.getSentEmailCompany(payload).subscribe((res: any) => {
      // this.submittedDocuments = res.records.filter(record => record.task_type === 'attachments');
      // this.submittedForms = res.records.filter(record => record.task_type === 'form');
      // this.hideShowDocuments(3);
      // this.hideShowForms(3);

      this.submittedEmail = res.data;
      if(res.record_count <= this.emaillimit){
        this.emaillimit = res.record_count;
      }
      this.totalemailList = res.record_count;
      this.totalemails = Math.ceil(res.record_count/this.emaillimit);
      console.log(" this.totalNotes",  this.totalemails);

    });
  }

  goBack() {
    this.location.back();
  }


    // displayedStudentPGColumns: string[] = ['code', 'title', 'industry', 'category', 'published', 'student', 'placement_type']
    displayedStudentPGColumns: string[] = ['code', 'title', 'placement_type', 'category']
    
    selectedStudents:any = {};
      studentPGs:any = [];
        getStudentPG(student) {
          this.studentPGs = [];
          let payload = {
            student_id: student.student_id?student.student_id:student._id
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
    
}
