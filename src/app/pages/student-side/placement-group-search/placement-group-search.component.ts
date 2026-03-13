import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { LoaderService } from 'src/app/loaderservice.service';
@Component({
  selector: 'app-placement-group-search',
  templateUrl: './placement-group-search.component.html',
  styleUrls: ['./placement-group-search.component.scss']
})
export class PlacementGroupSearchComponent implements OnInit {
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

  searchText: string = '';



  googlePlaceOptions: any = {
    // componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    types: ['(regions)']
  }

  constructor(private fb: FormBuilder,
    private service: TopgradserviceService,private loaderService:LoaderService) { }

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
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.getStudentProfile();
  }
  getStudentProfile() {
    this.service.getStudentProfile({}).subscribe((res: any) => {
      this.getPlacementGroups(res.record)
    });
  }


  // getPlcamentTypes(data:any = {}) {
  //   let payload = {placement_id:  data && data?.placement_id? data.placement_id:  this.userProfile?.placement_id,"type":"student"};
  //   this.service.getPlacementTypes(payload).subscribe((response: any) => {
  //     if (response.status == HttpResponseCode.SUCCESS) {
  //       this.placementTypes = response.result;
  //       this.placementTypes.map(el=>{
  //         const randIndex = Math.floor(Math.random() * this.svgIcons.length);
  //         el.selectedImage = this.svgIcons[randIndex];
  //         el.showMore = false;
  //       })
  //     }
  //   });
  // }

  isFuture(dateStr: string): boolean {
    const timestamp = new Date(dateStr).getTime();
    return timestamp > Date.now();
  }

  // daysLeft(dateStr: string): number {
  //   const timestamp = new Date(dateStr).getTime();
  //   const now = Date.now();
  //   const diff = timestamp - now;

  //   if (diff <= 0) return 0; // already passed
  //   return Math.ceil(diff / (1000 * 60 * 60 * 24)); // days left
  // }

  isOneWeekOrLess(dateStr: string): boolean {
    return this.daysLeft(dateStr) <= 7;
  }

  daysLeft(dateStr: string): number {
    const timestamp = new Date(dateStr).getTime(); // e.g. "2025/09/16"
    const now = Date.now();
    const diff = timestamp - now;

    if (diff <= 0) return 0; // already passed

    // Convert milliseconds → days
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  loader:boolean = true;

  selectedGroup:any= null;
  getPlacementGroups(status:string = 'active') {
    let userDetail = JSON.parse(localStorage.getItem('userSDetail'));
      const payload = {
        status:'active', 
        allow_students_join_program:true,
        search:this.searchText,
        limit: 10, 
        offset: 0,
        student_id:userDetail?._id
      }
      this.loaderService.show();
      // this.loader = true;
      this.service.getPlacementGroupSearch(payload).subscribe((response: any)=>{
        if (response.status == HttpResponseCode.SUCCESS) {
          this.placementTypes = response.result;
         this.placementTypes.map(el=>{
          const randIndex = Math.floor(Math.random() * this.svgIcons.length);
          el.selectedImage = this.svgIcons[randIndex];
          el.showMore = false;
        })
        this.loaderService.hide();
        this.loader = false;
        } else {
          this.placementTypes = [];
          this.loader = false;
          this.loaderService.hide();
        }
      })
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
  @ViewChild('viewEligiblityCriteria') viewEligiblityCriteria;
  


  selected:any = null
  async submitForm() {
    // || this.signaturePad.isEmpty()
    // if (this.placementTypeForm.invalid) {
    //   this.placementTypeForm.markAllAsTouched();
    //   return;
    // }
    // this.getFile(() => {
        const payload = {
          placementType: this.selected.type,
          placement_type_id: this.selected.workflow_type_id,
          placement_type: this.selected,
          self_source: this.selected.self_source,
        };

        console.log(":payload", payload);

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

objectKeys(obj: any): string[] {
  return obj ? Object.keys(obj) : [];
}

  allFiltersTrue(data): boolean {
    if (!data) {
    return false; // or true depending on your logic
  }
  return Object.values(data).every(val => val === true);
}


  prettyKey(key: string): string {
      const map: Record<string, string> = {
        placementGroups: 'Simulation Groups',
        major: 'Major',
        minor: 'Minor',
        priority: 'Priority',
        gpa: 'WAM',
        gpa_min_points: 'WAM',
        gpa_max_points: 'WAM',
        credit_min_points: 'Credit Points',
        credit_max_points: 'Credit Points',
        cohort_start_date: 'Cohort Start Date',
        cohort_end_date: 'Cohort End Date',
        course_start_date: 'Course Start Date',
        course_end_date: 'Course End Date',
        internship_start_date: 'Internship Start Date',
        internship_end_date: 'Internship End Date',
        graduation_date: 'Graduation Date'
      };

      if (map[key]) return map[key];

      // fallback: prettify automatically
      return key
        .replace(/_/g, ' ')                // underscores → spaces
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → spaced
        .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
  }


//   private formatDate(dateStr: any): string {
//   if (!dateStr) return '';
//   const d = new Date(dateStr).t;
//   return d.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// }

private formatDate(dateStr: any): string {
  if (!dateStr) return '';

  const d = new Date(dateStr);

  const day = String(d.getDate()).padStart(2, '0');        // dd
  const month = String(d.getMonth() + 1).padStart(2, '0'); // MM (month is 0-indexed)
  const year = d.getFullYear();                             // yyyy

  return `${day}/${month}/${year}`;
}


  formatValue(val: any): string {
  if (Array.isArray(val)) {
    return val.join(', ');
  }
  return val;
}

getValue(key: string, value: any): string {
  // Handle arrays
  if (Array.isArray(value)) {
    return this.mapIds(key, value);
  }

  // Handle comma-separated string IDs
  if (typeof value === 'string' && value.includes(',')) {
    const ids = value.split(',').map(v => v.trim());
    return this.mapIds(key, ids);
  }

  // Handle single string IDs
  if (typeof value === 'string') {
    return this.mapIds(key, [value]);
  }

  // Fallback
  return value;
}

private mapIds(key: string, ids: string[]): string {
  // if (key === 'assigned_to') {
  //   return ids.map(id => this.getAssignedToName(id)).join(', ');
  // }
  // if (key === 'placementGroups') {
  //   return ids.map(id => this.getPlacementGroupTitle(id)).join(', ');
  // }
  return ids.join(', ');
}

// getAssignedToName(id: string): string {
//   const assigned = this.studentFilters?.assignedTo?.find(a => a._id === id);
//   return assigned ? `${assigned.first_name} ${assigned.last_name}`.trim() || "Unknown" : id;
// }

// getPlacementGroupTitle(id: string): string {
//   const group = this.studentFilters?.placementGroups?.find(pg => pg._id === id);
//   return group ? group.title : id;
// }
  // convert(data: any) {
  //   this.selectedGroup.allCriteria1 = Object.keys(this.selectedGroup.allCriteria)
  //     .filter(key => this.selectedGroup.allCriteria[key] !== null && this.selectedGroup.allCriteria[key] !== undefined && 
  //                   (Array.isArray(this.selectedGroup.allCriteria[key]) ? this.selectedGroup.allCriteria[key].length > 0 : true))
  //     .map(key => ({ key, value: this.selectedGroup.allCriteria[key] }));
  // }


convert(data: any) {
  this.selectedGroup.allCriteria1 = Object.entries(this.selectedGroup.allCriteria || {})
    .filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
    .map(([key, value]) => {
      // ✅ Handle arrays → join with commas
      if (Array.isArray(value)) {
        return { key: this.prettyKey(key), name: key.toLowerCase(), value: value.join(", ") };
      }

      // ✅ GPA → range
      if (key === "gpa_min_points") {
        const min = this.selectedGroup.allCriteria?.gpa_min_points;
        const max = this.selectedGroup.allCriteria?.gpa_max_points;
        return { key: "WAM", name: "gpa", value: min === max ? `${min}` : `${min} to ${max}` };
      }

      // ✅ Credit Points → range
      if (key === "credit_min_points") {
        const min = this.selectedGroup.allCriteria?.credit_min_points;
        const max = this.selectedGroup.allCriteria?.credit_max_points;
        return { key: "Credit Points", name: "credit_points", value: min === max ? `${min}` : `${min} to ${max}` };
      }

      // ✅ Date ranges (_sdate + _edate)
      // if (key.endsWith("_sdate")) {
      //   const endKey = key.replace("_sdate", "_edate");
      //   const start = this.formatDate(value);
      //   const end = this.formatDate(this.selectedGroup.allCriteria?.[endKey]);
      //   return {
      //     key: this.prettyKey(key.replace("_sdate", "")) + " Date", // e.g. Graduation Date
      //     name: key.replace("_sdate", "").toLowerCase(),
      //     value: `${start} to ${end}`,
      //   };
      // }
      if (key.endsWith("_sdate")) {
        const endKey = key.replace("_sdate", "_edate");
        const start = this.formatDate(value);
        const end = this.formatDate(this.selectedGroup.allCriteria?.[endKey]);

        return {
          key: this.prettyKey(key.replace("_sdate", "")) + " Date",
          // 👇 force correct mapping so metCriteria works
          name: key.replace("_sdate", "_date").toLowerCase(),
          value: `${start} to ${end}`,
        };
      }


      // ✅ ISO date strings
      if (typeof value === "string" && value.includes("T") && value.includes("Z")) {
        return { key: this.prettyKey(key), name: key.toLowerCase(), value: this.formatDate(value) };
      }

      // ✅ Default case
      return { key: this.prettyKey(key), name: key.toLowerCase(), value };
    })
    // ✅ Remove unwanted keys using `name`
    .filter(
      (entry) =>
        entry &&
        !entry.name.endsWith("_edate") && // remove *_edate
        entry.name !== "gpa_max_points" &&
        entry.name !== "credit_max_points"
    );
}



}
