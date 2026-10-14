import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { navMenus } from '../data/navigation';
import { vehicles } from '../data/vehicles';
import { useAuth } from '../contexts/AuthContext';

type MobileMenuProps = {onClose: () => void;};

export function MobileMenu({ onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-white lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu">
      
      <div className="flex h-14 items-center justify-end px-4">
        <button onClick={onClose} aria-label="Close menu" className="rounded p-2 hover:bg-panel">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <nav className="px-6 pb-10">
        <ul>
          {navMenus.map((m) => {
            const subLinks =
            m.id === 'vehicles' ?
            vehicles.map((v) => ({ label: v.name, to: `/vehicles/${v.slug}` })) :
            [...(m.featured?.map((f) => ({ label: f.title, to: f.to })) ?? []), ...(m.links ?? []), ...(m.groups?.flatMap((g) => g.links) ?? [])];
            const hasSub = subLinks.length > 0;
            const open = expanded === m.id;
            return (
              <li key={m.id} className="border-b border-panel">
                {hasSub ?
                <button
                  onClick={() => setExpanded(open ? null : m.id)}
                  className="flex w-full items-center justify-between py-4 text-left text-[17px] font-medium"
                  aria-expanded={open}>
                  
                    {m.label}
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button> :

                <Link to={m.to} onClick={onClose} className="block py-4 text-[17px] font-medium">
                    {m.label}
                  </Link>
                }
                {open &&
                <ul className="pb-4">
                    {subLinks.map((l) =>
                  <li key={l.label}>
                        <Link to={l.to} onClick={onClose} className="block py-2 text-sm text-muted hover:text-ink">
                          {l.label}
                        </Link>
                      </li>
                  )}
                  </ul>
                }
              </li>);

          })}
        </ul>
        <div className="mt-6">
          {user &&
          <div className="mb-4 flex flex-col gap-4">
              <Link to="/dashboard" onClick={onClose} className="text-[17px] font-medium">Dashboard</Link>
              <Link to="/cart" onClick={onClose} className="text-[17px] font-medium">Cart</Link>
            </div>
          }
          {user ?
          <button
            onClick={() => {
              signOut();
              onClose();
            }}
            className="text-[17px] font-medium">
            
              Sign Out
            </button> :

          <Link to="/signin" onClick={onClose} className="text-[17px] font-medium">
              Sign In
            </Link>
          }
        </div>
      </nav>
    </motion.div>);

}