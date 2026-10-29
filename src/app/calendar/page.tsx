'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, 
  QrCode,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  date: string;
  day: number;
  type: 'DRAFT' | 'LIVE_POST' | 'EVENT' | 'PAYOUT';
  title: string;
  brand: string;
  deliverable: string;
  time: string;
  isWalkIn?: boolean;
  location?: string;
  amount?: number;
}

export default function CalendarPage() {
  const { currentUser } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const events: CalendarEvent[] = [
    {
      id: 'ev_001',
      date: '2026-11-03',
      day: 3,
      type: 'EVENT',
      title: 'Sample Kit Delivery',
      brand: 'Nike NA Branch',
      deliverable: 'Air Max Pulse gifted sample arrives via courier',
      time: '14:00',
    },
    {
      id: 'ev_002',
      date: '2026-11-12',
      day: 12,
      type: 'DRAFT',
      title: 'YouTube Draft Review Cut',
      brand: 'Nike NA Branch',
      deliverable: '1x 60s Integration segment preview cut',
      time: '18:00',
      amount: 0,
    },
    {
      id: 'ev_003',
      date: '2026-11-14',
      day: 14,
      type: 'EVENT',
      title: 'Mumbai 10K Creator Activation',
      brand: 'Nike APAC Branch',
      deliverable: 'Physical Walk-in Activation Pass',
      time: '06:00',
      isWalkIn: true,
      location: 'Bandra Fort Amphitheatre, Mumbai',
    },
    {
      id: 'ev_004',
      date: '2026-11-18',
      day: 18,
      type: 'LIVE_POST',
      title: 'YouTube Review Goes Live',
      brand: 'Nike NA Branch',
      deliverable: 'Public video publication with tracking UTM',
      time: '18:00',
      amount: 2000,
    },
    {
      id: 'ev_005',
      date: '2026-11-20',
      day: 20,
      type: 'LIVE_POST',
      title: '2x Supporting Instagram Stories',
      brand: 'Nike NA Branch',
      deliverable: 'Stories published with live swipe-up link',
      time: '12:00',
      amount: 500,
    },
    {
      id: 'ev_006',
      date: '2026-11-22',
      day: 22,
      type: 'PAYOUT',
      title: 'Escrow Release Disbursed',
      brand: 'Nike Global Escrow Pool',
      deliverable: '$2,500 deposited to creator wallet',
      time: '10:00',
      amount: 2500,
    },
  ];

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase mb-2 border border-neutral-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0057FF]" />
            Timeline Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Deliverables &amp; Milestones
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Track draft review windows, publication deadlines, physical activation walk-ins, and automated escrow payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="accent" className="text-xs py-1 px-3">
            November 2026
          </Badge>
          <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5 h-9 border-neutral-200">
            <Bell className="h-3.5 w-3.5 text-neutral-500" />
            <span>Reminders Active</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid Viewport */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-neutral-200/80 bg-neutral-50/50 text-center py-3 text-[11px] font-bold text-neutral-400 tracking-wider">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-px bg-neutral-200/70">
          {daysInMonth.map((day) => {
            const dayEvents = events.filter((e) => e.day === day);
            const isToday = day === 29;

            return (
              <div
                key={day}
                className={`min-h-[110px] p-2.5 bg-white transition-colors ${
                  isToday ? 'bg-sky-50/30 ring-1 ring-inset ring-[#0057FF]/30' : 'hover:bg-neutral-50/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold tabular-nums ${isToday ? 'text-[#0057FF]' : 'text-neutral-400'}`}>
                    {day < 10 ? `0${day}` : day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] bg-neutral-950 text-white px-1.5 py-0.5 rounded-full font-bold">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`w-full text-left p-1.5 rounded-xl text-[10px] font-semibold truncate block transition-transform active:scale-[0.98] ${
                        ev.type === 'DRAFT'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200/70'
                          : ev.type === 'LIVE_POST'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                          : ev.type === 'PAYOUT'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200/70'
                          : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                      }`}
                    >
                      <span className="mr-1 text-[9px] font-mono opacity-70">[{ev.type}]</span>
                      {ev.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          description={`Scheduled Deliverable for ${selectedEvent.brand}`}
          className="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Scheduled Time:</span>
                <span className="font-semibold text-neutral-900">{selectedEvent.date} at {selectedEvent.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Event Class:</span>
                <Badge variant="accent" className="text-[10px]">{selectedEvent.type}</Badge>
              </div>
              <div className="pt-2 border-t border-neutral-200/60">
                <span className="text-neutral-400 block mb-0.5 font-bold uppercase text-[9px]">Deliverable Spec:</span>
                <p className="text-neutral-800 leading-relaxed">{selectedEvent.deliverable}</p>
              </div>
              {selectedEvent.amount !== undefined && (
                <div className="flex justify-between pt-2 border-t border-neutral-200/60">
                  <span className="text-neutral-500 font-semibold">Milestone Amount:</span>
                  <span className="font-extrabold text-emerald-600 tabular-nums text-sm">
                    {formatCurrency(selectedEvent.amount)}
                  </span>
                </div>
              )}
            </div>

            {selectedEvent.isWalkIn && (
              <div className="p-4 rounded-2xl bg-neutral-900 text-white text-center space-y-3">
                <div className="text-xs font-bold flex items-center justify-center gap-1.5 text-neutral-200">
                  <QrCode className="h-4 w-4 text-[#0057FF]" />
                  Geo-Fenced Walk-In Creator Pass
                </div>
                <div className="h-28 w-28 bg-white rounded-2xl mx-auto flex items-center justify-center p-2 shadow-inner">
                  <div className="h-full w-full bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-900 text-[10px] font-mono font-bold">
                    [PASS-QR-901]
                  </div>
                </div>
                <div className="text-xs text-neutral-400">
                  Venue: <strong className="text-white">{selectedEvent.location}</strong>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-neutral-100">
              <Button variant="primary" size="sm" onClick={() => setSelectedEvent(null)} className="rounded-full">
                Dismiss
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
