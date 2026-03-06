import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('closeTaskPopup') closeTaskPopup: any;
  @ViewChild('addAgentModal') addAgentModal: any;
  @ViewChild('removeAgentModal') removeAgentModal: any;
  @ViewChild('addSandboxModal') addSandboxModal: any;
  @ViewChild('removeSandboxModal') removeSandboxModal: any;
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
    getStudentUploadsVideo:'Submit Video (Upload URL)',
    meetAIAgent: 'Meet AI Agent'
  }
  // AI Agent tab system
  aiAgentActiveTab = 0;
  aiAgentTabs: any[] = [];

  // Tab 2: Task Context - Agent Management
  availableAgentList: any[] = [];
  taskAgents: any[] = [];
  selectedTaskAgentIndex = 0;
  addAgentSelectedId: string | null = null;
  removeAgentIndex: number | null = null;

  // Tab 3: Sandbox Config
  taskSandboxes: any[] = [];
  validationModeOptions = [
    { value: 'ai_review', label: 'AI Review' },
    { value: 'keyword_match', label: 'Keyword Match' },
    { value: 'json_schema', label: 'JSON Schema' },
    { value: 'keyword_syntax_constraint', label: 'Keyword/Syntax Constraint' },
    { value: 'unit_test_script', label: 'Unit Test Script' },
    { value: 'sql_query_result_match', label: 'SQL Query Result Match' },
    { value: 'regex_pattern_match', label: 'Regex Pattern Match' },
    { value: 'performance_benchmark', label: 'Performance Benchmark' }
  ];
  selectedSandboxIndex = 0;
  addSandboxSelected: string | null = null;
  removeSandboxIndex: number | null = null;
  sandboxOptions = [
    { _id: 'sql_terminal', name: 'SQL Terminal' },
    { _id: 'document_editor', name: 'Document Editor' }
  ];

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
    {
      completionCriteria: 'Meet AI Agent',
      formElement : {
        name: null,
        completion_criteria: null,
        description: null,
        unlock_task_on: null,
        required_activity: null,
        agents: null,
        sandboxes: null,
        guardrails: null,
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
    this.aiAgentTabs = [
      {name: 'Task Basics', icon:  '📋' },
      {name: 'Task Context', icon: `🤖`},
      {name: 'Sandbox Config', icon: `🛠️`},
      {name: 'Validation', icon: `☑️`},
      {name: 'Guardrails', icon: `🛡️`}
    ];
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

    if (this.selectedCompletionCriteria === this.completionCriteria.meetAIAgent) {
      this.loadAvailableAgents();
      this.aiAgentActiveTab = 0;
    }

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
    this.closeTaskPopup.hide();
    this.createTask.reset();
    let URL = '';
    if (this.Projecttype == 'project') {
      URL = `/admin/wil/placement-groups/project/${this.placementId}`;
    } else {
      URL = `/admin/wil/placement-groups/${this.placementId}`;
    }
    this.router.navigate([URL], { queryParams: { redirectTo: 'worfkflow', stage: this.stage }, state: { type: 'view' } });
  }

  onCreateTask() {
    // For Meet AI Agent, skip standard form validation (uses its own data)
    if (this.selectedCompletionCriteria !== this.completionCriteria.meetAIAgent) {
      if (this.createTask.invalid) {
        this.createTask.markAllAsTouched();
        return;
      }
    } else {
      // Validate at least a name is provided
      if (!this.createTask.get('name')?.value) {
        this.service.showMessage({message: 'Please enter a task name'});
        this.aiAgentActiveTab = 0;
        return;
      }
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

    // For Meet AI Agent, attach agents/sandboxes/guardrails data
    if (this.selectedCompletionCriteria === this.completionCriteria.meetAIAgent && payload.length) {
      payload[0].formElement['agents'] = this.taskAgents.map(agent => ({
        agent_id: agent._id,
        agent_output: agent.agent_output,
        initiation_message: agent.initiation_message,
        subsequent_messages: agent.subsequent_messages,
        action_on_final: agent.action_on_final,
        select_llm: agent.select_llm,
        agenda: agent.agenda,
        hidden_facts: agent.hidden_facts,
        max_responses: agent.max_responses,
        max_tokens: agent.max_tokens,
        guardrails: {
          enabled: agent.enable_guardrails,
          max_tokens: agent.guardrail_max_tokens,
          max_responses: agent.guardrail_max_responses,
          submission_on_exhaustion: agent.submission_on_exhaustion,
          message_on_exhaustion: agent.message_on_exhaustion
        }
      }));
      payload[0].formElement['sandboxes'] = this.taskSandboxes.map(sb => ({
        sandbox_id: sb._id,
        name: sb.name,
        allow_grading: sb.allow_grading,
        validation: {
          validation_mode: sb.validation_mode,
          select_validator: sb.select_validator,
          validator_agents: sb.validator_agents,
          grading_rubric: sb.grading_rubric,
          additional_documents: sb.additional_documents,
          skills_to_verify: sb.skills_to_verify
        }
      }));
    }

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

        // Load Meet AI Agent data in edit mode
        if (data.completion_criteria === this.completionCriteria.meetAIAgent) {
          this.aiAgentActiveTab = 0;
          this.loadAvailableAgents();
          if (data.agents && Array.isArray(data.agents)) {
            this.taskAgents = data.agents.map((a: any) => ({
              _id: a.agent_id,
              name: a.name || '',
              title: a.title || '',
              agent_output: a.agent_output || 'preset',
              initiation_message: a.initiation_message || '',
              subsequent_messages: a.subsequent_messages || [],
              action_on_final: a.action_on_final || 'repeat',
              select_llm: a.select_llm || '',
              agenda: a.agenda || '',
              hidden_facts: a.hidden_facts || '',
              max_responses: a.max_responses,
              max_tokens: a.max_tokens,
              enable_guardrails: a.guardrails?.enabled || false,
              guardrail_max_tokens: a.guardrails?.max_tokens,
              guardrail_max_responses: a.guardrails?.max_responses,
              submission_on_exhaustion: a.guardrails?.submission_on_exhaustion || '',
              message_on_exhaustion: a.guardrails?.message_on_exhaustion || ''
            }));
          }
          if (data.sandboxes && Array.isArray(data.sandboxes)) {
            this.taskSandboxes = data.sandboxes.map((sb: any) => ({
              _id: sb.sandbox_id,
              name: sb.name || '',
              allow_grading: sb.allow_grading || false,
              validation_mode: sb.validation?.validation_mode || '',
              select_validator: sb.validation?.select_validator || '',
              validator_agents: sb.validation?.validator_agents || [],
              grading_rubric: sb.validation?.grading_rubric || '',
              additional_documents: sb.validation?.additional_documents || [],
              skills_to_verify: sb.validation?.skills_to_verify || []
            }));
          }
        }
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

  // ===== Meet AI Agent Methods =====

  selectAiAgentTab(index: number) {
    this.aiAgentActiveTab = index;
  }

  loadAvailableAgents() {
    this.service.getAgentList({ search: '', page: 1, limit: 100, status: 'active' }).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.availableAgentList = response.data || response.result || [];
      }
    }, () => {
      this.availableAgentList = [];
    });
  }

  addAgentToTask() {
    if (!this.addAgentSelectedId) return;
    const agent = this.availableAgentList.find(a => a._id === this.addAgentSelectedId);
    if (!agent) return;
    if (this.taskAgents.find(a => a._id === this.addAgentSelectedId)) return;
    this.taskAgents.push({
      _id: agent._id,
      name: agent.name || agent.agent_name || '',
      title: agent.title || '',
      agent_output: 'preset',
      initiation_message: '',
      subsequent_messages: [],
      action_on_final: 'repeat',
      select_llm: '',
      agenda: '',
      hidden_facts: '',
      max_responses: null,
      max_tokens: null,
      enable_guardrails: false,
      guardrail_max_tokens: null,
      guardrail_max_responses: null,
      submission_on_exhaustion: '',
      message_on_exhaustion: ''
    });
    this.selectedTaskAgentIndex = this.taskAgents.length - 1;
    this.addAgentSelectedId = null;
    this.addAgentModal.hide();
  }

  confirmRemoveAgent() {
    this.removeAgentFromTask(this.removeAgentIndex);
    this.removeAgentModal.hide();
  }

  removeAgentFromTask(index: number) {
    this.taskAgents.splice(index, 1);
    if (this.selectedTaskAgentIndex >= this.taskAgents.length) {
      this.selectedTaskAgentIndex = Math.max(0, this.taskAgents.length - 1);
    }
    this.removeAgentIndex = null;
  }

  selectTaskAgent(index: number) {
    this.selectedTaskAgentIndex = index;
  }

  addSubsequentMessage(agentIndex: number) {
    if (this.taskAgents[agentIndex]?.subsequent_messages?.length < 4) {
      this.taskAgents[agentIndex].subsequent_messages.push('');
    }
  }

  removeSubsequentMessage(agentIndex: number, msgIndex: number) {
    this.taskAgents[agentIndex]?.subsequent_messages?.splice(msgIndex, 1);
  }

  addSandboxToTask() {
    if (!this.addSandboxSelected) return;
    const sandbox = this.sandboxOptions.find(s => s._id === this.addSandboxSelected);
    if (!sandbox) return;
    if (this.taskSandboxes.find(s => s._id === this.addSandboxSelected)) return;
    this.taskSandboxes.push({
      _id: sandbox._id,
      name: sandbox.name,
      allow_grading: false,
      validation_mode: '',
      select_validator: '',
      validator_agents: [],
      grading_rubric: '',
      additional_documents: [],
      skills_to_verify: [],
      forbidden_keywords: [],
      required_keywords: [],
      master_query: '',
      unit_test_script: '',
      regex_pattern: '',
      time_limit: null,
      memory_limit: null
    });
    this.selectedSandboxIndex = this.taskSandboxes.length - 1;
    this.addSandboxSelected = null;
    this.addSandboxModal.hide();
  }

  confirmAddSandbox() {
    this.addSandboxToTask();
  }

  confirmRemoveSandbox() {
    this.removeSandboxFromTask(this.removeSandboxIndex);
    this.removeSandboxModal.hide();
  }

  removeSandboxFromTask(index: number) {
    this.taskSandboxes.splice(index, 1);
    if (this.selectedSandboxIndex >= this.taskSandboxes.length) {
      this.selectedSandboxIndex = Math.max(0, this.taskSandboxes.length - 1);
    }
    this.removeSandboxIndex = null;
  }

  selectSandbox(index: number) {
    this.selectedSandboxIndex = index;
  }

  trackByIndex(index: number) {
    return index;
  }

}
