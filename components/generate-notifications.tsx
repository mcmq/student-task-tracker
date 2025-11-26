"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from "react";

export function GenerateNotifications({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="flex justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh Notifications
      </Button>
    </div>
  );
}
