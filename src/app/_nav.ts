import { INavData } from '@coreui/angular';

 export const navItems: INavData[] = [
  {
    name: 'My Tasks',
    url: '/admin/my-task',
    iconComponent: { name: 'cil-notes' },
  },
  {
    name: 'WIL',
    url: '/dashboard',
    iconComponent: { name: 'cil-list' },
    children: [
      {
        name: 'Students List',
        url: '/admin/students/students-list',
        // iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Placement Groups',
        url: '/admin/wil/placement-groups-list',
        // iconComponent: { name: 'cil-list' },
      },
      {
        name: 'WIL Companies',
        url: '/admin/wil/wil-companies-list',
        // iconComponent: { name: 'cil-list' },
      },
      {
        name: 'WIL Vacancies',
        url: '/admin/wil/wil-vacancies-list',
        // iconComponent: { name: 'cil-list' },
      },
    ]
  },
  {
    name: 'Form Builder',
    url: '/admin/form-builder/form-builder-list',
    iconComponent: { name: 'cil-file' },
  },
  {
    name: 'Email Templates',
    url: '/admin/email-templates',
    iconComponent: { name: 'cil-at' },
  },
  {
    name: 'Users',
    url: '/dashboard',
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Admins',
        url: '/admin/users/admins',
        // iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Staff Members',
        url: '/admin/users/staff-member',
        // iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Manage User Groups',
        url: '/admin/users/user-group',
        // iconComponent: { name: 'cil-list' },
      },
    ]
  },
  {
    name: 'Analytics',
    url: '/admin/analytics',
    iconComponent: { name: 'cil-bar-chart' },
  },

  {
    name: 'Sandbox Library',
    url: '/admin/sandbox-library/manage',
    iconComponent: { name: 'cil-library' },
  },
  {
    name: 'System',
    url: '/admin/system',
    iconComponent: { name: 'cil-list' },
    children: [
      {
        name: 'AI Agents',
        url: '/admin/system/agent-list',
      }
    ]
  },
  {
    name: 'System Rule',
    url: '/admin/system-rule',
    iconComponent: { name: 'cil-list' },
  },
  {
    name: 'Incident & Reporting',
    url: '/admin/incident-and-reporting',
    iconComponent: { name: 'cil-list' },
  },
  {
    name: 'Need Support',
    url: '/admin/need-support',
    iconComponent: { name: 'cil-info' },
  },
];

