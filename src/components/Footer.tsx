import Link from "next/link";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "About Us",
    links: [
      { label: "Home", href: "/" },
      { label: "Leadership", href: "/leadership" },
      { label: "What We Believe", href: "/beliefs" },
      { label: "Knowing Christ", href: "/knowing-christ" },
    ],
  },
  {
    title: "Ministries",
    links: [
      { label: "Hope Kids", href: "/hope-kids" },
      { label: "Prayer", href: "/prayer" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100064705266767",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCz4sLq2IbMmmYSxE1Th5lug",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Footer Component                                                   */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a2332] text-white/90">
      {/* ---- Main footer content ---- */}
      <div className="section-padding section-padding-y">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Column 1: Logo + Description + Social */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-3 mb-5">
                <Image
                  src="/ope.png"
                  alt="Hope Christian Church"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain brightness-0 invert"
                />
                <div>
                  <span className="font-heading text-lg text-white block leading-tight">
                    Hope Christian
                  </span>
                  <span className="text-[0.65rem] tracking-[0.15em] uppercase text-white/50 font-medium">
                    Church
                  </span>
                </div>
              </Link>

              <p className="text-[0.9rem] text-white/60 leading-relaxed mb-6 max-w-xs">
                A Christ-centered community in North Haven, CT, committed to
                sharing the hope and love of Jesus with our neighbors and the
                world.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/8 text-white/60 hover:bg-[#c8953e] hover:text-white transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 & 3: Navigation */}
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="font-heading text-white text-[1.1rem] mb-5">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => {
                    const props = link.external
                      ? {
                          target: "_blank" as const,
                          rel: "noopener noreferrer",
                        }
                      : {};
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[0.9rem] text-white/50 hover:text-[#e8c078] transition-colors duration-200 inline-block"
                          {...props}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Column 4: Contact Info */}
            <div>
              <h4 className="font-heading text-white text-[1.1rem] mb-5">
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-white/30 mb-1 font-medium">
                    Email
                  </span>
                  <a
                    href="mailto:office@hopeag.com"
                    className="text-[0.9rem] text-white/50 hover:text-[#e8c078] transition-colors duration-200"
                  >
                    office@hopeag.com
                  </a>
                </li>
                <li>
                  <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-white/30 mb-1 font-medium">
                    Phone
                  </span>
                  <a
                    href="tel:+12032347328"
                    className="text-[0.9rem] text-white/50 hover:text-[#e8c078] transition-colors duration-200"
                  >
                    (203) 234-7328
                  </a>
                </li>
                <li>
                  <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-white/30 mb-1 font-medium">
                    Location
                  </span>
                  <span className="text-[0.9rem] text-white/50">
                    North Haven, CT
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div className="border-t border-white/8">
        <div className="section-padding py-5">
          <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[0.8rem] text-white/30">
              &copy; {currentYear} Hope Christian Church. All rights reserved.
            </p>
            <p className="text-[0.8rem] text-white/30">
              Web Design and Development by{" "}
              <a
                href="https://whiteoakmedia.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-[#e8c078] transition-colors duration-200"
              >
                White Oak Media
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
