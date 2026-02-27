import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { AlertTriangle, Clock, TrendingDown, ArrowRight, CheckCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function CostOfSilence() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            The Cost of Silence
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Every Minute of Silence<br className="hidden sm:block" /> Costs You Money
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Research shows that leads contacted within 5 minutes are 21x more likely to convert.
            After that window closes, lead value drops by 80%.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Clock,
              stat: 5,
              suffix: ' min',
              label: 'The golden window to respond before a lead goes cold',
              accent: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
            },
            {
              icon: TrendingDown,
              stat: 80,
              suffix: '%',
              label: 'Drop in lead value when contacted after 5 minutes',
              accent: 'bg-red-500/10 border-red-500/20 text-red-400',
            },
            {
              icon: AlertTriangle,
              stat: 78,
              suffix: '%',
              label: 'Of buyers go with the agent who responds first',
              accent: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
            },
          ].map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 0.12}>
              <div className="glass-card p-8 text-center h-full">
                <div className={`w-12 h-12 rounded-2xl ${item.accent} border flex items-center justify-center mx-auto mb-5`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-3">
                  <AnimatedCounter target={item.stat} suffix={item.suffix} />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="glass-card glow-border p-8 sm:p-10 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  VirtueNex Responds in Under 3 Seconds
                </h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  While your competitors scramble to return calls, our AI agents are already
                  qualifying leads, answering listing questions, and booking viewings. Every
                  single time, 24 hours a day.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-500 font-medium transition-colors group"
                >
                  See how it works
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <div className="space-y-4">
                {[
                  { time: '0-3s', label: 'AI responds to inbound lead', status: 'active' },
                  { time: '10s', label: 'Lead qualified and scored', status: 'active' },
                  { time: '30s', label: 'Viewing booked or listing info sent', status: 'active' },
                  { time: '1 min', label: 'CRM updated, team notified', status: 'active' },
                ].map((step, i) => (
                  <motion.div
                    key={step.time}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <span className="text-sm font-semibold text-gold-400">{step.time}</span>
                    </div>
                    <div className="flex-1 text-sm text-gray-300">{step.label}</div>
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
