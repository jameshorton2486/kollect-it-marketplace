"use client";

import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (f: FormState) => {
    const e: Partial<FormState> = {};
    if (!f.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Valid email required';
    if (!f.subject.trim()) e.subject = 'Subject is required';
    if (f.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try {
      // Example: no-op or send to an API route
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const Input = ({ id, label, type = 'text' }: { id: keyof FormState; label: string; type?: string }) => (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[var(--color-charcoal)]">{label}</label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(ev) => setForm((s) => ({ ...s, [id]: ev.target.value }))}
        className={`w-full rounded border px-3 py-2 outline-none ${errors[id] ? 'border-red-500' : 'border-[var(--color-border)]'}`}
        aria-invalid={errors[id] ? 'true' : undefined}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {errors[id] && <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{errors[id]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="rounded border border-[var(--color-gray-light)] bg-cream p-6">
      {sent ? (
        <div className="text-center">
          <h3 className="font-serif text-2xl text-brand-navy">Message sent</h3>
          <p className="mt-2 text-[var(--color-charcoal)]">We\'ll get back to you shortly.</p>
        </div>
      ) : (
        <>
          <Input id="name" label="Name *" />
          <Input id="email" label="Email *" type="email" />
          <Input id="subject" label="Subject *" />
          <div className="mb-4">
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-[var(--color-charcoal)]">Message *</label>
            <textarea
              id="message"
              rows={6}
              maxLength={500}
              value={form.message}
              onChange={(ev) => setForm((s) => ({ ...s, message: ev.target.value }))}
              className={`w-full rounded border px-3 py-2 outline-none ${errors.message ? 'border-red-500' : 'border-[var(--color-border)]'}`}
              aria-invalid={errors.message ? 'true' : undefined}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            <div className="mt-1 text-right text-xs text-[var(--color-gray-dark)]">{form.message.length} / 500</div>
            {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>
          <button type="submit" className="btn-cta w-full" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </>
      )}
    </form>
  );
}
