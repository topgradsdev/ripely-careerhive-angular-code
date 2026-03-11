import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulationWindowService } from '../shared/simulation-window.service';

interface DmThread {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ChannelItem {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
}

interface ChatMessage {
  id: number;
  senderId: string;
  senderName: string;
  initials: string;
  avatarColor: string;
  text: string;
  time: string;
  isMe: boolean;
}

@Component({
  selector: 'app-simulation-messages',
  templateUrl: './simulation-messages.component.html',
  styleUrls: ['./simulation-messages.component.scss']
})
export class SimulationMessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatFeed') chatFeedRef!: ElementRef;

  simulationId = '';
  activeThreadId = 'marcus';
  newMessage = '';
  isTyping = false;
  showReturnBar = false;
  private shouldScrollToBottom = false;

  channels: ChannelItem[] = [
    {
      id: 'general',
      name: 'general',
      preview: 'Derek: Updated the pressure specs...',
      time: '9:12 AM',
      unread: 3
    }
  ];

  dmThreads: DmThread[] = [
    {
      id: 'marcus',
      name: 'Marcus Webb',
      role: 'Senior Mechanical Engineer',
      initials: 'MW',
      avatarColor: '#1e3a5f',
      preview: 'Check the cooling tower specs before you start.',
      time: '9:15 AM',
      unread: 2,
      online: true
    },
    {
      id: 'priya',
      name: 'Priya Nair',
      role: 'Environmental Analyst',
      initials: 'PN',
      avatarColor: '#0d7377',
      preview: 'I sent the compliance data to the shared drive.',
      time: '9:08 AM',
      unread: 1,
      online: true
    },
    {
      id: 'derek',
      name: 'Derek Okafor',
      role: 'Project Manager',
      initials: 'DO',
      avatarColor: '#b8860b',
      preview: 'Morning! Welcome aboard the Heron Gate project.',
      time: '8:55 AM',
      unread: 0,
      online: false
    },
    {
      id: 'sandra',
      name: 'Sandra Kohl',
      role: 'Structural Lead',
      initials: 'SK',
      avatarColor: '#6b21a8',
      preview: 'Let me know when you need the load calcs.',
      time: '8:40 AM',
      unread: 0,
      online: false
    }
  ];

