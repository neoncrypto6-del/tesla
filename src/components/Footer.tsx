import React from 'react';
import { Link } from 'react-router-dom';
import { footerLinks } from '../data/home';

export function Footer() {
  return (
    <footer className="bg-white px-6 py-10">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {footerLinks.map((l) =>
        <li key={l.label}>
            <Link to={l.to} className="text-xs text-muted transition-colors duration-150 hover:text-ink">
              {l.label}
            </Link>
          </li>
        )}
      </ul>
    </footer>);

}