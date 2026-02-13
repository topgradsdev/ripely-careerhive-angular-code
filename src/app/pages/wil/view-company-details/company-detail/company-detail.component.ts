import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import SignaturePad from 'signature_pad';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { TopgradserviceService } from 'src/app/topgradservice.service';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import { HttpResponseCode } from 'src/app/shared/enum';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent {
  @Input() employerProfile: any;
   @ViewChild('addhcaafModal1') addhcaafModal1: ModalDirective;
    @ViewChild('alreadyHcaafPendingModel') alreadyHcaafPendingModel: ModalDirective;
    @ViewChild('submithcaafModal1') submithcaafModal1: ModalDirective;
    @ViewChild('viewSubmithcaafModal') viewSubmithcaafModal: ModalDirective;
  
    @ViewChild('removeCompanyFlagModel') removeCompanyFlagModel: ModalDirective;
    @ViewChild('downloadhcaafForm') downloadhcaafForm: ModalDirective;
    @ViewChild('hcaafDisapprove') hcaafDisapprove: ModalDirective;

    
    
    @ViewChild('closeAddCompanyFlagModal') closeAddCompanyFlagModal;
  
    @ViewChild('closeAddNoteModal') closeAddNoteModal;
  
    
    selectedDetailTabIndex = 0; 
    selectedTab :any = 'overview';
    userProfile = null;
    activeTab: string = 'overview'; // Default active tab
    loadedTabs: Set<string> = new Set(); // Track loaded tabs
    signaturePads: SignaturePad[] = [];
    @ViewChild('canvas') canvas: ElementRef;
    signaturesArray: any = [1, 2, 3, 4, 5];
    studentNavParam = null;
    singleStepForm = null;
    multiStepForm = null;
    elementsForm = null;
    @ViewChild('closeCompanyHcaafModal') closeCompanyHcaafModal;
    activityLogs = [];
    companyProfileContainer: boolean
    contactLists = [
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
      {
        last_name: 'Wills',
        first_name: 'Sarah',
        primaryEmail: 'test@gmail.com',
        secondaryEmail: 'sarah@marriott.com',
        primaryPhone: '+61 123 456 789',
        secondaryPhone: '+61 123 456 789',
        role: 'HR Manager',
        actions: ''
      },
    ]
  
    hcaafPending: any = [];
    hcaafs: any = [];
    @ViewChild('closeCreatePlacementModal') closeCreatePlacementModal;
    displayedContactListsColumns: string[] = ['last_name', 'first_name', 'primaryEmail', 'secondaryEmail', 'primaryPhone', 'secondaryPhone', 'role', 'actions']
    dataSource: MatTableDataSource<any>;
    userDetail = null;
    companyId = null;
    latestVacancy = null;
    vacancies = [];
    contactInfo: FormGroup;
    siteVisitForm: FormGroup;
    hcaafForm: FormGroup;
    adminInfoForm: FormGroup;
    isEditContact = false;
    editIndex = null;
    description = "";
    isEditAdminInfo = false;
    documents:any = []
  
    submittedDocuments = [];
    submittedForms = [];
    selectedForm = null;
    slicedDocuments = [];
    slicedForms = [];
    basicProfileForm: FormGroup;
    industryList = [];
    googlePlaceOptions: any;
    modules: any;
    compnay_name: any = "";
    selectedTask: any;
  
    constructor(private service: TopgradserviceService,
      private activatedRoute: ActivatedRoute,
      private fb: FormBuilder,
      private location: Location,
      private router: Router, private sanitizer: DomSanitizer, private http: HttpClient, private fileIconService: FileIconService) { }
  
  
  
    setSelectedEmail(email: any): void {
      this.selectedEmail = { ...email }; // creates a new reference
    console.log("this.selectedEmail", this.selectedEmail)
    }
    getSafeSvg(documentName: string): SafeHtml {
     return this.fileIconService.getFileIcon(documentName);
    }
  
  
    handleAddressChange(event) {
  
    }
    selectIndustry(event) {
  
    }
  
  
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
  
  
    goToTab(tab) {
      this.selectedTab = tab;
    }
  
    contacts: any[] = [];
    filteredContacts: any[] = [];
    selected: { [key: string]: boolean } = {};
    searchTerm: string = '';


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
    
    ngOnInit(): void {
      this.formValidation();


      // this.contactService.getContacts().subscribe(res => {
     
      // });
      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.company_id) {
          this.companyId = params.company_id;
          this.getIndustryList();
          this.getEmployerProfile(this.documentpage);
          this.getHcaafPendingList();
          this.gethcaafList();
          // this.getPenddinghcaafList();
          this.getNotes(this.notepage);
          this.getActivityLogs();
          this.getCompanyEmployers();
          this.getCustomFormBySubmitter({
            "is_hcaaf": true,
            "company_id":this.companyId
          });
        }
      });
      this.getAllVacancies();
      this.getSubmittedDocuments(this.formpage);
     
  
      this.contactInfo = this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        role: ["", Validators.required],
        primary_email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
        // secondary_email: ['', [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
        secondary_email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
        primary_phone: ["", Validators.required],
        secondary_phone: [""],
        preferred_contact: [false],
        updatedAt:[""],
        createddAt:[""]
      });
  
      this.siteVisitForm = this.fb.group({
        date: ["", Validators.required],
        time: ["", Validators.required],
        recorded_by: ["", Validators.required],
        supervisor: ["", Validators.required],
        notes: ["", Validators.required]
      });
  
      this.hcaafForm = this.fb.group({
        form_id: ["", Validators.required],
        supervisor_id: [null, Validators.required],
      });
  
      this.adminInfoForm = this.fb.group({
        source_of_lead: [""],
        company_label: [""],
        company_alias:[""],
        conversion_status: [""],
        placement_type: [""],
        whs_check: [""],
        company_concent_to_use_logo: [""]
      });
      this.getCompanyContactList(this.companyId);
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
    form: FormGroup;
  
    formValidation() {
      this.form = this.fb.group({
        company_id: [0, [Validators.required]],
        company_name: ["", [Validators.required]],
        abn_acn: ["", [Validators.nullValidator]],
        address: ["", Validators.nullValidator],
        suburb: ["", Validators.nullValidator],
        state: ["", Validators.nullValidator],
        postal_code: ["", Validators.nullValidator],
        country: [, Validators.nullValidator],
        web_address: [, Validators.nullValidator],
        company_logo: [, Validators.nullValidator],
        company_phone: [, Validators.nullValidator],
        no_of_employees: ["", Validators.nullValidator],
        industry_id: ["", Validators.nullValidator],
        created_by: [this.userDetail && this.userDetail._id ? this.userDetail._id : 0, Validators.nullValidator],
        user_type: [this.userDetail && this.userDetail.type ? this.userDetail.type : '', Validators.nullValidator]
      });
  
    }
  
  
    async gethcaafList() {
      const body = {
        company_id: this.companyId,
        "staff_status": "completed",
        "employee_status": "completed"
        // hcaaf_form_id: this.hcaafPending[0]?.hcaaf_form_id
      }
      await this.service.getSubmittedHcaafForm(body).subscribe((response: any) => {
  
        console.log("response hcaafs", response);
        // if (response.status == 200) {
        this.hcaafs = [...response.records];
        // } else {
        //   this.hcaafs = [];
        // }
        this.getPenddinghcaafList();
      }, (err)=>{
        this.getPenddinghcaafList();
      });
    }
  
  
    getCheckValid(item){
      if(item.status){
        return true;
      }else{
        return false;
      }
      item?.status && item?.status=='pending'
    }
  
    hcaafPendingList:any =[];
    getPenddinghcaafList() {
      // const body = {
      //   company_id: this.companyId,
      //   "staff_status": "completed",
      //   "employee_status": "completed"
      //   // hcaaf_form_id: this.hcaafPending[0]?.hcaaf_form_id
      // }
      // this.service.getSubmittedHcaafForm(body).subscribe((response: any) => {
  
      //   console.log("response", response);
      //   // if (response.status == 200) {
      //   this.hcaafs = [...response.records];
      //   // } else {
      //   //   this.hcaafs = [];
      //   // }
      // });
      const body = {
        company_id: this.companyId,
        "staff_status": "pending",
        "employee_status": "pending"
      }
      this.service.getEmployerHcaafTask(body).subscribe(async(response: any) => {
        console.log("response", response, "response")
        if (response.status == 200) {
          // this.hcaafPendingList = [...response.result];
  
          this.hcaafPendingList =await [...response.result];
  
          await this.hcaafPendingList.map(el=>{
            el.staus = 'pending';
          })
          this.hcaafs =await [...this.hcaafs, ...this.hcaafPendingList];
        } else {
          this.hcaafPendingList = [];
        }
      });
    }
  
    getHcaafPendingList() {
      const body = {
        company_id: this.companyId,
        "staff_status": "pending",
        "employee_status": "completed"
      }
      this.service.getSubmittedHcaafForm(body).subscribe((response: any) => {
        console.log("response", response, "response")
        // if (response.status == 200) {
        this.hcaafPending = [...response.records];
        // } else {
        //   this.hcaafPending = [];
        // }
      });
    }
  
    company_description:any = '';
    companyProfileEdit() {
      this.company_description = this.employerProfile?.description?this.employerProfile?.description:this.employerProfile?.company_description
      this.companyProfileContainer = !this.companyProfileContainer

    }
  
    formList: any = [];
  
    getCustomFormBySubmitter(data) {
      this.service.getForm(data).subscribe((response: any) => {
        this.formList = response.result;
      })
    }
  
    getIndustryList() {
      let param = { search: '' };
      this.service.getindustry(param).subscribe(res => {
        res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.industryList = res.data;
      })
    }
  
    getAllVacancies() {
      this.service.getAllVacancies({ company_id: this.companyId,  "type": this.activeTab === 'Vacancies'? "internship":"project" }).subscribe((res: any) => {
        if(res.data.length>0){
          this.vacancies = res.data;
          this.vacancies.forEach((vacancy) => {
            vacancy.license_certification = vacancy?.license_certification?.split(',');
          });
        }else{
          this.vacancies = [];
        }
        
      }, (err)=>{
         this.vacancies = [];
      });
    }
  
    documentpage:any = 1;
    documentlimit:any = 5;
    totaldocuments:any = 0
    totaldocumentList:any = 0
    getEmployerProfile(page) {
      this.documentpage = page;
      this.documentlimit = 5;
      const payload = {
        _id: this.companyId,
        "documents_limit": this.documentlimit,
        "documents_offset": this.documentpage-1
      }
      this.service.getEmployerProfile(payload).subscribe(response => {
        console.log("response.record", response.record);
        this.employerProfile = response.record;
        this.getEmails(this.emailpage);
        this.compnay_name = this.employerProfile && this.employerProfile.company_name ? this.employerProfile.company_name : "";
        this.form.patchValue({
          company_id: this.employerProfile && this.employerProfile._id ? this.employerProfile._id : 0,
          company_name: this.employerProfile && this.employerProfile.company_name ? this.employerProfile.company_name : "",
          abn_acn: this.employerProfile && this.employerProfile.abn_acn ? this.employerProfile.abn_acn : "",
          address: this.employerProfile && this.employerProfile.address ? this.employerProfile.address : "",
          suburb: this.employerProfile && this.employerProfile.suburb ? this.employerProfile.suburb : "",
          state: this.employerProfile && this.employerProfile.state ? this.employerProfile.state : "",
          postal_code: this.employerProfile && this.employerProfile.postal_code ? this.employerProfile.postal_code : "",
          country: this.employerProfile && this.employerProfile.country ? this.employerProfile.country : "",
          web_address: this.employerProfile && this.employerProfile.web_address ? this.employerProfile.web_address : "",
          company_logo: this.employerProfile && this.employerProfile.company_logo ? this.employerProfile.company_logo : "",
          company_phone: this.employerProfile && this.employerProfile.company_phone ? this.employerProfile.company_phone : "",
          no_of_employees: this.employerProfile && this.employerProfile.no_of_employees ? this.employerProfile.no_of_employees : "",
          industry_id: this.employerProfile && this.employerProfile.industry_id ? this.employerProfile.industry_id : "",
        });
  
  
        // if(response.documents_count <= this.documentlimit){
        //   this.documentlimit = response.documents_count;
        // }
  
        // // let totalPages_pre = (res.count/this.notelimit)
        // // this.totalNotes = (search.total % page_size) == 0 ? totalPages_pre : totalPages_pre + 1
        // this.totaldocumentList = response.documents_count;
        // this.totaldocuments = Math.ceil(response.documents_count/this.documentlimit);
        // console.log(" this.totalNotes",  this.totaldocuments);
  
  
        // this.documents =  this.employerProfile && this.employerProfile.documents  && this.employerProfile.documents.length>0 ? this.employerProfile.documents : [],
  
        this.documents = this.employerProfile && this.employerProfile.documents  && this.employerProfile.documents.length>0 ? this.employerProfile.documents : [],
        this.totaldocumentList = response.documents_count || 0; // Set total document count
        this.totaldocuments = Math.ceil(this.totaldocumentList / this.documentlimit); // Calculate total pages
        console.log("Pagination Info:", {
          totalRecords: this.totaldocumentList,
          totalPages: this.totaldocuments,
          currentPage: this.documentpage,
        });
  
  
        console.log("this.documents =", this.documents );
        this.imageUrl = this.employerProfile && this.employerProfile.company_logo ? this.employerProfile.company_logo : "";
        console.log(" this.employerProfile ", this.employerProfile);
        this.employerProfile.description = this.employerProfile?.description ? this.employerProfile?.description : "";
        this.employerProfile.site_visits = (this.employerProfile.site_visits || []).reverse();
        // this.basicProfileForm.patchValue(response.record);
      });
    }
  
  
    
  
    submissionCreate:boolean = false;
    files = [];
    media = {
      documents : []
    };
  
    updateCompanySubmission() {
      const payload = {
        _id:  this.companyId,
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
      // this.getStudentProfile();
    }
  
  
  getFilDoc(event: Event) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  // Initialize media.documents if undefined
  this.media.documents = this.media?.documents ?? [];

  for (const file of filesArray) {
    if (file.size > 5242880) { // 5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });

      // Reset input so same file can be selected again
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.media.documents.push(resp);
    });
  }

  // Clear input after processing to allow re-uploading same file
  input.value = '';
}

    removeFile(index) {
      this.media.documents.splice(index, 1);
    }
  
    updateCompanyDescription() {
      const payload = {
        _id: this.companyId,
        description: this.company_description
      }
      this.updateEmployerProfile(payload);
      this.companyProfileEdit();
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
      const rawNumber = this.form.value.company_phone.replace(/[^\d]/g, '');
    
      // Dynamically format the number with spaces (e.g., 1 234 567 890)
      const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
    
      // Update the form control value with the formatted number
      this.form.controls.company_phone.patchValue(formattedNumber.trim());
    
      // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
      if (rawNumber.length < 10 || rawNumber.length > 15) {
        this.form.controls.company_phone.setErrors({ pattern: true });
        return;
      }
    
      // Check for repeating digits (e.g., 11111111)
      const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
      if (repeatingPattern.test(rawNumber)) {
        this.form.controls.company_phone.setErrors({ pattern: true });
        return;
      }
    }
  
    getFile(event) {
      const formData = new FormData();
      formData.append('media', event.target.files[0]);
      this.service.uploadMedia(formData).subscribe((resp: any) => {
        this.form.patchValue({
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
        _id: this.companyId,
        ...this.basicProfileForm.value
      }
      this.updateEmployerProfile(payload);
    }
  
    updateEmployerProfile(payload) {
      this.service.SubmitEmployerProfile(payload).subscribe(res => {
        this.service.showMessage({
          message: "Employer profile updated successfully"
        });
        this.getEmployerProfile(this.documentpage);
        this.getActivityLogs();
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
        _id: this.companyId,
       contact_person: this.employerProfile?.contact_person
      }
      this.updateEmployerProfile(payload);
    }
  
  
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
    contactEdit:boolean = false;
    editContact:any = {};
  
    editContactInfo(contact, i) {
      this.contactEdit = true;
      this.isEditContact = true;
      this.editIndex = i;
      this.editContact = contact;
      console.log(this.editContact)
      this.contactInfo.patchValue(contact);
    }
  
    submitContactInfo() {
      console.log("this.contactInfo", this.contactInfo);
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
      // if (this.contactInfo.invalid) {
      //   this.contactInfo.markAllAsTouched();
      //   return;
      // }
      console.log("this.editIndex", this.editIndex);
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
        console.log("this.contactInfo.value", this.contactInfo.value)
        if (this.contactInfo.value.preferred_contact && this.employerProfile?.contact_person.length>0) {
          // this.employerProfile?.contact_person.forEach(contact => {
          //   contact.preferred_contact = false;
          // });
  
          this.employerProfile?.contact_person.forEach(contact => {
            contact.preferred_contact = false;
          });
  
          console.log("this.editIndex", this.employerProfile.contact_person, this.editIndex);
          if(this.editIndex){
            this.employerProfile.contact_person[this.editIndex]['preferred_contact'] = this.contactInfo.value.preferred_contact;
          }
        }
  
        // console.log("this.contactInfo.value", this.contactInfo.value);
        // return false;
        this.employerProfile?.contact_person.push(this.contactInfo.value);
      }
  
      console.log("this.employerProfile?.contact_person", this.employerProfile?.contact_person);
      const payload:any = {
        _id: this.companyId,
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
  
  
    editVacancy(vacancy) {
      this.router.navigate(["/admin/wil/create-vacancy"], { queryParams: { id: vacancy?._id } })
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
  
    createSiteVisit() {
      const obj = this.siteVisitForm.value;
      obj.site_visit_id = new Date().getTime();
      obj.index = this.employerProfile.site_visits.length + 1;
      obj.pictures = [];
      obj.notes = [obj.notes];
      this.employerProfile.site_visits.push(this.siteVisitForm.value)
      const payload = {
        site_visits: this.employerProfile?.site_visits,
        _id: this.companyId
      }
      this.updateEmployerProfile(payload);
      this.siteVisitForm.reset();
      document.getElementById('cancel')?.click();
    }
  
    goToSiteVisitDetail(siteVisit) {
      this.router.navigate(['/admin/wil/site-visits-details'], { queryParams: { companyId: this.companyId, site_visit_id: siteVisit?.site_visit_id } })
    }
  
    goBack() {
      this.location.back();
    }
  
    editAdminInfo() {
  
      console.log("this.employerProfile", this.employerProfile);
      // source_of_lead: [""],
      // conversion_status: [""],
      // placement_type: [""],
      // whs_check: [""],
      // company_concent_to_use_logo: [""]
      this.adminInfoForm.patchValue({
        source_of_lead:this.employerProfile.company_leadsource,
        company_alias:this.employerProfile.company_alias,
        // company_alias:this.employerProfile.company_alias,
        conversion_status:this.employerProfile.conversion_status,
        company_label:this.employerProfile.company_label,
        whs_check:this.employerProfile.whs_check,
        company_concent_to_use_logo:this.employerProfile.company_concent_to_use_logo,
      });
      this.isEditAdminInfo = true;
    }
  
    submitAdminInfo() {
      const payload = {
        _id: this.companyId,
        ...this.adminInfoForm.value
      }
      console.log("payload", payload);
      payload['company_leadsource'] = this.adminInfoForm.value.source_of_lead
      this.updateEmployerProfile(payload);
      this.isEditAdminInfo = false;
    }
  
  
    formpage:any = 1;
    formlimit:any = 5;
    totalforms:any = 0
    totalformList:any = 0
  
    getSubmittedDocuments(page) {
      this.formpage = page;
      this.formlimit = 5;
      const payload = {
        company_id: this.companyId,
        "limit": this.formlimit,
        "offset": this.formpage-1
      }
      this.service.getSubmittedCompanyDocuments(payload).subscribe((res: any) => {
  
        console.log("resresresresres=======", res);
        // this.submittedDocuments = res.result.filter(record => record.task_type === 'attachments');
        // this.submittedForms = res.result.filter(record => record.task_type === 'form');
  
        // this.totalformList =  this.submittedDocuments.length;
        // this.totalforms =  this.submittedDocuments.length;
  
        // this.totaldocumentList =  this.submittedDocuments.length;
        // this.totaldocuments =  this.submittedDocuments.length;
  
        // this.hideShowDocuments(3);
        // this.hideShowForms(3);
        if(res.status == 200){
          // this.submittedForms = res.result;
          // console.log(" this.submittedForms",  this.submittedForms);
          // if(res.record_count <= this.formlimit){
          //   this.formlimit = res.record_count;
          // }
          // this.totalformList = res.record_count;
          // this.totalforms = Math.ceil(res.record_count/this.formlimit);
          // console.log(" this.totalNotes",  this.totalforms);
          this.submittedForms = res.result || [];
          this.totalformList = res.record_count || 0;
          this.totalforms = Math.ceil(this.totalformList / this.formlimit);
      
          console.log("Pagination Details:", {
            totalRecords: this.totalformList,
            totalPages: this.totalforms,
            currentPage: this.formpage,
          });
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
  
    downloadFile(url: string) {
      window.open(url);
    }
  
    async downloadPDF(url: string, filename: any){
      this.selectedForm  = filename;
      if(url){
         try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const blob = await response.blob();
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename.form_title+"_"+filename.employer_name;
          link.click();
          window.URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('There was an error downloading the PDF:', error);
          this.downloadFile(url);
        }
      }else{
          // const loader = document.getElementById('loader');
          // console.log("loader", loader)
          // if (loader) loader.style.display = 'none'; // Hide the loader on error


          this.studentFormDetailStatus = this.selectedForm
          this.studentFormDetail = this.selectedForm['form_fields'];
          console.log("this.studentFormDetailthis.studentFormDetail", this.studentFormDetail)
          if (this.studentFormDetail?.type === 'simple') {
            this.singleStepForm = this.studentFormDetail?.fields;
          } else {
            //  this.studentFormDetail.fields = this.studentFormDetail.fields.slice(1);
            this.multiStepForm = this.studentFormDetail?.fields;
          }
          const self = this;
          setTimeout(() => {
            self.initializeSignatures();
          }, 5000);
          
        
          this.downloadhcaafForm.show()
          setTimeout(()=>{
             const loader = document.getElementById('loader');
           console.log("loader", loader)
          if (loader) loader.style.display = 'none'; // Hide the loader on error
          }, 500)
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
  
  
    async editCompnay() {
  
      let body = this.form.value;
      
      body.created_by = this.userDetail && this.userDetail._id ? this.userDetail._id : 0;
      body.user_type = this.userDetail && this.userDetail.type ? this.userDetail.type : "";
  
      if(body.industry_id){
        let find = await this.industryList.find(el=>el._id===body.industry_id);
        if(find){
          body['industry_name'] = find.name;
        }
      }
  
      console.log("body", body)
      const formData = new FormData();
      for (var key in body) {
        if (key == "company_logo") {
          if (this.fileToUpload && this.fileToUpload.name) {
            formData.append("company_logo", this.fileToUpload, this.fileToUpload.name);
          }
        } else {
          if (body[key]) {
            formData.append(key, body[key]);
          }
        }
      }
  
      console.log("formData", formData);
      this.service.update_company(formData).subscribe((res: any) => {
        if (res.status == 200) {
          this.formValidation();
          this.getEmployerProfile(this.documentpage);
          this.closeCreatePlacementModal.ripple.trigger.click();
        } else {
        }
      });
  
    }
  
    fun(stepper: MatStepper) {  
      if (this.hcaafForm.invalid) {
        this.hcaafForm.markAllAsTouched()
      } else {
        stepper.next();
        const self = this;
        setTimeout(() => {
          self.initializeSignatures();
        }, 5000);
      }
    }
  
    
    taskDetail:any = {};
    openModel() {
      if (this.hcaafPending.length > 0) {
        this.alreadyHcaafPendingModel.show();
      } else {
        this.resetHcaaf();
        this.addhcaafModal1.show();
      }
      this.studentFormDetail = {};
      this.hcaafForm.value.form_id = '';
      this.hcaafForm.value.supervisor_id = null;
    }
  
  
    resetHcaaf(){
      this.hcaafForm.patchValue({
        form_id: '',
        supervisor_id:null
      })
    }
  
    async getFormdata() {
      console.log(this.hcaafForm.value.form_id);
    
      const find = this.formList.find(el => el._id == this.hcaafForm.value.form_id);
      if (find) {
        this.studentFormDetail = find;
        if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = this.studentFormDetail?.widgets?.values;
        } else {
          this.multiStepForm = this.studentFormDetail?.widgets?.values;
        }
        console.log("find:", find);
      } else {
        console.log("No match found for form_id:", this.hcaafForm.value.form_id);
      }
    }
    
  
    // async getFormdata(){
    //   console.log(this.hcaafForm.value.form_id);
    //   let find =await this.formList.find(el=>el._id === this.hcaafForm.value.form_id);
    //   if(find){
    //     this.studentFormDetail = find;
    //     if (this.studentFormDetail?.type === 'simple') {
    //       this.singleStepForm = this.studentFormDetail?.widgets?.values;
    //     } else {
    //       this.multiStepForm = this.studentFormDetail?.widgets?.values;
    //     }
    //     console.log("find", find);
    //   }
  
    //   // const self = this;
    //   // setTimeout(() => {
    //   //   self.initializeSignatures();
    //   // }, 5000);
    // }
  
   async createHaccf(stepper: MatStepper) {
      console.log("this.addhcaafModal1", this.addhcaafModal1, this.singleStepForm);
      // return false;
  
      if(!this.singleStepForm){
        const find = this.formList.find(el => el._id == this.hcaafForm.value.form_id);
        if (find) {
          this.studentFormDetail = find;
          if (this.studentFormDetail?.type === 'simple') {
            this.singleStepForm = this.studentFormDetail?.widgets?.values;
          } else {
            this.multiStepForm = this.studentFormDetail?.widgets?.values;
          }
          console.log("find:", find);
        } else {
          console.log("No match found for form_id:", this.hcaafForm.value.form_id);
        }
      }
  
      if (this.hcaafForm.valid) {
        let body = {
          "hcaaf_form_id": this.hcaafForm.value.form_id,
          supervisor_id:this.hcaafForm.value.supervisor_id,
          "company_id": this.companyId,
          "created_by_id": this.userDetail._id,
          "created_by": this.userDetail.first_name + " " + this.userDetail.last_name,
          form_fields: { fields: this.studentFormDetail?.type=== 'simple'? this.singleStepForm:  this.multiStepForm, type: this.studentFormDetail?.type },
        }
  
        console.log("body", body);
        // return false;
        this.service.sendNewHcaaf(body).subscribe(res => {
          this.submitdisabled = false;
          setTimeout(() => {
            this.addhcaafModal1.hide();
            this.closeCompanyHcaafModal.ripple.trigger.click();
            this.submitdisabled = false;
            stepper.selectedIndex = 0;
          }, 500)
          // this.submitdisabled = false;
  
         
          if (res.status == 200) {
  
            // if (this.studentFormDetail?.type === 'simple') {
            //   this.submitWorkflowttachment(this.singleStepForm);
            // } else if (this.studentFormDetail?.type === 'multi_step') {
            //   this.submitWorkflowttachment(this.multiStepForm);
            // }
  
  
            this.service.showMessage({ message: res.msg });
            this.gethcaafList();
            // this.getPenddinghcaafList();
            this.getHcaafPendingList();
         
           
          } else {
            this.service.showMessage({ message: res.msg });
          }
          this.hcaafForm.patchValue({
            form_id: "",
            supervisor_id:null
          })
          stepper.selectedIndex = 0;
  
        }, err => {
          this.service.showMessage({
            message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
          })
  
        }
        );
      } else {
        this.service.showMessage({
          message: 'Form Required'
        })
      }
    }
  
    studentFormDetailStatus:any={};
    openModelPendding(data) {
      console.log("data", this.hcaafPending[0]);
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none'; // Hide the loader on error
      this.vertical = false; // Reset vertical state
      this.submithcaafModal1.show();
  
      this.studentFormDetailStatus = this.hcaafPending[0]
      this.studentFormDetail = this.hcaafPending[0]['form_fields'];
      console.log("this.studentFormDetailthis.studentFormDetail", this.studentFormDetail)
      if (this.studentFormDetail?.type === 'simple') {
        this.singleStepForm = this.studentFormDetail?.fields;
      } else {
        this.multiStepForm = this.studentFormDetail?.fields;
      }
      const self = this;
      setTimeout(() => {
        self.initializeSignatures();
      }, 5000);
      // this.getStudentTaskForm(this.hcaafPending[0].hcaaf_form_id);
    }
  
  
    openModelViewHcaaf(data) {
      console.log("data", data[0]);
      this.submithcaafModal1.show();
      this.studentFormDetailStatus = data[0];
      this.studentFormDetail = data[0]['form_fields'];
      if (this.studentFormDetail?.type === 'simple') {
        this.singleStepForm = this.studentFormDetail?.fields;
      } else {
        this.multiStepForm = this.studentFormDetail?.fields;
      }
  
      // this.studentFormDetail.fields.map(async(el)=>{
      //   if(el.id === "signature"){
      //     if(el.elementData){
      //       let url =await this.getBase64Image(el.elementData.items[0].signature.url);
      //       console.log("urlurlurl", url);
      //       el.elementData.items[0].signature.baseurl = url;
      //     }
      //   }
      // })
  
      console.log("this.studentFormDetail", this.studentFormDetail);
  
      
      const self = this;
      setTimeout(() => {
        self.initializeSignatures();
      }, 5000);
      // this.getStudentTaskForm(this.hcaafPending[0].hcaaf_form_id);
    }
  
  
    studentFormDetail: any;
  
  
    async getStudentTaskForm(formId) {
      this.service.getHcaafFormDetailById({ _id: formId }).subscribe(response => {
        console.log("responseresponseresponse form", response)
        this.studentFormDetail = response.data[0];
        if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = this.studentFormDetail?.widgets?.values;
        } else if (this.studentFormDetail?.type === 'multi_step') {
          this.multiStepForm = this.studentFormDetail?.widgets?.values;
        }
      });
    }
  
    initializeSignatures() {
      console.log("this.signaturesArray", this.signaturesArray)
      this.signaturesArray.forEach((signatureData, index) => {
        const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-Employer-${index}`) as HTMLCanvasElement;
        const canvas1: HTMLCanvasElement = document.getElementById(`signaturePad-Staff-${index}`) as HTMLCanvasElement;
        const canvas2: HTMLCanvasElement = document.getElementById(`signaturePad-${index}`) as HTMLCanvasElement;
        if (canvas) {
          const signaturePad = new SignaturePad(canvas);
          this.signaturePads.push(signaturePad);
          console.log(" this.signaturePads",  this.signaturePads)
        }
        if (canvas1) {
          const signaturePad1 = new SignaturePad(canvas1);
          this.signaturePads.push(signaturePad1);
          console.log(" this.signaturePads",  this.signaturePads)
        }
        if (canvas2) {
          const signaturePad2 = new SignaturePad(canvas2);
          this.signaturePads.push(signaturePad2);
          console.log(" this.signaturePads",  this.signaturePads)
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
          field.elementData.value = Array.isArray(field.elementData.value) ? field.elementData.value : [];
          field.elementData.value.push(resp);
        });
      });

      event.target.value = ""; // reset input
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
      console.log(this.signaturePads, i, item);
      if(this.signaturePads.length==1){
        if(item.item=="Staff"){
          i = i-1;
          if(i<0){
            i = 0;
          }
        }
      }
    
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
        this.submitWorkflowttachment(this.singleStepForm);
      } else if (this.studentFormDetail?.type === 'multi_step') {
        this.submitWorkflowttachment(this.multiStepForm);
      }
    }

    async callApi(){
       let pdf = await this.generatePDF();

      const payload =await  {
        _id: this.selectedForm._id,
        "pdfs":pdf
      }
      console.log("payload", payload);
      this.service.updateHcaafForm(payload).subscribe(res => {
        this.downloadhcaafForm.hide();
        this.gethcaafList();
        this.getHcaafPendingList();
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
    async downloadHcaaf(){
     setTimeout(() => {
      this.callApi()
     }, 1000);
    }
  
    comment:any='';
    disableBtnform:boolean = false;

    async disapprove(){
       this.disableBtnform = true;
      // let pdf = await this.generatePDF();
      const payload =await  {
        _id: this.hcaafPending[0]._id,
        hcaaf_approval_status: "declined",
        task_status: "pending",
        employee_status: "pending",
        staff_status: "pending",
        comment:this.comment
      }
      console.log("payload", payload);
      this.service.updateHcaafApprovalStatus(payload).subscribe((res:any) => {
        this.comment = '';
        this.disableBtnform = false;
        this.submitdisabled = true;
        this.service.showMessage({
          message: res.msg?res.msg:"Agreement Form sent successfully"
        });
        this.hcaafDisapprove.hide();
        this.gethcaafList();
        this.getHcaafPendingList();
      }, err => {
        this.disableBtnform = false;
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
    async submitWorkflowttachment(fields) {
  
      // this.generatePDF();
      this.disableBtnform = true;

      const monthsToAdd = this.hcaafPending?.[0]?.hcaaf_validation
        ? Number(this.hcaafPending[0].hcaaf_validation)
        : 0;

      // Start with current date
      const currentDate = new Date();

      // Add months
      const updatedDate = new Date(currentDate);
      updatedDate.setMonth(currentDate.getMonth() + monthsToAdd);

      // Convert to ISO string
      const isoString = updatedDate.toISOString();


      // let pdf = await this.generatePDF();
      const payload =await  {
        _id: this.hcaafPending[0]._id,
        "company_id": this.companyId,
        "hcaaf_form_id": this.hcaafPending[0].hcaaf_form_id,
        "employer_hcaaf_id": this.hcaafPending[0].employer_hcaaf_id,
        "task_status": "completed",
        "employee_status": "completed",
        "staff_status": "completed",
        "pdfs":"",
        "valid_from": this.hcaafPending[0].valid_from?this.hcaafPending[0].valid_from:new Date().toISOString(),
        "valid_to": this.hcaafPending[0].valid_to
        ? this.hcaafPending[0].valid_to
        : isoString,
        form_fields: { fields, type: this.studentFormDetail?.type },
        staff_name: this.userDetail?.first_name + ' ' + this.userDetail?.last_name
      }
      console.log("payload", payload);
      this.service.submitHcaafForm(payload).subscribe(res => {
        this.disableBtnform = false;
        this.submitdisabled = true;
        this.service.showMessage({
          message: "Agreement Form sent successfully"
        });
        // this.goBack();
        this.submithcaafModal1.hide();
        this.gethcaafList();
        // this.getPenddinghcaafList();
        this.getHcaafPendingList();
      }, err => {
        this.disableBtnform = false;
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
        company_id: this.companyId,
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
  
    // goBack() {
    //   // this.location.back();
    // }
  
  
    // (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0)))
    // ||
    checkIsFormValid(formFields) {
      if (formFields && formFields.length > 0) {
        // console.log("formFields", formFields, formFields.some(form => (form.id !== 'signature'  && form.elementData?.required && !form.elementData?.value)))
        // && form.id !== 'checkbox'
        return formFields.some(form => (form.id !== 'signature'  && form.id !== 'checkbox'  && form.elementData?.required && !form.elementData?.value));
      } else {
        return true;
      }
    }
  
  
    checkIsFormValidSubmit(formFields) {
      //
      if (formFields && formFields.length > 0) {
        return formFields.some(form => (form.id !== 'signature' &&  form.id !== 'checkbox' &&  form.elementData?.required && !form.elementData?.value) ||
          (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))));
      } else {
        return true;
      }
    }
  
    checkFieldPermission(permissions) {
      // if (this.studentFormDetail?.staff_status !== 'completed') {
        // if (permissions?.staff.write && permissions?.staff.read) {
        //   return 'editable';
        // } else if (!permissions?.staff.write && permissions?.staff.read) {
        //   return 'readOnly';
        // } else {
        //   return 'hidden';
        // }
      // }
      return 'editable';

    }
  
    // downloadFile(url: string) {
    //   window.open(url);
    // }
  
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
    
    validurl(url){
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  
    // generatePDF(): Promise<any> {
    //   const data = document.getElementById('pdfContent') as HTMLElement;
    
    //   if (data) {
    //     // Find all elements with the ID 'submitButton' and hide them
    //     const submitButtons = document.querySelectorAll('#submitButton') as NodeListOf<HTMLElement>;
        
    //     submitButtons.forEach(button => {
    //       button.style.display = 'none';
    //     });
    
    //     return domtoimage.toPng(data).then((contentDataURL) => {
    //       const pdf = new jsPDF('p', 'mm', 'a4');
          
    //       // Define image width and height for A4
    //       const imgWidth = 210; // A4 size width in mm
    //       const pageHeight = 297; // A4 size height in mm
    
    //       // Create an Image instance
    //       const img = new Image();
    //       img.src = contentDataURL;
    
    //       return new Promise<any>((resolve, reject) => {
    //         img.onload = () => {
    //           const aspectRatio = img.width / img.height;
    //           let imgHeight = imgWidth / aspectRatio;
    
    //           if (imgHeight > pageHeight) {
    //             // Calculate the total number of pages needed
    //             let positionY = 0;
    //             const totalPages = Math.ceil(imgHeight / pageHeight);
    
    //             for (let i = 0; i < totalPages-1; i++) {
    //               if (i > 0) {
    //                 pdf.addPage();
    //               }
    
    //               // Calculate the portion of the image that fits on the current page
    //               const heightForPage = Math.min(pageHeight, imgHeight - positionY);
    //               pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, heightForPage);
    //               positionY += heightForPage;
    //             }
    //           } else {
    //             // If the image fits on one page
    //             pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    //           }
    
    //           // Save the PDF as a Blob and create a URL
    //           const pdfBlob = pdf.output('blob');
    //           const pdfURL = URL.createObjectURL(pdfBlob);
    //           console.log("pdfURL", pdfURL);
    
    //           // Prepare FormData for upload
    //           const formData = new FormData();
    //           formData.append('media', pdfBlob, new Date().getTime() + '.pdf');
    
    //           // Upload the PDF using the Angular service
    //           this.service.uploadMedia(formData).subscribe((resp: any) => {
    //             console.log('Upload response:', resp);
    //             resolve(resp); // Resolve the promise with the upload response
    //           }, (error) => {
    //             console.error('Upload error:', error);
    //             reject(error); // Reject the promise on error
    //           });
    //         };
    
    //         img.onerror = (error) => {
    //           console.error('Error loading image:', error);
    //           reject(error); // Reject the promise on image load error
    //         };
    //       });
    
    //     }).catch(error => {
    //       console.error('Error capturing HTML:', error);
    //       return Promise.reject(error); // Return rejected promise on capture error
    //     }).finally(() => {
    //       // Restore the submit buttons after the image is captured
    //       submitButtons.forEach(button => {
    //         button.style.display = 'block';
    //       });
    //     });
    //   } else {
    //     return Promise.reject('No content found to generate PDF'); // Handle case where content is not found
    //   }
    // }
  
    // async generatePDF(): Promise<any> {
  
    //   // console.log("this.employerProfile.company_nam",this.employerProfile.company_name)
    //   // return 
    //   return new Promise<void>((resolve, reject) => {
    //     const loader = document.getElementById('loader');
    //     setTimeout(async () => {
    //       const element = document.getElementById('pdfContent');
    //       if (!element) {
    //         console.error('Element not found!');
    //         if (loader) loader.style.display = 'none';
    //         reject('Element not found');
    //         return;
    //       }
    
    //       if (loader) loader.style.display = 'block';
    
    //       const pdf = new jsPDF('p', 'mm', 'a4');
    //       const pdfWidth = pdf.internal.pageSize.getWidth();
    //       const pdfHeight = pdf.internal.pageSize.getHeight();

    //       console.log("element", element);
    
    //       try {
    //         const canvas = await domtoimage.toPng(element, { quality: 1 });
    //         const img = new Image();
    //         img.src = canvas;
    
    //         img.onload = () => {
    //           const imgWidth = pdfWidth;
    //           const imgHeight = (img.height * imgWidth) / img.width;
    
    //           let position = 0;
    //           let currentHeight = imgHeight;
    
    //           pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
    //           currentHeight -= pdfHeight;
    
    //           while (currentHeight > 0) {
    //             position -= pdfHeight;
    //             pdf.addPage();
    //             pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
    //             currentHeight -= pdfHeight;
    //           }
    
    //           const pdfBlob = pdf.output('blob');
    //           console.log('Generated PDF Blob:', pdfBlob, this.employerProfile?.company_name, this.studentFormDetailStatus);
    
    //           // const fileName = `${
    //           //   this.studentFormDetailStatus.form_title+'_'+this.employerProfile?.company_name ||
    //           //   new Date().getTime()
    //           // }`;
  
    //           const currentDate = new Date();
    //           const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
  
    //           const fileName = `${
    //             this.studentFormDetailStatus?.form_title + '_' + 
    //             (this.employerProfile?.company_name || new Date().getTime()) + '_' + 
    //             formattedDate
    //           }`;
  
    //           console.log("fileName", fileName);
    //           pdf.save(fileName + '.pdf');
    //           const formData = new FormData();
    //           formData.append('media', pdfBlob, fileName + '.pdf');
    
    //           for (const pair of (formData as any).entries()) {
    //             console.log(`${pair[0]}:`, pair[1]);
    //           }
    
    //           // this.service.uploadMediaHcaaf(formData).subscribe(
    //           //   (resp: any) => {
    //           //     console.log('Upload response:', resp);
    //           //     if (loader) loader.style.display = 'none';
    //           //     this.vertical = false;
    //           //     resolve(resp);
    //           //   },
    //           //   (error) => {
    //           //     console.error('Upload error:', error);
    //           //     if (loader) loader.style.display = 'none';
    //           //     this.vertical = false;
    //           //     reject(error);
    //           //   }
    //           // );
    //         };
    //       } catch (error) {
    //         console.error('Error generating PDF:', error);
    //         if (loader) loader.style.display = 'none';
    //         this.vertical = false;
    //         reject(error);
    //       }
    //     }, 500);
    //   });
    // }

async generatePDF(): Promise<any> {
  return new Promise<void>(async (resolve, reject) => {
    const loader = document.getElementById('loader');
    const element = document.getElementById('pdfContent');

    if (!element) {
      reject('Element not found');
      return;
    }

    if (loader) loader.style.display = 'block';

    // Save original HTML
    const originalContent = element.cloneNode(true) as HTMLElement;

    // Expand all steps so their content is visible in DOM
    const stepHeaders = element.querySelectorAll('mat-step-header');
    const stepContents = element.querySelectorAll('.mat-vertical-content');

    stepContents.forEach((content: any) => {
      content.style.display = 'block';  // force visible
      content.style.height = 'auto';
      content.style.overflow = 'visible';
    });

    stepHeaders.forEach((header: any) => {
      header.classList.add('mat-step-header'); // keep labels visible
    });

    try {
      const dataUrl = await domtoimage.toPng(element, { quality: 1, cacheBust: true });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const imgHeight = (img.height * pdfWidth) / img.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(img, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
          position -= pdf.internal.pageSize.getHeight();
          pdf.addPage();
          pdf.addImage(img, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        // pdf.save('form.pdf');
         const currentDate = new Date();
          const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

          const fileName = `${
            this.studentFormDetailStatus?.form_title + '_' + 
            (this.employerProfile?.company_name || new Date().getTime()) + '_' + 
            formattedDate
          }`;
           const pdfBlob = pdf.output('blob');

          console.log("fileName", fileName);
          pdf.save(fileName + '.pdf');
          const formData = new FormData();
          formData.append('media', pdfBlob, fileName + '.pdf');

          for (const pair of (formData as any).entries()) {
            console.log(`${pair[0]}:`, pair[1]);
          }

          this.service.uploadMediaHcaaf(formData).subscribe(
            (resp: any) => {
              console.log('Upload response:', resp);
              if (loader) loader.style.display = 'none';
              this.vertical = false;
              resolve(resp);
            },
            (error) => {
              console.error('Upload error:', error);
              if (loader) loader.style.display = 'none';
              this.vertical = false;
              reject(error);
            }
          );

        // Restore original DOM
        // element.innerHTML = (originalContent as HTMLElement).innerHTML;
        // if (loader) loader.style.display = 'none';
        // resolve();
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      element.innerHTML = (originalContent as HTMLElement).innerHTML;
      if (loader) loader.style.display = 'none';
      reject(error);
    }
  });
}

    
  
    public showAll = false;
  
    public toggleShowMore(): void {
      this.showAll = !this.showAll;
    }
  
  
    // public isActive(item: { startDate: Date, endDate: Date }): boolean {
    //   return this.currentDate >= item.startDate && this.currentDate <= item.endDate;
    // }
  
  
    getStatus(data) {
      return new Date().getTime() >= new Date(data.valid_from).getTime() && new Date().getTime() <= new Date(data.valid_to).getTime()
    }
  
    flagComment:any = "";
    updateFlagStudent(status){
      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let body = {
        "company_id": this.employerProfile._id,
        "is_flagged": status,
        "flag_comment": this.flagComment,
        "flagged_by" :{staff_id: this.userDetail._id, staff_name: this.userDetail.first_name+" "+this.userDetail.last_name}
      }
      this.service.updateflagCompany(body).subscribe((res: any) => {
        if (res.status == 200) {
          this.service.showMessage({ message: res.msg });
          this.ngOnInit();
          
        } else {
          this.service.showMessage({ message: res.msg });
        }
      
        if(status){
          this.closeAddCompanyFlagModal.ripple.trigger.click();
        }else{
          this.removeCompanyFlagModel.hide();
         }
       
      }, err => {
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      });
  
    }
  
  
    changeStatus(key, data) {
      const payload = {
        [key]: data[key],
        comapny_id: [data._id]
      }
      this.service.updateComapniesStatus(payload).subscribe((res: any) => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.service.showMessage({
            message: "Company status updated successfully"
          });
          this.getEmployerProfile(this.documentpage);
        } else {
          this.service.showMessage({
            message: res.msg
          });
        }
      });
    }
  
    addVacancy() {
      this.router.navigate(["/admin/wil/create-vacancy"], {queryParams: {company_id: this.employerProfile._id}})
    }
  
  
    @ViewChild('closeConfirmDeleteModal') closeConfirmDeleteModal;
  
    addnote:boolean = false;
    note:any = '';
    selectedNode:any 
    deleteNote(){
     
      let body = {
        "_id": this.selectedNode._id,
      }
      this.service.deleteCompanyNote(body).subscribe(res => {
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
  
    notepage:any = 0;
    notelimit:any = 5;
    totalNotes:any = 0
    totalNoteList:any = 0
    noteList:any = [];
    getNotes(page){
      this.notepage = page;
      this.notelimit = 5;
      let body = {
        "company_id": this.companyId,
        "limit": this.notelimit,
        "offset": page,
       }
      this.service.getCompanyNote(body).subscribe(res => {
  
        if (res.status === 200) {
          if (res.count <= this.notelimit) {
            this.notelimit = res.count;
          }
  
          this.totalNoteList = res.count;
          this.totalNotes = Math.ceil(this.totalNoteList / this.notelimit);
          this.noteList = res.result;
        } else {
          this.noteList = [];
          // this.service.showMessage({ message: res.msg });
        }
      }, err => {
        this.noteList  = [];
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
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
  
    
    createNote(){
      if(!this.note){
        this.service.showMessage({ message: "Note Required!" });
        return false;
      }
      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
  
      if(this.selectedNode){
        let body = {
          "_id": this.selectedNode._id,
          "company_id": this.companyId,
          "created_by": this.userDetail._id,
          "description": this.note 
         }
        this.service.updateCompanyNote(body).subscribe(res => {
          if (res.status == 200) {
            this.note = '';
            this.selectedNode = null;
            this.getNotes(this.notepage);
            this.service.showMessage({ message: res.msg });
            this.closeAddNoteModal.ripple.trigger.click();
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
          "company_id": this.companyId,
          "created_by": this.userDetail._id,
          "description": this.note 
         }
  
         console.log("body", body)
        this.service.addCompanyNote(body).subscribe(res => {
          if (res.status == 200) {
            this.note = '';
            this.getNotes(this.notepage);
            this.selectedNode = null;
            this.service.showMessage({ message: res.msg });
            this.closeAddNoteModal.ripple.trigger.click();
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
  
    selectedDetailIndex:any = 0;
  
    selectedIndex:any =0;
    onTabChangeddetail(event){
       this.selectedDetailIndex = event.index;
    }
    onTabChanged(event){
      console.log("event", event);
      this.selectedIndex = event.index;
    }
     onDetailTabChanged(event){
      console.log("event", event);
      this.selectedDetailTabIndex = event.index;
    }
  
    
    emailpage:any = 1;
    emaillimit:any = 10;
    totalemails:any = 0
    totalemailList:any = 0
    selectedEmail:any = {};
    submittedEmail:any = [];
    keysearchTerm:any = '';
    onKeySearch(key){
      this.getEmails(this.emailpage);
    }
    companyImage:any = null
    getEmails(page) {
      this.emailpage = page;
      this.emaillimit = 10;
      let payload = {
        "company_id": this.employerProfile._id,
        "receiver_type": "company",
        "limit": this.emaillimit,
        "offset": this.emailpage-1
      }
      if(this.filteredValues.length>0){
        payload["emails"]= this.filteredValues
      }
       if(this.keysearchTerm){
        payload["search"]= this.keysearchTerm
      }
      this.service.getSentEmailCompanyNew(payload).subscribe((res: any) => {
        // this.submittedDocuments = res.records.filter(record => record.task_type === 'attachments');
        // this.submittedForms = res.records.filter(record => record.task_type === 'form');
        // this.hideShowDocuments(3);
        // this.hideShowForms(3);
        this.companyImage = res.company_logo;
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
    
    @ViewChild('closeHcaafDeleteModal') closeHcaafDeleteModal;
    selectedHcaaf:any = {};
    deleteHcaaf(){
      this.service.deleteHcaaf({employer_hcaaf_id:this.selectedHcaaf.employer_hcaaf_id}).subscribe((res: any) => {
        this.selectedHcaaf = {};
        this.gethcaafList();
        // this.getPenddinghcaafList();
        this.getHcaafPendingList();
        this.closeHcaafDeleteModal.ripple.trigger.click();
      }, (err)=>{
        
      });
    }
  
  
    getPerferContentName(){
      if(this.employerProfile && this.employerProfile.contact_person){
        let find = this.employerProfile.contact_person.find(el=>el.preferred_contact);
        if(find){
          return find?.first_name +" "+ find?.last_name;
        }else{
          return this.employerProfile?.contact_01_first_name +" "+ this.employerProfile?.contact_01_last_name; 
        }
      }else{
        return this.employerProfile?.contact_01_first_name +" "+ this.employerProfile?.contact_01_last_name;
      }
    }
  
    getPerferContentEmail(){
      if(this.employerProfile && this.employerProfile.contact_person){
        let find = this.employerProfile.contact_person.find(el=>el.preferred_contact);
        if(find){
          return find?.primary_email;
        }else{
          return this.employerProfile?.email; 
        }
      }else{
        return this.employerProfile?.email;
      }
    }


   limit = 10;          // number of records per load
   offset = 0;          // current offset
   activitLimit = 0;    // total records in backend
   isLoading = false;   // prevent multiple calls
   // activityLogs: any[] = [];
   
   

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
     company_id: this.companyId,
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

    async updateSelectFom(form){
      this.selectedForm =await  form;
  
      console.log("this.selectedForm", this.selectedForm);
      return false;
     
    }
  
    
    generatePDFForm() {
      setTimeout(() => {
        const data = document.getElementById('donwloadFormHtml') as HTMLElement;
        console.log("data", data);
        if (data) {
          const submitButtons = document.querySelectorAll('#pdfHide') as NodeListOf<HTMLElement>;
    
          // Hide the submit buttons temporarily
          submitButtons.forEach(button => {
            button.style.display = 'none';
          });
    
          // Hide images before generating the PDF
          const imagesToHide = data.querySelectorAll('img');
          imagesToHide.forEach(image => {
            image.style.display = 'none';
          });
    
          // Capture the element as PNG
          domtoimage.toPng(data).then((contentDataURL) => {
            console.log('Generated contentDataURL:', contentDataURL); // Log the contentDataURL
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const img = new Image();
            img.src = contentDataURL;
    
            img.onload = () => {
              // Proceed with PDF generation...
            };
    
            img.onerror = (error) => {
              console.error('Error loading image:', error); // Log the specific error
              // Restore visibility if there's an error
              imagesToHide.forEach(image => {
                image.style.display = 'block'; // Restore visibility
              });
              submitButtons.forEach(button => {
                button.style.display = 'block'; // Restore buttons
              });
            };
          }).catch(error => {
            console.error('Error capturing HTML:', error);
          });
        } else {
          return Promise.reject('No content found to generate PDF');
        }
      }, 500);
    }
    
  
    vertical:boolean = false;
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
  
  
    // checkFieldPermission(permissions) {
    //   if (this.studentFormDetail?.staff_status !== 'completed') {
    //     if (permissions?.staff.write && permissions?.staff.read) {
    //       return 'editable';
    //     } else if (!permissions?.staff.write && permissions?.staff.read) {
    //       return 'readOnly';
    //     } else {
    //       return 'hidden';
    //     }
    //   }
    // }
  
  
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
  
    gotoCompanyStudentList(data, type){
      this.router.navigate(['/admin/students/company-students-list'], {queryParams: {company_id: data._id,type:type}});
    }
  
    viewVacancy(item) {
      console.log("this.job_details", this.employerProfile);
      if(this.activeTab=="Projects"){
        this.router.navigate(["/admin/wil/view-project"], {queryParams: {id: item._id}})
      }else{
        this.router.navigate(["/admin/wil/view-vacancy"], {queryParams: {id: item._id}})
      }
      return false;
    
     }
  
     visibleCount = 2;
     showMore() {
      this.visibleCount = this.employerProfile.contact_person.length;
    }

      formSubmitted:boolean = false
  
    onNextOrSubmit(fields, stepper: MatStepper, type) {
      console.log("fields", fields);

      // Determine access level helper
      const getAccessLevel = (permissions) => {
        // if (permissions?.staff?.write && permissions?.staff?.read) {
        //   return 'editable';
        // } else if (!permissions?.staff?.write && permissions?.staff?.read) {
        //   return 'readOnly';
        // } else {
        //   return 'hidden';
        // }
        return 'editable';
      };

      // Skip validation if all fields are just descriptions
      const onlyDescriptions = fields.every(
        field => field.elementData?.type === 'description'
      );
      if (onlyDescriptions) {
        stepper.next();
        return;
      }

      // Validate only editable + required fields
      // const isInvalid = fields.some(field => {
      //   const accessLevel = 'editable' //getAccessLevel(field.elementData?.permissions);
      //   const isEditable = accessLevel === 'editable'; // only check editable fields
      //   const isRequired = field.elementData?.required;
      //   const isDescription = field.elementData?.type === 'description';

      //   if (!isEditable || isDescription || !isRequired) {
      //     return false; // skip validation if not editable, not required, or description
      //   }

      //   // Now check value based on type
      //   const hasValue = field.elementData?.type === 'checkbox'
      //     ? field.elementData?.items?.some(item => item.selected)
      //     : !!field.elementData?.value;

      //   return !hasValue;
      // });

      // console.log("isInvalid", isInvalid);

      // if (isInvalid) {
      //   this.formSubmitted = true;
      //   return false;
      // } else {
        this.formSubmitted = false;
        if (type === "submit") {
          this.createHaccf(stepper)
          this.submitdisabled = true;
        } else {
          stepper.next();
        }
      // }
    }

     onNextOrSubmit1(fields, stepper: MatStepper, type) {
      console.log("fields", fields);

      // Determine access level helper
      const getAccessLevel = (permissions) => {
        // if (permissions?.staff?.write && permissions?.staff?.read) {
        //   return 'editable';
        // } else if (!permissions?.staff?.write && permissions?.staff?.read) {
        //   return 'readOnly';
        // } else {
        //   return 'hidden';
        // }
        return 'editable';
      };

      // Skip validation if all fields are just descriptions
      const onlyDescriptions = fields.every(
        field => field.elementData?.type === 'description'
      );
      if (onlyDescriptions) {
        stepper.next();
        return;
      }

      // // Validate only editable + required fields
      // const isInvalid = fields.some(field => {
      //   const accessLevel = 'editable' //getAccessLevel(field.elementData?.permissions);
      //   const isEditable = accessLevel === 'editable'; // only check editable fields
      //   const isRequired = field.elementData?.required;
      //   const isDescription = field.elementData?.type === 'description';

      //   if (!isEditable || isDescription || !isRequired) {
      //     return false; // skip validation if not editable, not required, or description
      //   }

      //   // Now check value based on type
      //   const hasValue = field.elementData?.type === 'checkbox'
      //     ? field.elementData?.items?.some(item => item.selected)
      //     : !!field.elementData?.value;

      //   return !hasValue;
      // });

      // console.log("isInvalid", isInvalid);

      // if (isInvalid) {
      //   this.formSubmitted = true;
      //   return false;
      // } else {
        this.formSubmitted = false;
        if (type === "submit") {
          stepper.selectedIndex = 0;
          this.submitForm()
          this.submitdisabled = true;
        } else {
          stepper.next();
        }
      // }
    }


    isAnyItemSelected(items: any[]): boolean {
      return items?.some(item => item.selected);
    }

    isFieldInvalid(field): boolean {
      const access = this.checkFieldPermission(field.elementData?.permissions);
      const isEditable = access === 'editable';
      const isRequired = field.elementData?.required;

      let hasValue = false;

      if (field.elementData?.type === 'checkbox') {
        hasValue = this.isAnyItemSelected(field.elementData?.items);
      } else if (field.elementData?.type === 'attachment') {
        hasValue = field.elementData?.value && field.elementData?.value.length > 0;
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
    // if (hasSelected) {
    //  field.elementData.value = null;
    // }
     field.elementData.value = hasSelected ? true : null;
  }
}

 formatEmailDate(dateStr: string | Date): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      // return only time (hh:mm a)
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      // return dd/MM/yy
      return date.toLocaleDateString('en-GB'); 
    }
  }

    onMenuItemClick(event: MouseEvent): void {
    // Close the menu explicitly
    // if (menuTrigger) {
    //   menuTrigger.closeMenu();
    // }
    event.stopPropagation();
    // Additional logic if needed
    // console.log('Menu item clicked and menu closed.');
  }

   filter_approvals:any = {
    all: false
  };
  taskCounts:any;
filteredValues: string[] = []; // selected values to pass to filter

 onFilterChange(type: string, event: any) {
    if (type === 'all') {
      // If "All" is checked, select all contacts
      this.filter_approvals.all = event.checked;
      this.filteredContacts.forEach(c => this.selected[c.primary_email] = event.checked);

    } else {
      // Individual checkbox
       this.selected[type] = event.checked;
      
     
    }

    this.updateFilteredValues();
  }

  // Collect all selected emails
  updateFilteredValues() {
    this.filteredValues = [];

    if (this.filter_approvals.all) {
      this.filteredValues = this.filteredContacts.map(c => c.primary_email);
    } else {
      this.filteredValues = Object.keys(this.selected).filter(key => this.selected[key]);
    }

    if(this.filteredContacts.length==this.filteredValues.length){
      this.filter_approvals.all = true;
    }

    console.log('Selected values:', this.filteredValues);

    // Call your filter function with these values
    // this.applyFilter(this.filteredValues);
     this.getEmails(this.emailpage);
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.filteredContacts = this.contacts.filter(c =>
      c.first_name.toLowerCase().includes(this.searchTerm) || c.last_name.toLowerCase().includes(this.searchTerm)
    );
  }

  toggleSelect(contact: any) {
    this.selected[contact.id] = !this.selected[contact.id];
  }

  toggleAll() {
    const allSelected = Object.values(this.selected).every(v => v);
    this.contacts.forEach(c => this.selected[c.id] = !allSelected);
  }

  // company-detail.component.ts
  isAllSelected(): boolean {
    return this.contacts.length > 0 &&
          Object.values(this.selected).every(v => v);
  }


  getCompanyEmployers(){
     this.service.getCompanyEmployers({company_id:this.companyId, "receiver_type": "company"}).subscribe(res => {
        if (res.status == HttpResponseCode.SUCCESS) {
            this.contacts = res.data
            this.taskCounts = res;
            this.filteredContacts = this.contacts;
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


  getInitials(email: any): string {
  // Prefer employer_details name if available
  let name = '';

  if (email?.employer_details?.length) {
    const emp = email.employer_details[0];
    name = `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
  } else if (email?.receiver_names?.length) {
    name = email.receiver_names[0];
  } else if (email?.email_type) {
    name = email.email_type;
  }

  if (!name) return '';

  // Split name into words and take first two letters
  const parts = name.split(' ');
  let initials = parts[0]?.charAt(0).toUpperCase() || '';

  if (parts.length > 1) {
    initials += parts[1]?.charAt(0).toUpperCase() || '';
  } else if (parts[0]?.length > 1) {
    initials += parts[0]?.charAt(1).toUpperCase() || '';
  }

  return initials;
}
}
