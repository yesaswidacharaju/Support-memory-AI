import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';

type Session = 'initial' | 'return';
type Author = 'ravi' | 'agent';

type Message = {
  id: string;
  author: Author;
  text: string;
  time: string;
  highlight?: string;
};

type MemoryItem = {
  id: string;
  label: string;
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 'initial-1',
    author: 'ravi',
    text: 'My application is crashing.',
    time: '10:14 AM',
  },
  {
    id: 'initial-2',
    author: 'agent',
    text: 'What device and app version are you using?',
    time: '10:15 AM',
  },
  {
    id: 'initial-3',
    author: 'ravi',
    text: 'I am on Windows 11 with app version 5.2. This happened once before, and updating the app fixed the previous crash.',
    time: '10:16 AM',
    highlight: 'Useful context detected',
  },
];

const returnMessages: Message[] = [
  {
    id: 'return-1',
    author: 'ravi',
    text: 'My application is crashing again.',
    time: '09:42 AM',
  },
  {
    id: 'return-2',
    author: 'agent',
    text: "Welcome back, Ravi. I remember that you're using Windows 11 with app version 5.2. You previously resolved a similar crash by updating the application. Let's check whether the same issue is occurring.",
    time: '09:43 AM',
    highlight: 'Replied with remembered context',
  },
];

const memoryItems: MemoryItem[] = [
  { id: 'os', label: 'Environment', text: 'Windows 11' },
  { id: 'version', label: 'App version', text: 'App version 5.2' },
  { id: 'previous-crash', label: 'Issue history', text: 'Previous crash occurred' },
  { id: 'resolution', label: 'Prior resolution', text: 'Updating the app fixed the previous crash' },
];

const timelineEntries = [
  { period: 'Today', items: ['Application crash reported'] },
  { period: '2 weeks ago', items: ['Login issue', 'Password reset solved it'] },
  { period: '1 month ago', items: ['Payment issue', 'Payment method updated'] },
];

