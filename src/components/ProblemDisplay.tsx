"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import type { ProblemDetails } from "@/types/http";

interface ProblemDisplayProps {
  problem: ProblemDetails;
  context?: string;
}

/**
 * ProblemDisplay
 * ---------------
 * A polished UI component for showing structured ProblemDetails
 * returned from the backend. Displays title, description, and correlation ID
 * with a convenient "Copy correlation ID" button.
 */
export default function ProblemDisplay({
  problem,
  context,
}: ProblemDisplayProps) {
  const { title, detail, status, code, correlationId } = problem;

  const handleCopy = async () => {
    if (!correlationId) return;
    try {
      await navigator.clipboard.writeText(correlationId);
      toast.success("Correlation ID copied to clipboard");
    } catch {
      toast.error("Failed to copy correlation ID");
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-destructive">
          {context ? `${context} Error` : "Error"}
        </h2>
        {status && (
          <span className="text-sm text-muted-foreground">HTTP {status}</span>
        )}
      </div>

      <p className="text-sm text-foreground mb-2">
        {title ?? "An unexpected error occurred."}
      </p>

      {detail && (
        <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">
          {detail}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border pt-3 mt-3 gap-2">
        {code !== undefined && (
          <span className="text-xs text-muted-foreground">Code: {code}</span>
        )}
        {correlationId && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <CopyIcon size={14} />
            Copy correlation ID
          </button>
        )}
      </div>
    </div>
  );
}
