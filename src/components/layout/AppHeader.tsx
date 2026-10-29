'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, PRESET_PERSONAS } from '@/context/AuthContext';
import { 
  Sparkles, 
  MessageSquare, 
  Building2, 
  Calendar, 
  Users2, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown, 
  Check, 
  Search,
  Compass,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AppHeader() {
  const pathname = usePathname();
  const { currentUser, setCurrentPersona } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const navLinks = [
    { href: '/feed', label: 'Explore', icon: Compass },
    { href: '/deals', label: 'Deals & Escrow', icon: FileText },
    { href: '/messages', label: 'Messages', icon: MessageSquare, hasUnread: true },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/collab', label: 'Collab Tab', icon: Users2 },
    { href: '/hall-of-shame', label: 'Hall of Shame', icon: AlertTriangle, isWarning: true },
    { href: '/onboarding/verify', label: 'KYC', icon: ShieldCheck },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.location.href = `/feed?q=${encodeURIComponent(searchVal)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-neutral-200/70 bg-white/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white font-black text-xs tracking-wider group-hover:bg-[#0057FF] transition-all duration-200 shadow-sm">
              CO
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-neutral-950 flex items-center gap-1">
                CollabOnet
                <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF]" />
              </span>
              <span className="text-[9px] font-medium text-neutral-400 tracking-widest uppercase -mt-0.5">
                Escrow Protocol
              </span>
            </div>
          </Link>

          {/* Minimalist Search Pill */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search creators, niches, deals..."
              className="h-9 w-48 lg:w-64 pl-9 pr-3 rounded-full bg-neutral-100/80 text-xs text-neutral-900 placeholder:text-neutral-400 border border-neutral-200/60 focus:border-[#0057FF] focus:bg-white focus:w-72 transition-all duration-200 outline-none"
            />
          </form>
        </div>

        {/* Center: Minimal Horizontal Navigation Pills */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : link.isWarning
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : link.isWarning ? 'text-rose-500' : 'text-neutral-400'}`} />
                <span>{link.label}</span>
                {link.hasUnread && !isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Persona Switcher & Quick Action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/onboarding/verify" className="hidden sm:inline-block">
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs gap-1.5 border-neutral-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verify KYC</span>
            </Button>
          </Link>

          {/* User Persona Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 transition-all text-xs outline-none cursor-pointer shadow-xs"
            >
              <div className="h-6 w-6 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.avatarFallback}
              </div>
              <div className="flex flex-col text-left leading-tight hidden sm:block">
                <span className="font-semibold text-neutral-900 text-[11px] truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-neutral-400 font-medium">
                  {currentUser.personaKey}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-12 w-80 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                    <div className="h-10 w-10 rounded-full bg-neutral-950 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {currentUser.avatarFallback}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-neutral-900 text-sm truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-neutral-500 truncate">{currentUser.description}</div>
                      <Badge variant="accent" className="text-[9px] py-0 px-2 mt-1 font-semibold">
                        {currentUser.personaKey}
                      </Badge>
                    </div>
                  </div>

                  <div className="py-2 text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                    Switch Test Account (RLS Simulation)
                  </div>

                  <div className="space-y-1">
                    {Object.entries(PRESET_PERSONAS).map(([key, persona]) => {
                      const isSelected = currentUser.personaKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setCurrentPersona(key as any);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-neutral-100 text-neutral-950 font-semibold'
                              : 'hover:bg-neutral-50 text-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-6 w-6 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center text-[10px] font-bold border border-neutral-200">
                              {persona.avatarFallback}
                            </div>
                            <span className="text-xs truncate">{persona.name}</span>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#0057FF] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
