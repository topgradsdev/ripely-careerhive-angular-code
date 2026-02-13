import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-likert-scale-field',
  templateUrl: './likert-scale-field.component.html',
  styleUrls: ['./likert-scale-field.component.scss']
})
export class LikertScaleFieldComponent implements OnInit {
  @Input() data: any;
  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
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
      type: ['likert-scale'],
      description: [''],
      value: [''],
      newItem: [''],
      scale: [5],
      display: ['vertical'],
      items: this.fb.array([
        this.fb.group({
          item: ['Very Dissatisfied'],
          selected: false
        }),
        this.fb.group({
          item: ['Dissatisfied'],
          selected: false
        }),
        this.fb.group({
          item: ['Neutral'],
          selected: false
        }),
        this.fb.group({
          item: ['Satisfied'],
          selected: false
        }),
        this.fb.group({
          item: ['Very Satisfied'],
          selected: false
        })
      ]),
      required: [false]
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.itemsArray.clear();
      this.textElementForm.patchValue({
        title: this.data.name,
        type: 'likert-scale',
        description: this.data.elementData.description,
        value: this.data.elementData.value,
        display: this.data.elementData.display,
        items: this.data.elementData.items,
        required: this.data.elementData.required?this.data.elementData.required:false,
      });
      if(this.data.elementData && this.data.elementData.items && this.data.elementData.items.length>0){
      this.data.elementData.items.forEach(item => {
        this.itemsArray.push(
          this.fb.group({
            item: [item.item],
            selected: [item.selected]
          })
        )
      });
    }
    
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

  get itemsArray(): FormArray {
    return this.textElementForm.controls["items"] as FormArray;
  }

  scaleView() {
    for (var i = 0; i < 2; i++) {
      if (this.textElementForm.value.scale === 7) {
        this.itemsArray.push(
          this.fb.group({
            item: [''],
            selected: [false]
          })
        )
      } else {
        this.itemsArray.removeAt(7 - (i+1));
      }
    }
  }

  addNewItem() {
    this.itemsArray.push(
      this.fb.group({
        item: [this.textElementForm.value.newItem],
        selected: [false]
      })
    )
    this.textElementForm.patchValue({
      newItem: ''
    })
  }

  deleteItem(index) {
    this.itemsArray.removeAt(index);
  }

  sortItem(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.itemsArray.controls, event.previousIndex, event.currentIndex);
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

    onCancel(): void {
    // this.ngOnInit();
    this.submit();
    // console.log(this.data);
  }
  submit() {
    this.data.actionType = 'submit';
    this.data['oldname'] = this.data.name;
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
