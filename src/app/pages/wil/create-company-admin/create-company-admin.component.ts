import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../../environments/environment';
import { MatStepper } from '@angular/material/stepper';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpResponseCode } from 'src/app/shared/enum';

@Component({
  selector: 'app-create-company-admin',
  templateUrl: './create-company-admin.component.html',
  styleUrls: ['./create-company-admin.component.scss'],
  providers: [BsModalRef]
})
export class CreateCompanyAdminComponent implements OnInit {
  @ViewChild('successCompanyModal') public successCompanyModal: ModalDirective;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link']
    ]
  };
  companies = [
  { id: 12332, name: 'Marriott Hotels', location: 'Melbourne, VIC' },
  { id: 12351, name: 'Coles', location: 'Perth, WA' },
  { id: 12312, name: 'ASDF Company', location: 'Sydney, NSW' }
];
  currentTabEmp: any = 'help_me_write';
  successPage: boolean = false;
  editorForm: FormGroup;
  field1: any;
  field2: any;
  field3: any;

  jobSkills: any = [];
  selectedJobSkills: any = [];
  skillsevent = [];
  essentials: FormGroup;
  additionalForm: FormGroup;
  companyList = [];
  isedit: boolean = false;
  isDraft: boolean = false;
  titles = [];
  industryName;
  subIndustryList = [];
  subIndustryName;
  draftDetail;
  industrylist = [];
  searchValue4;
  skills = [];
  accesstoken;
  address;
  googlePlaceOptions: any = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    types: []
    // types: ['(regions)']
  }
  contractType: any[] = [{ value: 'full_time', name: 'Full Time' }, { value: 'part_time', name: 'Part Time' }, { value: 'casual', name: 'Casual' }, { value: 'temp_contract', name: 'Temp/Contract' }];
  description = "";
  tinyMCEApiKey = environment.tinyMCEApiKey;
  selectedVacancyId = null;
  selectedVacancy = null;
  licenseCertifications = [
    { id: 1, name: 'Own Private Transport', selected: false },
    { id: 2, name: 'Australian Driving License', selected: false },
    { id: 3, name: 'White Card', selected: false },
    { id: 4, name: 'Working with Children’s Check', selected: false },
    { id: 5, name: 'Police Check', selected: false }
  ]

  contactForm: FormGroup;

  constructor(private fb: FormBuilder,
    private service: TopgradserviceService,
    // private loader: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute) { }
  userDetail: any;
  ngOnInit(): void {

    // setTimeout(() => {
    //      this.successCompanyModal.show();
    // }, 500);
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.essentials = this.fb.group({
      company_id: [0, [Validators.required]],
      company_name: ["", [Validators.required]],
      abn_acn: ["", [Validators.required]],
      address: ["", Validators.required],
      suburb: ["", Validators.required],
      state: ["", Validators.required],
      postal_code: ["", Validators.required],
      country: ["Australia", Validators.required],
      is_child: ["", Validators.nullValidator],
      parent_id: [null, Validators.nullValidator],
      code: ["", Validators.nullValidator],
      web_address: ["", Validators.required],
      company_logo: [, Validators.nullValidator],
      company_phone: ["", Validators.required],
      no_of_employees: ["", Validators.required],
      industry_id: ["", Validators.required],
      sub_industry_id: ["", Validators.required],
      created_by: [this.userDetail && this.userDetail._id ? this.userDetail.first_name +" "+this.userDetail.last_name
       : "", Validators.nullValidator],
      created_by_id:[this.userDetail && this.userDetail._id ? this.userDetail._id : "", Validators.nullValidator],
      user_type: [this.userDetail && this.userDetail.type ? this.userDetail.type : '', Validators.nullValidator]
    });

   this.essentials.get('is_child')?.valueChanges.subscribe(value => {
  const selectedCompanyCtrl = this.essentials.get('parent_id');
  if (value) {
    selectedCompanyCtrl?.setValidators([Validators.required]);
  } else {
    selectedCompanyCtrl?.clearValidators();
  }
  selectedCompanyCtrl?.updateValueAndValidity();
});


    this.contactForm = this.fb.group({
      contacts: this.fb.array([
        this.fb.group({
          first_name: ["", Validators.required],
          last_name: ["", Validators.required],
          primary_email: ["", [Validators.required, 
            // Validators.email
            // , Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')
          ]],
          secondary_email: [
            "",
            [
              // Validators.pattern(
              // "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$"
              // ),
              // Validators.email,
            ],
          ],
          primary_phone: ["", Validators.required],
          secondary_phone: ["", [
            Validators.pattern(/^\d{1}\s\d{3}\s\d{3}\s\d{3}$/), // Format: 0 123 456 789
            Validators.minLength(12),
            Validators.maxLength(13)
          ]], 
          department_id:[null, Validators.required],
          role: ["", Validators.required],
          preferred_contact: [true, Validators.required],
          updatedAt:[new Date().toISOString()],
          createddAt:[new Date().toISOString()]
        })
      ])
    });



    this.additionalForm = this.fb.group({
      source_of_lead: ["", Validators.required],
      conversion_status: ["", Validators.required],
    });



    this.editorForm = this.fb.group({
      'about': ['', [Validators.required, Validators.minLength(50)]],
      'job_resp': ['', [Validators.required, Validators.minLength(50)]],
      'qualfctn_exp': ['', [Validators.required, Validators.minLength(50)]],
      'write_my_own_description': ['', [Validators.required, Validators.minLength(150)]],
      'use_ai_description': ['', [Validators.required, Validators.minLength(50)]],
      'no_of_vacancy': ['', [Validators.required,
      Validators.pattern('^[0-9]*$'), this.defaultValueOrRangeValidator(
        0,
        Validators.min(0),
        Validators.max(99)
      )]],
      'contract_type': ['', [Validators.required]],
      'work_type': ['', [Validators.required]],
      'license_certification': [''],
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.selectedVacancyId = params.id;
        this.getVacancyById();
      }
    });
    this.getCompanyHeadquarterList();
    this.getdepartmenList();

    this.getIndustryList();
  }


  industryList: any = []
  getIndustryList() {
    let param = { search: '' };
    this.service.getindustry(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.industryList = res.data;
    })
  }


  departmentList: any = []
  getdepartmenList() {
    this.service.getdepartments({}).subscribe((res:any) => {
    
      if (res.status == HttpResponseCode.SUCCESS) {
        this.departmentList = res.data;
      } else {
          this.departmentList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  CompanyHQList: any = []
  getCompanyHeadquarterList() {
    this.service.getCompanyHeadquarter().subscribe((res:any) => {
    
     this.CompanyHQList = res.result?res.result:[];
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  get contactlist(): FormArray {
    return this.contactForm.controls["contacts"] as FormArray;
  }

  removeJobPreference(index) {
    this.contactlist.removeAt(index);
  }


  addJobPreference() {
    this.contactlist.push(
      this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        primary_email: [
          "",
          [
            Validators.required,
            // Validators.email,
            // Validators.pattern(
            //   "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$"
            // ),
          ],
        ],
        secondary_email: [
          "",
          [
            // Validators.pattern(
            // "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$"
            // ),
            // Validators.email,
          ],
        ],
        primary_phone: ["", Validators.required],
        department_id:[null, Validators.required],
        secondary_phone: ["", [
          Validators.pattern(/^\d{1}\s\d{3}\s\d{3}\s\d{3}$/), // Format: 0 123 456 789
          Validators.minLength(12),
          Validators.maxLength(13)
        ]], 
        role: ["", Validators.required],
        preferred_contact: [false, Validators.required],
        updatedAt:[new Date().toISOString()],
        createddAt:[new Date().toISOString()]
      })
    )
  }


  getVacancyById() {
    // const obj = {
    //   _id: this.selectedVacancyId
    // }
    // this.service.getVacancyById(obj).subscribe((res: any) => {
    //   const result = res.data[0];
    //   this.selectedVacancy = result;
    //   this.address = result?.job_location?.name;
    //   // this.getSkill(result?.skills);
    //   this.essentials.patchValue({
    //     companyName: result?.company_info[0]?.company_name,
    //     company_id: result?.company_id,
    //     companyTitle: result?.job_title,
    //     industry: result?.industry_id,
    //     sub_industry: result?.sub_industry_id,
    //     location: result?.job_location?.name,
    //     latitude: result?.job_location?.latitude,
    //     longitude: result?.job_location?.longitude,
    //     company_logo: result?.company_logo,
    //   });
    //   this.description = result?.job_description;
    //   this.editorForm.patchValue({
    //     about: result?.about,
    //     job_resp: result?.job_resp,
    //     qualfctn_exp: result?.qualfctn_exp,
    //     write_my_own_description: result?.write_my_own_description,
    //     use_ai_description: result?.use_ai_description,
    //     no_of_vacancy: result?.no_of_vacancy,
    //     contract_type: result?.contract_type,
    //     work_type: result?.work_type,
    //     license_certification: result?.license_certification,
    //   });
    //   this.getJobSkills(result?.job_title, result?.skills);
    //   const licenses = result.license_certification?.split(',');
    //   licenses.forEach(license => {
    //     const found = this.licenseCertifications.find(lc => lc.name === license);
    //     if (found) {
    //       this.selectLecense(found);
    //     }
    //   });
    //   this.industryList();
    // });
  }


  addSpacesInNumber() {
    // Remove non-numeric characters
    const rawNumber = this.essentials.value.company_phone.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the form control value with the formatted number
    this.essentials.controls.company_phone.patchValue(formattedNumber.trim());
  
    // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      this.essentials.controls.company_phone.setErrors({ pattern: true });
      return;
    }
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      this.essentials.controls.company_phone.setErrors({ pattern: true });
      return;
    }
  }
  

  addSpacesInNumber1(arrayIndex: number, type: string): void {
    // Access the FormArray
    const contactsArray = this.contactForm.get('contacts') as FormArray;
  
    // Check if the index is valid
    if (arrayIndex < 0 || arrayIndex >= contactsArray.length) {
      console.error(`Index ${arrayIndex} is out of bounds for the FormArray`);
      return;
    }
  
    // Access the specific group in the FormArray by index
    const contactGroup = contactsArray.at(arrayIndex) as FormGroup;
  
    // Access the specific control within the group
    const control = contactGroup.get(type);
  
    // If the value is empty, set the errors to null and return
    if (!contactGroup.value[type]) {
      control.setErrors(null); // Clear any existing errors
      return;
    }
  
    if (!control) {
      console.error(`Control '${type}' does not exist in the form group at index ${arrayIndex}`);
      return;
    }
  
    // Get the raw value from the control
    const rawInput = control.value || ''; // Default to an empty string if null/undefined
  
    // Ensure rawInput is a string before calling replace
    if (typeof rawInput !== 'string') {
      console.error(`Value of control '${type}' is not a string:`, rawInput);
      return;
    }
  
    // Remove all non-numeric characters (e.g., spaces, letters)
    const rawNumber = rawInput.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the control value with the formatted number
    control.patchValue(formattedNumber.trim(), { emitEvent: false });
  
    // Validation: Ensure the length is valid (10 to 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      control.setErrors({ pattern: true });
      return;
    }
  
    // Validation: Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      control.setErrors({ pattern: true });
      return;
    }
  
    // Clear errors if validation passes
    control.setErrors(null);
  }
  
 addSpacesInABN() {
  let abn_acn = this.essentials.value.abn_acn.replace(/[^\dA-Z]/g, '').trim(); // Remove non-numeric characters

  // Check if the length of the ABN is greater than or equal to 2
  if (abn_acn.length >= 2) {
    const firstTwoDigits = abn_acn.slice(0, 2); // Get the first two digits
    const remainingDigits = abn_acn.slice(2); // Get the remaining digits

    // Add spaces after every 3rd digit of the remaining part
    const formattedRemaining = remainingDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Concatenate the first two digits with the formatted remaining part
    abn_acn = `${firstTwoDigits} ${formattedRemaining}`;
    
    // Patch the formatted value back to the control
    this.essentials.controls.abn_acn.patchValue(abn_acn.trim());

    // Ensure the total length is 11 digits (excluding spaces)
    const cleanedValue = abn_acn.split(' ').join('');
    console.log("cleanedValue.length", cleanedValue.length);
    if (cleanedValue.length !== 11) {
      this.essentials.controls.abn_acn.setErrors({ pattern: true });
      return;
    }

    // Check for a repeating pattern of 8 identical digits in the ABN
    const val = cleanedValue.slice(2); // Exclude the first two digits
    const pattern = /(\d)\1{9}/g;
    if (pattern.test(val)) {
      this.essentials.controls.abn_acn.setErrors({ pattern: true });
      return;
    }

    // Clear the error if no issues
    // this.essentials.controls.abn_acn.setErrors(null);
  }
}


  getSkill(skills) {
    let obj = {
      'job_title': "",
    }
    this.service.getJobSkills(obj).subscribe(res => {
      this.selectedJobSkills = skills.map(skill => {
        const found = res.data.find(rSkill => rSkill._id === skill);
        if (found) {
          skill = found;
        }
        return skill;
      });
    });
  }

  defaultValueOrRangeValidator(
    defaultValue: number,
    ...rangeValidators: ValidatorFn[]
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == defaultValue) return null;

      for (let validator of rangeValidators) {
        if (validator(control)) return validator(control);
      }
    };
  }

  changeTab(e: any) {
    if (e === 'use') {
      this.editorForm.controls.about.setErrors(null);
      this.editorForm.controls.qualfctn_exp.setErrors(null);
      this.editorForm.controls.job_resp.setErrors(null);
      this.editorForm.controls.write_my_own_description.setErrors(null);
    } else if (e === "write_my_own") {
      this.editorForm.controls.use_ai_description.setErrors(null);
      this.editorForm.controls.about.setErrors(null);
      this.editorForm.controls.qualfctn_exp.setErrors(null);
      this.editorForm.controls.job_resp.setErrors(null);
    } else if (e === "help_me_write") {
      this.editorForm.controls.use_ai_description.setErrors(null);
      this.editorForm.controls.write_my_own_description.setErrors(null);
    }
    this.currentTabEmp = e;
  }
  input_flds1(e: any) {
    this.field1 = e
  }
  input_flds2(e: any) {
    this.field2 = e
  }
  input_flds3(e: any) {
    this.field3 = e
  }

  // handleAddressChange(event: any) {
  //   if (event.geometry && event.name && event.formatted_address) {
  //     this.companyInfoForm.patchValue({
  //       address: event.formatted_address
  //     });
  //   }
  // }
  @ViewChild('PreferredContact', { static: false }) PreferredContact: ModalDirective;
  message :any= ''
  async postVacancy() {

    console.log("essentials", this.essentials.value);
    console.log("contactForm", this.contactForm.value);
    console.log("additionalForm", this.additionalForm.value);
    let body = {
      "company_name": this.essentials.value.company_name,
      "abn_acn": this.essentials.value.abn_acn,
      "address": this.essentials.value.address,
      "company_phone": this.essentials.value.company_phone,
      "suburb": this.essentials.value.suburb,
      "state": this.essentials.value.state,
      "postal_code": this.essentials.value.postal_code,
      "country": this.essentials.value.country,
      "web_address": this.essentials.value.web_address,
      "industry_id": this.essentials.value.industry_id,
      "sub_industry_id": this.essentials.value.sub_industry_id,
      "no_of_employees": this.essentials.value.no_of_employees,
      // "location": this.essentials.value.location,
      "company_code": this.essentials.value.code,
      "contact_person": this.contactForm.value.contacts,
      "lead_source": this.additionalForm.value.source_of_lead,
      "company_leadsource": this.additionalForm.value.source_of_lead,
      "conversion_status": this.additionalForm.value.conversion_status,
      // "email": this.contactForm.value.contacts[0].primary_email,
      created_by: this.userDetail?.first_name ? `${this.userDetail.first_name} ${this.userDetail.last_name || ''}`.trim() : '',
      "created_by_id": this.userDetail && this.userDetail._id ? this.userDetail._id:"",
      // this.essentials.value.created_by,
      "verified": "success",
      is_child: this.essentials.value.is_child,
      // parent_id: this.essentials.value.parent_id,
    }
    if(this.essentials.value.parent_id){
      body['parent_id'] = this.essentials.value.parent_id;
    }


    let find = await this.industryList.find(el => el._id === this.essentials.value.industry_id);
    if (find) {
      body['industry_name'] = find.name;
    } else {
      body['industry_name'] = "";
    }

    // await this.contactForm.value.contacts.forEach((element, key) => {
    //   body[`contact_0${key + 1}_first_name`] = element.first_name;
    //   body[`contact_0${key + 1}_last_name`] = element.last_name;
    //   body[`contact_0${key + 1}_title`] = element.role;
    //   body[`contact_0${key + 1}_primary_email`] = element.primary_email;
    //   body[`contact_0${key + 1}_secondary_email`] = element.secondary_email;
    //   body[`contact_0${key + 1}_primary_phone`] = element.primary_phone;
    //   body[`contact_0${key + 1}_secondary_phone`] = element.secondary_phone;
    //   body[`contact_0${key + 1}_created_by`] = this.userDetail && this.userDetail._id ? this.userDetail.first_name +" "+this.userDetail.last_name:"";
    //   // this.essentials.value.created_by;
    //   body[`contact_0${key + 1}_created_date`] = 
    //   `${new Date().getDate().toString().padStart(2, '0')}/` +
    //   `${(new Date().getMonth() + 1).toString().padStart(2, '0')}/` +
    //   `${new Date().getFullYear()}`;
    
    //   body[`contact_0${key + 1}_first_name`] = element.first_name;
    // });

    // body['contacts'] = this.contactForm.value.contacts;

    console.log("body", body)
    // return false;
    this.service.createCompany(body).subscribe(res => {
      if (res.status == 200) {
        this.service.showMessage({
          message: "Company added Successfully"
        });
        this.companyId = res.company_id;
        this.successCompanyModal.show();
      } else {
        if(res.status==400){
          this.message = res.msg;
          setTimeout(()=>{
            this.PreferredContact.show()
          }, 300)
          return false
        }else if(res.status==204){
          this.message = res.msg;
          setTimeout(()=>{
            this.PreferredContact.show()
          }, 300)
          return false;
         } else{
          this.service.showMessage({ message: res.msg });
        }
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  companyId:any = null

  getJobSkills(job_title?: string, skills?: any) {
    if (!job_title && this.essentials.controls.companyTitle.invalid) {
      return;
    }
    this.jobSkills = skills && skills.length > 0 ? skills : [];
    this.selectedJobSkills = [];
    if ((skills && skills.length > 0)) {
      skills.forEach((skill: any) => {
        this.selectedJobSkills.push(skill);
      });
    }
    const obj = {
      job_title: job_title ? job_title : this.essentials.value.companyTitle
    }
    // this.loader.start();
    if (!this.selectedVacancy) {
      // this.getJobDescription();
    }
    // this.service.getJobSkills(obj).subscribe((res: any) => {
    //   this.loader.stop();
    //   Array.prototype.push.apply(this.jobSkills, res.data);
    // });
  }

  getJobDescription(isGeneratedNew?: boolean) {
    const obj = {
      job_title: this.essentials.value.companyTitle,
      exp: 0
    }
    if (isGeneratedNew) {
      // this.loader.start();
    }
    this.service.getJobDescription(obj).subscribe((res: any) => {
      if (isGeneratedNew) {
        // this.loader.stop();
      }
      this.editorForm.patchValue({
        use_ai_description: res.data.replace(/\n/g, "<br/>")
      });
    });
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

  setCompanyLogo(company: any) {
    this.essentials.patchValue({
      company_logo: company.company_logo,
      company_id: company._id
    });
  }

  selectIndustry(e: any) {
    // console.log("helllooooooo", e);
    this.industryName = e.value;
    // console.log("helllooooooo", this.industryName);
     this.essentials.patchValue({
      sub_industry_id:""
     })
    this.getSubIndustries(e);
  }

  // industryList(isDraft?: boolean) {
  //   let param = { search: '' };
  //   this.service.getindustry(param).subscribe(res => {
  //     res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
  //     this.industrylist = res.data;
  //     if (this.selectedVacancy) {
  //       this.industrylist.find((s: any) => {
  //         if (s._id == this.selectedVacancy.industry_id) {
  //           this.getSubIndustries(s._id, true);
  //         }
  //       })
  //     }
  //   })

  // }

  getSubIndustries(indystry_id: number, isDraft?: boolean) {
    let param = { parent_id: indystry_id }
    this.service.getsubIndustry(param).subscribe(res => {
      console.log(res);
      this.subIndustryList = res.data;
      if (this.selectedVacancy) {
        this.subIndustryList.find((s: any) => {
          if (s._id == this.selectedVacancy.sub_industry_id) {
            this.subIndustryName = s.name;
            this.essentials.patchValue({
              industry: indystry_id,
              sub_industry: s._id
            });
          }
        })
      }
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

  skillsList() {
    let a = this.searchValue4.replace(/%20/g, " ");
    let obj = {
      'search': a,
    }
    this.service.getSkillForVacancy(obj).subscribe(res => {
      this.skills = res.data
    });
  }

  onChangeAnalyst(e: any) {
    this.essentials.patchValue({
      skills: []
    });
    const idx = this.jobSkills.indexOf(e[0]);
    if (idx === -1) {
      this.jobSkills.unshift(e[0]);
      if (this.selectedJobSkills.length < 5) {
        this.selectJobSkill(e[0]);
      }
    }
  }

  selectJobSkill(item: any) {
    const idx = this.selectedJobSkills.findIndex(it => it._id === item._id);
    if (idx !== -1) {
      this.selectedJobSkills.splice(idx, 1);
    } else {
      if (this.selectedJobSkills.length < 5) {
        this.selectedJobSkills.push(item);
      }
    }
  }

  handleAddressChange(event: any) {

    console.log("event", event);
    if (event.geometry && event.name && event.formatted_address) {
      const filteredPostalCodes = event.address_components.filter(component => {
        if (component.types.includes('country')) {
          this.essentials.patchValue({
            country: component.long_name
          });
        } else if (component.types.includes('administrative_area_level_1')) {
          this.essentials.patchValue({
            state: component.short_name
          });
        } else if (component.types.includes('locality')) {
          this.essentials.patchValue({
            suburb: component.long_name
          });
        } else if (component.types.includes('postal_code')) {
          this.essentials.patchValue({
            postal_code: component.long_name
          });
        }
        return component.types.includes('postal_code');
      })
      const post_code = filteredPostalCodes.map(component => component.long_name).join(', ');
      const formattedAddress = event.formatted_address.replace(post_code, "").replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',').replace(/\s*,/g, ',').replace(/,\s*$/, '').trim();
      this.essentials.patchValue({
        address: formattedAddress,
        location:formattedAddress
        // postal_code: post_code
      });
      this.address = formattedAddress;
    }
  }

  clearLocation() {
    this.essentials.patchValue({
      // latitude: "",
      // longitude: ""
    })
  }

  fun(stepper: MatStepper) {
    if (this.essentials.invalid) {
      this.essentials.markAllAsTouched()
    } else {
      this.changeTab(this.currentTabEmp);
      stepper.next();
    }
  }

  fun2(stepper: MatStepper) {
    if (this.contactForm.invalid) {
      this.editorForm.markAllAsTouched();
      return;
    } else {
      stepper.next();
    }
  }

  getMultipleSkillsByIds(ids?: any) {
    this.skillsevent = this.jobSkills.filter((skill: any) => {
      return this.selectedJobSkills.findIndex(sk => sk._id === skill._id) !== -1;
    });
  }

  isSelectedSkill(skill) {
    return this.selectedJobSkills.some(sSkill => sSkill._id === skill._id);
  }

  selectLecense(license) {
    license.selected = !license.selected;
    this.editorForm.patchValue({
      license_certification: this.licenseCertifications.map(cert => cert.selected ? cert.name : undefined).filter(value => value !== undefined).join()
    });
  }

  // selectPreferredContact(index) {
  //   this.contactlist.controls.forEach((contact, i) => {
  //     if (index === i) {
  //       contact.patchValue({
  //         preferred_contact: true
  //       });
  //     } else {
  //       contact.patchValue({
  //         preferred_contact: false
  //       });
  //     }
  //   });
  // }



    getPreferredContactCount(deptId: any): number {
      return this.contactlist.controls.filter(ctrl =>
        ctrl.get('preferred_contact')?.value &&
        ctrl.get('department_id')?.value === deptId
      ).length;
    }

        onPreferredChange(index: number): void {
        const ctrl = this.contactlist.at(index);
        const deptId = ctrl.get('department_id')?.value;

        const preferredCount = this.getPreferredContactCount(deptId);

        if (preferredCount > 2) {
          ctrl.get('preferred_contact')?.setValue(false);
           this.service.showMessage({
            message:'Maximum 3 preferred contacts allowed per department.'
          });
          // alert('Maximum 3 preferred contacts allowed per department.');
        }
      }

  // get preferredContactCount(): number {
  //   return this.contactlist.controls.filter(
  //     (group) => group.get('preferred_contact')?.value === true
  //   ).length;
  // }

  // selectPreferredContact(index: number): void {
  //   const control = this.contactlist.at(index);

  //   const isCurrentlyChecked = control.get('preferred_contact')?.value;

  //   if (!isCurrentlyChecked && this.preferredContactCount >= 3) {
  //     // If trying to check and already 3 are selected, prevent it
  //     control.get('preferred_contact')?.setValue(false);
  //     control.get('preferred_contact')?.markAsTouched();
  //     control.get('preferred_contact')?.setErrors({ maxSelected: true });
  //   } else {
  //     // Clear error if any
  //     control.get('preferred_contact')?.setErrors(null);
  //   }
  // }

 emailTakenIndex: number | null = null;

checkEmailExists(index: number) {
  const emailControl = this.contactlist.at(index).get('primary_email');
  const email = emailControl?.value;

  if (!email || emailControl?.invalid) return;

   this.service.cehckEmailExistCompnayLogin({email:email}).subscribe((res:any) => {
      if (res.code === 200 && res.result) {
          this.emailTakenIndex = index;
          emailControl?.setErrors({ emailTaken: true });
      } else {
        if (emailControl?.hasError('emailTaken')) {
          delete emailControl.errors?.emailTaken;
          emailControl?.updateValueAndValidity();
        }
        this.emailTakenIndex = null;
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  checkAbnAcn() {
    const emailControl = this.essentials.get('abn_acn');
    const email = emailControl?.value;

    if (!email || emailControl?.invalid) return;

      this.service.checkAbnAcn({abn_acn:email}).subscribe((res:any) => {
        if (res.code === 200 && res.result) {
            emailControl?.setErrors({ abnAcnTaken: true });
        } else {
          if (emailControl?.hasError('emailTaken')) {
            delete emailControl.errors?.abnAcnTaken;
            emailControl?.updateValueAndValidity();
          }
          this.emailTakenIndex = null;
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }

    businessNameList:any = []

  getBusinessName() {
    const emailControl = this.essentials.get('abn_acn');
    const email = emailControl?.value;
    if (!email || emailControl?.invalid) return;

      this.service.getBusinessName({abn_acn:email}).subscribe((res:any) => {
        console.log("res", res);
        if (res.code === 200 && res.data) {
           this.businessNameList =  res.data && res.data.BusinessName?res.data.BusinessName:[];
           this.businessNameList.push(res.data.EntityName);
        } else {
           this.businessNameList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }

    hasAtLeastOnePreferredContact(): boolean {
      const contacts = this.contactForm.get('contacts') as FormArray;
      return contacts.controls.some(contact =>
        contact.get('preferred_contact')?.value === true
      );
    }

    hasTouchedPreferred(): boolean {
      const contacts = this.contactForm.get('contacts') as FormArray;
      return contacts.controls.some(contact =>
        contact.get('preferred_contact')?.touched
      );
    }
}
