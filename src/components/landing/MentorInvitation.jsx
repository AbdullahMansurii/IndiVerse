import { motion } from 'framer-motion'
import { ArrowRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MentorInvitation() {
    return (
        <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
            <div className="container mx-auto px-6">
                <div className="glass-card max-w-4xl mx-auto p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent relative overflow-hidden">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                <span className="text-xs font-semibold text-gray-300">Join the Circle of Giving</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Are you studying abroad?
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Give back to the community that got you there. Share your lived experience, guide legitimate aspirants, and build your mentorship portfolio. You control your availability.
                            </p>
                            <Link
                                to="/signup?role=mentor"
                                className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Become a Mentor <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Visual sidebar (abstract representation of mentorship) */}
                        <div className="w-full md:w-1/3 aspect-square relative place-content-center hidden md:grid">
                            <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-4 border border-dashed border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <div className="text-center">
                                <div className="text-5xl mb-2">🤝</div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest">Impact</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
