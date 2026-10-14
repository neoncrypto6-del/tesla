import { format } from 'date-fns';

export function formatDate(value: string): string {
  return format(new Date(value), 'MMM d, yyyy');
}

export function formatDateTime(value: string): string {
  return format(new Date(value), 'MMM d, yyyy · h:mm a');
}

export function formatTime(value: string): string {
  return format(new Date(value), 'h:mm a');
}