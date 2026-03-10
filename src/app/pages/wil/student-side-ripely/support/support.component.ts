import { Component } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
  category: string;
}

@Component({
  selector: 'app-student-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class StudentSupportComponent {
  contactName = '';
  contactEmail = '';
  contactSubject = '';
  contactMessage = '';
  formSubmitted = false;

  faqs: FaqItem[] = [
    {
      question: 'How do simulations work?',
      answer: 'Each simulation places you in a realistic workplace scenario. You complete tasks sequentially, interact with AI-powered mentors and colleagues, and receive scores and feedback on your performance. Your work is assessed across multiple skills relevant to the industry.',
      open: false,
      category: 'General'
    },
    {
      question: 'Can I restart a simulation after completing it?',
      answer: 'Yes, you can restart any completed simulation to improve your scores. Your previous attempt records are preserved so you can track your improvement over time.',
      open: false,
      category: 'General'
    },
    {
      question: 'How is my score calculated?',
      answer: 'Your score is a weighted average across all tasks in the simulation. Each task carries a different weight — for example, the engineering calculation tasks typically carry more weight than video-watching tasks. You receive a detailed breakdown after completing each task.',
      open: false,
      category: 'Assessment'
    },
    {
      question: 'What skills are tracked?',
      answer: 'Skills vary by simulation but typically include technical skills (calculations, data analysis), professional skills (communication, report writing), and workplace skills (teamwork, time management). Each task assesses specific skills which are tracked on your dashboard.',
      open: false,
      category: 'Assessment'
    },
    {
      question: 'Can I message my coach during a simulation?',
      answer: 'Yes, AI-powered coaches and mentors are available through the messaging system during simulations. They provide guidance, answer questions, and offer feedback. Note that some mentors have distinct communication styles — just like in a real workplace.',
      open: false,
      category: 'Support'
    },
    {
      question: 'What happens if I get stuck on a task?',
      answer: 'If you are stuck, try using the Library for reference materials, checking your messages for hints from colleagues, or visiting the Career Coaching section for guidance. Each task is designed to be solvable with the resources available in the simulation.',
      open: false,
      category: 'Support'
    },
    {
      question: 'Is my progress saved automatically?',
      answer: 'Yes, your progress is saved automatically as you work through each simulation. You can close your browser and return later to continue from where you left off.',
      open: false,
      category: 'Technical'
    },
    {
      question: 'Which browsers are supported?',
      answer: 'Career Hive works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend using a desktop or laptop for the best experience, though mobile viewing is supported for the dashboard.',
      open: false,
      category: 'Technical'
    }
  ];

  helpCards = [
    { icon: '📧', title: 'Email Support', description: 'Get help within 24 hours', action: 'support@careerhive.com' },
    { icon: '💬', title: 'Live Chat', description: 'Available Mon-Fri 9am-5pm', action: 'Start Chat' },
    { icon: '📚', title: 'Knowledge Base', description: 'Browse help articles', action: 'Browse Articles' }
  ];

  toggleFaq(faq: FaqItem): void {
    faq.open = !faq.open;
  }

  submitContact(): void {
    if (!this.contactName || !this.contactEmail || !this.contactMessage) return;
    this.formSubmitted = true;
  }

  resetForm(): void {
    this.contactName = '';
    this.contactEmail = '';
    this.contactSubject = '';
    this.contactMessage = '';
    this.formSubmitted = false;
  }
}
