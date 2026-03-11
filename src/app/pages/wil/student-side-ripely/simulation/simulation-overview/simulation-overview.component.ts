import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface TaskAccordion {
  title: string;
  description: string;
  skillPills: { label: string; colorClass: string }[];
  outcomeText: string;
  cardHeader: string;
  cardRows: { dot: string; label: string; val: string }[];
  expanded: boolean;
}

interface VideoCard {
  initials: string;
  name: string;
  role: string;
  color: string;
}

@Component({
  selector: 'app-simulation-overview',
  templateUrl: './simulation-overview.component.html',
  styleUrls: ['./simulation-overview.component.scss']
})
export class SimulationOverviewComponent implements OnInit {
  simulationId = '';

  // Offer letter overlay
  showOfferOverlay = false;
  candidateName = '';

  partnersRow1 = ['ARUP', 'AURECON', 'WSP', 'MOTT MACDONALD', 'JACOBS', 'HATCH'];
  partnersRow2 = ['CUNDALL', 'RAMBOLL', 'BECA', 'GHD', 'AECOM', 'WOOD'];

  tasks: TaskAccordion[] = [
    {
      title: 'Read the Brief & Know Your Job',
      description: 'Read the client instruction letter, review the site visit notes, and confirm you understand the scope of the assessment. Marcus needs to know you\'re across the project before he puts your name on anything.',
      skillPills: [
        { label: 'Brief Comprehension', colorClass: 'ov-task-skill-orange' },
        { label: 'Site Assessment', colorClass: 'ov-task-skill-blue' }
      ],
      outcomeText: 'You\'ll be able to read and interpret a real client brief, scope a site visit, and brief a supervisor — a core competency in every junior engineering role.',
      cardHeader: 'Project Brief — Heron Gate',
      cardRows: [
        { dot: '#fb923c', label: 'Client instruction letter', val: 'Received' },
        { dot: '#60a5fa', label: 'Site visit notes', val: '3 pages' },
        { dot: '#34d399', label: 'Scope of works', val: 'Confirmed' },
        { dot: '#c084fc', label: 'Supervisor sign-off', val: 'Pending' }
      ],
      expanded: true
    },
    {
      title: 'Gather Your Data',
      description: 'Locate the Baltimore Aircoil equipment datasheets in the Library, extract the circulating flow rate, drift eliminator efficiency, and temperature data for both towers. Log your sources.',
      skillPills: [
        { label: 'Equipment Datasheets', colorClass: 'ov-task-skill-blue' },
        { label: 'Unit Conversion', colorClass: 'ov-task-skill-amber' }
      ],
      outcomeText: 'You\'ll be able to extract engineering data from real manufacturer datasheets and perform unit conversions between GPM, L/s and L/hr with confidence.',
      cardHeader: 'Library — Baltimore Aircoil',
      cardRows: [
        { dot: '#60a5fa', label: 'BAC VXT-1520 Datasheet', val: 'PDF · 2.1Mb' },
        { dot: '#60a5fa', label: 'Flow rate (Tower 1)', val: '— GPM' },
        { dot: '#f59e0b', label: 'Drift eliminator %', val: '— %' },
        { dot: '#34d399', label: 'Temperature differential', val: '— °C' }
      ],
      expanded: false
    },
    {
      title: 'Calculate Drift Loss — Tower 1',
      description: 'Complete Sections A, B and C of the Drift Loss Calculator for Tower 1. Apply the percentage method formula, convert units, and write a plain-English summary of your results for Marcus\'s review.',
      skillPills: [
        { label: 'Drift Loss Calc', colorClass: 'ov-task-skill-orange' },
        { label: 'CTI ATC-140', colorClass: 'ov-task-skill-green' }
      ],
      outcomeText: 'You\'ll be able to calculate cooling tower drift loss to CTI ATC-140 standard using the percentage method — the exact methodology used by MEP consultants on live projects.',
      cardHeader: 'Drift Loss Calculator — Tower 1',
      cardRows: [
        { dot: '#fb923c', label: 'Section A · Flow rate input', val: '—' },
        { dot: '#fb923c', label: 'Section B · Drift % calc', val: '—' },
        { dot: '#fb923c', label: 'Section C · Results summary', val: '—' },
        { dot: '#34d399', label: 'Marcus review', val: 'Awaiting' }
      ],
      expanded: false
    },
    {
      title: 'Calculate Drift Loss — Tower 2 & Site Total',
      description: 'Repeat the drift loss calculation for Tower 2, then calculate the combined site total. Compare results across both towers and flag any anomalies to Marcus.',
      skillPills: [
        { label: 'Drift Loss Calc', colorClass: 'ov-task-skill-orange' },
        { label: 'Water Balance', colorClass: 'ov-task-skill-blue' }
      ],
      outcomeText: 'You\'ll be able to repeat a complex calculation independently, cross-check results between two systems, and document discrepancies — critical skills for any site assessment report.',
      cardHeader: 'Site Totals — Towers 1 & 2',
      cardRows: [
        { dot: '#fb923c', label: 'Tower 1 drift loss', val: '— L/hr' },
        { dot: '#fb923c', label: 'Tower 2 drift loss', val: '— L/hr' },
        { dot: '#60a5fa', label: 'Combined site total', val: '— L/hr' },
        { dot: '#f59e0b', label: 'Anomaly flag', val: 'None' }
      ],
      expanded: false
    },
    {
      title: 'Water Balance Calculation',
      description: 'Complete the Water Balance Calculator — evaporation loss, blowdown, drift, and total makeup water required. Apply ASHRAE methodology and confirm figures are consistent with your drift loss results.',
      skillPills: [
        { label: 'Water Balance', colorClass: 'ov-task-skill-blue' },
        { label: 'ASHRAE Standards', colorClass: 'ov-task-skill-green' }
      ],
      outcomeText: 'You\'ll be able to complete a full open-circuit water balance to ASHRAE methodology — calculating evaporation, blowdown, drift and makeup water with consistent units throughout.',
      cardHeader: 'Water Balance Calculator',
      cardRows: [
        { dot: '#60a5fa', label: 'Evaporation loss', val: '— L/hr' },
        { dot: '#60a5fa', label: 'Blowdown', val: '— L/hr' },
        { dot: '#fb923c', label: 'Drift loss', val: '— L/hr' },
        { dot: '#34d399', label: 'Total makeup water', val: '— L/hr' }
      ],
      expanded: false
    },
    {
      title: 'Produce the Calculation Report',
      description: 'Use the Report Builder to produce Meridian\'s formal calculation report. Complete all sections — executive summary, methodology, results, key findings and recommendations. Marcus reviews before it goes to the client.',
      skillPills: [
        { label: 'Engineering Reporting', colorClass: 'ov-task-skill-purple' },
        { label: 'Supervisor Comms', colorClass: 'ov-task-skill-green' }
      ],
      outcomeText: 'You\'ll be able to produce a structured, professional engineering calculation report to consultant-grade standards — ready to put your name on and submit to a real client.',
      cardHeader: 'Report Builder — Meridian Standard',
      cardRows: [
        { dot: '#c084fc', label: 'Executive summary', val: '—' },
        { dot: '#c084fc', label: 'Methodology', val: '—' },
        { dot: '#c084fc', label: 'Results & findings', val: '—' },
        { dot: '#34d399', label: 'Marcus final review', val: 'Awaiting' }
      ],
      expanded: false
    }
  ];

