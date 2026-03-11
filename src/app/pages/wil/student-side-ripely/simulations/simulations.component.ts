import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface SimChip {
  label: string;
  color: string;
}

interface Simulation {
  id: string;
  title: string;
  company: string;
  category: string;
  categoryLabel: string;
  chips: SimChip[];
  imgClass: string;
  companyDot: string;
  difficulty: string;
  duration: string;
  tasks: number;
  status: 'available' | 'in-progress' | 'completed' | 'coming-soon';
  rating: number;
  featured: boolean;
  mine: boolean;
  mineStatus: 'in-progress' | 'completed' | '';
  mineProgress: number;
  mineTasks: string;
}

@Component({
  selector: 'app-student-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.scss']
})
export class StudentSimulationsComponent implements OnInit {
  constructor(private router: Router) {}

  activeFilter = 'all';
  activeCategory = 'all';

  filters = [
    { key: 'all', label: 'All' },
    { key: 'engineering', label: 'HVAC' },
    { key: 'technology', label: 'Software Engineering' },
    { key: 'business', label: 'Data & Analytics' },
    { key: 'cloud', label: 'Cloud & Infra' },
    { key: 'mechanical', label: 'Mechanical' },
    { key: 'civil', label: 'Civil' },
    { key: 'compliance', label: 'Compliance' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' }
  ];

  simulations: Simulation[] = [
    {
      id: 'hvac',
      title: 'Heron Gate: Cooling Tower Assessment',
      company: 'Meridian Building Systems',
      category: 'engineering',
      categoryLabel: 'HVAC',
      chips: [
        { label: 'Drift Loss', color: 'accent' },
        { label: 'Live Project', color: 'blue' }
      ],
      imgClass: 'bsim-img-hvac',
      companyDot: '#ff8c32',
      difficulty: 'Intermediate',
      duration: '3\u20134 hrs',
      tasks: 6,
      status: 'in-progress',
      rating: 4.9,
      featured: true,
      mine: true,
      mineStatus: 'in-progress',
      mineProgress: 67,
      mineTasks: 'Task 4 of 6'
    },
    {
      id: 'bridge',
      title: 'Bridge Inspection Report: Toowoomba Overpass',
      company: 'Aurecon Group',
      category: 'civil',
      categoryLabel: 'Civil',
      chips: [
        { label: 'Structural', color: 'blue' },
        { label: 'Site Assessment', color: 'green' }
      ],
      imgClass: 'bsim-img-structural',
      companyDot: '#3b82f6',
      difficulty: 'Intermediate',
      duration: '2\u20133 hrs',
      tasks: 5,
      status: 'available',
      rating: 4.7,
      featured: true,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    },
    {
      id: 'data-pipeline',
      title: 'Data Pipeline Audit: Retail Analytics',
      company: 'Quantix Analytics',
      category: 'business',
      categoryLabel: 'Data & Analytics',
      chips: [
        { label: 'SQL', color: 'green' },
        { label: 'ETL', color: 'green' }
      ],
      imgClass: 'bsim-img-data',
      companyDot: '#10b981',
      difficulty: 'Intermediate',
      duration: '2 hrs',
      tasks: 4,
      status: 'available',
      rating: 4.6,
      featured: true,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    },
    {
      id: 'ncc-compliance',
      title: 'NCC Energy Compliance Audit: Commercial Fitout',
      company: 'Stantec Australia',
      category: 'compliance',
      categoryLabel: 'Compliance',
      chips: [
        { label: 'NCC Section J', color: 'purple' },
        { label: 'Compliance', color: 'accent' }
      ],
      imgClass: 'bsim-img-compliance',
      companyDot: '#a78bfa',
      difficulty: 'Intermediate',
      duration: '3 hrs',
      tasks: 5,
      status: 'available',
      rating: 4.8,
      featured: true,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    },
    {
      id: 'aws-cost',
      title: 'AWS Cost Optimisation: SaaS Startup',
      company: 'Cloudreach',
      category: 'cloud',
      categoryLabel: 'Cloud & Infra',
      chips: [
        { label: 'AWS', color: 'accent' },
        { label: 'Cost Analysis', color: 'blue' }
      ],
      imgClass: 'bsim-img-cloud',
      companyDot: '#f59e0b',
      difficulty: 'Advanced',
      duration: '4\u20135 hrs',
      tasks: 6,
      status: 'available',
      rating: 4.5,
      featured: false,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    },
    {
      id: 'incident-response',
      title: 'Production Incident Response: Payments API',
      company: 'Atlassian',
      category: 'technology',
      categoryLabel: 'Software Eng',
      chips: [
        { label: 'Incident Mgmt', color: 'red' },
        { label: 'On-Call', color: 'accent' }
      ],
      imgClass: 'bsim-img-software',
      companyDot: '#3b82f6',
      difficulty: 'Advanced',
      duration: '2\u20133 hrs',
      tasks: 5,
      status: 'available',
      rating: 4.9,
      featured: true,
      mine: true,
      mineStatus: 'completed',
      mineProgress: 100,
      mineTasks: 'Task 5 of 5'
    },
    {
      id: 'data-migration',
      title: 'Legacy Data Migration: CRM Overhaul',
      company: 'Optus Digital',
      category: 'technology',
      categoryLabel: 'Software Eng',
      chips: [
        { label: 'SQL', color: 'green' },
        { label: 'Data Mapping', color: 'blue' }
      ],
      imgClass: 'bsim-img-data',
      companyDot: '#10b981',
      difficulty: 'Intermediate',
      duration: '2\u20133 hrs',
      tasks: 5,
      status: 'available',
      rating: 4.6,
      featured: false,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    },
    {
      id: 'strategy',
      title: 'The Strategy Sprint',
      company: 'McKinley & Co',
      category: 'business',
      categoryLabel: 'Strategy',
      chips: [
        { label: 'Strategy Sprint', color: 'muted' }
      ],
      imgClass: 'bsim-img-compliance',
      companyDot: '#999',
      difficulty: 'Advanced',
      duration: '5\u20137 hrs',
      tasks: 8,
      status: 'coming-soon',
      rating: 0,
      featured: false,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    },
    {
      id: 'launch',
      title: 'Zero to Launch',
      company: 'Nova Health',
      category: 'healthcare',
      categoryLabel: 'Healthcare',
      chips: [
        { label: 'Product Launch', color: 'muted' }
      ],
      imgClass: 'bsim-img-data',
      companyDot: '#999',
      difficulty: 'Intermediate',
      duration: '4\u20136 hrs',
      tasks: 7,
      status: 'coming-soon',
      rating: 0,
      featured: false,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    },
    {
      id: 'pump-hydraulic',
      title: 'Pump Selection & Hydraulic Analysis',
      company: 'WSP Engineering',
      category: 'mechanical',
      categoryLabel: 'Mechanical',
      chips: [
        { label: 'Hydraulics', color: 'muted' },
        { label: 'Pump Sizing', color: 'muted' }
      ],
      imgClass: 'bsim-img-mechanical',
      companyDot: '#999',
      difficulty: 'Intermediate',
      duration: '3\u20134 hrs',
      tasks: 5,
      status: 'coming-soon',
      rating: 0,
      featured: false,
      mine: false,
      mineStatus: '',
      mineProgress: 0,
      mineTasks: ''
    }
  ];

  filteredSimulations: Simulation[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  get pageTitle(): string {
    return this.activeFilter === 'my' ? 'My Simulations' : 'Simulations';
  }

  get pageSub(): string {
    return this.activeFilter === 'my' ? 'Track your progress' : 'Find your next workplace simulation';
  }

  get showFilters(): boolean {
    return this.activeFilter !== 'my';
  }

  get showSectionHdr(): boolean {
    return this.activeFilter !== 'my';
  }

  get mySimCount(): number {
    return this.simulations.filter(s => s.mine).length;
  }

  get ongoingSims(): Simulation[] {
    return this.filteredSimulations.filter(s => s.mineStatus === 'in-progress');
  }

  get completedSims(): Simulation[] {
    return this.filteredSimulations.filter(s => s.mineStatus === 'completed');
  }

  setFilter(key: string): void {
    this.activeFilter = key;
    this.applyFilters();
  }

  setCategory(key: string): void {
    this.activeCategory = key;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.simulations;

    if (this.activeFilter === 'available') {
      result = result.filter(s => s.status === 'available' || s.status === 'in-progress');
    } else if (this.activeFilter === 'featured') {
      result = result.filter(s => s.featured);
    } else if (this.activeFilter === 'my') {
      result = result.filter(s => s.mine);
    }

    if (this.activeCategory !== 'all' && this.activeFilter !== 'my') {
      const cat = this.activeCategory;
      if (cat === 'intermediate' || cat === 'advanced') {
        result = result.filter(s => s.difficulty.toLowerCase() === cat);
      } else {
        result = result.filter(s => s.category === cat);
      }
    }

    this.filteredSimulations = result;
  }

  openSimulation(sim: Simulation): void {
    if (sim.status === 'coming-soon') return;
    this.router.navigate(['/student-portal/simulations', sim.id, 'overview']);
  }
}
