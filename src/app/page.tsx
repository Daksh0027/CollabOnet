'use client';

import Link from 'next/link';
import { useEffect, useState, type KeyboardEvent } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  CircleCheck,
  FileCheck2,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { PRESET_PERSONAS } from '@/context/AuthContext';

const audiences = [
  {
    id: 'creator',
    label: 'Creators',
    persona: 'CREATOR',
    title: 'Keep the work yours.',
    body: 'Find partnerships that fit, agree on the details in one place, and see exactly what is due next.',
    points: ['A clear brief before you commit', 'Milestones tied to the agreement', 'A private room for every deal'],
    action: 'Open creator workspace',
  },
  {
    id: 'brand',
    label: 'Brand teams',
    persona: 'SALES_REP_A',
    title: 'Build campaigns with confidence.',
    body: 'Find verified talent, keep conversations attached to the brief, and move agreed terms into a trackable contract.',
    points: ['Search by audience, niche, and fit', 'Keep ownership clear across the team', 'Track approvals and escrow in one view'],
    action: 'Open brand workspace',
  },
  {
    id: 'manager',
    label: 'Talent managers',
    persona: 'TALENT_MANAGER',
    title: 'Guide every deal without losing the thread.',
    body: 'Support your roster with a shared view of the terms, timing, and next milestone—while company contact details stay protected.',
    points: ['See deal status across your talent', 'Review extracted terms and deadlines', 'Keep sensitive brand details masked'],
    action: 'Open manager workspace',
  },
  {
    id: 'leadership',
    label: 'Company leaders',
    persona: 'COMPANY_HEAD',
    title: 'Keep a clear view across teams.',
    body: 'Bring budgets, branch activity, and collaboration risk into one view without taking over each deal room.',
    points: ['Compare regional allocations', 'Follow spend against the pooled budget', 'Spot conflicts before approval'],
    action: 'Open leadership workspace',
  },
] as const;

type AudienceId = (typeof audiences)[number]['id'];

