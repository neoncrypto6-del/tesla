import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navMenus } from '../data/navigation';
import { vehicles } from '../data/vehicles';

type MegaMenuProps = {menuId: string;onNavigate: () => void;};

export function MegaMenu({ menuId, onNavigate }: MegaMenuProps) {
  const menu = navMenus.find((m) => m.id === menuId);
  if (!menu) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-x-0 top-14 hidden border-t border-panel bg-white shadow-[0_24px_40px_-24px_rgba(0,0,0,0.18)] lg:block">
      
      <div className="mx-auto flex max-w-[1280px] gap-12 px-10 py-10">
        <div className="flex-1">
          {menu.id === 'vehicles' &&
          <div className="grid grid-cols-3 gap-x-8 gap-y-6">
              {vehicles.map((v) =>
            <div key={v.slug} className="text-center">
                  <Link to={`/vehicles/${v.slug}`} onClick={onNavigate} className="block">
                    <img src={v.image} alt={v.name} className="mx-auto h-28 w-full rounded object-cover" />
                    <p className="mt-3 text-[15px] font-medium text-ink">{v.name}</p>
                  </Link>
                  <div className="mt-1 flex justify-center gap-4 text-xs text-muted">
                    <Link to={`/vehicles/${v.slug}`} onClick={onNavigate} className="underline-offset-4 hover:text-ink hover:underline">
                      Learn
                    </Link>
                    <Link to={`/order/${v.slug}`} onClick={onNavigate} className="underline-offset-4 hover:text-ink hover:underline">
                      Order
                    </Link>
                  </div>
                </div>
            )}
            </div>
          }

          {menu.featured &&
          <div className="grid grid-cols-2 gap-8">
              {menu.featured.map((f) =>
            <Link key={f.title} to={f.to} onClick={onNavigate} className="group block text-center">
                  <img src={f.image} alt={f.title} className="h-44 w-full rounded object-cover" />
                  <p className="mt-3 text-[15px] font-medium text-ink">{f.title}</p>
                  <p className="mt-1 text-xs text-muted group-hover:text-ink">Learn more</p>
                </Link>
            )}
            </div>
          }

          {menu.groups &&
          <div className="grid grid-cols-3 gap-10">
              {menu.groups.map((g) =>
            <div key={g.title}>
                  <p className="text-xs font-medium text-muted">{g.title}</p>
                  <ul className="mt-3 space-y-2.5">
                    {g.links.map((l) =>
                <li key={l.label}>
                        <Link to={l.to} onClick={onNavigate} className="text-sm font-medium text-ink hover:underline underline-offset-4">
                          {l.label}
                        </Link>
                      </li>
                )}
                  </ul>
                </div>
            )}
            </div>
          }
        </div>

        {menu.links &&
        <ul className="w-56 space-y-3 border-l border-panel pl-10">
            {menu.links.map((l) =>
          <li key={l.label}>
                <Link to={l.to} onClick={onNavigate} className="text-sm font-medium text-ink underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
          )}
          </ul>
        }
      </div>
    </motion.div>);

}