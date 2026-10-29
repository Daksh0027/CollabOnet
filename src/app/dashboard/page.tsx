'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  FileCheck2,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react';
import { PRESET_PERSONAS, useAuth, type UserPersona } from '@/context/AuthContext';
import {
  SEED_BRANCHES,
  SEED_CAMPAIGNS,
  SEED_CONVERSATIONS,
  SEED_CONTRACTS,
  SEED_HALL_OF_SHAME,
  SEED_MESSAGES,
  SEED_ORGANIZATION,
} from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

type PersonaKey = keyof typeof PRESET_PERSONAS;
type DashboardTab = 'overview' | 'work' | 'activity';
type DashboardSection = 'overview' | 'creators' | 'messages' | 'contracts' | 'calendar' | 'collabs' | 'branches' | 'trust' | 'cases';

interface Metric {
  label: string;
  value: string;
  note: string;
}

interface WorkItem {
  title: string;
  detail: string;
  status: string;
  href: string;
}

interface WorkspaceConfig {
  label: string;
  title: string;
  description: string;
  action: string;
  actionHref: string;
  tabs: Record<DashboardTab, string>;
  navigation: Array<{ label: string; href: string; icon: typeof LayoutDashboard; section: DashboardSection }>;
  metrics: Metric[];
  workItems: WorkItem[];
  activity: Array<{ title: string; detail: string; time: string }>;
}

const contract = SEED_CONTRACTS[0];
const conversation = SEED_CONVERSATIONS[0];
const creatorReview = contract.milestones.find((item) => item.status === 'SUBMITTED');
const branchSpend = SEED_BRANCHES.reduce((sum, branch) => sum + branch.spentThisMonth, 0);

