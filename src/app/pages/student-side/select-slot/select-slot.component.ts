import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import * as CronofyElements from "cronofy-elements";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-select-slot',
  templateUrl: './select-slot.component.html',
  styleUrls: ['./select-slot.component.scss']
})
export class SelectslotComponent implements OnInit {
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

  constructor(private fb: FormBuilder, private service: TopgradserviceService, private activatedRoute: ActivatedRoute) { }
  interviewId:any = null;
  subId:any = null;
  ngOnInit(): void {
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.activatedRoute.queryParams.subscribe(params => {
      this.interviewId = params['id'];
      this.getInterviewById();
      this.subId= params['sub'];
      // if(params['sub']){
      //   this.getEelementToken(params['sub'])
      // }


    });
  }

  interviewObj:any =null;
  getInterviewById(){
     this.service.getInterviewByID({_id:this.interviewId}).subscribe({
      next: (res: any) => {
        if(res.status==200){
          this.interviewObj = res.result;
//                let data = this.getNextWeekQueryPeriods(this.interviewObj?.availability_rules?.availability_rules[0], this.interviewObj?.availability_rules?.availability_rules[0]?.tzid, this.interviewObj?.booked_slot)
// console.log("data", data)
          this.getEelementToken(this.subId)
        }else{
          this.interviewObj = null;
          this.service.showMessage({
           message: res.msg || 'Something went Wrong'
          });
        }
      },
      error: (err) => {
         this.interviewObj = null;
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Something went Wrong'
        });
      }
    });
  }

getNextWeekQueryPeriods(rule: any, tzid: any, bookedSlots: any[] = []) {
  const periods: { start: string; end: string }[] = [];

   if (!rule || !Array.isArray(rule.weekly_periods)) {
    return []; // nothing to process
  }

  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const now = new Date();
  const today = now.getDay();

  rule.weekly_periods.forEach((slot: any) => {
    const dayIndex = dayMap[slot.day.toLowerCase()];
    if (dayIndex === undefined) return;

    let diff = dayIndex - today;
    if (diff < 0) diff += 7;

    const baseDate = new Date(now);
    baseDate.setDate(now.getDate() + diff);

    const [startHour, startMin] = slot.start_time.split(":").map(Number);
    const [endHour, endMin] = slot.end_time.split(":").map(Number);

    const startDate = new Date(baseDate);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(baseDate);
    endDate.setHours(endHour, endMin, 0, 0);

    // ✅ Skip slots already in past
    if (startDate <= now) {
      if (diff === 0) {
        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(endDate.getDate() + 7);
      } else {
        return;
      }
    }

    // Convert to ISO strings for easy compare
    const slotStart = startDate.toISOString();
    const slotEnd = endDate.toISOString();

    // ✅ Check if this slot already exists in bookedSlots
    const isBooked = Array.isArray(bookedSlots) && bookedSlots.some((b: any) => {
      return (
        new Date(b.slot.start).getTime() === startDate.getTime() &&
        new Date(b.slot.end).getTime() === endDate.getTime()
      );
    });
    if (!isBooked) {
      periods.push({ start: slotStart, end: slotEnd });
    }
  });

  return periods;
}


 getOffset(date: Date, tzid: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tzid,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const mapped: any = {};
  for (const p of parts) {
    if (p.type !== "literal") mapped[p.type] = p.value;
  }

  // Build "local time" in the given tzid
  const local = new Date(
    `${mapped.year}-${mapped.month}-${mapped.day}T${mapped.hour}:${mapped.minute}:${mapped.second}Z`
  );

  // Difference in minutes
  const diffMinutes = (local.getTime() - date.getTime()) / 60000;

  const sign = diffMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(diffMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");

  return `${sign}${hh}:${mm}`;
}

    element_token:any = null;
   getEelementToken(sub) {
    const payload = {
      sub: sub
    };
    
    this.service.cronofyGetElementToken(payload).subscribe({
      next: (res: any) => {
        console.log("res", res, res.element_token);
        this.element_token = res?.element_token?.token
        // Open modal
        // this.managedAvailability.show();
  
        // Destroy previous element if already loaded (avoid duplication)
        const container = document.getElementById("cronofy-calendar");
        if (container) container.innerHTML = "";
  
        // Load Cronofy Availability Rules Element
        CronofyElements.DateTimePicker({
            element_token: res?.element_token?.token,
            target_id: "cronofy-date-time-picker",
            availability_query: {
                participants: [
                    {
                        required: "all",
                        members: [
                            { sub: sub }
                        ]
                    }
                ],
                required_duration: { minutes: 30 },
                rules: [
                  {
                    availability_rule_ids: ["work_hours"]
                  }
                ],
                 "query_periods": this.getNextWeekQueryPeriods(this.interviewObj?.availability_rules?.availability_rules[0], this.interviewObj?.availability_rules?.availability_rules[0]?.tzid, this.interviewObj?.booked_slot)
            },
            styles: {
                prefix: "custom-name"
            },
            callback: (notification) => {
              console.log("Cronofy Notification:", notification);

              if (notification.type === "availability_selected") {
                // user clicked a slot
                console.log("Slot Selected:", notification.slot);
              }

              if (notification.type === "slot_selected" || notification?.notification?.type=="slot_selected") {
                // user confirmed slot ✅
                this.bookevent(notification);  
              }
            }
        });

      },
      error: (err) => {
          sessionStorage.removeItem('cronofy_access');
          sessionStorage.removeItem('cronofy_sub');
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Something went Wrong'
        });
      }
    });
    // this.callApi('Interviews');
  }
  

  bookevent(data:any){
    // calender_id
    let body = { refresh_token:this.interviewObj?.refresh_token, notification_data:data.notification, student_name:this.userProfile?.first_name+' '+this.userProfile?.last_name, employer_name:this.interviewObj?.companyLoginData?.first_name+' '+this.interviewObj?.companyLoginData?.last_name, student_email:this.userProfile?.email, employer_email:this.interviewObj?.companyLoginData?.primary_email,


      '_id': this.interviewObj?._id,
        'summary': this.interviewObj?.summary,
        'description': this.interviewObj?.description,
        // +' /n /n '+ this.routeForm.value.location,
        'type':  this.interviewObj?.type,
        'location':  this.interviewObj?.location,
      };


    this.service.BookEvent(body).subscribe({
      next: (res: any) => {
        if(res.status==200){
          this.successPage = true;
          this.service.showMessage({
            message: "Interview successfully scheduled!"
          });
          // this.closeConfirmModal.ripple.trigger.click();
        }else{
          this.service.showMessage({
            message: res.msg || 'Something went Wrong'
          });
        }
      },
      error: (err) => {
        // this.interviewObj = null;
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Something went Wrong'
        });
      }
    });
  }

  @ViewChild('closeConfirmModal') closeConfirmModal;
  selected:any = null
  async submitForm() {
        // const payload = {
        //   placementType: this.selected.type,
        //   placement_type_id: this.selected.workflow_type_id,
        //   placement_type: this.selected,
        //   self_source: this.selected.self_source,
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
  }

}
