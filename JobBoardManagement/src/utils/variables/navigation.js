export const navigation = [
  {
    title: "Dashboard",
    href: "/jobportal/starter",
    icon: "bi bi-speedometer2",
  },

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
  {
    title: "Quiz",
    icon: "bi bi-box",
    children: [
      {
        title: "Category",
        href: "/jobportal/quiz-category",
        icon: "bi bi-patch-check",
      },
      {
        title: "Quiz&Question",
        href: "/jobportal/quiz",
        icon: "bi bi-hdd-stack",
      },
    ],
  },
  {
    title: "Cv management",
    icon: "bi bi-question-circle",
    href: "/jobportal/cv-management",
  },
  {
    title: "User",
    icon: "bi bi-question-circle",
    href: "/jobportal/user",
  },
  {
    title: "Employer",
    icon: "bi bi-question-circle",
    href: "/jobportal/employer",
  },
  {
    title: "Contact",
    icon: "bi bi-envelope", 
    href: "/jobportal/contact",
  },
  {
    title: "Settings",
    href: "/jobportal/settings",
    icon: "bi bi-gear",
  },
];
