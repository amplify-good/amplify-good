export interface Event {
  id: string;
  nonprofitId: string;
  name: string;
  dateTime: string;
  venue: string;
  vibe: string;
  expectedAttendance: number;
  genrePref: string;
  description: string;
  cause: string;
  status: "upcoming" | "completed" | "draft";
  musicianId: string | null;
  rsvpCount: number;
}

export const events: Event[] = [
  {
    id: "e1",
    nonprofitId: "np1",
    name: "Feed the City Gala",
    dateTime: "2026-06-14T18:00:00",
    venue: "The Driskill Hotel, 604 Brazos St",
    vibe: "Elegant evening gala with live music and a seated dinner",
    expectedAttendance: 250,
    genrePref: "Jazz",
    description: "Austin Food Bank's annual fundraiser bringing together donors, volunteers, and community leaders for an evening of fine dining, live jazz, and impact stories. Every dollar raised goes directly to fighting hunger in Central Texas.",
    cause: "Healthcare",
    status: "upcoming",
    musicianId: "m2",
    rsvpCount: 187,
  },
  {
    id: "e2",
    nonprofitId: "np3",
    name: "Paws & Play Block Party",
    dateTime: "2026-06-21T12:00:00",
    venue: "Republic Square Park, 422 Guadalupe St",
    vibe: "Casual outdoor block party with adoptable animals",
    expectedAttendance: 500,
    genrePref: "Folk",
    description: "A family-friendly afternoon of live music, food trucks, and adorable adoptable pets. Come for the music, leave with a new best friend. All proceeds support Austin Pets Alive!'s rescue operations.",
    cause: "Animal Rescue",
    status: "upcoming",
    musicianId: "m3",
    rsvpCount: 324,
  },
  {
    id: "e3",
    nonprofitId: "np4",
    name: "Youth Showcase: Next Gen ATX",
    dateTime: "2026-07-04T16:00:00",
    venue: "Mohawk Austin, 912 Red River St",
    vibe: "High-energy youth talent showcase with headliner",
    expectedAttendance: 300,
    genrePref: "Hip-Hop",
    description: "Young musicians from Youth Arts Coalition take the stage alongside a headlining act. This is their moment — come witness the next generation of Austin's music scene and support the programs that made it possible.",
    cause: "Youth",
    status: "upcoming",
    musicianId: "m4",
    rsvpCount: 156,
  },
  {
    id: "e4",
    nonprofitId: "np5",
    name: "Sunset on the Springs",
    dateTime: "2026-07-18T17:00:00",
    venue: "Zilker Botanical Garden, 2220 Barton Springs Rd",
    vibe: "Relaxed sunset concert in the garden",
    expectedAttendance: 200,
    genrePref: "Folk",
    description: "An evening of acoustic music surrounded by nature at Zilker Botanical Garden. Enjoy local food vendors, craft beverages, and the sounds of Hill Country folk as the sun sets over Austin.",
    cause: "Environment",
    status: "upcoming",
    musicianId: null,
    rsvpCount: 89,
  },
  {
    id: "e5",
    nonprofitId: "np2",
    name: "HAAM Benefit: Notes for Health",
    dateTime: "2026-05-10T19:00:00",
    venue: "ACL Live at The Moody Theater, 310 W Willie Nelson Blvd",
    vibe: "Concert-style benefit with multiple acts",
    expectedAttendance: 400,
    genrePref: "Blues",
    description: "An electrifying night of blues and rock at the Moody Theater, raising funds to keep Austin's musicians healthy. Featuring Marcus & the Burning Oaks headlining with special guests.",
    cause: "Arts & Culture",
    status: "completed",
    musicianId: "m5",
    rsvpCount: 378,
  },
  {
    id: "e6",
    nonprofitId: "np1",
    name: "Summer Meals Kickoff Cookout",
    dateTime: "2026-08-02T11:00:00",
    venue: "Givens District Park, 3811 E 12th St",
    vibe: "Family-friendly outdoor cookout with live Latin music",
    expectedAttendance: 350,
    genrePref: "Latin",
    description: "Austin Food Bank's summer meals program launch. Free food distribution, live music, kids' activities, and community resources. Come eat, dance, and help us fight hunger all summer long.",
    cause: "Healthcare",
    status: "upcoming",
    musicianId: "m1",
    rsvpCount: 142,
  },
  {
    id: "e7",
    nonprofitId: "np4",
    name: "Back to School Benefit Concert",
    dateTime: "2026-08-22T18:00:00",
    venue: "The Parish, 214 E 6th St",
    vibe: "High-energy all-ages concert with electronic and hip-hop",
    expectedAttendance: 250,
    genrePref: "Electronic",
    description: "Raising funds for Youth Arts Coalition's back-to-school music equipment drive. DJ sets, student showcases, and a headlining performance. All ages welcome.",
    cause: "Youth",
    status: "draft",
    musicianId: null,
    rsvpCount: 0,
  },
];
