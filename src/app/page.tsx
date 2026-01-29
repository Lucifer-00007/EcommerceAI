// Root page component
// Redirects to the home page

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/');
}
