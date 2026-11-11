"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "@/app/admin/actions";
import { Field, FormMessage, TextInput } from "./fields";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Имэйл">
        <TextInput key={state.email} name="email" type="email" autoComplete="email" defaultValue={state.email} required />
      </Field>
      <Field label="Нууц үг">
        <TextInput name="password" type="password" autoComplete="current-password" required />
      </Field>
      <FormMessage ok={state.ok} message={state.message} />
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-linear-to-b from-accent to-accent-2 px-5 py-[11px] text-[15px] font-semibold text-accent-ink shadow-glow transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-glow-lg disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
