import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import SignaturePad from 'signature_pad';
import { HttpResponseCode } from '../../../shared/enum';
import { FileIconService } from '../../../shared/file-icon.service';

@Component({
  selector: 'app-my-company-profile',
  templateUrl: './my-company-profile.component.html',
  styleUrls: ['./my-company-profile.component.scss']
})
export class MyCompanyProfileComponent implements OnInit {
  @ViewChild('submithcaafModal') public submithcaafModal: ModalDirective;
  signaturePads: SignaturePad[] = [];
  @ViewChild('canvas') canvas: ElementRef;
  signaturesArray: any = [1, 2, 3, 4, 5];
  studentNavParam = null;
  singleStepForm = null;
  multiStepForm = null;
  elementsForm = null;

  employerProfile = null;
  basicProfileForm: FormGroup;
  latestVacancy = null;
  vacancies = [];
  industryList = [];
  userDetail = null;
  contactInfo: FormGroup;
  isEditContact = false;
  editIndex = null;
  companyProfileContainer = false;
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

  constructor(private service: TopgradserviceService,
    private fb: FormBuilder,private fileIconService:FileIconService,
    private router: Router, private activatedRoute:ActivatedRoute) { }

  getSafeSvg(documentName: string) {
    return this.fileIconService.getFileIcon(documentName);
  }

