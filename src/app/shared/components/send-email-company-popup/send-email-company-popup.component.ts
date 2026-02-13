import { Component, Input, EventEmitter, OnChanges, OnInit, Output, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpResponseCode} from '../../enum';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import Quill from 'quill';
import { environment } from '../../../../environments/environment';
// Add custom icon
const icons = Quill.import('ui/icons');
@Component({
  selector: 'app-send-email-company-popup',
  templateUrl: './send-email-company-popup.component.html',
  styleUrls: ['./send-email-company-popup.component.scss']
})
export class SendEmailCompanyPopupComponent implements OnInit {
  // modules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'],        
  //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
  //     ['link']   
  //   ]
  // };
  @Input() modalId: string;
  @Input() type: string;
  @Input() title?: string;
  @Input() titleChange?: boolean ;
  @ViewChild('closeSendEmailModal') closeSendEmailModal;
  @ViewChild('emailPlaceholder') public emailPlaceholder: ModalDirective;
  @ViewChild('emailPreviewModal1') public emailPreviewModal1: ModalDirective;
  domain= environment.domain;
  editorConfig = {
    height: 200,
    menubar: false,
    statusbar: true,
    placeholder: 'Email content',
    plugins: 'linkchecker wordcount table  autosave advlist anchor image link lists media searchreplace visualblocks template',
    toolbar: 'undo redo | bold italic underline | align bullist numlist | blocks | image | placeHolderToken',
    contextmenu: false,
    setup: function (editor) {
      editor.ui.registry.addMenuButton('placeHolderToken', {
        text: '{{...}}',
        fetch: (callback) => {
          const items = [
            {
              type: 'nestedmenuitem',
              text: 'Student',
              getSubmenuItems: () => [
                {
                  type: 'menuitem',
                  text: 'Name',
                  onAction: (_) => editor.insertContent("[[name]]")
                },
                {
                  type: 'menuitem',
                  text: 'Email',
                  onAction: (_) => editor.insertContent("[[email]]")
                },
                {
                  type: 'menuitem',
                  text: 'Password',
                  onAction: (_) => editor.insertContent("[[password]]")
                },
                {
                  type: 'menuitem',
                  text: 'First Name',
                  onAction: (_) => editor.insertContent("[[first_name]]")
                },
                {
                  type: 'menuitem',
                  text: 'Last Name',
                  onAction: (_) => editor.insertContent("[[last_name]]")
                }
              ]
            }
          ];
          callback(items);
        }
      });
    }
  }
  categories = [];
  emailTemplateList = [];
  emailForm: FormGroup;
  @Input() emailType;
  @Input() students;
  selectedTemplate = null;
  @ViewChild('placeholderModel', { static: false }) placeholderModel!: ModalDirective;

