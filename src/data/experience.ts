export interface ExperienceRole {
  title: string
  employmentType: string
  period: string
  duration: string
  location?: string
  skills: string[]
}

export interface WorkExperience {
  company: string
  totalDuration?: string
  locationType?: string
  roles: ExperienceRole[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  period: string
  activities?: string
  skills?: string[]
}

export const experience: WorkExperience[] = [
  {
    company: 'talsen team GmbH',
    totalDuration: '1 yr 10 mos',
    locationType: 'Remote',
    roles: [
      {
        title: 'Software Developer',
        employmentType: 'Full-time',
        period: 'Jul 2025 – Present',
        duration: '1 yr',
        skills: ['Agile Project Management'],
      },
      {
        title: 'Software Developer',
        employmentType: 'Part-time',
        period: 'Sep 2024 – Jun 2025',
        duration: '10 mos',
        location: 'İstanbul, Türkiye',
        skills: ['Python', 'Artificial Intelligence'],
      },
    ],
  },
  {
    company: 'SameUp',
    locationType: 'Hybrid',
    roles: [
      {
        title: 'Mobile Application Developer',
        employmentType: 'Part-time',
        period: 'Jul 2023 – Aug 2024',
        duration: '1 yr 2 mos',
        location: 'İstanbul, Türkiye',
        skills: ['JavaScript', 'Git'],
      },
    ],
  },
]

export const education: Education[] = [
  {
    institution: 'Fatih Sultan Mehmet Vakıf Üniversitesi',
    degree: 'Double Major Bachelor\'s Degree',
    field: 'Computer Engineering',
    period: 'Aug 2021 – Jan 2026',
    skills: ['HTML', 'CSS'],
  },
  {
    institution: 'Klaipėda State University of Applied Sciences',
    degree: 'Bachelor of Applied Science (BASc)',
    field: 'Electrical and Automation Engineering',
    period: 'Mar 2023 – Jun 2023',
    activities: 'Erasmus+ Students Group · Erasmus+ Education',
    skills: ['Electrical Engineering', 'Automation'],
  },
  {
    institution: 'Fatih Sultan Mehmet Vakıf Üniversitesi',
    degree: 'Bachelor\'s Degree',
    field: 'Electrical and Electronics Engineering',
    period: '2020 – 2024',
  },
  {
    institution: 'Şehremini Anadolu Lisesi',
    degree: 'High School Diploma',
    field: 'Science Track (Sayısal)',
    period: 'Oct 2016 – Jun 2020',
  },
]
