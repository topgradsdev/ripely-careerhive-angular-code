import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface ChatMessage {
  id: number;
  sender: string;
  avatar: string;
  avatarColor: string;
  text: string;
  time: string;
  isMe: boolean;
  isSystem?: boolean;
}

@Component({
  selector: 'app-simulation-chat',
  templateUrl: './simulation-chat.component.html',
  styleUrls: ['./simulation-chat.component.scss']
})
export class SimulationChatComponent implements OnInit {
  simulationId = '';
  newMessage = '';
  currentPhase = 3;
  typingUser = 'Priya';

  channelName = '# general';
  teamName = 'Meridian BS';
  channelStatus = 'Team channel';
  onlineCount = 4;

  messages: ChatMessage[] = [
    {
      id: 1, sender: '', avatar: '', avatarColor: '',
      text: 'Phase 2 completed. All team members have submitted their data collection tasks.',
      time: '10:42 AM', isMe: false, isSystem: true
    },
    {
      id: 2, sender: 'Marcus Reid', avatar: 'MR', avatarColor: '#ff6b2c',
      text: 'Great work everyone! The site data looks solid. We\'re on track for the client deadline.',
      time: '10:44 AM', isMe: false
    },
    {
      id: 3, sender: 'Priya Sharma', avatar: 'PS', avatarColor: '#00b894',
      text: 'Thanks Marcus. I\'ve uploaded the updated drift loss figures to the Library. The cooling tower T1 readings are higher than baseline -- flagging for review.',
      time: '10:46 AM', isMe: false
    },
    {
      id: 4, sender: 'Derek Hollis', avatar: 'DH', avatarColor: '#6c5ce7',
      text: 'Noted. I\'ll cross-reference those with the manufacturer specs before we proceed. Should have the comparison ready by end of day.',
      time: '10:48 AM', isMe: false
    },
    {
      id: 5, sender: 'Marcus Reid', avatar: 'MR', avatarColor: '#ff6b2c',
      text: 'Perfect. New team member -- your next task is the Drift Loss calculation for Tower 1. Check the Library for the datasheet and use the calculator on your Workstation. Reach out if you get stuck.',
      time: '10:50 AM', isMe: false
    },
    {
      id: 6, sender: 'Priya Sharma', avatar: 'PS', avatarColor: '#00b894',
      text: 'Happy to help if you need a walkthrough on the drift methodology. Good luck! 🙌',
      time: '10:51 AM', isMe: false
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.simulationId = this.route.parent?.snapshot.paramMap.get('id') || '';
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    this.messages.push({
      id: this.messages.length + 1,
      sender: 'You',
      avatar: 'YO',
      avatarColor: '#3498db',
      text: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    });
    this.newMessage = '';
  }

  startPhase(): void {
    this.router.navigate(['../tasks'], { relativeTo: this.route });
  }
}
