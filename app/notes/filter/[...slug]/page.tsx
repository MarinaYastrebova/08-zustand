import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchNotes, FetchNotesParams } from '@/lib/api';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0]?.toLowerCase() || 'all';

  const tagTitle =
    tag === 'all'
      ? 'All Notes'
      : tag
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

  return {
    title: `${tagTitle} - NoteHub`,
    description: `View and manage your ${tagTitle.toLowerCase()} in NoteHub. Stay organized and productive.`,
    openGraph: {
      title: `${tagTitle} - NoteHub`,
      description: `View and manage your ${tagTitle.toLowerCase()} in NoteHub. Stay organized and productive.`,
      url: `https://08-zustand-theta-three.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tagTitle}`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function NotesByTag({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0];
  const tagFilter = tag === 'all' ? undefined : tag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tagFilter, 1],
    queryFn: () => {
      const queryParams: FetchNotesParams = { page: 1, perPage: 12 };
      if (tagFilter) queryParams.tag = tagFilter;
      return fetchNotes(queryParams);
    },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
