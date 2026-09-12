import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-md bg-surface-2 px-4 text-base text-foreground shadow-border",
        "placeholder:text-subtle",
        "transition-shadow duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "font-mono tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
