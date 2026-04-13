export interface NonProfit {
  id: string;
  name: string;
  bio: string;
  website: string;
  logoUrl: string;
  contactEmail: string;
  cause: string;
}

export const nonprofits: NonProfit[] = [
  {
    id: "np1",
    name: "Austin Food Bank",
    bio: "Fighting hunger in Central Texas by distributing meals to families, seniors, and children in need. Last year we served over 50 million meals across 21 counties.",
    website: "https://austinfoodbank.org",
    logoUrl: "/images/icons/hands_heart_window_icon.png",
    contactEmail: "events@austinfoodbank.org",
    cause: "Healthcare",
  },
  {
    id: "np2",
    name: "HAAM - Health Alliance for Austin Musicians",
    bio: "Providing access to affordable healthcare for Austin's low-income, uninsured working musicians. Because you can't make music if you can't take care of yourself.",
    website: "https://myhaam.org",
    logoUrl: "/images/icons/hands_heart_window_icon.png",
    contactEmail: "events@myhaam.org",
    cause: "Arts & Culture",
  },
  {
    id: "np3",
    name: "Austin Pets Alive!",
    bio: "No-kill animal rescue dedicated to saving Austin's most at-risk shelter animals. We pioneered programs that have saved over 100,000 lives and made Austin the largest no-kill city in the nation.",
    website: "https://austinpetsalive.org",
    logoUrl: "/images/icons/hands_heart_window_icon.png",
    contactEmail: "events@austinpetsalive.org",
    cause: "Animal Rescue",
  },
  {
    id: "np4",
    name: "Youth Arts Coalition ATX",
    bio: "Empowering underserved Austin youth through free music lessons, visual arts workshops, and performance opportunities. Every kid deserves a stage.",
    website: "https://youtharts-atx.org",
    logoUrl: "/images/icons/hands_heart_window_icon.png",
    contactEmail: "info@youtharts-atx.org",
    cause: "Youth",
  },
  {
    id: "np5",
    name: "Barton Springs Conservancy",
    bio: "Protecting and preserving Barton Springs and the Edwards Aquifer for future generations. Restoring the ecological heart of Austin through community science and advocacy.",
    website: "https://bartonsprings.org",
    logoUrl: "/images/icons/hands_heart_window_icon.png",
    contactEmail: "events@bartonsprings.org",
    cause: "Environment",
  },
];

export const allCauses = [
  "Youth", "Environment", "Healthcare", "Animal Rescue", "Arts & Culture",
];
