import React from 'react';

type ProfileDetailsProps = {
  details: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    delivery_address?: string | null;
    state?: string | null;
    zipcode?: string | null;
  };
  joined?: string;
};

export function ProfileDetails({ details, joined }: ProfileDetailsProps) {
  const rows: [string, string | null | undefined][] = [
  ['Name', details.full_name],
  ['Email', details.email],
  ['Tel', details.phone],
  ['Delivery Address', details.delivery_address],
  ['State', details.state],
  ['Zipcode', details.zipcode]];

  if (joined) rows.push(['Member since', joined]);

  return (
    <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
      {rows.map(([label, value]) =>
      <div key={label} className="border-b border-panel pb-4">
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-ink">{value || '—'}</dd>
        </div>
      )}
    </dl>);

}