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
];

export const impactPool = {
  balance: 400,
  totalInflows: 1200,
  totalOutflows: 800,
};
