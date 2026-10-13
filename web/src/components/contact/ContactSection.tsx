"use client";

import React, { useState } from "react";
import { ContactContent, ProfileContent } from "@/types/content";
import { Send, CheckCircle2, AlertCircle, Mail, Github, MapPin, ArrowUpRight } from "lucide-react";

interface ContactSectionProps {
  content: ContactContent;
  profile: ProfileContent;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  content,
  profile,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusState, setStatusState] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Please enter your name (at least 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatusState("idle");
    setServerMessage("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusState("success");
        setServerMessage(data.message || content.form.successMessage);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatusState("error");
        setServerMessage(data.message || content.form.errorMessage);
      }
    } catch {
      setStatusState("error");
      setServerMessage(
        "Could not reach backend signal. You can also reach me directly at mohn4560@gmail.com."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-36 relative bg-signal-bg/75 backdrop-blur-[2px] border-t border-signal-border/30 overflow-hidden"
      aria-label="Contact Section"
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-signal-teal/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Big Closing CTA Headline Banner */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
          <span className="font-mono text-xs tracking-[0.25em] text-signal-lime uppercase mb-4 inline-block">
            {"// CLOSING CALL TO ACTION"}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            {content.closingCta}
          </h2>
          <a
            href="#contact-form"
            className="inline-flex items-center px-8 py-4 rounded-full font-mono text-sm tracking-widest uppercase font-bold text-signal-bg bg-signal-teal hover:bg-signal-lime hover:shadow-glowLime transition-all duration-300"
          >
            <span>{content.ctaButton}</span>
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </a>
        </div>

        {/* Contact Grid: Info & Form */}
        <div
          id="contact-form"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Left: Message & Direct Links (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                {content.heading}
              </h3>
              <p className="font-body text-base sm:text-lg text-signal-mist/90 leading-relaxed font-normal">
                {content.text}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-signal-border/40 font-mono text-xs">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center space-x-3 text-signal-mist hover:text-signal-teal transition-colors p-3 rounded-lg border border-signal-border/50 bg-signal-card/60"
              >
                <Mail className="w-4 h-4 text-signal-teal shrink-0" />
                <span>{profile.email}</span>
              </a>

              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-signal-mist hover:text-signal-teal transition-colors p-3 rounded-lg border border-signal-border/50 bg-signal-card/60"
              >
                <Github className="w-4 h-4 text-signal-lime shrink-0" />
                <span>github.com/{profile.handle}</span>
              </a>

              <div className="flex items-center space-x-3 text-signal-dim p-3 rounded-lg border border-signal-border/20 bg-signal-subtle/30">
                <MapPin className="w-4 h-4 text-signal-dim shrink-0" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Right: Validated Form Wired to POST /contact (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-signal-border/70 bg-signal-card/90 p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs tracking-wider uppercase text-signal-mist mb-2"
                  >
                    {content.form.fields.name.label} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={content.form.fields.name.placeholder}
                    className={`w-full rounded-lg border bg-signal-subtle/70 px-4 py-3 font-mono text-sm text-white placeholder-signal-dim/60 focus:outline-none transition-colors ${
                      formErrors.name
                        ? "border-red-400 focus:ring-1 focus:ring-red-400"
                        : "border-signal-border focus:border-signal-teal focus:ring-1 focus:ring-signal-teal"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 font-mono text-xs text-red-400">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs tracking-wider uppercase text-signal-mist mb-2"
                  >
                    {content.form.fields.email.label} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={content.form.fields.email.placeholder}
                    className={`w-full rounded-lg border bg-signal-subtle/70 px-4 py-3 font-mono text-sm text-white placeholder-signal-dim/60 focus:outline-none transition-colors ${
                      formErrors.email
                        ? "border-red-400 focus:ring-1 focus:ring-red-400"
                        : "border-signal-border focus:border-signal-teal focus:ring-1 focus:ring-signal-teal"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1.5 font-mono text-xs text-red-400">{formErrors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs tracking-wider uppercase text-signal-mist mb-2"
                  >
                    {content.form.fields.message.label} *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={content.form.fields.message.placeholder}
                    className={`w-full rounded-lg border bg-signal-subtle/70 px-4 py-3 font-mono text-sm text-white placeholder-signal-dim/60 focus:outline-none transition-colors resize-y ${
                      formErrors.message
                        ? "border-red-400 focus:ring-1 focus:ring-red-400"
                        : "border-signal-border focus:border-signal-teal focus:ring-1 focus:ring-signal-teal"
                    }`}
                  />
                  {formErrors.message && (
                    <p className="mt-1.5 font-mono text-xs text-red-400">{formErrors.message}</p>
                  )}
                </div>

                {/* Submission Feedback */}
                {statusState === "success" && (
                  <div className="flex items-start space-x-3 p-4 rounded-lg bg-signal-lime/10 border border-signal-lime/30 text-signal-lime font-mono text-xs">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{serverMessage}</span>
                  </div>
                )}

                {statusState === "error" && (
                  <div className="flex items-start space-x-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{serverMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg bg-signal-teal text-signal-bg font-mono text-xs font-bold tracking-widest uppercase hover:bg-signal-lime hover:shadow-glowLime transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-lime"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? content.form.submittingLabel
                      : content.form.submitLabel}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