  conversationMap: { [key: string]: ChatMessage[] } = {
    marcus: [
      {
        id: 1, senderId: 'marcus', senderName: 'Marcus Webb', initials: 'MW',
        avatarColor: '#1e3a5f',
        text: 'Hey, welcome to Meridian. I\'m Marcus — I\'ll be your senior engineer on the Heron Gate project.',
        time: '9:00 AM', isMe: false
      },
      {
        id: 2, senderId: 'marcus', senderName: 'Marcus Webb', initials: 'MW',
        avatarColor: '#1e3a5f',
        text: 'Before you start any calculations, make sure you pull the cooling tower specifications from the Library. The client updated them last week and the old numbers will throw your drift calcs off.',
        time: '9:02 AM', isMe: false
      },
      {
        id: 3, senderId: 'me', senderName: 'You', initials: 'YO',
        avatarColor: '#ff6b2c',
        text: 'Thanks Marcus! I\'ll grab those specs now. Anything else I should watch out for?',
        time: '9:05 AM', isMe: true
      },
      {
        id: 4, senderId: 'marcus', senderName: 'Marcus Webb', initials: 'MW',
        avatarColor: '#1e3a5f',
        text: 'Check the cooling tower specs before you start. The ambient conditions changed after the last site visit — make sure you\'re using the updated weather data too.',
        time: '9:15 AM', isMe: false
      }
    ],
    priya: [
      {
        id: 1, senderId: 'priya', senderName: 'Priya Nair', initials: 'PN',
        avatarColor: '#0d7377',
        text: 'Hi! I\'m Priya from the environmental team. I handle compliance and impact assessments for all Meridian projects.',
        time: '8:50 AM', isMe: false
      },
      {
        id: 2, senderId: 'me', senderName: 'You', initials: 'YO',
        avatarColor: '#ff6b2c',
        text: 'Nice to meet you, Priya. Will I need environmental data for the drift calculations?',
        time: '8:55 AM', isMe: true
      },
      {
        id: 3, senderId: 'priya', senderName: 'Priya Nair', initials: 'PN',
        avatarColor: '#0d7377',
        text: 'I sent the compliance data to the shared drive. You\'ll need the ambient humidity and temperature readings from Section 3. Let me know if you can\'t find them.',
        time: '9:08 AM', isMe: false
      }
    ],
    derek: [
      {
        id: 1, senderId: 'derek', senderName: 'Derek Okafor', initials: 'DO',
        avatarColor: '#b8860b',
        text: 'Morning! Welcome aboard the Heron Gate project. I\'m Derek, project manager. We\'re on a tight timeline so let\'s keep things moving.',
        time: '8:45 AM', isMe: false
      },
      {
        id: 2, senderId: 'me', senderName: 'You', initials: 'YO',
        avatarColor: '#ff6b2c',
        text: 'Good morning Derek. Happy to be here. What\'s the priority for today?',
        time: '8:48 AM', isMe: true
      },
      {
        id: 3, senderId: 'derek', senderName: 'Derek Okafor', initials: 'DO',
        avatarColor: '#b8860b',
        text: 'Focus on getting your workstation set up and reviewing the project brief. Marcus will walk you through the first task once you\'re ready.',
        time: '8:55 AM', isMe: false
      }
    ],
    sandra: [
      {
        id: 1, senderId: 'sandra', senderName: 'Sandra Kohl', initials: 'SK',
        avatarColor: '#6b21a8',
        text: 'Hey there! Sandra here, structural lead. We\'ll be working together once you get to the load analysis tasks.',
        time: '8:35 AM', isMe: false
      },
      {
        id: 2, senderId: 'sandra', senderName: 'Sandra Kohl', initials: 'SK',
        avatarColor: '#6b21a8',
        text: 'Let me know when you need the load calcs. I\'ve got the foundation specs ready whenever you are.',
        time: '8:40 AM', isMe: false
      }
    ],
    general: [
      {
        id: 1, senderId: 'derek', senderName: 'Derek Okafor', initials: 'DO',
        avatarColor: '#b8860b',
        text: 'Team, we have a new junior engineer starting today on Heron Gate. Please make them feel welcome.',
        time: '8:30 AM', isMe: false
      },
      {
        id: 2, senderId: 'marcus', senderName: 'Marcus Webb', initials: 'MW',
        avatarColor: '#1e3a5f',
        text: 'Welcome aboard! I\'ll be available all morning if you need anything.',
        time: '8:32 AM', isMe: false
      },
      {
        id: 3, senderId: 'priya', senderName: 'Priya Nair', initials: 'PN',
        avatarColor: '#0d7377',
        text: 'Welcome! Environmental data is on the shared drive if you need it.',
        time: '8:35 AM', isMe: false
      },
      {
        id: 4, senderId: 'derek', senderName: 'Derek Okafor', initials: 'DO',
        avatarColor: '#b8860b',
        text: 'Updated the pressure specs in the project folder. Everyone please use the latest revision.',
        time: '9:12 AM', isMe: false
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private windowService: SimulationWindowService
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.simulationId = params['id'] || '';
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  get activeMessages(): ChatMessage[] {
    return this.conversationMap[this.activeThreadId] || [];
  }

  get activeThread(): DmThread | null {
    return this.dmThreads.find(t => t.id === this.activeThreadId) || null;
  }

  get activeChannel(): ChannelItem | null {
    return this.channels.find(c => c.id === this.activeThreadId) || null;
  }

  get isChannelActive(): boolean {
    return this.channels.some(c => c.id === this.activeThreadId);
  }

  get activeHeaderName(): string {
    if (this.isChannelActive) {
      return '#' + (this.activeChannel?.name || '');
    }
    return this.activeThread?.name || '';
  }

  get activeHeaderRole(): string {
    return this.activeThread?.role || '';
  }

  get activeHeaderOnline(): boolean {
    return this.activeThread?.online || false;
  }

  get activeHeaderInitials(): string {
    return this.activeThread?.initials || '#';
  }

  get activeHeaderAvatarColor(): string {
    return this.activeThread?.avatarColor || '#2a2a3a';
  }

  selectThread(threadId: string): void {
    this.activeThreadId = threadId;
    // Clear unread for DM thread
    const dm = this.dmThreads.find(t => t.id === threadId);
    if (dm) { dm.unread = 0; }
    // Clear unread for channel
    const ch = this.channels.find(c => c.id === threadId);
    if (ch) { ch.unread = 0; }
    this.shouldScrollToBottom = true;
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text) return;

    const messages = this.conversationMap[this.activeThreadId];
    if (!messages) return;

    messages.push({
      id: messages.length + 1,
      senderId: 'me',
      senderName: 'You',
      initials: 'YO',
      avatarColor: '#ff6b2c',
      text,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      isMe: true
    });

    this.newMessage = '';
    this.shouldScrollToBottom = true;

    // Simulate typing response
    if (!this.isChannelActive && this.activeThread) {
      this.simulateReply();
    }
  }

  private simulateReply(): void {
    this.isTyping = true;
    const thread = this.activeThread;
    if (!thread) return;

    setTimeout(() => {
      this.isTyping = false;
      const messages = this.conversationMap[this.activeThreadId];
      if (!messages) return;

      const replies: { [key: string]: string[] } = {
        marcus: [
          'Good question. Double-check the CTI values against Table 4 in the spec sheet.',
          'Also, remember to factor in the wet-bulb depression. It\'s easy to miss.',
          'Let me know once you have the drift rate — I\'ll review it before you submit.'
        ],
        priya: [
          'Sure, I\'ll flag the relevant sections for you.',
          'The EPA compliance thresholds are in Appendix B. Don\'t exceed 0.005% of circulating water flow.',
          'Happy to review your environmental impact section when you\'re done.'
        ],
        derek: [
          'Keep me posted on your progress. The client expects a status update by end of day.',
          'Remember, quality over speed. But we do need this wrapped up soon.',
          'Check in with Marcus if you hit any blockers.'
        ],
        sandra: [
          'I\'ll send over the foundation load data this afternoon.',
          'Make sure your drift calculations account for wind loading — it affects the structural assessment.',
          'Ping me when you\'re ready for the structural review.'
        ]
      };

      const threadReplies = replies[this.activeThreadId] || ['Got it, thanks!'];
      const replyText = threadReplies[Math.floor(Math.random() * threadReplies.length)];

      messages.push({
        id: messages.length + 1,
        senderId: thread.id,
        senderName: thread.name,
        initials: thread.initials,
        avatarColor: thread.avatarColor,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        isMe: false
      });

      this.shouldScrollToBottom = true;
    }, 1500 + Math.random() * 1500);
  }

  /** Minimize — hide window to taskbar, can restore by clicking taskbar */
  minimizeWindow(): void {
    this.windowService.minimize();
  }

  /** Close — navigate away */
  closeMessagesWindow(): void {
    this.windowService.restore();
    this.router.navigate(['../intro'], { relativeTo: this.route });
  }

  navigateToWorkstation(): void {
    this.router.navigate(['../task/gather-data'], { relativeTo: this.route });
  }

  private scrollToBottom(): void {
    try {
      if (this.chatFeedRef) {
        this.chatFeedRef.nativeElement.scrollTop = this.chatFeedRef.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
