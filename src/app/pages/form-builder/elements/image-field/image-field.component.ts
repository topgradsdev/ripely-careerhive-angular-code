import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TopgradserviceService } from 'src/app/topgradservice.service';

@Component({
  selector: 'app-image-field',
  templateUrl: './image-field.component.html',
  styleUrls: ['./image-field.component.scss']
})
export class ImageFieldComponent implements OnInit {
  @Input() data: any = {
    elementData:{
      height: 100,
      width: 100,
      transparency: 100,
    }
  };

  element: any = {
    height: 100,
    width: 100,
    transparency: 100,
    image: "",
    name: "",
  }


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
      title: [''],
      type: ['image'],
      description: [''],
      value: [''],
      width:[100],
      height:[100],
      name:[''],
      transparency:[100],
      extenstions: ['png'],
      size: [5],
      selection_type: ['single'],
      required: [false]
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.textElementForm.patchValue({
        title: this.data.elementData?.title,
        type: 'image',
        description: this.data.elementData.description,
        width: this.data.elementData?.width?this.data.elementData?.width:this.element.width,
        height: this.data.elementData?.height?this.data.elementData?.height:this.element.height,
        name: this.data.elementData?.name?this.data.elementData?.name:this.element.name,
        transparency:  this.data.elementData?.transparency?this.data.elementData?.transparency:this.element.transparency,
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
    if (Object.keys(this.data?.elementData).length > 1) {
      this.element = JSON.parse(JSON.stringify(this.data.elementData));
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
    this.data.elementData.name = this.data.element.name;
    this.data.elementData.value = this.data.element.value;
    console.log("this.data", this.data);
    // return false;
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
          this.data.element = {...this.element};
          // if (!this.data.elementData.permissions){
         this.data.element.permissions = {
            ...this.permissions,
            ...this.data.elementData.permissions
          };
          // }
          this.element.name = resp.name;
          this.element.image = resp.url;
          this.element.value = resp.url;
          
          this.data.element.value = resp.url;
          this.data.element.name = resp.name;
          // this.save();
          if (!this.data.elementData.permissions){
            this.data.elementData.permissions = this.permissions;
          }
          

          this.data.element.insideSection = this.data.elementData?.insideSection;
          // this.data.elementData = 
          this.data.elementData = this.data.element;

          this.data.elementData.value = resp.url;
          this.data.elementData.name = resp.name;
          console.log("this.data", this.data)
         
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
    // if (this.data.elementData.permissions) {
    //   this.permissions = this.data.elementData.permissions;
    // }
   
    console.log("this.data", this.data)
    this.action.emit(this.data);
  }
}
