import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-plain-text-email',
  templateUrl: './plain-text-email.component.html',
  styleUrls: ['./plain-text-email.component.scss']
})
export class PlainTextEmailComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  formName = "New Email Template";
  isEditFormName = false;
  @ViewChild('emailTagPlaceholder') public emailTagPlaceholder: ModalDirective;
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

  emailTemplateForm: FormGroup;
  categories = [];
  placeholders = [];
  selectedTemplate: any;

  constructor(private fb: FormBuilder, private router: Router,
     private service: TopgradserviceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.emailTemplateForm = this.fb.group({
      subject: ['', [Validators.required]],
      category: ['', [Validators.required]],
      message:  ['',  [Validators.required]]
    });
    this.getEmailTemplateCategories();
    this.getEmailTemplatePlaceholders();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.getEmailTemplateById(params.id);
      }
    });
  }

  getEmailTemplateById(id) {
    this.service.getEmailTemplateById({_id: id}).subscribe((response: any) => {
      this.selectedTemplate = response.data[0];
      this.formName = this.selectedTemplate?.template_name;
      this.emailTemplateForm.patchValue({
        subject: this.selectedTemplate.subject,
        category: this.selectedTemplate.category,
        message:  this.selectedTemplate.message
      });
    });
  }

  getEmailTemplateCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => { 
      this.categories = response.data;
    });
  } 
  
  getEmailTemplatePlaceholders() {
    this.service.getEmailTemplatePlaceholders().subscribe((response: any) => { 
      this.placeholders = response.data;
    });
  }

  openEmailTagPlaceholderModal() {
    this.emailTagPlaceholder.show();
  }

  closeEmailTagPlaceholderModal() {
    this.emailTagPlaceholder.hide();
  }

  saveEmailTemplate() {
    if (this.emailTemplateForm.invalid) {
      this.emailTemplateForm.markAllAsTouched();
      return;
    }
    const html_template = document.getElementById("html_template")?.innerHTML;
    let payload: any = {
      subject: this.emailTemplateForm.value.subject,
      category: this.emailTemplateForm.value.category,
      message: this.emailTemplateForm.value.message,
      template_name: this.formName,
      widgets: { html: html_template },
      type: 'plain'
    }
    if (this.selectedTemplate?._id) {
      payload._id = this.selectedTemplate._id;
    }
    this.service.createHtmlTemplate(payload).subscribe((res: any) => {
      this.router.navigate(['/admin/email-templates']);
      this.service.showMessage({
        message:"Email Template saved successfully"
      });        
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  getCategoryName(id) {
    return this.categories.find(category => category._id === id)?.category_title;
  }

}
