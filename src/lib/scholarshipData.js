import { GraduationCap, Banknote, Calendar, Globe } from 'lucide-react'

export const SCHOLARSHIPS = [
    // USA
    {
        id: 'fulbright-usa',
        name: 'Fulbright Foreign Student Program',
        provider: 'US Department of State',
        country: 'USA',
        flag: '🇺🇸',
        amount: 'Full Funding',
        deadline: 'Varies (Oct/Nov)',
        type: 'Merit',
        description: 'Prestigious scholarship for international students to pursue Master’s or PhD degrees in the USA. Covers tuition, airfare, stipend, and health insurance.',
        tags: ['Masters', 'PhD', 'Fully Funded'],
        link: 'https://foreign.fulbrightonline.org/'
    },
    {
        id: 'knight-hennessy',
        name: 'Knight-Hennessy Scholars',
        provider: 'Stanford University',
        country: 'USA',
        flag: '🇺🇸',
        amount: 'Full Tuition + Stipend',
        deadline: 'October 11, 2024',
        type: 'Merit',
        description: 'Develops deep subject experts and aspiring leaders who play a vital role in finding diverse solutions to complex problems.',
        tags: ['Masters', 'PhD', 'Leadership'],
        link: 'https://knight-hennessy.stanford.edu/'
    },
    {
        id: 'aauw-fellowships',
        name: 'AAUW International Fellowships',
        provider: 'AAUW',
        country: 'USA',
        flag: '🇺🇸',
        amount: '$20,000 - $50,000',
        deadline: 'November 15, 2024',
        type: 'Merit',
        description: 'Support for women pursuing full-time graduate or postdoctoral study in the United States who are not U.S. citizens or permanent residents.',
        tags: ['Women', 'Graduate', 'Postdoc'],
        link: 'https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/international/'
    },

    // UK
    {
        id: 'chevening-uk',
        name: 'Chevening Scholarships',
        provider: 'UK Government',
        country: 'United Kingdom',
        flag: '🇬🇧',
        amount: 'Full Funding',
        deadline: 'November 5, 2024',
        type: 'Merit',
        description: 'Fully funded scholarships to undertake any master\'s course at any UK university. Aimed at developing global leaders.',
        tags: ['Masters', 'Leadership', 'Fully Funded'],
        link: 'https://www.chevening.org/'
    },
    {
        id: 'rhodes-oxford',
        name: 'Rhodes Scholarship',
        provider: 'University of Oxford',
        country: 'United Kingdom',
        flag: '🇬🇧',
        amount: 'Full Funding + Stipend',
        deadline: 'August 1, 2024 (Global)',
        type: 'Merit',
        description: 'The oldest (first awarded in 1902) and perhaps most prestigious international scholarship programme, enabling outstanding young people from around the world to study at the University of Oxford.',
        tags: ['Postgraduate', 'Prestigious'],
        link: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/'
    },
    {
        id: 'gates-cambridge',
        name: 'Gates Cambridge Scholarship',
        provider: 'University of Cambridge',
        country: 'United Kingdom',
        flag: '🇬🇧',
        amount: 'Full Cost',
        deadline: 'Jan/Dec (Varies)',
        type: 'Merit',
        description: 'Awarded to outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree in any subject available at the University of Cambridge.',
        tags: ['Postgraduate', 'Research'],
        link: 'https://www.gatescambridge.org/'
    },

    // Canada
    {
        id: 'vanier-cgs',
        name: 'Vanier Canada Graduate Scholarships',
        provider: 'Canadian Government',
        country: 'Canada',
        flag: '🇨🇦',
        amount: '$50,000 / year',
        deadline: 'November 1, 2024',
        type: 'Merit',
        description: 'Attracting and retaining world-class doctoral students and establishing Canada as a global center of excellence in research and higher learning.',
        tags: ['PhD', 'Research', 'High Value'],
        link: 'https://vanier.gc.ca/en/home-accueil.html'
    },
    {
        id: 'lester-b-pearson',
        name: 'Lester B. Pearson International Scholarship',
        provider: 'University of Toronto',
        country: 'Canada',
        flag: '🇨🇦',
        amount: 'Full Tuition + Residence',
        deadline: 'November 8, 2024',
        type: 'Merit',
        description: 'Recognizes international students who demonstrate exceptional academic achievement and creativity and who are recognized as leaders within their school.',
        tags: ['Undergraduate', 'Leadership'],
        link: 'https://future.utoronto.ca/pearson/about/'
    },
    {
        id: 'humber-international-entrance',
        name: 'International Entrance Scholarships',
        provider: 'Humber College',
        country: 'Canada',
        flag: '🇨🇦',
        amount: 'CAD 2,000 - Full Tuition',
        deadline: 'May/Sep/Jan',
        type: 'Merit',
        description: 'Renewable partial tuition scholarships for new international undergraduate students.',
        tags: ['Undergraduate', 'Entrance'],
        link: 'https://international.humber.ca/student-services/managing-your-finances/scholarships-bursaries.html'
    },

    // Germany
    {
        id: 'daad-masters',
        name: 'DAAD Scholarship',
        provider: 'German Govt (DAAD)',
        country: 'Germany',
        flag: '🇩🇪',
        amount: '€992/month + Insurance',
        deadline: 'Varies (Aug-Nov)',
        type: 'Need/Merit',
        description: 'Offers foreign graduates from development and newly industrialised countries from all disciplines ample opportunities to take a postgraduate or Master\'s degree.',
        tags: ['Masters', 'PhD', 'Stipend'],
        link: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/'
    },
    {
        id: 'deutschlandstipendium',
        name: 'Deutschlandstipendium',
        provider: 'Public-Private Partnership',
        country: 'Germany',
        flag: '🇩🇪',
        amount: '€300 / month',
        deadline: 'University Specific',
        type: 'Merit',
        description: 'Supports high-achieving and committed students from all over the world. Half is paid by private sponsors, the other half by the Federal Government.',
        tags: ['All Degrees', 'Merit'],
        link: 'https://www.deutschlandstipendium.de/deutschlandstipendium/de/services/english/the-deutschlandstipendium-best-of-both-worlds-for-students.html'
    },
    {
        id: 'heinrich-boell',
        name: 'Heinrich Böll Foundation',
        provider: 'Heinrich Böll Foundation',
        country: 'Germany',
        flag: '🇩🇪',
        amount: '€934/month + Allowances',
        deadline: 'March 1 / Sept 1',
        type: 'Merit & Values',
        description: 'Scholarships for international students who demonstrate excellent academic performance, social and political engagement, and an active interest in the basic values of the foundation.',
        tags: ['All Degrees', 'Green Political'],
        link: 'https://www.boell.de/en/foundation/application'
    },

    // Australia
    {
        id: 'australia-awards',
        name: 'Australia Awards Scholarships',
        provider: 'Australian Government',
        country: 'Australia',
        flag: '🇦🇺',
        amount: 'Full Tuition + Return Airfare',
        deadline: 'April 30, 2024',
        type: 'Merit',
        description: 'Long-term awards administered by the Department of Foreign Affairs and Trade. They aim to contribute to the development needs of Australia\'s partner countries.',
        tags: ['Masters', 'PhD', 'Development'],
        link: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
    },
    {
        id: 'melbourne-research',
        name: 'Melbourne Research Scholarship',
        provider: 'University of Melbourne',
        country: 'Australia',
        flag: '🇦🇺',
        amount: '$37,000/year + Fee Offset',
        deadline: 'Oct 31, 2024',
        type: 'Merit',
        description: 'High-achieving domestic and international research students. Approximately 600 scholarships are awarded each year.',
        tags: ['Masters', 'PhD', 'Research'],
        link: 'https://scholarships.unimelb.edu.au/awards/melbourne-research-scholarship'
    },
    {
        id: 'destination-australia',
        name: 'Destination Australia Program',
        provider: 'Australian Government',
        country: 'Australia',
        flag: '🇦🇺',
        amount: '$15,000 / year',
        deadline: 'Institution Specific',
        type: 'Merit',
        description: 'Objective is to attract and support international and domestic students to study in regional Australia, to grow and develop regional Australian tertiary education providers.',
        tags: ['Regional', 'All Degrees'],
        link: 'https://www.education.gov.au/destination-australia'
    }
]