  getFileSize(sizeStr: string, decimals: number = 0): string {
    const sizeValue = parseFloat(sizeStr); // Extract numeric value

    if (isNaN(sizeValue)) return 'Invalid Size';

    let size = sizeValue;
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(decimals)} ${units[unitIndex]}`;
  }

  selected = false;
    element: any = {
      size: 16,
      bold: false,
      italic: false,
      underline: false,
      fontFamily: 'Arial',
      color: '#23282c',
      textAlign: 'left',
      value: ''
    }
  
  
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

      selectedLogo = {
        name: 'Instagram',
        logo: environment.domain + 'assets/img/insta.svg',
        link: '',
        selected: true
      };
      // element: any = {
      //   manageLinks: {
      //     logos: [
      //       {
      //         name: 'Instagram',
      //         logo: environment.domain + 'assets/img/insta.svg',
      //         link: '',
      //         selected: true
      //       },
      //       {
      //         name: 'Whatsapp',
      //         logo: environment.domain + 'assets/img/whatsapp.svg',
      //         link: '',
      //         selected: false
      //       },
      //       {
      //         name: 'Facebook',
      //         logo: environment.domain + 'assets/img/fb.svg',
      //         link: '',
      //         selected: false
      //       },
      //       {
      //         name: 'Linkedin',
      //         logo: environment.domain + 'assets/img/linkedin.svg',
      //         link: '',
      //         selected: false
      //       },
      //       {
      //         name: 'Youtube',
      //         logo: environment.domain + 'assets/img/youtube.svg',
      //         link: '',
      //         selected: false
      //       }
      //     ]
      //   },
      //   socialBar: {
      //     direction: 'horizontal',
      //     spacing: 24,
      //     iconSize: 60,
      //     showText: false,
      //     textSize: 20
      //   }
      // }
    
  
  constructor(private service: TopgradserviceService, private fb: FormBuilder, 
    private sanitizer: DomSanitizer, private modalService: BsModalService, private cdr: ChangeDetectorRef) {
     }


  selectedKey:any = '';
  selectedType:any = '';
  editorContent = '';  // Stores editor content
  editor:Quill;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() send: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('dynamicContainer', { static: false }) dynamicContainer!: ElementRef;

  ngAfterViewInit() {
    console.log(this.dynamicContainer.nativeElement.innerHTML); // Ensure it logs properly
  }


  onCancel(): void {
    if (this.cancel.observers.length > 0) {
      this.selectedTemplate = null;
      this.cancel.emit();
    } else {
      console.log('No cancel handler attached'); // Optional: Log or handle differently
    }
  }

  onSend(): void {
    if (this.send.observers.length > 0) {
      this.selectedTemplate = null;
      this.send.emit();
    } else {
      console.log('No send handler attached'); // Optional: Log or handle differently
    }
  }
  chooseValue() {
    if (this.editor) {
      const range = this.editor.getSelection(true);  // Get the current cursor position
  
      if (range) {
          // this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
          // Prepare the placeholder text to be inserted
          const placeholderText = `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`;
  
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
  

    // Optionally, trigger other methods after inserting
    setTimeout(() => {
        if (this.selectedType) {
            this.getKey();  // Perform any additional logic (e.g., fetching key)
        }
    }, 200);

    // Hide the modal after inserting the value
    this.placeholderModel.hide();

    // Reset selectedType, selectedItem, selectedKey for future use
    this.selectedItem = '';
    this.selectedKey = '';
    // this.selectedType = '';
}

  selectedItem:any = '';
  placeholderList:any = [];

  //open model
  insertCustomElement() {
    // this.selectedType = '';
    this.selectedItem = '';
    this.selectedKey = '';
    // this.placeholderList = [];
    // this.copyPlacementTypes();
    
    this.placeholderModel.show();
    setTimeout(() => {
      this.cdr.detectChanges(); 
      if (this.searchpInput) {
        this.searchpInput.nativeElement.focus();
      }
    }, 300); 
    // this.copyPlacementTypes();
    console.log("this.placeholderModel", this.placeholderModel);

  }

  @ViewChild('searchpInput') searchpInput: ElementRef;
  filteredplaceholderList:any = [];
  copyPlacementTypes(){
    this.filteredplaceholderList = this.placeholderList;
    // console.log("this.allPlacementTypes", this.filteredplaceholderList);
  }

  getKey(){
    this.placeholderList = [];
    // this.copyPlacementTypes();
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

  applyFilter(filterValue) {

    this.selectedKey = filterValue.target.value
    this.filteredplaceholderList = this.placeholderList.filter(item => {
      return item.title?.toString().toLowerCase().includes(this.selectedKey.toLowerCase());
    });

  }

  ngOnInit(): void {
  //   this.getEmailCategories();
  //   this.emailForm = this.fb.group({
  //     category_id: ['', [Validators.required]],
  //     template_id: ['', [Validators.required]],
  //     subject: ['', [Validators.required]],
  //     message:  ['',  [Validators.nullValidator]]
  //   });

  this.getCompanyContact()

  console.log("student", this.students, this.emailType);
  }
  selectedContacts: string[] = [];
  contactList:any = [];
  getCompanyContact(){
    if(this.students[0]?.is_child){
       this.service.getCompanyContactList({company_id: this.students[0]?.company_id?this.students[0]?.company_id:this.students[0]?._id}).subscribe((res:any) => {
      if (res.status == 200) {
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
       this.service.getContactList({company_id: this.students[0]?.company_id?this.students[0]?.company_id:this.students[0]?._id}).subscribe((res:any) => {
        if (res.status == 200) {
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
    const currentRange = this.editor.getSelection();
    // console.log("Current range after selection change:", currentRange);
  }

  
  ngOnChanges() {
    this.selectedTemplate = [];
    this.getEmailCategories();
    this.emailForm = this.fb.group({
      category_id: ['', [Validators.required]],
      template_id: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      email_id: ['', [Validators.required]],
      message:  ['',  [Validators.nullValidator]],
      text:  ['',  [Validators.nullValidator]]
    });
    console.log("student", this.students, this.emailType);
    if(this.students.length>0){
      this.getCompanyContact()
    }
  
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

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  selectTemplate(event) {
    const foundTemplate = this.emailTemplateList.find(template => template._id === event);
    if (foundTemplate) {
      this.emailForm.patchValue({
        subject: foundTemplate?.subject,
        message: foundTemplate?.message
      });

      this.selectedTemplate = foundTemplate;
       setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = 0; // or .scrollHeight for bottom
      }, 100);
      this.selectedTemplate.widgets.values.forEach((email: any) => {
        if (email.data.id=="text") {
          this.emailForm.patchValue({
            text: email.data.elementData.value
          })
        }
      });
      console.log("this.selectedTemplate", this.selectedTemplate);
      this.selectedTemplate.widget = this.sanitizer.bypassSecurityTrustHtml(foundTemplate.widgets.html);
     
    }
  }

  cancelEmail() {
    this.emailForm.reset();
  }

  checkmail(){
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

   if (fullHtml && fullHtml.includes('{{')) {
    this.emailPlaceholder.show()
   }else{
      this.sendEmail();
   }
  }

  sendEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
   
   
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
   const html = `
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
   
