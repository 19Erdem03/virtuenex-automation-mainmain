import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { InlineWidget } from 'react-calendly';
import { CALENDLY_CONFIG } from '../config/calendly';

const questions = [
    {
        id: 'bottleneck',
        title: 'What is your biggest operational bottleneck right now?',
        options: [
            'Missing website leads & slow after-hours responses', // Maps to AI Chat Assistants
            'Missing phone calls while agents are busy', // Maps to Inbound Phone Agents
            'Website traffic isn\'t converting into leads', // Maps to Real Estate Websites
            'Too much manual data entry & CRM management', // Maps to Intelligent Data Sync
            'Other / Multiple areas'
        ],
    },
    {
        id: 'teamSize',
        title: 'How many team members/agents do you currently have?',
        options: ['Just me', '2-5', '6-15', '16-50', '50+'],
    },
    {
        id: 'crm',
        title: 'Are you currently using a CRM system?',
        options: ['Yes (Salesforce/Hubspot/etc)', 'Yes (Real Estate specific)', 'We use spreadsheets', 'No'],
    },
    {
        id: 'goal',
        title: 'What is your primary goal for implementing AI automation?',
        options: ['Save time', 'Increase lead conversion', 'Reduce operational costs', 'Scale without hiring'],
    },
];

interface BookingModalProps {
    children: React.ReactNode;
    className?: string;
    autoOpen?: boolean;
}

export default function BookingModal({ children, className = "", autoOpen = false }: BookingModalProps) {
    const [isOpen, setIsOpen] = useState(autoOpen);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Handle autoOpen prop changes and ensure body scroll is locked correctly on mount if autoOpened
    useEffect(() => {
        if (autoOpen) {
            setIsOpen(true);
        }
    }, [autoOpen]);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setAnswers({});
            setName('');
            setEmail('');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

    const handleSelectOption = (questionId: string, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
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
        <>
            <button onClick={() => setIsOpen(true)} className={className}>
                {children}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-20 text-white font-sans">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#0f0f0f]">
                                <div className="flex items-center gap-4">
                                    {!isCalendlyStep && step > 0 && (
                                        <button onClick={handleBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                                        </button>
                                    )}
                                    <h3 className="font-semibold text-lg text-white">
                                        {isCalendlyStep ? "Book Your Audit" : "Workflow Discovery"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            {!isCalendlyStep && (
                                <div className="h-1 bg-white/5 w-full">
                                    <motion.div
                                        className="h-full bg-gold-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((step) / (questions.length + 1)) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            )}

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-10 hide-scrollbar">
                                <AnimatePresence mode="wait">
                                    {!isDetailsStep && !isCalendlyStep && (
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
                                                {questions[step].options.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleSelectOption(questions[step].id, option)}
                                                        className={`w-full text-left p-4 sm:p-5 rounded-xl border ${answers[questions[step].id] === option
                                                            ? 'bg-gold-500/10 border-gold-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-gold-500/50 hover:bg-white/10'
                                                            } transition-all duration-200`}
                                                    >
                                                        <span className="text-sm sm:text-base">{option}</span>
                                                    </button>
                                                ))}
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
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
