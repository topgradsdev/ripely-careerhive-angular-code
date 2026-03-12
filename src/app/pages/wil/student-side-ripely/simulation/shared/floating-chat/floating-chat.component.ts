import { Component, Input } from '@angular/core';

export interface ChatContact {
  id: string;
  label: string;
  sublabel: string;
  bg: string;
  initials: string;
}

export interface ChatMessage {
  sender: 'them' | 'me' | 'system';
  name?: string;
  text: string;
}

interface ChatWindow {
  contact: ChatContact;
  collapsed: boolean;
  messages: ChatMessage[];
  draft: string;
}

@Component({
  selector: 'app-floating-chat',
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss']
})
export class FloatingChatComponent {
  @Input() contacts: ChatContact[] = [
    { id: 'elena',  label: 'Elena',  sublabel: 'Project Manager',  bg: '#1a3a6b', initials: 'SK' },
    { id: 'marcus', label: 'Marcus', sublabel: 'Senior Engineer',  bg: '#7a2040', initials: 'MR' }
  ];

  openWindows: Map<string, ChatWindow> = new Map();

  private defaultMessages: Record<string, ChatMessage[]> = {
    elena: [
      { sender: 'them', name: 'SANDRA KOHL', text: 'Welcome to the project. I\'ll need your summary for review before any client communication goes out. If you foresee any issues with the programme, please flag immediately. Sandra Kohl Project Manager, Meridian Building Systems' },
      { sender: 'them', name: 'SANDRA KOHL', text: 'Just checking \u2014 have you started on the brief yet? Marcus will need your summary before you can proceed.' }
    ],
    marcus: [
      { sender: 'them', name: 'MARCUS REID', text: 'Before you touch anything, I want you to read the project brief properly. Not skim it \u2014 read it. The client instruction letter is in your Library under Client Brief. The site visit notes are in there too. Both documents. Once you\'ve done that, tell me in this chat: what is the problem we\'ve been asked to solve, what system is involved, and what do we need to deliver. In your own words. Three sentences maximum. Don\'t copy-paste from the document. I\'ll know.' }
    ]
  };

  toggleBubble(contact: ChatContact): void {
    if (this.openWindows.has(contact.id)) {
      const win = this.openWindows.get(contact.id)!;
      if (win.collapsed) {
        win.collapsed = false;
      } else {
        this.openWindows.delete(contact.id);
      }
    } else {
      this.openWindows.set(contact.id, {
        contact,
        collapsed: false,
        messages: [...(this.defaultMessages[contact.id] || [])],
        draft: ''
      });
    }
  }

  isWindowOpen(id: string): boolean {
    return this.openWindows.has(id) && !this.openWindows.get(id)!.collapsed;
  }

  toggleWindow(id: string): void {
    const win = this.openWindows.get(id);
    if (win) win.collapsed = !win.collapsed;
  }

  closeWindow(id: string): void {
    this.openWindows.delete(id);
  }

  sendMessage(id: string): void {
    const win = this.openWindows.get(id);
    if (!win || !win.draft.trim()) return;

    win.messages.push({ sender: 'me', text: win.draft.trim() });
    win.draft = '';
  }

  onKeydown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(id);
    }
  }

  get windowsArray(): ChatWindow[] {
    return Array.from(this.openWindows.values());
  }
}
