"use client";

import { useRef } from "react";
import { site } from "@/lib/site";

// No backend: the form builds a pre-filled message and opens WhatsApp (or the mail app) with it.
function compose(form) {
  const d = Object.fromEntries(new FormData(form));
  const details = [`Name: ${d.name}`, `Email: ${d.email}`, d.phone && `Phone: ${d.phone}`, d.budget && `Engagement: ${d.budget}`];
  return [`Hi ${site.name}, I found you on your portfolio.`, details.filter(Boolean).join("\n"), d.message.trim()].join("\n\n");
}

export default function ContactForm() {
  const ref = useRef(null);

  const sendWhatsApp = (e) => {
    e.preventDefault();
    window.open(`https://wa.me/${site.phone}?text=${encodeURIComponent(compose(ref.current))}`, "_blank", "noopener");
  };

  const sendEmail = () => {
    const form = ref.current;
    if (!form.reportValidity()) return;
    const subject = `Portfolio enquiry from ${form.elements.name.value}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(form))}`;
  };

  return (
    <form ref={ref} onSubmit={sendWhatsApp} className="contact-form">
      <input name="name" placeholder="Your name" required aria-label="Your name" autoComplete="name" />
      <input name="email" type="email" placeholder="Your email" required aria-label="Your email" autoComplete="email" />
      <input name="phone" type="tel" placeholder="Phone / WhatsApp (optional)" aria-label="Phone (optional)" autoComplete="tel" />
      <select name="budget" aria-label="Type of engagement" defaultValue="">
        <option value="">Type of engagement (optional)</option>
        <option>Full-time role</option>
        <option>Part-time</option>
        <option>Contract</option>
        <option>Freelance project</option>
        <option>Just saying hi</option>
      </select>
      <textarea name="message" rows={5} placeholder="What are you building?" required aria-label="Message" />
      <div className="contact-actions">
        <button className="btn btn-wa" type="submit">
          <WaIcon /> Send on WhatsApp
        </button>
        <button className="btn btn-outline" type="button" onClick={sendEmail}>
          Send by email
        </button>
      </div>
      <p className="contact-note">Opens WhatsApp or your mail app with your message ready to send.</p>
    </form>
  );
}

export function WaIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.4-1.7A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.6-8.4z" />
    </svg>
  );
}
