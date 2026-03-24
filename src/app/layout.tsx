import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ResuMate — AI-Powered Resume Builder',
  description: 'Build professional resumes in minutes with 9 premium templates, AI-powered job matching, and real-time preview. Free to start.',
  keywords: 'resume builder, AI resume, professional resume, resume templates, ATS resume, ResuMate',
  openGraph: {
    title: 'ResuMate — AI-Powered Resume Builder',
    description: 'Build professional resumes in minutes with AI-powered job matching.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
