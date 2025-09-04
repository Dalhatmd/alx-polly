import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deletePoll } from "@/app/lib/actions/poll-actions";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from '@/lib/auth/admin';
import { AdminPageClient } from './AdminPageClient';

interface Poll {
  id: string;
  question: string;
  user_id: string;
  created_at: string;
  options: string[];
}

export default async function AdminPage() {
  // Server-side admin check
  const isAdmin = await isCurrentUserAdmin();
  
  if (!isAdmin) {
    redirect('/polls?error=access-denied');
  }

  // Fetch all polls on server side
  const supabase = await createClient();
  const { data: polls, error } = await supabase
    .from("polls")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error('Error fetching polls:', error);
    return (
      <div className="p-6">
        <div className="text-red-600">Error loading polls: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          View and manage all polls in the system.
        </p>
      </div>
      <AdminPageClient initialPolls={polls || []} />
    </div>
  );
}
