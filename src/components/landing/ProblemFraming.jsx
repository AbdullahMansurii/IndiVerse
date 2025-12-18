import { motion } from 'framer-motion'
import { Search, MessageSquare, Users, Briefcase } from 'lucide-react'

export default function ProblemFraming() {
    const problems = [
        {
            icon: <Search className="w-5 h-5 text-red-500" />,
            title: "Google",
            desc: "Information overload. Generic articles that don't know your grades or budget."
        },
        {
            icon: <MessageSquare className="w-5 h-5 text-orange-500" />,
            title: "Reddit",
            desc: "Anonymous opinions. No accountability, no way to verify if they are real students."
        },
        {
            icon: <Users className="w-5 h-5 text-blue-500" />,
            title: "LinkedIn",
            desc: "Unanswered DMs. Students are busy and bombarded with requests."
        },
        {
            icon: <Briefcase className="w-5 h-5 text-green-500" />,
            title: "Consultants",
            desc: "Sales-driven. They push universities that pay them commission, not what's best for you."
        }
    ]

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent mb-6"
                    >
                        The problem isn’t lack of information. <br />It’s lack of clarity.
                    </motion.h2>
                    <p className="text-gray-400 text-lg">
                        You have thousands of sources, but zero accountability.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-xl text-gray-300 font-medium">
                        "When your future is on the line, you don’t need more answers — you need the <span className="text-primary font-bold">right advice from the right person</span>."
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
