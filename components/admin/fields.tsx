import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full border border-line-strong bg-white/[0.04] px-4 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-accent/50 focus:bg-white/[0.07]";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-[13px] font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-2">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, "rounded-xl", props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-24 rounded-xl leading-relaxed", props.className)} />;
}

export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p role="status" className={cn("text-sm", ok ? "text-accent" : "text-red-300")}>
      {message}
    </p>
  );
}
