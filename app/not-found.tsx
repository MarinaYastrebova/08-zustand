import { Metadata } from 'next';
import Link from 'next/link';
import css from './page.module.css';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page Not Found',
    description: 'Sorry, the page you are looking for does not exist.',
    url: 'https://08-zustand-theta-three.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - Page Not Found',
      },
    ],
    type: 'website',
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.descriptionNotFound}>Sorry, the page you are looking for does not exist.</p>
      <Link href="/notes" className={css.link}>
        Go back to Notes
      </Link>
    </div>
  );
}