function Sidebar({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <aside className="sidebar" aria-label="Support conversations">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <BrainCircuit size={18} strokeWidth={2.2} />
        </div>
        <div>
          <div className="brand-name">SupportMemory AI</div>
          <div className="brand-subtitle">MEMORY-POWERED SUPPORT</div>
        </div>
      </div>

       <div className="sidebar-label">Select customer</div>
      <div className="conversation-list">
        <button
          className={`conversation-item ${selected ? 'selected' : ''}`}
          onClick={onSelect}
          data-testid="button-select-ravi"
          type="button"
        >
          <div className="avatar">RK</div>
          <div className="conversation-copy">
            <span className="conversation-name">Ravi Kumar</span>
            <span className="conversation-preview">Application crashing</span>
          </div>
          <div className="conversation-state">
            <span className="conversation-time">now</span>
            <span className="unread-dot" />
          </div>
        </button>
      </div>

      <div className="sidebar-spacer" />
      <div className="workspace-note">
        <strong>Memory is private to your team</strong>
        Helpful context is captured from conversations, not guessed. Review it before you use it.
      </div>
      <div className="agent-profile">
        <div className="avatar small">AM</div>
        <div className="agent-details">
          <strong>Arjun Mehta</strong>
          <span>Support agent · Online</span>
        </div>
      </div>
    </aside>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.author === 'agent';
  return (
    <div className={`message-row ${isAgent ? 'agent' : ''}`} data-testid={`message-${message.id}`}>
      {isAgent ? <div className="avatar small teal">AM</div> : <div className="avatar small">RK</div>}
      <div>
        <div className="message-bubble">
          {message.text}
          {message.highlight ? <div className="memory-highlight">{message.highlight}</div> : null}
        </div>
        <div className="message-meta">{isAgent ? 'You' : 'Ravi Kumar'} · {message.time}</div>
      </div>
    </div>
  );
}

function MemoryPanel({
  captured,
  capturing,
  session,
  onReturn,
}: {
  captured: boolean;
  capturing: boolean;
  session: Session;
  onReturn: () => void;
}) {
  return (
    <section className="memory-panel" aria-labelledby="memory-title">
      <div className="memory-panel-header">
        <div className="memory-title">
          <div className="memory-icon" aria-hidden="true"><BrainCircuit size={16} /></div>
          <div>
            <h2 id="memory-title">Hindsight Memory</h2>
            <p>Customer context worth keeping</p>
          </div>
        </div>
        <span className="memory-count" data-testid="text-memory-count">{captured ? '04 facts' : '0 facts'}</span>
      </div>

      <p className="memory-intro">
        Useful details from Ravi&apos;s conversation can help the next visit start with less repetition.
      </p>

      {captured ? (
        <>
          <div className="memory-list" data-testid="list-memory-facts">
            {memoryItems.map((item) => (
              <div className="memory-item" key={item.id} data-testid={`memory-item-${item.id}`}>
                <div className="memory-item-header">
                  <span className="memory-item-label">{item.label}</span>
                  <Check size={13} className="memory-item-check" />
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="capture-banner" data-testid="status-memory-captured">
            <CheckCircle2 size={15} />
            <div><strong>Memory saved automatically</strong>These facts are ready to support Ravi&apos;s next visit.</div>
          </div>
        </>
      ) : capturing ? (
        <div className="empty-memory" data-testid="status-memory-capturing">
          <Sparkles size={19} />
          <strong>Saving memory automatically</strong>
          <span>Looking for stable details that can help next time...</span>
        </div>
      ) : (
        <div className="empty-memory" data-testid="status-memory-empty">
          <LockKeyhole size={18} />
          <strong>Memory saves automatically</strong>
          <span>Useful facts will appear here as they are identified.</span>
        </div>
      )}

      {session === 'initial' ? (
        <div className="next-visit-card">
          <div className="next-visit-copy">
            <strong>{captured ? 'Ready for a return visit?' : 'Memory will be ready for the next visit'}</strong>
            <span>{captured ? 'See how context changes the next reply.' : 'Useful facts are being saved automatically.'}</span>
          </div>
          {captured ? (
            <button className="primary-action" onClick={onReturn} data-testid="button-advance-return" type="button">
              Continue <ArrowRight size={13} />
            </button>
          ) : (
            <span className="auto-save-label">Saving automatically</span>
          )}
        </div>
      ) : (
        <div className="return-note" data-testid="status-return-context">
          <MessageCircle size={14} />
          <span>Ravi can pick up where he left off because his troubleshooting history is here.</span>
        </div>
      )}
    </section>
  );
}

function MemoryTimeline() {
  return (
    <section className="timeline-panel" aria-labelledby="timeline-title">
      <div className="timeline-header">
        <div className="memory-icon" aria-hidden="true"><Clock3 size={15} /></div>
        <div>
          <h2 id="timeline-title">Memory Timeline</h2>
          <p>Ravi&apos;s support history</p>
        </div>
      </div>
      <div className="timeline-list">
        {timelineEntries.map((entry) => (
          <div className="timeline-group" key={entry.period}>
            <div className="timeline-period">{entry.period}</div>
            <div className="timeline-items">
              {entry.items.map((item, index) => (
                <div className={`timeline-item ${index === 0 ? 'root' : 'nested'}`} key={item}>
                  <span className="timeline-branch" aria-hidden="true">└─</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="preference-block">
        <div className="timeline-period">Customer preferences</div>
        <div className="timeline-item root"><span className="timeline-branch" aria-hidden="true">└─</span><span>Windows 11</span></div>
        <div className="timeline-item root"><span className="timeline-branch" aria-hidden="true">└─</span><span>App v5.2</span></div>
      </div>
    </section>
  );
}

function MemoryUsedIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;
  const retrievedFacts = ['Previous crash', 'Windows 11', 'App v5.2', 'Previous successful solution'];

  return (
    <div className="memory-used" data-testid="status-memory-used">
      <div className="memory-used-heading">
        <div className="memory-icon" aria-hidden="true"><BrainCircuit size={15} /></div>
        <div>
          <strong>Memory used: 4 relevant memories</strong>
          <span>4 relevant memories retrieved</span>
        </div>
      </div>
      <div className="retrieved-facts">
        {retrievedFacts.map((fact) => (
          <span key={fact}><Check size={12} />{fact}</span>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState('ravi');
  const [session, setSession] = useState<Session>('initial');
  const [captured, setCaptured] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (session !== 'initial' || captured || capturing) return;
    const autoStartTimer = window.setTimeout(() => {
      setCapturing(true);
      timerRef.current = window.setTimeout(() => {
        setCaptured(true);
        setCapturing(false);
      }, 850);
    }, 180);

    return () => window.clearTimeout(autoStartTimer);
  }, [session, captured, capturing]);

  const resetDemo = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setSelectedCustomer('ravi');
    setSession('initial');
    setCaptured(false);
    setCapturing(false);
    setMessages(initialMessages);
    setInput('');
    setIsTyping(false);
  };

  const captureMemory = () => {
    if (captured || capturing) return;
    setCapturing(true);
    timerRef.current = window.setTimeout(() => {
      setCaptured(true);
      setCapturing(false);
    }, 850);
  };

  const advanceToReturn = () => {
    if (!captured) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setIsTyping(false);
    setSession('return');
    setMessages(returnMessages);
    setInput('');
  };

  const switchSession = (next: Session) => {
    if (next === 'return' && !captured) return;
    if (next === 'return') advanceToReturn();
    else {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setIsTyping(false);
      setSession('initial');
      setMessages(initialMessages);
      setInput('');
    }
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    const isUseful = /windows 11|5\.2|updat/i.test(trimmed);
    const now = session === 'initial' ? '10:18 AM' : '09:45 AM';
    setMessages((current) => [...current, {
      id: `${session}-user-${Date.now()}`,
      author: 'ravi',
      text: trimmed,
      time: now,
    }]);
    setInput('');
    if (session === 'initial' && isUseful && !captured) captureMemory();
    setIsTyping(true);
    timerRef.current = window.setTimeout(() => {
      const reply = session === 'return'
        ? 'Thanks for confirming. I will compare this crash with the previous one before we try another update.'
        : 'Thanks, that helps narrow it down. I have noted those details so we can pick up from here next time.';
      setMessages((current) => [...current, {
        id: `${session}-agent-${Date.now()}`,
        author: 'agent',
        text: reply,
        time: session === 'initial' ? '10:19 AM' : '09:46 AM',
      }]);
      setIsTyping(false);
    }, 720);
  };

  return (
    <main className="app-shell">
      <Sidebar selected={selectedCustomer === 'ravi'} onSelect={() => setSelectedCustomer('ravi')} />
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-kicker"><span className="status-pip" /> Inbox / Customer context</div>
          <div className="topbar-actions">
            <div className="sync-status"><Clock3 size={12} /> Local demo · changes saved</div>
            <button className="reset-button" onClick={resetDemo} data-testid="button-reset-demo" type="button">
              <RotateCcw size={13} /> Reset demo
            </button>
          </div>
        </header>

        <div className="workspace-content">
          <section className="conversation-column" aria-labelledby="conversation-title">
            <div className="product-intro">
              <div className="product-kicker"><BrainCircuit size={14} /> AI memory for support teams</div>
              <h2>SupportMemory AI</h2>
              <div className="product-subtitle">Memory-powered Customer Support Agent</div>
              <p>Support gets better when the customer is remembered.</p>
            </div>
            <div className="eyebrow">Selected customer</div>
            <div className="conversation-heading">
              <div>
                <h1 id="conversation-title">Ravi Kumar</h1>
              </div>
              <div className="visit-switcher" role="tablist" aria-label="Conversation visit">
                <button
                  className={`visit-tab ${session === 'initial' ? 'active' : ''}`}
                  onClick={() => switchSession('initial')}
                  data-testid="tab-initial-visit"
                  role="tab"
                  aria-selected={session === 'initial'}
                  type="button"
                >
                  First visit
                </button>
                <button
                  className={`visit-tab ${session === 'return' ? 'active' : ''}`}
                  onClick={() => switchSession('return')}
                  disabled={!captured}
                  data-testid="tab-return-visit"
                  role="tab"
                  aria-selected={session === 'return'}
                  type="button"
                >
                  Return visit
                </button>
              </div>
            </div>
            <div className="progress-line" data-testid="status-demo-progress">
              <span>{session === 'initial' ? '01' : '02'} / 02</span>
              <div className="progress-track"><div className={`progress-fill ${session === 'return' ? 'complete' : ''}`} /></div>
              <span>{session === 'initial' ? 'Memory saves automatically' : 'Use the context'}</span>
            </div>

            <div className="chat-card">
              <div className="chat-header">
                <div className="customer-heading">
                  <div className="avatar">RK</div>
                  <div><strong>Ravi Kumar</strong><span>Customer · Returning issue</span></div>
                </div>
                <div className="channel-label"><span className="channel-dot" /> Live chat</div>
              </div>
              <div className="message-list" aria-live="polite">
                <MemoryUsedIndicator visible={session === 'return'} />
                <div className="day-divider">{session === 'initial' ? 'Today · First conversation' : 'Today · Return visit'}</div>
                {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
                {isTyping ? (
                  <div className="typing-row" data-testid="status-agent-typing">
                    <div className="avatar small teal">AM</div>
                    <span className="typing-dots"><i /><i /><i /></span>
                    Agent is writing
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
              <div>
                <div className="composer">
                  <textarea
                    className="composer-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={session === 'initial' ? 'Write a reply to Ravi...' : 'Reply with the context in mind...'}
                    rows={1}
                    data-testid="input-chat-message"
                    aria-label="Chat message"
                  />
                  <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    data-testid="button-send-message"
                    type="button"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="composer-hint">Enter to send · Shift + Enter for a new line</div>
              </div>
            </div>
          </section>

          <aside className="right-rail">
            <MemoryPanel
              captured={captured}
              capturing={capturing}
              session={session}
              onReturn={advanceToReturn}
            />
            <MemoryTimeline />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default App;