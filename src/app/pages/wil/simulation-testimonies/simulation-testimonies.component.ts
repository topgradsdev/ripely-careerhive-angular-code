import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-simulation-testimonies',
  templateUrl: './simulation-testimonies.component.html',
  styleUrls: ['./simulation-testimonies.component.scss']
})
export class SimulationTestimoniesComponent implements OnInit {
  id: string;

  activeTestimonySubTab = 'published';
  testimoniesList: MatTableDataSource<any>;
  testimoniesColumns = ['name', 'date', 'rating', 'excerpt', 'status'];
  testimoniesStats = { total: 12, published: 7, submitted: 3, archived: 2 };
  mockTestimonies = [
    { name: 'Alice Chen', date: '2024-03-01', rating: 5, excerpt: 'The simulation was incredibly realistic and helpful.', status: 'published' },
    { name: 'Bob Williams', date: '2024-02-25', rating: 4, excerpt: 'Great learning experience overall.', status: 'published' },
    { name: 'Carol Davis', date: '2024-03-05', rating: 5, excerpt: 'I feel much more prepared for my internship now.', status: 'submitted' }
  ];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.testimoniesList = new MatTableDataSource(this.mockTestimonies);
  }

  refreshData() {
    // Reload testimonies data when tab is clicked
  }

  filterTestimonies(status: string) {
    this.activeTestimonySubTab = status;
    const filtered = this.mockTestimonies.filter(t => t.status === status);
    this.testimoniesList = new MatTableDataSource(filtered);
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  }
}
