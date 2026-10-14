import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { ChatMessage } from '../types/order';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function useChat(conversationUserId: string | null, sender: 'user' | 'admin') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const append = useCallback((msg: ChatMessage) => {
    setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
  }, []);

  useEffect(() => {
    if (!conversationUserId) return;
    setLoading(true);
    supabase.
    from('messages').
    select('*').
    eq('user_id', conversationUserId).
    order('created_at', { ascending: true }).
    then(({ data, error: loadError }) => {
      if (loadError) setError(loadError.message);
      setMessages(data as ChatMessage[] ?? []);
      setLoading(false);
    });

    const channel = supabase.
    channel(`chat-${conversationUserId}-${sender}`).
    on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${conversationUserId}` },
      (payload) => append(payload.new as ChatMessage)
    ).
    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationUserId, sender, append]);

  const send = async (body: string, file: File | null) => {
    if (!conversationUserId || !body.trim() && !file) return false;
    if (file && file.size > MAX_FILE_BYTES) {
      setError('Files must be 10 MB or smaller.');
      return false;
    }
    setSending(true);
    setError('');
    try {
      let attachment_url: string | null = null;
      let attachment_name: string | null = null;
      if (file) {
        const path = `${conversationUserId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('chat-uploads').upload(path, file);
        if (uploadError) throw uploadError;
        attachment_url = supabase.storage.from('chat-uploads').getPublicUrl(path).data.publicUrl;
        attachment_name = file.name;
      }
      const { data, error: insertError } = await supabase.
      from('messages').
      insert({ user_id: conversationUserId, sender, body: body.trim() || null, attachment_url, attachment_name }).
      select('*').
      single();
      if (insertError) throw insertError;
      append(data as ChatMessage);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Message failed to send.');
      return false;
    } finally {
      setSending(false);
    }
  };

  return { messages, loading, sending, error, send };
}