  videos: VideoCard[] = [
    { initials: 'JK', name: 'Jamie K.', role: 'Mech. Eng. student · Melbourne', color: '#1a3a6b' },
    { initials: 'SR', name: 'Sana R.', role: 'HNC Mech. Eng. · Graduate at Arup', color: '#7a2040' },
    { initials: 'ML', name: 'Marcus L.', role: 'BEng student · Graduate at WSP', color: '#1a5a3a' },
    { initials: 'DP', name: 'Daniel P.', role: 'BEng Mechanical · Graduate at Aurecon', color: '#2a3a6b' },
    { initials: 'PW', name: 'Priya W.', role: 'HND Building Services · Mott MacDonald', color: '#3a1a5a' }
  ];

  carouselPage = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  goBack(): void {
    this.router.navigate(['/student-portal/simulations']);
  }

  enrol(): void {
    this.showOfferOverlay = true;
  }

  closeOfferOverlay(): void {
    this.showOfferOverlay = false;
  }

  acceptOffer(): void {
    this.showOfferOverlay = false;
    this.router.navigate(['../intro'], { relativeTo: this.route });
  }

  toggleTask(index: number): void {
    this.tasks[index].expanded = !this.tasks[index].expanded;
  }

  carouselNav(dir: number): void {
    const max = Math.max(0, this.videos.length - 4);
    this.carouselPage = Math.max(0, Math.min(max, this.carouselPage + dir));
  }

  get carouselTranslate(): string {
    return `translateX(-${this.carouselPage * 196}px)`;
  }
}
