export type NavLink = { label: string; href: string; dropdown?: boolean };

export const mainNav: NavLink[] = [
  { label: "Model 3", href: "/models/model-3" },
  { label: "Model Y", href: "/#model-y" },
  { label: "Cybertruck", href: "/#cybertruck" },
  { label: "Roadster", href: "/#roadster" },
  { label: "Robotaxi", href: "/#robotaxi", dropdown: true },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Загварууд",
    links: [
      { label: "Model 3", href: "/models/model-3" },
      { label: "Cybertruck", href: "/#cybertruck" },
      { label: "Roadster", href: "/#roadster" },
      { label: "Robotaxi", href: "/#robotaxi" },
      { label: "Test drive", href: "#contact" },
    ],
  },
  {
    title: "Компани",
    links: [
      { label: "Бидний тухай", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Investors", href: "#" },
      { label: "News", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Styleguide", href: "/styleguide" },
    ],
  },
];

export const socialLinks = [
  { label: "Facebook", icon: "/assets/icons/facebook.svg", href: "#" },
  { label: "Instagram", icon: "/assets/icons/instagram.svg", href: "#" },
  { label: "X", icon: "/assets/icons/x.svg", href: "#" },
  { label: "LinkedIn", icon: "/assets/icons/linkedin.svg", href: "#" },
  { label: "Youtube", icon: "/assets/icons/youtube.svg", href: "#" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookies Settings", href: "#" },
];
