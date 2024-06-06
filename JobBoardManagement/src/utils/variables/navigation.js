export const navigation = [
  {
    title: "Dashboard",
    href: "/jobportal/starter",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Management",
    icon: "bi bi-collection",
    children: [
      {
        title: "Alerts",
        href: "/jobportal/alerts",
        icon: "bi bi-bell",
      },
      {
        title: "Blog",
        icon: "bi bi-box",
        children: [
          {
            title: "Category",
            href: "/jobportal/blog-category",
            icon: "bi bi-patch-check",
          },
          {
            title: "List",
            href: "/jobportal/table",
            icon: "bi bi-hdd-stack",
          },
        ],
      },
    ],
  },
  {
    title: "Breadcrumbs",
    href: "/jobportal/breadcrumbs",
    icon: "bi bi-link",
  },
  {
    title: "About",
    href: "/jobportal/about",
    icon: "bi bi-people",
  },
];
