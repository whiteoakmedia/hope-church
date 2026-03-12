"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  dropdown?: DropdownItem[];
}

/* ------------------------------------------------------------------ */
/*  Navigation Data                                                    */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
  {
    label: "About Us",
    dropdown: [
      { label: "Leadership", href: "/leadership" },
      { label: "Beliefs", href: "/what-we-believe" },
      { label: "Knowing Christ", href: "/knowing-christ" },
    ],
  },
  {
    label: "Ministries",
    dropdown: [
      { label: "Hope Kids", href: "/hope-kids" },
      { label: "Prayer", href: "/prayer" },
    ],
  },
  { label: "Events", href: "/events" },
  {
    label: "Livestream",
    href: "https://youtube.com/@hopechristianct",
    external: true,
  },
  { label: "Sermons", href: "/sermons" },
];

const GIVE_URL =
  "https://onrealm.org/HopeChristianChurch/-/give/now";

/* ------------------------------------------------------------------ */
/*  Chevron Icon                                                       */
/* ------------------------------------------------------------------ */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hamburger / Close Icon                                             */
/* ------------------------------------------------------------------ */

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-6 h-5 flex flex-col justify-between">
      <span
        className={`block h-[2px] rounded-full bg-current transition-all duration-300 origin-center ${
          open ? "rotate-45 translate-y-[9px]" : ""
        }`}
      />
      <span
        className={`block h-[2px] rounded-full bg-current transition-all duration-300 ${
          open ? "opacity-0 scale-x-0" : ""
        }`}
      />
      <span
        className={`block h-[2px] rounded-full bg-current transition-all duration-300 origin-center ${
          open ? "-rotate-45 -translate-y-[9px]" : ""
        }`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop Dropdown                                                   */
/* ------------------------------------------------------------------ */

function DesktopDropdown({
  items,
  isOpen,
}: {
  items: DropdownItem[];
  isOpen: boolean;
}) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
        isOpen
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-2"
      }`}
    >
      <div className="bg-white rounded-lg shadow-[0_8px_32px_rgba(26,35,50,0.12)] border border-[#f0ece4] min-w-[200px] py-2 overflow-hidden">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-5 py-2.5 text-[0.9rem] text-[#1a1a1a] hover:bg-[#faf8f5] hover:text-[#c8953e] transition-colors duration-200 font-medium"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header Component                                                   */
/* ------------------------------------------------------------------ */

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* -- Scroll listener -------------------------------------------- */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* -- Lock body scroll when mobile menu is open ------------------- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* -- Dropdown hover handlers with delay -------------------------- */
  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  /* -- Computed styles -------------------------------------------- */
  const headerBg = scrolled
    ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
    : "bg-gradient-to-b from-[#1a2332]/60 to-transparent";

  const textColor = scrolled ? "text-[#1a2332]" : "text-white";
  const logoFilter = scrolled ? "" : "brightness-0 invert";

  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="section-padding">
          <div className="container-wide flex items-center justify-between h-20">
            {/* ---- Logo ---- */}
            <Link href="/" className="relative z-10 flex items-center gap-3">
              <Image
                src="/ope.png"
                alt="Hope Christian Church"
                width={60}
                height={60}
                className={`w-14 h-14 md:w-16 md:h-16 object-contain transition-all duration-300 ${logoFilter}`}
                priority
              />
              <div className={`hidden sm:block transition-colors duration-300 ${textColor}`}>
                <span className="font-heading text-xl leading-tight block">
                  Hope Christian
                </span>
                <span className="text-[0.75rem] tracking-[0.15em] uppercase font-medium opacity-70">
                  Church
                </span>
              </div>
            </Link>

            {/* ---- Desktop Navigation ---- */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                if (item.dropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(item.label)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <button
                        className={`flex items-center gap-1.5 px-4 py-2 text-[0.9rem] font-medium transition-colors duration-200 rounded-md hover:bg-white/10 ${textColor}`}
                        aria-expanded={openDropdown === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown
                          className={`transition-transform duration-200 ${
                            openDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <DesktopDropdown
                        items={item.dropdown}
                        isOpen={openDropdown === item.label}
                      />
                    </div>
                  );
                }

                const linkProps = item.external
                  ? { target: "_blank" as const, rel: "noopener noreferrer" }
                  : {};

                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`px-4 py-2 text-[0.9rem] font-medium transition-colors duration-200 rounded-md hover:bg-white/10 ${textColor}`}
                    {...linkProps}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* ---- Right Actions ---- */}
            <div className="flex items-center gap-3">
              <a
                href={GIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-[#c8953e] text-white text-[0.85rem] font-semibold rounded-lg tracking-wide hover:bg-[#b8842e] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(200,149,62,0.35)] hover:-translate-y-px"
              >
                Give
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </a>

              {/* ---- Mobile Toggle ---- */}
              <button
                className={`lg:hidden relative z-10 p-2.5 rounded-lg transition-all duration-300 ${
                  scrolled || mobileOpen
                    ? "text-[#1a2332]"
                    : "text-white bg-[#1a2332]/30 backdrop-blur-sm"
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <MenuIcon open={mobileOpen} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/*  Mobile Menu Overlay                                              */}
      {/* ================================================================ */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#1a2332]/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-24 pb-8 px-8 overflow-y-auto">
            <nav className="flex flex-col gap-1 flex-1">
              {NAV_ITEMS.map((item) => {
                if (item.dropdown) {
                  const isExpanded = mobileExpanded === item.label;
                  return (
                    <div key={item.label}>
                      <button
                        className="flex items-center justify-between w-full py-3 text-[1.1rem] font-medium text-[#1a2332] hover:text-[#c8953e] transition-colors"
                        onClick={() =>
                          setMobileExpanded(isExpanded ? null : item.label)
                        }
                        aria-expanded={isExpanded}
                      >
                        {item.label}
                        <ChevronDown
                          className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pl-4 pb-2 border-l-2 border-[#f0ece4] ml-2">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block py-2.5 text-[0.95rem] text-[#6b6561] hover:text-[#c8953e] transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                const linkProps = item.external
                  ? { target: "_blank" as const, rel: "noopener noreferrer" }
                  : {};

                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="py-3 text-[1.1rem] font-medium text-[#1a2332] hover:text-[#c8953e] transition-colors"
                    onClick={() => setMobileOpen(false)}
                    {...linkProps}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Give Button */}
            <div className="mt-8 pt-6 border-t border-[#f0ece4]">
              <a
                href={GIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#c8953e] text-white font-semibold rounded-lg text-[0.95rem] hover:bg-[#b8842e] transition-all"
              >
                Give Online
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </a>
            </div>

            {/* Mobile Contact */}
            <div className="mt-6 text-center">
              <p className="text-[0.8rem] text-[#9a948e]">
                North Haven, CT &middot; (203) 234-7328
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
