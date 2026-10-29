'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, PRESET_PERSONAS } from '@/context/AuthContext';
import { 
  Home, 
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
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function AppHeader() {
  const pathname = usePathname();
  const { currentUser, setCurrentPersona } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/feed', label: 'Marketplace', icon: Sparkles },
    { href: '/messages', label: 'Messaging', icon: MessageSquare },
    { href: '/deals', label: 'Contracts', icon: FileText },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/collab', label: 'Collab Tab', icon: Users2 },
    { href: '/enterprise/dashboard', label: 'Enterprise', icon: Building2 },
    { href: '/onboarding/verify', label: 'Verify', icon: ShieldCheck },
    { href: '/hall-of-shame', label: 'Hall of Shame', icon: AlertTriangle },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.location.href = `/feed?q=${encodeURIComponent(searchVal)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 border-b border-[#e8e7e3] bg-white">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Left: Brand Logo & Search Bar */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-[4px] bg-[#0a66c2] flex items-center justify-center text-white font-bold text-base tracking-tight hover:bg-[#004182] transition-colors">
              CN
            </div>
            <span className="font-bold text-sm tracking-tight text-[#191919] hidden xl:inline">
              CollaboNet
            </span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#5e5e5e]" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search creators, niches, contracts..."
              className="h-9 w-52 lg:w-64 pl-9 pr-3 rounded-[4px] bg-[#edf3f8] text-xs text-[#191919] placeholder:text-[#5e5e5e] border border-transparent focus:border-[#0a66c2] focus:bg-white focus:w-72 transition-colors outline-none"
            />
          </form>
        </div>

        {/* Center: LinkedIn-style vertical icon+label nav items */}
        <nav className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 h-full">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex flex-col items-center justify-center h-full px-2 lg:px-2.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#191919] font-semibold'
                    : 'text-[#5e5e5e] hover:text-[#191919]'
                }`}
              >
                <Icon className={`h-4 w-4 mb-1 ${isActive ? 'text-[#0a66c2]' : 'text-[#5e5e5e]'}`} />
                <span className="hidden sm:inline leading-none">{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0a66c2]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Hairline divider + Persona Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#e8e7e3] h-full">
          <div className="relative h-full flex items-center">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex flex-col items-center justify-center px-2 text-[11px] text-[#5e5e5e] hover:text-[#191919] transition-colors outline-none cursor-pointer"
            >
              <div className="h-6 w-6 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.avatarFallback}
              </div>
              <div className="flex items-center gap-0.5 mt-0.5 leading-none">
                <span className="font-medium hidden sm:inline">Me</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-14 w-80 rounded-[8px] border border-[#e0dfdc] bg-white p-3 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#e8e7e3]">
                    <div className="h-10 w-10 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm">
                      {currentUser.avatarFallback}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#191919] text-sm truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-[#5e5e5e] truncate">{currentUser.description}</div>
                      <Badge variant="default" className="text-[9px] py-0 px-1.5 mt-1 font-semibold">
                        {currentUser.personaKey}
                      </Badge>
                    </div>
                  </div>

                  <div className="py-2 text-[11px] font-bold text-[#5e5e5e]">
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
                          className={`w-full text-left p-2 rounded-[6px] flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#ebf4fd] text-[#0a66c2] font-semibold'
                              : 'hover:bg-[#f3f2ef] text-[#191919]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-5 w-5 rounded-full bg-[#f4f2ee] text-[#191919] flex items-center justify-center text-[10px] font-bold border border-[#e0dfdc]">
                              {persona.avatarFallback}
                            </div>
                            <span className="text-xs truncate">{persona.name}</span>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#0a66c2] shrink-0" />}
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
