import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {HttpResponseCode} from '../../../shared/enum';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import { Utils } from '../../../shared/utility';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { FileIconService } from '../../../shared/file-icon.service';

@Component({
  selector: 'app-placement-workflow-create-task',
  templateUrl: './placement-workflow-create-task.component.html',
  styleUrls: ['./placement-workflow-create-task.component.scss']
})
export class PlacementWorkflowCreateTaskComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  placementId: any;
  showCollapes: any = '';
  selectedCompletionCriteria: string;
  createTaskIgnoreValidationFor = [
    'widget',
    'notification_completion_custom_message',
    'notification_completion_send_email',
    'notification_followUp_deadline',
    'notification_followUp_condition',
    'notification_followUp_condition_days',
    'notification_followUp_time_trigger',
    'notification_followUp_send_email',
    'notification_followUp_email_category',
    'notification_followUp_email_template',
    'notification_followUp_send_text_message',
    'notification_followUp_text_message',
    'notification_followUp_voice_mail',
    'notification_followUp_voice_mail_text_message',
    'required_activity'
  ]
  completionCriteria = {
    sendEmail : 'Send Email',
    submitWorkingHours :'Submit Working Hours',
    submitForm : 'Submit a Form',
    attendAppointment: 'Attend Appointment',
    attendEvent: 'Attend Event',
    getDocumentApproved: 'Get Document Approval',
    getWatchVideo: 'Watch Video',
    getStaffAttachesDocuments: 'Staff Attaches Documents for Student Review',
    getStudentUploadsDocument:'Student Uploads Document',
    getStudentUploadsVideo:'Submit Video (Upload URL)'
  }
  createTaskPayload = [
    {
      completionCriteria: 'Send Email',
      formElement : {
        name: null,
        completion_criteria: null,
        unlock_task_on: null,
        set_days: null,
        category: null,
        template: null,
        widget: null,
        email_date: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
      }
    },
    {
      completionCriteria: 'Submit Working Hours',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        time_periods: null,
        // deadline: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: 'Submit a Form',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        category: null,
        select_form: null,
        select_staff: null,
        set_days: null,
        additional_criteria: null,
        deadline: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: 'Attend Appointment',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        additional_criteria: null,
        // deadline: null,
        appointment_url:null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: 'Attend Event',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        event_date: null,
        event_time: null,
        deadline: null,
        event_url:null,
        additional_criteria: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: 'Get Document Approval',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        set_days: null,
        document_types: null,
        set_days_validity:null,
        set_days_type_validity:null,
        show_validity: false,
        select_staff: null,
        additional_criteria: null,
        deadline: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: 'Watch Video',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        category: null,
        select_form: null,
        select_staff: null,
        set_days: null,
        additional_criteria: null,
        deadline: null,
        video_url: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: 'Staff Attaches Documents for Student Review',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        category: null,
        select_form: null,
        select_staff: null,
        set_days: null,
        additional_criteria: null,
        deadline: null,
        video_url: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: "Student Uploads Document",
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        category: null,
        select_form: null,
        select_staff: null,
        set_days: null,
        additional_criteria: null,
        deadline: null,
        video_url: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
    {
      completionCriteria: 'Submit Video (Upload URL)',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        category: null,
        select_form: null,
        select_staff: null,
        set_days: null,
        additional_criteria: null,
        deadline: null,
        video_url: null,
        notification_completion_custom_message: null,
        notification_completion_custom_text_message: null,
        notification_completion_send_email: null,
        notification_completion_email_category: null,
        notification_completion_email_template: null,
        notification_followUp_deadline: null,
        notification_followUp_condition: null,
        notification_followUp_condition_days: null,
        notification_followUp_time_trigger: null,
        notification_followUp_send_email: null,
        notification_followUp_email_category: null,
        notification_followUp_email_template: null,
        notification_followUp_send_text_message: null,
        notification_followUp_text_message: null,
        notification_followUp_voice_mail: null,
        notification_followUp_voice_mail_text_message: null
      }
    },
  ] 
  completionCriteriaList = [];
  unlockTaskOnList = [];
  additionalCriteriaList = [];
  documentTypes = [
    {name: "Resume"},
    {name: "Cover Letter"},
    {name: "Payslips"},
    {name: "Offer Letter"},
    {name: "Visa"},
    {name: "Passport"},
    {name: "Driver's License"},

    { name: 'National Police Check' },
    { name: 'Working with Children Check' },
    { name: 'NDIS Worker Screening Check' },
    { name: 'Manual Handling Certificate' },
    { name: 'CPR Certificate' },
    { name: 'First Aid Certificate' },
    { name: 'Hand Hygiene Certificate' },
    { name: 'Aged Care Statutory Declaration' },
    { name: 'COVID-19 Placement Declaration Form' },
    { name: 'Immunisation Record' },


    {name: "Others"},
  ];
  formList = [];
  createTask: FormGroup;
  taskId: string;
  stepId: string;
  workflowTypeId: string;
  stage: string;
  emailTemplates = [];
  selectedEmailTemplate:any = {};
  taskInformationEmailWidget: any;
  widget:any;
  followupEmailWidget: any;
  buttonText: string = 'Create Task';
  categories = [];
  displayCustomMessageTextArea: boolean = false;
  displayNotificationCompletionSendEmail: boolean = false;
  constructor(
    private service: TopgradserviceService,
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private sanitizer: DomSanitizer,
    private location: Location, private fileIconService : FileIconService
    ) { }

  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }


  collapsToggle(ids:any) {
    if(this.showCollapes == ids) {
      this.showCollapes = '';
    } else {
      this.showCollapes = ids
    }
  }
  Projecttype:any = 'internship';


  staffMembers:any = [];

  getStaffMembers() {
    this.service.getStaffMemberByPlacementId({placement_id:this.placementId}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffMembers = response.result;
        console.log(this.staffMembers, "this.staffMembers");
      }
    })
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.placementId = params.get('placement_id'); 
    });
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.taskId = params.get('taskId');
      this.stepId = params.get('stepId');
      this.workflowTypeId = params.get('workflowTypeId');
      this.stage = params.get('stage');
      this.Projecttype = params.get('type');

         this.getCompletionCriteria();
    this.getUnlockTaskOn();
    this.getForm();
    // this.getEmailTemplate();
    this.getEmailCategories();
    });
    this.createTask = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      completion_criteria: new FormControl(null, [Validators.required]),
      unlock_task_on: new FormControl(null,  [Validators.required]),
      category: new FormControl(null),
      email_date: new FormControl(null),
      template: new FormControl(null),
      widget: new FormControl(null),
      description: new FormControl(null),
      document_types: new FormControl(null),
      set_days_validity:new FormControl(null),
        set_days_type_validity:new FormControl(null),
      show_validity: new FormControl(false),
      required_activity: new FormControl(null),
      time_periods: new FormControl(null),
      lock_next_task: new FormControl(null),
      additional_criteria: new FormControl(null),
      deadline: new FormControl(null),
      select_form: new FormControl(null),
      select_staff: new FormControl(null),
      event_date: new FormControl(null),
      event_time: new FormControl(null),
      set_days: new FormControl(null),
      video_url: new FormControl(null),
      appointment_url: new FormControl(null),
      event_url:new FormControl(null),
      notification_completion_custom_message: new FormControl(null),
      notification_completion_custom_text_message: new FormControl(null),
      notification_completion_send_email: new FormControl(null),
      notification_completion_email_category: new FormControl(null),
      notification_completion_email_template: new FormControl(null),
      notification_followUp_deadline: new FormControl(null),
      notification_followUp_condition: new FormControl(null),
      notification_followUp_condition_days: new FormControl(null),
      notification_followUp_time_trigger: new FormControl(null),
      notification_followUp_send_email: new FormControl(null),
      notification_followUp_email_category: new FormControl(null),
      notification_followUp_email_template: new FormControl(null),
      notification_followUp_send_text_message: new FormControl(null), 
      notification_followUp_text_message: new FormControl(null),
      notification_followUp_voice_mail: new FormControl(null),
      notification_followUp_voice_mail_text_message: new FormControl(null)

    });
    this.buttonText = 'Create Task';
    if (this.taskId) {
      this.buttonText = 'Update Task';
      this.getTaskDetail();
    }
    this.getCompletionCriteria();
    this.getUnlockTaskOn();
    this.getForm();
     this.getStaffMembers();
    // this.getEmailTemplate();
    this.getEmailCategories();
  }

  getCustomFormBySubmitter(event) {
    const payload = {
      submiters: event
    }
    this.service.getFormById(payload).subscribe((response: any) => {
        this.formList = response.data;        
        this.formList = this.formList.filter(form => form.status !== 'pause');
    })
  }

 

  onChangeCompletionCriteria(event) {
    console.log("event", event)
    this.selectedCompletionCriteria = event;
    this.createTask.get('required_activity').setValue(true);
    this.createTask.get('notification_completion_send_email').setValue(false);
    this.createTask.get('notification_completion_custom_message').setValue(false);
    this.displayCustomMessageTextArea = false;
    this.displayNotificationCompletionSendEmail = false;
    const completionCriteriaType = this.createTaskPayload.find(criteria => criteria.completionCriteria === this.selectedCompletionCriteria);
    this.clearFormFields();
    this.getAdditionalCriteria(this.selectedCompletionCriteria);
    this.getUnlockTaskOn();
    this.getStaffMembers();
    // for (const key of Object.keys(this.createTask.controls)) {
    //   if (completionCriteriaType.formElement.hasOwnProperty(key)) {
    //     this.createTask.controls[key].setValidators(Validators.required);
    //   } 
    // }

    if (this.selectedCompletionCriteria === 'Send Email' || this.selectedCompletionCriteria === 'Attend Event' || this.selectedCompletionCriteria === 'Staff Attaches Documents for Student Review' || this.selectedCompletionCriteria === 'Student Uploads Document') {
      this.createTask.get('additional_criteria').clearValidators();
      this.createTask.get('additional_criteria').updateValueAndValidity();
    }
    // else if(this.selectedCompletionCriteria === 'Send Email'){
    //     this.createTask.get('additional_criteria').setValidators([Validators.required]);
    //     this.createTask.get('additional_criteria').updateValueAndValidity();
    // } 
    else {
      // this.getStaffMembers();
      this.createTask.get('additional_criteria').setValidators([Validators.required]);
      this.createTask.get('additional_criteria').updateValueAndValidity();
    }
   }

  getCompletionCriteria() {
    this.service.getCompletionCriteria({type:this.Projecttype}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.completionCriteriaList = response.result;
      }
    })
  }

  getUnlockTaskOn() {
    this.service.getUnlockTaskOn({type:this.Projecttype}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.unlockTaskOnList = response.result;

        console.log("this.unlockTaskOnList", this.unlockTaskOnList);
      }else{
        this.unlockTaskOnList = [];
      }
    },(err)=>{
       this.unlockTaskOnList = [];
    })
  }

  getAdditionalCriteria(completionCriteria) {
    let payload = {completion_criteria: completionCriteria};
    this.service.getAdditionalCriteria(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.additionalCriteriaList = response.result;
      }else{
         this.additionalCriteriaList = [];
      }
    },(err)=>{
       this.additionalCriteriaList = [];
    })
  }

  getForm()  {
    this.service.getForm({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.formList = response.result;
        this.formList = this.formList.filter(form => form.status !== 'pause');
      }
    })
  }

  onCancelCreateTask() {
    this.createTask.reset();
  }

  onCreateTask() {
    if (this.createTask.invalid) {
      this.createTask.markAllAsTouched();
      return;
    }

    console.log(" this.createTask.value",  this.createTask.value,);
    // sudarshan
    let URL= "";
    if(this.Projecttype=="project"){
      URL = `/admin/wil/placement-groups/project/${this.placementId}`;
    }else{
      URL = `/admin/wil/placement-groups/${this.placementId}`;
    }
   
    const navigationExtras = {queryParams: {redirectTo: 'worfkflow', stage: this.stage}, state:{type: 'view'}};
    let payload = this.createTaskPayload.filter(task=> {
        console.log("task.completionCriteria == this.createTask.value.completion_criteria",task.completionCriteria == this.createTask.value.completion_criteria)
      if (task.completionCriteria == this.createTask.value.completion_criteria) {
        for(let key in this.createTask.value) {
          if (task.formElement.hasOwnProperty(key)) {
            if (key == 'deadline') {
              this.createTask.value[key] = this.createTask.value[key] ? Utils.convertDate(this.createTask.value[key], 'YYYY-MM-DD') : null;
            }
            if (this.createTask.value['notification_followUp_condition'] === null || this.createTask.value['notification_followUp_condition'] === 'No Deadline') {
              this.createTask.value['notification_followUp_condition_days'] = undefined;
            }
            if (key == 'notification_followUp_deadline') {
              this.createTask.value[key] = this.createTask.value[key] ? Utils.convertDate(this.createTask.value[key], 'YYYY-MM-DD') : null;
            }
            task.formElement[key] = this.createTask.value[key];
          }
        }
        return task.formElement; 
      }
    });

    console.log("payload", payload, URL)
    if (payload.length) {
      // const valid = this.checkValidation(payload[0].formElement);
      // if (valid) {
        const userDetail = JSON.parse(localStorage.getItem('userDetail'));
        if (!this.taskId) {
          payload[0].formElement['placement_id'] = this.placementId;
          payload[0].formElement['created_by_id'] = userDetail?._id;
          payload[0].formElement['created_by'] = `${userDetail.first_name} ${userDetail.last_name}`;
          if (this.stepId) {
            payload[0].formElement['step_id'] = this.stepId;
            payload[0].formElement['is_default'] = true;
            payload[0].formElement['workflow_type_id'] = this.workflowTypeId;
            payload[0].formElement['stage'] = this.stage;
          }
          if(this.media && this.media.documents && this.media.documents.length>0){
            payload[0].formElement['documents'] = this.media.documents;
          }
          this.service.createTask(payload[0].formElement).subscribe((response: any) => {
            if (response.status == HttpResponseCode.SUCCESS) {
              this.service.showMessage({message: response.msg});
              this.router.navigate([URL], navigationExtras);
              // this.location.back();
            }
          })
        } else {
          payload[0].formElement['task_id'] = this.taskId;
          // payload[0].formElement['set_days'] = this.taskId;
          
          payload[0].formElement['created_by_id'] = userDetail?._id;
          payload[0].formElement['created_by'] = `${userDetail.first_name} ${userDetail.last_name}`;

          if(this.media && this.media.documents && this.media.documents.length>0){
            payload[0].formElement['documents'] = this.media.documents;
          }
          console.log("payload[0]", payload[0], this.media.documents);

          this.service.editTask(payload[0].formElement).subscribe((response: any) => {
            if (response.status == HttpResponseCode.SUCCESS) {
              this.router.navigate([URL], navigationExtras);
              // this.location.back();
              this.service.showMessage({message: response.msg});
            }
          })
        }
      // }
    }
    
  }

  getTaskDetail() {
    let payload = {task_id: this.taskId};
    this.service.getTaskDetail(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        let data = response.result;
        if (data?.['completion_criteria']) {
          this.getAdditionalCriteria(data?.['completion_criteria']);

          console.log(data?.['completion_criteria'] != this.completionCriteria.sendEmail, "data?.['completion_criteria'] != this.completionCriteria.sendEmail");

          if (data?.['completion_criteria'] != this.completionCriteria.sendEmail ) {
            this.getEmailTemplate(data?.notification_followUp_email_category, 'notification_followUp_email_template');
          } else {
            this.getEmailTemplate(data?.category, 'template');
          }
        }
        this.getCustomFormBySubmitter(data?.category);
        this.displayCustomMessageTextArea = data?.notification_completion_custom_message;
        this.displayNotificationCompletionSendEmail = data?.notification_completion_send_email;
        this.createTask.patchValue({
          name: data.name,
          completion_criteria: data.completion_criteria,
          unlock_task_on: data.unlock_task_on,
          category: data.category,
          template: data.template,
          email_date: data.email_date ? Utils.convertIntoDateObject(data.email_date) : null,
          description: data?.['description'],
          required_activity: data?.['required_activity'],
          time_periods: data?.['time_periods'],
          additional_criteria: data?.['additional_criteria'],
          deadline: data?.['deadline'],
          select_form: data?.['select_form'],
          event_date: data?.['event_date'],
          event_time: data?.['event_time'],
          set_days: data?.['set_days'],
          select_staff: data?.['select_staff'],
          notification_completion_custom_message: data?.['notification_completion_custom_message'],
          notification_completion_custom_text_message: data?.['notification_completion_custom_text_message'],
          notification_completion_send_email: data?.['notification_completion_send_email'],
          notification_completion_email_category: data?.['notification_completion_email_category'],
          notification_completion_email_template: data?.['notification_completion_email_template'],
          notification_followUp_deadline: data?.['notification_followUp_deadline'],
          notification_followUp_condition: data?.['notification_followUp_condition'],
          notification_followUp_condition_days: data?.['notification_followUp_condition_days'],
          notification_followUp_time_trigger: data?.['notification_followUp_time_trigger'],
          notification_followUp_send_email: data?.['notification_followUp_send_email'],
          notification_followUp_email_category: data?.['notification_followUp_email_category'],
          notification_followUp_email_template: data?.['notification_followUp_email_template'],
          notification_followUp_send_text_message: data?.['notification_followUp_send_text_message'], 
          notification_followUp_text_message: data?.['notification_followUp_text_message'],
          notification_followUp_voice_mail: data?.['notification_followUp_voice_mail'],
          document_types: data?.['document_types'],
          show_validity: data?.['show_validity'],
          set_days_validity:data?.['set_days_validity'],
          set_days_type_validity:data?.['set_days_type_validity'],
          video_url: data?.['video_url'],
          appointment_url:data?.['appointment_url'],
          event_url:data?.['event_url']
        });
        this.media.documents = data?.['documents'];
        this.selectedCompletionCriteria = data.completion_criteria;
      }
    });
  }

  getEmailCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
        this.categories = response.data;
    });
  }

  getEmailTemplate(event, template?) {
    const payload = {
      category: event
    }
    this.service.getEmailTemplateById(payload).subscribe((response: any) => {
      // if (response.status == HttpResponseCode.SUCCESS) {
        this.emailTemplates = response.data;
        if (template) {
          this.onSelectTemplate(event, template);
        }
      // }
    });
  }

  onSelectTemplate(key, type) {
    console.log(key, type, "key, type")
    this.selectedEmailTemplate = this.emailTemplates.find((template) => {

      if(this.createTask.value.template){
        if (template._id === this.createTask.value.template) {
          if (type == 'template') {
            this.widget = template.widgets.hasOwnProperty('html') ? this.sanitizer.bypassSecurityTrustHtml(template.widgets.html) : this.sanitizer.bypassSecurityTrustHtml(template.widgets);
          } else {
            this.followupEmailWidget = template.widgets.hasOwnProperty('html') ? this.sanitizer.bypassSecurityTrustHtml(template.widgets.html) : this.sanitizer.bypassSecurityTrustHtml(template.widgets);
          }
        }
      }else{
        if (template._id === key) {
        
          if (type == 'template') {
            this.widget = template.widgets.hasOwnProperty('html') ? this.sanitizer.bypassSecurityTrustHtml(template.widgets.html) : this.sanitizer.bypassSecurityTrustHtml(template.widgets);
          } else {
            this.followupEmailWidget = template.widgets.hasOwnProperty('html') ? this.sanitizer.bypassSecurityTrustHtml(template.widgets.html) : this.sanitizer.bypassSecurityTrustHtml(template.widgets);
          }
        }
      }
    
    });
  }

  checkFieldInvalid(field) {
    return this.createTask.get(field)?.invalid && (this.createTask.get(field)?.dirty || this.createTask.get(field)?.touched);
  }

  clearFormFields() {
    this.createTaskPayload.forEach((task) => {
      if (task.completionCriteria != this.selectedCompletionCriteria) {
        for(const key of Object.keys(task.formElement)) {
          if (
              key != 'name' && 
              key != 'completion_criteria' &&  
              key != 'unlock_task_on' && 
              key != 'required_activity' && 
              key != 'notification_completion_send_email' && 
              key != 'notification_completion_custom_message'
            ) {
            this.createTask.get(key).setValue(null);
          }
        }
      }
    })
  }

  checkValidation(formElement) {
    let isFormValid = false;
    for(const key of Object.keys(formElement)) {
      if (!this.createTaskIgnoreValidationFor.includes(key) && !formElement[key]) {
        isFormValid = false;
        break;
      } else {
        isFormValid = true;
      }
    };
    return isFormValid;
  }

  onChangeCustomMessage() {
    return this.displayCustomMessageTextArea = this.createTask?.value?.notification_completion_custom_message;
  }

  onChangeSendEmail() {
    return this.displayNotificationCompletionSendEmail = this.createTask?.value?.notification_completion_send_email;
  }


   files = [];
  
    media: any = {
      documents:[],
    }
  
  getFilDoc(event: any) {
    const fileInput = event.target;
    const fileList: FileList = fileInput.files;

    if (fileList.length === 0) return;

    const fileArray = Array.from(fileList);

    // Check size for each file (optional: you can do per-file check if needed)
    if (fileArray.some(file => file.size > 5242880)) {
      this.service.showMessage({
        message: 'Please select file less than 5 MB',
      });

      // Reset the input to allow re-selection of same file
      fileInput.value = '';
      return;
    }

    this.files = fileArray;

    this.files.forEach((file) => {
      const formData = new FormData();
      formData.append('media', file);

      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
       if (!this.media) {
          this.media = {};
        }

        if (!this.media.documents) {
          this.media.documents = [];
        }

        this.media.documents.push(resp);
      });
    });

    // ✅ Reset the input to allow selecting same file again
    fileInput.value = '';
  }

    removeFile(index) {
        this.service.deleteFileS3({file_url: this.media.documents[index].url}).subscribe(res => {
          if (res.status == HttpResponseCode.SUCCESS) {
            this.media.documents.splice(index, 1);
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
  
    viewFile(index, file){
      console.log("index, file", index, file)
      window.open(file.url);
    }

    optionShowEmail(unlockTaskOn: any): boolean {
      const projectIds = [
        '67f36f09248c7823ab8a38dc',
        '67f36f09248c7823ab8a38dd',
        '67f36f09248c7823ab8a38df',
        '67f36f09248c7823ab8a38e1'
      ];
    
      const otherIds = [
        '65c71d433aee90c7dbc84d0e',
        '65c71d433aee90c7dbc84d12',
        '65c71d433aee90c7dbc84d10',
        '65c71d433aee90c7dbc84d11'
      ];
    
      if (this.Projecttype === 'project') {
        return projectIds.includes(unlockTaskOn._id);
      } else {
        return otherIds.includes(unlockTaskOn._id);
      }
    }

    isYoutubeOrVimeoUrl(url: string): boolean {
      if (!url) return false;

      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/;
      const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+)$/;

      return youtubeRegex.test(url) || vimeoRegex.test(url);
    }
  
}
