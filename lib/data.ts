import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-content.json');

export type Page = {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  content?: string;
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
  colors: Record<string, string>;
  navigation: Record<string, { label: string; slug: string }[]>;
  pages: Page[];
  blogPosts: BlogPost[];
  siteContent: {
    hero: { title: string; subtitle: string; cta: string };
    trustSignals: Record<string, string>;
    footer: { description: string; copyright: string };
  };
};

let cache: SiteContent | null = null;

export async function getData(): Promise<SiteContent> {
  if (cache) return cache;
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  cache = JSON.parse(raw);
  return cache!;
}

export async function saveData(data: SiteContent): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  cache = data;
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
