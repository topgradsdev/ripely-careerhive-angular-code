import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatStepper } from '@angular/material/stepper';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponseCode } from 'src/app/shared/enum';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-employer-vacancy-self-create',
  templateUrl: './employer-vacancy-self-create.component.html',
  styleUrls: ['./employer-vacancy-self-create.component.scss']
})
export class EmployerVacancSelfCreateComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  currentTabEmp: any = 'write_my_own';
  successPage: boolean = false;
  editorForm: FormGroup;
  field1: any;
  field2: any;
  field3: any;

  jobSkills: any = [];
  selectedJobSkills: any = [];
  skillsevent = [];
  essentials: FormGroup;
  routeForm: FormGroup;
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
    types: ['(regions)']
  }
  contractType: any[] = [{ value: 'full_time', name: 'Full Time' }, { value: 'part_time', name: 'Part Time' }, { value: 'casual', name: 'Casual' }, { value: 'temp_contract', name: 'Temp/Contract' }];
  description = "";
  tinyMCEApiKey = environment.tinyMCEApiKey;
  selectedVacancyId = null;
  selectedVacancy = null;
  userDetail = null;
  licenseCertifications = [
    {id: 1, name: 'Own Private Transport', selected: false},
    {id: 2, name: 'Australian Driving License', selected: false},
    {id: 3, name: 'White Card', selected: false},
    {id: 4, name: 'Working with Children’s Check', selected: false},
    {id: 5, name: 'Police Check', selected: false}
  ]
  constructor(private fb: FormBuilder,
    private service: TopgradserviceService,
    // private loader: NgxUiLoaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // , Validators.maxLength(64)
    this.essentials = this.fb.group({
      'companyName': ['', [Validators.required]],
      'companyTitle': ['', [Validators.required]],
      'industry': ['', [Validators.required]],
      'sub_industry': ['', [Validators.required]],
      'location': ['', [Validators.required]],
      'latitude': ['', Validators.required],
      'longitude': ['', Validators.required],
      'subsidiary_vacancy':[false],
      'parent_company_id': ['', [Validators.nullValidator]],
      'skills': [''],
      'company_logo': [''],
    });

    this.essentials.get('subsidiary_vacancy')?.valueChanges.subscribe(value => {
      const selectedCompanyCtrl = this.essentials.get('parent_company_id');
      if (value) {
        selectedCompanyCtrl?.setValidators([Validators.required]);
      } else {
        selectedCompanyCtrl?.clearValidators();
      }
      selectedCompanyCtrl?.updateValueAndValidity();
    });

    
    this.editorForm = this.fb.group({
      'about': ['', [Validators.required, Validators.minLength(50)]],
      'job_resp': ['', [Validators.required, Validators.minLength(50)]],
      'qualfctn_exp': ['', [Validators.required, Validators.minLength(50)]],
      'write_my_own_description': ['', [Validators.required, Validators.minLength(150)]],
      'use_ai_description': ['', [Validators.required, Validators.minLength(50)]],
      'no_of_vacancy': ['', [Validators.required, 
        Validators.pattern('^[0-9]*$'),  this.defaultValueOrRangeValidator(
          1,
          Validators.min(1),
          Validators.max(99)
        )]],
      'contract_type': [null, [Validators.required]],
      'work_type': [null, [Validators.required]],
      'license_certification': [''],
    });
    
    this.routeForm = this.fb.group({
      'application_receiver': ['', [Validators.required]],
      'placement_supervisor': ['', [Validators.nullValidator]]
    });
     this.getEmployerProfile();
    this.industryList();
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params.id) {
        this.selectedVacancyId = params.id;
        await this.getVacancyById();
        this.industryList();
      }
    });
    
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.essentials.patchValue({
      companyName: this.userDetail?.company_name,
      company_id: this.userDetail?._id
    });

    // this.essentials.get('company_name').disable();
    // this.essentials.get('company_id').disable();
    this.getChildCompany(this.userDetail?._id);
  
    this.getCompanyContactList(this.userDetail?._id);
  
    this.jobTitleList();
    this.searchControl.valueChanges.subscribe((searchText: string) => {
      this.filteredOptions = this._filterOptions(searchText);
    });
   
  }


  ngOnChanges() {
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      this.essentials.patchValue({
        companyName: this.userDetail?.company_name,
        company_id: this.userDetail?._id
      });
  }
