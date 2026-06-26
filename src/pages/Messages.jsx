import { Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { listenConversations, listenMessages, markConversationRead, sendMessage } from '../services/messages.js';
import { formatDate } from '../utils/format.js';

export default function Messages() {
  const { profile } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(location.state?.conversationId || '');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => listenConversations(profile.id, setConversations), [profile.id]);

  const active = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) || conversations[0],
    [conversations, activeId]
  );

  useEffect(() => {
    if (!active?.id) return undefined;
    setActiveId(active.id);
    markConversationRead(active.id);
    return listenMessages(active.id, setMessages);
  }, [active?.id]);

  async function submit(event) {
    event.preventDefault();
    if (!text.trim() || !active) return;
    await sendMessage(active, profile, text.trim());
    setText('');
  }

  return (
    <section className="page space-y-6">
      <h1 className="text-2xl font-black">Mensajes</h1>
      <div className="grid min-h-[640px] gap-4 md:grid-cols-[320px_1fr]">
        <aside className="panel overflow-hidden p-0">
          <div className="border-b border-line p-4 font-black">Conversaciones</div>
          <div className="divide-y divide-line">
            {conversations.map((conversation) => {
              const unread = (conversation.unreadBy || []).includes(profile.id);
              const otherName = Object.entries(conversation.memberNames || {}).find(([id]) => id !== profile.id)?.[1] || 'Usuario';
              return (
                <button
                  key={conversation.id}
                  className={`block w-full px-4 py-3 text-left text-sm hover:bg-surface ${active?.id === conversation.id ? 'bg-teal-50' : ''}`}
                  onClick={() => setActiveId(conversation.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{otherName}</span>
                    {unread && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">Nuevo</span>}
                  </div>
                  <p className="truncate text-slate-600">{conversation.lastMessage || 'Sin mensajes'}</p>
                </button>
              );
            })}
            {conversations.length === 0 && <p className="p-4 text-sm text-slate-600">Iniciá una conversación desde un perfil.</p>}
          </div>
        </aside>
        <div className="panel flex flex-col">
          <div className="flex-1 space-y-3 overflow-auto">
            {messages.map((message) => {
              const own = message.senderId === profile.id;
              return (
                <div key={message.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${own ? 'bg-brand text-white' : 'bg-surface text-ink'}`}>
                    <p>{message.text}</p>
                    <p className={`mt-1 text-xs ${own ? 'text-teal-50' : 'text-slate-500'}`}>{formatDate(message.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <form className="mt-4 flex gap-2 border-t border-line pt-4" onSubmit={submit}>
            <input className="field" value={text} onChange={(event) => setText(event.target.value)} placeholder="Escribir mensaje" />
            <button className="btn-primary"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </section>
  );
}
