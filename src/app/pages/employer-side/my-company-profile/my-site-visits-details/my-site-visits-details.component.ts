import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from 'src/app/topgradservice.service';
import { Lightbox } from 'ngx-lightbox';
import { HttpResponseCode } from 'src/app/shared/enum';
import heic2any from "heic2any";

@Component({
  selector: 'app-my-site-visits-details',
  templateUrl: './my-site-visits-details.component.html',
  styleUrls: ['./my-site-visits-details.component.scss']
})
export class MySiteVisitsDetailsComponent implements OnInit {

  detailsContainer: boolean = false;
  employerProfile = null;
  selectedImage:any;
  note:any;
  selectedNoteIndex = null;
  displayedColumns: string[] = [
    'image',
    'uploadedBy',
    'uploadDate',
    'actions',];
  customOptionsPopup: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  companyId = null;
  site_visit_id = null;
  selectedSiteVisit = null;
  siteVisitForm: FormGroup;
  noteValue = "";
  userDetail = null;

  constructor(private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder, private router:Router, private lightbox: Lightbox) { }

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.companyId) {
        this.site_visit_id = parseInt(params?.site_visit_id);
        this.companyId = params.companyId;
        this.getEmployerProfile();
         this.getCompanyContactList();
      }
    });

    this.siteVisitForm =  this.fb.group({ 
      date: ["", Validators.required],
      time: ["", Validators.required],
      recorded_by: ["", Validators.required],
      supervisor: ["", Validators.required]
    });
  }

    companyContactList: any = [];
    getCompanyContactList() {
      this.service.getCompanyContactList({company_id:this.companyId}).subscribe((res:any) => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.companyContactList = res.data;
          this.companyContactList = this.companyContactList.map(c => ({
            ...c,
            fullName: `${c.first_name} ${c.last_name}`
          }));
        } else {
            this.companyContactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }

  goBack() {
    // this.location.back();
      this.router.navigate(['/employer/my-company-profile'], { queryParams: { company_id: this.companyId, tab:'site' } });
  }

  detailsEdit() {
    this.detailsContainer = !this.detailsContainer;
    this.siteVisitForm.patchValue(this.selectedSiteVisit);
  }

  // getUploadedPictures(event: Event) {
  //   const input = event.target as HTMLInputElement;

  //   if (input?.files?.length) {
  //     const files = Array.from(input.files); // ✅ convert FileList to Array<File>

  //     files.forEach(file => {
  //       const formData = new FormData();
  //       formData.append('media', file);

  //       this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
  //         this.selectedSiteVisit.pictures.unshift({
  //           image: resp,
  //           uploadedBy: `${this.userDetail?.first_name} ${this.userDetail?.last_name}`,
  //            visable:false
  //         });
  //         this.cdr.detectChanges();
  //       });

      
  //     });

  //     console.log("selectedSiteVisit?.pictures", this.selectedSiteVisit?.pictures);
  //     input.value = ''; // clear file input
  //   }
  // }
    getUploadedPictures(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input?.files?.length) {
      const files = Array.from(input.files); // convert FileList to Array<File>
  
      files.forEach(async (file) => {
        let uploadFile: File | Blob = file;
  
        // 🧩 Convert HEIC -> JPEG before upload
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
          try {
            const convertedBlob: any = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });
  
            // Rebuild as File for FormData
            uploadFile = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), {
              type: "image/jpeg",
            });
          } catch (err) {
            console.error("HEIC conversion failed:", err);
            return; // skip upload if conversion fails
          }
        }
  
        const formData = new FormData();
        formData.append("media", uploadFile);
  
        this.service.uploadOthersMedia(formData).subscribe({
          next: (resp: any) => {
            this.selectedSiteVisit.pictures.unshift({
              image: resp,
              uploadedBy: `${this.userDetail?.first_name} ${this.userDetail?.last_name}`,
              visable: false,
            });
            this.cdr.detectChanges();
          },
          error: (err) => console.error("Upload failed:", err),
        });
      });
  
      console.log("selectedSiteVisit?.pictures", this.selectedSiteVisit?.pictures);
      input.value = ""; // clear file input
    }
  }

  saveUploadedPictures() {
    this.updateSiteVisit();
    document.getElementById('cancel')?.click();
  }

  get visiblePictures() {
    return this.selectedSiteVisit?.pictures?.filter(p => p.visable) || [];
  }


  getEmployerProfile() {
    const payload = {
      _id: this.companyId
    }
    this.service.getEmployerProfile(payload).subscribe(response => {
      this.employerProfile = response.record;
      this.selectedSiteVisit = this.employerProfile?.site_visits.find(visit => visit.site_visit_id === this.site_visit_id);
     
    });
  }

   updateSiteVisit() {

 
    this.selectedSiteVisit?.pictures.forEach(el => {
        el.visable = true;
      });

      this.employerProfile.site_visits = this.employerProfile.site_visits.map(visit => {
        if (visit.site_visit_id === this.site_visit_id) {
          if(this.siteVisitForm.value?.recorded_by){
            return {
              ...visit,
              ...this.siteVisitForm.value,
              pictures: this.selectedSiteVisit?.pictures ?? visit.pictures,
              notes: this.selectedSiteVisit?.notes ?? visit.notes,
            };
          }else{
            return {
            ...visit,
              pictures: this.selectedSiteVisit?.pictures ?? visit.pictures,
              notes: this.selectedSiteVisit?.notes ?? visit.notes,
            };
          }
          
        }
        return visit;
      });

    const payload = {
      site_visits: this.employerProfile?.site_visits,
      _id: this.companyId
    }
    // console.log("payload",payload);
    // return false;
    this.updateEmployerProfile(payload);
  }

  updateEmployerProfile(payload) {
    this.service.SubmitEmployerProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Site visit updated successfully"
      });
      
      this.getEmployerProfile();
      // this.detailsEdit();
      this.detailsContainer = false;
      this.siteVisitForm.patchValue(this.selectedSiteVisit);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

 
  get sortedNotes() {
    return this.selectedSiteVisit?.notes?.slice().sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }) || [];
  }


  addNotes() {
      let userDetail:any = JSON.parse(localStorage.getItem('userDetail'));
    let note = {title:this.noteValue, created_by_name:userDetail?.first_name+' '+userDetail?.last_name, created_by:userDetail?.first_name?._id, created_at:new Date().toISOString(), updated_at:new Date().toISOString()};
    this.selectedSiteVisit.notes.push(note);
    this.updateSiteVisit();
    this.noteValue = "";
    document.getElementById('cancel')?.click();
  }

  editNotes() {
    let userDetail:any = JSON.parse(localStorage.getItem('userDetail'));
    let note = {title:this.noteValue, created_by_name:userDetail?.first_name+' '+userDetail?.last_name, created_by:userDetail?.first_name?._id, created_at:this.selectedSiteVisit.notes[this.selectedNoteIndex].created_at, updated_at:new Date().toISOString()};
    this.selectedSiteVisit.notes[this.selectedNoteIndex] = note;
    this.updateSiteVisit();
    this.noteValue = "";
    this.selectedNoteIndex = null;
    document.getElementById('cancel')?.click();
  }

  deleteNote() {
    this.selectedSiteVisit.notes.splice(this.selectedNoteIndex, 1);
    this.updateSiteVisit();
    this.noteValue = "";
    this.selectedNoteIndex = null;
    document.getElementById('cancel')?.click();
  }

  deletePicture(i) {
    this.selectedSiteVisit.pictures.splice(i, 1);
  }

  deleteSiteVisit() {
    const index = this.employerProfile?.site_visits.findIndex(visit => visit.site_visit_id === this.site_visit_id);
    this.employerProfile.site_visits.splice(index, 1);
    const payload = {
      site_visits: this.employerProfile?.site_visits,
      _id: this.companyId
    }
    this.updateEmployerProfile(payload);
    this.location.back();
  }

  openLightbox(array, index: number): void {
    console.log("array, index", array, index)
    let data = array
      .filter(p => p?.image?.url) // only include if src is valid
      .map(p => ({
        src: p.image.url,
        caption: p.image.caption || '', // optional
        thumb: p.image.url // or use a smaller thumbnail if available
      }));
    this.lightbox.open(data, index);
    // setTimeout(() => {
    //   const existingBtn = document.querySelector('.lightbox-close-btn');
    //   if (!existingBtn) {
    //     const btn = document.createElement('span');
    //     btn.className = 'lightbox-close-btn';
    //     btn.innerHTML = '&times;';
    //     btn.onclick = () => this.closeLightbox();
    //     const container = document.querySelector('.lightboxContainer');
    //     if (container) container.appendChild(btn);
    //   }
    // }, 100);
  }

  closeLightbox(): void {
    this.lightbox.close();
  }

}
