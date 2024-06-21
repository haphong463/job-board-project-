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
        title: "Job",
        icon: "bi bi-bell",
        children: [
          {
            title: "Category",
            href: "/jobportal/job-category",
            icon: "bi bi-patch-check",
          },
        ],
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
    title: "Settings",
    href: "/jobportal/settings",
    icon: "bi bi-gear",
  },
];
