import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-description-field',
  templateUrl: './description-field.component.html',
  styleUrls: ['./description-field.component.scss']
})
export class DescriptionFieldComponent implements OnInit {
  @Input() data: any;
  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
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
    console.log("this.data", this.data);
    this.textElementForm = this.fb.group({
      title: [''],
      type: ['description'],
      description: [''],
      value: [''],
      min: [''],
      max: [],
      required: [false]
    });
    if (Object.keys(this.data.elementData).length > 0) {
      console.log("this.data", this.data)
      this.textElementForm.patchValue({
        title: this.data.elementData?.title,
        type: 'description',
        description: this.data.elementData.name,
        value: this.data.elementData.value,
        min: this.data.elementData.min,
        max: this.data.elementData.max,
        required: this.data.elementData.required
      });
    }
    if (this.data.elementData.permissions) {
      this.permissions = this.data.elementData.permissions;
    }
    if (!this.data.elementData.permissions){
      this.data.elementData.permissions = this.permissions;
    }
  }

  updateFormValue() {
    this.textElementForm.patchValue({
      value: this.data.elementData.value
    });
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
    console.log("this.textElementForm.value", this.textElementForm.value);

    this.data.actionType = 'submit';
    this.data.name = 'Description Text';
    this.textElementForm.value.fieldType = 'textEditor'
    this.data.elementData = this.textElementForm.value;
    this.data.elementData.value = this.textElementForm.value.title;
    
    console.log("this.data", this.data);
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
