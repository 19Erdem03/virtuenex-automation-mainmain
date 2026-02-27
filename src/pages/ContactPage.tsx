import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Calendar, Loader2, Terminal, Braces, Cpu } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import FAQ from '../components/FAQ';

function CalendlyEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const tryInit = () => {
      if ((window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: 'https://calendly.com/erdemerolsuer/virtuenex?background_color=fa4997&primary_color=e4cc25',
          parentElement: el,
        });
      }
    };

    tryInit();

    const observer = new MutationObserver(() => tryInit());
    observer.observe(document.head, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden"
      style={{ minWidth: 320, height: 700 }}
    />
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', teamSize: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('https://hook.eu2.make.com/p2c5rw51yy4s1evqd8gjqmd8hkt7yano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', company: '', teamSize: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 radial-glow-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 rounded-full bg-gold-500 blur-[150px] opacity-[0.07]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-sm text-gold-400 mb-6">
              <Terminal className="w-3.5 h-3.5" />
              Get In Touch
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gold-500">Let&apos;s Build</span>{' '}
              <span className="text-white">Your AI System</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Book a free discovery call and we&apos;ll show you exactly how VirtueNex
              can automate 2+ hours of your team&apos;s daily workload.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <div className="glass-card glow-border p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gold-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Schedule a Discovery Call</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    A 15-minute, no-pressure conversation about your team&apos;s workflow
                    and where AI can save you the most time.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {['Free workflow audit', 'Custom automation roadmap', 'ROI projection for your team'].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <CalendlyEmbed />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Cpu, label: 'AI-First', detail: 'Custom built' },
                    { icon: Braces, label: 'API-Ready', detail: 'Full integration' },
                    { icon: Terminal, label: 'Dev-Ops', detail: 'Managed for you' },
                  ].map((item) => (
                    <div key={item.label} className="glass-card p-4 text-center hover:bg-white/[0.06] transition-all duration-300">
                      <item.icon className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="glass-card glow-border p-7 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">sys.contact.init()</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                      full_name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                      className="input-field font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                      email_address
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@realestate.com"
                      required
                      className="input-field font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                      phone_number
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="input-field font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                      company_name
                    </label>
                    <input
                      type="text"
                      id="contact-company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Realty"
                      required
                      className="input-field font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="contact-team" className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                    team_size
                  </label>
                  <select
                    id="contact-team"
                    name="teamSize"
                    value={form.teamSize}
                    onChange={handleChange}
                    required
                    className="input-field font-mono text-sm appearance-none"
                  >
                    <option value="" className="bg-black">Select team size</option>
                    <option value="1-5" className="bg-black">1-5 agents</option>
                    <option value="6-15" className="bg-black">6-15 agents</option>
                    <option value="16-50" className="bg-black">16-50 agents</option>
                    <option value="50+" className="bg-black">50+ agents</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="contact-message" className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                    message_body
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What's your biggest daily time drain? What CRM do you use?"
                    rows={4}
                    required
                    className="input-field font-mono text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full btn-gradient inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-white disabled:opacity-70 rounded-xl"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-mono text-sm">transmitting...</span>
                    </>
                  ) : status === 'sent' ? (
                    <span className="font-mono text-sm">transmission_complete // we&apos;ll be in touch</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
