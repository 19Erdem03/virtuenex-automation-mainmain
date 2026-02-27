import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services, colorMap } from '../lib/services';
import AnimatedSection from './AnimatedSection';

const spanMap: Record<number, string> = {
  0: 'md:col-span-2',
  3: 'md:col-span-2',
};

export default function Solutions() {
  return (
    <section id="solutions" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 radial-gradient-bottom" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-medium text-gold-500 tracking-wide uppercase mb-4">
            Our Solutions
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            AI That Works While You Close Deals
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Four powerful automation systems designed specifically for high-performing real estate teams.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service, i) => {
            const colors = colorMap[service.color];
            return (
              <AnimatedSection
                key={service.slug}
                delay={i * 0.12}
                className={spanMap[i] || ''}
              >
                <Link to={service.path} className="block h-full">
                  <div className="glass-card glow-border glow-border-hover group p-7 sm:p-8 h-full hover:bg-white/[0.06] transition-all duration-500">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                        <service.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-gold-400 transition-colors" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {service.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/[0.04] border border-white/[0.06] rounded-lg"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