  activeTab: string = 'overview'; // Default active tab
  loadedTabs: Set<string> = new Set(); // Track loaded tabs

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Add tab to the set of loaded tabs if not already loaded
    if (!this.loadedTabs.has(tab)) {
      this.loadedTabs.add(tab);

      // Perform tab-specific API calls if needed
      this.loadTabData(tab);
    }
    this.getAllVacancies();
  }

  loadTabData(tab: string): void {
    switch (tab) {
      case 'Vacancies':
        console.log('Loading Pre Vacancies...');
        break;
      case 'Projects':
        console.log('Loading Projects...');
        break;
      default:
        console.log('No data to load for this tab.');
    }
  }

  
  async ngOnInit() {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.getIndustryList();
    this.getEmployerProfile(this.documentpage);

    this.activatedRoute.queryParams.subscribe(params => {
      if(params.tab=='site'){
        this.setActiveTab('site-visits');
          this.activeTab = "site-visits";
      }
      if(params.tab=='internship' || params.tab=='Vacancies'  || params.tab=='project'  || params.tab=='Projects'){
        this.setActiveTab('vacancies');
        this.activeTab = "vacancies";
      }
    });

    this.basicProfileForm = this.fb.group({
      company_name: ['', [Validators.required]],
      company_logo: [''],
      address: ['', Validators.required],
      company_phone: ['', [Validators.required]],
      // suburb: ['', Validators.required],
      // state: ['', Validators.required],
      postal_code: ['', Validators.required],
      // country: ['', [Validators.required]],
      web_address: ['', Validators.required],
      industry_id: ['', Validators.required],
      industry_name: [''],
      no_of_employees: ['', Validators.required]
    });

    this.contactInfo = this.fb.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      role: ["", Validators.required],
      primary_email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      // secondary_email: ['', [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      secondary_email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      primary_phone: ["", Validators.required],
      secondary_phone: [""],
      preferred_contact: [false],// Optional
      updatedAt:[""],
      createddAt:[""]
    })

    // this.getAllVacancies();
    // this.gethcaafList();

    // this.getSubmittedDocuments(this.formpage);
    this.getEmails(this.emailpage);
  }

  setSelectedEmail(email: any): void {
    this.selectedEmail = { ...email }; // creates a new reference
   console.log("this.selectedEmail", this.selectedEmail)
  }
  hcaafList: any = [];

  async gethcaafList() {
    const body = {
      company_id: this.userDetail?._id,
      "staff_status": "completed",
      "employee_status": "completed"
    }
    await this.service.getSubmittedHcaafForm(body).subscribe((response: any) => {

      console.log("response", response);
      // if (response.status == 200) {
      this.hcaafList = [...response.records];
      this.getHcaafPendingList();
      // } else {
      //   this.hcaafList = [];
      // }
    }, (err)=>{
      this.getHcaafPendingList();
    });

    
  }

  hcaafPending: any = [];

  getCheckValid(item){
    if(item.status){
      return true;
    }else{
      return false;
    }
    item?.status && item?.status=='pending'
  }

  getHcaafPendingList() {
    const body = {
      company_id: this.userDetail?._id,
      "staff_status": "pending",
      "employee_status": "pending"
    }
    this.service.getEmployerHcaafTask(body).subscribe(async(response: any) => {
      console.log("response", response, "response")
      if (response.status == 200) {
        this.hcaafPending =await [...response.result];

        await this.hcaafPending.map(el=>{
          el.staus = 'pending';
        })
        this.hcaafList =await [...this.hcaafList, ...this.hcaafPending];

        console.log("this.hcaafList", this.hcaafList);
      } else {
        this.hcaafPending = [];
      }
    });
    this.getHcaafPendingList1();
  }

  hcaafPending1:any = [];
  getHcaafPendingList1() {
    const body = {
      company_id: this.userDetail?._id,
      "staff_status": "pending",
      "employee_status": "completed"
    }
    this.service.getEmployerHcaafTask(body).subscribe(async(response: any) => {
      console.log("response", response, "response")
      if (response.status == 200) {
        this.hcaafPending1 =await [...response.result];

        await this.hcaafPending1.map(el=>{
          el.staus = 'pending';
        })
        this.hcaafList =await [...this.hcaafList, ...this.hcaafPending1];

        console.log("this.hcaafList", this.hcaafList);
      } else {
        this.hcaafPending1 = [];
      }
    });
  }

  getIndustryList() {
    let param = { search: '' };
    this.service.getindustry(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.industryList = res.data;
    })
  }

  getAllVacancies() {
    this.service.getAllVacancies({ company_id: this.userDetail?._id,  view_type:"employer", }).subscribe((res: any) => {
      this.vacancies = res.data;
      // this.latestVacancy = res.data.reduce((prev, current) => {
      //   return (new Date(current.createdAt) > new Date(prev.createdAt)) && current.status === 'active' ? current : prev;
      // });

      // this.latestVacancy.license_certification = this.latestVacancy?.license_certification?.split(',');
      this.vacancies.forEach((vacancy) => {
        vacancy.license_certification = vacancy?.license_certification?.split(',');
      });
    });
  }

  getEmployerProfile(page) {
    this.documentpage = page
    const payload = {
      _id: this.userDetail?._id,
      "documents_limit": this.documentlimit,
      "documents_offset": this.documentpage-1
    }
    this.service.getEmployerProfile(payload).subscribe(response => {
      this.employerProfile = response.record;
      this.basicProfileForm.patchValue(response.record);

      if(response.documents_count <= this.documentlimit){
        this.documentlimit = response.documents_count;
      }
      this.totaldocumentList = response.documents_count;
      this.totaldocuments = Math.ceil(response.documents_count/this.documentlimit);
      console.log(" this.totalNotes",  this.totaldocuments);


      this.documents =  this.employerProfile && this.employerProfile.documents  && this.employerProfile.documents.length>0 ? this.employerProfile.documents : [],

      console.log("this.documents =", this.documents );

    });
  }

  removeCharacter() {
    this.contactInfo.controls.primary_phone.patchValue(this.contactInfo.value.primary_phone.replace(/[^\dA-Z]/g, ''));
    this.contactInfo.controls.secondary_phone.patchValue(this.contactInfo.value.secondary_phone.replace(/[^\dA-Z]/g, ''));
    this.basicProfileForm.controls.postal_code.patchValue(this.basicProfileForm.value.postal_code.replace(/[^\dA-Z]/g, ''));
  }

  // addSpacesInNumber() {
  //   this.basicProfileForm.controls.company_phone.patchValue(this.basicProfileForm.value.company_phone.replace(/[^\dA-Z]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ').trim())
  //   const startWithZero = /^04/g;
  //   const num = this.basicProfileForm.value.company_phone.split(" ").join("");
  //   if (!startWithZero.test(num) && this.basicProfileForm.value.company_phone.length > 2) {
  //     this.basicProfileForm.controls.company_phone.setErrors({ pattern: true });
  //   }
  //   const val = this.basicProfileForm.value.company_phone.slice(2, 13).split(" ").join("");
  //   const pattern = /(\d)\1{7}/g;
  //   if (pattern.test(val) && val.length === 8) {
  //     this.basicProfileForm.controls.company_phone.setErrors({ pattern: true });
  //   }
  // }

  addSpacesInNumber() {
    // Remove non-numeric characters
    const rawNumber = this.basicProfileForm.value.company_phone.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the form control value with the formatted number
    this.basicProfileForm.controls.company_phone.patchValue(formattedNumber.trim());
  
    // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      this.basicProfileForm.controls.company_phone.setErrors({ pattern: true });
      return;
    }
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      this.basicProfileForm.controls.company_phone.setErrors({ pattern: true });
      return;
    }
  }


  addSpacesInNumberPrimaryPhone() {
    // Remove non-numeric characters
    const rawNumber = this.contactInfo.value.primary_phone.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the form control value with the formatted number
    this.contactInfo.controls.primary_phone.patchValue(formattedNumber.trim());
  
    // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      this.contactInfo.controls.primary_phone.setErrors({ pattern: true });
      return;
    }
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      this.contactInfo.controls.primary_phone.setErrors({ pattern: true });
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


  


  getFile(event) {
    const formData = new FormData();
    formData.append('media', event.target.files[0]);
    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.basicProfileForm.patchValue({
        company_logo: resp.url
      });
    });
  }

  submitEmployerProfile() {
    if (this.basicProfileForm.invalid) {
      this.basicProfileForm.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.basicProfileForm.value
    }
    this.updateEmployerProfile(payload);
  }

  // if(payload){

  // }

  updateEmployerProfile(payload) {
    this.service.SubmitEmployerProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Employer profile updated successfully"
      });
      this.getEmployerProfile(this.documentpage);
      this.isEditContact = false;
      this.editContact = {};
      this.editIndex = null;
      this.contactEdit = false;
      this.contactDelete = false;
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  contactEdit:boolean = false;
  addNewContactInfo() {
    if (this.employerProfile?.contact_person >= 3) {
      return;
    }
    
    this.contactInfo.reset();

    if(this.employerProfile.contact_person.length==0){
      this.contactInfo.patchValue({
        preferred_contact:true
      });
    }
    this.isEditContact = true;
    this.editContact = {};
    this.editIndex = null;
    this.contactEdit = false;
    this.contactEdit = false;
  }

  editContact:any = {};

  editContactInfo(contact, i) {
    this.contactEdit = true;
    this.isEditContact = true;
    this.editIndex = i;
    this.editContact = contact;
    console.log(this.editContact)
    this.contactInfo.patchValue(contact);
  }

  taskDetail:any
  submitContactInfo() {
    console.log("this.editIndex", this.editIndex, this.contactInfo.value)
    // if (this.contactInfo.invalid) {
    //   this.contactInfo.markAllAsTouched();
    //   return;
    // }
    if (
      !this.contactInfo.value.first_name || 
      !this.contactInfo.value.last_name || 
      !this.contactInfo.value.primary_email || 
      !this.contactInfo.value.primary_phone || 
      !this.contactInfo.value.role
    ) {
      this.contactInfo.markAllAsTouched();
      return;
    }
   

    if (this.editIndex !== null) {
   // Get current contact before update
    const currentContact = this.employerProfile.contact_person[this.editIndex];

    // Get new updated form value
    const updatedContact = this.contactInfo.value;

    // Maintain timestamps
    updatedContact['updatedAt'] = new Date().toISOString();
    updatedContact['updatedBy'] = this.userDetail.first_name + " " + this.userDetail.last_name,
    updatedContact['createddAt'] = currentContact['createddAt'] || new Date().toISOString();

    // Update the contact
    this.employerProfile.contact_person[this.editIndex] = updatedContact;

    // If updated contact is marked as preferred, unset others
    if (updatedContact.preferred_contact) {
      this.employerProfile.contact_person.forEach((contact, i) => {
        if (i !== this.editIndex) {
          contact.preferred_contact = false;
        }
      });
    }

     
    } else {
      if (this.contactInfo.value.preferred_contact && this.employerProfile?.contact_person.length>0) {
        // this.employerProfile?.contact_person.forEach(contact => {
        //   contact.preferred_contact = false;
        // });
        this.employerProfile?.contact_person.forEach(contact => {
          contact.preferred_contact = false;
        });
        if(this.editIndex){
          this.employerProfile.contact_person[this.editIndex]['preferred_contact'] = this.contactInfo.value.preferred_contact;
        }
        // this.employerProfile.contact_person[this.editIndex]['preferred_contact'] = this.contactInfo.value.preferred_contact;
       }
      this.employerProfile?.contact_person.push(this.contactInfo.value);
    }
    // this.employerProfile.contact_person.forEach((contact, i) => {
    //   if (!(this.editIndex === i && contact.preferred_contact)) {
    //     // contact.preferred_contact = false;
    //     contact.preferred_contact = this.contactInfo.value.preferred_contact;
    //   }
    // });

    const payload:any = {
      _id: this.userDetail?._id,
      contact_person: this.employerProfile?.contact_person
    }
    
    const updatedBy = `${this.userDetail.first_name} ${this.userDetail.last_name}`;
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;


    if (this.editIndex === 0) {
      payload['contact_01_updated_by'] = updatedBy;
      payload.contact_01_last_update = timestamp;
    } else if (this.editIndex === 1) {
      payload.contact_02_updated_by = updatedBy;
      payload.contact_02_last_update = timestamp;
    } else if (this.editIndex === 2) {
      payload.contact_03_updated_by = updatedBy;
      payload.contact_03_last_update = timestamp;
    }

     this.editIndex = null;
    console.log("payload", payload);

    this.updateEmployerProfileContactPerson(payload);
  }


  @ViewChild('PreferredContact', { static: false }) PreferredContact: ModalDirective;

  message :any= ''
  updateEmployerProfileContactPerson(payload) {
 
    this.service.SubmitEmployerProfile(payload).subscribe(res => {

      console.log(res, "res");

      if(res.status==204){
        this.message = res.msg;
        setTimeout(()=>{
          console.log(this.PreferredContact);
          this.PreferredContact.show()
        }, 300)
        return false;
       }else{
        this.service.showMessage({
            message: "Employer profile updated successfully"
        });
      }
  
      this.getEmployerProfile(this.documentpage);
      this.isEditContact = false;
      this.editContact = {};
      this.editIndex = null;
      this.contactEdit = false;
      this.contactDelete = false;
      
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  
  contactDelete:boolean = false;

  deleteContactInfo() {
    console.log(this.editIndex);
    this.employerProfile?.contact_person.splice(this.editIndex, 1);

    console.log(this.employerProfile?.contact_person);

    const payload = {
      _id: this.userDetail?._id,
     contact_person: this.employerProfile?.contact_person
    }
    this.updateEmployerProfile(payload);
  }


  editVacancy(vacancy) {
    this.router.navigate(["/employer/vacancies/create-vacancies"], { queryParams: { id: vacancy?._id } })
  }

  updateVacanciesStatus(status) {
    const payload = {
      _ids: [this.latestVacancy?._id],
      status: status
    }
    this.service.updateVacanciesStatus(payload).subscribe(res => {
      this.service.showMessage({
        message: "Vacancy status changed successfully"
      });
      this.getAllVacancies();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  goToSiteVisitDetail(siteVisit) {
    this.router.navigate(['/employer/site-visits-details'], { queryParams: { companyId: this.userDetail?._id, site_visit_id: siteVisit?.site_visit_id } })
  }

  companyProfileEdit() {
    this.companyProfileContainer = !this.companyProfileContainer
  }

  selectIndustry(e: any) {
    //console.log("helllooooooo", e);
    var getName = "";
    this.industryList.filter((value)=>{
      if(value._id==e)getName = value.name;
    });

    this.basicProfileForm.patchValue({
      industry_name: getName,
      sub_industry_id:''
    });
    // console.log("helllooooooo", this.industryName);
  }

  updateCompanyDescription() {
    const payload = {
      _id: this.userDetail?._id,
      description: this.employerProfile.description
    }
    this.updateEmployerProfile(payload);
    this.companyProfileEdit();
  }

  handleAddressChange(event: any) {
    if (event.geometry && event.name && event.formatted_address) {
      this.basicProfileForm.patchValue({
        address: event.formatted_address
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
      company_id: this.userDetail?._id,
      "limit": this.formlimit,
      "offset": this.formpage-1
    }
    this.service.getSubmittedCompanyDocuments(payload).subscribe((res: any) => {
      // this.submittedDocuments = res.result.filter(record => record.task_type === 'attachments');
      // this.submittedForms = res.result.filter(record => record.task_type === 'form');
      // this.hideShowDocuments(3);
      // this.hideShowForms(3);
      if(res.status == 200){
        this.submittedForms = res.result;
        if(res.record_count <= this.formlimit){
          this.formlimit = res.record_count;
        }
        this.totalformList = res.record_count;
        this.totalforms = Math.ceil(res.record_count/this.formlimit);
        console.log(" this.totalNotes",  this.totalforms);
      }else{
        this.submittedForms = [];
      }
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

  // downloadFile(url: string) {
  //   window.open(url);
  // }

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

  studentFormDetail: any;

  openModel(data) {
    console.log("data",data);
    this.getStudentTaskForm(data._id);
    // this.studentFormDetail = data;
    this.submithcaafModal.show();
    const self = this;
    setTimeout(() => {
      self.initializeSignatures();
    }, 5000);

  }


  async getStudentTaskForm(formId) {
    this.service.getSubmittedHcaafFormDetailById({ _id: formId }).subscribe(response => {
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

  ngAfterViewInit(): void {
    const self = this;
    setTimeout(() => {
      self.initializeSignatures();
    }, 5000);

  }

  initializeSignatures() {
    this.signaturesArray.forEach((signatureData, index) => {
      const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${index}`) as HTMLCanvasElement;
      if (canvas) {
        const signaturePad = new SignaturePad(canvas);
        this.signaturePads.push(signaturePad);
      }
    });
  }

  cancelSignature(i, item) {
    this.signaturePads[i].clear();
    item.signature = {};
    setTimeout(() => {
      const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${i}`) as HTMLCanvasElement;
      if (canvas) {
        this.signaturePads[i] = new SignaturePad(canvas);
      }
    }, 1000);
  }
uploadFile(event, field) {
    const files: FileList = event.target.files;

    if (files[0].size > field?.elementData?.size * 1048576) {
      this.service.showMessage({
        message: 'Please select file less than ' + field?.elementData?.size + ' MB'
      });
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        field.elementData.value = field.elementData.value?.length > 0 ? field.elementData.value : [];
        field.elementData.value.push(resp);
      });
    });

    event.target.value = "";
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
  getFilehcaaf(i, item) {
    console.log(this.signaturePads);
    // this.signaturePads.forEach((signaturePad, i) => {
    const dataURL = this.signaturePads[i].toDataURL('image/svg+xml');
    const file = this.dataURLToBlob(dataURL);
    const formData = new FormData();
    formData.append('media', file);
    this.service.uploadMedia(formData).subscribe((resp: any) => {
      item.signature = resp;
      item.signature.baseurl = dataURL;
      // if (this.studentFormDetail?.type === 'simple') {
      //   this.singleStepForm.forEach(form => {
      //     if (form.id === 'signature') {
      //       form.elementData.value = !form.elementData.value ? [] : form.elementData.value;
      //       form.elementData.value.push(resp);
      //     }
      //   })
      // } else if (this.studentFormDetail?.type === 'multi_step') {
      //   this.multiStepForm.forEach(form => {
      //     form.component.forEach(comp => {
      //       if (comp.id === 'signature') {
      //         comp.elementData.value = !comp.elementData.value ? [] : comp.elementData.value;
      //         comp.elementData.value.push(resp);
      //       }
      //     })
      //   })
      // }
      // if (i === this.signaturePads.length - 1) {
      //   // callback();
      // }
    });
    // }); 
  }

  dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  submitdisabled:boolean = false;

  submitForm() {
    if (this.studentFormDetail?.type === 'simple') {
      // if (this.signaturePads.length > 0) {
      //   this.getFile(() => {
      //     this.submitWorkflowttachment(this.singleStepForm);
      //   });
      // } else {
      this.submitWorkflowttachment(this.singleStepForm);
      // }
    } else if (this.studentFormDetail?.type === 'multi_step') {
      // if (this.signaturePads.length > 0) {
      //   this.getFile(() => {
      //     this.submitWorkflowttachment(this.multiStepForm);
      //   });
      // } else {
      this.submitWorkflowttachment(this.multiStepForm);
      // }
    }
  }

  submitWorkflowttachment(fields) {

  
    const payload = {
      "company_id": this.userDetail?._id,
      "hcaaf_form_id": this.hcaafPending[this.hcaafPending.length-1].hcaaf_form_id,
      "employer_hcaaf_id": this.hcaafPending[this.hcaafPending.length-1]._id,
      "task_status": "completed",
      "employee_status": "completed",
      "staff_status": "pending",
      "form_title": this.hcaafPending[this.hcaafPending.length-1].form_title,
      "submitted_by": this.userDetail?.role,
      //  "employer_hcaaf_id": "66bc4d107bf036f45a939171",

      form_fields: { fields, type: this.studentFormDetail?.type },
      employer_name: this.userDetail?.company_name
    }
    this.service.submitHcaafForm(payload).subscribe(res => {
      this.service.showMessage({
        message: "Agreement Forms submitted successfully"
      });
      this.submitdisabled = false;
      // this.goBack();
      this.submithcaafModal.hide();
      this.gethcaafList();
     
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getSubmittedTask() {
    const payload = {
      placement_id: this.studentNavParam?.placement_id,
      student_id: this.studentNavParam?.student_id,
      task_id: 1,
      company_id: this.userDetail?._id,
    }
    this.service.getSubmittedWorkFlowTask(payload).subscribe((response: any) => {
      if (response.result) {
        console.log("response.result", response.result);
        this.studentFormDetail = { type: response.result?.form_fields?.type,
          student_name: response.result?.student_name,
          employer_name: response.result?.employer_name,
          staff_name: response.result?.staff_name,
          student_submitted_at: response.result?.student_submitted_at,
          employer_submitted_at:response.result?.employer_submitted_at,
          staff_submitted_at: response.result?.staff_submitted_at
         }
        if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = response.result?.form_fields?.fields;
        } else if (this.studentFormDetail?.type === 'multi_step') {
          this.multiStepForm = response.result?.form_fields?.fields;
        }
      }
    });
  }

  goBack() {
    // this.location.back();
  }

  checkIsFormValid(formFields) {
    // form.id !== 'checkbox' && 
    if (formFields && formFields.length > 0) {
      return formFields.some(form => (form.id !== 'signature' && form.id !== 'checkbox' &&  form.elementData?.required && !form.elementData?.value) ||
        (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Employer') && (!item?.signature || Object.keys(item.signature).length === 0))));
    } else {
      return true;
    }
  }

  downloadFile(url: string) {
    window.open(url);
  }

  async downloadhcaafPDF(url: string, filename: string): Promise<void> {
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

  async viewhcaafPDF(url: string): Promise<void> {
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


  public showAll = false;

  public toggleShowMore(): void {
    this.showAll = !this.showAll;
  }


  getStatus(data) {
    return new Date().getTime() >= new Date(data.valid_from).getTime() && new Date().getTime() <= new Date(data.valid_to).getTime()
  }


  submissionCreate:boolean = false;
  files = [];

  media: any = {
    documents:[],
  }

getFilDoc(event: Event) {
  const input = event.target as HTMLInputElement;
  const fileList: FileList | null = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  // Initialize media.documents if undefined
  this.media.documents = this.media.documents ?? [];

  for (const file of filesArray) {
    if (file.size > 5242880) { // 5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });

      // Clear input so same file can be selected again
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.media.documents.push(resp);
    });
  }

  // ✅ Clear input so user can re-upload the same file if needed
  input.value = '';
}

  removeFile(index) {
    this.media.documents.splice(index, 1);
  }

  documents:any = [];

  updateCompanySubmission() {
    const payload = {
      _id:  this.userDetail._id,
      documents:  [...this.media.documents] 
    }
    this.service.SubmitEmployerProfile(payload).subscribe(res => {
     this.service.showMessage({
        message: "Employer profile updated successfully"
      });
      this.getEmployerProfile(this.documentpage);
      this.isEditContact = false;
      this.contactEdit = false;
      this.editContact = {};
      this.editIndex = null;
      this.submissionCreate = false;
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
    // this.getEmployerProfile(this.documentpage);
  }

  documentpage:any = 1;
  documentlimit:any = 5;
  totaldocuments:any = 0
  totaldocumentList:any = 0
  // getStudentProfileById(page) {
  //   // console.log("page", page);
  //   this.documentpage = page;
  //   this.documentlimit = 5;
  //   const payload = {
  //     _id:this.userDetail?._id,
  //     "documents_limit": this.documentlimit,
  //     "documents_offset": this.documentpage-1
  //   }
  //   this.service.getEmployerProfile(payload).subscribe((res: any) => {
  //     this.documents = res.record.documents;
  //     if(res.documents_count <= this.documentlimit){
  //       this.documentlimit = res.documents_count;
  //     }
  //     this.totaldocumentList = res.documents_count;
  //     this.totaldocuments = Math.ceil(res.documents_count/this.documentlimit);
  //     console.log(" this.totalNotes",  this.totaldocuments);
  
  //   });
  // }


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
      "company_id": this.userDetail._id,
      "receiver_type": "company",
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


  checkFieldPermission(permissions) {
    // if (this.studentFormDetail?.staff_status !== 'completed') {
      if (permissions?.staff.write && permissions?.staff.read) {
        return 'editable';
      } else if (!permissions?.staff.write && permissions?.staff.read) {
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
      return formFields.some(form => (form.id !== 'signature' && form.elementData?.required && !form.elementData?.value) ||
        (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))));
    } else {
      return true;
    }
  }


  
  studentFormDetailStatus:any = {};
  @ViewChild('viewSubmithcaafModal') viewSubmithcaafModal: ModalDirective;
  showFormView(item){
    this.viewSubmithcaafModal.show();

    this.studentFormDetailStatus = item
    this.studentFormDetail =item['form_fields'];

    console.log("this.studentFormDetailthis.studentFormDetail", this.studentFormDetail)
    if (this.studentFormDetail?.type === 'simple') {
      this.singleStepForm = this.studentFormDetail?.fields;
    } else {
      this.multiStepForm = this.studentFormDetail?.fields;
    }
  }




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
