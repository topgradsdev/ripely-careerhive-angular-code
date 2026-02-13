import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import SignaturePad from 'signature_pad';
import { FileIconService } from '../../../shared/file-icon.service';
import * as CronofyElements from "cronofy-elements";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponseCode } from 'src/app/shared/enum';
import { DomSanitizer } from '@angular/platform-browser';
import Quill from 'quill';
import moment from 'moment';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-vacancies-details',
  templateUrl: './vacancies-details.component.html',
  styleUrls: ['./vacancies-details.component.scss']
})
export class VacanciesDetailsComponent implements OnInit {
  signaturePads: SignaturePad[] = [];
  taskDetail:any;
  @ViewChild('viewFormSubmittedModel') public viewFormSubmittedModel: ModalDirective;
  @ViewChild('managedAvailability') public managedAvailability: ModalDirective;
  @ViewChild('alreadyPlacedModel') alreadyPlacedModel: ModalDirective;
  @ViewChild('lockCandidatePlacement') lockCandidatePlacement: ModalDirective;
  @ViewChild('confirmMessgae') confirmMessgae: ModalDirective;
  @ViewChild('preferenceModel') preferenceModel: ModalDirective;
  
   dontShowAgain = false;


  selectedKey:any = '';
  selectedType:any = '';
  editorContent = '';  // Stores editor content
  editor:Quill;
  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
        ['link']  ,
        ['custom-button']  // Custom button added to toolbar
      ],
      handlers: {
        'custom-button': () => this.insertCustomElement()  // Custom button click handler
      }
    }
    // toolbar: [
    //   ['bold', 'italic', 'underline', 'strike'],        
    //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
    //   ['link']  ,
    //   ['placeholder']   
    // ]
  };
  
  sortBy: string = "alpha";
  cardView: boolean = false;
  @ViewChild('canvas') canvas: ElementRef;
  signaturesArray: any = [1, 2, 3, 4, 5];
  showCollapes: any = '';
  showCollapesForm: any = '';
  userProfile:any ={};
  moveTo:any = "";
  vacancy_id:any ="";
  routeForm: FormGroup;
  formView:any = {};
  studentFormDetail:any = {};
  selectedItem:any = {};
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
     { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
  ];
  constructor(private service: TopgradserviceService,
    private router: Router, private activatedRoute: ActivatedRoute,private fb: FormBuilder, private fileIconService: FileIconService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {

     }

  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }

   onCheckboxChange(event: any) {
    // Save value in localStorage
    localStorage.setItem('dontShowAgain', JSON.stringify(this.dontShowAgain));
  }

  getInitials(fullName?: string): string {
  if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    const first = parts[0]?.charAt(0).toUpperCase() || '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : '';
    return first + last;
}