// export const navItems: INavData[] = [
//   // {
//   //   name: 'Dashboard',
//   //   url: '/admin/dashboard',
//   //   icon: 'ch-home',
//   //   // icon: 'cil-home',
//   //   // badge: {
//   //   //   variant: 'info',
//   //   //   text: 'NEW'
//   //   // }
//   // },
//   {
//     name: 'My Tasks',
//     url: '/admin/my-task',
//     // icon: 'ch-task'
//     iconComponent: { name: 'ch-ta' },
//     // icon: 'cil-clipboard',
//     // badge: {
//     //   variant: 'info',
//     //   text: 'NEW'
//     // }
//   },
//   // {
//   //   name: 'Students',
//   //   url: '/dashboard',
//   //   icon: 'ch-grads-cap',
//   //   // icon: 'fa fa-graduation-cap',
//   //   children: [
//   //     {
//   //       name: 'Students List',
//   //       url: '/admin/students/students-list',
//   //       icon: 'ch-dot'
//   //     },
//   //     // {
//   //     //   name: 'Resume Review',
//   //     //   url: '/admin/students/resume-review-list',
//   //     //   icon: 'ch-dot'
//   //     // },
//   //   ]
//   // },
//   {
//     name: 'WIL',
//     url: '/dashboard',
//     // icon: 'ch-grads-cap',
//     iconComponent: { name: 'ch-grads-cap' },
//     // icon: 'fa fa-graduation-cap',
//     children: [
//       {
//         name: 'Students List',
//         url: '/admin/students/students-list',
//         // icon: ''
//         iconComponent: { name: 'ch-dot' },
//       },
//       {
//         name: 'Placement Groups',
//         url: '/admin/wil/placement-groups-list',
//         // icon: 'ch-dot'
//          iconComponent: { name: 'ch-dot' },
//       },
//       {
//         name: 'WIL Companies',
//         url: '/admin/wil/wil-companies-list',
//         // icon: 'ch-dot'
//          iconComponent: { name: 'ch-dot' },
//       },
//       {
//         name: 'WIL Vacancies',
//         url: '/admin/wil/wil-vacancies-list',
//         // icon: 'ch-dot'
//          iconComponent: { name: 'ch-dot' },
//       },
//     ]
//   },
//   {
//     name: 'Form Builder',
//     url: '/admin/form-builder/form-builder-list',
//     // icon: 'ch-file',
//      iconComponent: { name: 'ch-file' },
//     // icon: 'cil-file',
//     // badge: {
//     //   variant: 'info',
//     //   text: 'NEW'
//     // }
//   },
//   {
//     name: 'Email Templates',
//     url: '/admin/email-templates',
//     // icon: 'ch-mail',
//      iconComponent: { name: 'ch-mail' },
//     // icon: 'cil-envelope-closed',
//     // badge: {
//     //   variant: 'info',
//     //   text: 'NEW'
//     // }
//   },
//   // {
//   //   name: 'Analytics (Beta)',
//   //   url: '/dashboard',
//   //   icon: 'ch-bar-chart',
//   //   children: [
//   //     {
//   //       name: 'Students (Beta)',
//   //       url: '/admin/analytics/analytics-students',
//   //       icon: 'ch-dot'
//   //     },
//   //     {
//   //       name: 'Companies (Beta)',
//   //       url: '/admin/analytics/analytics-companies',
//   //       icon: 'ch-dot'
//   //     },
//   //   ]
//   // },
//   // {
//   //   name: 'Articles',
//   //   url: '/admin/articles',
//   //   icon: 'ch-book'
//   // },
//   {
//     name: 'Users',
//     url: '/dashboard',
//     // icon: 'ch-user',
//      iconComponent: { name: 'ch-user' },
//     children: [
//       {
//         name: 'Admins',
//         url: '/admin/users/admins',
//         // icon: 'ch-dot'
//          iconComponent: { name: 'ch-dot' },
//       },
//       {
//         name: 'Staff Members',
//         url: '/admin/users/staff-member',
//         // icon: 'ch-dot'
//          iconComponent: { name: 'ch-dot' },
//       },
//       {
//         name: 'Manage User Groups',
//         url: '/admin/users/user-group',
//         // icon: 'ch-dot'
//          iconComponent: { name: 'ch-dot' },
//       },
//     ]
//   },
//   {
//     name: 'Need Support',
//     url: '/admin/need-support',
//     // icon: 'ch-info',
//      iconComponent: { name: 'ch-info' },
//   },
//   // {
//   //   name: 'User Management',
//   //   url: '/dashboard',
//   //   icon: 'icon-user',
//   //   children: [
//   //     {
//   //       name: 'Employer',
//   //       url: '/employersList',
//   //       icon: 'icon-star'
//   //     },
//   //     {
//   //       name: 'Graduate',
//   //       url: '/graduateList',
//   //       icon: 'icon-star'
//   //     },
//   //   ]
//   // },
//   // {
//   //   name: 'Career Resources',
//   //   icon: 'icon-calculator',
//   //   children: [
//   //     {
//   //       name: 'Articles',
//   //       url: '/career-article',
//   //       icon: 'icon-star'
//   //     },
//   //     // {
//   //     //   name: 'Videos',
//   //     //   url: '/career-videos',
//   //     //   icon: 'icon-star'
//   //     // },
//   //   ]
//   // },
//   // {
//   //   name: 'Appointments',
//   //   url: '/calendly',
//   //   icon: 'icon-calendar'
//   // },
//   // {
//   //   name: 'Events',
//   //   url: 'https://www.eventbrite.com/signin',
//   //   icon: 'icon-event'
//   // },
//   // {
//   //   name: 'Sub-admin Management',
//   //   url: '/subAdminManagement',
//   //   icon: 'icon-user'
//   // },
//   // // {
//   // //   name: 'Access Priviledge Management',
//   // //   url: '/dashboard',
//   // //   icon: 'icon-badge'
//   // // },
//   // {
//   //   name: 'Jobs Management',
//   //   url: '/jobsManagement',
//   //   icon: 'icon-user',
//   //   children: [
//   //     {
//   //       name: 'Employer Job Posted',
//   //       url: 'jobsManagement/employerJobs',
//   //       icon: 'icon-star'
//   //     },
//   //     {
//   //       name: 'Graduate Applicants',
//   //       url: 'jobsManagement/graduateJobs',
//   //       icon: 'icon-star'
//   //     },
//   //   ]
//   // },
//   // // {
//   // //   name: 'Industry Management',
//   // //   url: '/categoriesManagement',
//   // //   icon: 'icon-layers'
//   // // },
//   // {
//   //   name: 'Payment Management',
//   //   url: '/paymentManagement',
//   //   icon: 'icon-calculator'
//   // },
//   // {
//   //   name: 'Interview Management',
//   //   url: '/schedule-interview-management',
//   //   icon: 'icon-user'
//   // },
//   // {
//   //   name: 'Offer Management',
//   //   url: '/offer-submissions',
//   //   icon: 'icon-calculator',
//   // },
//   // {
//   //   name: 'Recruitment Solutions Management',
//   //   url: '/recruitment-solutions-management',
//   //   icon: 'icon-user'
//   // },
//   // {
//   //   name: 'Resume Builder Management',
//   //   icon: 'icon-calculator',
//   //   children: [
//   //     {
//   //       name: 'Resume Builder Management',
//   //       url: '/resume-builder-management',
//   //       icon: 'icon-star'
//   //     },
//   //     {
//   //       name: 'Resume Builder Statistics',
//   //       url: '/resume-stat',
//   //       icon: 'icon-pie-chart'
//   //     },
//   //   ]
//   // },
//   // {
//   //   name: 'Content Management',
//   //   url: '/dashboard',
//   //   icon: 'icon-pie-chart',
//   //   children: [
//   //     {
//   //       name: 'Home Page Management',
//   //       url: '/homePageManagement',
//   //       icon: 'icon-home',
//   //       // children: [
//   //       //   {
//   //       //    name: 'Header Section',
//   //       //     url: '/headerSection',
//   //       //     icon: 'icon-star'
//   //       //   },
//   //       //   {
//   //       //    name: 'Our Story Section',
//   //       //     url: '/homeOurStory',
//   //       //     icon: 'icon-star'
//   //       //   },
//   //       //   {
//   //       //    name: 'Something for everyone',
//   //       //     url: '/somethingForEveryone',
//   //       //     icon: 'icon-star'
//   //       //   },
//   //       //   {
//   //       //    name: 'How it Work',
//   //       //     url: '/howItWork',
//   //       //     icon: 'icon-star'
//   //       //   },
//   //       //   {
//   //       //    name: 'Success Story',
//   //       //     url: '/successStorySlider',
//   //       //     icon: 'icon-star'
//   //       //   },
//   //       //   {
//   //       //    name: 'Register Today',
//   //       //     url: '/registerToday',
//   //       //     icon: 'icon-star'
//   //       //   },
//   //       // ]
//   //     },
//   //     {
//   //       name: 'Industry Management',
//   //       // url: '/industryManagement',
//   //       icon: 'icon-star',
//   //       children: [
//   //         {
//   //           name: 'Employer Industry Management',
//   //           url: '/employerIndustryManagement',
//   //           icon: 'icon-star'
//   //         },
//   //         {
//   //           name: 'Graduate Industry Management',
//   //           url: '/graduateIndustryManagement',
//   //           icon: 'icon-star'
//   //         },
//   //       ]
//   //     },


