import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-field',
  templateUrl: './signature-field.component.html',
  styleUrls: ['./signature-field.component.scss']
})
export class SignatureFieldComponent implements OnInit {
  @Input() data: any;
  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
  // @ViewChild('sPad', { static: true }) signaturePadElement;
  // signaturePad: any;
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

  constructor(private fb: FormBuilder, private elemRef: ElementRef) { }

  ngOnInit(): void {
    this.textElementForm = this.fb.group({
      title: [this.data.name],
      type: ['signature'],
      description: [''],
      value: [''],
      newItem: [''],
      items: this.fb.array([
        this.fb.group({
          item: ['Student'],
          signature: [''],
          date: [''],
          name: ['']
        })
      ]),
      required: [true]
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.itemsArray.clear();
      this.textElementForm.patchValue({
        title: this.data.name,
        type: 'signature',
        description: this.data.elementData.description,
        value: this.data.elementData.value,
        items: this.data.elementData.items,
        required: this.data.elementData.required
      });
      if(this.data.elementData && this.data.elementData.items && this.data.elementData.items.length>0){
      this.data.elementData.items.forEach(item => {
        this.itemsArray.push(
          this.fb.group({
            item: [item.item],
            signature: [''],
            date: [''],
            name: ['']
          })
        )
      });
    }
    }
    if (this.data.elementData.permissions) {
      this.permissions = this.data.elementData.permissions;
    }
    if (!this.data.elementData.permissions){
      this.data.elementData.permissions = this.permissions;
    }
  }

  get itemsArray(): FormArray {
    return this.textElementForm.controls["items"] as FormArray;
  }

  ngAfterViewInit(): void {
    // this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  addNewItem() {
    this.itemsArray.push(
      this.fb.group({
        item: [this.textElementForm.value.newItem],
        date: [''],
        signature: [''],
        name: ['']
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
