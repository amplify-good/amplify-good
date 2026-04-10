import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-azure text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl uppercase tracking-wide mb-2">
              Amplify Good
            </h3>
            <p className="text-blue-200 text-sm font-body">
              Amplify the Good City-Wide. Where Wealth Preserves Art &amp; Art
              Drives Social Impact.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-3 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-1 text-sm text-blue-200">
              <li>
                <Link href="/musicians" className="hover:text-orange transition-colors">
                  Find a Musician
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-orange transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-orange transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Impact */}
          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-3 tracking-wide">
              Impact
            </h4>
            <p className="text-sm text-blue-200">
              Every booking funds live music at non-profit events across Austin.
              Your money goes further here.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-400/30 text-center text-xs text-blue-300">
          &copy; 2026 Amplify Good &middot; Austin, TX &middot; ACL Festival
          Meets Local Community
        </div>
      </div>
    </footer>
  );
}
