"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { registerLeadAction, type ActionState } from "./actions";

const INITIAL_STATE: ActionState = { status: "idle" };

export default function HomePage() {
  const [state, formAction] = useFormState(registerLeadAction, INITIAL_STATE);
  const [visibleMessage, setVisibleMessage] = useState<ActionState>(state);

  useEffect(() => {
    if (state.status === "success") {
      setVisibleMessage(state);
    } else if (state.status === "error") {
      setVisibleMessage(state);
    }
  }, [state]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 px-4 py-16 text-slate-100">
      <div className="w-full max-w-3xl space-y-10">
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">
            WhatsApp Lead Registration Agent
          </h1>
          <p className="text-slate-300">
            Capture lead details and instantly trigger a WhatsApp message with
            a custom response. Perfect for confirming registrations or sending
            onboarding information right after form submission.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/60 backdrop-blur">
          <LeadForm
            action={formAction}
            state={visibleMessage}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ul className="list-disc space-y-2 pl-6 text-slate-300">
            <li>
              Configure your WhatsApp Business credentials via environment
              variables `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.
            </li>
            <li>
              Enter the prospect&apos;s name, phone number, optional email, and
              customize the message you want to send.
            </li>
            <li>
              Submit the form to immediately dispatch a WhatsApp message using
              Meta&apos;s Cloud API.
            </li>
          </ul>
          <p className="text-sm text-slate-500">
            Need help? Review the{" "}
            <Link
              href="https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages"
              className="font-medium underline decoration-dotted underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Cloud API docs
            </Link>{" "}
            for guidance on generating your permanent access token and phone
            number ID.
          </p>
        </section>
      </div>
    </main>
  );
}

type LeadFormProps = {
  action: (payload: FormData) => void;
  state: ActionState;
};

function LeadForm({ action, state }: LeadFormProps) {
  return (
    <form
      action={action}
      className="space-y-6"
    >
      <FormContents state={state} />
    </form>
  );
}

function FormContents({ state }: { state: ActionState }) {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Full name"
          name="fullName"
          placeholder="Alexa Johnson"
          error={state.status === "error" ? state.fieldErrors?.fullName?.[0] : undefined}
          disabled={pending}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="alexa@example.com"
          error={state.status === "error" ? state.fieldErrors?.email?.[0] : undefined}
          disabled={pending}
        />
      </div>

      <FormField
        label="WhatsApp phone number"
        name="phoneNumber"
        placeholder="+15551234567"
        helper="Include country code. The number must have opted-in to receive messages."
        error={state.status === "error" ? state.fieldErrors?.phoneNumber?.[0] : undefined}
        disabled={pending}
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-200"
        >
          Message content
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Hi! Thanks for registering. Here’s what happens next…"
          className="min-h-[160px] w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base text-slate-100 shadow-inner outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/60 disabled:opacity-60"
          disabled={pending}
          required
        />
        {state.status === "error" && state.fieldErrors?.message?.[0] ? (
          <p className="text-sm text-rose-400">
            {state.fieldErrors.message[0]}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Craft a personalized reply. Leads receive this text immediately on
            WhatsApp.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        {pending && <span className="text-sm text-slate-400">Sending…</span>}
      </div>

      <FormStatusBanner state={state} />
    </div>
  );
}

type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
};

function FormField({
  label,
  name,
  error,
  helper,
  required,
  disabled,
  placeholder,
  type = "text"
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-200"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/60 disabled:opacity-60"
      />
      {error ? (
        <p className="text-sm text-rose-400">{error}</p>
      ) : helper ? (
        <p className="text-sm text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-brand-dark disabled:opacity-70"
    >
      Send WhatsApp Message
    </button>
  );
}

function FormStatusBanner({ state }: { state: ActionState }) {
  if (state.status === "idle") return null;

  const isError = state.status === "error";
  const toneClasses = isError
    ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
    : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${toneClasses}`}>
      <p>{state.message}</p>
      {state.status === "success" && state.requestId ? (
        <p className="mt-1 text-xs text-emerald-200/70">
          Reference ID: {state.requestId}
        </p>
      ) : null}
    </div>
  );
}