   // Now you can use `html` as needed
  //  console.log(html);   

  console.log("this.selectedContacts", this.emailForm.value.email_id, "this.contactList", this.contactList);

   const selectedEmails = this.contactList
  .filter(contact => this.emailForm.value.email_id.includes(contact._id))
  .map(contact => contact.primary_email).join(',');
  
    // console.log("this.emailForm.value", this.emailForm.value, this.selectedTemplate, fullHtml)
    this.emailForm.value.text = html;
    this.emailForm.value.html = html;
    let payload: any = {
      subject: this.emailForm.value.subject,
      category_id: this.emailForm.value.category_id,
      template_id: this.emailForm.value.template_id,
      student_ids: this.students.map(student => student._id ?? student.student_id),
      message: this.emailForm.value.message,
      type: this.emailType,
      receiver_type:this.type,
      email_id: selectedEmails,
      html:this.emailForm.value.html,
      text:this.emailForm.value.text
    }
    if (this.emailType === 'remindEmployer') {
      payload['email_id'] = selectedEmails;
      payload['contact_primary_email'] = this.students[0].contact_01_primary_email;
      payload['contact_primary_phone'] = this.students[0].contact_01_primary_phone;
      payload['contact_secondary_phone'] = this.students[0].contact_01_secondary_phone;
      payload['contact_secondary_email'] = this.students[0].contact_01secondary_email;
      payload['receiver_type'] =this.type;
    }

    if (this.emailType === 'vacancy') {
      payload = { 
        email_id: selectedEmails,
        // this.students.map(vacancy => vacancy.company_info[0].contact_01_primary_email).join(),
        // category_id: this.emailForm.value.category_id,
        company_id: this.students[0].company_info[0]?._id,
        template_id: this.emailForm.value.template_id,
        subject: this.emailForm.value.subject,
        message: this.emailForm.value.message,
        receiver_type:this.type,
      };
    }

    if (this.emailType === 'placement_company') {
      payload = { 
        email_id:selectedEmails,
        // this.students.map(company => company.email).join(),
        category_id: this.emailForm.value.category_id,
        company_id: this.students[0].company_id,
        template_id: this.emailForm.value.template_id,
        subject: this.emailForm.value.subject,
        message: this.emailForm.value.message,
        receiver_type:this.type,
      };
    }

    if (this.students[0].eType === 'company_student') {
      payload = { 
        email_id: selectedEmails,
        // this.students.map(company => company.email).join(),
        category_id: this.emailForm.value.category_id,
        company_id: this.students[0].company_id,
        template_id: this.emailForm.value.template_id,
        subject: this.emailForm.value.subject,
        message: this.emailForm.value.message,
        type: this.students[0].eType
      };
    }



    if (this.emailType === 'company') {
      payload = { 
        email_id: selectedEmails,
        // this.students.map(company => company.email).join(),
        category_id: this.emailForm.value.category_id,
        company_id: this.students[0].company_id,
        template_id: this.emailForm.value.template_id,
        subject: this.emailForm.value.subject,
        message: this.emailForm.value.message,
        receiver_type:this.type,
      };
    }

    if (this.emailType === 'users') {
      payload = { 
        email_id: selectedEmails,
        // this.students.map(student => student.email).join(),
        category_id: this.emailForm.value.category_id,
        template_id: this.emailForm.value.template_id,
        subject: this.emailForm.value.subject,
        message: this.emailForm.value.message,
        receiver_type:this.type,
      };
    }
    payload['html'] = this.emailForm.value.html;
    payload['text'] = this.emailForm.value.html;
    
    this.service.sendEmail(payload).subscribe((res: any) => {
      this.emailPlaceholder.hide()
      this.emailForm.reset();
     
      this.closeSendEmailModal.ripple.trigger.click();  
      if (res.status == HttpResponseCode.SUCCESS) {
        this.selectedTemplate = null;
        this.service.showMessage({
          message:"Email sent successfully"
        });     
       
      }else{
        this.service.showMessage({
          message: res.msg ? res.msg : 'Something went Wrong'
        });
      }
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }
  openEmailPreviewModal() {
    this.emailPreviewModal1.show();
  }

  closeEmailPreviewModal() {
    this.emailPreviewModal1.hide();
  }



  files = [];
  
 getFilDoc(event: Event, data: any[]) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  filesArray.forEach(file => {
    if (file.size > 3145728) { // 3 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 3 MB. Please select a smaller file.`
      });

      // Clear file input so same file can be selected again
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      data.push(resp);
    });
  });

  // Clear input after all files processed
  input.value = '';
}


  removeFile(index, data) {
    data.splice(index, 1);
  }
}
