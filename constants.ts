
import { FaqItem, TrackItem, ScheduleItem } from './types';

export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About Us', href: '#about' },
  { name: 'Tracks', href: '#tracks' },
  { name: 'Schedule', href: '#timeline' },
];

export const TRACKS: TrackItem[] = [
  {
    title: "EdTech",
    description: "EdTech through curiosity, experimentation, and communication. Encourages interactive learning, problem-solving, peer collaboration, and practical knowledge using digital tools instead of rote memorization. Like Dustin learning through questions and teamwork.",
    icon: "laptop"
  },
  {
    title: "Eleven",
    description: "FinTech using intelligence and control to manage powerful systems. Applies data, AI, and algorithms to move money securely, detect fraud, enable digital payments, and empower users with smarter, faster financial access.",
    icon: "brain"
  },
  {
    title: "Steve",
    description: "Agriculture through protection, responsibility, and hands-on effort. Nurtures and protects crops from threats, requiring constant care, timely action, resilience, and smart use of tools to sustain life and growth.",
    icon: "lock"
  },
  {
    title: "Max",
    description: "Healthcare through strength, recovery, and perseverance. Focuses on diagnosis, support, and rehabilitation—helping individuals regain stability, resilience, and well-being through timely care and compassionate intervention.",
    icon: "heart"
  }
];

export const FAQS: FaqItem[] = [
  {
    question: "Who can enter the Upside Down?",
    answer: "Anyone! Students, professionals, and demogorgons (just kidding) from anywhere in the world can participate."
  },
  {
    question: "Is it free?",
    answer: "Yes, admission to DevClash 2025 is completely free. We just need your brain power."
  },
  {
    question: "What if I don't have a team?",
    answer: "You can enter solo or find a party of up to 4 members in our discord server. Friends don't lie, and they don't hack alone."
  },
  {
    question: "What is the venue?",
    answer: "The event is fully online (virtual). You can hack from the comfort of your basement, Wheeler's house, or the void."
  }
];

export const SCHEDULE: ScheduleItem[] = [
  {
    time: "Oct 27",
    event: "Day 1: The Vanishing",
    description: "Opening Ceremony, Keynote Speakers, and Team Formation. The gate opens."
  },
  {
    time: "Oct 28",
    event: "Day 2: The Weirdo on Maple Street",
    description: "Hacking Begins. Workshop 1: Dealing with Demogorgons (Bug Fixing). Gaming Night."
  },
  {
    time: "Oct 29",
    event: "Day 3: Holly, Jolly",
    description: "Deep Hacking Mode. Mentorship Sessions with Mr. Clarke. Midnight Pizza Party."
  },
  {
    time: "Oct 30",
    event: "Day 4: The Body",
    description: "Submission Deadline. Project Demos. The judges enter the void to evaluate."
  },
  {
    time: "Oct 31",
    event: "Day 5: The Bathtub",
    description: "Grand Finale & Closing Ceremony. Winners revealed. Halloween After-Party."
  }
];

export const CHAT_SYSTEM_INSTRUCTION = `
You are Hawkins Radio, an AI assistant for the DevClash 2025 Hackathon.
Your persona is mysterious, slightly retro (80s style), and helpful.
You make references to Stranger Things (e.g., The Upside Down, Demogorgons, Eggos, Hawkins, Mind Flayer).
You are here to help users with questions about the hackathon tracks, schedule (which is 5 days long), and rules.
If you don't know something, say "The signal is weak... I cannot find that information in the void."
Keep answers concise and thematic.
`;
