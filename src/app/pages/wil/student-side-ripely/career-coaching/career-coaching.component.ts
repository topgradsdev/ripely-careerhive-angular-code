import { Component, OnInit } from '@angular/core';

interface CoachAgent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  avatarBg: string;
  filter: string;
  description: string;
  bio: string;
  rating: number;
  ratingCount: number;
  satisfaction: number;
  sessions: number;
  online: boolean;
  specialties: string[];
  tags: string[];
  reviews: { author: string; text: string; rating: number }[];
}

@Component({
  selector: 'app-student-career-coaching',
  templateUrl: './career-coaching.component.html',
  styleUrls: ['./career-coaching.component.scss']
})
export class StudentCareerCoachingComponent implements OnInit {
  searchQuery = '';
  activeFilter = 'all';
  selectedAgent: CoachAgent | null = null;

  filters = [
    { key: 'all', label: 'All Agents' },
    { key: 'career', label: 'Career Strategy' },
    { key: 'technical', label: 'Technical' },
    { key: 'interview', label: 'Interview Prep' },
    { key: 'salary', label: 'Salary & Negotiation' },
    { key: 'leadership', label: 'Leadership' }
  ];

  agents: CoachAgent[] = [
    {
      id: 'nova-chen',
      name: 'Nova Chen',
      role: 'Career Strategist',
      emoji: '🎯',
      avatarBg: 'linear-gradient(135deg, #1a1a3e, #2d1a4e)',
      filter: 'career',
      description: 'Helps you map out your career trajectory with data-driven strategies and personalized action plans.',
      bio: 'Nova is a certified career strategist with over 10 years of experience guiding professionals through pivotal career transitions. She combines data analytics with personalized coaching to create actionable roadmaps. Her clients have landed roles at top Fortune 500 companies and fast-growing startups alike.',
      rating: 4.9,
      ratingCount: 312,
      satisfaction: 97,
      sessions: 1840,
      online: true,
      specialties: ['Career Roadmapping', 'Personal Branding', 'Job Market Analysis', 'Goal Setting', 'LinkedIn Optimization', 'Career Transitions'],
      tags: ['Career Strategy', 'Personal Branding', 'Job Search'],
      reviews: [
        { author: 'Alex M.', text: 'Nova helped me completely redefine my career path. Her data-driven approach gave me confidence in my decisions.', rating: 5 },
        { author: 'Jordan K.', text: 'Incredible strategist. She saw opportunities I never considered and helped me land my dream role.', rating: 5 }
      ]
    },
    {
      id: 'marcus-reid',
      name: 'Marcus Reid',
      role: 'Resume & LinkedIn Coach',
      emoji: '📝',
      avatarBg: 'linear-gradient(135deg, #1e2d1a, #1a3028)',
      filter: 'career',
      description: 'Crafts compelling resumes and LinkedIn profiles that get you noticed by recruiters and hiring managers.',
      bio: 'Marcus is a former tech recruiter turned career coach who has reviewed over 5,000 resumes. He understands what hiring managers look for and helps clients craft narratives that stand out. His LinkedIn optimization strategies have helped clients increase profile views by an average of 300%.',
      rating: 4.8,
      ratingCount: 287,
      satisfaction: 95,
      sessions: 1520,
      online: true,
      specialties: ['Resume Writing', 'LinkedIn Profiles', 'Cover Letters', 'ATS Optimization', 'Portfolio Reviews', 'Personal Branding'],
      tags: ['Resume', 'LinkedIn', 'Personal Branding'],
      reviews: [
        { author: 'Sam T.', text: 'Marcus transformed my resume from generic to outstanding. Started getting callbacks within a week!', rating: 5 },
        { author: 'Priya D.', text: 'His LinkedIn tips were game-changing. My profile views tripled in the first month.', rating: 4 }
      ]
    },
    {
      id: 'kai-tanaka',
      name: 'Kai Tanaka',
      role: 'Technical Interview Coach',
      emoji: '💻',
      avatarBg: 'linear-gradient(135deg, #1a2040, #152030)',
      filter: 'technical',
      description: 'Prepares you for technical interviews with mock sessions, coding challenges, and system design practice.',
      bio: 'Kai is a senior software engineer and technical interview coach who has conducted over 500 mock interviews. With experience at major tech companies, he knows exactly what interviewers are looking for. His structured approach to problem-solving has helped hundreds of engineers ace their technical interviews.',
      rating: 4.9,
      ratingCount: 241,
      satisfaction: 98,
      sessions: 980,
      online: true,
      specialties: ['Data Structures & Algorithms', 'System Design', 'Behavioral Questions', 'Mock Interviews', 'Code Review', 'Whiteboard Coding'],
      tags: ['Technical', 'Coding', 'System Design'],
      reviews: [
        { author: 'Chris L.', text: 'Kai\'s mock interviews were tougher than the real thing. I felt completely prepared on interview day.', rating: 5 },
        { author: 'Maya R.', text: 'His system design coaching was incredibly thorough. Landed a senior role at a FAANG company!', rating: 5 }
      ]
    },
    {
      id: 'elena-vasquez',
      name: 'Elena Vasquez',
      role: 'Salary Negotiation Expert',
      emoji: '💰',
      avatarBg: 'linear-gradient(135deg, #3a1a1a, #2d1a1a)',
      filter: 'salary',
      description: 'Empowers you to negotiate higher compensation packages with confidence and proven strategies.',
      bio: 'Elena is a compensation consultant and negotiation expert who has helped clients collectively negotiate over $2M in additional compensation. She teaches evidence-based negotiation tactics that work across industries and seniority levels. Her approach combines market research with psychological strategies.',
      rating: 4.7,
      ratingCount: 198,
      satisfaction: 94,
      sessions: 760,
      online: true,
      specialties: ['Salary Negotiation', 'Offer Evaluation', 'Benefits Analysis', 'Equity Compensation', 'Promotion Strategies', 'Market Research'],
      tags: ['Negotiation', 'Compensation', 'Offers'],
      reviews: [
        { author: 'Taylor B.', text: 'Elena helped me negotiate a 25% higher salary than the initial offer. Worth every minute!', rating: 5 },
        { author: 'Raj P.', text: 'Her framework for evaluating total compensation was eye-opening. I now negotiate with confidence.', rating: 4 }
      ]
    },
    {
      id: 'james-okafor',
      name: 'Dr. James Okafor',
      role: 'Leadership & Management Coach',
      emoji: '🧭',
      avatarBg: 'linear-gradient(135deg, #1a1a3e, #201a3e)',
      filter: 'leadership',
      description: 'Develops your leadership skills and helps you transition into management roles with confidence.',
      bio: 'Dr. James Okafor is an organizational psychologist and executive coach with 15 years of experience developing leaders. He specializes in first-time manager transitions and helps professionals build the emotional intelligence, communication skills, and strategic thinking needed for leadership success.',
      rating: 4.8,
      ratingCount: 156,
      satisfaction: 96,
      sessions: 640,
      online: true,
      specialties: ['Leadership Development', 'Team Management', 'Executive Presence', 'Conflict Resolution', 'Strategic Thinking', 'Emotional Intelligence'],
      tags: ['Leadership', 'Management', 'Executive'],
      reviews: [
        { author: 'Nina W.', text: 'Dr. Okafor\'s coaching transformed my leadership style. My team engagement scores improved dramatically.', rating: 5 },
        { author: 'David H.', text: 'His insights on emotional intelligence were practical and immediately applicable. Highly recommend.', rating: 5 }
      ]
    },
    {
      id: 'amara-singh',
      name: 'Amara Singh',
      role: 'Interview Confidence Coach',
      emoji: '🎤',
      avatarBg: 'linear-gradient(135deg, #2a1a1a, #301a20)',
      filter: 'interview',
      description: 'Builds your interview confidence through practice, feedback, and proven communication techniques.',
      bio: 'Amara is a communications expert and confidence coach who has helped over 2,000 professionals master the art of interviewing. She focuses on body language, storytelling, and managing interview anxiety. Her holistic approach ensures clients feel confident and authentic in any interview setting.',
      rating: 4.9,
      ratingCount: 345,
      satisfaction: 97,
      sessions: 2100,
      online: true,
      specialties: ['Mock Interviews', 'Body Language', 'Storytelling', 'Anxiety Management', 'STAR Method', 'Communication Skills'],
      tags: ['Interviews', 'Confidence', 'Communication'],
      reviews: [
        { author: 'Lisa F.', text: 'Amara completely changed my approach to interviews. I went from dreading them to actually enjoying them!', rating: 5 },
        { author: 'Kevin O.', text: 'Her STAR method coaching was phenomenal. I aced my behavioral interviews after just two sessions.', rating: 5 }
      ]
    },
    {
      id: 'liam-foster',
      name: 'Liam Foster',
      role: 'Career Pivot Strategist',
      emoji: '🔄',
      avatarBg: 'linear-gradient(135deg, #0a2a2a, #0a2020)',
      filter: 'career',
      description: 'Guides you through career transitions with a structured framework for exploring new industries and roles.',
      bio: 'Liam has personally navigated three major career pivots and now helps others do the same. From finance to tech to consulting, he understands the challenges of career transitions firsthand. His structured approach helps clients identify transferable skills and create actionable transition plans.',
      rating: 4.6,
      ratingCount: 124,
      satisfaction: 92,
      sessions: 480,
      online: false,
      specialties: ['Career Transitions', 'Skill Assessment', 'Industry Research', 'Networking Strategy', 'Transferable Skills', 'Action Planning'],
      tags: ['Career Pivot', 'Transitions', 'Strategy'],
      reviews: [
        { author: 'Emma C.', text: 'Liam\'s framework made my career pivot feel manageable. I successfully transitioned from finance to tech!', rating: 5 },
        { author: 'Andre M.', text: 'His own career pivot experience made his advice authentic and practical. Great coach for transitions.', rating: 4 }
      ]
    },
    {
      id: 'zara-mohammed',
      name: 'Zara Mohammed',
      role: 'Technical Resume Specialist',
      emoji: '📄',
      avatarBg: 'linear-gradient(135deg, #1a2040, #1a1a30)',
      filter: 'technical',
      description: 'Specializes in crafting technical resumes that highlight your engineering skills and project impact.',
      bio: 'Zara is a former engineering hiring manager who now helps technical professionals showcase their skills effectively. She understands the nuances of technical resumes, from quantifying impact to highlighting the right technologies. Her clients consistently report higher callback rates after working with her.',
      rating: 4.8,
      ratingCount: 210,
      satisfaction: 95,
      sessions: 1200,
      online: true,
      specialties: ['Technical Resumes', 'GitHub Portfolios', 'Project Descriptions', 'Skills Assessment', 'ATS Optimization', 'Technical Writing'],
      tags: ['Technical', 'Resume', 'Portfolio'],
      reviews: [
        { author: 'Mike J.', text: 'Zara knew exactly how to frame my projects for maximum impact. My callback rate doubled!', rating: 5 },
        { author: 'Sophie L.', text: 'Her understanding of technical roles is unmatched. She helped me tailor my resume for each application.', rating: 5 }
      ]
    }
  ];

  filteredAgents: CoachAgent[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    let results = [...this.agents];

    if (this.activeFilter !== 'all') {
      results = results.filter(a => a.filter === this.activeFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      results = results.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    this.filteredAgents = results;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openProfile(agent: CoachAgent): void {
    this.selectedAgent = agent;
  }

  closeProfile(): void {
    this.selectedAgent = null;
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  getEmptyStars(rating: number): number[] {
    const full = Math.floor(rating);
    const half = this.hasHalfStar(rating) ? 1 : 0;
    return Array(5 - full - half).fill(0);
  }

  formatSessions(n: number): string {
    if (n >= 1000) {
      return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return n.toString();
  }
}
