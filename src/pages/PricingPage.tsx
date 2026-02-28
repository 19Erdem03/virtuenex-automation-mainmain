import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, MessageSquare, BarChart2, Globe, Search, Phone, RefreshCw, Settings } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const plans = [
  {
    name: 'Starter',
    price: 600,
    bestFor: 'Small real estate teams taking their first step into AI automation.',
    features: [
      { icon: MessageSquare, text: 'Chat Agent + Agent Design' },
      { icon: BarChart2, text: 'Weekly Analytics' },
    ],
    highlighted: false,
    badge: null,
  },
  {
    name: 'Standard',
    price: 1500,
    bestFor: 'Growing agencies ready to build a complete AI-powered digital presence.',
    features: [
      { icon: Check, text: 'Everything in Starter' },
      { icon: Globe, text: 'Brand New Website with Maintenance' },
      { icon: Search, text: 'SEO & AEO Optimization' },
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Ultra',
    price: 3000,
    bestFor: 'High-volume teams and brokerages needing a full-stack AI ecosystem.',
    features: [
      { icon: Check, text: 'Everything in Standard' },
      { icon: Phone, text: 'Phone Agent' },
      { icon: RefreshCw, text: 'Data Sync Automation' },
      { icon: Settings, text: 'Custom Needs' },
    ],
    highlighted: false,
    badge: null,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Flexible Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
            Simple, Transparent{' '}
            <span className="text-gradient-gold">Pricing</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every package is fully customizable. Add or remove features to match your team's exact needs — pricing adjusts accordingly.
          </p>
        </AnimatedSection>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 ${plan.highlighted
                  ? 'bg-white/[0.05] border border-gold-500/40 shadow-2xl shadow-gold-500/10'
                  : 'glass-card border border-white/[0.06] hover:border-white/[0.12]'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500 text-black text-xs font-semibold">
                      <Sparkles className="w-3 h-3" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan name & price */}
                <div className="mb-6">
                  <h2 className={`text-sm font-semibold uppercase tracking-widest mb-3 ${plan.highlighted ? 'text-gold-400' : 'text-gray-400'}`}>
                    {plan.name}
                  </h2>
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-5xl font-bold text-white">${plan.price.toLocaleString()}</span>
                    <span className="text-gray-500 mb-2 text-sm">/ month</span>
                  </div>
                </div>

                {/* Best For */}
                <div className={`rounded-xl p-4 mb-6 ${plan.highlighted ? 'bg-gold-500/10 border border-gold-500/20' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Best For</p>
                  <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-gray-200' : 'text-gray-400'}`}>
                    {plan.bestFor}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${plan.highlighted ? 'bg-gold-500/20' : 'bg-white/[0.06]'}`}>
                        <feature.icon className={`w-3 h-3 ${plan.highlighted ? 'text-gold-400' : 'text-gray-400'}`} />
                      </div>
                      <span className="text-sm text-gray-300">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/contact"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${plan.highlighted
                    ? 'btn-gradient text-white'
                    : 'bg-white/[0.06] text-white hover:bg-white/[0.10] border border-white/[0.08]'
                    }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Customization Note */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="glass-card border border-white/[0.08] p-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-5 h-5 text-gold-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Fully Customizable</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              These packages are starting points, not limits. Mix and match features across tiers, remove what you don't need, or add capabilities from other plans. Pricing reflects your final configuration.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gradient text-sm font-semibold text-white"
            >
              Talk to Us About a Custom Package
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
