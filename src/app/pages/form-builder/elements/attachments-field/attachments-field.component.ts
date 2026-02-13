import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attachments-field',
  templateUrl: './attachments-field.component.html',
  styleUrls: ['./attachments-field.component.scss']
})
export class AttachmentsFieldComponent implements OnInit {
  @Input() data: any;
  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
  extenstionList = [
    { id: 'word', name: 'Word Document (.docx, .doc)' },
    { id: 'excel', name: 'Excel (.xlsx, .csv, .xls)' },
    { id: 'pdf', name: 'PDF Document (.pdf)' }
  ];
  isAdvanced = false;
  permissions = {
    student: {
      read: true,
      write: true
    },
    employee: {
      read: true,
      write: true
    },
    staff: {
      read: true,
      write: true
    }
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.textElementForm = this.fb.group({
      title: [this.data.name],
      type: ['attachment'],
      description: [''],
      value: [''],
      extenstions: ['Word Document (.docx, .doc)'],
      size: [5],
      selection_type: ['single'],
      required: [false]
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.textElementForm.patchValue({
        title: this.data.name,
        type: 'attachment',
        description: this.data.elementData.description,
        value: this.data.elementData.value,
        items: this.data.elementData.items,
        required: this.data.elementData.required?this.data.elementData.required:false,
        extenstions: this.data.elementData.extenstions,
        size: this.data.elementData.size,
        selection_type: this.data.elementData.selection_type,
      });
    
    if (this.data.elementData.permissions) {
      this.permissions = this.data.elementData.permissions;
    }
    if (!this.data.elementData.permissions){
      this.data.elementData.permissions = this.permissions;
    }
      }else{
      this.data.elementData = this.textElementForm.value;
       this.data.elementData['permissions'] = this.permissions;
    }
  }
  
  updateFormValue() {
    this.textElementForm.patchValue({
      value: this.data.elementData.value
    });
  }

  onCancel(): void {
    // this.ngOnInit();
    this.submit();
    // console.log(this.data);
  }
  
  deleteElement() {
    this.data.actionType = 'delete';
    this.action.emit(this.data);
  }

  toggleElementSize() {
    this.data.isElementWidthFull = !this.data.isElementWidthFull;
    this.action.emit(this.data);
  }

  submit() {
    this.data.actionType = 'submit';
    this.data.name = this.textElementForm.value.title;
    this.data.elementData = this.textElementForm.value;
    this.data.elementData.permissions = this.permissions;
    this.action.emit(this.data);
  }

  addPermission(type, user) {
    if (type === 'write' && this.permissions[user].write) {
      this.permissions[user].read = true;
    } else if (type === 'read' && !this.permissions[user].read) {
      this.permissions[user].write = false;
    }
  }
}
