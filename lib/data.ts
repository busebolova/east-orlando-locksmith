import { promises as fs } from 'fs';
import path from 'path';
import { syncToGitHub, readFromGitHub, writeToGitHub } from '@/lib/github-sync';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-content.json');

/** Vercel's production filesystem is read-only — detect it via EROFS-prone env. */
function isReadOnlyFs(): boolean {
  return (
    process.env.VERCEL === '1' &&
    process.env.NODE_ENV === 'production'
  );
}

export type PageFaqItem = {
  question: string;
  answer: string;
};

export type PageSections = {
  introEyebrow?: string;
  introHeading?: string;
  introText?: string;
  problemHeading?: string;
  problemText?: string;
  solutionHeading?: string;
  solutionText?: string;
  localEyebrow?: string;
  localHeading?: string;
  localText?: string;
  detailEyebrow?: string;
  detailHeading?: string;
  detailList?: string[];
  trustEyebrow?: string;
  trustHeading?: string;
  trustText?: string;
  trustBadges?: string[];
  faqEyebrow?: string;
  faqHeading?: string;
  faqItems?: PageFaqItem[];
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaText?: string;
};

export type Page = {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  content?: string;
  sections?: PageSections;
  seoKeywords?: string;
  location?: string;
  service?: string;
  brand?: string;
  zip?: string;
  published: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  date: string;
};

export type SiteContent = {
  siteName: string;
  phone: string;
  phoneRaw: string;
  address: string;
  email: string;
  hours: string;
  googleRating: string;
  reviewCount: string;
  serviceArea: string;
  headerLogo?: string;
  headerLogoWidth?: number;
  headerLogoHeight?: number;
  favicon?: string;
  colors: Record<string, string>;
  navigation: Record<string, { label: string; slug: string }[]>;
  pages: Page[];
  blogPosts: BlogPost[];
  maintenanceMode?: boolean;
  googleAnalyticsId?: string;
  googleSearchConsoleVerification?: string;
  siteContent: {
    hero: { title: string; subtitle: string; cta: string };
    trustSignals: Record<string, string>;
    footer: { description: string; copyright: string };
    homepage: HomepageSections;
  };
};

export type HomepageHeroImage = {
  src: string;
  alt: string;
};

export type HomepageTrustItem = {
  text: string;
};

export type HomepageServiceCard = {
  icon: string; // SVG path
  title: string;
  description: string;
  features: string[];
  link: string;
};

export type HomepageTrustCard = {
  icon: string;
  title: string;
  description: string;
};

export type HomepageReview = {
  name: string;
  text: string;
  source: string;
  location: string;
};

export type HomepageBrand = {
  name: string;
};

export type HomepageFaq = {
  question: string;
  answer: string;
};

export type HomepageSections = {
  pill: string;
  heading: string;
  heroImage: HomepageHeroImage;
  trustItems: HomepageTrustItem[];
  priorityEyebrow: string;
  priorityHeading: string;
  priorityText: string;
  servicePoints: {
    icon: string;
    title: string;
    subtitle: string;
    link: string;
  }[];
  servicesEyebrow: string;
  servicesHeading: string;
  servicesText: string;
  serviceCards: HomepageServiceCard[];
  trustEyebrow: string;
  trustHeading: string;
  trustText: string;
  trustCards: HomepageTrustCard[];
  areasEyebrow: string;
  areasHeading: string;
  areasText: string;
  extraAreas: string[];
  responseEyebrow: string;
  responseHeading: string;
  timeline: { title: string; description: string }[];
  reviewsEyebrow: string;
  reviewsHeading: string;
  reviews: HomepageReview[];
  brandsEyebrow: string;
  brandsHeading: string;
  brandsText: string;
  brands: HomepageBrand[];
  faqEyebrow: string;
  faqHeading: string;
  faq: HomepageFaq[];
  ctaEyebrow: string;
  ctaHeading: string;
  ctaText: string;
};

let cache: SiteContent | null = null;

export async function getData(): Promise<SiteContent> {
  if (cache) return cache;

  if (isReadOnlyFs()) {
    // Vercel production — read from GitHub API instead
    const raw = await readFromGitHub();
    if (raw) {
      cache = JSON.parse(raw);
      return cache!;
    }
    // fall through to local read (shouldn't happen on Vercel, but be safe)
  }

  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  cache = JSON.parse(raw);
  return cache!;
}

export async function saveData(data: SiteContent): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  if (isReadOnlyFs()) {
    // Vercel production — can't write local file, push directly to GitHub
    await writeToGitHub(json);
    cache = data;
    return;
  }

  await fs.writeFile(DATA_FILE, json, 'utf-8');
  cache = data;
  syncToGitHub().catch(() => {});
}

export async function getPages(): Promise<Page[]> {
  const data = await getData();
  return data.pages;
}

export async function getPage(slug: string): Promise<Page | undefined> {
  const pages = await getPages();
  return pages.find((p) => p.slug === slug);
}

export async function savePage(slug: string, updates: Partial<Page>): Promise<Page> {
  const data = await getData();
  const idx = data.pages.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error(`Page not found: ${slug}`);
  data.pages[idx] = { ...data.pages[idx], ...updates };
  await saveData(data);
  return data.pages[idx];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await getData();
  return data.blogPosts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function saveBlogPost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  const data = await getData();
  const idx = data.blogPosts.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error(`Blog post not found: ${slug}`);
  data.blogPosts[idx] = { ...data.blogPosts[idx], ...updates };
  await saveData(data);
  return data.blogPosts[idx];
}

export async function createBlogPost(post: BlogPost): Promise<BlogPost> {
  const data = await getData();
  data.blogPosts.push(post);
  await saveData(data);
  return post;
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const data = await getData();
  data.blogPosts = data.blogPosts.filter((p) => p.slug !== slug);
  await saveData(data);
}

export async function getSiteInfo() {
  const data = await getData();
  return {
    siteName: data.siteName,
    phone: data.phone,
    phoneRaw: data.phoneRaw,
    address: data.address,
    email: data.email,
    hours: data.hours,
    serviceArea: data.serviceArea,
    siteContent: data.siteContent,
  };
}

export async function updateSiteInfo(updates: Record<string, unknown>): Promise<void> {
  const data = await getData();
  Object.assign(data, updates);
  await saveData(data);
}
