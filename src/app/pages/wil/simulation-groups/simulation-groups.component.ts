import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-simulation-groups',
  templateUrl: './simulation-groups.component.html',
  styleUrls: ['./simulation-groups.component.scss']
})
export class SimulationGroupsComponent implements OnInit {
  id: string;
  redirectTo: string;
  activeTab = 'overview';

  // Overview
  overviewEditMode = false;
  activeOverviewSubTab = 'details';
  overviewForm: FormGroup;

  detail: any = {
    title: 'Jan 2024 PY IT Internship',
    code: 'J2024PY',
    description: 'This simulation group covers practical IT internship scenarios including HVAC system management, client communications, and technical reporting.',
    category: 'WIL Placement',
    industry: 'Information Technology',
    tags: ['IT', 'Internship', 'HVAC', 'Simulation'],
    staff: [{ name: 'John Smith', role: 'Coordinator' }, { name: 'Sarah Johnson', role: 'Supervisor' }],
    created_at: new Date('2024-01-05'),
    updated_at: new Date('2024-03-15'),
    is_publish: false,
    eligible_students: 18,
    pending_placements: 5,
    placed_candidates: 8,
    company_name: 'TechCorp Solutions',
    company_location: 'Sydney, NSW',
    duration: '12 weeks',
    project_description: 'Students will engage in real-world IT scenarios involving HVAC system management, data analysis, and client interaction through simulated environments.',
    project_scenarios: [
      { title: 'HVAC Dashboard Management', description: 'Monitor and manage HVAC systems through a simulated dashboard interface.' },
      { title: 'Client Communication', description: 'Handle client queries and communications via simulated messaging systems.' },
      { title: 'Technical Reporting', description: 'Generate and submit technical reports based on simulated data.' }
    ],
    hero_text: 'Gain hands-on IT experience through immersive simulations',
    subheading: 'Prepare for your career in Information Technology',
    companies_overview: 'Partner companies include leading IT firms across Australia.',
    proposition: 'Develop practical skills that employers value most.',
    offer_letter: 'Upon successful completion, students receive a certificate of participation.'
  };

  // Progress
  overallProgress = 45;
  studentProgress = [
    { name: 'Alice Chen', studentId: 'STU001', avatar: 'AC', progress: 80, nextTask: 'Submit Final Report' },
    { name: 'Bob Williams', studentId: 'STU002', avatar: 'BW', progress: 65, nextTask: 'Complete HVAC Module' },
    { name: 'Carol Davis', studentId: 'STU003', avatar: 'CD', progress: 45, nextTask: 'Data Gathering Exercise' },
    { name: 'David Lee', studentId: 'STU004', avatar: 'DL', progress: 30, nextTask: 'Watch Training Video' },
    { name: 'Emma Wilson', studentId: 'STU005', avatar: 'EW', progress: 90, nextTask: 'Peer Review' }
  ];

  // Workflow
  activeWorkflowSubTab = 'docLibrary';
  docLibraryFolders: any[] = [
    { name: 'Training Materials', files: [{ name: 'HVAC_Manual.pdf' }, { name: 'Safety_Guide.docx' }], expanded: false },
    { name: 'Templates', files: [{ name: 'Report_Template.xlsx' }], expanded: false },
    { name: 'Reference Guides', files: [], expanded: false }
  ];
  workflowTasks = [
    { name: 'Watch Orientation Video', title: 'Watch Orientation Video', completion_criteria: 'Complete the 15-min orientation video', status: 'Completed', order: 1 },
    { name: 'Read Safety Guidelines', title: 'Read Safety Guidelines', completion_criteria: 'Acknowledge safety guidelines document', status: 'Completed', order: 2 },
    { name: 'Complete HVAC Module', title: 'Complete HVAC Module', completion_criteria: 'Score at least 70% on HVAC assessment', status: 'Pending', order: 3 },
    { name: 'Submit Data Report', title: 'Submit Data Report', completion_criteria: 'Submit completed data analysis report', status: 'Pending', order: 4 },
    { name: 'Final Assessment', title: 'Final Assessment', completion_criteria: 'Complete final simulation assessment', status: 'Pending', order: 5 }
  ];

  // Simulation Types (workflow right side)
  simulationTypes: any[] = [
    { type: 'HVAC Simulation', student_count: 12, selected: true, is_favorite: true, publish_at: '05/01/24' },
    { type: 'Client Comms', student_count: 8, selected: false, is_favorite: false, publish_at: '12/01/24' },
    { type: 'Reporting', student_count: 5, selected: false, is_favorite: false, publish_at: '20/01/24' }
  ];
  selectedSimulationType: any = {};
  workFlowSteps: any[] = [
    {
      _id: 'step1',
      get_tasks: [
        { name: 'Watch Orientation Video', title: 'Orientation', completion_criteria: 'Complete the 15-min orientation video', pending: 3, completed: 9 },
        { name: 'Read Safety Guidelines', title: 'Safety Guidelines', completion_criteria: 'Acknowledge safety guidelines document', pending: 5, completed: 7 }
      ]
    }
  ];
  selectedWorkflowTabIndex = 0;
  stage = 'Pre-Placement';

