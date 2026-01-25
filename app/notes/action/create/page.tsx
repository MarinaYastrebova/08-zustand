import type { Metadata } from 'next';
import CreateNote from '@/components/CreateNote/CreateNote';

export const metadata: Metadata = {
  title: 'Create Note - NoteHub',
  description: 'Create a new note in NoteHub. Organize your thoughts and tasks efficiently.',
  openGraph: {
    title: 'Create Note - NoteHub',
    description: 'Create a new note in NoteHub. Organize your thoughts and tasks efficiently.',
    url: 'https://08-zustand-theta-three.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - Create Note',
      },
    ],
    type: 'website',
  },
};

export default function CreateNotePage() {
  return <CreateNote />;
}
