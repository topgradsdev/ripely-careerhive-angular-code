import { Injectable } from '@angular/core';

export interface Rule {
  _id: number;
  name: string;
  target: string;
  duration: string;
  condition: string;
  value: number;
  created_by: string;
  created_date: string;
}

@Injectable({ providedIn: 'root' })
export class RulesService {


  //  name: new FormControl(this.rule.name, [Validators.required]),
        //   user_type: new FormControl(this.rule.target, [Validators.required]),
        //   condition_to_trigger: new FormControl(this.rule.name, [Validators.required]),
        //   set_days: new FormControl(this.rule.set_days, [Validators.required]),
        //   set_days_type: new FormControl(this.rule.set_days_type, [Validators.required]),
        //   action_on_trigger: new FormControl(this.rule.name, [Validators.required]),
        //   affected_data: new FormControl(this.rule.name, [Validators.required]),
        //   additional_criteria: new FormControl(this.rule.name, [Validators.required]),
  private rules: any[] = [
     {
      "_id": 1,
      "name": "Inactive Student Deletion 1",
      "target": "Students",
      "duration": "2 Years",
      "condition": "Years of Inactivity",
      "value": 0,
      "action_on_trigger": "Purge selected Data",
      "additional_criteria": "Automatically Purge Data",
      "affected_data":['All Profile Data'],
      "condition_to_trigger":"Period of Inactivity",
      "created_by": "Adi Baskara",
      "set_days": 2,
      "set_days_type":'years',
      "created_date": "24 June 2025"
    },
    {
      "_id": 2,
      "name": "Inactive Company Deletion",
      "target": "Companies",
      "duration": "3 Months",
      "condition": "Months of Inactivity",
      "value": 0,
      "created_by": "Adi Baskara",
      "action_on_trigger": "Purge selected Data",
      "additional_criteria": "Automatically Purge Data",
      "affected_data":['All Profile Data'],
      "condition_to_trigger":"Period of Inactivity",
      "set_days": 3,
      "set_days_type":'month',
      "created_date": "24 June 2025"
    },
    {
      "_id": 3,
      "name": "Blacklisted Companies 3 Months",
      "target": "Companies",
      "duration": "3 Months",
      "condition": "Months of Inactivity",
      "value": 0,
      "created_by": "Adi Baskara",
      "action_on_trigger": "Purge selected Data",
      "additional_criteria": "Automatically Purge Data",
      "affected_data":['All Profile Data'],
      "condition_to_trigger":"Period of Inactivity",
      "set_days": 3,
      "set_days_type":'month',
      "created_date": "24 June 2025"
    },
    {
      "_id": 4,
      "name": "Test Rule",
      "target": "Companies",
      "duration": "1 Year",
      "condition": "Years after being Blacklisted",
      "value": 0,
      "created_by": "Adi Baskara",
      "action_on_trigger": "Purge selected Data",
      "additional_criteria": "Automatically Purge Data",
      "affected_data":['All Profile Data'],
      "condition_to_trigger":"Period of Inactivity",
      "set_days": 1,
      "set_days_type":'years',
      "created_date": "24 June 2025"
    },
    {
      "_id": 5,
      "name": "Postgraduates 2 years",
      "target": "Students",
      "duration": "2 Years",
      "condition": "Months of Inactivity",
      "value": 0,
      "created_by": "Adi Baskara",
      "action_on_trigger": "Purge selected Data",
      "additional_criteria": "Automatically Purge Data",
      "affected_data":['All Profile Data'],
      "condition_to_trigger":"Period of Inactivity",
      "set_days": 2,
      "set_days_type":'years',
      "created_date": "24 June 2025"
    }
  ];

  getAll(): any[] {
    return [...this.rules];
  }

  getById(id: number): any | undefined {
    return this.rules.find(r => r._id == id);
  }

  add(rule: any) {
    rule._id = Date.now();
   this.rules.unshift(rule);
  }

update(id: number, updated: any) {
  console.log("id", id, "updated", updated);

  const index = this.rules.findIndex(r => r._id == id);
  console.log("index", index);

  if (index > -1) {
    // Merge old rule with new data to avoid losing fields
    this.rules[index] = {
      ...this.rules[index],
      ...updated,
      _id: id
    };

    // If using OnPush or change detection issue, reassign array
    this.rules = [...this.rules];
  }
}
  delete(id: number) {
    this.rules = this.rules.filter(r => r._id != id);
  }
}
