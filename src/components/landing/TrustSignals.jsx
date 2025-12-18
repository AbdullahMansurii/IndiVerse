import { motion } from 'framer-motion'
import { BadgeCheck, Globe, GraduationCap } from 'lucide-react'

export default function TrustSignals() {
    return (
        <section className="py-20 bg-black border-y border-white/5 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Built on trust, not transactions</h2>
                    <p className="text-gray-500 text-sm">Transparent, verified, and community-driven.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {/* Stat 1 */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left">
                            <div className="text-2xl font-bold text-white">30+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Global Universities</div>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="text-left">
                            <div className="text-2xl font-bold text-white">5+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Major Destinations</div>
                            <div className="flex gap-1 mt-1 text-lg">🇺🇸 🇬🇧 🇨🇦 🇩🇪 🇦🇺</div>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                            <BadgeCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-left">
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Verified Profiles</div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/5 max-w-2xl mx-auto text-center">
                    <p className="text-gray-400 text-sm">
                        "We verify every mentor's university email or admission letter. Use IndiVerse with confidence, knowing you are talking to real students."
                    </p>
                </div>
            </div>
        </section>
    )
}
