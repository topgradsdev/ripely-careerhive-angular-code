import { Component, OnInit } from '@angular/core';

interface Simulation {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  tasks: number;
  skills: string[];
  status: 'available' | 'in-progress' | 'completed' | 'coming-soon';
  progress: number;
  icon: string;
  accentColor: string;
}

@Component({
  selector: 'app-student-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.scss']
})
export class StudentSimulationsComponent implements OnInit {
  activeFilter = 'all';
  activeCategory = 'all';
  searchQuery = '';

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
      description: 'Assess cooling tower drift loss at Heron Gate Business Park. Calculate drift rates, complete water balances, and produce a client-ready engineering report.',
      category: 'engineering',
      difficulty: 'Intermediate',
      duration: '3-4 hrs',
      tasks: 6,
      skills: ['Technical Writing', 'Engineering Calculations', 'Risk Assessment', 'Client Communication'],
      status: 'in-progress',
      progress: 33,
      icon: '🏗️',
      accentColor: '#ff6b2c'
    },
    {
      id: 'strategy',
      title: 'The Strategy Sprint',
      company: 'McKinley & Co',
      description: 'Lead a strategy sprint for a Fortune 500 client. Analyze market data, develop recommendations, and present to the executive board.',
      category: 'business',
      difficulty: 'Advanced',
      duration: '5-7 hrs',
      tasks: 8,
      skills: ['Strategic Thinking', 'Data Analysis', 'Presentation', 'Stakeholder Management'],
      status: 'coming-soon',
      progress: 0,
      icon: '📊',
      accentColor: '#4a8aff'
    },
    {
      id: 'launch',
      title: 'Zero to Launch',
      company: 'Nova Health',
      description: 'Take a healthcare product from concept to market launch. Navigate regulatory requirements, build go-to-market strategy, and coordinate cross-functional teams.',
      category: 'healthcare',
      difficulty: 'Intermediate',
      duration: '4-6 hrs',
      tasks: 7,
      skills: ['Product Management', 'Regulatory Compliance', 'Marketing Strategy', 'Cross-functional Leadership'],
      status: 'coming-soon',
      progress: 0,
      icon: '🚀',
      accentColor: '#00b894'
    }
  ];

  filteredSimulations: Simulation[] = [];

  ngOnInit(): void {
    this.applyFilters();
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
    } else if (this.activeFilter === 'my') {
      result = result.filter(s => s.status === 'in-progress' || s.status === 'completed');
    }

    if (this.activeCategory !== 'all') {
      const cat = this.activeCategory;
      if (cat === 'intermediate' || cat === 'advanced') {
        result = result.filter(s => s.difficulty.toLowerCase() === cat);
      } else {
        result = result.filter(s => s.category === cat);
      }
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    this.filteredSimulations = result;
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'Advanced': return 'advanced';
      case 'Intermediate': return 'intermediate';
      default: return 'beginner';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Start';
    }
  }

  getCountByStatus(status: string): number {
    return this.filteredSimulations.filter(s => s.status === status).length;
  }

  getByStatus(status: string): Simulation[] {
    return this.filteredSimulations.filter(s => s.status === status);
  }
}
