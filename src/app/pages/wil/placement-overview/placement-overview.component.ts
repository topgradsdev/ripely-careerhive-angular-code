import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Utils} from '../../../shared/utility';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import {HttpResponseCode} from '../../../shared/enum';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-placement-overview',
  templateUrl: './placement-overview.component.html',
  styleUrls: ['./placement-overview.component.scss']
})
export class PlacementOverviewComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };

  activeFilter = "major"
  filterParameters :any= {
    placementGroups: [],
    major: [],
    priority: [],
    campus: [],
    status: [],
    post_code: [],
    area: [],
    monthly_cohort: [],
    resume_level: [],
    placement_doc_received: [],
    course_code: [],
    placementType: [],
    monthly_cohort_sdate: null,
    monthly_cohort_edate: null,
    course_start_sdate: null,
    course_start_edate: null,
    course_end_sdate: null,
    course_end_edate: null,
    internship_start_sdate: null,
    internship_start_edate: null
    ,internship_end_sdate: null,
    internship_end_edate: null,
    cohort_start_sdate: null,
    cohort_start_edate: null,
    cohort_end_sdate: null,
    cohort_end_edate: null,
    graduation_sdate: null,
    graduation_edate: null,
    credit_min_points:null,
    credit_max_points:null,
    gpa_min_points:null,
    gpa_max_points:null
  }


  
  id: any;
  pass: String = 'password'
  proceedFlow: any = '';
  imageURL: string = '../../../../assets/img/banner_linkedin.svg';
  placementOverView: FormGroup;
  publishPlacementGroup: FormGroup;
  confirmPassword: FormGroup;
  overviewEditForm: boolean = false;
  @Input() mode: string;
  @Output() placementDetail = new EventEmitter<any>();
  overAllCount = {
    eligibleStudent: null,
    pendingApproval: null,
    pendingPlacement: null,
    placed: null
  }
  placementTypes = [];
  placementCategories = [];
  placementIndustries = [];
  placementGroupDetails:any = {
    _id: null,
    title: null,
    description: null,
    code: null,
    background: null,
    publish_at: null,
    publish_on: null,
    updated_at: null,
    start_date: null,
    end_date: null,
    industry_id: null,
    industry: null,
    category_id: null,
    category_name: null,
    students: [],
    staff: [],
    created_by: null,
    is_publish: null,
    deadline:null
  }
  staffIds = [];
  password = null;
  publishPlacement = {
    publishedOn: null,
    additionalEmailOnPublication: false
  }
  staffControl = new FormControl([]);
  categories = [];
  emailTemplateList = [];
  activeTab: string = "tab1";

  todayDate: string;
  minDate: any; 
  maxDate: any;
  @ViewChild('closePublishModal') closePublishModal;
  @ViewChild('closeConfirmPasswordModal') closeConfirmPasswordModal: any;
  @ViewChild('closePasswordModal') closePasswordModal: any;

  showModalBox: boolean = false;
  publishPlacementGroupFormValues: any;

  constructor(
              private activatedRoute: ActivatedRoute, 
              private router: Router, 
              public utils: Utils,
              private service: TopgradserviceService,
              private fb:FormBuilder
              ) {}
  selectedPlacementTypes: string[] = [];
       
  ngOnInit(): void {
     this.studentFilterOptions();
    this.todayDate = Utils.convertDate(this.todayDate, 'DD/MM/YY');
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.placementGroupDetails._id = this.id;
    this.filterParameters = this.filterParameters;
    this.overviewEditForm = this.mode == 'edit' ?  true : false;
    this.placementOverView = new FormGroup({
      background: new FormControl(''),
      title: new FormControl(''),
      code: new FormControl(''),
      description: new FormControl(''),
      category_id: new FormControl('', Validators.required),
      category_name: new FormControl(''),
      industry_id: new FormControl('', Validators.required),
      industry: new FormControl(''),
      staff_id: new FormControl('', []),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
     
    });



    // this.formConteroller();
    // this.publishPlacementGroup = new FormGroup({
    //   publish_on: new FormControl('Publish Instantly'),
    //   start_date: new FormControl(''),
    //   end_date: new FormControl(''),
    //   description: new FormControl('', Validators.required),
    //   placement_type: new FormControl('', Validators.required),
    //   is_email: new FormControl(''),
    //   category: new FormControl(''),
    //   template: new FormControl(''),
    //   subject: new FormControl(''),
    //   message: new FormControl(''),
    //   publish_time: new FormControl('')
    // });

   

    this.confirmPassword = new FormGroup({
      password: new FormControl('', [Validators.required])
    });
    this.getPlacementOverviewDetails();
    this.getPlacementCategories();
    this.getPlacementIndustries();
    this.getEmailCategories();
    this.getPlacementTypes();
    this.getStaffMembers();
    // this.onChangePublishOn({value: 'Publish Instantly'});
  }
  ngAfterViewInit(): void {
    this.formConteroller();
   this.onChangePublishOn({value: 'Publish Instantly'});
  }

  isSelected(type: string): boolean {
    return this.selectedPlacementTypes.includes(type);
  }

  setActiveTab(tab: string, $event?: Event) {
    if ($event) $event.preventDefault();
    this.activeTab = tab;
  }

  formConteroller(){
      this.publishPlacementGroup = this.fb.group({
        publish_on: ['Publish Instantly'],
        start_date: [''],
        end_date: [''],
        description: [''],
        placement_type: ['', Validators.required],
        is_email: ['false'],
        allow_students_join_program: ['false'],
        allow_auto_internship_end_date: ['false'],
        internship_end_day: [''],
        internship_end_date_type: ['week'],
        category: [''],
        template: [''],
        subject: [''],
        message: [''],
        publish_time: [''],
         deadline:[''],
      });


      this.publishPlacementGroup.get('allow_auto_internship_end_date')?.valueChanges.subscribe(value => {
        const endDay = this.publishPlacementGroup.get('internship_end_day');
        const endType = this.publishPlacementGroup.get('internship_end_date_type');

        if (value === 'true') {
          endDay?.setValidators([Validators.required]);
          endType?.setValidators([Validators.required]);
        } else {
          endDay?.clearValidators();
          endType?.clearValidators();
        }

        endDay?.updateValueAndValidity();
        endType?.updateValueAndValidity();
      });

    this.publishPlacementGroup.get('placement_type')?.valueChanges.subscribe((val) => {
      this.selectedPlacementTypes = val || [];
    });


    // this.publishPlacementGroup.patchValue({
    //   publish_on: "Publish Instantly"
    // });

    // setTimeout(() => {
    //   this.publishPlacementGroup.patchValue({ publish_on: 'Publish Instantly' });
    // }, 200);
  }
 
  staffMembers:any = [];

  getStaffMembers() {
    this.service.getStaffMembers({}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffMembers = response.result;
        console.log(this.staffMembers, "this.staffMembers");
      }
    })
  }

  setFilter(){
    this.filterParameters= {
    placementGroups: [],
    major: [],
    priority: [],
    campus: [],
    status: [],
    post_code: [],
    area: [],
    monthly_cohort: [],
    resume_level: [],
    placement_doc_received: [],
    course_code: [],
    placementType: [],
    monthly_cohort_sdate: null,
    monthly_cohort_edate: null,
    course_start_sdate: null,
    course_start_edate: null,
    course_end_sdate: null,
    course_end_edate: null,
    internship_start_sdate: null,
    internship_start_edate: null
    ,internship_end_sdate: null,
    internship_end_edate: null,
    cohort_start_sdate: null,
    cohort_start_edate: null,
    cohort_end_sdate: null,
    cohort_end_edate: null,
    graduation_sdate: null,
    graduation_edate: null,
    credit_min_points:null,
    credit_max_points:null,
    gpa_min_points:null,
    gpa_max_points:null
  }
  }

  checked:boolean = false;
  getPlacementOverviewDetails() {
    let payload = { id: this.id };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.overAllCount.eligibleStudent = response.eligibleStudent,
        this.overAllCount.pendingApproval = response.pendingApproval,
        this.overAllCount.pendingPlacement = response.pendingPlacement,
        this.overAllCount.placed = response.placed,
        this.placementGroupDetails = response.result;
        // if(this.placementGroupDetails.show_eligible_criteria){
        // this.checked = this.placementGroupDetails.show_eligible_criteria?this.placementGroupDetails.show_eligible_criteria:false;
        // }

         this.checked = this.placementGroupDetails.allow_students_join_program?this.placementGroupDetails.allow_students_join_program:false;
        this.imageURL = this.placementGroupDetails.background?this.placementGroupDetails.background:this.imageURL;
        this.service.emitPlacementGroupDetails(this.placementGroupDetails);
        
        this.placementDetail.emit(this.placementGroupDetails);
        this.placementGroupDetails.start_date = this.placementGroupDetails.start_date ? Utils.convertDate(this.placementGroupDetails.start_date, 'DD/MM/YY hh:mm A'): null;
        this.placementGroupDetails.end_date = this.placementGroupDetails.end_date ? Utils.convertDate(this.placementGroupDetails.end_date, 'dd/mm/yyyy') : null;
        this.placementGroupDetails.publish_at = response.result.publish_at ? Utils.convertDate(Number(response.result.publish_at), 'DD/MM/yyyy HH:mm:ss A') : null;
        this.placementGroupDetails.publish_on = response.result.publish_on ? Utils.convertDate(Number(response.result.publish_on), 'DD/MM/yyyy HH:mm:ss A') : null;
        this.placementGroupDetails.updated_at = response.result.updated_at ? Utils.convertDate(Number(response.result.updated_at), 'DD/MM/yyyy HH:mm:ss A') : null;
        this.placementGroupDetails.staff = this.getModefiedResponse(this.placementGroupDetails.staff);
        if (this.overviewEditForm) {
          this.staffList();
          this.onEdit();
        }
       

        if(this.placementGroupDetails?.eligible_criteria){
        this.previewFilter(this.placementGroupDetails?.eligible_criteria);
        this.filteredEntries = Object.entries(this.placementGroupDetails?.eligible_criteria || {})
              .filter(([_, value]) => {
                if (value === null || value === undefined) return false;
                if (Array.isArray(value) && value.length === 0) return false;
                if (typeof value === "string" && value.trim() === "") return false;
                return true;
              })
              .map(([key, value]) => {
                // Handle arrays → join with commas
                if (Array.isArray(value)) {
                  return { key, value: value.join(', ') };
              }

              // Handle GPA (only process min → range)
              if (key === 'gpa_min_points') {
                const min = this.placementGroupDetails?.eligible_criteria?.gpa_min_points;
                const max = this.placementGroupDetails?.eligible_criteria?.gpa_max_points;
                return { key: 'WAM', value: min === max ? `${min}` : `${min} to ${max}` };
              }

              // Handle Credit Points (only process min → range)
              if (key === 'credit_min_points') {
                const min = this.placementGroupDetails?.eligible_criteria?.credit_min_points;
                const max = this.placementGroupDetails?.eligible_criteria?.credit_max_points;
                return { key: 'Credit Points', value: min === max ? `${min}` : `${min} to ${max}` };
              }

              // Handle date ranges (only from _sdate)
              if (key.endsWith('_sdate')) {
                const endKey = key.replace('_sdate', '_edate');
                const start = this.formatDate(value);
                const end = this.formatDate(this.placementGroupDetails?.eligible_criteria?.[endKey]);
                return { key: key.replace('_sdate', '').replaceAll('_', ' '), value: `${start} to ${end}` };
              }

              if (key === "placementGroups") {
                console.log("this.studentFilters", this.studentFilters)
                const ids = Array.isArray(value) ? value : [value];
                const names = ids
                  .map(id => this.studentFilters?.placementGroups?.find(pg => pg._id === id)?.title || id)
                  .join(", ");
                return { key: "Placement Groups", value: names };
              }

              // Assigned To → lookup user name
              if (key === "assignedTo") {
                const id = value;
                const   user = this.studentFilters?.assignedTo?.find(u => u._id === id);
                return { key: "Assigned To", value:  `${user.first_name} ${user.last_name}`.trim() || "Unknown" };
              }

              // Handle single ISO date fields
              if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
                return { key, value: this.formatDate(value) };
              }

              // Default case
              return { key, value };
            })
            // Remove duplicates: skip _max and _edate keys
            .filter(entry => 
              entry && 
              !entry.key.endsWith('_edate') && 
              entry.key !== 'gpa_max_points' && 
              entry.key !== 'credit_max_points'
            );



          console.log("this.filteredEntries", this.filteredEntries)
        }
       
        // this.showPreview();
      }
    })
  }

  prettyKey(key: string): string {
      const map: Record<string, string> = {
        placementGroups: 'Placement Groups',
        major: 'Major',
        minor: 'Minor',
        priority: 'Priority',
        gpa: 'WAM',
        gpa_min_points: 'WAM',
        gpa_max_points: 'WAM',
        credit_min_points: 'Credit Points',
        credit_max_points: 'Credit Points',
        cohort_start_date: 'Cohort Start Date',
        cohort_end_date: 'Cohort End Date',
        course_start_date: 'Course Start Date',
        course_end_date: 'Course End Date',
        internship_start_date: 'Internship Start Date',
        internship_end_date: 'Internship End Date',
        graduation_date: 'Graduation Date'
      };

      if (map[key]) return map[key];

      // fallback: prettify automatically
      return key
        .replace(/_/g, ' ')                // underscores → spaces
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → spaced
        .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
  }


