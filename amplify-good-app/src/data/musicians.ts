export interface Musician {
  id: string;
  name: string;
  bio: string;
  genres: string[];
  photoUrl: string;
  mediaLinks: { type: "spotify" | "youtube" | "soundcloud"; url: string; label: string }[];
  socialLinks: { platform: string; url: string }[];
  rate: number;
  rateType: "per_event" | "hourly";
  available: boolean;
}

export const musicians: Musician[] = [
  {
    id: "m1",
    name: "Los Topo Chicos",
    bio: "Austin's hottest Latin-fusion ensemble blending cumbia, son jarocho, and psychedelic rock. Born out of late-night jams on East 6th, Los Topo Chicos bring the kind of energy that turns strangers into dance partners.",
    genres: ["Latin", "Rock", "Folk"],
    photoUrl: "/images/musicians/los-topo-chicos.jpg",
    mediaLinks: [
      { type: "spotify", url: "https://open.spotify.com/artist/example1", label: "Cumbia del Barrio" },
      { type: "youtube", url: "https://youtube.com/watch?v=example1", label: "Live at Mohawk" },
    ],
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/lostopochicos" },
      { platform: "twitter", url: "https://twitter.com/lostopochicos" },
    ],
    rate: 500,
    rateType: "per_event",
    available: true,
  },
  {
    id: "m2",
    name: "Nia Waters",
    bio: "Jazz vocalist and pianist who grew up singing in her grandmother's church in East Austin. Nia's sound is a velvet collision of neo-soul, jazz standards, and original compositions about love, loss, and living in a city that keeps changing.",
    genres: ["Jazz", "R&B"],
    photoUrl: "/images/musicians/nia-waters.jpg",
    mediaLinks: [
      { type: "spotify", url: "https://open.spotify.com/artist/example2", label: "Riverside Sessions" },
      { type: "soundcloud", url: "https://soundcloud.com/niawaters/sunday-morning", label: "Sunday Morning" },
    ],
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/niawaters" },
      { platform: "website", url: "https://niawaters.com" },
    ],
    rate: 350,
    rateType: "per_event",
    available: true,
  },
  {
    id: "m3",
    name: "Dusty Creek Revival",
    bio: "Four-piece Americana band that sounds like a Hill Country sunset feels. Fiddle-driven folk with a country heartbeat and lyrics that tell stories about Texas — the real Texas, not the postcard version.",
    genres: ["Folk", "Country", "Blues"],
    photoUrl: "/images/musicians/dusty-creek.jpg",
    mediaLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=example3", label: "Porch Sessions Vol. 2" },
      { type: "spotify", url: "https://open.spotify.com/artist/example3", label: "Red Dirt Lullaby" },
    ],
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/dustycreekrevival" },
      { platform: "facebook", url: "https://facebook.com/dustycreekrevival" },
    ],
    rate: 400,
    rateType: "per_event",
    available: true,
  },
  {
    id: "m4",
    name: "DJ Amara Sol",
    bio: "Electronic producer and DJ who fuses Afrobeats, house, and Austin's underground electronic scene into sets that don't let you stand still. Resident at Kingdom and regular at SXSW showcases.",
    genres: ["Electronic", "Hip-Hop"],
    photoUrl: "/images/musicians/dj-amara-sol.jpg",
    mediaLinks: [
      { type: "soundcloud", url: "https://soundcloud.com/amarasol/nightshift", label: "Night Shift Mix" },
      { type: "youtube", url: "https://youtube.com/watch?v=example4", label: "Kingdom Live Set" },
    ],
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/djamarasol" },
      { platform: "tiktok", url: "https://tiktok.com/@djamarasol" },
    ],
    rate: 75,
    rateType: "hourly",
    available: true,
  },
  {
    id: "m5",
    name: "Marcus & the Burning Oaks",
    bio: "Blues-rock power trio led by guitarist Marcus Coleman, whose playing has been compared to Gary Clark Jr. meets Hendrix. They've headlined the Continental Club and opened for Black Pumas. Raw, loud, and unapologetically Austin.",
    genres: ["Blues", "Rock"],
    photoUrl: "/images/musicians/burning-oaks.jpg",
    mediaLinks: [
      { type: "spotify", url: "https://open.spotify.com/artist/example5", label: "Thunderbird" },
      { type: "youtube", url: "https://youtube.com/watch?v=example5", label: "Continental Club 2024" },
    ],
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/burningoaks" },
      { platform: "twitter", url: "https://twitter.com/burningoaks" },
    ],
    rate: 600,
    rateType: "per_event",
    available: true,
  },
];

export const allGenres = [
  "Rock", "Jazz", "Country", "Hip-Hop", "R&B", "Mariachi",
  "Classical", "Electronic", "Folk", "Latin", "Blues",
];
