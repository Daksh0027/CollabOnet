import { AISearchFilters } from './services';
import { CreatorProfile } from './types';

export interface ParsedSearchResponse {
  parsedFilters: AISearchFilters;
  appliedAestheticKeywords: string[];
  totalMatches: number;
  creators: Array<CreatorProfile & {
    vibeMatchScore: number;
    aiMatchReason: string;
    internalCollisionNotice?: any;
    competitorAlert?: any;
  }>;
}

export function parseNaturalLanguageQuery(prompt: string): {
  filters: AISearchFilters;
  aestheticKeywords: string[];
} {
  const p = prompt.toLowerCase();
  const filters: AISearchFilters = {
    niches: [],
  };
  const aestheticKeywords: string[] = [];

  // Niche detection
  const nicheMap: Record<string, string> = {
    fintech: 'fintech',
    tech: 'tech',
    technology: 'tech',
    fitness: 'fitness',
    workout: 'fitness',
    running: 'fitness',
    lifestyle: 'lifestyle',
    fashion: 'lifestyle',
    wellness: 'lifestyle',
    gaming: 'gaming',
    esports: 'gaming',
    finance: 'fintech',
    investing: 'fintech',
  };

  Object.entries(nicheMap).forEach(([key, niche]) => {
    if (p.includes(key) && !filters.niches!.includes(niche)) {
      filters.niches!.push(niche);
    }
  });

  // Country detection
  if (p.includes('india') || p.includes('indian')) filters.countryCode = 'IN';
  else if (p.includes('us') || p.includes('usa') || p.includes('american')) filters.countryCode = 'US';
  else if (p.includes('uk') || p.includes('london') || p.includes('british')) filters.countryCode = 'GB';
  else if (p.includes('germany') || p.includes('german') || p.includes('berlin')) filters.countryCode = 'DE';
  else if (p.includes('singapore')) filters.countryCode = 'SG';

  // Rate detection (e.g. under $2,000, < 2000, 2k, $1500)
  const rateMatch = p.match(/(?:under|below|<|max(?:imum)?)\s*\$?([0-9]+(?:,[0-9]{3})*|([0-9]+)k)/i);
  if (rateMatch) {
    if (rateMatch[2]) {
      filters.maxRate = parseInt(rateMatch[2], 10) * 1000;
    } else {
      filters.maxRate = parseInt(rateMatch[1].replace(/,/g, ''), 10);
    }
  }

  // Engagement detection (e.g. >4%, 4% engagement, 5 percent)
  const engMatch = p.match(/(?:>|above|min(?:imum)?)\s*([0-9]+(?:\.[0-9]+)?)\s*%/i) ||
                   p.match(/([0-9]+(?:\.[0-9]+)?)\s*%\s*engagement/i);
  if (engMatch) {
    filters.minEngagementRate = parseFloat(engMatch[1]) / 100;
  }

  // Format detection
  if (p.includes('60s') || p.includes('integration') || p.includes('integrated')) {
    filters.deliverableFormat = 'yt_integrated_60s';
  } else if (p.includes('reel') || p.includes('short')) {
    filters.deliverableFormat = 'ig_reel';
  } else if (p.includes('dedicated')) {
    filters.deliverableFormat = 'yt_dedicated';
  }

  // Aesthetic vibe detection
  const vibePatterns = [
    'cinematic storytelling',
    'minimalist',
    'high-energy',
    'clean aesthetic',
    'vintage film',
    'brutalist',
    'benchmark',
    'developer',
    'outdoor',
  ];

  vibePatterns.forEach((vibe) => {
    if (p.includes(vibe)) {
      aestheticKeywords.push(vibe);
    }
  });

  return { filters, aestheticKeywords };
}

export function calculateVibeMatch(
  creator: CreatorProfile,
  aestheticKeywords: string[],
  filters: AISearchFilters
): { score: number; reason: string } {
  let score = 0.75; // baseline match

  // Check vibe tags match
  if (aestheticKeywords.length > 0) {
    const matchedVibes = creator.vibeTags.filter((tag) =>
      aestheticKeywords.some((ak) => tag.toLowerCase().includes(ak.toLowerCase()))
    );
    score += matchedVibes.length * 0.1;
  }

  // Brand safety bonus
  if (creator.aiBrandSafetyScore > 95) {
    score += 0.05;
  }

  // Engagement rate bonus
  if (creator.statsCache.engagementRate > 0.05) {
    score += 0.05;
  }

  score = Math.min(0.99, Math.max(0.6, score));

  const reason = `Matches ${creator.primaryNiche.toUpperCase()} focus with ${(creator.statsCache.engagementRate * 100).toFixed(1)}% engagement; portfolio showcases ${creator.vibeTags.slice(0, 2).join(' and ')}.`;

  return {
    score: Math.round(score * 100) / 100,
    reason,
  };
}
