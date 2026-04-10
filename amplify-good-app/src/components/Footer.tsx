import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-azure text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/images/fist-logo.png"
                alt="Amplify Good"
                className="h-9 w-auto object-contain"
              />
              <h3 className="font-display text-2xl uppercase tracking-wide">
                Amplify Good
              </h3>
            </div>
            <p className="text-blue-200 text-sm font-body">
              Where Wealth Preserves Art &amp; Art Drives Social Impact.
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

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-blue-400/30 text-center">
          <p className="text-xs text-blue-200">
            &copy; 2026 Amplify Good &middot; Austin, TX &middot; ACL Festival
            Meets Local Community
          </p>
        </div>
      </div>
    </footer>
  );
}
