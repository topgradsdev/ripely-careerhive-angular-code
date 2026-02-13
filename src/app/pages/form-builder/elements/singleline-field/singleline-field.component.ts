import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-singleline-field',
  templateUrl: './singleline-field.component.html',
  styleUrls: ['./singleline-field.component.scss']
})
export class SinglelineFieldComponent implements OnInit {
  @Input() data: any;
  @Input() allField: any;

  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
  constructor(private fb: FormBuilder, private Service: TopgradserviceService, private activatedRoute: ActivatedRoute, private service: TopgradserviceService) { }
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
    console.log("this.data", this.data);
    this.textElementForm = this.fb.group({
      title: [this.data.name],
      type: ['single-line'],
      description: [''],
      value: [''],
      min: [''],
      max: [],
      required: [false],
      Autofill: ['No Autofill'],
      field: [''],
      alias:['']
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.textElementForm.patchValue({
        title: this.data.name,
        type: 'single-line',
        description: this.data.elementData.description,
        value: this.data.elementData.value,
        min: this.data.elementData.min,
        max: this.data.elementData.max,
        required: this.data.elementData.required?this.data.elementData.required:false,
        Autofill: this.data.elementData.Autofill,
        field: this.data.elementData.field,
        alias:this.data.elementData.alias,
      });
      if (this.data.elementData.permissions) {
        this.permissions = this.data.elementData.permissions;
      }
    }else{
      this.data.elementData = this.textElementForm.value;
      this.data.elementData['permissions'] = this.permissions;
    }
     console.log("this.data", this.data);
  }

  ngOnChanges(): void {
    console.log("this.data", this.data);
    if (!this.data.elementData.permissions){
      this.data.elementData.permissions = this.permissions;
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

  toggleElementSize() {
    console.log("this.data.isElementWidthFull", this.data.isElementWidthFull);
    this.data.isElementWidthFull = !this.data.isElementWidthFull;
    console.log("this.data.isElementWidthFull update", this.data.isElementWidthFull);
    this.action.emit(this.data);
  }
  

  deleteElement() {
    // if(this.data?.logic && this.data?.logic?.logic_id){
    //   this.removeLogicModel.show();
    // }else{
        this.data.actionType = 'delete';
        this.action.emit(this.data);
    // }
    
 
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


  formList: any = [];
  getFormList() {
    const payload = {
      skip: 0,
      limit: 100
    }
    this.Service.getAllForms(payload).subscribe(res => {
      console.log("res", res);
      //   // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
      if (res.code == 200) {
        this.formList = res.data;
        if (this.data.elementData.Autofill) {
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
    // this.checkExist({ e: { target: { value: filterValue.name } } });

  }

  showError: boolean = false;
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

    async setTitle(title: string) {
      if (!title) return; // exit early if no title provided
      console.log("this.selectType", this.selectType, "title", title)
      // Case 1: Employer_Field or Student_Field
      if (this.selectType === "Employer_Field" || this.selectType === "Student_Field") {
        console.log("this.formFields?.widgets?.values", this.formFields?.widgets?.values)
        const find = this.formFields?.widgets?.values?.find((el: any) => el.alias.trim().toString() == title.trim().toString());
        console.log(find, title);

        if (find) {
          this.textElementForm.patchValue({
            title: find.name,
            alias: find.alias,
          });

          // Trigger existence check with found name
          await this.checkExist({ target: { value: find.name } });
        }
      } 
      // Case 2: Other types
      else {
        this.textElementForm.patchValue({
          title,
        });

        // Trigger existence check with original title
        await this.checkExist({ target: { value: title } });
      }
    }


  get values() {
    return this.formFields?.widgets?.values || [];
  }
}