//   //     // {
//   //     //   name: 'Industry Management',
//   //     //   url: '/industryManagement',
//   //     //   icon: 'icon-star', 
//   //     // },
//   //     {
//   //       name: 'How it Works Management',
//   //       icon: 'icon-settings',
//   //       children: [
//   //         {
//   //           name: 'Employer How it Works',
//   //           url: '/editEmployerHowItWorks',
//   //           icon: 'icon-star'
//   //         },
//   //         {
//   //           name: 'Graduate How it Works',
//   //           url: '/editGraduateHowItWorks',
//   //           icon: 'icon-star'
//   //         },
//   //       ]
//   //     },

//   //     {
//   //       name: 'Video Resume Tips Management',
//   //       icon: 'icon-settings',
//   //       children: [
//   //         {
//   //           name: 'Video Intro',
//   //           url: '/videoIntro',
//   //           icon: 'icon-star'
//   //         },
//   //         {
//   //           name: 'Video Intro 1',
//   //           url: '/videoIntro1',
//   //           icon: 'icon-star'
//   //         },
//   //         {
//   //           name: 'Video Intro 2',
//   //           url: '/videoIntro2',
//   //           icon: 'icon-star'
//   //         },
//   //         {
//   //           name: 'Video Intro 3',
//   //           url: '/videoIntro3',
//   //           icon: 'icon-star'
//   //         },
//   //       ]
//   //     },
//   //     {
//   //       name: 'Terms & Conditions',
//   //       url: '/terms-conditions',
//   //       icon: 'icon-list',
//   //     },
//   //     {
//   //       name: 'Privacy Policy',
//   //       url: '/privacy-policy',
//   //       icon: 'icon-lock',
//   //     },
//   //     {
//   //       name: 'About Us',
//   //       url: '/about-us',
//   //       icon: 'icon-info',
//   //     },
//   //   ]
//   // },
//   // {
//   //   name: 'Support Management',
//   //   url: '/offer-management',
//   //   icon: 'icon-support',
//   //   children: [
//   //     {
//   //       name: 'Contact Us',
//   //       url: '/contact-listing',
//   //       icon: 'icon-phone',
//   //     },
//   //     {
//   //       name: 'Recruitment Solution Form',
//   //       url: '/recruitment-solution-form',
//   //       icon: 'icon-phone',
//   //     },
//   //     {
//   //       name: 'FAQs',
//   //       url: '/faqs',
//   //       icon: 'icon-question',
//   //       children: [
//   //         {
//   //           name: 'Employer',
//   //           url: '/employersFaq',
//   //           icon: 'icon-star'
//   //         },
//   //         {
//   //           name: 'Graduate',
//   //           url: '/graduateFaq',
//   //           icon: 'icon-star'
//   //         },
//   //       ]
//   //     },
//   //     {
//   //       name: 'Help Management',
//   //       url: '/help-management',
//   //       icon: 'icon-question',
//   //     },
//   //   ]
//   // },
//   // {
//   //   name: 'Logs',
//   //   url: '/',
//   //   icon: 'icon-support',
//   //   children: [
//   //     {
//   //       name: 'Reports',
//   //       url: '/job-applicants-reports',
//   //       icon: 'cil-notes',
//   //       // children: [

