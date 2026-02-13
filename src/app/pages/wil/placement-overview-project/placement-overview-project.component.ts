import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Utils } from "../../../shared/utility";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { TopgradserviceService } from "../../../topgradservice.service";
import { HttpResponseCode } from "../../../shared/enum";
import { ModalDirective } from "ngx-bootstrap/modal";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { FileIconService } from "../../../shared/file-icon.service";

@Component({
  selector: "app-placement-overview-project",
  templateUrl: "./placement-overview-project.component.html",
  styleUrls: ["./placement-overview-project.component.scss"],
})
export class PlacementOverviewProjectComponent implements OnInit {
  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link"],
    ],
  };
  activeTab: string = "tab1";
  id: any;
  pass: String = "password";
  proceedFlow: any = "";
  imageURL: string = "../../../../assets/img/banner_linkedin.svg";
  placementOverView: FormGroup;
  publishPlacementGroup: FormGroup;
  confirmPassword: FormGroup;
  overviewEditForm: boolean = false;
  @Input() mode: string;
  @Output() placementDetail = new EventEmitter<any>();
  overAllCount = {
    eligibleStudent: null,
    pendingApproval: null,
    pendingPlacement: null,
    placed: null,
  };
  placementTypes = [];
  placementCategories = [];
  placementIndustries = [];
  placementGroupDetails = {
    _id: null,
    title: null,
    description: null,
    code: null,
    background: null,
    publish_at: null,
    publish_on: null,
    updated_at: null,
    start_date: null,
    end_date: null,
    industry_id: null,
    industry: null,
    category_id: null,
    category_name: null,
    students: [],
    staff: [],
    created_by: null,
    is_publish: null,
  };
  staffIds = [];
  password = null;
  publishPlacement = {
    publishedOn: null,
    additionalEmailOnPublication: false,
  };
  staffControl = new FormControl([]);
  categories = [];
  emailTemplateList = [];
  todayDate: string;
  minDate: any;
  maxDate: any;
  @ViewChild("closePublishModal") closePublishModal;
  @ViewChild("closeConfirmPasswordModal") closeConfirmPasswordModal: any;
  @ViewChild("closePasswordModal") closePasswordModal: any;

  showModalBox: boolean = false;
  publishPlacementGroupFormValues: any;
  private httpWithoutInterceptor: HttpClient;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public utils: Utils,
    private service: TopgradserviceService,
    private http: HttpClient, private httpBackend: HttpBackend, private fileIconService: FileIconService
  ) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }

  setActiveTab(tab: string, $event?: Event) {
    if ($event) $event.preventDefault();
    this.activeTab = tab;
  }

  ngOnInit(): void {
      // document.getElementById("publishedDoneErrorPopup")?.click();
    this.todayDate = Utils.convertDate(this.todayDate, "DD/MM/YY");
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get("id");
    });
    this.placementGroupDetails._id = this.id;


    // setTimeout(()=>{
    //   document.getElementById("publishedDoneErrorPopup")?.click();
    // }, 500)

    this.overviewEditForm = this.mode == "edit" ? true : false;
    this.placementOverView = new FormGroup({
      background: new FormControl(""),
      title: new FormControl(""),
      code: new FormControl(""),
      description: new FormControl(""),
      category_id: new FormControl("", Validators.required),
      category_name: new FormControl(""),
      industry_id: new FormControl("", Validators.required),
      industry: new FormControl(""),
      staff_id: new FormControl("", []),
      start_date: new FormControl("", Validators.required),
      end_date: new FormControl("", Validators.required),
    });

  //  this.formConteroller();

  //   this.onChangePublishOn({ value: "Publish Instantly" });

    this.confirmPassword = new FormGroup({
      password: new FormControl("", [Validators.required]),
    });
    this.getPlacementOverviewDetails();
    this.getPlacementProjectDetail();
    this.getPlacementCategories();
    this.getPlacementIndustries();
    this.getEmailCategories();
    this.getPlacementTypes();
    this.getStaffMembers();
  }

  ngAfterViewInit(): void {
   this.formConteroller();
   this.onChangePublishOn({value: 'Publish Instantly'});
  }

  formConteroller(){
     this.publishPlacementGroup = new FormGroup({
      publish_on: new FormControl("Publish Instantly"),
      start_date: new FormControl(""),
      end_date: new FormControl(""),
      description: new FormControl(""),
      placement_type: new FormControl("", Validators.required),
      is_email: new FormControl(""),
      category: new FormControl(""),
      template: new FormControl(""),
      subject: new FormControl(""),
      message: new FormControl(""),
      publish_time: new FormControl(""),
    });
  }
  staffMembers: any = [];

  getStaffMembers() {
    this.service.getStaffMembers({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffMembers = response.result;
        console.log(this.staffMembers, "this.staffMembers");
      }
    });
  }

  projectDetails:any = {};
  selectedCompany:any = {};
  getPlacementProjectDetail(){
    let payload = { placement_id: this.id };
    this.service
      .getPlacementGroupProjectDetails(payload)
      .subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          if(response.data && response.data.length>0 && response.data[0]){
            this.projectDetails = response.data[0] ?? null;
            this.selectedCompany = response.data[0].company_info[0] ?? null;
          }else{
            this.projectDetails =  null;
            this.selectedCompany =  null;
          }
        
          console.log("this.projectDetailsthis.projectDetails", this.projectDetails)
        }else{
          // this.projectDetails = {};Content set by the Project Owners are available here to be downloaded
          // this.selectedCompany ={}
        }
      });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    return nameParts[0]?.[0] + (nameParts[1]?.[0] || '');
  }
  
  getPlacementOverviewDetails() {
    let payload = { id: this.id };
    this.service
      .getProjectPlacementGroupDetails(payload)
      .subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          (this.overAllCount.eligibleStudent = response.eligibleStudent),
            (this.overAllCount.pendingApproval = response.pendingApproval),
            (this.overAllCount.pendingPlacement = response.pendingPlacement),
            (this.overAllCount.placed = response.placed),
            (this.placementGroupDetails = response.result);

          this.service.emitPlacementGroupDetails(this.placementGroupDetails);
          this.imageURL = this.placementGroupDetails.background?this.placementGroupDetails.background:this.imageURL;
          this.placementDetail.emit(this.placementGroupDetails);
          this.placementGroupDetails.start_date = this.placementGroupDetails
            .start_date
            ? Utils.convertDate(
                this.placementGroupDetails.start_date,
                "DD/MM/YY hh:mm A"
              )
            : null;
          this.placementGroupDetails.end_date = this.placementGroupDetails
            .end_date
            ? Utils.convertDate(
                this.placementGroupDetails.end_date,
                "dd/mm/yyyy"
              )
            : null;
          this.placementGroupDetails.publish_at = response.result.publish_at
            ? Utils.convertDate(
                Number(response.result.publish_at),
                "DD/MM/yyyy HH:mm:ss A"
              )
            : null;
          this.placementGroupDetails.publish_on = response.result.publish_on
            ? Utils.convertDate(
                Number(response.result.publish_on),
                "DD/MM/yyyy HH:mm:ss A"
              )
            : null;
          this.placementGroupDetails.updated_at = response.result.updated_at
            ? Utils.convertDate(
                Number(response.result.updated_at),
                "DD/MM/yyyy HH:mm:ss A"
              )
            : null;
          this.placementGroupDetails.staff = this.getModefiedResponse(
            this.placementGroupDetails.staff
          );
          if (this.overviewEditForm) {
            this.staffList();
            this.onEdit();
          }
        }
      });
  }

  getPlacementOverviewDetailsStaff() {
    let payload = { id: this.id };
    this.service
      .getPlacementGroupDetails(payload)
      .subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.placementGroupDetails.staff = response.result.staff;
        }
      });
  }
  getModefiedResponse(placementDetails: any) {
    return placementDetails.map((data) => {
      data["full_name"] = data.first_name + " " + data.last_name;
      return data;
    });
  }
  proceed(e: any) {
    this.proceedFlow = e;
    this.password = null;
  }

  getPlacementCategories() {
    this.service.getPlacementCategories({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementCategories = response.result;
      }
    });
  }

  getPlacementIndustries() {
    this.service.getPlacementIndustries({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementIndustries = response.result;
      }
    });
  }

  onEdit() {
    this.overviewEditForm = true;
    this.staffList();
    this.placementOverView.patchValue({
      background: this.placementGroupDetails.background,
      title: this.placementGroupDetails.title,
      code: this.placementGroupDetails.code,
      description: this.placementGroupDetails.description,
      category_id: this.placementGroupDetails.category_id,
      category_name: this.placementGroupDetails.category_name,
      industry_id: this.placementGroupDetails.industry_id,
      industry: this.placementGroupDetails.industry,
      start_date: Utils.convertIntoDateObject(
        this.placementGroupDetails.start_date
      ),
      end_date: Utils.convertIntoDateObject(
        this.placementGroupDetails.end_date
      ),
    });
  }

  onSave() {
    if (this.placementOverView.valid) {
      let payload = this.preparePayload();
      const userDetail = JSON.parse(localStorage.getItem("userDetail"));
      payload[
        "created_by"
      ] = `${userDetail?.first_name} ${userDetail?.last_name}`;
      payload["created_by_id"] = userDetail?._id;
      payload["is_update"] = true;

      console.log("payload", payload);
      // return false;

      this.service.editPlacementGroup(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.overviewEditForm = false;
          this.getPlacementOverviewDetails();
          this.service.showMessage({ message: response.msg });
        }
      });
    }
  }
  onEyeClick(field: any, type: any) {
    console.log(field);
    if (field == "pass") {
      this.pass = type;
    }
  }
  checkFieldInvalid(field) {
    return (
      this.placementOverView.get(field)?.invalid &&
      (this.placementOverView.get(field)?.dirty ||
        this.placementOverView.get(field)?.touched)
    );
  }

  checkFieldInvalidPublishPlacement(field) {
    return (
      this.publishPlacementGroup.get(field)?.invalid &&
      (this.publishPlacementGroup.get(field)?.dirty ||
        this.publishPlacementGroup.get(field)?.touched)
    );
  }

  onCancel() {
    this.placementOverView.reset();
    this.overviewEditForm = false;
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.placementOverView.get("background").updateValueAndValidity();
    // File Preview
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.imageURL = reader.result as string;
    //   this.placementOverView.patchValue({
    //     background: this.imageURL
    //   })
    // }
    // reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append("media", file);
    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      this.imageURL = resp.url;
      this.placementOverView.patchValue({
        background: this.imageURL,
      });
    });
  }

  removeHTMLTags(str) {
    if (str === null || str === "") {
      return '';
    } else {
      str = str.replace(/<[^>]*>/g, "");
      str = str.replace(/&nbsp;/g, " ");
      str.trim();
    }
    return str;
  }

  staffList() {
    this.staffIds = [];
    this.placementGroupDetails.staff.forEach((staff) => {
      this.staffIds.push(staff.staff_id);
    });
    this.staffIds = [...this.staffIds];
    console.log(" this.staffIds", this.staffIds);
    this.staffControl.setValue(this.staffIds);
  }

  onUpdateStaffMember() {
    this.staffIds = this.staffControl.value;
    let payload = this.preparePayload();
    console.log(payload, "payload");
    payload["is_update"] = true;
    // return false;
    this.service.editPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({ message: response.msg });
        this.staffControl.setValue(this.staffIds);
        this.getPlacementOverviewDetailsStaff();
      }
    });
  }

  preparePayload() {
    let payload = {
      ...this.placementOverView.value,
      placement_id: this.id,
      staff_id: this.staffIds.length > 0 ? this.staffIds : null,
    };
    payload.start_date = this.placementGroupDetails.start_date
      ? Utils.convertDate(this.placementGroupDetails.start_date, "YYYY-MM-DD")
      : null;
    payload.end_date = this.placementGroupDetails.end_date
      ? Utils.convertDate(this.placementGroupDetails.end_date, "YYYY-MM-DD")
      : null;
    return payload;
  }

  onCancelUnpublishPlacementGroup() {
    this.password = null;
    this.proceedFlow = null;
  }

  checkPassword() {
    console.log("this.password", this.password)
    const userDetail = JSON.parse(localStorage.getItem("userDetail"));
    const payload = {
      email_id: userDetail?.email,
      password: this.password,
    };
    return this.service
      .confirmPassword(payload)
      .toPromise()
      .catch((error) => {
        this.service.showMessage({ message: error?.error?.errors?.msg });
      });
  }

  async unpublishPlacementGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== "success") {
      return true;
    }
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      placement_id: this.id,
      password: this.password,
      is_publish: false,
      publish_by_name: userDetail?.first_name +' '+ userDetail?.last_name,
    };
    this.service.editPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.password = null;
         this.proceedFlow = null;
        this.getPlacementOverviewDetails();
        this.closePasswordModal.ripple.trigger.click();
        document.getElementById("unpublishedPopup")?.click();
        this.service.showMessage({ message: response.msg });
      }
    });
  }

  getEmailCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
      this.categories = response.data;
    });
  }

  selectCategory(event) {
    const payload = {
      category_id: event,
    };
    this.service
      .getEmailTemplateByCategoryId(payload)
      .subscribe((response: any) => {
        this.emailTemplateList = response.result;
      });
  }
  selectTemplate(event) {
    const foundTemplate = this.emailTemplateList.find(
      (template) => template._id === event
    );
    if (foundTemplate) {
      console.log("foundTemplate", foundTemplate)
      this.publishPlacementGroup.patchValue({
        subject: foundTemplate?.subject,
        message: foundTemplate?.widgets?.html,
      });
    }
  }
  getPlacementTypes() {
    let payload = { placement_id: this.id };
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result;
      } else {
      }
    });
  }

  onChangePublishOn(event) {
    this.publishPlacement.publishedOn = event.value;
    this.minDate = new Date();
    if (this.publishPlacement.publishedOn === "Publish Instantly") {
      this.minDate = new Date();
      setTimeout(() => {
          this.publishPlacementGroup.patchValue({
            publish_on: 'Publish Instantly'
          });
        }, 0);
    } else {
      this.publishPlacementGroup.patchValue({
        publish_time: "08:00 AM",
      });
    }
  }

  onScheuleDateRangeStart(event) {
    this.minDate = event.value;
  }

  onScheuleDateRangeEnd(event) {
    this.maxDate = event.value;
  }

  onChangeAdditionalEmail(event) {
    this.publishPlacement.additionalEmailOnPublication =
      event.value == "true" ? true : false;
  }

  cancelPublishPlacementForm() {
    this.publishPlacementGroup.reset();
    this.formConteroller();
  }

  checkValidation() {
    if (!this.publishPlacementGroup.valid) {
      this.publishPlacementGroup.markAllAsTouched();
      this.showModalBox = false;
    } else {
      this.showModalBox = true;
      this.publishPlacementGroupFormValues = this.publishPlacementGroup.value;
      this.closePublishModal.ripple.trigger.click();
    }
    this.password = "";
  }

  async onPublishPlacementGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== "success") {
      return true;
    }
    if (this.confirmPassword.valid) {
      const userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let payload = {
        placement_id: this.id,
        publish_on: this.publishPlacementGroupFormValues?.publish_on,
        start_date:
          this.publishPlacement.publishedOn == "Publish Instantly"
            ? Utils.convertDate(new Date(), "YYYY/MM/DD")
            : this.publishPlacementGroupFormValues?.start_date
            ? Utils.convertDate(
                new Date(this.publishPlacementGroupFormValues?.start_date),
                "YYYY/MM/DD"
              )
            : undefined,
        end_date: this.publishPlacementGroupFormValues?.end_date
          ? Utils.convertDate(
              new Date(this.publishPlacementGroupFormValues?.end_date),
              "YYYY/MM/DD"
            )
          : undefined,
        description: this.publishPlacementGroupFormValues?.description,
        placement_type: this.publishPlacementGroupFormValues?.placement_type,
        is_email:
          this.publishPlacementGroupFormValues?.is_email == "true"
            ? true
            : false,
      };
      if (payload.is_email) {
        payload["category"] = this.publishPlacementGroupFormValues?.category;
        payload["template"] = this.publishPlacementGroupFormValues?.template;
        payload["subject"] = this.publishPlacementGroupFormValues?.subject;
        payload["message"] = this.publishPlacementGroupFormValues?.message;
      }
      if (payload.publish_on == "Schedule Date") {
        payload["publish_time"] =
          this.publishPlacementGroupFormValues?.publish_time;
      }
      payload['type'] = 'project';
      payload['publish_by_name']= userDetail?.first_name +' '+ userDetail?.last_name;
      this.service.publishPlacementGroup(payload).subscribe((response: any) => {
        this.closeConfirmPasswordModal.ripple.trigger.click();
        if(response.status==401){
          document.getElementById("publishedDoneErrorPopup")?.click();
          return false;
        }
        document.getElementById("publishedDonePopup")?.click();
        this.confirmPassword.reset();
        this.password = null;
        this.getPlacementOverviewDetails();
      });
    } else {
      this.confirmPassword.markAllAsTouched();
    }
  }

  onCancelPublishPlacementGroup() {
    this.password = null;
    this.publishPlacementGroup.reset();
    this.formConteroller();
  }

  onCancelPassword() {
    this.confirmPassword.reset();
    this.formConteroller();
  }

  archiveGroup() {
    this.password = null;
    if (this.placementGroupDetails?.is_publish) {
      document.getElementById("archivedPopup")?.click();
      return;
    } else {
      document.getElementById("archiveConfirmPassword")?.click();
      return;
    }
  }

  async archivePlacementGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== "success") {
      return true;
    }
    if (this.confirmPassword.valid) {
      const payload = {
        placement_id: this.id,
        status: "archived",
      };
      this.service.editPlacementGroup(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.closePasswordModal.ripple.trigger.click();
          this.getPlacementOverviewDetails();
          this.service.showMessage({
            message: "Placement group archived successfully",
          });
          document.getElementById("archivedDonePopup")?.click();
        }
      });
    } else {
      this.confirmPassword.markAllAsTouched();
    }
  }

  getLastModifiedInitial() {
    let lastModified = this.placementGroupDetails?.created_by.split(" ");
    return `${lastModified[0][0]} ${lastModified[1][0]}`;
  }

  // checkInvalidFieldPassrordForm(field) {
  //   return (
  //     this.confirmPassword.get(field)?.invalid &&
  //     (this.confirmPassword.get(field)?.dirty ||
  //       this.confirmPassword.get(field)?.touched)
  //   );
  // }

  checkInvalidFieldPassrordForm(field: string): boolean {
  return (
    this.confirmPassword?.get(field)?.invalid &&
    (this.confirmPassword.get(field)?.dirty || this.confirmPassword.get(field)?.touched)
  ) ?? false;
}

  viewFile(index, data) {
    if (data.url) {
      // Open the file URL in a new tab
      window.open(data.url, '_blank');
    } else {
      console.error('File URL is not available.');
    }
  }

  downloadFile(index, data) {
    // window.open(data.url, '_blank');
    this.httpWithoutInterceptor.get(data.url, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = data.name;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  } 

  checkRemove(){
   console.log("this.placementGroupDetails", this.placementGroupDetails, this.projectDetails);
   if(this.placementGroupDetails.is_publish){
    this.removenotPublish.show();
   }else{
    this.removeProject.show();
   }
  }


  @ViewChild('removenotPublish') removenotPublish: ModalDirective;
  @ViewChild('removeProject') removeProject: ModalDirective;
  @ViewChild('removeProjectDone') removeProjectDone: ModalDirective;
  title:any = ''
  removeProjectForPG(){
    this.service.removeProjectForPG({placement_id:this.placementGroupDetails._id, project_id:this.projectDetails._id}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.title = this.projectDetails.job_title;
        this.getPlacementProjectDetail();
        this.projectDetails = null;
        this.removeProjectDone.show();
      } else {
      }
    });
  }
  goToCompanyProfile(company) {
    this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: company.company_id } });
  }
  
}