export default function HomePage() {
  const [activeAudience, setActiveAudience] = useState<AudienceId>('creator');
  const audience = audiences.find((item) => item.id === activeAudience) ?? audiences[0];
  const persona = PRESET_PERSONAS[audience.persona];

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll<HTMLElement>('[data-page-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((target, index) => {
      target.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
      observer.observe(target);
    });
    document.documentElement.classList.add('has-page-motion');

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('has-page-motion');
    };
  }, []);

  function handleAudienceKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index + audiences.length - 1) % audiences.length;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % audiences.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = audiences.length - 1;
    else return;

    event.preventDefault();
    const nextAudience = audiences[nextIndex];
    setActiveAudience(nextAudience.id);
    document.getElementById(`audience-tab-${nextAudience.id}`)?.focus();
  }

  return (
    <div className="marketing-page">
      <section className="marketing-hero" aria-labelledby="landing-title">
        <div className="marketing-hero-inner">
          <h1 id="landing-title" className="marketing-headline" data-page-reveal>
            Make every collab
            <span className="headline-deal" data-ui data-page-reveal aria-label="A verified deal with funded milestones">
              <span className="headline-deal-mark"><Check size={14} strokeWidth={2.5} /></span>
              <span><strong>Deal room</strong><small>Protected · In progress</small></span>
            </span>
            count.
          </h1>
          <p className="marketing-intro" data-page-reveal>
            A shared workspace for creators and brands to find the right fit, agree on clear terms,
            and move every milestone forward.
          </p>
          <div className="marketing-hero-actions" data-page-reveal>
            <a className="marketing-button marketing-button-primary" href="#workspaces">
              Choose your workspace <ArrowRight size={16} />
            </a>
            <a className="marketing-text-link" href="#how-it-works">
              See how it works <ArrowDownRight size={15} />
            </a>
          </div>
          <p className="marketing-note" data-page-reveal>
            For creators, talent managers, and the teams building campaigns with them.
          </p>
        </div>
        <div className="marketing-hero-edge" aria-hidden="true" data-page-reveal>
          <span>Discover</span><span>Agree</span><span>Deliver</span>
        </div>
      </section>

      <section className="audience-section" id="workspaces" aria-labelledby="audience-title">
        <div className="section-lead" data-page-reveal>
          <div>
            <h2 id="audience-title">One platform, shaped around your role.</h2>
            <p>Start in the workspace that matches how you collaborate.</p>
          </div>
          <span className="section-aside">Choose a workspace</span>
        </div>

        <div className="audience-layout">
          <div className="audience-tabs" role="tablist" aria-label="Choose your workspace" data-page-reveal>
            {audiences.map((item, index) => (
              <button
                key={item.id}
                id={`audience-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={activeAudience === item.id}
                aria-controls="audience-panel"
                tabIndex={activeAudience === item.id ? 0 : -1}
                className={`audience-tab${activeAudience === item.id ? ' is-active' : ''}`}
                onClick={() => setActiveAudience(item.id)}
                onKeyDown={(event) => handleAudienceKeyDown(event, index)}
              >
                <span>{item.label}</span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>

          <div
            className="audience-panel"
            id="audience-panel"
            role="tabpanel"
            aria-labelledby={`audience-tab-${audience.id}`}
            data-page-reveal
          >
            <div className="audience-copy">
              <h3>{audience.title}</h3>
              <p>{audience.body}</p>
              <ul>
                {audience.points.map((point) => (
                  <li key={point}><CircleCheck size={17} />{point}</li>
                ))}
              </ul>
              <Link className="marketing-button marketing-button-dark" href={`/dashboard?persona=${audience.persona}`}>
                {audience.action}<ArrowRight size={16} />
              </Link>
              <span className="demo-caption">Demo workspace · {persona.role.replace(/_/g, ' ').toLowerCase()}</span>
            </div>
            <div className={`audience-art audience-art-${audience.id}`} data-ui>
              {activeAudience === 'creator' && (
                <div className="creator-preview">
                  <div className="preview-toolbar"><span>Creator workspace</span><span>Oct 29</span></div>
                  <div className="creator-preview-title">Your next deliverable</div>
                  <div className="creator-preview-project">
                    <span className="preview-project-mark">AM</span>
                    <span><strong>Air Max Pulse launch</strong><small>Video draft · due Nov 12</small></span>
                    <span className="preview-status">In review</span>
                  </div>
                  <div className="creator-preview-progress"><span /></div>
                  <div className="creator-preview-foot"><span>Contract total</span><strong>$2,500.00</strong></div>
                </div>
              )}
              {activeAudience === 'brand' && (
                <div className="brand-preview">
                  <div className="preview-toolbar"><span>Talent search</span><span>Filters · 3</span></div>
                  <div className="brand-search-row"><span>Fintech creators with strong engagement</span><span>⌕</span></div>
                  <div className="brand-talent-row"><span className="talent-avatar">RT</span><span><strong>Rohan Tech Studio</strong><small>Fintech · Bengaluru</small></span><b>96.5%</b></div>
                  <div className="brand-talent-row"><span className="talent-avatar talent-avatar-2">AC</span><span><strong>Ananya Capital</strong><small>Finance · Mumbai</small></span><b>98.0%</b></div>
                </div>
              )}
              {activeAudience === 'manager' && (
                <div className="manager-preview">
                  <div className="preview-toolbar"><span>Roster activity</span><span>1 creator</span></div>
                  <div className="manager-deal-row"><span className="manager-avatar">RS</span><span><strong>Rohan Tech Studio</strong><small>Draft review due Nov 12</small></span><span className="manager-private"><LockKeyhole size={13} /> Brand details protected</span></div>
                  <div className="manager-privacy"><LockKeyhole size={14} /><span>Company contact details stay hidden in your view.</span></div>
                </div>
              )}
              {activeAudience === 'leadership' && (
                <div className="leadership-preview">
                  <div className="preview-toolbar"><span>Regional overview</span><span>October</span></div>
                  <div className="leadership-total"><span>Pooled budget</span><strong>$250,000</strong></div>
                  <div className="region-row"><span>North America</span><span className="region-track"><i style={{ width: '65%' }} /></span><b>$64,500</b></div>
                  <div className="region-row"><span>APAC</span><span className="region-track"><i style={{ width: '60%' }} /></span><b>$48,200</b></div>
                  <div className="region-row"><span>EMEA</span><span className="region-track"><i style={{ width: '46%' }} /></span><b>$32,000</b></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="product-section" aria-labelledby="product-title">
        <div className="section-lead product-section-lead" data-page-reveal>
          <div>
            <h2 id="product-title">The whole deal, not just the chat.</h2>
            <p>Keep the conversation, agreement, and next action together.</p>
          </div>
          <Link className="marketing-text-link" href="/dashboard?persona=SALES_REP_A">
            Explore the workspace <ArrowRight size={15} />
          </Link>
        </div>

        <div className="deal-room-preview" data-ui data-page-reveal>
          <aside className="deal-room-sidebar">
            <div className="preview-brand"><span className="preview-brand-mark">C</span>CollabOnet</div>
            <div className="preview-workspace">North America <span>⌄</span></div>
            <span className="preview-nav-label">Workspace</span>
            <span className="preview-nav-item"><span>◷</span>Activity</span>
            <span className="preview-nav-item"><span>⌕</span>Creator index</span>
            <span className="preview-nav-item preview-nav-current"><span>▤</span>Deal rooms</span>
            <span className="preview-nav-item"><span>□</span>Contracts</span>
            <div className="preview-side-bottom"><span className="side-avatar">AZ</span><span><strong>Alice Zhang</strong><small>Brand team</small></span></div>
          </aside>

          <div className="deal-room-main" data-ui>
            <div className="deal-room-topline">
              <span>Deal rooms&nbsp; / &nbsp;Air Max Pulse launch</span>
              <span className="deal-state"><i />Contract signed</span>
            </div>
            <div className="deal-room-heading">
              <div><h3>Air Max Pulse launch</h3><p>Rohan Tech Studio · 3 agreed deliverables</p></div>
              <span className="deal-total">$2,500.00 <small>USD</small></span>
            </div>
            <div className="deal-room-tabs"><span className="tab-current">Activity</span><span>Agreement</span><span>Milestones</span></div>
            <div className="deal-timeline">
              <div className="timeline-entry"><span className="timeline-mark is-done"><Check size={12} /></span><div><strong>Agreement signed by both sides</strong><small>Today · 3:15 PM</small></div></div>
              <div className="timeline-entry"><span className="timeline-mark is-live"><FileCheck2 size={12} /></span><div><strong>Video draft submitted for review</strong><small>Due Nov 12 · Review window 48 hours</small></div><span className="timeline-state">In review</span></div>
              <div className="timeline-entry"><span className="timeline-mark" /><div><strong>YouTube integration goes live</strong><small>Due Nov 18 · $2,000 milestone</small></div></div>
              <div className="timeline-entry"><span className="timeline-mark" /><div><strong>Instagram story set</strong><small>Due Nov 20 · $500 milestone</small></div></div>
            </div>
            <div className="deal-room-message"><MessageSquareText size={15} /><span><strong>Rohan Tech Studio</strong><small>“Sounds fair. Please generate the contract and lock escrow so we can kick off.”</small></span><span className="message-time">2m ago</span></div>
          </div>

          <aside className="deal-room-insight">
            <div className="insight-title"><span><ShieldCheck size={15} /> Deal summary</span><span>•••</span></div>
            <p>Terms agreed</p>
            <ul>
              <li><Check size={13} />$2,500 total compensation</li>
              <li><Check size={13} />1 YouTube integration</li>
              <li><Check size={13} />2 supporting stories</li>
            </ul>
            <div className="escrow-summary"><span>Escrow status</span><strong>Funds protected</strong><small>Released as milestones are approved</small></div>
            <Link href="/deals" className="insight-link">View agreement <ArrowRight size={14} /></Link>
          </aside>
        </div>
        <p className="preview-footnote">Interface preview uses CollabOnet demo data.</p>
      </section>

      <section className="workflow-section" id="how-it-works" aria-labelledby="workflow-title">
        <div className="workflow-intro">
          <h2 id="workflow-title">From first brief to final milestone.</h2>
          <p>Every step stays attached to the collaboration, so both sides know what happens next.</p>
        </div>
        <ol className="workflow-steps">
          <li className="workflow-step" data-page-reveal>
            <h3>Find the right fit</h3>
            <p>Search creator profiles by niche, audience, platform, and collaboration needs.</p>
            <div className="workflow-mini-search" data-ui><span>Search creator index</span><span>Fintech · India · YouTube</span></div>
          </li>
          <li className="workflow-step" data-page-reveal>
            <h3>Agree in one room</h3>
            <p>Keep messages, extracted terms, and the signed agreement connected to the deal.</p>
            <div className="workflow-mini-contract" data-ui><FileCheck2 size={16} /><span><strong>Agreement signed</strong><small>Both parties · SHA-256 fingerprint</small></span><Check size={15} /></div>
          </li>
          <li className="workflow-step" data-page-reveal>
            <h3>Move by milestone</h3>
            <p>Track proof, reviews, and escrow releases against the dates both sides agreed to.</p>
            <div className="workflow-mini-milestone" data-ui><span className="mini-milestone-dot" /><span><strong>Draft review</strong><small>Due Nov 12</small></span><b>In review</b></div>
          </li>
        </ol>
      </section>

      <section className="trust-section" id="trust">
        <div className="trust-copy" data-page-reveal>
          <span className="trust-mark"><ShieldCheck size={22} /></span>
          <h2>Trust should be part of the workflow.</h2>
          <p>Verification, access controls, signed terms, and milestone records are built into how a collaboration moves.</p>
        </div>
        <div className="trust-list" data-ui data-page-reveal>
          <div><ShieldCheck size={18} /><span><strong>Verified identities</strong><small>Two-phase checks for creator accounts.</small></span><Check size={16} /></div>
          <div><LockKeyhole size={18} /><span><strong>Role-aware privacy</strong><small>People see the details their role allows.</small></span><Check size={16} /></div>
          <div><FileCheck2 size={18} /><span><strong>Traceable agreements</strong><small>Terms and milestone events stay linked.</small></span><Check size={16} /></div>
        </div>
      </section>

      <section className="closing-section">
        <div data-page-reveal>
          <h2>Make the next collaboration easier to trust.</h2>
          <p>Choose the workspace that fits your role and see how a deal moves from first message to delivery.</p>
        </div>
        <Link className="marketing-button marketing-button-primary" href={`/dashboard?persona=${audience.persona}`} data-page-reveal>
          Open {audience.label.toLowerCase()} workspace <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="marketing-footer">
        <div className="marketing-footer-inner">
          <Link href="/">CollabOnet</Link>
          <span>Creator partnerships, with the work and terms in view.</span>
          <Link href="/hall-of-shame">Trust &amp; accountability</Link>
        </div>
      </footer>
    </div>
  );
}