//   //       //      {
//   //       //       name: 'Graduate Applications',
//   //       //       url: '/job-applicants-reports',
//   //       //       icon: 'icon-star'
//   //       //       },
//   //       //       {
//   //       //       name: 'Jobs',
//   //       //       url: '/',
//   //       //       icon: 'icon-star'
//   //       //       }
//   //       //       ,
//   //       //       {
//   //       //       name: 'Messaging',
//   //       //       url: '/',
//   //       //       icon: 'icon-star'
//   //       //       }
//   //       //   ]
//   //     },
//   //     {
//   //       name: 'Verification Submissions',
//   //       url: '/verification-submissions',
//   //       icon: 'icon-phone',
//   //     },
//   //   ]
//   // },
//   // {
//   //   name: 'Search Module',
//   //   icon: 'cil-notes',
//   //   children: [
//   //     {
//   //       name: 'Search Management',
//   //       url: '/search-management',
//   //       icon: 'cil-notes'
//   //     },
//   //     {
//   //       name: 'Graduate',
//   //       url: '/graduate-search',
//   //       icon: 'icon-star'
//   //     },
//   //     {
//   //       name: 'Employer',
//   //       url: '/employer-search',
//   //       icon: 'icon-star'
//   //     },
//   //   ]
//   // },
//   // // {
//   // //   name: 'Offer Management',
//   // //   url: '/offer-management',
//   // //   icon: 'icon-user'
//   // // },
//   // {
//   //   name: 'Graduate Verification Management',
//   //   url: '/graduate-verification-management',
//   //   icon: 'icon-user'
//   // },
//   // {
//   //   name: 'Internship Inquiries',
//   //   url: '/internship-inquiries',
//   //   icon: 'icon-info',
//   // },
//   // {
//   //   divider: true
//   // },
//   // {
//   //   name: 'Skills List',
//   //   url: '/skills-list',
//   //   icon: 'icon-user'
//   // },
//   // {
//   //   title: true,
//   //   name: 'Extras',
//   // },

//   // {
//   //   name: 'Pages',
//   //   url: '/pages',
//   //   icon: 'icon-star',
//   //   children: [
//   //     // {
//   //     //   name: 'Login',
//   //     //   url: '/login',
//   //     //   icon: 'icon-star'
//   //     // },
//   //     {
//   //       name: 'Error 404',
//   //       url: '/404',
//   //       icon: 'icon-star'
//   //     },
//   //     {
//   //       name: 'Error 500',
//   //       url: '/500',
//   //       icon: 'icon-star'
//   //     }
//   //   ]
//   // },
// ];
