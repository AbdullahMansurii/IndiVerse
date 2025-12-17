import { Quote } from 'lucide-react'

export default function Testimonials() {
    const testimonials = [
        {
            text: "I was confused between Canada and Germany. My mentor helped me analyze cost, PR rules, and job market. Saved me huge debt!",
            author: "Arjun P.",
            role: "Masters in CS, Canada"
        },
        {
            text: "Consultants gave me a generic SOP. My mentor reviewed it and told me exactly what professors look for. Got into my dream uni.",
            author: "Sneha D.",
            role: "PhD Applicant, USA"
        },
        {
            text: "Finding accommodation in London is a nightmare. Connect with a mentor who lived there made it so much easier.",
            author: "Rahul V.",
            role: "MSc Finance, UK"
        }
    ]

    return (
        <section className="py-24 bg-white/5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6">
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
                    <p className="text-gray-400">See how Indiverse is changing lives.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 relative">
                            <Quote className="w-8 h-8 text-primary/30 mb-4" />
                            <p className="text-gray-300 leading-relaxed mb-6 italic">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-gray-400">
                                    {t.author[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{t.author}</div>
                                    <div className="text-xs text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
