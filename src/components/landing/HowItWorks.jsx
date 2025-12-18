import { Search, Send, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search className="w-6 h-6 text-white" />,
            title: "Discover",
            desc: "Explore mentor profiles or browse public questions to see who aligns with your goals."
        },
        {
            icon: <Send className="w-6 h-6 text-white" />,
            title: "Request",
            desc: "Send a structured guidance request. Be specific about what you need help with."
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-white" />,
            title: "Chat",
            desc: "Connect privately. Get honest, unfiltered advice from someone who's been there."
        }
    ]

    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
                    <p className="text-gray-400">Simple. Direct. Effective.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent border-t border-dashed border-white/20" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 relative z-10 group-hover:border-primary/50 transition-colors shadow-2xl">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-sm">
                                    {idx + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
