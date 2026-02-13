import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TopgradserviceService } from '../../../../topgradservice.service';

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent implements OnInit {
  @Input() data: any;
  @Input() allField: any;
  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
  constructor(private fb: FormBuilder, private Service : TopgradserviceService) { }
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

  ngOnInit(): void {
    this.getFormList();
    this.textElementForm = this.fb.group({
      title: [this.data.name],
      type: ['number'],
      description: [''],
      value: [''],
      min: [''],
      max: [],
      required: [false],
      Autofill:['No Autofill'],
      field:[''],
      alias:['']
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.textElementForm.patchValue({
        title: this.data.name,
        type: 'number',
        description: this.data.elementData.description,
        value: this.data.elementData.value,
        min: this.data.elementData.min,
        max: this.data.elementData.max,
        required: this.data.elementData.required?this.data.elementData.required:false,
        Autofill: this.data.elementData.Autofill,
        field: this.data.elementData.field,
        alias: this.data.elementData.field,
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
   onCancel(): void {
    // this.ngOnInit();
    this.submit();
    // console.log(this.data);
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
    this.data['oldname'] = this.data.name;
    this.data.name = this.textElementForm.value.title;
    this.data.elementData = this.textElementForm.value;
    this.data.removeData = this.removeData;
    this.data.elementData.permissions = this.permissions;
    this.action.emit(this.data);
  }
  formList:any = [];
  getFormList(){
    const payload = {
      skip: 0,
      limit: 100
    }
      this.Service.getAllForms(payload).subscribe(res => {
        console.log("res", res);
        //   // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
        if (res.code == 200) {
          this.formList = res.data;
          if(this.data.elementData.Autofill){
            this.getKey(this.data.elementData.Autofill);
          }
        } else {
          this.formList = [];
        }
        
      }, err => {
        this.Service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
  }

  selectType:any = "";
  removeData = "";
  formFields: any = {};
  async getKey(filterValue) {
    console.log("filterValue", filterValue);
    if (filterValue == "No Autofill") {
      this.removeData = this.textElementForm.value.title;
      this.formFields = {
        widgets:{values:''}
      };
      this.textElementForm.patchValue({
        field:''
      });
      return false;
    }

    this.selectType = filterValue;


    this.selectType = filterValue;

    if(filterValue == "Employer_Field"){
      this.Service.getDBColumns({"type":"employer"}).subscribe(res => {
        if (res.status == 200) {
          this.formFields = {
            widgets:{
              values: res.db_fields
            }
          }
        } else {
          this.formFields = {
              widgets:{
                values: []
              }
            }
        }
      }, err => {
        this.Service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
      });

    }else  if(filterValue == "Student_Field"){
      this.Service.getDBColumns({"type":"student"}).subscribe(res => {
        if (res.status == 200) {
          this.formFields = {
            widgets:{
              values: res.db_fields
            }
          }
        } else {
          this.formFields = {
              widgets:{
                values: []
              }
            }
        }
      }, err => {
        this.Service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
      });

    }else{
      let find = await this.formList.find(el => el._id == filterValue);
      console.log("find", find);
      if (find) {
          if (find.type == "multi_step") {
              let values = [];
              await find.widgets.values.forEach(el => {
                  if (el && el.component && Array.isArray(el.component) && el.component.length) {
                      values = [...values, ...el.component];
                  } else {
                    values = [...values, {...el}];
                  }
              });
              let data = find;
              data.widgets.values = values; // No need for `await` here.
              this.formFields = data;
          } else {
              this.formFields = find;
          }
      }      
    }
  }


  showError:boolean = false;
    async checkExist(event) {


    let find = null;
    if(this.allField && this.allField.length>0){
 // Use for...of loop instead of find() for asynchronous handling
    for (const el of this.allField) {
      if (el.name.toLowerCase().includes('step')) {
        if (el.component.length > 0) {
          // Loop over el.component and check for the condition
          for (const e of el.component) {
            // e.index !== this.data.index && 
            if (e.name === event.target.value) {
              find = el; // Found a match
              break;
            }
          }
        }
      } else {
        console.log("come else");
        if (event.index !== this.data.index && el.name === event.target.value) {
          find = el; // Found a match
          break;
        }
      }
      if (find) {
        break;  // Exit outer loop if a match is found
      }
    }

    }

    console.log("this.data ", this.data )
    if(this.data && this.data.componentName && this.data.componentName.length>0){
 // Use for...of loop instead of find() for asynchronous handling
      find = this.data.componentName.find(e => e===event.target.value && e!==this.data.name)
    }

    console.log("find", find)
   
    if (find) {
      this.showError = true;
    } else {
      this.showError = false;
    }

  // Update form title
  const fieldValue = this.textElementForm.value?.field;
  if (fieldValue) {
    this.textElementForm.patchValue({
      title: event.target.value || fieldValue
    });
  }
  }

  addPermission(type, user) {
    if (type === 'write' && this.permissions[user].write) {
      this.permissions[user].read = true;
    } else if (type === 'read' && !this.permissions[user].read) {
      this.permissions[user].write = false;
    }
  }

  async setTitle(title){
    if(title){
      if(this.selectType === "Employer_Field" || this.selectType === "Student_Field"){
        let find  = await  this.formFields.widgets.values.find(el=>el.alias == title);
        console.log(find);
        if(find){
          this.textElementForm.patchValue({
            title:find.name,
            alias:title
          })
             this.checkExist({ target: { value: find.name } });
        }
       
      }else{
        this.textElementForm.patchValue({
          title:title
        })
        this.checkExist({ target: { value: title } });
      }
      // this.checkExist({ target: { value: title } });
    }
  }

}
