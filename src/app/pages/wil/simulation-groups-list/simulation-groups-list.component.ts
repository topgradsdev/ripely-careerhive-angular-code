import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-simulation-groups-list',
  templateUrl: './simulation-groups-list.component.html',
  styleUrls: ['./simulation-groups-list.component.scss']
})
export class SimulationGroupsListComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link']
    ]
  };

  createSimulationGroup: FormGroup;
  searchCriteria = { keywords: '' };

  countObj = {
    wilPlacements: 54,
    simulations: 23,
    archivedPlacements: 5,
    archivedSims: 4
  };

  @ViewChild('simulationGroupTbSort') simulationGroupTbSort = new MatSort();
  @ViewChild('closeCreateSimulationGroupModal') closeCreateSimulationGroupModal: any;
  @ViewChild('successSimulationGroupModal') successSimulationGroupModal: any;

  simulationGroupList: any = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'code',
    'title',
    'industry',
    'category',
    'updated_at',
    'publish_at',
    'publish_by',
    'student_count',
    'actions'
  ];

  categories = [
    { _id: '1', name: 'WIL Placement' },
    { _id: '2', name: 'Capstone Project' },
    { _id: '3', name: 'Internship' }
  ];

  industries = [
    { _id: '1', name: 'Information Technology' },
    { _id: '2', name: 'Civil Engineering' },
    { _id: '3', name: 'Accounting' },
    { _id: '4', name: 'Fashion Design' },
    { _id: '5', name: 'Graphic Design' }
  ];

  accessOptions = [
    { _id: '1', name: 'All Students' },
    { _id: '2', name: 'Enrolled Only' },
    { _id: '3', name: 'Invited Only' }
  ];

  mockData = [
    {
      _id: '1', code: 'J2024PY', title: 'Jan 2024 PY IT Internship',
      industry: 'Information Technology', category: 'WIL Placement',
      updated_at: new Date('2024-03-15'), publish_on: new Date('2024-01-10'),
      is_publish: true, publish_by_name: 'John Smith', student_count: 18, created_by: 'John Smith'
    },
    {
      _id: '2', code: 'CE2024', title: 'Civil Engineering Placement 2024',
      industry: 'Civil Engineering', category: 'Capstone Project',
      updated_at: new Date('2024-02-20'), publish_on: new Date('2024-02-01'),
      is_publish: true, publish_by_name: 'Sarah Johnson', student_count: 12, created_by: 'Sarah Johnson'
    },
    {
      _id: '3', code: 'ACCIT2023', title: 'Accounting IT Integration 2023',
      industry: 'Accounting', category: 'WIL Placement',
      updated_at: new Date('2023-11-10'), publish_on: new Date('2023-09-15'),
      is_publish: true, publish_by_name: 'Mike Brown', student_count: 8, created_by: 'Mike Brown'
    },
    {
      _id: '4', code: 'FD2023', title: 'Fashion Design Internship 2023',
      industry: 'Fashion Design', category: 'Internship',
      updated_at: new Date('2023-08-05'), publish_on: null,
      is_publish: false, publish_by_name: '', student_count: 9, created_by: 'Lisa White'
    },
    {
      _id: '5', code: 'UIG2023', title: 'UI/UX & Graphic Design 2023',
      industry: 'Graphic Design', category: 'WIL Placement',
      updated_at: new Date('2023-07-22'), publish_on: new Date('2023-06-01'),
      is_publish: true, publish_by_name: 'Tom Davis', student_count: 7, created_by: 'Tom Davis'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.createSimulationGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      category_id: new FormControl('', [Validators.required]),
      industry_id: new FormControl('', [Validators.required]),
      access: new FormControl([])
    });

    this.simulationGroupList = new MatTableDataSource(this.mockData);
    this.simulationGroupList.sort = this.simulationGroupTbSort;
  }

  onChangeSearchKeyword() {
    if (this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      const filtered = this.mockData.filter(item =>
        item.title.toLowerCase().includes(this.searchCriteria.keywords.toLowerCase()) ||
        item.code.toLowerCase().includes(this.searchCriteria.keywords.toLowerCase())
      );
      this.simulationGroupList = new MatTableDataSource(filtered);
      this.simulationGroupList.sort = this.simulationGroupTbSort;
    } else if (!this.searchCriteria.keywords) {
      this.simulationGroupList = new MatTableDataSource(this.mockData);
      this.simulationGroupList.sort = this.simulationGroupTbSort;
    }
  }

  onSubmit() {
    if (this.createSimulationGroup.valid) {
      this.closeCreateSimulationGroupModal.nativeElement.click();
      this.openModal(this.successSimulationGroupModal);
    } else {
      this.createSimulationGroup.markAllAsTouched();
    }
  }

  checkFieldInvalid(field: string): boolean {
    return this.createSimulationGroup.get(field)?.invalid &&
      (this.createSimulationGroup.get(field)?.dirty || this.createSimulationGroup.get(field)?.touched);
  }

  onCancel() {
    this.createSimulationGroup.reset();
  }

  exportStudentData() {
    console.log('Export simulation groups data');
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';
    return `${first}${second}`;
  }

  openModal(modal: any) {
    modal.nativeElement.classList.add('show');
    modal.nativeElement.style.display = 'block';
  }

  closeModal(modal: any) {
    modal.nativeElement.classList.remove('show');
    modal.nativeElement.style.display = 'none';
  }

  onCloseSuccessModal() {
    this.closeModal(this.successSimulationGroupModal);
  }

  onScrollDown() {
    // Mock - no pagination needed for static data
  }
}
