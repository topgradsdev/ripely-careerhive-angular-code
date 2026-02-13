import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-workflow-type-form',
  templateUrl: './workflow-type-form.component.html',
  styleUrls: ['./workflow-type-form.component.scss']
})
export class WorkflowTypeFormComponent implements OnInit {
  @ViewChild('sPad', {static: true}) signaturePadElement;
  signaturePad: any;
  placementTypeForm: FormGroup;
  signatureUrl: string = "";
  successPage: boolean = false;
  userProfile: any;
  placementTypes = [];
  googlePlaceOptions: any = {
    // componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    types: ['(regions)']
  }

  constructor(private fb: FormBuilder,
    private service: TopgradserviceService, private route: ActivatedRoute, private location:Location) {
     }
    placement_id:any = '';
  ngOnInit(): void {
    this.placementTypeForm = this.fb.group({
      placementType: ['', [Validators.required]],
      placement_type_id: ['', [Validators.nullValidator]],
      passportNumber: ['', [Validators.nullValidator]],
      countryOfPassport: ['', [Validators.nullValidator]],
      dob: ['', [Validators.nullValidator]],
      trn: ['', [Validators.nullValidator]],
      vgn: ['', [Validators.nullValidator]],
      signature: [''],
      name: [''],
      date: ['']
    });
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.route.queryParams.subscribe(params => {
      console.log("params", params)
      this.placement_id = params['placement_id']
      this.getPlcamentTypes();
      this.getStudentProfile();
    });
  
  }
  ngOnChanges() {
    // this.route.queryParams.subscribe(params => {
    //   console.log("params", params)
    //   this.placement_id = params['placement_id']
    //   this.getPlcamentTypes();
    //   this.getStudentProfile();
    // });
  }
  studentdata:any = {};
  getStudentProfile() {
    this.service.getStudentProfileForProject(
      {
        "_id":this.userProfile._id,
        "placement_id":this.placement_id
    }
    ).subscribe((res: any) => {
      this.studentdata = res.record;
      // this.getPlcamentTypes(res.record)
      this.getPlcamentTypes();
    });
  }


  getPlcamentTypes() {
    let payload = {placement_id: this.placement_id,"type":"student"};
    console.log("payload", payload);
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result;
      }
    });
  }

 

  selectPlacementType(event) {
    const placementType = this.placementTypes.find(placement => placement.workflow_type_id === event)
    this.placementTypeForm.patchValue({
      placementType: placementType.type,
      placement_type_id: placementType.workflow_type_id
    });
  }
  @ViewChild('closeConfirmModal') closeConfirmModal;


  async submitForm() {
    // || this.signaturePad.isEmpty()
    if (this.placementTypeForm.invalid) {
      this.placementTypeForm.markAllAsTouched();
      return;
    }
    // this.getFile(() => {
        // const payload = {
        //   placementType: this.placementTypeForm.value.placementType,
        //   placement_type_id: this.placementTypeForm.value.placement_type_id,
        //   placement_type: this.placementTypeForm.value
        // };

        // console.log(":payload", payload);

        // this.successPage = false;
        // this.service.updateStudentProfile(payload).subscribe(res => {
        //   this.successPage = true;
        //   this.service.showMessage({
        //     message: "Placement type form submitted successfully"
        //   });
        //   this.closeConfirmModal.ripple.trigger.click();
        //   this.userProfile['placement_type'] = payload;
        //   localStorage.setItem("userDetail", JSON.stringify(this.userProfile));
        //   localStorage.setItem('displayPlacementTypeSection', JSON.stringify(true));
        // }, err => {
        //   this.service.showMessage({
        //     message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        //   });
        // })
    // });

    let payload = {
     
        placement_type: this.placementTypeForm.value.placementType,
        placement_type_id: this.placementTypeForm.value.placement_type_id,
        placement_id: this.placement_id,
        student_id: this.userProfile._id,
        company_id: this.studentdata.company_allocation?.[0]?.company_id ?? null,
        vacancy_id: this.studentdata.company_allocation?.[0]?.vacancy_id ?? null,
        status: this.studentdata.company_allocation?.[0]?.status ?? null,
        last_created_by: this.userProfile.first_name+' '+ this.userProfile.last_name, 
        last_created_by_id: this.userProfile._id, 
      };
      this.service.projectEditStudentStatus(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.successPage = true;
          this.service.showMessage({
            message: "Placement Type selected successfully"
          });
          this.closeConfirmModal.ripple.trigger.click();
        }
      })

  }

  cancel() {
    this.placementTypeForm.reset();
    this.signaturePad.clear();
  }

  handleAddressChange(event: any) {
    if (event.geometry && event.name && event.formatted_address) {
      this.placementTypeForm.patchValue({
        countryOfPassport: event.formatted_address
      });
    }
  }

  gotoback(){
    this.location.back();
  }
}
