import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GlobeIcon, UserCircle2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { navMenus } from '../data/navigation';
import { useAuth } from '../contexts/AuthContext';
type HeaderProps = {
  transparent?: boolean;
  tone?: 'light' | 'dark';
};
export function Header({
  transparent = false,
  tone = 'dark'
}: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const {
    user,
    profile,
    isAdmin,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 80);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const solid = !transparent || openMenu !== null || scrolled;
  const light = !solid && tone === 'light';
  const text = light ? 'text-white' : 'text-ink';
  const hover = light ? 'hover:bg-white/15' : 'hover:bg-black/5';
  const firstName = profile?.full_name?.split(' ')[0] || 'Account';
  return <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ease-out ${solid ? 'bg-white' : 'bg-transparent'}`} onMouseLeave={() => setOpenMenu(null)}>
        <div className={`relative flex h-14 items-center justify-between px-4 lg:px-10 ${text}`}>
          <Link to="/" aria-label="TACYE home" className="flex w-40 items-center">
            <Logo tone={light ? 'light' : 'dark'} />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Primary">
            {navMenus.map((m) => <Link key={m.id} to={m.to} onMouseEnter={() => setOpenMenu(m.id === 'semi' ? null : m.id)} onFocus={() => setOpenMenu(m.id === 'semi' ? null : m.id)} onClick={() => setOpenMenu(null)} className={`rounded px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${hover} ${openMenu === m.id ? 'bg-black/5' : ''}`}>
                {m.label}
              </Link>)}
          </nav>

          <div className="flex w-40 items-center justify-end gap-1" onMouseEnter={() => setOpenMenu(null)}>
            <button onClick={() => navigate('/discover')} aria-label="Support" className={`hidden rounded p-1.5 transition-colors duration-150 md:block ${hover}`}>
              <div className="h-5 w-5" strokeWidth={1.6} />
            </button>
            <button onClick={() => toast('Region: United States', {
            description: 'English (US) · USD'
          })} aria-label="Region and language" className={`hidden rounded p-1.5 transition-colors duration-150 md:block ${hover}`}>
              <GlobeIcon className="h-5 w-5" strokeWidth={1.6} />
            </button>
            <div className="relative">
              <button onClick={() => user ? setAccountOpen((o) => !o) : navigate('/signin')} className={`flex items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium transition-colors duration-150 ${hover}`} aria-haspopup={user ? 'menu' : undefined} aria-expanded={user ? accountOpen : undefined}>
                <UserCircle2Icon className="h-5 w-5" strokeWidth={1.6} />
                <span className="hidden whitespace-nowrap sm:inline">{user ? firstName : 'Sign In'}</span>
              </button>
              <AnimatePresence>
                {accountOpen && user && <motion.div initial={{
                opacity: 0,
                scale: 0.96,
                y: -4
              }} animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }} exit={{
                opacity: 0,
                scale: 0.96,
                y: -4
              }} transition={{
                duration: 0.15,
                ease: [0.23, 1, 0.32, 1]
              }} className="absolute right-0 top-11 w-60 origin-top-right rounded-lg bg-white p-2 text-ink shadow-xl ring-1 ring-black/5" role="menu">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{profile?.full_name || 'TACYE Account'}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    {[{
                  label: 'Dashboard',
                  to: '/dashboard'
                }, {
                  label: 'Cart',
                  to: '/cart'
                }, {
                  label: 'Support Chat',
                  to: '/dashboard?tab=support'
                }, ...(isAdmin ? [{
                  label: 'Admin Dashboard',
                  to: '/admin'
                }] : [])].map((item) => <button key={item.label} role="menuitem" onClick={() => {
                  setAccountOpen(false);
                  navigate(item.to);
                }} className="w-full rounded px-3 py-2 text-left text-sm hover:bg-panel">
                        {item.label}
                      </button>)}
                    <button role="menuitem" onClick={async () => {
                  setAccountOpen(false);
                  await signOut();
                  toast('Signed out');
                }} className="w-full rounded px-3 py-2 text-left text-sm hover:bg-panel">
                      Sign Out
                    </button>
                  </motion.div>}
              </AnimatePresence>
            </div>
            <button onClick={() => setMobileOpen(true)} className={`ml-1 rounded px-3 py-1.5 text-sm font-medium lg:hidden ${light ? 'bg-white/20' : 'bg-black/5'}`}>
              Menu
            </button>
          </div>
        </div>
        <AnimatePresence>
          {openMenu && <MegaMenu key={openMenu} menuId={openMenu} onNavigate={() => setOpenMenu(null)} />}
        </AnimatePresence>
      </header>
      <AnimatePresence>{mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}</AnimatePresence>
    </>;
}