import { Link } from 'react-router-dom'
import { ArrowRight, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Aurora Background Effects - Kept from original for consistency */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-blob mix-blend-screen pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full animate-blob animation-delay-2000 mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-6 sm:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-primary mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Premium Mentorship Platform
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                            <span className="block text-white mb-2">Indians abroad,</span>
                            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                guiding India forward.
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light mb-10">
                            Connect directly with verified mentors at top global universities.
                            <span className="text-gray-200 font-medium"> No intermediaries. No hidden agendas. Just honest guidance.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/signup?role=aspirant" className="group relative overflow-hidden rounded-xl bg-primary hover:bg-orange-600 transition-all p-[1px]">
                                <div className="relative h-full bg-black/20 backdrop-blur-sm hover:bg-transparent transition-all px-8 py-4 flex items-center justify-center gap-2 rounded-xl">
                                    <span className="font-semibold text-white text-lg">Find a Mentor</span>
                                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            <Link to="/signup?role=mentor" className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 flex items-center justify-center gap-2 transition-all">
                                <span className="font-semibold text-white text-lg">Become a Mentor</span>
                            </Link>
                        </div>

                        <p className="mt-6 text-sm text-gray-500">
                            Join 1,200+ students already on the platform.
                        </p>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex-1 w-full max-w-lg lg:max-w-xl relative"
                    >
                        {/* Main Card */}
                        <div className="relative z-20 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="text-xs font-mono text-gray-500">indiverse-secure-connect</div>
                            </div>

                            {/* Chat Simulation */}
                            <div className="space-y-4 font-sans text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs">A</div>
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-gray-300">
                                        Is it hard to get a part-time job in Berlin as a student?
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-xs text-primary font-bold">M</div>
                                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none p-3 text-white">
                                        Not really! If you know basic German, it's easier. I can share some portals I used to find my internship at SAP.
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs">A</div>
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-gray-300">
                                        That would be amazing! Thanks, Rohan.
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gray-800 flex items-center justify-center text-[10px] text-gray-400`}>
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gray-800 flex items-center justify-center text-[10px] text-gray-400">
                                        +1k
                                    </div>
                                </div>
                                <div className="text-xs text-right">
                                    <div className="text-white font-semibold">Real Conversations.</div>
                                    <div className="text-gray-500">Real Insights.</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 z-30 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Globe className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Mentors from</div>
                                    <div className="text-sm font-bold text-white">25+ Countries</div>
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    )
}
