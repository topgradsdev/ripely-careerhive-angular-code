import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulationWindowService } from '../shared/simulation-window.service';

interface TeamMember {
  initials: string;
  name: string;
  subtitle: string;
  tag: string;
  tagStyle: string;
  avatarGradient: string;
}

interface TaskItem {
  number: string;
  title: string;
  subtitle: string;
}

interface StatItem {
  value: string;
  label: string;
  accent: boolean;
}

interface SituationCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-simulation-intro',
  templateUrl: './simulation-intro.component.html',
  styleUrls: ['./simulation-intro.component.scss']
})
export class SimulationIntroComponent implements OnInit {
  simulationId = '';

  stats: StatItem[] = [
    { value: '$18,500', label: 'Consultancy fee', accent: true },
    { value: '340', label: 'Employees', accent: false },
    { value: '3 weeks', label: 'Programme', accent: false },
    { value: '2 towers', label: 'Site assets', accent: false }
  ];

  situationCards: SituationCard[] = [
    { icon: '\u{1F3D7}\uFE0F', title: 'Visible Drift Problem', description: 'Tower 1 drift is reaching the car park. A displaced eliminator panel is suspected.' },
    { icon: '\u26A0\uFE0F', title: 'Water Balance Unknown', description: 'No formal water balance on record. Makeup, evaporation and blowdown unverified.' },
    { icon: '\u{1F4CB}', title: 'Formal Report Required', description: 'Must follow ASHRAE & BSRIA standards, checked by Marcus, suitable for client delivery.' }
  ];

  team: TeamMember[] = [
    {
      initials: 'MW',
      name: 'Marcus Webb',
      subtitle: 'Senior Mechanical Engineer \u00B7 Your Supervisor',
      tag: 'Reviews your work',
      tagStyle: 'tag-supervisor',
      avatarGradient: 'avatar-navy'
    },
    {
      initials: 'PN',
      name: 'Priya Nair',
      subtitle: 'Mechanical Engineer \u00B7 Peer & Colleague',
      tag: 'Peer support',
      tagStyle: 'tag-peer',
      avatarGradient: 'avatar-teal'
    },
    {
      initials: 'DO',
      name: 'Derek Okafor',
      subtitle: 'Trainee Technician \u00B7 Also New',
      tag: 'Same intake',
      tagStyle: 'tag-intake',
      avatarGradient: 'avatar-brown'
    }
  ];

  tasks: TaskItem[] = [
    { number: '01', title: 'Read the Brief & Know Your Job', subtitle: 'Day 1 \u00B7 Brief comprehension, site context' },
    { number: '02', title: 'Gather Your Data', subtitle: 'Day 1 \u00B7 Equipment datasheets, unit conversion' },
    { number: '03', title: 'Calculate Drift Loss \u2014 Tower 1', subtitle: 'Day 2 \u00B7 Drift loss calculation, formula validation' },
    { number: '04', title: 'Calculate Drift Loss \u2014 Tower 2 & Site Total', subtitle: 'Day 2 \u00B7 Multi-tower aggregation' },
    { number: '05', title: 'Water Balance Calculation', subtitle: 'Day 3 \u00B7 Evaporation, blowdown, makeup water' },
    { number: '06', title: 'Calculation Report', subtitle: 'Day 3 \u00B7 Technical writing, client communication' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private windowService: SimulationWindowService
  ) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  openChat(): void {
    this.router.navigate(['../messages'], { relativeTo: this.route });
  }

  /** Minimize — hide window to taskbar, can restore by clicking taskbar */
  minimizeWindow(): void {
    this.windowService.minimize();
  }

  /** Close — navigate away, destroys the component */
  closeWindow(): void {
    this.windowService.restore();
    this.router.navigate(['../messages'], { relativeTo: this.route });
  }
}