type:any = '';
  ngOnInit(): void {
    // setTimeout(() => {
    //   this.managedAvailability.show();
    // }, 500);

    const storedValue = localStorage.getItem('dontShowAgain');
    if (storedValue) {
      this.dontShowAgain = JSON.parse(storedValue);
    }

    this.routeForm = this.fb.group({
      'summary': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'type': ['', [Validators.required]],
      'location': ['', [Validators.required]],
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.type = params['type'];
      this.vacancy_id = params['id'];
      this.FormBuilder()
      this.getVacancyDetails();
      this.getVacanciesStudentsAllocated();
      if( params['access_token']){
        sessionStorage.setItem('cronofy_access',  params['access_token']);
        sessionStorage.setItem('cronofy_refresh',  params['refresh_token']);
        sessionStorage.setItem('cronofy_sub',  params['sub']);
        this.getEelementToken()
       
      }
      else{
        if(sessionStorage.getItem('cronofy_access') && sessionStorage.getItem('cronofy_sub')){
          // this.getEelementToken()
          // this.managedAvailability.show();
          sessionStorage.removeItem('cronofy_access');
          sessionStorage.removeItem('cronofy_sub');
        }
      }
    });

    this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
    this.getEmailCategories();
    
    this.getStaffMembers();

  }

     reset(){
      this.FormBuilder()
    }

  changeStatusStudent:any = {};

  ruleSet = false;
  showError = false;
 
  element_token:any = null;

  onNext(stepper: MatStepper) {
    console.log("this.ruleSet", this.ruleSet)
  if (!this.ruleSet) {
    this.showError = true; // show error
    return;
  }

  this.showError = false; // clear error
  stepper.next(); // manually go to next step
}

 ngAfterViewInit() {
    // Wait a bit for Cronofy to inject the button
   // delay to ensure Cronofy finishes rendering
  }

 getEelementToken() {
  const payload = {
    access_token: sessionStorage.getItem('cronofy_access'),
    sub: sessionStorage.getItem('cronofy_sub')
  };
  
  this.service.cronofyGetElementToken(payload).subscribe({
    next: (res: any) => {
      console.log("res", res, res.element_token);
      this.element_token = res?.element_token?.token
      // Open modal
      this.managedAvailability.show();

      // Destroy previous element if already loaded (avoid duplication)
      const container = document.getElementById("cronofy-calendar");
      if (container) container.innerHTML = "";

      // Load Cronofy Availability Rules Element
      CronofyElements.AvailabilityRules({
        element_token: res?.element_token?.token,
        target_id: "cronofy-calendar",
        availability_rule_id: "work_hours", // 👈 Can be dynamic
        config: {
          start_time: "08:00",
          end_time: "18:00",
          duration: 30
        },
        styles: {
          colors: {
            available: "#65CA7E",
            unavailable: "#ECEDFF"
          },
          prefix: "custom-name"
        },
        tzid: "Etc/UTC"
      });


       setTimeout(() => {
          const button = document.querySelector(
            '#cronofy-calendar .custom-name__submit'
          ) as HTMLButtonElement;

          if (button) {
            button.addEventListener('click', () => {
              console.log('Save new rules button clicked!');
              // this.onSaveRules();
              this.ruleSet = true;
            });
          }
        }, 1000); 

      const calendarElement = document.getElementById('cronofy-calendar');
      if (calendarElement) {
        calendarElement.addEventListener('availabilityRuleSet', () => {
          console.log('Availability rule set!');
          this.ruleSet = true;
        });
      }
      
      // setTimeout(()=>{
       document
        .getElementById("cronofy-calendar")
        ?.addEventListener("availabilityRuleSet", () => {
          this.ruleSet = true;
        });
      // }, 500)

      // window.addEventListener("message", (event) => {
      //   console.log("event", event);
      //   if (event?.data?.type === "availabilityRuleSet") {
      //     console.log("✅ Cronofy availability rule set!");
      //     this.ruleSet = true;
      //     this.showError = false;
      //     this.cdr.detectChanges();
      //   }
      // });
    },
    error: (err) => {
        sessionStorage.removeItem('cronofy_access');
        sessionStorage.removeItem('cronofy_sub');
      this.service.showMessage({
        message: err.error?.errors?.msg || 'Something went Wrong'
      });
    }
  });
  this.callApi('Interviews');
}


  viewFile(data) {
    if (data.url) {
      // Open the file URL in a new tab
      window.open(data.url, '_blank');
    } else {
      console.error('File URL is not available.');
    }
  }


  selectedRow:any = {};
  onCardView(data) {
    if(data){
      this.selectedRow = data;
      this.moveTo = this.selectedRow.status;
    //   this.selectedRow.student_forms.push( {
    //     "_id": "66bafacfa36d5d03fd41a480",
    //     "placement_id": "66a0ac873a01aca81bcccefe",
    //     "student_id": "66a34093f220d2ed39501aa1",
    //     "task_id": "66b3046b43409864d436ccaf",
    //     "task_status": "completed",
    //     "employee_status": "pending",
    //     "form_fields": {
    //         "fields": [
    //             {
    //                 "color": "#FFD569",
    //                 "component": [
    //                     {
    //                         "elementData": {
    //                             "title": "Student Name",
    //                             "type": "single-line",
    //                             "description": "",
    //                             "value": "pooja",
    //                             "min": "",
    //                             "max": null,
    //                             "required": false
    //                         },
    //                         "id": "single",
    //                         "index": 1,
    //                         "name": "Student Name",
    //                         "isElementWidthFull": true
    //                     },
    //                     {
    //                         "elementData": {
    //                             "title": "Signature",
    //                             "type": "signature",
    //                             "description": "",
    //                             "value": "",
    //                             "newItem": "",
    //                             "items": [
    //                                 {
    //                                     "item": "Student",
    //                                     "signature": {
    //                                         "url": "https://s3.ap-southeast-2.amazonaws.com/uploadtest.careerhive.com.au/public/image/17235299223954923733758.blob",
    //                                         "name": "blob",
    //                                         "size": "3 KB",
    //                                         "mimetype": "image/svg+xml",
    //                                         "date": "2024-08-13T06:18:43.489Z"
    //                                     },
    //                                     "date": "2024-08-21T18:30:00.000Z",
    //                                     "name": "pooja parmar"
    //                                 }
    //                             ],
    //                             "required": false
    //                         },
    //                         "id": "signature",
    //                         "index": 2,
    //                         "name": "Signature",
    //                         "isElementWidthFull": true
    //                     }
    //                 ],
    //                 "index": 1,
    //                 "name": "Step 1",
    //                 "_id": "66b303fe43409864d436cc39"
    //             }
    //         ],
    //         "type": "multi_step"
    //     },
    //     "vacancy_id": "66a33f63e38da178327ba10a",
    //     "company_id": "66a1da77075097e265c12b4a",
    //     "form_id": "66b3043543409864d436cc42",
    //     "task_type": "form",
    //     "is_approve": true,
    //     "status": "to_do",
    //     "updated_at": "1723529935871",
    //     "added_at": "1723529935871",
    //     "form_id_as_objectId": "66b3043543409864d436cc42",
    //     "formDetails": {
    //         "_id": "66b3043543409864d436cc42",
    //         "title": "SUbmit Document",
    //         "type": "multi_step",
    //         "submiters": "se",
    //         "widgets": {
    //             "html": "<h2 _ngcontent-etg-c514=\"\" id=\"exampleModalLabel\" class=\"modal-title\">SUbmit Document</h2>\n                <app-preview-multi-form _ngcontent-etg-c514=\"\" _nghost-etg-c518=\"\" ng-reflect-multi-step-form-preview-data=\"[object Object]\"><div _ngcontent-etg-c518=\"\" class=\"intern_stepper\">\n    <mat-horizontal-stepper _ngcontent-etg-c518=\"\" aria-orientation=\"horizontal\" role=\"tablist\" labelposition=\"bottom\" class=\"mat-stepper-horizontal ng-tns-c268-240 mat-stepper-label-position-bottom ng-star-inserted\" ng-reflect-label-position=\"bottom\"><div class=\"mat-horizontal-stepper-header-container ng-tns-c268-240\"><mat-step-header role=\"tab\" class=\"mat-step-header mat-focus-indicator mat-horizontal-stepper-header mat-primary ng-tns-c268-240 ng-star-inserted\" tabindex=\"0\" id=\"cdk-step-label-0-0\" ng-reflect-index=\"0\" ng-reflect-state=\"number\" ng-reflect-label=\"[object Object]\" ng-reflect-selected=\"true\" ng-reflect-active=\"true\" ng-reflect-optional=\"false\" ng-reflect-icon-overrides=\"[object Object]\" aria-posinset=\"1\" aria-setsize=\"1\" aria-controls=\"cdk-step-content-0-0\" aria-selected=\"true\"><div matripple=\"\" class=\"mat-ripple mat-step-header-ripple\" ng-reflect-trigger=\"[object HTMLElement]\"></div><div class=\"mat-step-icon mat-step-icon-state-number mat-step-icon-selected\"><div class=\"mat-step-icon-content\" ng-reflect-ng-switch=\"false\"><!--bindings={\n  \"ng-reflect-ng-switch-case\": \"true\"\n}--><span class=\"ng-star-inserted\">1</span><!--bindings={\n  \"ng-reflect-ng-switch-case\": \"number\"\n}--><!--container--><!--ng-container--><!--container--></div></div><div class=\"mat-step-label mat-step-label-active mat-step-label-selected\"><div class=\"mat-step-text-label ng-star-inserted\">Step 1<!--ng-container--></div><!--bindings={\n  \"ng-reflect-ng-if\": \"[object Object]\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": null\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--></div></mat-step-header><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--ng-container--><!--bindings={\n  \"ng-reflect-ng-for-of\": \"\"\n}--></div><div class=\"mat-horizontal-content-container ng-tns-c268-240\"><div role=\"tabpanel\" class=\"mat-horizontal-stepper-content ng-trigger ng-trigger-stepTransition ng-tns-c268-240 ng-star-inserted\" id=\"cdk-step-content-0-0\" aria-labelledby=\"cdk-step-label-0-0\" aria-expanded=\"true\" style=\"transform: none; visibility: inherit;\">\n            <!--container-->\n            <div _ngcontent-etg-c518=\"\" class=\"preview_form_card ng-star-inserted\" style=\"\">\n                <div _ngcontent-etg-c518=\"\" class=\"form_title\">Step 1</div>\n                <div _ngcontent-etg-c518=\"\" class=\"row main_container\">\n                    <div _ngcontent-etg-c518=\"\" ng-reflect-ng-class=\"col-md-12\" class=\"col-md-12 ng-star-inserted\">\n                        <div _ngcontent-etg-c518=\"\" class=\"form-group\">\n                            <label _ngcontent-etg-c518=\"\">Student Name <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                                    <br _ngcontent-etg-c518=\"\"><small _ngcontent-etg-c518=\"\" class=\"description-opacity\"></small></label>\n                            <input _ngcontent-etg-c518=\"\" type=\"text\" class=\"form-control ng-untouched ng-pristine ng-valid ng-star-inserted\" ng-reflect-model=\"\"><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                        </div>\n                    </div><div _ngcontent-etg-c518=\"\" ng-reflect-ng-class=\"col-md-12\" class=\"col-md-12 ng-star-inserted\">\n                        <div _ngcontent-etg-c518=\"\" class=\"form-group\">\n                            <label _ngcontent-etg-c518=\"\">Signature <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                                    <br _ngcontent-etg-c518=\"\"><small _ngcontent-etg-c518=\"\" class=\"description-opacity\"></small></label>\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->\n                            \n                                <div _ngcontent-etg-c518=\"\" class=\"form-group mb-0 ng-star-inserted\">\n                                    <div _ngcontent-etg-c518=\"\" class=\"sign_from\">\n                                        <label _ngcontent-etg-c518=\"\">Student Signature:</label>\n                                        <canvas _ngcontent-etg-c518=\"\" height=\"90\" class=\"form-control cavas_field\" style=\"touch-action: none; border: 1px solid #f4f4f4;\" id=\"sPad0\"></canvas>\n                                    </div>\n                                    <div _ngcontent-etg-c518=\"\" class=\"sign_from\">\n                                        <label _ngcontent-etg-c518=\"\">Name:</label>\n                                        <input _ngcontent-etg-c518=\"\" type=\"text\" placeholder=\"\" class=\"form-control ng-untouched ng-pristine ng-valid\" ng-reflect-model=\"\">\n                                    </div>\n                                    <div _ngcontent-etg-c518=\"\" class=\"sign_from\">\n                                        <label _ngcontent-etg-c518=\"\">Date:</label>\n                                        <input _ngcontent-etg-c518=\"\" type=\"text\" placeholder=\"\" class=\"form-control ng-untouched ng-pristine ng-valid\" ng-reflect-model=\"\">\n                                    </div>\n                                   </div><!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}-->\n                                <!--ng-container--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->\n                        </div>\n                    </div><!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object],[object Object\"\n}-->\n                </div>\n            </div>\n            <div _ngcontent-etg-c518=\"\" class=\"step_footer ng-star-inserted\" style=\"\">\n            </div>\n        <!--ng-container--></div><!--bindings={\n  \"ng-reflect-ng-for-of\": \"\"\n}--></div></mat-horizontal-stepper>\n</div></app-preview-multi-form>\n\n                <div _ngcontent-etg-c514=\"\" class=\"row check_box_link mt-1\">\n                    <div _ngcontent-etg-c514=\"\" class=\"col-md-12 col-12\">\n                        <mat-checkbox _ngcontent-etg-c514=\"\" name=\"checked\" class=\"mat-checkbox example-margin mat-accent ng-untouched ng-pristine ng-valid\" ng-reflect-name=\"checked\" ng-reflect-options=\"[object Object]\" id=\"mat-checkbox-104\"><label class=\"mat-checkbox-layout\" for=\"mat-checkbox-104-input\"><span class=\"mat-checkbox-inner-container\"><input type=\"checkbox\" class=\"mat-checkbox-input cdk-visually-hidden\" id=\"mat-checkbox-104-input\" tabindex=\"0\" name=\"checked\" aria-checked=\"false\"><span matripple=\"\" class=\"mat-ripple mat-checkbox-ripple mat-focus-indicator\" ng-reflect-trigger=\"[object HTMLLabelElement]\" ng-reflect-disabled=\"false\" ng-reflect-radius=\"20\" ng-reflect-centered=\"true\" ng-reflect-animation=\"[object Object]\"><span class=\"mat-ripple-element mat-checkbox-persistent-ripple\"></span></span><span class=\"mat-checkbox-frame\"></span><span class=\"mat-checkbox-background\"><svg version=\"1.1\" focusable=\"false\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" class=\"mat-checkbox-checkmark\"><path fill=\"none\" stroke=\"white\" d=\"M4.1,12.7 9,17.6 20.3,6.3\" class=\"mat-checkbox-checkmark-path\"></path></svg><span class=\"mat-checkbox-mixedmark\"></span></span></span><span class=\"mat-checkbox-label\"><span style=\"display: none;\">&nbsp;</span>\n                            Mark this form as a Host Company Agreement &amp; Assessment Form (HCAAF)</span></label></mat-checkbox>\n                    </div>\n                </div>",
    //             "values": [
    //                 {
    //                     "color": "#FFD569",
    //                     "component": [
    //                         {
    //                             "elementData": {
    //                                 "title": "Student Name",
    //                                 "type": "single-line",
    //                                 "description": "",
    //                                 "value": "",
    //                                 "min": "",
    //                                 "max": null,
    //                                 "required": false
    //                             },
    //                             "id": "single",
    //                             "index": 1,
    //                             "name": "Student Name",
    //                             "isElementWidthFull": true
    //                         },
    //                         {
    //                             "elementData": {
    //                                 "title": "Signature",
    //                                 "type": "signature",
    //                                 "description": "",
    //                                 "value": "",
    //                                 "newItem": "",
    //                                 "items": [
    //                                     {
    //                                         "item": "Student",
    //                                         "signature": "",
    //                                         "date": "",
    //                                         "name": ""
    //                                     }
    //                                 ],
    //                                 "required": false
    //                             },
    //                             "id": "signature",
    //                             "index": 2,
    //                             "name": "Signature",
    //                             "isElementWidthFull": true
    //                         }
    //                     ],
    //                     "index": 1,
    //                     "name": "Step 1",
    //                     "_id": "66b303fe43409864d436cc39"
    //                 }
    //             ]
    //         },
    //         "status": "active",
    //         "sent": 0,
    //         "submited": 0,
    //         "default": false,
    //         "order": 0,
    //         "create_by": "65b1cc47f2c6b7d50406a9ae",
    //         "createdAt": "2024-08-07T05:20:53.586Z",
    //         "updatedAt": "2024-08-13T06:17:41.764Z"
    //     }
    // })
    }
  
    this.cardView = !this.cardView
  }

  getSelected(data){
    this.selectedRow = data;
    console.log("selectedRow",this.selectedRow);
    this.moveTo = this.selectedRow.status;
  }
  collapsToggle(ids: any) {
    if (this.showCollapes == ids) {
      this.showCollapes = '';
    }
    else {
      this.showCollapes = ids
    }
  }

  collapsToggleForm(ids: any) {
    if (this.showCollapesForm == ids) {
      this.showCollapesForm = '';
    }
    else {
      this.showCollapesForm = ids
    }
  }


  
  vacancyDetails:any ={};
  getVacancyDetails(){
    const payload = {
      // status: 'active',
      vacancy_id: this.vacancy_id,
      "sort_by": "alpha",  // 'date'
      "type":this.type
    }

    console.log("payload", payload)
    this.service.getVacanciesDetails(payload).subscribe((res: any) => {
      console.log("res", res);
      this.vacancyDetails =res && res.data.length>0? res.data[0]:{};
      console.log("this.vacancyDetails", this.vacancyDetails)
      // setTimeout(() => {
      //   this.FormBuilder();
      // }, 500);
    });
  }

  getActive(data, type){
    if(type){
      const found = data?.split(',').find(days => days == type.name);
      if (found) {
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  dataChanged(newObj) {
    console.log("newObj", newObj, this.searchQuery)
      // here comes the object as parameter
  }

  searchQuery:any = '';
  StudentsAllocated:any = [];
  getVacanciesStudentsAllocated(){
    const payload = {
      vacancy_id: this.vacancy_id,
      'status':this.selectedStatus,
      "sort_by":this.sortBy,
      'search_term':this.searchQuery,
      "type":this.type
    }

    // "sort_by": "availability",
    // "sort_by": "location",
    // "sort_by": "alpha",
    // "sort_by":"date"
    console.log("payload", payload)
    this.service.getVacanciesStudentsAllocated(payload).subscribe(async(res: any) => {
      console.log("res", res);
     if (res.code == 200) {
       this.StudentsAllocated = res.students;
      
       if( this.StudentsAllocated.length>0){
        if(this.selectedRow && this.selectedRow._id){
          let find = await this.StudentsAllocated.find(el=>el._id == this.selectedRow._id);
          if(find){
            this.selectedRow = find;
            this.moveTo = this.selectedRow.status;
          }
         }
         
       }else{
        this.selectedRow = {};
        this.cardView = false;
       }
      
      } else {
        this.StudentsAllocated = [];
        this.service.showMessage({ message: res.message });
      }
    }, err => {
      console.log("hjjhgjhghjgjhghjgjhghjg", err);
      this.StudentsAllocated = [];
      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    });
  }

  selectedStatus:any = "";
  callApi(status){
    this.selectedStatus = status;
    this.selectedRow = {}
    this.cardView = false;
    // this.filters.forEach(el=>{
    //   if(el.selected){
    //     el.selected =false
    //   }
    //   if (el.field) {
    //     if(el.field === 'course_start_date'){
    //       this.filterParameters.course_start_sdate = null
    //       this.filterParameters.course_start_edate = null
    //     }else if(el.field === 'course_end_date'){
    //       this.filterParameters.course_end_sdate = null
    //       this.filterParameters.course_end_edate = null
    //     }else if(el.field === 'internship_start_date'){
    //       this.filterParameters.internship_start_sdate = null
    //       this.filterParameters.internship_start_edate = null
    //     }else if(el.field === 'internship_end_date'){
    //       this.filterParameters.internship_end_sdate = null
    //       this.filterParameters.internship_end_edate = null
    //     }else{
    //       this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
    //     }
    //   }
    // })
    this.getVacanciesStudentsAllocated();
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


  downloadFile(url: string) {
    window.open(url);
  }
  singleStepForm:any = [];
  multiStepForm:any = [];

  viewForm(data){
    console.log("data", data)
    this.formView = data?.formDetails;
    this.studentFormDetail = data?.form_fields;

    if (this.studentFormDetail?.type === 'simple') {
      this.singleStepForm = this.studentFormDetail?.fields;
    } else if (this.studentFormDetail?.type === 'multi_step') {
      this.multiStepForm = this.studentFormDetail?.fields;
    }

    // this.service.getStudentFormById({ _id: formId }).subscribe(response => {
    //   this.studentFormDetail = response.data[0];
    
    // });
    
    this.viewFormSubmittedModel.show();
    const self = this;
    setTimeout(() => {
      self.initializeSignatures();
    }, 2000);
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


  checkIsFormValid(formFields) {
    if (formFields && formFields.length > 0) {
      return formFields.some(form => (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||
        (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Employer') && (!item?.signature || Object.keys(item.signature).length === 0))) ||
        (form.id === 'checkbox' && !form.elementData.items.some(item => item.selected)));
    } else {
      return true;
    }
  }

  updateStatus(status){
    // return;
    //   let payload= {
    //     "status": status,
    //     "student_id": [
    //         this.selectedRow._id
    //     ]
    // };
    //    this.service.editStudent(payload).subscribe((res: any) => {
    //     this.service.showMessage({
    //       message: "Student data updated successfully"
    //     });
    //     this.ngOnInit();
    //   }, err => {
    //     this.service.showMessage({
    //       message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
    //     });
    //   })
    // console.log("status", status)
     this.userProfile = JSON.parse(localStorage.getItem('userDetail'));

    //  if(status=="Applications"){
    //     status = "Application";
    //  }
    //  if(status=="Applications"){
    //     status = "Application";
    //  }
    //  if(status=="Applications"){
    //     status = "Application";
    //  }
    //  if(status=="Applications"){
    //     status = "Application";
    //  }

     if( this.vacancyDetails && this.vacancyDetails?.type == "internship"){
            let payload = {
              status: status,
              placement_id: this.selectedRow?.allocations?.placement_id,
              student_id: this.selectedRow._id,
              company_id: this.userProfile._id,
              vacancy_id: this.vacancy_id,
              preference: this.preference,
              last_created_by: this.userProfile.first_name+' '+ this.userProfile.last_name, 
              last_created_by_id: this.userProfile.contact_person_id, 
            };
            this.service.editStudentStatus(payload).subscribe((response: any) => {
              if (response.status == HttpResponseCode.SUCCESS) {
                this.ngOnInit();
              }
            }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
     }else{
          let payload = {
            status: status,
            placement_id: this.selectedRow?.allocations?.placement_id,
            student_id: this.selectedRow._id,
            company_id: this.userProfile._id,
            vacancy_id: this.vacancy_id,
            preference: this.preference,
            last_created_by: this.userProfile.first_name+' '+ this.userProfile.last_name, 
            last_created_by_id: this.userProfile.contact_person_id, 
          };
          this.service.projectEditStudentStatus(payload).subscribe((response: any) => {
            if (response.status == HttpResponseCode.SUCCESS) {
              this.ngOnInit();
            }
          }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
     }
  }

  getStrokeColor(status: string): string {
    switch(status) {
      case 'Accepted': return '#4FA352';
      case 'Rejected': return '#FF4D4F';
      default: return 'currentColor';
    }
  }

  gotoProfile(){
    console.log("this.selectedItem", this.selectedItem, this.selectedRow);
    this.router.navigate(['/employer/vacancies/view-profile'],  {queryParams:{'id':this.selectedItem && this.selectedItem._id?this.selectedItem._id: this.selectedRow._id}});
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

  editVacancy() {
    if(this.vacancyDetails.type=="project"){
      this.router.navigate(["/employer/vacancies/create-project"], { queryParams: { id: this.vacancyDetails._id, type: this.vacancyDetails.type} })
    }else{
      this.router.navigate(["/employer/vacancies/create-vacancies"], { queryParams: { id: this.vacancyDetails._id, type: this.vacancyDetails.type} })
    }
    
  }

  updateVacanciesStatus(status) {
    const payload = {
      _ids: [this.vacancyDetails?._id],
      status: status
    }
    this.service.updateVacanciesStatus(payload).subscribe(res => {
      this.service.showMessage({
        message: "Vacancy status changed successfully"
      });
      this.getVacancyDetails();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  deleteVacancy() {
    const payload = {
      _ids: [this.vacancyDetails?._id]
    }
    this.service.deleteVacancy(payload).subscribe(res => {
      this.service.showMessage({
        message: "Vacancy deleted changed successfully"
      });
      this.router.navigate(["/employer/vacancies"])
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  // private messageListener = (event: MessageEvent) => {
  //   if (event.origin !== window.location.origin) return;

  //   if (event.data.type === 'CRONOFY_AUTH_SUCCESS') {
  //     console.log('✅ Cronofy Auth Code:', event.data.code);

  //     // // Call backend to exchange token
  //     // this.cronofy.exchangeCode(event.data.code).subscribe({
  //     //   next: (resp) => {
  //     //     console.log('✅ Token Response:', resp);
  //     //   },
  //     //   error: (err) => console.error('❌ Exchange failed', err)
  //     // });
  //   }
  // };

  // ngOnDestroy(): void {
  //   window.removeEventListener('message', this.messageListener);
  // }


  // authCronofy(){
   

  //   const [baseUrl, hashPart] = window.location.href.split("#");
  //   const [path, queryString] = hashPart.split("?");

  //   // Parse query params
  //   const params = new URLSearchParams(queryString);

  //   // Remove unwanted params
  //   params.delete("access_token");
  //   params.delete("sub");

  //   // Build new URL
  //   const cleanedUrl = `${baseUrl}#${path}?${params.toString()}`;
  //   // sessionStorage.setItem('rd_url', cleanedUrl);

  //    this.service.cronofyAuthUrl({redirect_url:cleanedUrl}).subscribe(res => {
  //     console.log("res", res)
  //     const width = 600;
  //     const height = 700;
  //     const left = window.screenX + (window.outerWidth - width) / 2;
  //     const top = window.screenY + (window.outerHeight - height) / 2;

  //      window.location.href = res.url;
  //     // window.open(
  //     //   res.url,
  //     //   'CronofyAuth',
  //     //   `width=${width},height=${height},left=${left},top=${top}`
  //     // );
  //     // const popup = window.open(
  //     //   res.url,
  //     //   'CronofyAuth',
  //     //   `width=${width},height=${height},top=${top},left=${left}`
  //     // );

  //     // window.addEventListener("message", (event) => {
  //     //   if (event.origin !== "http://localhost:4200") return; // security check
  //     //   if (event.data.type === "cronofy-auth-success") {
  //     //     console.log("Cronofy Auth Success:", event.data.token);
  //     //     popup?.close(); // close popup
  //     //   }
  //     // });
      
  //   }, err => {
  //     this.service.showMessage({
  //       message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //     });
  //   })
  // }

  authCronofy() {
    let baseUrl = window.location.href;

    // Strip out the hash part completely
    if (baseUrl.includes("#")) {
      baseUrl = baseUrl.split("#")[0];
    }

    this.service.cronofyAuthUrl({ redirect_url: baseUrl }).subscribe(
      (res) => {
        console.log("res", res);

        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        // 🔑 Option 1: Redirect current window
        window.location.href = res.url;

        // 🔑 Option 2: Open popup (uncomment if you prefer popup auth flow)
        // window.open(
        //   res.url,
        //   'CronofyAuth',
        //   `width=${width},height=${height},left=${left},top=${top}`
        // );
      },
      (err) => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : "Something went Wrong",
        });
      }
    );
  }



  ScheduleInterviewlink(){
      //
      this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
      let body = {
        student_ids: this.StudentsAllocated.map(el => el._id),
        company_id: this.userProfile._id, 
        vacancy_id:this.vacancy_id, 
        placement_id:undefined, 
        access_token:sessionStorage.getItem('cronofy_access'), 
        sub:sessionStorage.getItem('cronofy_sub'), 
        refresh_token: sessionStorage.getItem('cronofy_refresh'),
        element_token:this.element_token, 
        created_by: this.userProfile.first_name+' '+ this.userProfile.last_name, 
        created_by_id: this.userProfile.contact_person_id, 
        'summary': this.routeForm.value.summary,
        'description': this.routeForm.value.description,
        'type':  this.routeForm.value.type,
        'location':  this.routeForm.value.location,
      };
      this.service.createInterview(body).subscribe(res => {
        if(res.status==200){
           this.managedAvailability.hide();
          this.routeForm.reset();
          this.service.showMessage({
            message: res.msg ? res.msg : 'Something went Wrong'
          });
        }else{
          this.service.showMessage({
            message: res.msg ? res.msg : 'Something went Wrong'
          });
        }
        
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })



  }

    workingHourForm : FormGroup;
    FormBuilder(){
      console.log("this.vacancyDetails?.type", this.vacancyDetails?.type)
      if(this.type=="project"){
         this.workingHourForm = this.fb.group({
            supervisor: ["", Validators.required],
            staff_id: ["", Validators.nullValidator],
            project_start_date: ["", Validators.nullValidator],
            project_end_date: ["", Validators.nullValidator],
            internship_days: ["", Validators.nullValidator],
            working_hours: ["", Validators.nullValidator],
            // email
            student: [false, Validators.nullValidator],
            student_category: ["", Validators.nullValidator],
            student_template: ["", Validators.nullValidator],
            is_supervisor: [false, Validators.nullValidator],
            supervisor_category: ["", Validators.nullValidator],
            supervisor_template: ["", Validators.nullValidator],
      
            student_html: ["", Validators.nullValidator],
            employer_html: ["", Validators.nullValidator],
            
      
          })
          this.workingHourForm.get("project_start_date")?.setValidators(Validators.required);
          this.workingHourForm.get("project_end_date")?.setValidators(Validators.required);
      }else{
        this.workingHourForm = this.fb.group({
          supervisor: ["", Validators.required],
          internship_start_date: ["", Validators.nullValidator],
          internship_end_date: ["", Validators.nullValidator],
          internship_days: ["", Validators.required],
          working_hours: ["", Validators.required],
          // email
          student: [false, Validators.nullValidator],
          student_category: ["", Validators.nullValidator],
          student_template: ["", Validators.nullValidator],
          is_supervisor: [false, Validators.nullValidator],
          supervisor_category: ["", Validators.nullValidator],
          supervisor_template: ["", Validators.nullValidator],
          student_html: ["", Validators.nullValidator],
          employer_html: ["", Validators.nullValidator],
        })
        this.workingHourForm.get("internship_start_date")?.setValidators(Validators.required);
        this.workingHourForm.get("internship_end_date")?.setValidators(Validators.required);
      }

    }

    categories:any = [];
  getEmailCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
        this.categories = response.data;
    });
  }

  emailTemplateStudentList:any = [];

  selectCategoryStudent(event) {
    const payload = {
      category_id: event
    }
    this.service.getEmailTemplateByCategoryId(payload).subscribe((response: any) => { 
      this.emailTemplateStudentList = response.result;
    });
  }


  emailTemplateList:any = [];

  selectCategory(event) {
    const payload = {
      category_id: event
    }
    this.service.getEmailTemplateByCategoryId(payload).subscribe((response: any) => { 
      this.emailTemplateList = response.result;
    });
  }



  selectedTemplate:any = {};

  async selectTemplate(event) {
    const foundTemplate =await this.emailTemplateList.find(template => template._id === event);
    console.log("foundTemplate", foundTemplate)
    if (foundTemplate) {
      // this.emailReminder.patchValue({
      //   subject: foundTemplate?.subject,
      //   message: foundTemplate?.message
      // });
      this.selectedTemplate = foundTemplate;
      this.selectedTemplate.widgets.values.forEach((email: any) => {
        if (email.data.id=="text") {
          this.workingHourForm.patchValue({
            employer_html: email.data.elementData.value,
            
          })
        //  this.text = email.data.elementData.value;
        }
      });
      this.selectedTemplate.widget = this.sanitizer.bypassSecurityTrustHtml(foundTemplate.widgets.html);
    }
  }
  selectedStudentTemplate:any = '';

  async selectTemplate1(event) {
    const foundTemplate =await this.emailTemplateStudentList.find(template => template._id === event);
    console.log("foundTemplate", foundTemplate)
    if (foundTemplate) {
      // this.emailReminder.patchValue({
      //   subject: foundTemplate?.subject,
      //   message: foundTemplate?.message
      // });
      this.selectedStudentTemplate = foundTemplate;
      this.selectedStudentTemplate.widgets.values.forEach((email: any) => {
        if (email.data.id=="text") {
          console.log("email.data.id", email.data.id);
          this.workingHourForm.patchValue({
            student_html: email.data.elementData.value
          })
        //  this.text = email.data.elementData.value;
        }
      });
      this.selectedStudentTemplate.widget = this.sanitizer.bypassSecurityTrustHtml(foundTemplate.widgets.html);
    }
  }
  showCollapes2:any = '';
  showCollapes1:any = '';
  collapsToggle2(ids: any) {
    if (this.showCollapes2 == ids) {
      this.showCollapes2 = '';
    }
    else {
      this.showCollapes2 = ids
    }
  }

  collapsToggle1(ids: any) {
    if (this.showCollapes1 == ids) {
      this.showCollapes1 = '';
    }
    else {
      this.showCollapes1 = ids
    }
  }

   companyContactList: any = [];
  getCompanyContactList() {
    this.service.getCompanyContactList({company_id:this.userProfile._id}).subscribe((res:any) => {
    
      if (res.status == HttpResponseCode.SUCCESS) {
        this.companyContactList = res.data;
        this.companyContactList = this.companyContactList.map(c => ({
          ...c,
          fullName: `${c.first_name} ${c.last_name}`
        }));
        this.workingHourForm.patchValue({
            supervisor:this.vacancyDetails?.placement_supervisor
        })
      } else {
          this.companyContactList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getSupervisorDetail(email) {
    return this.companyContactList.find(company => company._id === email);
  }

   getStaffMembers() {
      this.service.getStaffMembers({}).subscribe((response: any)=>{
        if (response.status == HttpResponseCode.SUCCESS) {
          this.staffList = response.result;
          console.log(" this.staffList",  this.staffList)
        }
      })
    }

  getStaffName(id) {
    const staff = this.staffList.find(staff => staff._id === id);
    return staff?.first_name + " " + staff?.last_name;
  }

  staffList = [];
  getStaffDetail(email) {
    console.log("this.staffList", this.staffList, email)
    return this.staffList?.find(company => company._id === email);
  }


    @ViewChild('dynamicContainer', { static: false }) dynamicContainer!: ElementRef;
    @ViewChild('dynamicStudentContainer', { static: false }) dynamicStudentContainer!: ElementRef;
  @ViewChild('lockCandidatePlacementStep2Done') lockCandidatePlacementStep2Done: ModalDirective;
  @ViewChild('lockCandidatePlacementProjectStep2') lockCandidatePlacementProjectStep2: ModalDirective;

  
   async addWorkingHours() {


      if(this.vacancyDetails.type=="project"){
          const supervisor = await this.getSupervisorDetail(this.workingHourForm.value.supervisor)
        //     const staff =await this.getStaffDetail(this.workingHourForm.value.staff_id)
        // console.log("staff", staff, this.workingHourForm.value.staff_id);
        
        
            let shtml = '';
              // Get the dynamic container element
            if(this.dynamicStudentContainer && this.dynamicStudentContainer.nativeElement){
              const containerStudentElement = this.dynamicStudentContainer.nativeElement;
        
              // Hide the toolbar
              const stoolbar = containerStudentElement.querySelector('.ql-toolbar');
              if (stoolbar) {
                stoolbar.style.display = 'none';
              }
              
              // Hide any additional toolbars with `.ql-hidden`
              const stoolbar1 = containerStudentElement.querySelector('.ql-hidden');
              if (stoolbar1) {
                stoolbar1.style.display = 'none';
              }
           
                // Hide any additional toolbars with `.ql-hidden`
                const sattachment = containerStudentElement.querySelector('.attachment');
                if (sattachment) {
                 sattachment.style.display = 'none';
                }
              
              // Replace <quill-editor> with a <div>
              const squillEditor = containerStudentElement.querySelector('quill-editor');
              if (squillEditor) {
                const divElement = document.createElement('div');
                divElement.innerHTML = squillEditor.innerHTML;
                squillEditor.replaceWith(divElement);
              }
              
              // Hide all <input> elements inside the container
              const sinputs = containerStudentElement.querySelectorAll('input');
              sinputs.forEach((input) => {
                input.style.display = 'none';
              });
              
              // Now get the updated HTML
              const sfullHtml = containerStudentElement.innerHTML;
              
              // Construct the email template
              shtml = `
              <app-html-email-preview>
                <html lang="en">
                  <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
                  </head>
                  <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
                    <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
                      <tbody>
                        ${sfullHtml}
                      </tbody>
                    </table>
                  </body>
                </html>
              </app-html-email-preview>
              `;
            }
           
            let html = '';
            if(this.dynamicContainer && this.dynamicContainer.nativeElement){
          // Get the dynamic container element
          const containerElement = this.dynamicContainer.nativeElement;
        
          // Hide the toolbar
          const toolbar = containerElement.querySelector('.ql-toolbar');
          if (toolbar) {
            toolbar.style.display = 'none';
          }
          
          // Hide any additional toolbars with `.ql-hidden`
          const toolbar1 = containerElement.querySelector('.ql-hidden');
          if (toolbar1) {
            toolbar1.style.display = 'none';
          }
        
            // Hide any additional toolbars with `.ql-hidden`
            const attachment = containerElement.querySelector('.attachment');
            if (attachment) {
             attachment.style.display = 'none';
            }
          
          // Replace <quill-editor> with a <div>
          const quillEditor = containerElement.querySelector('quill-editor');
          if (quillEditor) {
            const divElement = document.createElement('div');
            divElement.innerHTML = quillEditor.innerHTML;
            quillEditor.replaceWith(divElement);
          }
          
          // Hide all <input> elements inside the container
          const inputs = containerElement.querySelectorAll('input');
          inputs.forEach((input) => {
            input.style.display = 'none';
          });
          
          // Now get the updated HTML
          const fullHtml = containerElement.innerHTML;
          
          // Construct the email template
           html = `
          <app-html-email-preview>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
              </head>
              <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
                <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
                  <tbody>
                    ${fullHtml}
                  </tbody>
                </table>
              </body>
            </html>
          </app-html-email-preview>
          `;
        
            }
           
        
            const payload = {
              placement_id: this.selectedRow?.allocations?.placement_id,
              student_id: this.selectedRow?._id,
              project_start_date: moment(this.workingHourForm.value.project_start_date).format("YYYY-MM-DD"),
              project_end_date: moment(this.workingHourForm.value.project_end_date).format("YYYY-MM-DD"),
              company_id: this.userProfile?._id,
              vacancy_id: this.vacancyDetails?._id,
              // internship_days: this.workingHourForm.value.internship_days,
              // working_hours: this.workingHourForm.value.working_hours,
              supervisor_id:this.workingHourForm.value.supervisor,
              supervisor: supervisor.first_name + ' ' + supervisor.last_name,
              primary_email: supervisor.primary_email,
              primary_phone: supervisor.primary_phone,
              // staff_id: this.workingHourForm.value.staff_id,
              // staff_name: staff.first_name + ' ' + staff.last_name,
              // staff_email: staff.email,
              // staff_phone: staff.phone,
              status: "Placed",
              send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
              student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
              send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
              supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
              student_html:shtml?shtml:undefined,
              employer_html:html?html:undefined,
            }
            this.service.placeStudent(payload).subscribe(res => {
              // this.lockCandidate(true);
              this.service.showMessage({ message: 'Working hours added successfully' });
              this.getVacancyDetails();
              this.getVacanciesStudentsAllocated();
              this.selectedStudentTemplate = null;
               this.lockCandidatePlacementStep2Done.show();
              this.selectedTemplate = null;
             
              // this.FormBuilder()
            }, err => {
              this.service.showMessage({
                message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
              });
            })
      }else{
        const supervisor = this.getSupervisorDetail(this.workingHourForm.value.supervisor)
    
    
    
        let shtml = '';
          // Get the dynamic container element
        if(this.dynamicStudentContainer && this.dynamicStudentContainer.nativeElement){
          const containerStudentElement = this.dynamicStudentContainer.nativeElement;
    
          // Hide the toolbar
          const stoolbar = containerStudentElement.querySelector('.ql-toolbar');
          if (stoolbar) {
            stoolbar.style.display = 'none';
          }
          
          // Hide any additional toolbars with `.ql-hidden`
          const stoolbar1 = containerStudentElement.querySelector('.ql-hidden');
          if (stoolbar1) {
            stoolbar1.style.display = 'none';
          }
      
            // Hide any additional toolbars with `.ql-hidden`
            const sattachment = containerStudentElement.querySelector('.attachment');
            if (sattachment) {
            sattachment.style.display = 'none';
            }
          
          // Replace <quill-editor> with a <div>
          const squillEditor = containerStudentElement.querySelector('quill-editor');
          if (squillEditor) {
            const divElement = document.createElement('div');
            divElement.innerHTML = squillEditor.innerHTML;
            squillEditor.replaceWith(divElement);
          }
          
          // Hide all <input> elements inside the container
          const sinputs = containerStudentElement.querySelectorAll('input');
          sinputs.forEach((input) => {
            input.style.display = 'none';
          });
          
          // Now get the updated HTML
          const sfullHtml = containerStudentElement.innerHTML;
          
          // Construct the email template
          shtml = `
          <app-html-email-preview>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
              </head>
              <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
                <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
                  <tbody>
                    ${sfullHtml}
                  </tbody>
                </table>
              </body>
            </html>
          </app-html-email-preview>
          `;
        }
      
        let html = '';
        if(this.dynamicContainer && this.dynamicContainer.nativeElement){
      // Get the dynamic container element
      const containerElement = this.dynamicContainer.nativeElement;
    
      // Hide the toolbar
      const toolbar = containerElement.querySelector('.ql-toolbar');
      if (toolbar) {
        toolbar.style.display = 'none';
      }
      
      // Hide any additional toolbars with `.ql-hidden`
      const toolbar1 = containerElement.querySelector('.ql-hidden');
      if (toolbar1) {
        toolbar1.style.display = 'none';
      }
    
        // Hide any additional toolbars with `.ql-hidden`
        const attachment = containerElement.querySelector('.attachment');
        if (attachment) {
        attachment.style.display = 'none';
        }
      
      // Replace <quill-editor> with a <div>
      const quillEditor = containerElement.querySelector('quill-editor');
      if (quillEditor) {
        const divElement = document.createElement('div');
        divElement.innerHTML = quillEditor.innerHTML;
        quillEditor.replaceWith(divElement);
      }
      
      // Hide all <input> elements inside the container
      const inputs = containerElement.querySelectorAll('input');
      inputs.forEach((input) => {
        input.style.display = 'none';
      });
      
      // Now get the updated HTML
      const fullHtml = containerElement.innerHTML;
      
      // Construct the email template
      html = `
      <app-html-email-preview>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous">
          </head>
          <body style="width: 100%; font-family: 'DM Sans', sans-serif; height: 100%; background: #fff; margin: 0; padding: 0; box-sizing: border-box; text-align: left; font-weight: 390;">
            <table cellspacing="0" cellpadding="0" width="100%" border="0" style="padding: 0; border-collapse: collapse; margin: 0 auto; max-width: 536px; font-size: 14px; font-weight: 400; line-height: 18px; color: #2F2E41;">
              <tbody>
                ${fullHtml}
              </tbody>
            </table>
          </body>
        </html>
      </app-html-email-preview>
      `;
    
        }
      
    
        const payload = {
          placement_id: this.selectedRow?.allocations?.placement_id,
          student_id: this.selectedRow?._id,
          internship_start_date: moment(this.workingHourForm.value.internship_start_date).format("YYYY-MM-DD"),
          internship_end_date: moment(this.workingHourForm.value.internship_end_date).format("YYYY-MM-DD"),
          company_id: this.userProfile?._id,
          vacancy_id: this.vacancyDetails?._id,
          internship_days: this.workingHourForm.value.internship_days,
          working_hours: this.workingHourForm.value.working_hours,
          supervisor_id:this.workingHourForm.value.supervisor,
          supervisor: supervisor.first_name + ' ' + supervisor.last_name,
          primary_email: supervisor.primary_email,
          primary_phone: supervisor.primary_phone,
          status: "Placed",
          send_email_to_student: this.workingHourForm.value.student?this.workingHourForm.value.student:undefined,
          student_email_template_id:  this.workingHourForm.value.student_template?this.workingHourForm.value.student_template:undefined,
          send_email_to_supervisor: this.workingHourForm.value.is_supervisor?this.workingHourForm.value.is_supervisor:undefined,
          supervisor_email_template_id:this.workingHourForm.value.supervisor_template?this.workingHourForm.value.supervisor_template:undefined,
          student_html:shtml?shtml:undefined,
          employer_html:html?html:undefined,
        }
        this.service.submitWorkingHourFromAdmin(payload).subscribe(res => {
          if(res.status == 200 ){
            if(res.msg==="This student is already placed in another vacancy."){
              this.service.showMessage({ message: res.msg });
              // this.dataSource.data.map((el:any)=>{
              //   if(el.company_id ==this.selectedCandidateForLock.company_id && el._id===this.selectedCandidateForLock.vacancy_id){
              //     el.students.data.map(e=>{
              //       e.status = "Placed";
              //     })
              //   }
              // })
              // this.selectedItem
            }else{
              this.service.showMessage({ message: res.msg?res.msg:'Working hours added successfully' });
              this.getVacancyDetails();
              this.getVacanciesStudentsAllocated();
              this.lockCandidatePlacementStep2Done.show();
              
            }
            
          }
          this.selectedStudentTemplate = null;
          this.selectedTemplate = null;
          // this.FormBuilder()
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
      }
    }
  

    async statusChange(){
      // console.log("this.changeStatusStudent", this.changeStatusStudent,  this.CompaniesData, this.changeStatusStudent.company_info.company_id);

      // let find =await this.CompaniesData.find(el=> el.company_id == this.changeStatusStudent.company_info.company_id);

      // if(find){
      //   let student =await find.students['data'].find(el=> el.student_id == this.changeStatusStudent.student_id);
      //   if(student){
      //     student.status = this.oldStatus? this.oldStatus:'';
      //   }
      // }

      // this.changeStatusStudent = {};
  }
  @ViewChild('placeholderModel', { static: false }) placeholderModel!: ModalDirective;
    @ViewChild('searchpInput') searchpInput: ElementRef;
    chooseValue(){
        // const range = this.editor.getSelection(true);  
        // if (range) {
        //   // const elementHtml = '<button class="custom-btn" (click)="handleClick()">Click me</button>';
        //   this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
          
        // }
        if (this.editor) {
          const range = this.editor.getSelection(true);  // Get the current cursor position
      
          if (range) {
              // this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
              // Prepare the placeholder text to be inserted
              const placeholderText = `&nbsp;{{${this.selectedType} : ${this.selectedItem1}}}&nbsp;`;
      
              // Insert the placeholder text at the current cursor position
              this.editor.clipboard.dangerouslyPasteHTML(range.index, placeholderText);
      
              // Compute the new cursor position
              const newIndex = range.index + placeholderText.length - 10;
      
              // Move the cursor to the end of the inserted placeholder text with a slight delay
              setTimeout(() => {
                  console.log("Setting cursor position to:", newIndex);
                  this.editor.setSelection(newIndex, 0);
                  this.editor.focus();  // Ensure focus remains in the editor
              }, 10); // Delay ensures Quill processes the update
          } else {
              console.log("No valid selection found in the editor");
          }
      }
        setTimeout(() => {
          if (this.selectedType) {
            this.getKey();
          }
        }, 200);
        this.placeholderModel.hide();
        // this.selectedType = '';
        this.selectedItem1 = '';
        this.selectedKey = '';
        // this.placeholderList = [];
        // this.filteredplaceholderList = [];
        // this.copyPlacementTypes();
      }
      selectedItem1:any = '';
      placeholderList:any = [];
    
      //open model
      insertCustomElement() {
        // this.selectedType = '';
        this.selectedItem1 = '';
        this.selectedKey = '';
        // this.placeholderList = [];
        // this.filteredplaceholderList = [];
        // this.copyPlacementTypes();
        // this.closeSendEmailModal.ripple.trigger.click();
        // this.placeholderModel = this.modalService.show(this.placeholderModel, {
        //   ignoreBackdropClick: true,
        //   keyboard: false,
        // });
     
        this.placeholderModel.show();
      
        setTimeout(() => {
          this.cdr.detectChanges(); 
          if (this.searchpInput) {
            this.searchpInput.nativeElement.focus();
          }
        }, 300); 
        console.log("this.placeholderModel", this.placeholderModel);
    
      }
    
    
      filteredplaceholderList:any = [];
      copyPlacementTypes(){
        this.filteredplaceholderList = this.placeholderList;
        // console.log("this.allPlacementTypes", this.filteredplaceholderList);
      }
    
      getKey(){
        this.placeholderList = [];
        this.filteredplaceholderList =  [];
        var obj = {
          type: this.selectedType.toLowerCase()
        }
        this.service.getEmailTemplateKey(obj).subscribe(res => {
          // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
          if (res.status == 200) {
            this.placeholderList = res.db_fields;
            this.copyPlacementTypes();
          } else {
            this.placeholderList = [];
          }
         
        }, err => {
          this.service.showMessage({
            message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
          })
    
        }
        );
      }
    
      search(){
    
      }
    
      @ViewChild('searchInput') searchInput!: ElementRef;
    
      setFocus() {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 0);
      }
    
      applyFilter1(filterValue) {
    
        this.selectedKey = filterValue.target.value
        this.filteredplaceholderList = this.placeholderList.filter(item => {
          return item.title?.toString().toLowerCase().includes(this.selectedKey.toLowerCase());
        });
    
      }
    
    
      onEditorCreated(quill: Quill) {
        this.editor = quill;
        this.editor.focus()
      }
      onContentChanged = (event, data) =>{
        if (event.html) {
          data.data.elementData.value = event.html;
          // console.log("event.html", event.html)
        }
      }
      onSelectionChanged(event: any): void {
        console.log('Selection Changed:', event);
      }

      selectDays(selectedDay) {
        selectedDay.selected = !selectedDay.selected;
        const filteredSelectedDay = this.days.filter(day => day.selected);
        this.workingHourForm.patchValue({
          internship_days: filteredSelectedDay.map(day => day.name)?.join()
        });
      }
    
    
      alreadyPlace:any = null;
      async checkPlaced(): Promise<boolean> {
        return new Promise((resolve, reject) => {
          this.service.checkStudentAlreadyPlaced({
            student_id: this.selectedRow?._id,
            status: "Placed"
          }).subscribe(
            async(res: any) => {
              if (res.status === HttpResponseCode.SUCCESS && res.data && res.data.length>0) {
    
                this.alreadyPlace =res.data;
                // //  this.selectedCandidateForLock.status = this.oldStatus;
                // let find =await this.CompaniesData.find(el=> el.company_id == this.changeStatusStudent.company_info.company_id);
    
                //   if(find){
                //     let student =await find.students['data'].find(el=> el.student_id == this.changeStatusStudent.student_id);
                //     if(student){
                //       student.status = this.oldStatus? this.oldStatus:'';
                //     }
                //   }
                resolve(true);   // student is already placed
              } else {
                resolve(false);  // student not placed
              }
            },
            (err) => {
              this.service.showMessage({
                message: err.error?.errors?.msg || 'Something went Wrong'
              });
              reject(err);
            }
          );
        });
      }

      async checkPlace(){
         let check = await this.checkPlaced();
          console.log(check, "check", this.selectedRow)
          if(check && this.vacancyDetails.type!="project"){
          setTimeout(()=>{
            this.alreadyPlacedModel.show();
          }, 500)
          }else{
            this.lockCandidatePlacement.show();
          }
      }

      handleConfirm() {
      this.confirmMessgae.hide();
        console.log("this.moveTo", this.moveTo)
      if (this.moveTo === 'Rejected') {
        this.updateStatus(this.moveTo);
      } else if (this.moveTo === 'Accepted') {
        if(this.vacancyDetails?.type=='project'){
           this.updateStatus(this.moveTo)
        }else{
          this.preferenceModel.show();
        }
        
      }
    }

      preference:any;
      showPopup(){
        console.log("dontShowAgain", this.dontShowAgain);
        if(!this.dontShowAgain){
          this.confirmMessgae.show();
          return false;
        }
        if(this.moveTo=='Rejected'){
          this.updateStatus(this.moveTo);
        }else if(this.moveTo=='Accepted'){
           if(this.vacancyDetails?.type=='project'){
            this.updateStatus(this.moveTo)
          }else{
            this.preferenceModel.show();
          }
        }else if(this.moveTo=='Interviews'){
          this.updateStatus(this.moveTo);
        }
        
      }
}

// vacancies/vacancy-details


