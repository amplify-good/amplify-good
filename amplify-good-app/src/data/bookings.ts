export interface Booking {
  id: string;
  musicianId: string;
  communityMemberId: string;
  communityMemberName: string;
  eventName: string;
  eventDate: string;
  location: string;
  duration: string;
  musicianRate: number;
  commissionAmount: number;
  totalCharged: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  message: string;
}

export const bookings: Booking[] = [
  // ── Los Topo Chicos (m1) bookings ──
  {
    id: "b1",
    musicianId: "m1",
    communityMemberId: "cm1",
    communityMemberName: "Rachel Torres",
    eventName: "Torres Family Reunion BBQ",
    eventDate: "2026-06-28T14:00:00",
    location: "Mueller Lake Park Pavilion",
    duration: "3 hours",
    musicianRate: 500,
    commissionAmount: 75,
    totalCharged: 575,
    status: "confirmed",
    message: "We'd love a mix of cumbia and classic rock for a multigenerational crowd. About 80 people, outdoor setting with a covered pavilion.",
  },
  {
    id: "b6",
    musicianId: "m1",
    communityMemberId: "cm4",
    communityMemberName: "Maria Gonzalez",
    eventName: "Quinceañera de Sofia",
    eventDate: "2026-04-19T18:00:00",
    location: "Fiesta Gardens, 2101 Jesse E Segovia St",
    duration: "4 hours",
    musicianRate: 500,
    commissionAmount: 75,
    totalCharged: 575,
    status: "completed",
    message: "Traditional and modern Latin music for a quinceañera celebration. About 150 guests, outdoor pavilion by the lake.",
  },
  {
    id: "b7",
    musicianId: "m1",
    communityMemberId: "cm5",
    communityMemberName: "East Side Brewing Co.",
    eventName: "Brewery Grand Opening",
    eventDate: "2026-07-05T16:00:00",
    location: "East Side Brewing, 1201 E 6th St",
    duration: "3 hours",
    musicianRate: 500,
    commissionAmount: 75,
    totalCharged: 575,
    status: "pending",
    message: "Looking for high-energy Latin fusion to kick off our grand opening. Food trucks, 200+ expected, outdoor beer garden.",
  },

  // ── Nia Waters (m2) bookings ──
  {
    id: "b2",
    musicianId: "m2",
    communityMemberId: "cm2",
    communityMemberName: "David Chen",
    eventName: "Chen-Williams Wedding Reception",
    eventDate: "2026-05-03T17:00:00",
    location: "Hotel Saint Cecilia, 112 Academy Dr",
    duration: "4 hours",
    musicianRate: 350,
    commissionAmount: 52.5,
    totalCharged: 402.5,
    status: "completed",
    message: "Looking for elegant jazz and neo-soul for our wedding reception. Cocktail hour into dinner — about 120 guests, intimate garden setting.",
  },
  {
    id: "b8",
    musicianId: "m2",
    communityMemberId: "cm1",
    communityMemberName: "Rachel Torres",
    eventName: "Jazz Night at Springdale Social",
    eventDate: "2026-08-15T20:00:00",
    location: "Springdale General, 1023 Springdale Rd",
    duration: "2 hours",
    musicianRate: 350,
    commissionAmount: 52.5,
    totalCharged: 402.5,
    status: "confirmed",
    message: "Intimate jazz night for a small crowd. 40-50 people, indoor venue, cocktails and candles.",
  },

  // ── Dusty Creek Revival (m3) bookings ──
  {
    id: "b4",
    musicianId: "m3",
    communityMemberId: "cm2",
    communityMemberName: "David Chen",
    eventName: "Hill Country Corporate Retreat",
    eventDate: "2026-06-07T15:00:00",
    location: "Dripping Springs Ranch, Hwy 290",
    duration: "3 hours",
    musicianRate: 400,
    commissionAmount: 60,
    totalCharged: 460,
    status: "confirmed",
    message: "Acoustic folk and country for an outdoor corporate retreat. Casual ranch setting, about 60 people, sunset session.",
  },

  // ── DJ Amara Sol (m4) bookings ──
  {
    id: "b5",
    musicianId: "m4",
    communityMemberId: "cm3",
    communityMemberName: "Startup ATX Collective",
    eventName: "SXSW Afterparty: Amplify After Dark",
    eventDate: "2026-03-15T22:00:00",
    location: "Kingdom, 5th & Red River",
    duration: "4 hours",
    musicianRate: 300,
    commissionAmount: 45,
    totalCharged: 345,
    status: "completed",
    message: "High-energy DJ set for our SXSW afterparty. Full production setup, 300+ capacity, we want the place jumping.",
  },

  // ── Marcus & the Burning Oaks (m5) bookings ──
  {
    id: "b3",
    musicianId: "m5",
    communityMemberId: "cm3",
    communityMemberName: "Startup ATX Collective",
    eventName: "Launch Party: TechRise Demo Day",
    eventDate: "2026-07-12T19:00:00",
    location: "Brazos Hall, 204 E 4th St",
    duration: "2 hours",
    musicianRate: 600,
    commissionAmount: 90,
    totalCharged: 690,
    status: "pending",
    message: "High-energy blues-rock set for our startup demo day after-party. ~200 attendees, tech crowd that wants to let loose.",
  },
  {
    id: "b9",
    musicianId: "m5",
    communityMemberId: "cm2",
    communityMemberName: "David Chen",
    eventName: "40th Birthday Blowout",
    eventDate: "2026-09-20T19:00:00",
    location: "Stubb's BBQ, 801 Red River St",
    duration: "3 hours",
    musicianRate: 600,
    commissionAmount: 90,
    totalCharged: 690,
    status: "pending",
    message: "Blues and rock for a milestone birthday party. About 100 guests, Stubb's indoor stage, full band setup.",
  },
];

export const impactPool = {
  balance: 685,
  totalInflows: 1835,
  totalOutflows: 1150,
};