function getWorkspaceConfig(persona: UserPersona): WorkspaceConfig {
  const sharedNavigation = {
    overview: { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, section: 'overview' as const },
    creators: { label: 'Creator index', href: '/feed', icon: Search, section: 'creators' as const },
    messages: { label: 'Deal rooms', href: '/messages', icon: MessageSquareText, section: 'messages' as const },
    contracts: { label: 'Contracts', href: '/deals', icon: FileCheck2, section: 'contracts' as const },
    calendar: { label: 'Calendar', href: '/calendar', icon: CalendarDays, section: 'calendar' as const },
    collabs: { label: 'Collabs', href: '/collab', icon: UsersRound, section: 'collabs' as const },
    branches: { label: 'Branch portfolio', href: '/enterprise/dashboard', icon: Building2, section: 'branches' as const },
    trust: { label: 'Trust & verification', href: '/onboarding/verify', icon: ShieldCheck, section: 'trust' as const },
    cases: { label: 'Public case ledger', href: '/hall-of-shame', icon: ShieldCheck, section: 'cases' as const },
  };

  if (persona.personaKey === 'CREATOR') {
    return {
      label: 'Creator workspace',
      title: 'Your collaborations',
      description: 'One place for your active deal, next deliverable, and messages.',
      action: 'Open deal room',
      actionHref: '/messages',
      tabs: { overview: 'Overview', work: 'Deliverables', activity: 'Activity' },
      navigation: [
        sharedNavigation.overview,
        sharedNavigation.creators,
        sharedNavigation.collabs,
        sharedNavigation.messages,
        sharedNavigation.contracts,
        sharedNavigation.calendar,
      ],
      metrics: [
        { label: 'Escrow agreement', value: formatCurrency(contract.totalAmount, contract.currency), note: 'Air Max Pulse launch' },
        { label: 'Deliverables', value: String(contract.milestones.length), note: 'Across this agreement' },
        { label: 'Next review', value: creatorReview ? new Date(creatorReview.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—', note: 'Video draft · due date' },
      ],
      workItems: contract.milestones.map((milestone) => ({
        title: milestone.title,
        detail: `${new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${formatCurrency(milestone.amount, contract.currency)}`,
        status: milestone.status === 'SUBMITTED' ? 'In review' : milestone.status === 'PAID' ? 'Released' : 'Upcoming',
        href: '/deals/contract_nike_rohan_001',
      })),
      activity: SEED_MESSAGES.filter((message) => message.conversationId === conversation.id).slice(-3).reverse().map((message) => ({
        title: message.senderId === persona.id ? 'You sent a message' : `${message.senderName} replied`,
        detail: message.content,
        time: new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      })),
    };
  }

  if (persona.personaKey === 'SALES_REP_A') {
    return {
      label: 'Brand workspace',
      title: 'Campaign workspace',
      description: 'Creator discovery, deal conversations, and campaign delivery in one place.',
      action: 'Find creators',
      actionHref: '/feed',
      tabs: { overview: 'Overview', work: 'Campaigns', activity: 'Deal activity' },
      navigation: [
        sharedNavigation.overview,
        sharedNavigation.creators,
        sharedNavigation.calendar,
        sharedNavigation.messages,
        sharedNavigation.contracts,
      ],
      metrics: [
        { label: 'Active campaigns', value: String(SEED_CAMPAIGNS.filter((item) => item.status === 'ACTIVE').length), note: 'Across your workspace' },
        { label: 'Agreed contract', value: formatCurrency(contract.totalAmount, contract.currency), note: 'Rohan Tech Studio' },
        { label: 'Submitted for review', value: String(contract.milestones.filter((item) => item.status === 'SUBMITTED').length), note: 'Needs a response' },
      ],
      workItems: [
        ...SEED_CAMPAIGNS.map((campaign) => ({
          title: campaign.title,
          detail: `${campaign.targetNiches.join(', ')} · ${formatCurrency(campaign.budgetMin)}–${formatCurrency(campaign.budgetMax)}`,
          status: campaign.status === 'ACTIVE' ? 'Active' : campaign.status,
          href: '/calendar',
        })),
        {
          title: 'Review submitted video draft',
          detail: 'Rohan Tech Studio · due Nov 12',
          status: 'In review',
          href: '/deals/contract_nike_rohan_001',
        },
      ],
      activity: SEED_MESSAGES.filter((message) => message.conversationId === conversation.id).slice(-3).reverse().map((message) => ({
        title: message.senderId === persona.id ? 'You sent a message' : `${message.senderName} replied`,
        detail: message.content,
        time: new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      })),
    };
  }

  if (persona.personaKey === 'SALES_REP_B') {
    return {
      label: 'Brand workspace',
      title: 'Your campaign workspace',
      description: 'Explore active briefs and keep the conversations assigned to you in view.',
      action: 'Browse creator index',
      actionHref: '/feed',
      tabs: { overview: 'Overview', work: 'Campaigns', activity: 'Activity' },
      navigation: [
        sharedNavigation.overview,
        sharedNavigation.creators,
        sharedNavigation.calendar,
        sharedNavigation.messages,
        sharedNavigation.contracts,
      ],
      metrics: [
        { label: 'Active campaigns', value: String(SEED_CAMPAIGNS.filter((item) => item.status === 'ACTIVE').length), note: 'Available in your organization' },
        { label: 'Assigned deals', value: '0', note: 'No deal rooms assigned' },
        { label: 'Unread messages', value: '0', note: 'You are all caught up' },
      ],
      workItems: SEED_CAMPAIGNS.map((campaign) => ({
        title: campaign.title,
        detail: `${campaign.targetNiches.join(', ')} · ${formatCurrency(campaign.budgetMin)}–${formatCurrency(campaign.budgetMax)}`,
        status: campaign.status === 'ACTIVE' ? 'Active' : campaign.status,
        href: '/calendar',
      })),
      activity: [],
    };
  }

  if (persona.personaKey === 'TALENT_MANAGER') {
    return {
      label: 'Talent manager workspace',
      title: 'Roster and deal progress',
      description: 'A portfolio-level view of your talent, with private deal details kept role-aware.',
      action: 'Review active deal',
      actionHref: '/messages',
      tabs: { overview: 'Roster overview', work: 'Review queue', activity: 'Deal activity' },
      navigation: [
        sharedNavigation.overview,
        sharedNavigation.creators,
        sharedNavigation.collabs,
        sharedNavigation.messages,
        sharedNavigation.contracts,
        sharedNavigation.calendar,
      ],
      metrics: [
        { label: 'Managed creators', value: '1', note: 'Rohan Tech Studio' },
        { label: 'Active agreement', value: formatCurrency(contract.totalAmount, contract.currency), note: 'Masked brand representative details' },
        { label: 'Upcoming reviews', value: '1', note: 'Video draft · Nov 12' },
      ],
      workItems: [
        { title: 'Review video draft', detail: 'Rohan Tech Studio · due Nov 12', status: 'In review', href: '/deals/contract_nike_rohan_001' },
        { title: 'Confirm publication timing', detail: 'YouTube integration · Nov 18', status: 'Upcoming', href: '/messages' },
        { title: 'Confirm story links', detail: 'Two Instagram stories · Nov 20', status: 'Upcoming', href: '/messages' },
      ],
      activity: [
        { title: 'Terms agreed', detail: 'The brand representative and creator agreed on compensation and deliverables.', time: 'Today' },
        { title: 'Agreement signed', detail: 'Both sides signed the collaboration agreement.', time: 'Today' },
        { title: 'Brand identity protected', detail: 'Contact details are hidden in the manager view.', time: 'Access policy' },
      ],
    };
  }

  if (persona.personaKey === 'COMPANY_HEAD') {
    return {
      label: 'Company leadership',
      title: 'Portfolio overview',
      description: 'Budget allocation and activity across your organization’s regional teams.',
      action: 'Open branch portfolio',
      actionHref: '/enterprise/dashboard',
      tabs: { overview: 'Portfolio', work: 'Budgets', activity: 'Risk & activity' },
      navigation: [
        sharedNavigation.overview,
        sharedNavigation.branches,
        sharedNavigation.creators,
        sharedNavigation.contracts,
        sharedNavigation.cases,
      ],
      metrics: [
        { label: 'Pooled budget', value: formatCurrency(SEED_ORGANIZATION.billingPoolBalance), note: 'Organization balance' },
        { label: 'Spend this month', value: formatCurrency(branchSpend), note: 'Sum of regional spend' },
        { label: 'Regional teams', value: String(SEED_BRANCHES.length), note: 'North America · APAC · EMEA' },
      ],
      workItems: SEED_BRANCHES.map((branch) => ({
        title: branch.branchName,
        detail: `${formatCurrency(branch.spentThisMonth)} spent of ${formatCurrency(branch.monthlyBudgetAllocation)} allocated`,
        status: `${Math.round((branch.spentThisMonth / branch.monthlyBudgetAllocation) * 100)}% used`,
        href: '/enterprise/dashboard',
      })),
      activity: [
        { title: 'Active campaign', detail: SEED_CAMPAIGNS[0].title, time: 'North America' },
        { title: 'Active campaign', detail: SEED_CAMPAIGNS[1].title, time: 'APAC' },
        { title: 'Escrow agreement', detail: `${contract.creatorDisplayName} · ${formatCurrency(contract.totalAmount, contract.currency)}`, time: 'North America' },
      ],
    };
  }

  return {
    label: 'Trust operations',
    title: 'Verification and case review',
    description: 'Keep identity checks and public case records moving with a clear audit trail.',
    action: 'Open verification',
    actionHref: '/onboarding/verify',
    tabs: { overview: 'Overview', work: 'Verification', activity: 'Case ledger' },
    navigation: [
      sharedNavigation.overview,
      sharedNavigation.trust,
      sharedNavigation.cases,
      sharedNavigation.contracts,
    ],
    metrics: [
      { label: 'Published cases', value: String(SEED_HALL_OF_SHAME.length), note: 'In the public case ledger' },
      { label: 'Verification flow', value: '2 phases', note: 'Liveness check and review' },
      { label: 'Audit trail', value: 'Available', note: 'Contract events are recorded' },
    ],
    workItems: [
      { title: 'Identity verification', detail: 'Review submitted phase-one checks', status: 'Open workflow', href: '/onboarding/verify' },
      ...SEED_HALL_OF_SHAME.map((entry) => ({
        title: entry.offenseCategory,
        detail: `${entry.offenderName} · ${entry.totalClaimValue ? formatCurrency(entry.totalClaimValue) : 'Claim amount unavailable'}`,
        status: 'Published',
        href: '/hall-of-shame',
      })),
    ],
    activity: SEED_HALL_OF_SHAME.map((entry) => ({
      title: 'Case published',
      detail: `${entry.offenderName} · ${entry.offenseCategory}`,
      time: new Date(entry.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })),
  };
}

function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="workspace-metrics">
      {metrics.map((metric) => (
        <div className="workspace-metric" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <small>{metric.note}</small>
        </div>
      ))}
    </div>
  );
}

function TaskList({ items }: { items: WorkItem[] }) {
  if (!items.length) {
    return <p className="workspace-empty">Nothing needs your attention right now.</p>;
  }

  return (
    <div className="workspace-rows">
      {items.map((item) => (
        <Link className="workspace-row" href={item.href} key={`${item.title}-${item.detail}`}>
          <span className="workspace-row-mark"><CircleCheck size={16} /></span>
          <span className="workspace-row-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
          <span className="workspace-row-status">{item.status}</span>
          <ArrowRight size={15} className="workspace-row-arrow" />
        </Link>
      ))}
    </div>
  );
}

function ActivityList({ items }: { items: WorkspaceConfig['activity'] }) {
  if (!items.length) {
    return <p className="workspace-empty">Your activity will appear here when a deal is assigned to you.</p>;
  }

  return (
    <div className="workspace-activity-list">
      {items.map((item, index) => (
        <article className="workspace-activity-row" key={`${item.title}-${item.time}-${index}`}>
          <span className="activity-avatar">{item.title.includes('You') ? 'AZ' : 'CO'}</span>
          <div><strong>{item.title}</strong><p>{item.detail}</p></div>
          <time>{item.time}</time>
        </article>
      ))}
    </div>
  );
}

function BranchPortfolio() {
  return (
    <div className="branch-portfolio">
      {SEED_BRANCHES.map((branch) => {
        const ratio = Math.round((branch.spentThisMonth / branch.monthlyBudgetAllocation) * 100);
        return (
          <Link href="/enterprise/dashboard" className="branch-row" key={branch.id}>
            <span className="branch-region">{branch.branchName}<small>{branch.locationCity}, {branch.locationCountry}</small></span>
            <span className="branch-budget-bar"><i style={{ width: `${ratio}%` }} /></span>
            <span className="branch-budget-value">{formatCurrency(branch.spentThisMonth)}<small>of {formatCurrency(branch.monthlyBudgetAllocation)}</small></span>
            <span className="branch-ratio">{ratio}%</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { currentUser, setCurrentPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const queryPersonaApplied = useRef(false);
  const config = useMemo(() => getWorkspaceConfig(currentUser), [currentUser]);
  const personas = Object.entries(PRESET_PERSONAS) as Array<[PersonaKey, UserPersona]>;

  useEffect(() => {
    if (queryPersonaApplied.current) return;
    queryPersonaApplied.current = true;
    const requestedPersona = new URLSearchParams(window.location.search).get('persona');
    if (requestedPersona && Object.prototype.hasOwnProperty.call(PRESET_PERSONAS, requestedPersona)) {
      setCurrentPersona(requestedPersona as PersonaKey);
    }
    setWorkspaceReady(true);
  }, [setCurrentPersona]);

  useEffect(() => {
    setActiveTab('overview');
    setActiveSection('overview');
  }, [currentUser.personaKey]);

  if (!workspaceReady) {
    return <main className="workspace-loading" aria-live="polite">Opening workspace…</main>;
  }

  const focusTitle = currentUser.personaKey === 'COMPANY_HEAD'
    ? 'Regional budget allocation'
    : currentUser.personaKey === 'PLATFORM_ADMIN'
    ? 'Trust operations'
    : currentUser.personaKey === 'SALES_REP_B'
    ? 'Assigned to you'
    : currentUser.personaKey === 'TALENT_MANAGER'
    ? 'Rohan Tech Studio'
    : 'Air Max Pulse launch';
  const focusSubtitle = currentUser.personaKey === 'COMPANY_HEAD'
    ? 'Monthly spend compared with each branch allocation.'
    : currentUser.personaKey === 'PLATFORM_ADMIN'
    ? 'Verification and published case records.'
    : currentUser.personaKey === 'SALES_REP_B'
    ? 'Deal rooms only appear here when they are assigned to your account.'
    : currentUser.personaKey === 'TALENT_MANAGER'
    ? 'Brand representative details are masked in this workspace.'
    : `${contract.creatorDisplayName} · ${contract.milestones.length} milestones · ${formatCurrency(contract.totalAmount, contract.currency)}`;

  const selectedNavigation = config.navigation.find((item) => item.section === activeSection);
  const selectedTabTitle = activeSection === 'overview'
    ? config.tabs[activeTab]
    : selectedNavigation?.label ?? config.tabs[activeTab];
  const visibleNavigation = (
    <nav className="workspace-nav" aria-label="Workspace navigation">
      <span className="workspace-nav-label">Workspace</span>
      {config.navigation.map((item) => {
        const Icon = item.icon;
        const selected = item.section === activeSection;
        return (
          <button
            type="button"
            className={`workspace-nav-link${selected ? ' is-selected' : ''}`}
            key={item.href}
            onClick={() => {
              setActiveSection(item.section);
              setActiveTab('overview');
              setMobileMenuOpen(false);
            }}
          >
            <Icon size={16} strokeWidth={1.7} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="workspace-app">
      {mobileMenuOpen && <button className="workspace-mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`workspace-sidebar${mobileMenuOpen ? ' is-open' : ''}`}>
        <Link href="/" className="workspace-brand">
          <span className="workspace-brand-mark">C</span>
          <span>CollabOnet</span>
        </Link>
        <div className="workspace-scope">
          <span className="scope-mark">{currentUser.avatarFallback.slice(0, 1)}</span>
          <span><strong>{config.label}</strong><small>{currentUser.organizationName || currentUser.name}</small></span>
          <ChevronDown size={14} />
        </div>
        {visibleNavigation}
        <div className="workspace-sidebar-bottom">
          <Link href="/onboarding/verify"><ShieldCheck size={16} />Verification status</Link>
          <div className="workspace-user">
            <span className="workspace-user-avatar">{currentUser.avatarFallback}</span>
            <span><strong>{currentUser.name}</strong>            <small>{currentUser.role.replace(/_/g, ' ').toLowerCase()}</small></span>
          </div>
        </div>
      </aside>

      <div className="workspace-stage">
        <header className="workspace-topbar">
          <button
            className="workspace-mobile-menu"
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <div className="workspace-breadcrumb"><span>CollabOnet</span><span>/</span><strong>{selectedTabTitle}</strong></div>
          <div className="workspace-topbar-actions">
            <label className="workspace-persona-select">
              <span>Demo role</span>
              <select
                aria-label="Switch demo role"
                value={currentUser.personaKey}
                onChange={(event) => setCurrentPersona(event.target.value as PersonaKey)}
              >
                {personas.map(([key, persona]) => <option key={key} value={key}>{persona.name}</option>)}
              </select>
              <ChevronDown size={13} />
            </label>
            <Link href="/messages" className="workspace-topbar-action" aria-label="Open messages"><MessageSquareText size={17} /></Link>
          </div>
        </header>

        <main className="workspace-canvas">
          <div className="workspace-heading">
            <div>
              <h1>{activeSection === 'overview' ? config.title : selectedTabTitle}</h1>
              <p>{config.description}</p>
            </div>
            <Link className="workspace-primary-action" href={activeSection === 'overview' ? config.actionHref : selectedNavigation?.href ?? config.actionHref}>{activeSection === 'overview' ? config.action : `Open ${selectedNavigation?.label.toLowerCase() ?? 'workspace'}`}<ArrowRight size={15} /></Link>
          </div>

          {activeSection === 'overview' && <div className="workspace-tabs" role="tablist" aria-label={`${config.label} dashboard views`}>
            {(Object.keys(config.tabs) as DashboardTab[]).map((tab) => (
              <button
                key={tab}
                id={`workspace-tab-${tab}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="dashboard-view-panel"
                className={`workspace-tab${activeTab === tab ? ' is-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {config.tabs[tab]}
              </button>
            ))}
          </div>}

          <MetricStrip metrics={config.metrics} />

          <div className="workspace-content-grid">
            <section
              className="workspace-focus"
              id="dashboard-view-panel"
              role="tabpanel"
              aria-labelledby={`workspace-tab-${activeTab}`}
            >
              <div className="workspace-panel-heading">
                <div>
                  <h2>{activeSection === 'overview' ? (activeTab === 'overview' ? focusTitle : selectedTabTitle) : selectedTabTitle}</h2>
                  <p>{activeSection === 'overview' && activeTab === 'overview' ? focusSubtitle : config.description}</p>
                </div>
                <Link href={activeTab === 'activity' ? '/messages' : '/deals'} aria-label="Open full details"><ArrowRight size={16} /></Link>
              </div>

              {activeSection !== 'overview' ? (
                <TaskList items={config.workItems} />
              ) : activeTab === 'activity' ? (
                <ActivityList items={config.activity} />
              ) : activeTab === 'work' ? (
                <TaskList items={config.workItems} />
              ) : currentUser.personaKey === 'COMPANY_HEAD' ? (
                <BranchPortfolio />
              ) : currentUser.personaKey === 'SALES_REP_B' ? (
                <div className="workspace-empty-panel">
                  <span className="empty-icon"><LockKeyhole size={19} /></span>
                  <strong>No deal rooms are assigned to this account.</strong>
                  <p>Access follows deal ownership. Browse active briefs or ask your workspace lead to assign a collaboration.</p>
                  <Link href="/feed">Browse creator index <ArrowRight size={14} /></Link>
                </div>
              ) : currentUser.personaKey === 'PLATFORM_ADMIN' ? (
                <TaskList items={config.workItems} />
              ) : (
                <div className="deal-focus">
                  <div className="deal-focus-status"><span className="deal-focus-logo">AM</span><span><strong>{focusTitle}</strong><small>{focusSubtitle}</small></span><span className="deal-focus-state"><i />In progress</span></div>
                  <div className="deal-focus-steps">
                    {contract.milestones.map((milestone, index) => {
                      const done = milestone.status === 'APPROVED' || milestone.status === 'PAID';
                      const submitted = milestone.status === 'SUBMITTED';
                      return (
                        <div className={`deal-focus-step${done ? ' is-done' : ''}${submitted ? ' is-current' : ''}`} key={milestone.id}>
                          <span className="deal-step-mark">{done ? <Check size={12} /> : index + 1}</span>
                          <span><strong>{milestone.title}</strong><small>Due {new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></span>
                          <span className="deal-step-amount">{formatCurrency(milestone.amount, contract.currency)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="deal-focus-footer">
                    <span><LockKeyhole size={14} /> Terms and messages stay attached to this deal.</span>
                    <Link href="/deals/contract_nike_rohan_001">Open agreement <ArrowRight size={13} /></Link>
                  </div>
                </div>
              )}
            </section>

            <aside className="workspace-rail">
              <section className="workspace-rail-section">
                <h2>{currentUser.personaKey === 'COMPANY_HEAD' ? 'Organization' : currentUser.personaKey === 'PLATFORM_ADMIN' ? 'Review tools' : 'Next step'}</h2>
                <div className="workspace-rail-panel">
                  {currentUser.personaKey === 'COMPANY_HEAD' ? (
                    <>
                      <strong>{SEED_ORGANIZATION.tradeName}</strong>
                      <p>{SEED_BRANCHES.length} regional teams · pooled budget {formatCurrency(SEED_ORGANIZATION.billingPoolBalance)}</p>
                      <Link href="/enterprise/dashboard">View governance <ArrowRight size={13} /></Link>
                    </>
                  ) : currentUser.personaKey === 'PLATFORM_ADMIN' ? (
                    <>
                      <strong>Verification review</strong>
                      <p>Check identity submissions and keep the audit record complete.</p>
                      <Link href="/onboarding/verify">Open verification <ArrowRight size={13} /></Link>
                    </>
                  ) : currentUser.personaKey === 'SALES_REP_B' ? (
                    <>
                      <strong>No assigned conversations</strong>
                      <p>Deal-room access is limited to the assigned owner and permitted roles.</p>
                      <Link href="/feed">Explore creators <ArrowRight size={13} /></Link>
                    </>
                  ) : (
                    <>
                      <strong>{currentUser.personaKey === 'TALENT_MANAGER' ? 'Video draft review' : 'Review submitted video draft'}</strong>
                      <p>Due Nov 12 · review window is 48 hours after submission.</p>
                      <Link href="/messages">Open deal room <ArrowRight size={13} /></Link>
                    </>
                  )}
                </div>
              </section>

              <section className="workspace-rail-section">
                <h2>{currentUser.personaKey === 'PLATFORM_ADMIN' ? 'Published cases' : 'Recent activity'}</h2>
                <div className="workspace-recent">
                  {config.activity.length ? config.activity.slice(0, 3).map((item, index) => (
                    <div className="workspace-recent-row" key={`${item.title}-${index}`}>
                      <span className="recent-mark">{index === 0 ? <CircleCheck size={14} /> : <span />}</span>
                      <span><strong>{item.title}</strong><small>{item.time}</small></span>
                    </div>
                  )) : (
                    <p className="workspace-empty-compact">No recent messages for this account.</p>
                  )}
                </div>
              </section>

              <div className="workspace-security-note">
                <ShieldCheck size={16} />
                <span><strong>Role-aware workspace</strong><small>Views and deal access follow the selected demo account.</small></span>
              </div>
            </aside>
          </div>
          <p className="workspace-demo-note">Demo workspace · sample campaign and contract data from the project seed records.</p>
        </main>
      </div>
    </div>
  );
}
