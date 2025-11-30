import { toast } from "sonner";
import type { ProblemDetails } from "@/types/http";

export function showProblem(problem: ProblemDetails) {
  const errorsObj = (problem as ProblemDetails).errors;

  if (errorsObj && typeof errorsObj === "object") {
    const messages: string[] = [];

    for (const key of Object.keys(errorsObj)) {
      const fieldErrors = errorsObj[key];
      if (Array.isArray(fieldErrors)) {
        for (const message of fieldErrors) {
          messages.push(`${key}: ${message}`);
        }
      }
    }

    return toast.error(problem.title ?? "Validation Error", {
      description: messages.join("\n"),
    });
  }

  toast.error(problem.title ?? "Error", {
    description: problem.detail ?? "An unexpected error occurred.",
  });
}

export function showError(error: string) {
  toast.error("Error", {
    description: error ?? "An unexpected error occurred.",
  });
}

export function showSuccess(message: string, description?: string) {
  toast.success(message, { description });
}

export function showInfo(message: string, description?: string) {
  toast.info(message, { description });
}
