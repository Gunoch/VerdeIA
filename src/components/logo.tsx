import { cn } from "@/lib/utils";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo da VerdeAI"
    >
      <circle cx="50" cy="50" r="45" fill="hsl(var(--primary))" />
      {/* Stylized Leaf/V */}
      <path
        d="M50 25 C 65 40, 65 60, 50 75 C 35 60, 35 40, 50 25 Z"
        fill="hsl(var(--primary-foreground))"
        transform="scale(0.9) translate(0, -2)"
        transformOrigin="center"
      />
      <path
        d="M50 40 L50 72"
        stroke="hsl(var(--primary))"
        strokeWidth="6"
        strokeLinecap="round"
      />
       <path
        d="M50 48 L62 58"
        stroke="hsl(var(--primary))"
        strokeWidth="5"
        strokeLinecap="round"
      />
       <path
        d="M50 48 L38 58"
        stroke="hsl(var(--primary))"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
