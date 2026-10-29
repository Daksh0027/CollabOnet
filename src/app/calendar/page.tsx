'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, 
  QrCode
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
      title: 'Shoe Sample Delivery Expected',
      brand: 'Nike NA Branch',
      deliverable: 'Air Max Pulse gifted sample arrives via courier',
      time: '14:00',
    },
    {
      id: 'ev_002',
      date: '2026-11-12',
      day: 12,
      type: 'DRAFT',
      title: 'Unlisted YouTube Draft Due',
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
      title: 'Mumbai 10K Marathon Creator Hub',
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
      title: 'YouTube Review Video Goes Live',
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
      title: 'Final Escrow Disbursement Released',
      brand: 'Nike Global Escrow Pool',
      deliverable: '$2,500 deposited to creator wallet',
      time: '10:00',
      amount: 2500,
    },
  ];

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="linkedin-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#191919] tracking-tight">Deliverables &amp; Event Calendar</h1>
            <Badge variant="accent" className="text-xs">November 2026</Badge>
          </div>
          <p className="text-xs text-[#5e5e5e]">
            Track draft review windows, publication deadlines, physical activation walk-ins, and escrow payouts.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
          <Bell className="h-3.5 w-3.5 text-[#0a66c2]" />
          Notification Push Cron: T-48h, T-24h
        </Button>
      </div>

      {/* Calendar Grid Viewport */}
      <div className="linkedin-card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-[#e0dfdc] bg-[#f9fafb] text-center py-2 text-xs font-semibold text-[#5e5e5e]">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-[#e0dfdc]">
          {daysInMonth.map((day) => {
            const dayEvents = events.filter((e) => e.day === day);
            const isToday = day === 29;

            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 bg-white transition-colors ${
                  isToday ? 'bg-[#ebf4fd]/40 ring-1 ring-inset ring-[#0a66c2]' : 'hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold tabular-nums ${isToday ? 'text-[#0a66c2]' : 'text-[#5e5e5e]'}`}>
                    {day < 10 ? `0${day}` : day}
                  </span>
                  {isToday && (
                    <span className="text-[10px] bg-[#0a66c2] text-white px-1 rounded font-semibold">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`w-full text-left p-1 rounded text-[10px] font-semibold truncate block ${
                        ev.type === 'DRAFT'
                          ? 'bg-[#fef3d6] text-[#915907] border border-[#f9e2a8]'
                          : ev.type === 'LIVE_POST'
                          ? 'bg-[#e6f4ea] text-[#057642] border border-[#c6ebd1]'
                          : ev.type === 'PAYOUT'
                          ? 'bg-[#ebf4fd] text-[#0a66c2] border border-[#cce4f9]'
                          : 'bg-[#edf3f8] text-[#0a66c2] border border-[#d0e8ff]'
                      }`}
                    >
                      <span className="mr-1">[{ev.type}]</span>
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
          <div className="space-y-3">
            <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e8e7e3] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5e5e5e]">Date &amp; Time:</span>
                <span className="font-semibold text-[#191919]">{selectedEvent.date} at {selectedEvent.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5e5e5e]">Category:</span>
                <Badge variant="accent" className="text-[10px]">{selectedEvent.type}</Badge>
              </div>
              <div className="pt-1 border-t border-[#e8e7e3]">
                <span className="text-[#5e5e5e] block mb-0.5">Details:</span>
                <p className="text-[#191919]">{selectedEvent.deliverable}</p>
              </div>
              {selectedEvent.amount !== undefined && (
                <div className="flex justify-between pt-1 border-t border-[#e8e7e3]">
                  <span className="text-[#5e5e5e]">Escrow Value:</span>
                  <span className="font-bold text-[#057642] tabular-nums">
                    {formatCurrency(selectedEvent.amount)}
                  </span>
                </div>
              )}
            </div>

            {selectedEvent.isWalkIn && (
              <div className="p-3 rounded bg-[#ebf4fd] border border-[#cce4f9] text-center space-y-2">
                <div className="text-xs font-bold text-[#191919] flex items-center justify-center gap-1.5">
                  <QrCode className="h-4 w-4 text-[#0a66c2]" />
                  Dynamic QR Geo-Fenced Activation Pass
                </div>
                <div className="h-24 w-24 bg-white rounded mx-auto flex items-center justify-center p-2 border border-[#cce4f9]">
                  <div className="h-full w-full bg-[#f4f2ee] rounded flex items-center justify-center text-[#0a66c2] text-[9px] font-bold">
                    COLLABONET-PASS
                  </div>
                </div>
                <div className="text-xs text-[#5e5e5e]">
                  Location: <strong>{selectedEvent.location}</strong>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-[#f0f0f0]">
              <Button variant="primary" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
