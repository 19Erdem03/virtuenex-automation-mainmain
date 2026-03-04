import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BrainCircuit, PhoneCall, Globe, Database, Calendar } from 'lucide-react';
import { InlineWidget } from 'react-calendly';
import { CALENDLY_CONFIG } from '../config/calendly';

const questions = [
    {
        id: 'bottleneck',
        title: "What is your biggest operational bottleneck right now?",
        options: [
            { id: 'leads', icon: BrainCircuit, label: "Missing website leads & slow after-hours responses" },
            { id: 'calls', icon: PhoneCall, label: "Missing phone calls while agents are busy" },
            { id: 'traffic', icon: Globe, label: "Website traffic isn't converting into leads" },
            { id: 'data', icon: Database, label: "Too much manual data entry & CRM management" },
            { id: 'other', icon: ArrowRight, label: "Other / Multiple areas" }
        ]
    },
    {
        id: 'teamSize',
        title: "How many team members/agents do you currently have?",
        options: [
            { id: '1-5', label: "1-5 agents" },
            { id: '6-15', label: "6-15 agents" },
            { id: '16-50', label: "16-50 agents" },
            { id: '50+', label: "50+ agents" }
        ]
    },
    {
        id: 'crm',
        title: "Are you currently using a CRM system?",
        options: [
            { id: 'yes-hubspot', label: "Yes, HubSpot or Salesforce" },
            { id: 'yes-realestate', label: "Yes, Real Estate specific (Follow Up Boss, Top Producer, etc.)" },
            { id: 'yes-other', label: "Yes, another system" },
            { id: 'no', label: "No, we use spreadsheets/email" }
        ]
    },
    {
        id: 'goal',
        title: "What is your primary goal for implementing AI automation?",
        options: [
            { id: 'time', label: "Save time on manual tasks" },
            { id: 'conversion', label: "Increase lead conversion rates" },
            { id: 'support', label: "Provide 24/7 client support" },
            { id: 'scale', label: "Scale operations without adding headcount" }
        ]
    }
];

interface BookingFormProps {
    className?: string;
}

export default function BookingForm({ className = "" }: BookingFormProps) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleRestart = () => {
        setStep(0);
        setAnswers({});
        setName('');
        setEmail('');
    };

    const handleNext = () => setStep((s) => s + 1);


    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
        setTimeout(handleNext, 350);
    };

    const isDetailsStep = step === questions.length;
    const isCalendlyStep = step === questions.length + 1;

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            handleNext();
            // Future: webhook sync data to Supabase here
        }
    };

    return (
        <div className={`w-full max-w-3xl mx-auto rounded-3xl overflow-hidden glass-card glow-border relative z-10 ${className}`} ref={containerRef}>
            {/* Header */}
            <div className="bg-black/50 border-b border-white/[0.04] p-6 relative">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Schedule a Discovery Call</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-sm text-gray-400">Usually responds within 2 hours</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {step < questions.length && (
                        <motion.div
                            key={`step-${step}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-xl mx-auto"
                        >
                            <h4 className="text-xl sm:text-2xl font-bold mb-8 leading-tight">
                                {questions[step].title}
                            </h4>
                            <div className="space-y-3">
                                {questions[step].options.map((option) => {
                                    const Icon = 'icon' in option ? option.icon : undefined;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleSelectOption(questions[step].id, option.id)}
                                            className={`w-full text-left p-4 sm:p-5 rounded-xl border flex items-center gap-3 ${answers[questions[step].id] === option.id
                                                ? 'bg-gold-500/10 border-gold-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                                : 'bg-white/5 border-white/10 text-gray-300 hover:border-gold-500/50 hover:bg-white/10'
                                                } transition-all duration-200`}
                                        >
                                            {Icon && <Icon className="w-5 h-5 shrink-0" />}
                                            <span className="text-sm sm:text-base">{option.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {isDetailsStep && (
                        <motion.div
                            key="details-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-xl mx-auto"
                        >
                            <h4 className="text-xl sm:text-2xl font-bold mb-8 leading-tight">
                                Where should we send the calendar invitation and audit details?
                            </h4>
                            <form onSubmit={handleDetailsSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                                        placeholder="John Smith"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full btn-gradient py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 mt-6 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] transition-all"
                                >
                                    Continue to Calendar
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {isCalendlyStep && (
                        <motion.div
                            key="calendly-step"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full min-h-[500px] sm:min-h-[600px] bg-[#111] rounded-xl overflow-hidden"
                        >
                            <InlineWidget
                                url={CALENDLY_CONFIG.url}
                                prefill={{
                                    name,
                                    email,
                                    customAnswers: {
                                        a1: answers['bottleneck'] || '',
                                        a2: answers['teamSize'] || '',
                                        a3: answers['crm'] || '',
                                        a4: answers['goal'] || ''
                                    }
                                }}
                                styles={{
                                    height: '600px',
                                    minWidth: '320px',
                                    width: '100%',
                                }}
                                pageSettings={{
                                    backgroundColor: CALENDLY_CONFIG.backgroundColor,
                                    hideEventTypeDetails: CALENDLY_CONFIG.hideEventTypeDetails,
                                    hideGdprBanner: CALENDLY_CONFIG.hideGdprBanner,
                                    primaryColor: CALENDLY_CONFIG.primaryColor,
                                    textColor: CALENDLY_CONFIG.textColor,
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Embedded Form Progress */}
            {step < questions.length && (
                <div className="bg-black/40 border-t border-white/[0.04] px-6 py-4 flex items-center justify-between">
                    <p className="text-xs font-mono text-gray-500">
                        step_{step + 1}_of_{questions.length + 1}
                    </p>
                    {step > 0 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            ← Back
                        </button>
                    )}
                </div>
            )}

            {step >= questions.length + 1 && (
                <div className="bg-black/40 border-t border-white/[0.04] px-6 py-4 flex items-center justify-center">
                    <button
                        onClick={handleRestart}
                        className="text-xs font-medium text-gray-400 hover:text-gold-400 transition-colors"
                    >
                        Restart Booking
                    </button>
                </div>
            )}
        </div>
    );
}
