import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { XCircle, CheckCircle, Clock, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
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

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-bold text-white">
      {count}{suffix}
    </span>
  );
}

const oldWay = [
  { icon: AlertTriangle, text: 'Leads sit unanswered for hours' },
  { icon: AlertTriangle, text: 'Manual CRM data entry after every call' },
  { icon: AlertTriangle, text: 'Missed calls during viewings' },
  { icon: AlertTriangle, text: 'Copy-pasting listing info repeatedly' },
];

const newWay = [
  { icon: Sparkles, text: 'Every lead gets an instant, intelligent response' },
  { icon: Sparkles, text: 'CRM updates automatically in real-time' },
  { icon: Sparkles, text: 'AI answers calls and books viewings 24/7' },
  { icon: Sparkles, text: 'Listings auto-synced across every platform' },
];

export default function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-medium text-gold-500 tracking-wide uppercase mb-4">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Your Team is Drowning in Admin Work
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Real estate agents lose up to 40% of their day on repetitive tasks that could be automated. That&apos;s time you could spend on valuations, negotiations, and closing.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-24">
          {[
            { value: 40, suffix: '%', label: 'Of agent time wasted on admin', icon: Clock },
            { value: 78, suffix: '%', label: 'Of leads lost to slow follow-up', icon: TrendingUp },
            { value: 2, suffix: 'hrs', label: 'Saved daily with VirtueNex', icon: Sparkles },
          ].map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.15}>
              <div className="glass-card glow-border p-8 text-center">
                <stat.icon className="w-6 h-6 text-gold-400 mx-auto mb-4" />
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-gray-400 text-sm mt-3">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mb-12">
          <p className="text-sm font-medium text-gold-500 tracking-wide uppercase text-center mb-4">
            Before & After
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            The Old Way vs. The VirtueNex Way
          </h3>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-8 h-full border-red-500/10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-red-400">The Old Way</h4>
              </div>
              <div className="space-y-5">
                {oldWay.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <item.icon className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                    <span className="text-gray-400">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <div className="glass-card glow-border p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gold-400" />
                </div>
                <h4 className="text-lg font-semibold text-gold-400">The VirtueNex Way</h4>
              </div>
              <div className="space-y-5">
                {newWay.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <item.icon className="w-4 h-4 text-gold-400/60 mt-0.5 shrink-0" />
                    <span className="text-gray-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
