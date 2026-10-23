/* ════════════════════════════════════════════════════════════
   Vanishree Kulkarni — Actress & Multilingual Voice Artist
   Peach + Coral Portfolio Data Model
   Verified credits, bio, statistics, and media assets
   ════════════════════════════════════════════════════════════ */

export const profile = {
  name: 'Vanishree',
  full: 'Vanishree Kulkarni',
  role: 'Actress & Multilingual Voice Artist',
  location: 'Bengaluru, Karnataka, India',
  email: 'vanishreekulkarniartist@gmail.com',
  intro: 'Bringing life, depth, and emotional authenticity to stage, screen, television, and audio stories across 5 languages.',
  instagram: 'https://www.instagram.com/artistin_vanishreekulkarni',
  youtube: 'https://youtube.com/@reelvani',
  facebook: 'https://www.facebook.com/artistin.vanishreekulkarni',
  showreelUrl: 'https://www.youtube.com/watch?v=cCqJzJ0IXsk',
  showreelId: 'cCqJzJ0IXsk',
  avatar: 'media/photos/seo/vani.jpg',
  heroPortrait: 'media/photos/homepage/vani_hero_final.png',
}

// Quick verified highlights under the hero intro (sourced from vanishreekulkarni.in)
export const heroCounts = [
  { value: '12+', label: 'years theatre craft' },
  { value: '20+', label: 'years voice & dubbing' },
  { value: '7', label: 'creative mediums' },
  { value: '5', label: 'languages spoken' },
]

export const about = {
  // Fanned stack of 4 distinct authentic photographs: click it to shuffle through her artistic roles
  photos: [
    'media/photos/gallery/IMG-20240823-WA0016.jpg', // Screen Actress — Traditional Plum Silk Saree Portrait
    'media/photos/about/voice_over.webp',           // Voice & Dubbing Artist — Studio Recording Booth
    'media/photos/about/theatre.webp',              // Theatre Performer — Live Stage Repertoire under M. S. Sathyu
    'media/photos/gallery/youtube_avatar.jpg',      // Character Artist — Radiant Saree Portrait with Jewellery
  ],
  // One role per photo, shown under it (click the stack to cycle)
  roles: [
    'Screen Actress',
    'Voice & Dubbing Artist',
    'Theatre Performer',
    'Character Artist',
  ],
  paragraphs: [
    "Namaskara! I'm Vanishree Kulkarni, an Indian actress and multilingual voice artist based in Bengaluru, working across feature films, primetime television, live theatre, and digital streaming.",
    'With over 12 years of live stage theatre under Padma Shri awardee M. S. Sathyu, 20+ years behind the studio microphone, and versatile performances across television, films, and web series, I approach every role with vocal nuance, emotional restraint, and grounded authenticity.',
  ],
  stats: [
    { value: '12+', label: 'Years Theatre Craft · Padma Shri M. S. Sathyu' },
    { value: '20+', label: 'Years Voice Artistry · Commercials, IVR & Dubbing' },
    { value: '7', label: 'Creative Formats · Theatre, TV, Film, Shorts, Web & Audio' },
    { value: '5', label: 'Languages · Kannada, Telugu, Hindi, Marathi, English' },
  ],
}

/* Selected Acting Portfolio (television, films, theatre, web series and micro-dramas) */
export const projects = [
  {
    title: 'Ayyana Mane',
    tag: 'Web Series · Zee5',
    image: 'media/photos/about/ayyana_mane.jpg',
    text: 'Pivotal character arc in Zee5’s landmark crime thriller streaming series, dubbed into Telugu, Tamil, and Hindi.',
    role: 'Pivotal Character Role',
    year: '2025',
    tech: ['Zee5', 'Web Series', 'Crime Thriller', 'Multilingual Dub', 'Pivotal Arc'],
    link: 'https://vanishreekulkarni.in/#work',
    color: '#FFE5D9',
  },
  {
    title: 'Night Out',
    tag: 'Feature Film · Theatrical',
    image: 'media/photos/about/7fd61739-8a3f-4ae0-a1f9-3b4bf531dcc6.jpg',
    text: 'Theatrical Kannada feature film performance delivering emotional resonance, nuanced restraint, and realistic depth.',
    role: 'Supporting Character',
    year: 'Theatrical Release',
    tech: ['Feature Film', 'Theatrical Release', 'Kannada Cinema', 'Supporting Cast'],
    link: 'https://vanishreekulkarni.in/#work',
    color: '#FFD9CC',
  },
  {
    title: 'Neenade Naa',
    tag: 'Television · Zee Kannada',
    image: 'media/photos/about/NN.jpg',
    text: 'Impactful maternal and supporting role in Zee Kannada’s popular primetime television serial, portraying authentic family drama.',
    role: 'Maternal & Supporting Role',
    year: 'Primetime Series',
    tech: ['Television', 'Zee Kannada', 'Primetime Drama', 'Family Narrative'],
    link: 'https://vanishreekulkarni.in/#work',
    color: '#FFEDE5',
  },
  {
    title: 'Finding Us Again',
    tag: 'Digital · Micro-Drama',
    image: 'media/photos/about/ba702ec4-ae32-4638-a088-7e8525657475.webp',
    text: 'Lead protagonist in contemporary vertical streaming drama series, exploring human connection and complex modern relationships.',
    role: 'Lead Protagonist',
    year: 'Digital Release',
    tech: ['Digital Series', 'Lead Role', 'Micro-Drama', 'Vertical Video'],
    link: 'https://vanishreekulkarni.in/#work',
    color: '#FFE5D9',
  },
  {
    title: 'Star Suvarna & Vruksham',
    tag: 'Television & Short Film',
    image: 'media/photos/about/gejje.jpg',
    text: 'Recurring character performance in Star Suvarna serials and lead dramatic character in the independent short film Vruksham.',
    role: 'Lead & Recurring Roles',
    year: 'Television & Festival',
    tech: ['Star Suvarna', 'Short Film', 'Festival Cinema', 'Dramatic Arc'],
    link: 'https://vanishreekulkarni.in/#work',
    color: '#FFD9CC',
  },
  {
    title: 'Sathyu Stage Repertoire',
    tag: 'Live Stage Theatre',
    image: 'media/photos/about/theatre.webp',
    text: 'Over twelve years of live stage repertoire under celebrated director Padma Shri M. S. Sathyu, building classical vocal and bodily discipline.',
    role: 'Stage Performer (12+ Years)',
    year: 'Stage Repertoire',
    tech: ['Live Theatre', 'M. S. Sathyu', 'Stagecraft', 'Classical Drama'],
    link: 'https://vanishreekulkarni.in/#theatre',
    color: '#FFEDE5',
  },
]

