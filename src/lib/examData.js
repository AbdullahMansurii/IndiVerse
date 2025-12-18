export const EXAMS = [
    {
        id: 'ielts',
        label: 'IELTS',
        fullName: 'International English Language Testing System',
        description: 'The most popular English language proficiency test for global higher education.',
        universities: [
            { name: 'University of Oxford', country: 'UK', countryFlag: '🇬🇧', minScore: '7.5' },
            { name: 'University of Cambridge', country: 'UK', countryFlag: '🇬🇧', minScore: '7.5' },
            { name: 'Harvard University', country: 'USA', countryFlag: '🇺🇸', minScore: '7.5' },
            { name: 'University of Toronto', country: 'Canada', countryFlag: '🇨🇦', minScore: '6.5' },
            { name: 'Australian National University', country: 'Australia', countryFlag: '🇦🇺', minScore: '6.5' },
            { name: 'TU Munich', country: 'Germany', countryFlag: '🇩🇪', minScore: '6.5' }
        ]
    },
    {
        id: 'toefl',
        label: 'TOEFL',
        fullName: 'Test of English as a Foreign Language',
        description: 'Widely accepted by universities in the USA and globally.',
        universities: [
            { name: 'MIT', country: 'USA', countryFlag: '🇺🇸', minScore: '90+' },
            { name: 'Stanford University', country: 'USA', countryFlag: '🇺🇸', minScore: '100+' },
            { name: 'McGill University', country: 'Canada', countryFlag: '🇨🇦', minScore: '90+' },
            { name: 'University of Melbourne', country: 'Australia', countryFlag: '🇦🇺', minScore: '79+' },
            { name: 'LMU Munich', country: 'Germany', countryFlag: '🇩🇪', minScore: '80+' }
        ]
    },
    {
        id: 'gre',
        label: 'GRE',
        fullName: 'Graduate Record Examination',
        description: 'Standardized test for many graduate schools in the US and Canada.',
        universities: [
            { name: 'Stanford University', country: 'USA', countryFlag: '🇺🇸', minScore: '320+' },
            { name: 'MIT', country: 'USA', countryFlag: '🇺🇸', minScore: '325+' },
            { name: 'ETH Zurich', country: 'Germany', countryFlag: '🇩🇪', minScore: 'Optional' },
            { name: 'University of British Columbia', country: 'Canada', countryFlag: '🇨🇦', minScore: '310+' },
            { name: 'Imperial College London', country: 'UK', countryFlag: '🇬🇧', minScore: '315+' }
        ]
    },
    {
        id: 'gmat',
        label: 'GMAT',
        fullName: 'Graduate Management Admission Test',
        description: 'Primarily for MBA programs.',
        universities: [
            { name: 'London Business School', country: 'UK', countryFlag: '🇬🇧', minScore: '700+' },
            { name: 'Harvard Business School', country: 'USA', countryFlag: '🇺🇸', minScore: '730+' },
            { name: 'INSEAD', country: 'France/Singapore', countryFlag: '🇫🇷', minScore: '700+' },
            { name: 'Rotman School of Management', country: 'Canada', countryFlag: '🇨🇦', minScore: '670+' },
            { name: 'Melbourne Business School', country: 'Australia', countryFlag: '🇦🇺', minScore: '680+' }
        ]
    },
    {
        id: 'pte',
        label: 'PTE',
        fullName: 'Pearson Test of English',
        description: 'Computer-based English test accepted by many institutions.',
        universities: [
            { name: 'University of Sydney', country: 'Australia', countryFlag: '🇦🇺', minScore: '61+' },
            { name: 'University of British Columbia', country: 'Canada', countryFlag: '🇨🇦', minScore: '65+' },
            { name: 'University of Warwick', country: 'UK', countryFlag: '🇬🇧', minScore: '62+' },
            { name: 'Harvard University', country: 'USA', countryFlag: '🇺🇸', minScore: '70+' }
        ]
    },
    {
        id: 'duolingo',
        label: 'Duolingo',
        fullName: 'Duolingo English Test',
        description: 'Convenient online English proficiency test.',
        universities: [
            { name: 'Columbia University', country: 'USA', countryFlag: '🇺🇸', minScore: '120+' },
            { name: 'Yale University', country: 'USA', countryFlag: '🇺🇸', minScore: '120+' },
            { name: 'University of Bristol', country: 'UK', countryFlag: '🇬🇧', minScore: '110+' },
            { name: 'McGill University', country: 'Canada', countryFlag: '🇨🇦', minScore: '115+' }
        ]
    }
]
