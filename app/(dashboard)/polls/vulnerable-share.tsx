"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Share2, Twitter, Facebook, Mail } from "lucide-react";
import { toast } from "sonner";

interface VulnerableShareProps {
  pollId: string;
  pollTitle: string;
}

export default function VulnerableShare({
  pollId,
  pollTitle,
}: VulnerableShareProps) {
  const [shareUrl, setShareUrl] = useState("");

  // Helper to sanitize pollTitle for rendering and sharing
  const sanitizeText = (text: string) => {
    // Remove script tags and encode HTML entities
    const entityMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
      '`': '&#96;'
    };
    return text.replace(/<script.*?>.*?<\/script>/gi, "").replace(/[&<>'"`]/g, (c) => entityMap[c] || c);
  };

  // Validate pollId (simple: only allow alphanumeric and dashes)
  const isValidPollId = (id: string) => /^[a-zA-Z0-9\-]+$/.test(id);

  useEffect(() => {
    // Generate the share URL only if pollId is valid
    if (isValidPollId(pollId)) {
      const baseUrl = window.location.origin;
      const pollUrl = `${baseUrl}/polls/${pollId}`;
      setShareUrl(pollUrl);
    } else {
      setShareUrl("");
    }
  }, [pollId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareOnTwitter = () => {
    const safeTitle = sanitizeText(pollTitle);
    const text = encodeURIComponent(`Check out this poll: ${safeTitle}`);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Poll: ${pollTitle}`);
    const body = encodeURIComponent(
      `Hi! I'd like to share this poll with you: ${shareUrl}`,
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share This Poll
        </CardTitle>
        <CardDescription>
          Share your poll with others to gather votes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Shareable Link
          </label>
          <div className="flex space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-sm"
              placeholder="Generating link..."
            />
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Share on social media
          </label>
          <div className="flex space-x-2">
            <Button
              onClick={shareOnTwitter}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              onClick={shareOnFacebook}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              onClick={shareViaEmail}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
