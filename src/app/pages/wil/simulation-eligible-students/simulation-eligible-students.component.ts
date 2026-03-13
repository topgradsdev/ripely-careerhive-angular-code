import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-simulation-eligible-students',
  templateUrl: './simulation-eligible-students.component.html',
  styleUrls: ['./simulation-eligible-students.component.scss']
})
export class SimulationEligibleStudentsComponent implements OnInit {
  id: string;

  eligibleStudentsList: MatTableDataSource<any>;
  eligibleStudentsColumns = ['checkbox', 'student_id', 'student_name', 'email', 'date_enrolled', 'progress', 'priority', 'testimony_submitted', 'actions'];
  eligibleStudentsStats = { total: 18, active: 14, pending: 3, inactive: 1 };
  mockStudents = [
    { name: 'Bob Jade', student_id: 's3515996', email: 'bob@email.com', date_enrolled: '24/06/2026', progress: 95, priority: 'Low', testimony_submitted: 'Yes', selected: false },
    { name: 'Nathan Jones', student_id: 's3515996', email: 'nathan@email.com', date_enrolled: '24/06/2026', progress: 50, priority: 'High', testimony_submitted: 'No', selected: false },
    { name: 'Michelle Watson', student_id: 's3515996', email: 'michelle@email.com', date_enrolled: '24/06/2026', progress: 0, priority: 'High', testimony_submitted: 'No', selected: false },
    { name: 'Peter Kotick', student_id: 's3515996', email: 'peter@email.com', date_enrolled: '24/06/2026', progress: 100, priority: 'High', testimony_submitted: 'No', selected: false },
    { name: 'Claire Wilhelm', student_id: 's3515996', email: 'claire@email.com', date_enrolled: '23/05/2026', progress: 95, priority: 'Medium', testimony_submitted: 'Yes', selected: false }
  ];

  selectAllStudents = false;
  studentSearchKeywords = '';

  pendingPlacements = 0;
  placedCandidates = 0;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.eligibleStudentsList = new MatTableDataSource(this.mockStudents);
  }

  refreshData() {
    // Reload eligible students data when tab is clicked
  }

  onSelectAll() {
    this.mockStudents.forEach(s => s.selected = this.selectAllStudents);
  }

  getProgressGradient(progress: number): string {
    if (progress >= 90) return 'linear-gradient(90deg, #464BA8 0%, #26C296 100%)';
    if (progress >= 50) return 'linear-gradient(90deg, #464BA8 0%, #26C296 100%)';
    if (progress > 0) return 'linear-gradient(90deg, #464BA8 0%, #26C296 100%)';
    return '#E0E0E0';
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return '#26C296';
    if (progress >= 50) return '#464BA8';
    if (progress >= 25) return '#F4A261';
    return '#F47761';
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
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
}
