import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const blogPosts = [
    {
        slug: 'future-of-ai-in-real-estate',
        title: 'The Future of AI in Real Estate: How Tech is Changing the Game',
        excerpt: 'Discover how artificial intelligence is streamlining property management, improving lead qualification, and transforming the modern real estate landscape.',
        date: 'March 7, 2026',
        author: 'VirtueNex Team',
        image: '/images/blog/ai-tech-real-estate.png'
    },
    {
        slug: 'maximizing-conversion-ai-chatbots',
        title: 'Maximizing Client Engagement with AI Chatbots',
        excerpt: 'Learn why 24/7 AI chat assistants are no longer optional for top-producing teams, and how they bridge the gap between initial contact and closed deals.',
        date: 'March 7, 2026',
        author: 'VirtueNex Team',
        image: '/images/blog/ai-chatbots.png'
    },
    {
        slug: 'business-automation-for-brokers',
        title: 'Business Automation: Reclaiming Time for Real Estate Brokers',
        excerpt: 'Stop drowning in administrative tasks. An exploration of intelligent data sync, automated follow-ups, and inbound call protocols.',
        date: 'March 7, 2026',
        author: 'VirtueNex Team',
        image: '/images/blog/ai-automation.png'
    }
];

export default function BlogsPage() {
    return (
        <>
            <SEO
                title="Real Estate AI Insights & Blog"
                description="Stay ahead of the curve. Read the latest insights from VirtueNex on how Artificial Intelligence and automation are transforming real estate."
                canonicalUrl="https://virtuenex.com/blogs"
            />
            <div className="pt-32 pb-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Insights & <span className="text-gold">Tech Updates</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-400"
                        >
                            Discover how AI and automation are redefining what's possible in the real estate industry.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300"
                            >
                                <Link to={`/blogs/${post.slug}`}>
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{post.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>{post.author}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-400 mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center text-gold font-semibold group-hover:gap-2 transition-all">
                                            Read Article <ArrowRight size={18} className="ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
