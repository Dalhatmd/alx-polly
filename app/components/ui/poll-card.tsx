import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Poll } from '@/app/lib/types';

/**
 * Props interface for the PollCard component
 * Defines the structure of poll data required for display
 */
interface PollCardProps {
  poll: {
    id: string;
    title: string;
    description?: string;
    options: any[];
    votes?: number;
    createdAt: string | Date;
  };
}

/**
 * Displays a poll in a card format with title, description, and vote statistics
 * Provides navigation to poll details when clicked
 * @param poll - Poll data object containing title, options, votes, and creation date
 * @returns Styled card component linking to poll details page
 */
export function PollCard({ poll }: PollCardProps) {
  // Calculate total votes from either direct votes count or sum of option votes
  const totalVotes = poll.votes || poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  
  // Format creation date for display, handling both string and Date types
  const formattedDate = typeof poll.createdAt === 'string' 
    ? new Date(poll.createdAt).toLocaleDateString() 
    : poll.createdAt.toLocaleDateString();

  return (
    <Link href={`/polls/${poll.id}`} className="group block h-full">
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="group-hover:text-blue-600 transition-colors">{poll.title}</CardTitle>
          {poll.description && <CardDescription>{poll.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500">
            <p>{poll.options.length} options</p>
            <p>{totalVotes} total votes</p>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-slate-400">
          Created on {formattedDate}
        </CardFooter>
      </Card>
    </Link>
  );
}