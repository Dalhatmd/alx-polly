"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deletePoll } from "@/app/lib/actions/poll-actions";

interface Poll {
  id: string;
  question: string;
  user_id: string;
  created_at: string;
  options: string[];
}

interface AdminPageClientProps {
  initialPolls: Poll[];
}

export function AdminPageClient({ initialPolls }: AdminPageClientProps) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDelete = async (pollId: string) => {
    setDeleteLoading(pollId);
    const result = await deletePoll(pollId);

    if (!result.error) {
      setPolls(polls.filter((poll) => poll.id !== pollId));
    }

    setDeleteLoading(null);
  };

  return (
    <div className="grid gap-4">
      {polls.map((poll) => (
        <Card key={poll.id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{poll.question}</CardTitle>
                <CardDescription>
                  <div className="space-y-1 mt-2">
                    <div>
                      Poll ID:{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {poll.id}
                      </code>
                    </div>
                    <div>
                      Owner ID:{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {poll.user_id}
                      </code>
                    </div>
                    <div>
                      Created:{" "}
                      {new Date(poll.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardDescription>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(poll.id)}
                disabled={deleteLoading === poll.id}
              >
                {deleteLoading === poll.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">Options:</h4>
              <ul className="list-disc list-inside space-y-1">
                {poll.options.map((option, index) => (
                  <li key={index} className="text-gray-700">
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

      {polls.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No polls found in the system.
        </div>
      )}
    </div>
  );
}

