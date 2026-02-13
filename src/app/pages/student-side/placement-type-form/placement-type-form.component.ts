import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-placement-type-form',
  templateUrl: './placement-type-form.component.html',
  styleUrls: ['./placement-type-form.component.scss']
})
export class PlacementTypeFormComponent implements OnInit {
  @ViewChild('sPad', {static: true}) signaturePadElement;
  signaturePad: any;
  placementTypeForm: FormGroup;
  signatureUrl: string = "";
  successPage: boolean = false;
  userProfile: any;
  placementTypes = [];

  svgIcons: string[] = [
    '../../../../assets/icons/w1.png',
    '../../../../assets/icons/w2.png',
    '../../../../assets/icons/w2.png',
  ];


  googlePlaceOptions: any = {
    // componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    types: ['(regions)']
  }

  constructor(private fb: FormBuilder,
    private service: TopgradserviceService, private route: ActivatedRoute ) { }
placementId:any = null;
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
      self_source:[''],
      name: [''],
      date: ['']
    });
        
    this.route.queryParams.subscribe(params => {
      console.log(params['id']);         // placement id
      this.placementId = params['id'];
      this.getPlcamentTypes1();
    });

    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.getStudentProfile();
  }
  getStudentProfile() {
    this.service.getStudentProfile({}).subscribe((res: any) => {
      if(!this.placementId){
         this.getPlcamentTypes(res.record)
      }
     
    });
  }


  getPlcamentTypes(data:any = {}) {
    let payload = {placement_id:  data && data?.placement_id? data.placement_id:  this.userProfile?.placement_id,"type":"student"};
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result;
        this.placementTypes.map(el=>{
          const randIndex = Math.floor(Math.random() * this.svgIcons.length);
          el.selectedImage = this.svgIcons[randIndex];
          el.showMore = false;
        })
      }
    });
  }

  getPlcamentTypes1() {
    let payload = {placement_id:  this.placementId,"type":"student"};
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result;
        this.placementTypes.map(el=>{
          const randIndex = Math.floor(Math.random() * this.svgIcons.length);
          el.selectedImage = this.svgIcons[randIndex];
          el.showMore = false;
        })
      }
    });
  }
  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  getFile() {
    if (this.signaturePad.isEmpty()) {
      // alert('Please provide a signature first.');
    } else {
      const dataURL = this.signaturePad.toDataURL('image/svg+xml');
      const file = this.dataURLToBlob(dataURL);
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadMedia(formData).subscribe((resp: any) => {
        this.placementTypeForm.patchValue({
          signature: resp.url
        });
      });
    }
  }

  download(dataURL, filename) {
    if (navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1) {
      window.open(dataURL);
    } else {
      const blob = this.dataURLToBlob(dataURL);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
    }
  }

  dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  cancelSignature() {
    this.signaturePad.clear();
    this.placementTypeForm.patchValue({
      signature: ""
    });
  }

  selectPlacementType(event) {
    const placementType = this.placementTypes.find(placement => placement.workflow_type_id === event)
    this.placementTypeForm.patchValue({
      placementType: placementType.type,
      placement_type_id: placementType.workflow_type_id,
      self_source: placementType.self_source
    });
  }
  @ViewChild('closeConfirmModal') closeConfirmModal;


  selected:any = null
  async submitForm() {
    // || this.signaturePad.isEmpty()
    // if (this.placementTypeForm.invalid) {
    //   this.placementTypeForm.markAllAsTouched();
    //   return;
    // }
    // this.getFile(() => {
    // if(this.placementId){

    // }else{

    // }

    if(this.placementId){
        const payload ={
          "student_id": [
              this.userProfile._id
          ],
          "placementType": this.selected.type,
          "placement_type_id": this.selected.workflow_type_id,
          "placement_student_progress": "",
          placement_type: this.selected,
          "placement_id": this.placementId,
          self_source: this.selected.self_source,
      }
        console.log(":payload", payload);
        // return false;

        this.successPage = false;
        this.service.editStudent(payload).subscribe(res => {
          this.successPage = true;
          this.service.showMessage({
            message: "Placement Type selected successfully"
          });
          this.closeConfirmModal.ripple.trigger.click();
          this.userProfile['placement_type'] = payload;
          localStorage.setItem("userSDetail", JSON.stringify(this.userProfile));
          localStorage.setItem('displayPlacementTypeSection', JSON.stringify(true));
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
    }else{
        const payload = {
          placementType: this.selected.type,
          placement_type_id: this.selected.workflow_type_id,
          placement_type: this.selected,
          self_source: this.selected.self_source,
        };

        console.log(":payload", payload);
        // return false;

        this.successPage = false;
        this.service.updateStudentProfile(payload).subscribe(res => {
          this.successPage = true;
          this.service.showMessage({
            message: "Placement Type selected successfully"
          });
          this.closeConfirmModal.ripple.trigger.click();
          this.userProfile['placement_type'] = payload;
          localStorage.setItem("userSDetail", JSON.stringify(this.userProfile));
          localStorage.setItem('displayPlacementTypeSection', JSON.stringify(true));
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
    }

      
    // });
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
}
