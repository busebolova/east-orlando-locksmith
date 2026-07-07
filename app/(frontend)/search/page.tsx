import { getData } from '@/lib/data';
import { Metadata } from 'next';
import { SearchClient } from './SearchClient';

export const metadata: Metadata = {
  title: 'Search - East Orlando Locksmith',
  description: 'Search our services, locations, and resources.',
};

export default async function SearchPage() {
  const data = await getData();
  const allPages = data.pages.filter(p => p.published && p.slug !== 'index');
  const allPosts = data.blogPosts.filter(p => p.published);

  return <SearchClient pages={allPages} posts={allPosts} />;
}
