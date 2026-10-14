import React, { useEffect, useRef, useState } from 'react';
import { FileIcon, Loader2Icon, PaperclipIcon, SendIcon, XIcon } from 'lucide-react';
import { ChatMessage } from '../../types/order';
import { formatDateTime } from '../../utils/date';

type ChatThreadProps = {
  messages: ChatMessage[];
  viewer: 'user' | 'admin';
  loading: boolean;
  sending: boolean;
  error: string;
  onSend: (body: string, file: File | null) => Promise<boolean>;
  emptyLabel: string;
};

const isImage = (name: string | null) => !!name && /\.(png|jpe?g|gif|webp)$/i.test(name);

export function ChatThread({ messages, viewer, loading, sending, error, onSend, emptyLabel }: ChatThreadProps) {
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onSend(body, file);
    if (ok) {
      setBody('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex h-[560px] flex-col rounded-xl ring-1 ring-line">
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
        {loading ?
        <div className="flex h-full items-center justify-center text-muted">
            <Loader2Icon className="h-5 w-5 animate-spin" />
          </div> :
        messages.length === 0 ?
        <div className="flex h-full items-center justify-center text-center text-sm text-muted">{emptyLabel}</div> :

        messages.map((m) => {
          const mine = m.sender === viewer;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-ink text-white' : 'bg-panel text-ink'}`}>
                  {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                  {m.attachment_url && (
                isImage(m.attachment_name) ?
                <a href={m.attachment_url} target="_blank" rel="noreferrer" className="mt-2 block">
                        <img src={m.attachment_url} alt={m.attachment_name ?? 'Attachment'} className="max-h-56 rounded-lg" />
                      </a> :

                <a
                  href={m.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs underline-offset-2 hover:underline ${mine ? 'bg-white/10' : 'bg-white'}`}>
                  
                        <FileIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{m.attachment_name}</span>
                      </a>)

                }
                </div>
                <span className="mt-1 text-[11px] text-muted">
                  {m.sender === 'admin' ? 'TACYE Support' : 'Customer'} · {formatDateTime(m.created_at)}
                </span>
              </div>);

        })
        }
      </div>

      <form onSubmit={handleSubmit} className="border-t border-line p-3">
        {error && <p role="alert" className="mb-2 text-xs text-red-600">{error}</p>}
        {file &&
        <div className="mb-2 inline-flex max-w-full items-center gap-2 rounded bg-panel px-2.5 py-1 text-xs">
            <FileIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{file.name}</span>
            <button type="button" onClick={() => setFile(null)} aria-label="Remove attachment" className="text-muted hover:text-ink">
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        }
        <div className="flex items-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="sr-only"
            id={`chat-file-${viewer}`}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          
          <label
            htmlFor={`chat-file-${viewer}`}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded text-muted hover:bg-panel hover:text-ink"
            aria-label="Attach a file">
            
            <PaperclipIcon className="h-4 w-4" />
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            placeholder="Write a message…"
            aria-label="Message"
            className="max-h-32 min-h-10 flex-1 resize-none rounded bg-panel px-3 py-2.5 text-sm outline-none ring-1 ring-transparent focus:ring-ink" />
          
          <button
            type="submit"
            disabled={sending || !body.trim() && !file}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-brand text-white transition-colors duration-150 hover:bg-brand-hover disabled:opacity-50">
            
            {sending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>);

}