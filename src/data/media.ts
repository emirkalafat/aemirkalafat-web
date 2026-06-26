export interface MediaMetrics {
  narrativeArch: number
  aestheticExec: number
  coherenceRating: number
}

export interface MediaCardData {
  id: string
  type: 'MOVIE' | 'TV_SERIES' | 'TEXT'
  title: string
  imageUrl: string
  rating: number
  meta: string[]
  description: string
  ratingLabel: string
  date: string
  isCompleted?: boolean
  metrics?: MediaMetrics
}

export const mediaCards: MediaCardData[] = [
  {
    id: 'MR-992',
    type: 'MOVIE',
    title: 'NEUROMANCER_V2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRFlyTnLHLDTro8-vjsS8VnN0It0G59eKzggzSHixXSzqDOnRrbMut2N20YqVZ-XZkhao41SacZz07AfJz27YVFZpcIvVuKCXvg7NcrrMdgxswBBqs4UmNJUOmAazPg6XIkNAZrpmsJ3Mt-XF2EaPGMZfaPgza1HIIij9UaHCCKHz4SxeuR1mPqWApMgeJjUHztTvzXwhRhttrBKXEKJkmoMfaq82JtSj59tVnCMTojunQ-haid8iQT6v7sWQ_huwQQHMXF3F7nOA',
    rating: 9.2,
    meta: ['DIR: G. GIBSON', 'YEAR: 2042'],
    description: 'Exceptional execution of the classic source material. The visual architecture relies heavily on stark contrasts and hard-edged polygonal geometries. Pacing algorithms are optimal.',
    ratingLabel: 'EXCELLENT',
    date: '2024-10-12',
    isCompleted: true,
    metrics: { narrativeArch: 92, aestheticExec: 95, coherenceRating: 88 },
  },
  {
    id: 'MR-993',
    type: 'TV_SERIES',
    title: 'SEVERANCE_PROTOCOL',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUMw8B3VhclQKbZhGlPwh5hiGsuCvbzdLUi8SeCM9TdSMLbtlUp39RJBQarmoJ5ZQROJw027v1Ow4fnKGnR5z2KPwvzRO_WqpUGwAAEAAXmDUxfnfI3wAT09Dm7HxxjTWOY3Mwb0_jr_4BcREb4vvtxaXMma4zZgh0aiPD8qwgtedsfMJB5xKNqTR41dr8a9Xx4idiQFS7xDwxE_MXX6ClG6cupabL9xzlPmnw2zibAuXYmrIcLGmehdWCmFFhgx7uqzyP8i1Flxo',
    rating: 7.8,
    meta: ['S1: 9 EPS', 'YEAR: 2024'],
    description: 'Narrative loops are intriguing but exhibit minor memory leaks in the mid-season. Set design effectively leverages liminal aesthetics to induce psychological unease.',
    ratingLabel: 'ACCEPTABLE',
    date: '2024-09-05',
    isCompleted: true,
    metrics: { narrativeArch: 78, aestheticExec: 82, coherenceRating: 74 },
  },
  {
    id: 'MR-994',
    type: 'TEXT',
    title: 'THE_THREE_BODY',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFM9QpAYRs6L243J4Qq413E6_skEwmNXGhVkV3D0Xi9ey0k3oP32-ASzpC6SwaKH_pA7wD8Hf-BLVgBGQmlln860_GuETQArBv-NuueEbfl5OI8QokkYj6MJaN4blvaRipfHYJbHacw2yhfGXMI8ZvMTERfVarNXnK93mOeJwjKxSY6cfIZMclf5iKRfAGQZqiBBoSEIE30IWxriql9ieW4MTG0mep7EvMRS3oEP0Ydv0ucrqNgfb9TXC1LTH8H0DMBmqfG4c2_G8',
    rating: 9.8,
    meta: ['AUTHOR: C. LIU', 'PAGES: 400'],
    description: 'Flawless hard-sci-fi logic framework. The extrapolation of physics into macro-scale societal engineering is rendered with terrifying precision. A must-compile text.',
    ratingLabel: 'CRITICAL',
    date: '2024-10-24',
    isCompleted: true,
    metrics: { narrativeArch: 98, aestheticExec: 94, coherenceRating: 100 },
  },
  {
    id: 'MR-991',
    type: 'MOVIE',
    title: 'BLADE_RUNNER_2049',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIZpsD6YA5sM-VM4ujCUqIfd2svR7EMTTZjFNdKfU50zcrNpu38c9iMxzJReKhD9647Lnjw7p-Md9l2RUvA0CZ22OZHPSh44KUsr5ryZkBLDQSZtS8x3Gs6ENaRceG953UiRc0UBkuP3TH3NQzfkARFwntOLE0Fmy_G0K6ctHX7lAIgiDkYFuh5oNWiFx73juCjMAyHI1Cl07DD7ELM3xRzedxtrKvXhVpTnVLaGJqhvBpai6QI9i2Vt4ZcQQI',
    rating: 8.5,
    meta: ['DIR: D. VILLENEUVE', 'YEAR: 2017'],
    description: 'Color grading audit: High fidelity. Narrative coherence: Sustained. Atmospheric pressure optimal for deep-dive diagnostics.',
    ratingLabel: 'SOLID',
    date: '2024-08-15',
    isCompleted: false,
    metrics: { narrativeArch: 88, aestheticExec: 96, coherenceRating: 82 },
  },
]
