export default function SocialProof() {
    const universities = [
        "Stanford University",
        "MIT",
        "Harvard",
        "University of Oxford",
        "TU Munich",
        "University of Toronto",
        "Melbourne University"
    ]

    return (
        <section className="py-10 border-y border-white/5 bg-black/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-wider">
                    Trusted by students at leading universities
                </p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
                    {universities.map((uni, index) => (
                        <div key={index} className="text-lg md:text-xl font-bold text-gray-600 hover:text-white transition-colors duration-300 cursor-default">
                            {uni}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