//   private formatDate(dateStr: any): string {
//   if (!dateStr) return '';
//   const d = new Date(dateStr);
//   return d.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// }
private formatDate(dateStr: any): string {
  if (!dateStr) return '';

  const d = new Date(dateStr);

  const day = String(d.getDate()).padStart(2, '0');        // dd
  const month = String(d.getMonth() + 1).padStart(2, '0'); // MM (month is 0-indexed)
  const year = d.getFullYear();                             // yyyy

  return `${day}/${month}/${year}`;
}


  formatValue(val: any): string {
  if (Array.isArray(val)) {
    return val.join(', ');
  }
  return val;
}

  filteredEntries: { key: string; value: any }[] = [];


  getPlacementOverviewDetailsStaff() {
    let payload = { id: this.id };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementGroupDetails.staff = response.result.staff;
      }
    })
  }
  getModefiedResponse(placementDetails: any) {
    return placementDetails.map((data) => {
      data['full_name'] = data.first_name+' '+data.last_name;
      return data;
    });
  }
  proceed(e: any) {
    this.proceedFlow = e;
    this.password = null;
  }

  getPlacementCategories() {
    this.service.getPlacementCategories({}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementCategories = response.result;
      }
    })
  }

  getPlacementIndustries() {
    this.service.getPlacementIndustries({}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementIndustries = response.result;
      }
    })
  }

  onEdit(){
    this.overviewEditForm = true;
    this.staffList();
    this.placementOverView.patchValue({
      background: this.placementGroupDetails.background,
      title: this.placementGroupDetails.title,
      code: this.placementGroupDetails.code,
      description: this.placementGroupDetails.description,
      category_id: this.placementGroupDetails.category_id,
      category_name: this.placementGroupDetails.category_name,
      industry_id: this.placementGroupDetails.industry_id,
      industry: this.placementGroupDetails.industry,
      start_date: Utils.convertIntoDateObject(this.placementGroupDetails.start_date),
      end_date: Utils.convertIntoDateObject(this.placementGroupDetails.end_date),
      // deadline:Utils.convertIntoDateObject(this.placementGroupDetails.deadline),
    });
  }

  onSave() {
    if (this.placementOverView.valid) {
      let payload = this.preparePayload();
      const userDetail = JSON.parse(localStorage.getItem('userDetail'));
      payload['created_by'] = `${userDetail?.first_name} ${userDetail?.last_name}`;
      payload['created_by_id'] = userDetail?._id;
      payload['is_update'] = true;

      console.log("payload", payload);
      // return false;


      this.service.editPlacementGroup(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.overviewEditForm = false;
          this.getPlacementOverviewDetails();
          this.service.showMessage({message: response.msg})
        }
      });
    }
  }
  onEyeClick(field: any, type: any) {
    console.log(field)
    if (field == 'pass') {
      this.pass = type
    }
  }
  checkFieldInvalid(field) {
    return this.placementOverView.get(field)?.invalid && (this.placementOverView.get(field)?.dirty || this.placementOverView.get(field)?.touched);
  }
  
  // checkFieldInvalidPublishPlacement(field) {
  //   return this.publishPlacementGroup.get(field)?.invalid && (this.publishPlacementGroup.get(field)?.dirty || this.publishPlacementGroup.get(field)?.touched);
  // }

  checkFieldInvalidPublishPlacement(field: string): boolean {
    // console.log("field", field)
    if (!this.publishPlacementGroup) return false;

    const control = this.publishPlacementGroup.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }


  onCancel() {
    this.placementOverView.reset();
    this.overviewEditForm = false
  }

  showPreview(event?) {
    const file = (event.target as HTMLInputElement).files[0];
    this.placementOverView.get('background').updateValueAndValidity();
    // File Preview
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.imageURL = reader.result as string;
    //   this.placementOverView.patchValue({
    //     background: this.imageURL
    //   })
    // }
    // reader.readAsDataURL(file);
    const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        this.imageURL = resp.url;
        this.placementOverView.patchValue({
          background: this.imageURL
        });
      });
  }

  removeHTMLTags(str) {
    if ((str === null) || (str === '')){
      return '';
    } else {
      str = str.replace(/<[^>]*>/g, '');
      str = str.replace(/&nbsp;/g, ' ');
      str.trim();
    }
    return str;
  }

  staffList() {
    this.staffIds = [];
    this.placementGroupDetails.staff.forEach(staff => {
      this.staffIds.push(staff.staff_id);
    });
    this.staffIds = [...this.staffIds];
    console.log(" this.staffIds",  this.staffIds)
    this.staffControl.setValue(this.staffIds);
  }

  onUpdateStaffMember() {
   
    this.staffIds =  this.staffControl.value;
    let payload = this.preparePayload();
    console.log(payload, "payload");
    payload['is_update'] = true;
    // return false;
    this.service.editPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({message: response.msg})
        this.staffControl.setValue(this.staffIds);
        this.getPlacementOverviewDetailsStaff();
      }
    })
  }

  preparePayload() {
    let payload = {...this.placementOverView.value, placement_id: this.id, staff_id: this.staffIds.length > 0 ? this.staffIds : null}; 
    payload.start_date = this.placementGroupDetails.start_date ? Utils.convertDate(this.placementGroupDetails.start_date, 'YYYY-MM-DD') : null;
    payload.end_date = this.placementGroupDetails.end_date ? Utils.convertDate(this.placementGroupDetails.end_date, 'YYYY-MM-DD') : null;
    return payload;
  }

  onCancelUnpublishPlacementGroup() {
    this.proceedFlow = null;
    this.password = null;
  }

  checkPassword() {
     console.log("this.password", this.password)
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      email_id: userDetail?.email,
      password: this.password
    }
    return this.service.confirmPassword(payload).toPromise().catch((error) => {
      this.service.showMessage({message: error?.error?.errors?.msg});
    });
  }

  async unpublishPlacementGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== 'success') {
      return true;
    }
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      placement_id: this.id,
      password: this.password,
      is_publish: false,
      allow_students_join_program:false,
      deadline:'',
      publish_by_name: userDetail?.first_name +' '+ userDetail?.last_name,
      allow_auto_internship_end_date: false,
      internship_end_day: 0,
      internship_end_date_type: '',
    }
    this.service.editPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.proceedFlow = null;
        this.password = null;
        this.getPlacementOverviewDetails();
        this.filterParameters = this.filterParameters;
        this.closePasswordModal.ripple.trigger.click();
        document.getElementById('unpublishedPopup')?.click();
        this.service.showMessage({message: response.msg});
      }
    })
  }

  getEmailCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => { 
      this.categories = response.data;
    });
  }

  selectCategory(event) {
    const payload = {
      category_id: event
    }
    this.service.getEmailTemplateByCategoryId(payload).subscribe((response: any) => { 
      this.emailTemplateList = response.result;
    });
  }
  selectTemplate(event) {
    const foundTemplate = this.emailTemplateList.find(template => template._id === event);
    if (foundTemplate) {
      this.publishPlacementGroup.patchValue({
        subject: foundTemplate?.subject,
        message:foundTemplate?.widgets?.html,
      });
    }
  }
  getPlacementTypes() {
    let payload = {placement_id: this.id}
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result;
      } else {
      }
    })
  }

  onChangePublishOn(event:any) {
    this.publishPlacement.publishedOn = event.value;
    this.minDate = new Date();
    if (this.publishPlacement.publishedOn === 'Publish Instantly') {
      this.minDate = new Date();
      //  this.publishPlacementGroup.patchValue({
      //   publish_on: 'Publish Instantly'
      // })
      setTimeout(() => {
          this.publishPlacementGroup.patchValue({
            publish_on: 'Publish Instantly'
          });
        }, 0);
    } else {
      this.publishPlacementGroup.patchValue({
        publish_time: '08:00 AM'
      })
    }
  }

  onScheuleDateRangeStart(event) {
    this.minDate = event.value;
  }
  
  onScheuleDateRangeEnd(event) {
    this.maxDate = event.value;
  }

  
  onChangeAdditionalEmail(event) {
    this.publishPlacement.additionalEmailOnPublication = event.value == 'true' ? true : false;
  }
  
  cancelPublishPlacementForm() {
    this.publishPlacementGroup.reset();
    this.formConteroller()
  }

  checkValidation() {
    if (!this.publishPlacementGroup.valid) {
      this.publishPlacementGroup.markAllAsTouched();
      this.showModalBox = false;
    } else {
      this.showModalBox = true;
      this.publishPlacementGroupFormValues = this.publishPlacementGroup.value;
      this.closePublishModal.ripple.trigger.click();
    }
    this.password = "";
  }
  
  async onPublishPlacementGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== 'success') {
      return true;
    }
    if (this.confirmPassword.valid) {
      const userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let payload = {
        placement_id: this.id,
        publish_on: this.publishPlacementGroupFormValues?.publish_on,
        start_date: this.publishPlacement.publishedOn == 'Publish Instantly' ? Utils.convertDate(new Date(), 'YYYY/MM/DD') : this.publishPlacementGroupFormValues?.start_date ? Utils.convertDate(new Date(this.publishPlacementGroupFormValues?.start_date), 'YYYY/MM/DD') : undefined,
        end_date: this.publishPlacementGroupFormValues?.end_date ? Utils.convertDate(new Date(this.publishPlacementGroupFormValues?.end_date), 'YYYY/MM/DD') : undefined,
        description: this.publishPlacementGroupFormValues?.description,
        placement_type: this.publishPlacementGroupFormValues?.placement_type,
        is_email: this.publishPlacementGroupFormValues?.is_email == 'true' ? true : false,
        allow_students_join_program:this.publishPlacementGroupFormValues?.allow_students_join_program == 'true' ? true : false,
        deadline:this.publishPlacementGroupFormValues?.deadline ? Utils.convertDate(new Date(this.publishPlacementGroupFormValues?.deadline), 'YYYY/MM/DD') : undefined,
        publish_by_name: userDetail?.first_name +' '+ userDetail?.last_name,

        allow_auto_internship_end_date: this.publishPlacementGroupFormValues?.allow_auto_internship_end_date == 'true' ? true : false,
        internship_end_day:this.publishPlacementGroupFormValues?.internship_end_day,
        internship_end_date_type: this.publishPlacementGroupFormValues?.internship_end_date_type
      }
      if (payload.is_email) {
        payload['category'] = this.publishPlacementGroupFormValues?.category;
        payload['template'] = this.publishPlacementGroupFormValues?.template;
        payload['subject'] = this.publishPlacementGroupFormValues?.subject;
        payload['message'] = this.publishPlacementGroupFormValues?.message;
      }
      if (payload.publish_on == 'Schedule Date') {
        payload['publish_time'] = this.publishPlacementGroupFormValues?.publish_time;
      }
      
      payload['type'] = 'internship';
      this.service.publishPlacementGroup(payload).subscribe((response: any) => {
        this.closeConfirmPasswordModal.ripple.trigger.click();
        if(response.status==401){
          document.getElementById("publishedDoneErrorDone")?.click();
          return false;
        }
        document.getElementById('publishedDonePopup')?.click();
        this.confirmPassword.reset();
        this.password = null;
         this.filterParameters = this.filterParameters;
        this.getPlacementOverviewDetails();
      })
    } else {
      this.confirmPassword.markAllAsTouched();
    }
  }

  onCancelPublishPlacementGroup() {
    this.password = null;
    this.publishPlacementGroup.reset();
     this.formConteroller()
  }
  
  onCancelPassword() {
    this.confirmPassword.reset();
     this.formConteroller()
  }

  archiveGroup() {
    this.password = null;
    if (this.placementGroupDetails?.is_publish) {
      document.getElementById('archivedPopup')?.click();
      return;
    } else {
      document.getElementById('archiveConfirmPassword')?.click();
      return;
    }
  }

  async archivePlacementGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== 'success') {
      return true;
    }
    if (this.confirmPassword.valid) {
      const payload = {
        placement_id: this.id,
        status: 'archived'
      }
      this.service.editPlacementGroup(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.closePasswordModal.ripple.trigger.click();
          this.getPlacementOverviewDetails();
          this.service.showMessage({message: "Placement group archived successfully"});
          document.getElementById('archivedDonePopup')?.click();
        }
      });
    } else {
      this.confirmPassword.markAllAsTouched();
    }
  }

  getLastModifiedInitial() {
    if(this.placementGroupDetails?.created_by){
        let lastModified = this.placementGroupDetails?.created_by.split(' ');
        return `${lastModified[0][0]} ${lastModified[1][0]}`
    }else{
      return '';
    }
  }

  checkInvalidFieldPassrordForm(field: string): boolean {
  return (
    this.confirmPassword?.get(field)?.invalid &&
    (this.confirmPassword.get(field)?.dirty || this.confirmPassword.get(field)?.touched)
  ) ?? false;
}

  get filteredParametes() {
    if (!this.selectedParameters) {
      return this.filters;
    }

    return this.filters.filter(company =>
      company.name.toLowerCase().includes(this.selectedParameters.toLowerCase())
    );
  }
  selectedParameters:any="";
  // activeFilter:any =  'placementGroups';
  filters = [
    // { name: 'Placement Groups', field: 'placementGroups', selected: false },
    { name: 'Major', field: 'major', selected: false },
    { name: 'Minor', field: 'minor', selected: false },
    { name: 'Location', field: 'post_code', selected: false },
    { name: 'Graduation date', field: 'graduation_date', selected: false },
    { name: 'WAM', field: 'gpa', selected: false },
    { name: 'Campus', field: 'campus', selected: false },
    { name: 'Year', field: 'year', selected: false },
    { name: 'Course code', field: 'course_code', selected: false },
    { name: 'Degree Level', field: 'degree_level', selected: false },
    { name: 'Work Rights', field: 'work_authorization', selected: false },
    { name: 'Nationality', field: 'nationality', selected: false },
    { name: 'Course Name', field: 'course_name', selected: false },
    { name: 'Advocate Incident History', field: 'advocate_incident_history', selected: false },
    { name: 'Advocate Care History', field: 'advocate_care_history', selected: false },
    { name: 'Accessibility', field: 'accommodate_accessibility', selected: false },
    { name: 'Credit Point', field: 'credit_points', selected: false },
    { name: 'Unit Name', field: 'unit_name', selected: false },
    { name: 'Unit Code', field: 'unit_code', selected: false },
    { name: 'Delivery Mode', field: 'delivery_mode', selected: false },
    // { name: 'Priority', field: 'priority', selected: false },
    // { name: 'Status', field: 'status', selected: false },
    // { name: 'Assigned To', field: 'assigned_to', selected: false },
   
    // { name: 'Cohort start date', field: 'cohort_start_date', selected: false },
    // { name: 'Cohort end date', field: 'cohort_end_date', selected: false },
    
    
   
    // { name: 'internship start date', field: 'internship_start_date', selected: false },
    // { name: 'internship end date', field: 'internship_end_date', selected: false },
    // { name: 'Alumni', field: 'alumni', selected: false },
    
    // { name: 'Placement Type', field: 'placementType', selected: false },
    
    
   
  ];



  studentFilters:any = [];
  studentFilterOptions() {
    this.service.studentFilterOptions().subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.studentFilters = response.result;
        // console.log("this.studentFilters", this.studentFilters);
      }
    })
  }

