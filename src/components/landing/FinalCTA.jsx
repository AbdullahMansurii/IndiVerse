import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Make decisions with <br /><span className="text-primary">clarity, not confusion.</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <Link
                            to="/mentors"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-base font-bold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            Find a Mentor <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                            to="/signup?role=mentor"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 text-base font-bold rounded-full hover:bg-white/5 transition-all"
                        >
                            Become a Mentor
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