  // Eligible Students
  eligibleStudentsList: MatTableDataSource<any>;
  eligibleStudentsColumns = ['name', 'student_id', 'email', 'progress', 'priority', 'actions'];
  eligibleStudentsStats = { total: 18, active: 14, pending: 3, inactive: 1 };
  mockStudents = [
    { name: 'Alice Chen', student_id: 'STU001', email: 'alice.chen@uni.edu', progress: 80, priority: 'High' },
    { name: 'Bob Williams', student_id: 'STU002', email: 'bob.williams@uni.edu', progress: 65, priority: 'Medium' },
    { name: 'Carol Davis', student_id: 'STU003', email: 'carol.davis@uni.edu', progress: 45, priority: 'Low' },
    { name: 'David Lee', student_id: 'STU004', email: 'david.lee@uni.edu', progress: 30, priority: 'High' },
    { name: 'Emma Wilson', student_id: 'STU005', email: 'emma.wilson@uni.edu', progress: 90, priority: 'Medium' }
  ];

  // Student search
  studentSearchKeywords = '';

  // Testimonies
  activeTestimonySubTab = 'published';
  testimoniesList: MatTableDataSource<any>;
  testimoniesColumns = ['name', 'date', 'rating', 'excerpt', 'status'];
  testimoniesStats = { total: 12, published: 7, submitted: 3, archived: 2 };
  mockTestimonies = [
    { name: 'Alice Chen', date: '2024-03-01', rating: 5, excerpt: 'The simulation was incredibly realistic and helpful.', status: 'published' },
    { name: 'Bob Williams', date: '2024-02-25', rating: 4, excerpt: 'Great learning experience overall.', status: 'published' },
    { name: 'Carol Davis', date: '2024-03-05', rating: 5, excerpt: 'I feel much more prepared for my internship now.', status: 'submitted' }
  ];

  // Publish
  publishForm: FormGroup;
  publishMode = 'instant';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link']
    ]
  };

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.redirectTo = params.get('redirectTo');
      if (this.redirectTo) {
        setTimeout(() => {
          const tabMap: any = {
            'progress': 'sim-progress-tab',
            'workflow': 'sim-workflow-tab',
            'eligible-students': 'sim-students-tab',
            'testimonies': 'sim-testimonies-tab'
          };
          if (tabMap[this.redirectTo]) {
            document.getElementById(tabMap[this.redirectTo])?.click();
          }
        }, 100);
      }
    });

    this.overviewForm = new FormGroup({
      title: new FormControl(this.detail.title, [Validators.required]),
      code: new FormControl(this.detail.code, [Validators.required]),
      description: new FormControl(this.detail.description),
      category: new FormControl(this.detail.category),
      industry: new FormControl(this.detail.industry)
    });

    this.publishForm = new FormGroup({
      publish_mode: new FormControl('instant'),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      description: new FormControl(''),
      featured: new FormControl(false)
    });

    this.eligibleStudentsList = new MatTableDataSource(this.mockStudents);
    this.testimoniesList = new MatTableDataSource(this.mockTestimonies);
  }

  toggleOverviewEdit() {
    this.overviewEditMode = !this.overviewEditMode;
    if (!this.overviewEditMode) {
      this.detail.title = this.overviewForm.value.title;
      this.detail.code = this.overviewForm.value.code;
      this.detail.description = this.overviewForm.value.description;
    }
  }

  cancelOverviewEdit() {
    this.overviewEditMode = false;
    this.overviewForm.patchValue({
      title: this.detail.title,
      code: this.detail.code,
      description: this.detail.description
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return '#26C296';
    if (progress >= 50) return '#464BA8';
    if (progress >= 25) return '#F4A261';
    return '#F47761';
  }

  onStudentSearch() {
    if (this.studentSearchKeywords && this.studentSearchKeywords.length >= 3) {
      const filtered = this.mockStudents.filter(s =>
        s.name.toLowerCase().includes(this.studentSearchKeywords.toLowerCase()) ||
        s.student_id.toLowerCase().includes(this.studentSearchKeywords.toLowerCase())
      );
      this.eligibleStudentsList = new MatTableDataSource(filtered);
    } else if (!this.studentSearchKeywords) {
      this.eligibleStudentsList = new MatTableDataSource(this.mockStudents);
    }
  }

  filterTestimonies(status: string) {
    this.activeTestimonySubTab = status;
    const filtered = this.mockTestimonies.filter(t => t.status === status);
    this.testimoniesList = new MatTableDataSource(filtered);
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  publishSimGroup() {
    this.detail.is_publish = true;
  }

  unpublishSimGroup() {
    this.detail.is_publish = false;
  }

  onSelectSimulationType(simType: any) {
    this.simulationTypes.forEach(s => s.selected = false);
    simType.selected = true;
    this.selectedSimulationType = simType;
  }
}
