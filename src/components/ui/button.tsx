import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground shadow-md shadow-secondary/15 hover:bg-secondary/90",
  outline:
    "border border-border bg-background/80 hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground",
  gradient:
    "bg-gradient-to-l from-primary to-accent text-white shadow-lg shadow-primary/25 hover:opacity-95",
} as const;

export type ButtonVariant = keyof typeof variants;

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: "default" | "lg" | "icon";
  }
>(function Button(
  { className, variant = "primary", size = "default", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-11 min-w-[2.75rem] cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        size === "lg" && "min-h-14 px-8 text-lg rounded-2xl",
        size === "default" && "px-5 py-2.5 text-base",
        size === "icon" && "h-11 w-11 p-0",
        className,
      )}
      {...props}
    />
  );
});
