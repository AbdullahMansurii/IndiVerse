import { Search, MessageSquare, Ticket } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search className="w-6 h-6 text-primary" />,
            title: "Filter & Find",
            desc: "Search mentors by university, country, or course. Find someone who walked the path you want to take."
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-secondary" />,
            title: "Connect & Chat",
            desc: "Send a request. Once accepted, chat directly or schedule a video call to clear your doubts."
        },
        {
            icon: <Ticket className="w-6 h-6 text-blue-400" />,
            title: "Fly with Confidence",
            desc: "Get application reviews, visa guidance, and accommodation tips from a local expert."
        }
    ]

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Your Journey in 3 Steps</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">From confusion to clarity, we've streamlined the mentorship process.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-white/10 to-blue-400/20 z-0"></div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-colors shadow-lg">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
