import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, UserCheck } from 'lucide-react'

export default function CoreDifferentiators() {
    const pillars = [
        {
            icon: <MapPin className="w-6 h-6 text-primary" />,
            title: "Contextual Guidance",
            desc: "Advice specifically tied to your target country, course, and journey stage. No generic 'one-size-fits-all' tips."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-secondary" />,
            title: "Verified Lived Experience",
            desc: "Mentors are real Indian students currently studying abroad or alumni. We verify their identity, so you trust the advice."
        },
        {
            icon: <UserCheck className="w-6 h-6 text-blue-400" />,
            title: "True Accountability",
            desc: "Real profiles with real history. Unlike anonymous forums, our mentors take responsibility for their guidance."
        }
    ]

    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute left-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[128px] -translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why IndiVerse is different</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary to-transparent mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {pillar.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {pillar.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