selectedCompany:any
  employerProfile:any
  getEmployerProfile() {
    const payload = {
      _id: this.userDetail?._id,
    }
    this.service.getEmployerProfile(payload).subscribe(response => {
      this.employerProfile = response.record;
      this.selectedCompany =  response.record;
        this.getContactList(this.userDetail?._id);
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



  async getVacancyById() {
    const obj = {
      _id: this.selectedVacancyId
    }
    this.service.getVacancyById(obj).subscribe((res: any) => {
      const result = res.data[0];
      this.selectedVacancy = result; 
      this.address = result?.job_location?.name;
      // this.getSkill(result?.skills);
      this.essentials.patchValue({
        // companyName: result?.company_name,
        companyTitle: result?.job_title,
        industry: result?.industry_id,
        sub_industry: result?.sub_industry_id,
        location: result?.job_location?.name,
        latitude: result?.job_location?.latitude,
        longitude: result?.job_location?.longitude,
        subsidiary_vacancy: result?.subsidiary_vacancy,
        company_logo: result?.company_logo,
      });

      if(result?.subsidiary_vacancy && result?.parent_company_id){
        this.essentials.patchValue({
          company_id:result?.parent_company_id,
          parent_company_id: result?.company_id,
          company_logo: result?.company_logo,
          companyName: result?.parent_company_name,
         })
              this.selectedCompany = result?.parent_company_info[0];
        this.getChildCompany(result?.parent_company_id, result?.company_id);
       
      }else{
         this.getChildCompany(result?.company_id);
         this.essentials.patchValue({
          companyName: result?.company_info[0]?.company_name,
          company_id: result?.company_id,
          company_logo: result?.company_logo,
         });
              this.selectedCompany = result?.company_info[0];
      }
      this.getContactList(result?.company_id);
      this.getCompanyContactList(result?.company_id);

      this.routeForm.patchValue({
          application_receiver: result?.application_receiver,
          placement_supervisor: result?.placement_supervisor
       });

      this.description = result?.job_description;
      this.editorForm.patchValue({
        about: result?.about,
        job_resp: result?.job_resp,
        qualfctn_exp: result?.qualfctn_exp,
        write_my_own_description: result?.write_my_own_description,
        use_ai_description: result?.use_ai_description,
        no_of_vacancy: result?.no_of_vacancy,
        contract_type: result?.contract_type,
        work_type: result?.work_type,
        license_certification: result?.license_certification,
      });

      if(result?.about){
        this.input_flds1('about');
      }
      if(result?.job_resp){
        this.input_flds2('job_resp')
      }
      if(result?.job_resp){
        this.input_flds3('qualfctn_exp')
      }
   
      this.getJobSkills(result?.job_title, result?.skills);
      const licenses = result.license_certification?.split(',');
      licenses.forEach(license => {
        const found = this.licenseCertifications.find(lc => lc.name === license);
        if (found) {
          this.selectLecense(found);
        }
      })
      this.industryList();
    });
  }

  getSkill(skills) {
    let obj = {
      'job_title': this.selectedVacancy ? this.selectedVacancy?.job_title : "",
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

  childCompanySelected:any;
  onCompanyChange(selected: any) {
    console.log('Selected object:', selected, this.childCompanyList);
    this.childCompanySelected = selected;
    this.getContactList(this.childCompanySelected._id);
    this.getCompanyContactList(this.childCompanySelected._id);
    // Now you can access selected.company_name, selected._id, etc.
  }

  contactList: any = [];
   getContactList(id) {
      console.log("this.selectedCompany", this.selectedCompany)
    if(this.selectedCompany && this.selectedCompany.is_child){
      this.service.getCompanyContactList({company_id:id}).subscribe((res:any) => {
    
        if (res.status == HttpResponseCode.SUCCESS) {
          this.contactList = res.data;
          this.contactList = this.contactList.map(c => ({
            ...c,
            fullName: `${c.first_name} ${c.last_name}`
          }));
        } else {
            this.contactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }else{
        this.service.getContactList({company_id:id}).subscribe((res:any) => {
    
      if (res.status == HttpResponseCode.SUCCESS) {
        this.contactList = res.data;
        this.contactList = this.contactList.map(c => ({
          ...c,
          fullName: `${c.first_name} ${c.last_name}`
        }));
      } else {
          this.contactList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
    }
  
  }

     companyContactList: any = [];
     getCompanyContactList(id) {
        this.service.getCompanyContactList({company_id:id}).subscribe((res:any) => {
        
          if (res.status == HttpResponseCode.SUCCESS) {
            this.companyContactList = res.data;
            this.companyContactList = this.companyContactList.map(c => ({
              ...c,
              fullName: `${c.first_name} ${c.last_name}`
            }));
          } else {
              this.companyContactList = [];
          }
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
      }
    
  
    childCompanyList: any = []
   getChildCompany(companyId: string, selectedParentCompanyId?: string) {
    this.service.getChildCompany({ company_id: companyId }).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.childCompanyList = res.data;
        console.log(" this.childCompanyList",  this.childCompanyList)
        // ✅ Patch after list is ready
        setTimeout(() => {
            console.log("caling")
            if (selectedParentCompanyId) {
              this.essentials.patchValue({
                parent_company_id: selectedParentCompanyId
              });
  
              // ✅ Also set the selected object (if needed)
              this.childCompanySelected = this.childCompanyList.find(
                c => c._id === selectedParentCompanyId
              );
            }
        }, 200);
  
      } else {
        this.childCompanyList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    });
  }
    
  
 @ViewChild('successModel') successModel: ModalDirective;
  postVacancy() {
    for (let prop in this.essentials.value) {
      if (prop == "location") {
        this.essentials.value[prop] = {
          name: this.address,
          latitude: this.essentials.value.latitude,
          longitude: this.essentials.value.longitude
        }
        this.essentials.value[prop] = this.essentials.value[prop];
      }
    }
    this.successPage = true;
    const obj = {
      // company_name: this.essentials.value.companyName,
      // company_id: this.userDetail?._id,
      // company_logo: this.essentials.value.company_logo,
      job_title: this.essentials.value.companyTitle,
      industry_id: this.essentials.value.industry,
      sub_industry_id: this.essentials.value.sub_industry,
      job_location: this.essentials.value.location,
      contract_type: this.editorForm.value.contract_type,
      work_type: this.editorForm.value.work_type,
      license_certification: this.editorForm.value.license_certification,
      skills: this.selectedJobSkills,
      job_description: this.description,
      about: this.editorForm.value.about,
      job_resp: this.editorForm.value.job_resp,
      qualfctn_exp: this.editorForm.value.qualfctn_exp,
      write_my_own_description: this.editorForm.value.write_my_own_description,
      use_ai_description: this.editorForm.value.use_ai_description,
      no_of_vacancy: this.editorForm.value.no_of_vacancy,
      is_pending:false,
      subsidiary_vacancy:this.essentials.value.subsidiary_vacancy,
      // application_receiver:this.routeForm.value.application_receiver,
    }
 let receivers = this.routeForm.value.application_receiver;

    if (Array.isArray(receivers)) {
      // check if first element is an object
      if (receivers.length && typeof receivers[0] === 'object') {
        receivers = receivers.map(r => r._id);
      }
    } else {
      // if it's a single object or string
      receivers = typeof receivers === 'object' ? [receivers._id] : [receivers];
    }

    if(receivers){
      obj['application_receiver'] = receivers
    }
    if(this.routeForm.value.placement_supervisor){
      obj['placement_supervisor'] =this.routeForm.value.placement_supervisor
    }
    if(this.essentials.value.parent_company_id){
      obj['parent_company_id'] =  this.essentials.value.company_id ;
      obj['company_id'] = this.essentials.value.parent_company_id;
      obj['company_name']= this.childCompanySelected.companyName;
      obj['company_logo'] = this.childCompanySelected.company_logo;
      obj['subsidiary_vacancy'] = true;
    }else{
       obj['company_name']= this.essentials.value.companyName;
       obj['company_logo']= this.essentials.value.company_logo;
       obj['company_id']= this.essentials.value.company_id;
        obj['subsidiary_vacancy'] = false;
    }
    if (this.selectedVacancy) {
      obj['_id'] = this.selectedVacancyId;
    }
    this.service.addSelfSourcedVacancy(obj).subscribe(res => {
      // this.successPage = true
      this.successModel.show();
      this.service.showMessage({
        message: obj['_id']?"Vacancy updated successfully":"Vacancy created successfully"
      });
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

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
    //   this.jobSkills = [...this.jobSkills, ...res.data];
    //   // Array.prototype.push.apply(this.jobSkills, res.data);
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

  setCompanyLogo(url: string) {
    this.essentials.patchValue({
      company_logo: url
    });
 
  }

  selectIndustry(e: any) {
    // console.log("helllooooooo", e);
    this.industryName = e.value;
    // console.log("helllooooooo", this.industryName);
    this.essentials.patchValue({
      sub_industry_id:""
     })
    this.getSubIndustries(e.value);
  }

  industryList(isDraft?: boolean) {
    let param = { search: '' };
    this.service.getindustry(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.industrylist = res.data;
      if (this.selectedVacancy) {
        this.industrylist.find((s: any) => {
          if (s._id == this.selectedVacancy.industry_id) {
            this.getSubIndustries(s._id, true);
          }
        })
      }
    })

  }

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

  isSelectedSkill(skill) {
    return this.selectedJobSkills.some(sSkill => sSkill._id === skill._id);
  }

  handleAddressChange(event: any) {
    if (event.geometry && event.name && event.formatted_address) {
      this.essentials.controls['latitude'].patchValue(JSON.parse(JSON.stringify(event.geometry.location)).lat);
      this.essentials.controls['longitude'].patchValue(JSON.parse(JSON.stringify(event.geometry.location)).lng);
      this.address = event.formatted_address;
       this.essentials.patchValue({
        location:this.address
      })
    }
  }

  getComapany(id){
    return this.childCompanyList.find(el=>el._id == id).company_name;
   }
   
  clearLocation() {
    this.essentials.patchValue({
      latitude: "",
      longitude: ""
    })
  }

  fun(stepper: MatStepper) {  
      if (this.essentials.invalid || this.selectedJobSkills.length < 3) {
        this.essentials.markAllAsTouched()
      } else {
        this.changeTab(this.currentTabEmp);
        stepper.next();
      }
    }

    // fun2(stepper: MatStepper) {
    //   if (this.editorForm.invalid) {
    //     this.editorForm.markAllAsTouched();
    //     return;
    //   }
    //   this.getMultipleSkillsByIds();
    //  if (this.currentTabEmp === "help_me_write") {
    //   this.description = `
    //   <div style="margin-bottom:22px !important;">
    //     <h4 style="
    //     color: #545465; margin-bottom:-10px;">About the Company</h4>
    //     <p class="">${this.editorForm.value.about}</p>
    //   </div>
    //   <div style="margin-bottom:22px !important;">
    //     <h4 style="
    //     color: #545465; margin-bottom:-10px;">Job Roles/Responsibilities</h4>
    //     <p class="">${this.editorForm.value.job_resp}</p>
    //   </div>
    //   <div style="margin-bottom:22px !important;">
    //     <h4 style="
    //     color: #545465; margin-bottom:-10px;">Qualifications/Experience</h4>
    //     <p class="">${this.editorForm.value.qualfctn_exp}</p></div>`
    // } else if (this.currentTabEmp === "write_my_own") {
    //   this.description = this.editorForm.value.write_my_own_description;
    // } else if (this.currentTabEmp === "use") {
    //   this.description = this.editorForm.value.use_ai_description;
    // }
    //   stepper.next();
    // }
      fun2(stepper: MatStepper) {
      if (this.editorForm.invalid) {
        this.editorForm.markAllAsTouched();
        return;
      }
      this.getMultipleSkillsByIds();
     if (this.currentTabEmp === "help_me_write") {
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
    } else if (this.currentTabEmp === "write_my_own") {
      this.description = this.editorForm.value.write_my_own_description;
    } else if (this.currentTabEmp === "use") {
      this.description = this.editorForm.value.use_ai_description;
    }
      stepper.next();
    }

    fun3(stepper: MatStepper) {  
      if (this.routeForm.invalid) {
        this.routeForm.markAllAsTouched()
      } else {
        stepper.next();
      }
    }


    getMultipleSkillsByIds(ids?: any) {
        this.skillsevent = this.jobSkills.filter((skill: any) => {
          return this.selectedJobSkills.findIndex(sk => sk._id === skill._id) !== -1;
        });
    }

    selectLecense(license) {
      license.selected = !license.selected;
      this.editorForm.patchValue({
        license_certification: this.licenseCertifications.map(cert => cert.selected ? cert.name : undefined).filter(value => value !== undefined).join()
      });  
    }

   getSupervisorsCommaSeparated(): string {
      const receivers = this.routeForm?.value?.application_receiver;

      if (!Array.isArray(receivers) || receivers.length === 0) {
        return '';
      }

      return receivers
        .map((certId: any) => this.getSupervisor(
          typeof certId === 'string' ? certId : certId?._id
        ))
        .filter(name => !!name) // remove empty strings
        .join(', ');
    }


    getSupervisor(id: string): string {
      console.log("id", id);
       if (!id || !Array.isArray(this.contactList)) {
        return '';
      }
      const supervisor = this.contactList.find(el => el._id === id);
      console.log("supervisor", supervisor);
      return supervisor ? supervisor.first_name + ' ' + supervisor.last_name : '';
    }


    navigateToProjectTab() {
      const redirectData = sessionStorage.getItem("redirect");
      if (redirectData) {
        const parsed = JSON.parse(redirectData);
        this.router.navigate(['/employer/my-company-profile'], {
          queryParams: {
            company_id: parsed.company_id,
            tab: parsed.tab
          }
        });
      } else {
        this.router.navigate(['/employer/vacancies']);
      }
    }

    getImage(){
      if(this.essentials?.value?.parent_company_id){
        return this.selectedVacancy?.company_info[0]?.company_logo?this.selectedVacancy?.company_info[0]?.company_logo:this.essentials?.value?.company_logo
      }else{
        return  this.selectedVacancy?.company_info[0]?.company_logo?this.selectedVacancy?.company_info[0]?.company_logo:this.essentials?.value?.company_logo
      }
   }
}

