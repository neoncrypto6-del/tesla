import React, { useCallback, useEffect, useState } from 'react';
import { ChatThread } from '../chat/ChatThread';
import { useChat } from '../../hooks/useChat';
import { supabase } from '../../utils/supabase';
import { ChatMessage } from '../../types/order';
import { formatDateTime } from '../../utils/date';

type SupportPanelProps = {
  customerNames: Record<string, string>;
  selectedUserId: string | null;
  onSelect: (userId: string) => void;
};

type Conversation = {userId: string;last: ChatMessage;};

export function SupportPanel({ customerNames, selectedUserId, onSelect }: SupportPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const chat = useChat(selectedUserId, 'admin');

  const load = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(500);
    const seen = new Map<string, ChatMessage>();
    (data as ChatMessage[] ?? []).forEach((m) => {
      if (!seen.has(m.user_id)) seen.set(m.user_id, m);
    });
    setConversations(Array.from(seen, ([userId, last]) => ({ userId, last })));
  }, []);

  useEffect(() => {
    load();
    const channel = supabase.
    channel('admin-messages').
    on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => load()).
    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside aria-label="Conversations" className="rounded-xl ring-1 ring-line">
        {conversations.length === 0 ?
        <p className="p-6 text-center text-sm text-muted">No conversations yet.</p> :

        <ul className="max-h-[560px] divide-y divide-panel overflow-y-auto">
            {conversations.map((c) => {
            const active = c.userId === selectedUserId;
            const awaiting = c.last.sender === 'user';
            return (
              <li key={c.userId}>
                  <button
                  onClick={() => onSelect(c.userId)}
                  className={`w-full px-4 py-3 text-left transition-colors duration-150 ${active ? 'bg-panel' : 'hover:bg-panel/60'}`}>
                  
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{customerNames[c.userId] || 'Customer'}</span>
                      {awaiting && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Awaiting reply" />}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {c.last.sender === 'admin' ? 'You: ' : ''}
                      {c.last.body || c.last.attachment_name || 'Attachment'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">{formatDateTime(c.last.created_at)}</p>
                  </button>
                </li>);

          })}
          </ul>
        }
      </aside>
      {selectedUserId ?
      <div>
          <h2 className="mb-3 text-lg font-medium">{customerNames[selectedUserId] || 'Customer'}</h2>
          <ChatThread
          messages={chat.messages}
          viewer="admin"
          loading={chat.loading}
          sending={chat.sending}
          error={chat.error}
          onSend={chat.send}
          emptyLabel="No messages yet. Start the conversation." />
        
        </div> :

      <div className="flex h-[560px] items-center justify-center rounded-xl bg-panel text-sm text-muted">
          Select a conversation to reply.
        </div>
      }
    </div>);

}