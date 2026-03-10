import { Component, OnInit } from '@angular/core';

interface CoachAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialization: string;
  description: string;
  skills: string[];
  rating: number;
  sessions: number;
  available: boolean;
}

@Component({
  selector: 'app-student-career-coaching',
  templateUrl: './career-coaching.component.html',
  styleUrls: ['./career-coaching.component.scss']
})
export class StudentCareerCoachingComponent implements OnInit {
  activeTab = 'coaches';
  chatOpen = false;
  activeAgent: CoachAgent | null = null;
  chatMessages: { role: string; text: string }[] = [];
  userMessage = '';

  agents: CoachAgent[] = [
    {
      id: 'career-advisor',
      name: 'Dr. Sarah Chen',
      role: 'Career Strategy Advisor',
      avatar: '👩‍💼',
      specialization: 'Career Planning & Development',
      description: 'Specializes in career transitions, personal branding, and long-term professional development strategies.',
      skills: ['Resume Review', 'Interview Prep', 'Career Planning', 'Networking Strategy'],
      rating: 4.9,
      sessions: 1240,
      available: true
    },
    {
      id: 'industry-mentor',
      name: 'Marcus Webb',
      role: 'Senior Mechanical Engineer',
      avatar: '👨‍🔧',
      specialization: 'Engineering & Technical Mentorship',
      description: 'Senior engineer with 15+ years in HVAC and building services. Direct, practical advice on technical careers.',
      skills: ['Technical Skills', 'Industry Knowledge', 'Professional Standards', 'Project Management'],
      rating: 4.8,
      sessions: 890,
      available: true
    },
    {
      id: 'skills-coach',
      name: 'Priya Nair',
      role: 'Skills Development Coach',
      avatar: '👩‍🏫',
      specialization: 'Workplace Skills & Communication',
      description: 'Helps develop essential workplace skills including communication, teamwork, and professional writing.',
      skills: ['Communication', 'Teamwork', 'Writing Skills', 'Presentation'],
      rating: 4.7,
      sessions: 760,
      available: true
    },
    {
      id: 'wellbeing-coach',
      name: 'Dr. James Leung',
      role: 'Wellbeing & Resilience Coach',
      avatar: '👨‍⚕️',
      specialization: 'Mental Health & Work-Life Balance',
      description: 'Supports students with workplace stress, imposter syndrome, and maintaining work-life balance during placements.',
      skills: ['Stress Management', 'Mindfulness', 'Work-Life Balance', 'Resilience'],
      rating: 4.9,
      sessions: 540,
      available: false
    }
  ];

  resources = [
    { title: 'Resume Writing Guide', icon: '📝', category: 'Career', description: 'How to write a standout engineering resume' },
    { title: 'Interview Preparation Kit', icon: '🎯', category: 'Career', description: 'Common technical interview questions and strategies' },
    { title: 'Workplace Communication', icon: '💬', category: 'Skills', description: 'Effective email, meeting, and presentation skills' },
    { title: 'Industry Certifications', icon: '📋', category: 'Technical', description: 'Guide to relevant professional certifications' },
    { title: 'Networking Tips', icon: '🤝', category: 'Career', description: 'Building professional connections during placement' },
    { title: 'Mental Health Resources', icon: '🧠', category: 'Wellbeing', description: 'Managing stress and maintaining balance' }
  ];

  ngOnInit(): void {}

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  openChat(agent: CoachAgent): void {
    if (!agent.available) return;
    this.activeAgent = agent;
    this.chatOpen = true;
    this.chatMessages = [
      { role: 'agent', text: `Hi! I'm ${agent.name}. ${agent.description}\n\nHow can I help you today?` }
    ];
  }

  closeChat(): void {
    this.chatOpen = false;
    this.activeAgent = null;
    this.chatMessages = [];
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    this.chatMessages.push({ role: 'user', text: this.userMessage });
    const msg = this.userMessage;
    this.userMessage = '';

    setTimeout(() => {
      this.chatMessages.push({
        role: 'agent',
        text: `Thanks for sharing that. Let me think about the best way to help you with "${msg.substring(0, 50)}..."\n\nThis is a simulation preview — in the full version, you'll get AI-powered coaching responses tailored to your career goals.`
      });
    }, 1000);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
