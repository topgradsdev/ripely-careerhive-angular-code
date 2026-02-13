import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-about-you',
  templateUrl: './onboarding-about-you.component.html',
  styleUrls: ['./onboarding-about-you.component.scss']
})
export class OnboardingAboutYouComponent implements OnInit {
  aboutForm: FormGroup;
  industryForm:FormGroup;
  jobPreferenceForm: FormGroup;
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
     { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
  ];
  travelPreference = 40;
  jobSkills = [];
  searchValue4 = "";
  googlePlaceOptions: any = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    // types: ['(regions)']
    types: []
  }

  constructor(private fb: FormBuilder,
    private router: Router,
    private service: TopgradserviceService) { }
  onSliderChange(event: any) {
    console.log("event", event);
    this.travelPreference = event;
  }

  ngOnInit(): void {
    this.aboutForm = this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      permanent_email: ['', [Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      preferred_name: ['', [Validators.nullValidator]],
      pronouns: ['', [Validators.required]],
      addressLine1: ['', Validators.required],
      flexibleSchedule: [false],
      postCode: ['', Validators.required],
      suburb: ['', Validators.nullValidator],
      state: ['', Validators.nullValidator],
      country: ['', Validators.nullValidator],
      travelPreference: [40],
      availableDays: ['']
    });

    this.industryForm = this.fb.group({
      industry: [[]], 
    });

    

    this.jobPreferenceForm = this.fb.group({
      jobPreferences: this.fb.array([
        this.fb.group({
          expertise: ["", Validators.nullValidator],
          jobTitle: ["", Validators.required],
          skills: [[]],
          selectedSkills: [[], Validators.required]
        })
      ])
    });
    // this.getJobSkills();
    this.jobTitleList();
    this.getStudentProfile();
    this.industryList();
    this.searchControl.valueChanges.subscribe((searchText: string) => {
      this.filteredOptions = this._filterOptions(searchText);
    });

    this.searchIndustryControl.valueChanges.subscribe((searchText: string) => {
      this.filteredOptions1 = this._filterOptions1(searchText);
    });



  }

  private _filterOptions1(searchText: string): string[] {
    const lowerSearchText = searchText.toLowerCase();
    return this.industrylist.filter(option => option.name.toLowerCase().includes(lowerSearchText));
  }

  removeIndustry(id: string) {
  const industries = this.industryForm.get('industry')?.value as string[];
  this.industryForm.get('industry')?.setValue(industries.filter(i => i !== id));
}


  industrylist:any = [];
   industryList(isDraft?: boolean) {
    let param = { search: '' };
    this.service.getindustry(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.industrylist = res.data;
       this.filteredOptions1 = this.industrylist;
      // if (this.selectedVacancy) {
      //   this.industrylist.find((s: any) => {
      //     if (s._id == this.selectedVacancy.industry_id) {
      //       this.getSubIndustries(s._id, true);
      //     }
      //   })
      // }
    })

  }
  getName(id){
    return this.industrylist.find(x => x._id === id)?.name
  }


  
  private _filterOptions(searchText: string): string[] {
    const lowerSearchText = searchText.toLowerCase();
    return this.jobTitles.filter(option => option.name.toLowerCase().includes(lowerSearchText) || option.code.toString().toLowerCase().includes(lowerSearchText));
  }
  filteredOptions: string[];
  filteredOptions1: string[];
  searchControl = new FormControl();
  searchIndustryControl= new FormControl();
  jobTitles:any = [];

  jobTitleList() {
    let param = { search: '' };
    this.service.getJobTitle(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.jobTitles = res.data;
      this.filteredOptions = this.jobTitles;
    })

  }

  // phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  //   const digitsOnly = control.value?.replace(/\D/g, '') || '';
  //   const isValid = digitsOnly.length >= 10 && digitsOnly.length <= 15;
  //   return isValid ? null : { invalidPhoneNumber: true };
  // }

  getStudentProfile() {
    this.service.getStudentProfile({}).subscribe((res: any) => {
      this.aboutForm.patchValue({
        phone: res.record.phone_no?res.record.phone_no:(res.record.mobile?res.record.mobile:'') ,
        email: res.record.email,
        permanent_email: res.record.permanent_email,
        // addressLine1: res.record.address?res.record.address:(res.record.address_line_1?res.record.address_line_1:''),
        addressLine1: res.record.address_line_1?res.record.address_line_1: res.record.address_line_01?res.record.address_line_01:'',
        flexibleSchedule: res.record.flexible_schedule,
        postCode: res.record.post_code?res.record.post_code:(res.record.postal_code?res.record.postal_code:''),
        suburb: res.record.suburb,
        state: res.record.state,
        country: res.record.country,
        travelPreference: res.record.travel_preference,
        availableDays: res.record.available_days,
         first_name: res.record.first_name,
        last_name: res.record.last_name,
        preferred_name: res.record.preferred_name,
        pronouns: res.record.pronouns,
      });

      // 🔒 Disable fields that already have a value
    Object.keys(this.aboutForm.controls).forEach(key => {
      const control = this.aboutForm.get(key);
      if (control?.value) {
        control.disable();
      }
    });

      this.addSpacesInNumber();
      // this.jobPreferenceForm.patchValue(
      //   { jobPreferences: res.record.job_preference }
      // );
      if (res.record?.job_preference?.length > 0) {
        this.jobPreferenceArray.clear();
        res.record?.job_preference.forEach((preference, i) => {
          this.addJobPreference();
          this.jobPreferenceArray.controls[i].patchValue({
            expertise: preference.expertise,
            jobTitle: preference.jobTitle,
            skills: preference.skills,
            selectedSkills: preference.selectedSkills
          });
        });
      }
      if (!res.record?.job_preference || res.record?.job_preference?.length === 0 || res.record?.job_preference?.length === 1) {
        this.addJobPreference();
      }

      this.travelPreference = res.record?.travel_preference
      this.days.forEach(day => {
        const found = res.record?.available_days?.split(',').find(days => days === day.name);
        if (found) {
          day.selected = true;
        }
      });
    });
  }

  get jobPreferenceArray(): FormArray {
    return this.jobPreferenceForm.controls["jobPreferences"] as FormArray;
  }

  removeJobPreference(index) {
    this.jobPreferenceArray.removeAt(index);
  }

  // addSpacesInNumber() {
  //   this.aboutForm.controls.phone.patchValue(this.aboutForm.value.phone.replace(/[^\dA-Z]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ').trim())
  //   const startWithZero = /^04/g;
  //   const num = this.aboutForm.value.phone.split(" ").join("");
  //   if (!startWithZero.test(num) && this.aboutForm.value.phone.length > 2) {
  //     this.aboutForm.controls.phone.setErrors({ pattern: true });
  //   }
  //   const val = this.aboutForm.value.phone.slice(2, 13).split(" ").join("");
  //   const pattern = /(\d)\1{7}/g;
  //   if (pattern.test(val) && val.length === 8) {
  //     this.aboutForm.controls.phone.setErrors({ pattern: true });
  //   }
  // }
  addSpacesInNumber() {
    const phoneControl = this.aboutForm.controls.phone;
    let input = phoneControl.value;
  
    // Trim and check for empty input (trigger required)
    if (!input || input.trim() === '') {
      phoneControl.setValue('');
      phoneControl.setErrors({ required: true });
      return;
    }

    // ✅ Check for special characters (allow only digits and spaces)
    const specialCharPattern = /[^\d\s]/;
    if (specialCharPattern.test(input)) {
      phoneControl.setErrors({ specialChar: true });
      return;
    }
  
    // Remove non-numeric characters
    const rawNumber = input.replace(/[^\d]/g, '');
  
    // Format the number with spaces (e.g., 123 456 7890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    phoneControl.setValue(formattedNumber.trim(), { emitEvent: false });
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/;
    if (repeatingPattern.test(rawNumber)) {
      phoneControl.setErrors({ pattern: true });
      return;
    }
  
    // Validate length: must be between 10 and 15
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      phoneControl.setErrors({ length: true });
      return;
    }
  
    // ✅ Clear errors only if all validations pass
    phoneControl.setErrors(null);
  }
  
  
  
  
  nextStep(stepper: MatStepper) {
    if (this.aboutForm.invalid) {
      this.aboutForm.markAllAsTouched();
      return;
    }
    const selectedDays = [];
    this.days.forEach(day => {
      if (day.selected) {
        selectedDays.push(day.name);
      }
    });
    this.aboutForm.patchValue({
      availableDays: selectedDays.join()
    });
    stepper.next();
  }

  getJobSkills(event) {
    console.log("event", event)
    // this.jobPreferenceArray.controls.forEach((preference: any) => {
    const obj = {
      search: event.target.value
    }
    this.service.getSkills(obj).subscribe((res: any) => {
      this.jobSkills = res.data;
    });
    // });
  }

  addJobPreference() {
    // if (!this.jobPreferenceArray.valid) {
    //   this.jobPreferenceArray.markAllAsTouched()
    //   return
    // }

    this.jobPreferenceArray.push(
      this.fb.group({
        expertise: ["", Validators.nullValidator],
        jobTitle: ["", Validators.required],
        skills: [[]],
        selectedSkills: [[], Validators.required]
      })
    )
  }

  onChangeAnalyst(e, i) {
    if (!e) {
      return;
    }
    if (this.jobPreferenceArray.controls[i].value.selectedSkills.length >= 10) {
      return;
    }
    this.jobPreferenceArray.controls[i].patchValue({
      skills: []
    });
    const found = this.jobPreferenceArray.controls[i].value.selectedSkills.find(skill => skill._id === e._id);
    if (!found) {
      this.jobPreferenceArray.controls[i].patchValue({
        selectedSkills: [...this.jobPreferenceArray.controls[i].value.selectedSkills, ...[e]]
      });
    }
  }

  search4(e: any) {
    if (e.target.value == '') {
      return
    } else {
      this.searchValue4 = e.target.value;
      this.skillsList()
    }
  }

  skillsList() {
    let obj = {
      'search': this.searchValue4
    }
    this.service.getSkillList(obj).subscribe(res => {
      this.jobSkills = res.data;
    });
  }

  removeJobSkills(skillIndex, i) {
    this.jobPreferenceArray.controls[i].value.selectedSkills.splice(skillIndex, 1);
    this.jobPreferenceArray.controls[i].get('selectedSkills').updateValueAndValidity();
  }

  submitStudentProfile() {
    if (this.jobPreferenceForm.invalid) {
      this.jobPreferenceForm.markAllAsTouched();
      return;
    }
    const payload = {
      address: this.aboutForm.value.addressLine1,
      available_days: this.aboutForm.value.availableDays,
      country :this.aboutForm.value.country,
      permanent_email: this.aboutForm.value.permanent_email,
      flexible_schedule: this.aboutForm.value.flexibleSchedule,
      job_preference: this.jobPreferenceForm.value.jobPreferences,
      phone_no: this.aboutForm.value.phone,
      mobile: this.aboutForm.value.phone,
      post_code: this.aboutForm.value.postCode,
      state: this.aboutForm.value.state,
      subrub: this.aboutForm.value.suburb,
      travel_preference: this.travelPreference,
      industry: this.industryForm.value.industry,
      student_profile: true,
      first_name: this.aboutForm.value.first_name,
      last_name: this.aboutForm.value.last_name,
      preferred_name: this.aboutForm.value.preferred_name,
      pronouns: this.aboutForm.value.pronouns,
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student profile updated successfully"
      });
      this.router.navigate(['/student/dashboard']);
      localStorage.setItem('displayProfileSection', JSON.stringify(true));
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  checkFlexibleSchedule(event) {
    if (event.checked) {
      this.days.forEach(day => {
        day.selected = true;
      });
    }
  }

  handleAddressChange(event: any) {
    if (event.geometry && event.name && event.formatted_address) {
      const filteredPostalCodes = event.address_components.filter(component => {
        if (component.types.includes('country')) {
          this.aboutForm.patchValue({
            country: component.long_name
          });
        } else if (component.types.includes('administrative_area_level_1')) {
          this.aboutForm.patchValue({
            state: component.short_name
          });
        } else if (component.types.includes('locality')) {
          this.aboutForm.patchValue({
            suburb: component.long_name
          });
        } else if (component.types.includes('postal_code')) {
          this.aboutForm.patchValue({
            postCode: component.long_name
          });
        }
        return component.types.includes('postal_code');
      })
      const post_code = filteredPostalCodes.map(component => component.long_name).join(', ');
      const formattedAddress = event.formatted_address.replace(post_code, "").replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',').replace(/\s*,/g, ',').replace(/,\s*$/, '').trim();
      this.aboutForm.patchValue({
        addressLine1: formattedAddress,
        // postCode: post_code
      });
    }
  }
}