/* Professional chronological journey with authentic photographs and verified milestones */
export const journey = [
  {
    year: 'Stage',
    title: 'Classical Stagecraft & Theatrical Discipline',
    org: 'Mentorship under Padma Shri M. S. Sathyu',
    text: '12+ years of live stage performance in Bengaluru, mastering vocal projection, timing, and emotional vulnerability under Padma Shri awardee M. S. Sathyu.',
    photo: 'media/photos/about/theatre.webp',
    note: 'grounded in theatre',
  },
  {
    year: 'Audio',
    title: 'Multilingual Voice Artistry & Character Dubbing',
    org: 'Commercials, IVR, Radio & Film Studios',
    text: 'Over 20 years in recording studios voicing national brand campaigns, corporate narrations, telecommunication IVR systems, and character dubbing across 5 languages.',
    photo: 'media/photos/about/voice_over.webp',
    note: 'in the recording booth',
  },
  {
    year: 'TV',
    title: 'Primetime Television Serials',
    org: 'Zee Kannada & Star Suvarna',
    text: 'Portraying memorable and emotionally grounded character arcs on South Indian television, including Neenade Naa on Zee Kannada and primetime dramas on Star Suvarna.',
    photo: 'media/photos/about/NN.jpg',
    note: 'primetime screen presence',
  },
  {
    year: 'Cinema',
    title: 'Theatrical Feature Films & Short Cinema',
    org: 'Kannada Feature Film ‘Night Out’',
    text: 'Brought restraint and authentic human depth to silver screen productions, including the Kannada feature film Night Out and independent film Vruksham.',
    photo: 'media/photos/about/7fd61739-8a3f-4ae0-a1f9-3b4bf531dcc6.jpg',
    note: 'theatrical release',
  },
  {
    year: 'Present',
    title: 'Landmark Streaming & Digital Dramas',
    org: 'Zee5 (‘Ayyana Mane’) & Digital Productions',
    text: 'Expanding into major OTT releases with a pivotal character role in Zee5’s multilingual series Ayyana Mane (Te/Ta/Hi) and digital series Finding Us Again.',
    photo: 'media/photos/about/ayyana_mane.jpg',
    note: 'streaming & digital',
  },
]

/* Verified acting disciplines, voice capabilities, and language proficiencies */
export const skills = [
  'Character Acting', 'Classical Stagecraft', 'Dramatic Monologues', 'Screen Performance',
  'Emotional Modulation', 'Period Dramas', 'Maternal Roles', 'Antagonist Arcs',
  'Character Dubbing', 'Voice Modulation', 'Lip-Sync Dubbing', 'Commercial Voice-Overs',
  'Radio Narration', 'IVR & Telephony', 'Audiobook Narration', 'Kannada (Native)',
  'Telugu', 'Hindi', 'Marathi', 'English',
  'Script Interpretation', 'Stage Presence', 'Microphone Technique',
]

/* Verified statistics scoreboard: rolling odometer numbers (sourced from vanishreekulkarni.in) */
export const scoreboard = [
  { brand: 'theatre', label: 'Theatre Experience', note: 'Years under Padma Shri M. S. Sathyu', value: 12, suffix: '+', goal: 15 },
  { brand: 'mic', label: 'Voice & Dubbing', note: 'Years in professional audio & dubbing', value: 20, suffix: '+', goal: 25 },
  { brand: 'film', label: 'Creative Formats', note: 'Theatre, TV, Film, Shorts, Web & Audio', value: 7, suffix: '', goal: 10 },
  { brand: 'globe', label: 'Languages Spoken', note: 'Kannada, Telugu, Hindi, Marathi, English', value: 5, suffix: '', goal: 5 },
]

/* Artist credentials, training, and recognition wall */
export const certifications = [
  ['Classical Stagecraft & Theatrical Mentorship', 'Padma Shri M. S. Sathyu (12+ Years)', 'theatre'],
  ['Multilingual Voice Artistry & Character Dubbing', '20+ Years · Commercials & IVR', 'mic'],
  ['Primetime Dramatic Television Series', 'Zee Kannada & Star Suvarna', 'tv'],
  ['Feature Films & Theatrical Cinema', 'Night Out · Festival Shorts', 'film'],
  ['Landmark Multilingual OTT Streaming', 'Zee5 (Ayyana Mane)', 'play'],
  ['Linguistic Fluency & Regional Dubbing', 'Kannada · Telugu · Hindi · Marathi · English', 'globe'],
]

export const contactSticker = 'media/photos/homepage/vani_contact_clean.webp'
