import { Check, X } from 'lucide-react'

export default function ComparisonTable() {
    return (
        <section className="py-24 bg-white/5 mx-4 md:mx-0 rounded-3xl md:rounded-none">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why choose a Mentor over a Consultant?</h2>
                    <p className="text-gray-400">Stop paying for "free" profiles. Pay for real advice.</p>
                </div>

                <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10">
                    <div className="grid grid-cols-3 bg-white/5 p-4 md:p-6 text-sm md:text-lg font-bold">
                        <div className="text-gray-400">Feature</div>
                        <div className="text-center text-red-400">Traditional Agents</div>
                        <div className="text-center text-primary">IndiVerse Mentors</div>
                    </div>

                    {[
                        { feature: "Bias", agent: "Commission-driven (Push affiliated unis)", mentor: "Zero bias (They are already students)" },
                        { feature: "Cost", agent: "Hidden fees / Expensive packages", mentor: "Transparent, per-session pricing" },
                        { feature: "Reality Check", agent: "Generic brochures", mentor: "Real on-ground reality (Jobs, Rent, Food)" },
                        { feature: "Response Time", agent: "Office hours only", mentor: "Flexible (Weekends/Evenings)" },
                        { feature: "Outcome", agent: "Admission Letter", mentor: "Career Success & Networking" },
                    ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-3 border-t border-white/5 p-4 md:p-6 hover:bg-white/5 transition-colors items-center">
                            <div className="font-medium text-gray-300 text-xs md:text-base pr-2">{row.feature}</div>
                            <div className="text-center text-gray-500 text-xs md:text-sm flex flex-col items-center">
                                <X className="w-5 h-5 text-red-500/50 mb-1" />
                                <span>{row.agent}</span>
                            </div>
                            <div className="text-center text-white text-xs md:text-sm font-semibold flex flex-col items-center bg-primary/5 rounded-lg py-2">
                                <Check className="w-5 h-5 text-primary mb-1" />
                                <span>{row.mentor}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