getValue(key: string, value: any): string {
  // Handle arrays
  if (Array.isArray(value)) {
    return this.mapIds(key, value);
  }

  // Handle comma-separated string IDs
  if (typeof value === 'string' && value.includes(',')) {
    const ids = value.split(',').map(v => v.trim());
    return this.mapIds(key, ids);
  }

  // Handle single string IDs
  if (typeof value === 'string') {
    return this.mapIds(key, [value]);
  }

  // Fallback
  return value;
}

private mapIds(key: string, ids: string[]): string {
  if (key === 'assigned_to') {
    return ids.map(id => this.getAssignedToName(id)).join(', ');
  }
  if (key === 'placementGroups') {
    return ids.map(id => this.getPlacementGroupTitle(id)).join(', ');
  }
  return ids.join(', ');
}

getAssignedToName(id: string): string {
  const assigned = this.studentFilters?.assignedTo?.find(a => a._id === id);
  return assigned ? `${assigned.first_name} ${assigned.last_name}`.trim() || "Unknown" : id;
}

getPlacementGroupTitle(id: string): string {
  const group = this.studentFilters?.placementGroups?.find(pg => pg._id === id);
  return group ? group.title : id;
}
  

  applyFilter(filter) {
    this.activeFilter = filter.field=="state"?"post_code":filter.field;
  }


  onSaveApply(){
    console.log("this.filters", this.filters);
    console.log("this.filterParameters", this.filterParameters)
    const payload = {
        placement_id: this.id,
        eligible_criteria:this.filterParameters,
        show_eligible_criteria:this.checked
    }
    this.service.editPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.overviewEditForm = false;
        this.getPlacementOverviewDetails();
      }
    });  
  
  }

  editPG(){
      const payload = {
          placement_id: this.id,
          show_eligible_criteria:this.checked
      }
      this.service.editPlacementGroup(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.overviewEditForm = false;
          this.getPlacementOverviewDetails();
        }
      });
  }

  previewFilter(data) {
   this.filters.map((option)=>{
      option.selected = false;
     })
     this.filterParameters = {
      placementGroups: [],
      major: [],
      priority: [],
      campus: [],
      status: [],
      post_code: [],
      area: [],
      monthly_cohort: [],
      resume_level: [],
      placement_doc_received: [],
      course_code: [],
      placementType: [],
      monthly_cohort_sdate: null,
      monthly_cohort_edate: null,
      course_start_sdate: null,
      course_start_edate: null,
      course_end_sdate: null,
      course_end_edate: null,
      internship_start_sdate: null,
      internship_start_edate: null
      ,internship_end_sdate: null,
      internship_end_edate: null,
      cohort_start_sdate: null,
      cohort_start_edate: null,
      cohort_end_sdate: null,
      cohort_end_edate: null,
      graduation_sdate: null,
      graduation_edate: null,
      credit_min_points:null,
      credit_max_points:null,
      gpa_min_points:null,
      gpa_max_points:null
    }
  this.filterParameters = data;
  
  // this.selectedFilter?.filters;
  // this.showSavedFilter = false;

  

  // Set activeFilter based on preferred order
  const orderedFields = [
    'placementGroups',
    'major',
    'priority',
    'campus',
    'status',
    'post_code',
    'area',
    'monthly_cohort',
    'resume_level',
    'placement_doc_received',
    'course_code',
    'placementType',
    'monthly_cohort_sdate',
    'monthly_cohort_edate',
    'course_start_sdate',
    'course_start_edate',
    'course_end_sdate',
    'course_end_edate',
    'internship_start_sdate',
    'internship_start_edate',
    'internship_end_sdate',
    'internship_end_edate',
    'cohort_start_sdate',
    'cohort_start_edate',
    'cohort_end_sdate',
    'cohort_end_edate',
    'graduation_sdate',
    'graduation_edate',
    'credit_min_points',
    'credit_max_points',
    'gpa_min_points',
    'gpa_max_points'
  ];

  for (const field of orderedFields) {
    const val = this.filterParameters[field];
    if ((Array.isArray(val) && val.length > 0) ||
        (typeof val === 'string' && val.trim() !== '') ||
        (typeof val === 'number' && val !== null && val !== undefined)) {
      this.activeFilter = field;
      break;
    }
  }

  // Update filters with selected state
  this.filters = this.filters.map((option) => {
    const val = this.filterParameters[option.field];

    switch (option.field) {
      case 'course_start_date':
        if (this.filterParameters.course_start_sdate || this.filterParameters.course_start_edate) {
          option.selected = true;
          // this.activeFilter = 'course_start_date';
        }
        break;

      case 'course_end_date':
        if (this.filterParameters.course_end_sdate || this.filterParameters.course_end_edate) {
          option.selected = true;
          // this.activeFilter = 'course_end_date';
        }
        break;

      case 'internship_start_date':
        if (this.filterParameters.internship_start_sdate || this.filterParameters.internship_start_edate) {
          option.selected = true;
          // this.activeFilter = 'internship_start_date';
        }
        break;

      case 'internship_end_date':
        if (this.filterParameters.internship_end_sdate || this.filterParameters.internship_end_edate) {
          option.selected = true;
          // this.activeFilter = 'internship_end_date';
        }
        break;

      case 'cohort_start_date':
        if (this.filterParameters.cohort_start_sdate || this.filterParameters.cohort_start_edate) {
          option.selected = true;
          this.activeFilter = 'cohort_start_date';
        }
        break;

      case 'cohort_end_date':
        if (this.filterParameters.cohort_end_sdate || this.filterParameters.cohort_end_edate) {
          option.selected = true;
          this.activeFilter = 'cohort_end_date';
        }
        break;

      case 'graduation_date':
        if (this.filterParameters.graduation_sdate || this.filterParameters.graduation_edate) {
          option.selected = true;
          this.activeFilter = 'graduation_date';
        }
        break;

      case 'credit_points':
        if (this.filterParameters.credit_min_points || this.filterParameters.credit_max_points) {
          option.selected = true;
          this.activeFilter = 'credit_points';
        }
        break;

      case 'gpa':
        if (this.filterParameters.gpa_min_points || this.filterParameters.gpa_max_points) {
          option.selected = true;
          this.activeFilter = 'gpa';
        }
        break;

      case 'state':
        if (this.filterParameters['state'] || this.filterParameters['suburb']) {
          option.selected = true;
          this.activeFilter = 'post_code';
        }
        break;
    }

    // Fallback selection logic
    return {
      ...option,
      selected: option.selected || (
        Array.isArray(val) ? val.length > 0 :
        typeof val === 'string' ? val.trim() !== '' :
        typeof val === 'number' ? true :
        val !== null && val !== undefined
      )
    };
  });


  // Bootstrap tab switch
  const parametersTabTrigger = document.querySelector('a[href="#parameters"]');
  if (parametersTabTrigger) {
    const tab = new (window as any).bootstrap.Tab(parametersTabTrigger);
    tab.show();
  }
}
  updateFilter() {
    console.log("this.placementGroupDetails", this.placementGroupDetails)
    const criteria = this.placementGroupDetails?.eligible_criteria;
    console.log("criteria", criteria)
    // Exit if eligible_criteria is null, undefined, or empty
    if (!criteria || Object.keys(criteria).length === 0) {
      return false;
    }

    // Reset all filters
    this.filters.forEach(option => option.selected = false);

    // Initialize filterParameters with defaults
    this.filterParameters = {
      major: [],
      priority: [],
      campus: [],
      status: [],
      post_code: [],
      suburb: [],
      area: [],
      monthly_cohort: [],
      resume_level: [],
      location: [],
      placement_doc_received: [],
      course_code: [],
      placementType: [],
      monthly_cohort_sdate: null,
      monthly_cohort_edate: null,
      course_start_sdate: null,
      course_start_edate: null,
      course_end_sdate: null,
      course_end_edate: null,
      internship_start_sdate: null,
      internship_start_edate: null,
      internship_end_sdate: null,
      internship_end_edate: null,
      cohort_start_sdate: null,
      cohort_start_edate: null,
      cohort_end_sdate: null,
      cohort_end_edate: null,
      graduation_sdate: null,
      graduation_edate: null,
      credit_min_points: null,
      credit_max_points: null,
      gpa_min_points: null,
      gpa_max_points: null,
      state: []
    };

    // Overwrite with actual eligible_criteria
    this.filterParameters = { ...this.filterParameters, ...criteria };

    // Default activeFilter
    this.activeFilter = 'major';


    // Update filters based on values
    // this.filters.forEach(option => {
    //   const val = this.filterParameters[option.field];
    //   switch (option.field) {
    //     // Date ranges
    //     case 'course_start_date':
    //       if (this.filterParameters.course_start_sdate || this.filterParameters.course_start_edate) {
    //         option.selected = true;
    //       }
    //       break;

    //     case 'course_end_date':
    //       if (this.filterParameters.course_end_sdate || this.filterParameters.course_end_edate) {
    //         option.selected = true;
    //       }
    //       break;

    //     case 'internship_start_date':
    //       if (this.filterParameters.internship_start_sdate || this.filterParameters.internship_start_edate) {
    //         option.selected = true;
    //       }
    //       break;

    //     case 'internship_end_date':
    //       if (this.filterParameters.internship_end_sdate || this.filterParameters.internship_end_edate) {
    //         option.selected = true;
    //       }
    //       break;

    //     case 'cohort_start_date':
    //       if (this.filterParameters.cohort_start_sdate || this.filterParameters.cohort_start_edate) {
    //         option.selected = true;
    //         this.activeFilter = 'cohort_start_date';
    //       }
    //       break;

    //     case 'cohort_end_date':
    //       if (this.filterParameters.cohort_end_sdate || this.filterParameters.cohort_end_edate) {
    //         option.selected = true;
    //         this.activeFilter = 'cohort_end_date';
    //       }
    //       break;

    //     case 'graduation_date':
    //       if (this.filterParameters.graduation_sdate || this.filterParameters.graduation_edate) {
    //         option.selected = true;
    //         this.activeFilter = 'graduation_date';
    //       }
    //       break;

    //     // Numeric ranges
    //     case 'credit_points':
    //       if (this.filterParameters.credit_min_points || this.filterParameters.credit_max_points) {
    //         option.selected = true;
    //         this.activeFilter = 'credit_points';
    //       }
    //       break;

    //     case 'gpa':
    //       if (this.filterParameters.gpa_min_points || this.filterParameters.gpa_max_points) {
    //         option.selected = true;
    //         this.activeFilter = 'gpa';
    //       }
    //       break;

    //     // Location fields
    //    case "Location":
    //        const stateVal = this.filterParameters.state || [];
    //       const suburbVal = this.filterParameters.suburb || [];
    //       const postCodeVal = this.filterParameters.post_code || [];
          
    //       if ((Array.isArray(stateVal) && stateVal.length > 0) ||
    //           (Array.isArray(suburbVal) && suburbVal.length > 0) ||
    //           (Array.isArray(postCodeVal) && postCodeVal.length > 0)) {
    //         option.selected = true;
    //         this.activeFilter = 'post_code';
    //       }
    //       break;

    //     case "post_code":
    //       const stateVal1 = this.filterParameters.state || [];
    //     const suburbVal1 = this.filterParameters.suburb || [];
    //     const postCodeVal1 = this.filterParameters.post_code || [];
        
    //     if ((Array.isArray(stateVal1) && stateVal1.length > 0) ||
    //         (Array.isArray(suburbVal1) && suburbVal1.length > 0) ||
    //         (Array.isArray(postCodeVal1) && postCodeVal1.length > 0)) {
    //       option.selected = true;
    //       this.activeFilter = 'post_code';
    //     }
    //     break;
  
    //   }


    //   // Fallback: check arrays, strings, numbers, or non-null
    //   option.selected = option.selected || (
    //     Array.isArray(val) ? val.length > 0 :
    //     typeof val === 'string' ? val.trim() !== '' :
    //     typeof val === 'number' ? true :
    //     val !== null && val !== undefined
    //   );
    // });
    this.filters.forEach(option => {
  let selected = false;
  const val = this.filterParameters[option.field];

  switch (option.field) {

    case 'course_start_date':
      selected = !!(
        this.filterParameters.course_start_sdate ||
        this.filterParameters.course_start_edate
      );
      break;

    case 'course_end_date':
      selected = !!(
        this.filterParameters.course_end_sdate ||
        this.filterParameters.course_end_edate
      );
      break;

    case 'internship_start_date':
      selected = !!(
        this.filterParameters.internship_start_sdate ||
        this.filterParameters.internship_start_edate
      );
      break;

    case 'internship_end_date':
      selected = !!(
        this.filterParameters.internship_end_sdate ||
        this.filterParameters.internship_end_edate
      );
      break;

    case 'cohort_start_date':
      selected = !!(
        this.filterParameters.cohort_start_sdate ||
        this.filterParameters.cohort_start_edate
      );
      if (selected) this.activeFilter = 'cohort_start_date';
      break;

    case 'cohort_end_date':
      selected = !!(
        this.filterParameters.cohort_end_sdate ||
        this.filterParameters.cohort_end_edate
      );
      if (selected) this.activeFilter = 'cohort_end_date';
      break;

    case 'graduation_date':
      selected = !!(
        this.filterParameters.graduation_sdate ||
        this.filterParameters.graduation_edate
      );
      if (selected) this.activeFilter = 'graduation_date';
      break;

    case 'credit_points':
      selected = (
        this.filterParameters.credit_min_points !== null ||
        this.filterParameters.credit_max_points !== null
      );
      if (selected) this.activeFilter = 'credit_points';
      break;

    case 'gpa':
      selected = (
        this.filterParameters.gpa_min_points !== null ||
        this.filterParameters.gpa_max_points !== null
      );
      if (selected) this.activeFilter = 'gpa';
      break;

    case 'post_code':
    case 'Location':
      selected =
        (this.filterParameters.state?.length ?? 0) > 0 ||
        (this.filterParameters.suburb?.length ?? 0) > 0 ||
        (this.filterParameters.post_code?.length ?? 0) > 0;

      if (selected) this.activeFilter = 'post_code';
      break;

    default:
      selected = Array.isArray(val)
        ? val.length > 0
        : typeof val === 'string'
        ? val.trim() !== ''
        : val !== null && val !== undefined;
  }

  option.selected = selected;
});

  }


 onCheckboxChange(event: MatCheckboxChange, filter): void {
    // console.log('Checkbox changed:', event.checked);
    // console.log('this.filters:', this.filters, 'this.filterParameters:', this.filterParameters, 'filter:', filter);
  
    filter.selected = event.checked;

    if (event.checked) {
      // console.log('Checkbox is selected');
      // Add logic for when the checkbox is selected, if needed.
    } else {
      // console.log('Checkbox is deselected');
      this.filters.forEach((el) => {
        if (filter.field === el.field) {
          this.filterParameters[filter.field] = []; // Corrected 'field' to 'filter.field'
        }
        if(filter.field === 'post_code'){
          this.filterParameters.post_code = []
          this.filterParameters.state = []
          this.filterParameters.suburb = []
        }
        if(filter.field === 'course_start_date'){
          this.filterParameters.course_start_sdate = null
          this.filterParameters.course_start_edate = null
        }
        if(filter.field === 'course_end_date'){
          this.filterParameters.course_end_sdate = null
          this.filterParameters.course_end_edate = null
        }
        if(filter.field === 'internship_start_date'){
          this.filterParameters.internship_start_sdate = null
          this.filterParameters.internship_start_edate = null
        }
        if(filter.field === 'internship_end_date'){
          this.filterParameters.internship_end_sdate = null
          this.filterParameters.internship_end_edate = null
        }

        if(el.field === 'gpa'){
          this.filterParameters.gpa_min_points = null
          this.filterParameters.gpa_max_points = null
        }

        if(el.field === 'credit_points'){
          this.filterParameters.credit_max_points = null
          this.filterParameters.credit_min_points = null
        }

        if(filter.field === 'cohort_end_date'){
          this.filterParameters.cohort_end_sdate = null
          this.filterParameters.cohort_end_edate = null
        }
        if(filter.field === 'cohort_start_date'){
          this.filterParameters.cohort_start_sdate = null
          this.filterParameters.cohort_start_edate = null
        }if(filter.field === 'graduation_date'){
          this.filterParameters.graduation_sdate = null
          this.filterParameters.graduation_edate = null
        }
      });
    }
  }
  show_program_to_eligible_students:any ;
  onToggleChange(checkeck){
    console.log("checkeck",checkeck, this.checked);

    if(this.checked){
        const payload = {
            placement_id: this.id,
            // eligible_criteria:this.filterParameters,
            allow_students_join_program:this.checked
        }
        this.service.editPlacementGroup(payload).subscribe((response: any) => {
          if (response.status == HttpResponseCode.SUCCESS) {
            this.overviewEditForm = false;
            this.getPlacementOverviewDetails();
          }
        });
    }else{
        const payload = {
          placement_id: this.id,
          // eligible_criteria:this.filterParameters,
          allow_students_join_program:this.checked
      }
      this.service.editPlacementGroup(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.overviewEditForm = false;
          this.getPlacementOverviewDetails();
        }
      });
    }
  }
}
