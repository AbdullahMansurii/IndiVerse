import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30 -z-10" />

            <div className="container mx-auto px-6 text-center z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-gray-300">Global Journey. Indian Identity.</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Real guidance from students <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent">
                            who are already living your dream.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        IndiVerse connects Indian aspirants directly with verified mentors studying abroad — <span className="text-white font-medium">no consultants, no commissions, no guesswork.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/mentors"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-base font-bold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            Find a Mentor <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/signup?role=mentor"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white text-base font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            Become a Mentor
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Contextual advice</span>
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Real conversations</span>
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Accountable guidance</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
