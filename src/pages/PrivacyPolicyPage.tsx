import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    number: '1',
    title: 'Information We Collect',
    content: (
      <p className="text-gray-400 leading-relaxed">
        We only collect information that you voluntarily provide to us:
      </p>
    ),
    list: [
      { label: 'Contact Forms', detail: 'Name, email address, company details, and any project information you share.' },
      { label: 'Calendly', detail: 'Information required to schedule a meeting, such as your name, email, and time zone.' },
    ],
  },
  {
    number: '2',
    title: 'How We Use Your Data',
    content: (
      <div className="space-y-3 text-gray-400 leading-relaxed">
        <p>We use your data strictly to communicate with you regarding your inquiry. Specifically:</p>
        <ul className="space-y-2 pl-4">
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0" />
            <span>Data submitted via our website form is sent to Make.com via a secure webhook.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0" />
            <span>This data is then routed to a private Telegram bot to notify our team instantly so we can respond to you faster.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0" />
            <span>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    number: '3',
    title: 'Third-Party Services',
    content: (
      <p className="text-gray-400 leading-relaxed">
        To provide a seamless experience, we use the following trusted processors:
      </p>
    ),
    list: [
      { label: 'Calendly', detail: 'For meeting scheduling.' },
      { label: 'Make.com', detail: 'For workflow automation.' },
      { label: 'Telegram', detail: 'For internal team notifications.' },
      { label: 'Google Cloud / Hosting Providers', detail: 'Where our website and backend services are hosted.' },
    ],
  },
  {
    number: '4',
    title: 'Data Security',
    content: (
      <p className="text-gray-400 leading-relaxed">
        We implement industry-standard security measures to ensure your data is handled safely during the automation process. However, please note that no method of transmission over the internet is 100% secure.
      </p>
    ),
  },
  {
    number: '5',
    title: 'Your Rights',
    content: (
      <p className="text-gray-400 leading-relaxed">You have the right to:</p>
    ),
    list: [
      { detail: 'Request access to the data we have about you.' },
      { detail: 'Request that we delete your data from our internal notification logs.' },
      { detail: 'Withdraw consent for us to contact you at any time.' },
    ],
  },
  {
    number: '6',
    title: 'Contact Us',
    content: (
      <p className="text-gray-400 leading-relaxed">
        If you have any questions regarding this Privacy Policy or wish to exercise your data rights, please visit our{' '}
        <Link to="/contact" className="text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-2">
          Contact Page
        </Link>{' '}
        to get in touch with our team.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Privacy </span>
              <span className="text-gold-500">Policy</span>
            </h1>
            <p className="text-sm text-gray-500">Last Updated: February 25, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card glow-border p-8 sm:p-10 mb-10"
          >
            <p className="text-gray-300 leading-relaxed text-base">
              At VirtueNex Automation, we take your privacy seriously. This policy explains how we collect, use, and protect your information when you interact with our website, use our contact forms, or book a meeting via Calendly.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                className="glass-card p-7 sm:p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gold-400">{section.number}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white pt-1">{section.title}</h2>
                </div>

                <div className="pl-12">
                  {section.content}

                  {section.list && (
                    <ul className="mt-4 space-y-3">
                      {section.list.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0" />
                          <span className="text-gray-400 text-sm leading-relaxed">
                            {'label' in item && item.label ? (
                              <><span className="text-gray-200 font-medium">{item.label}:</span> {item.detail}</>
                            ) : (
                              item.detail
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
