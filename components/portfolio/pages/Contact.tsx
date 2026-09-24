"use client";

import { useState } from "react";
import { Mail, MapPin, Link2, GitFork, GraduationCap, Send, CheckCircle, MessageSquare } from "lucide-react";
import { profile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-(color:--site-top) via-(color:--site-top-mid) to-(color:--site-top) py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
              <MessageSquare size={18} className="text-cyan-400" />
            </div>
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Connect</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-5 leading-tight">
            Get in<br /><span className="italic text-cyan-300">Touch</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
            Open to research collaborations, academic discussions, professional inquiries, and consulting opportunities.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left contact info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-serif text-xl text-slate-900 mb-4">Contact Information</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Open to research collaborations, academic discussions, professional inquiries, and project consultations.
              </p>
            </div>

            <div className="space-y-4">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <p className="text-slate-800 text-sm font-medium group-hover:text-blue-600 transition-colors">{profile.email}</p>
                </div>
              </a>

              <Card variant="site-white-card" className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Location</p>
                  <p className="text-slate-800 text-sm font-medium">{profile.location}</p>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 text-sm">Follow & Connect</h4>
              {[
                { label: "LinkedIn", href: profile.linkedin, Icon: Link2, color: "text-blue-600 hover:bg-blue-50 hover:border-blue-200" },
                { label: "Google Scholar", href: profile.scholar, Icon: GraduationCap, color: "text-teal-600 hover:bg-teal-50 hover:border-teal-200" },
                { label: "GitHub", href: profile.github, Icon: GitFork, color: "text-slate-700 hover:bg-slate-100 hover:border-slate-300" },
              ].map(({ label, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-100 text-sm font-medium transition-all ${color}`}
                >
                  <Icon size={16} /> {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Contact form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="font-serif text-2xl text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500">Thank you for reaching out. I&apos;ll respond within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label variant="site-label" className="mb-2">Your Name *</Label>
                    <Input variant="site-field"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label variant="site-label" className="mb-2">Email Address *</Label>
                    <Input variant="site-field"
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label variant="site-label" className="mb-2">Subject *</Label>
                  <Input variant="site-field"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full"
                    placeholder="Research Collaboration / Inquiry"
                  />
                </div>

                <div>
                  <Label variant="site-label" className="mb-2">Message *</Label>
                  <Textarea variant="site-field"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none"
                    placeholder="Write your message..."
                  />
                </div>

                <Button variant="site-primary"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 transition-all shadow-sm hover:shadow-md"
                >
                  <Send size={16} /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
