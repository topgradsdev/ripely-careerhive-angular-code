import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpResponseCode } from 'src/app/shared/enum';

@Component({
  selector: 'app-employer-onboarding',
  templateUrl: './employer-onboarding.component.html',
  styleUrls: ['./employer-onboarding.component.scss']
})
export class EmployerOnboardingComponent implements OnInit {
  isDisabledNav = false;
  companyInfoForm: FormGroup;
  contactInfoform: FormGroup;
  industryList = [];
  subIndustryList = [];
  googlePlaceOptions: any = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: true,
    types: []
    // types: ['(regions)']
  }

  @ViewChild('skipModel') skipModel: ModalDirective;

  constructor(private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router) { }
loggedInUserId:any = '';
userProfile:any = null;
  ngOnInit(): void {
    const userProfile = JSON.parse(localStorage.getItem("userDetail"));
    this.userProfile = userProfile;
    this.loggedInUserId = userProfile.contact_person_id;
    this.companyInfoForm = this.fb.group({
      company_name: ['', Validators.required],
      abn_acn: ['', Validators.required],
      address: ['', Validators.required],
      company_phone: ['', Validators.required],
      suburb: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
      country: ['', Validators.required],
      web_address: ['', Validators.required],
      industry_id: ['', Validators.required],
      sub_industry_id: ['', Validators.required],
      no_of_employees: ['', Validators.required],
      different_alias: [false, Validators.nullValidator],
      company_alias: ['', Validators.nullValidator],
    });

    this.companyInfoForm.get('different_alias')?.valueChanges.subscribe(value => {
      const selectedCompanyCtrl = this.companyInfoForm.get('company_alias');
      if (value) {
        selectedCompanyCtrl?.setValidators([Validators.required]);
      } else {
        selectedCompanyCtrl?.clearValidators();
      }
      selectedCompanyCtrl?.updateValueAndValidity();
    });
    
    this.contactInfoform = this.fb.group({
      contacts: this.fb.array([
        this.fb.group({
          _id: ["", Validators.nullValidator],
          first_name: ["", Validators.required],
          last_name: ["", Validators.required],
          role: ["", Validators.required],
          primary_email: [
            "",
            [
              Validators.required,
              // Validators.email,
              // Validators.pattern(
              //   "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$"
              // ),
            ],
          ],
          secondary_email: [
            "",
            [
              // Validators.pattern(
              // "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$"
              // ),
              // Validators.email,
            ],
          ],
          department_id:[null, Validators.required],
          primary_phone: ["", Validators.required],
          secondary_phone: ["", [
            Validators.pattern(/^\d{1}\s\d{3}\s\d{3}\s\d{3}$/), // Format: 0 123 456 789
            Validators.minLength(12),
            Validators.maxLength(13)
          ]], // No validators, fully optional
          preferred_contact: [false], // Optional
          updatedAt:[new Date().toISOString()],
          createddAt:[new Date().toISOString()]
        }),
      ]),
    });
    this.getdepartmenList();
    this.getIndustryList();
    this.getEmployerProfile(userProfile?._id);
  }


  departmentList: any = []
  getdepartmenList() {
    this.service.getdepartments({}).subscribe((res:any) => {
    
      if (res.status == HttpResponseCode.SUCCESS) {
        this.departmentList = res.data;
      } else {
          this.departmentList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  
  employerdata:any = {};

  getEmployerProfile(employerId) {
    const payload = {
      _id: employerId
    }
    this.service.getEmployerProfile(payload).subscribe(response => {
      console.log("response", response);
      this.employerdata = response.record || {};
     
      this.getSubIndustries(response.record?.industry_id); 
      // this.companyInfoForm.patchValue(response.record);
      this.getContactList(response?.record?._id);

      const userProfile = JSON.parse(localStorage.getItem("userDetail") || '{}');
       // Loop through all form controls
       if (!userProfile.preferred_contact) {
        Object.keys(this.companyInfoForm.controls).forEach(controlName => {
          const control = this.companyInfoForm.get(controlName);
          const value = response.record[controlName];

          if (control) {
            control.setValue(value);

            // Disable if value exists, else enable
            if (value !== null && value !== undefined && value !== '') {
              control.disable();
            } else {
              control.enable();
            }
          }
        });

        this.companyInfoForm.get('abn_acn').disable();
        this.companyInfoForm.get('company_name').disable();


       
      }else{
        this.companyInfoForm.patchValue(response.record);

          this.companyInfoForm.get('abn_acn').disable();
        this.companyInfoForm.get('company_name').disable();
      }
       this.getBusinessName();
      // if (response?.record?.contact_person?.length > 0) {
      //   this.contactArray.clear();
      //   response?.record?.contact_person.forEach((contact, i) => {
      //     console.log("contact", contact);
      //     this.addContact(false);
      //     this.contactArray.controls[i].patchValue(contact);
      //   });
      // }
    });
  }

  isReadonly(value: any): boolean {
   

    // // If preferred_contact does not exist, then readonly if value exists
    // if (!userProfile.preferred_contact) {
    //   return value !== null && value !== undefined && value !== '';
    // }

    // If preferred_contact exists, return false (not readonly)
    return false;
  }



  contactList: any = [];
  // getContactList(id) {
  //   this.service.getContactList({company_id:id}).subscribe((res:any) => {
    
  //     if (res.status == HttpResponseCode.SUCCESS) {
  //       this.contactList = res.data;
  //       this.contactList = this.contactList.map(c => ({
  //         ...c,
  //         fullName: `${c.first_name} ${c.last_name}`
  //       }));
  //       if (this.contactList?.length > 0) {
  //         this.contactArray.clear();
  //         this.contactList.forEach((contact, i) => {
  //           console.log("contact", contact);
  //           this.addContact(false);
  //           this.contactArray.controls[i].patchValue(contact);
  //         });
  //       }
  //     } else {
  //         this.contactList = [];
  //     }
  //   }, err => {
  //     this.service.showMessage({
  //       message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //     });
  //   })
  // }

getContactList(id: string) {
  const loggedInUser = JSON.parse(localStorage.getItem("userDetail") || '{}');
  const loggedInUserId = loggedInUser.contact_person_id;

  this.service.getonboardingContactList({ company_id: id }).subscribe((res: any) => {
    if (res.status === HttpResponseCode.SUCCESS) {
      this.contactList = res.data.map(c => ({
        ...c,
        fullName: `${c.first_name} ${c.last_name}`
      }));
      if (this.contactList.length > 0) {
        this.contactArray.clear();
      if (!loggedInUser.preferred_contact) {
        this.contactList.forEach((contact, i) => {
          this.addContact(false);
          this.contactArray.controls[i].patchValue(contact);

          // Disable if it's NOT the logged-in user's contact
          if (contact._id !== loggedInUserId) {
            this.contactArray.controls[i].disable();
          } else {
            this.contactArray.controls[i].enable();
          }
        });

        }else{
         this.contactList.forEach((contact, i) => {
            this.addContact(false);
            this.contactArray.controls[i].patchValue(contact);
          });
        }
      }

      console.log("this.contactArray", this.contactArray)

    } else {
      this.contactList = [];
    }
  }, err => {
    this.service.showMessage({
      message: err.error?.errors?.msg || 'Something went wrong'
    });
  });
}
  get contactArray(): FormArray {
    return this.contactInfoform.controls["contacts"] as FormArray;
  }

  addContact(isCheckValidation: boolean) {
    // Ensure `contactArray` is valid
    if (!this.contactArray.valid) {
      // Mark all controls as touched to trigger validation errors
      this.contactArray.markAllAsTouched();
  
      // Exit if validation checking is required
      if (isCheckValidation) {
        return;
      }
    }
  
    // Add a new contact to the array
    this.contactArray.push(
      this.fb.group({
        _id: ["", Validators.nullValidator],
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        role: ["", Validators.required],
        primary_email: [
          "",
          [
            Validators.required,
            // Validators.email,
            // Validators.pattern(
            //   "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$"
            // ),
          ],
        ],
        secondary_email: [
          "",
          [
            // Validators.pattern(
            // "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$"
            // ),
            // Validators.email,
          ],
        ],
        department_id:[null, Validators.required],
        primary_phone: ["", Validators.required],
        secondary_phone: ["", [
          Validators.pattern(/^\d{1}\s\d{3}\s\d{3}\s\d{3}$/), // Format: 0 123 456 789
          Validators.minLength(12),
          Validators.maxLength(13)
        ]], // Optional
        preferred_contact: [false],// Optional
        updatedAt:[new Date().toISOString()],
        createddAt:[new Date().toISOString()]
      })
    );
  }
  

  removeContact(index) {
    this.contactArray.removeAt(index);
  }

  // addSpacesInNumber() {
  //   this.companyInfoForm.controls.company_phone.patchValue(this.companyInfoForm.value.company_phone.replace(/[^\dA-Z]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ').trim())
  //   const startWithZero = /^04/g;
  //   const num = this.companyInfoForm.value.company_phone.split(" ").join("");
  //   if (!startWithZero.test(num) && this.companyInfoForm.value.company_phone.length > 2) {
  //     this.companyInfoForm.controls.company_phone.setErrors({ pattern: true });
  //   }
  //   const val = this.companyInfoForm.value.company_phone.slice(2, 13).split(" ").join("");
  //   const pattern = /(\d)\1{7}/g;
  //   if (pattern.test(val) && val.length === 8) {
  //     this.companyInfoForm.controls.company_phone.setErrors({ pattern: true });
  //   }
  // }



  addSpacesInNumber() {
    // Remove non-numeric characters
    const rawNumber = this.companyInfoForm.value.company_phone.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the form control value with the formatted number
    this.companyInfoForm.controls.company_phone.patchValue(formattedNumber.trim());
  
    // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      this.companyInfoForm.controls.company_phone.setErrors({ pattern: true });
      return;
    }
  
    // Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      this.companyInfoForm.controls.company_phone.setErrors({ pattern: true });
      return;
    }
  }


  addSpacesInNumber1(arrayIndex: number, type: string): void {
    // Access the FormArray
    const contactsArray = this.contactInfoform.get('contacts') as FormArray;
  
    // Check if the index is valid
    if (arrayIndex < 0 || arrayIndex >= contactsArray.length) {
      console.error(`Index ${arrayIndex} is out of bounds for the FormArray`);
      return;
    }
  
    // Access the specific group in the FormArray by index
    const contactGroup = contactsArray.at(arrayIndex) as FormGroup;
  
    // Access the specific control within the group
    const control = contactGroup.get(type);
  
    // If the value is empty, set the errors to null and return
    if (!contactGroup.value[type]) {
      control.setErrors(null); // Clear any existing errors
      return;
    }
  
    if (!control) {
      console.error(`Control '${type}' does not exist in the form group at index ${arrayIndex}`);
      return;
    }
  
    // Get the raw value from the control
    const rawInput = control.value || ''; // Default to an empty string if null/undefined
  
    // Ensure rawInput is a string before calling replace
    if (typeof rawInput !== 'string') {
      console.error(`Value of control '${type}' is not a string:`, rawInput);
      return;
    }
  
    // Remove all non-numeric characters (e.g., spaces, letters)
    const rawNumber = rawInput.replace(/[^\d]/g, '');
  
    // Dynamically format the number with spaces (e.g., 1 234 567 890)
    const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  
    // Update the control value with the formatted number
    control.patchValue(formattedNumber.trim(), { emitEvent: false });
  
    // Validation: Ensure the length is valid (10 to 15 digits)
    if (rawNumber.length < 10 || rawNumber.length > 15) {
      control.setErrors({ pattern: true });
      return;
    }
  
    // Validation: Check for repeating digits (e.g., 11111111)
    const repeatingPattern = /(\d)\1{7}/; // 8 consecutive identical digits
    if (repeatingPattern.test(rawNumber)) {
      control.setErrors({ pattern: true });
      return;
    }
  
    // Clear errors if validation passes
    control.setErrors(null);
  }
  

 addSpacesInABN() {
  let abn_acn = this.companyInfoForm.value.abn_acn.replace(/[^\dA-Z]/g, '').trim(); // Remove non-numeric characters

  // Check if the length of the ABN is greater than or equal to 2
  if (abn_acn.length >= 2) {
    const firstTwoDigits = abn_acn.slice(0, 2); // Get the first two digits
    const remainingDigits = abn_acn.slice(2); // Get the remaining digits

    // Add spaces after every 3rd digit of the remaining part
    const formattedRemaining = remainingDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Concatenate the first two digits with the formatted remaining part
    abn_acn = `${firstTwoDigits} ${formattedRemaining}`;
    
    // Patch the formatted value back to the control
    this.companyInfoForm.controls.abn_acn.patchValue(abn_acn.trim());

    // Ensure the total length is 11 digits (excluding spaces)
    const cleanedValue = abn_acn.split(' ').join('');
    if (cleanedValue.length !== 11) {
      this.companyInfoForm.controls.abn_acn.setErrors({ pattern: true });
      return;
    }

    // Check for a repeating pattern of 8 identical digits in the ABN
    const val = cleanedValue.slice(2); // Exclude the first two digits
    const pattern = /(\d)\1{9}/g;
    if (pattern.test(val)) {
      this.companyInfoForm.controls.abn_acn.setErrors({ pattern: true });
      return;
    }

    // Clear the error if no issues
    this.companyInfoForm.controls.abn_acn.setErrors(null);
  }
}


  nextStep(stepper: MatStepper) {
    console.log("(this.companyInfoForm", this.companyInfoForm.value, this.companyInfoForm.invalid)
    if (this.companyInfoForm.invalid) {
      this.companyInfoForm.markAllAsTouched();
      return;
    }
    stepper.next();
  }

  getIndustryList() {
    let param = { search: '' };
    this.service.getindustry(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.industryList = res.data;
    })
  }

  selectIndustry(event: any) {
    this.companyInfoForm.patchValue({
      sub_industry_id:""
    });
    this.getSubIndustries(event);
  }

  getSubIndustries(indystry_id: number) {
    let param = { parent_id: indystry_id }
    this.service.getsubIndustry(param).subscribe(res => {
      this.subIndustryList = res.data;
    })
  }

  submitEmployerProfile() {
    console.log("this.contactInfoform.invalid", this.contactInfoform.invalid, this.contactInfoform, this.contactInfoform.valid, "his.companyInfoForm", this.companyInfoForm)
    // if (this.contactInfoform.invalid) {
    //   this.contactInfoform.markAllAsTouched();
    //   return false;
    // }

    console.log('Initial Form Validation:', this.contactInfoform.invalid);

    if (this.contactInfoform.invalid) {
      this.contactInfoform.markAllAsTouched();
      this.contactInfoform.updateValueAndValidity();

      const contactsArray = this.contactArray;
      contactsArray.controls.forEach((group: FormGroup, index: number) => {
        console.log(`Group ${index} Errors:`, group.errors);
        Object.keys(group.controls).forEach((controlName) => {
          const control = group.get(controlName);
          console.log(`${controlName} Errors:`, control?.errors);
        });
      });

      return;
    }

    // If form is valid, proceed with submission logic
    console.log('Form is valid:', this.contactInfoform.value);

    const payload = {
      contact_person: this.contactInfoform.value.contacts,
      company_profile: true,
      ...this.companyInfoForm.value
    }
    this.service.SubmitEmployerProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Employer profile updated successfully"
      });

      setTimeout(() => {
        let data = JSON.parse(localStorage.getItem("userDetail"));
        data.company_name =this.companyInfoForm.value.company_name?this.companyInfoForm.value.company_name :this.employerdata?.company_name; 
        localStorage.setItem("userDetail", JSON.stringify(data));
        this.skipModel.show();
      }, 500);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  handleAddressChange(event: any) {
    // if (event.geometry && event.name && event.formatted_address) {
    //   this.companyInfoForm.patchValue({
    //     address: event.formatted_address
    //   });
    // }
    if (event.geometry && event.name && event.formatted_address) {
      const filteredPostalCodes = event.address_components.filter(component => {
        if (component.types.includes('country')) {
          this.companyInfoForm.patchValue({
            country: component.long_name
          });
        } else if (component.types.includes('administrative_area_level_1')) {
          this.companyInfoForm.patchValue({
            state: component.short_name
          });
        } else if (component.types.includes('locality')) {
          this.companyInfoForm.patchValue({
            suburb: component.long_name
          });
        } else if (component.types.includes('postal_code')) {
          this.companyInfoForm.patchValue({
            postal_code: component.long_name
          });
        }
        return component.types.includes('postal_code');
      })
      const post_code = filteredPostalCodes.map(component => component.long_name).join(', ');
      const formattedAddress = event.formatted_address.replace(post_code, "").replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',').replace(/\s*,/g, ',').replace(/,\s*$/, '').trim();
      this.companyInfoForm.patchValue({
        address: formattedAddress,
        // postal_code: post_code
      });
    }
  }

  selectPreferredContact(index) {
    this.contactArray.controls.forEach((contact, i) => {
      if (index === i) {
        contact.patchValue({
          preferred_contact: true
        });
      } else {
        contact.patchValue({
          preferred_contact: false
        });
      }
    });
  }


  hasAtLeastOnePreferredContact(): boolean {
    const contacts = this.contactInfoform.get('contacts') as FormArray;
    return contacts.controls.some(contact =>
      contact.get('preferred_contact')?.value === true
    );
  }

  hasTouchedPreferred(): boolean {
    const contacts = this.contactInfoform.get('contacts') as FormArray;
    return contacts.controls.some(contact =>
      contact.get('preferred_contact')?.touched
    );
  }


    getPreferredContactCount(deptId: any): number {
      return this.contactArray.controls.filter(ctrl =>
        ctrl.get('preferred_contact')?.value &&
        ctrl.get('department_id')?.value === deptId
      ).length;
    }

        onPreferredChange(index: number): void {
        const ctrl = this.contactArray.at(index);
        const deptId = ctrl.get('department_id')?.value;

        const preferredCount = this.getPreferredContactCount(deptId);

        if (preferredCount > 2) {
          ctrl.get('preferred_contact')?.setValue(false);
           this.service.showMessage({
            message:'Maximum 3 preferred contacts allowed per department.'
          });
          // alert('Maximum 3 preferred contacts allowed per department.');
        }
      }


      
    businessNameList:any = []

    getBusinessName() {
      const emailControl = this.companyInfoForm.get('abn_acn');
      const email = emailControl?.value;
      if (!email || emailControl?.invalid) return;

        this.service.getBusinessName({abn_acn:email}).subscribe((res:any) => {
          console.log("res", res);
          if (res.code === 200 && res.data) {
            this.businessNameList = res.data && res.data.BusinessName?res.data.BusinessName:[]
          } else {
            this.businessNameList = [];
          }
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
      }

      emailTakenIndex:any = null;

      checkEmailExists(index) {
        const emailControl = this.contactArray.at(index).get('primary_email');
        const emailValue = emailControl?.value;

        if (!emailValue) return;

        this.service.cehckEmailExistCompnayLogin({ email: emailValue}).subscribe(
          (res: any) => {
            if (res.code === 200) {
              if(res.result){
                 this.emailTakenIndex = index;
                 emailControl?.setErrors({ emailExists: true });
              }else{
                 this.emailTakenIndex = null;
                if (emailControl?.hasError('emailExists')) {
                  emailControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                }
              }
            } else {
                this.emailTakenIndex = null;
                if (emailControl?.hasError('emailExists')) {
                  emailControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                }
            }
          },
          err => {
            this.service.showMessage({
              message: err.error.errors?.msg || 'Something went wrong',
            });
          }
        );
      }

}
