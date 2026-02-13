import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TopgradserviceService } from 'src/app/topgradservice.service';

@Component({
  selector: 'app-image-field',
  templateUrl: './image-field.component.html',
  styleUrls: ['./image-field.component.scss']
})
export class ImageFieldComponent implements OnInit {
  @Input() data: any;
  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
  extenstionList = [
    { id: 'png', name: 'PNG (.png)' },
    { id: 'jpg', name: 'JPG (.jpg)' },
    { id: 'gif', name: 'GIF (.gif)' },
    { id: 'bmp', name: 'BMP (.bmp)' }
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
  
  constructor(private fb: FormBuilder, private service: TopgradserviceService) { }

  ngOnInit(): void {
    console.log("data", this.data);
    this.textElementForm = this.fb.group({
      title: [this.data.name],
      type: ['image'],
      description: [''],
      value: [''],
      extenstions: ['png'],
      size: [5],
      selection_type: ['single'],
      required: [false]
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.textElementForm.patchValue({
        title: this.data.name,
        type: 'image',
        description: this.data.elementData.description,
        value: this.data.elementData.value,
        items: this.data.elementData.items,
        required: this.data.elementData.required,
        extenstions: this.data.elementData.extenstions,
        size: this.data.elementData.size,
        selection_type: this.data.elementData.selection_type,
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


  getImage(event: any) {
    const files = event.target.files[0];
    if (files) {
      // ✅ make sure element is defined
      if (!this.data.element) {
        this.data.element = {};
      }

      this.data.element['value'] = files.name;

      const formData = new FormData();
      formData.append('media', files);

      this.service.uploadOthersMedia(formData).subscribe(
        (resp: any) => {
          this.data.element.value = resp.url;
          this.save();
        },
        (error) => {
          console.error('Upload failed:', error);
        }
      );
    }

    // reset file input so same file can be reselected
    event.target.value = '';
  }

  save() {
    this.data.element.insideSection = this.data.elementData?.insideSection;
    this.data.elementData = this.data.element;
    this.action.emit(this.data);
  }
}
