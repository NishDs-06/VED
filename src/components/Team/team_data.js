/*
 * Team data. Move someone between sections by changing `committee`.
 * Photos live in /public/team as `<img>-sm.webp` (dock, 320px tall) and
 * `<img>.webp` (popup, max 1200px). `w`/`h` are the full photo's pixel size;
 * cards keep that aspect ratio so photos are never cropped.
 * Members without a photo yet (`img: null`) show a black card with initials;
 * add `img`, `w` and `h` once their photo is in /public/team.
 */

export const COMMITTEES = [
    { id: 'core', title: 'Core & Working Committee' },
    { id: 'exec', title: 'Executive Committee' },
    { id: 'faculty', title: 'Teaching Faculty' },
]

export const MEMBERS = [
    {
        id: 'rm', committee: 'core',
        role: 'President', name: 'Raagmanas Madhukar',
        img: 'manas', w: 640, h: 280,
        oneLiner: 'Co-founder. Building VED from the ground up.',
        linkedin: 'https://www.linkedin.com/in/raagmanasmadhukar',
        github: 'https://github.com/Cipher1712',
    },
    {
        id: 'sg', committee: 'core',
        role: 'Vice President', name: 'Siddharth Gaur',
        img: 'sid2', w: 640, h: 324,
        oneLiner: 'Co-founder. Steering vision into execution.',
        linkedin: 'https://www.linkedin.com/in/siddharth-gaur-471084266',
    },
    {
        id: 'gs', committee: 'core',
        role: 'General Secretary', name: 'Akshansh Alawa',
        img: 'akshansh', w: 720, h: 510,
        linkedin: 'https://www.linkedin.com/in/akshansh-alawa-96a82a20a',
    },
    {
        id: 'vu', committee: 'core',
        role: 'Treasurer', name: 'Veer Upadhyay',
        img: 'veer', w: 1200, h: 851,
        linkedin: 'https://www.linkedin.com/in/veer-upadhyay-2111b5318',
    },
    {
        id: 'nd', committee: 'core',
        role: 'Technical Head', name: "Nishanth D'Souza",
        img: 'nd', w: 640, h: 454,
        oneLiner: 'Turns silicon specs into pixels. Built this site.',
        tags: ['Frontend', 'UI/UX', 'React'],
        linkedin: 'https://www.linkedin.com/in/nishds30/',
        github: 'https://github.com/NishDs-06',
    },
    {
        id: 'ak', committee: 'core',
        role: 'Project Head', name: 'Akhil George Kurian',
        img: 'akhil', w: 720, h: 510,
        github: 'https://github.com/Akhil8231',
    },
    {
        id: 'sp', committee: 'core',
        role: 'Research Head', name: 'Sreeparvathy M',
        img: 'sree', w: 640, h: 427,
        linkedin: 'https://www.linkedin.com/in/sreeparvathy-m-4b064930b',
        instagram: 'https://www.instagram.com/sreeparv4thy',
    },
    {
        id: 'hk', committee: 'core',
        role: 'Events Head', name: 'Hafiz Khan G J',
        img: 'hafiz', w: 1200, h: 850,
        linkedin: 'https://www.linkedin.com/in/hafiz-khan-g-j-0777323a8',
    },
    {
        id: 'rj', committee: 'core',
        role: 'Marketing Head', name: 'Riya Joseph',
        img: 'riya', w: 1170, h: 830,
        linkedin: 'https://in.linkedin.com/in/riya-joseph-319244374',
        github: 'https://github.com/riyaelizabethjoseph',
    },
    {
        id: 'fm', committee: 'core',
        role: 'Graphic Design & Media Head', name: 'Farah Manikindi',
        img: 'farah2', w: 800, h: 680,
        tags: ['Design', 'Branding'],
        linkedin: 'https://www.linkedin.com/in/farah-manikindi-fm9',
    },
    {
        id: 'vk', committee: 'core',
        role: 'Social Media Head', name: 'Varshini V',
        img: 'varshini', w: 585, h: 450,
        linkedin: 'https://www.linkedin.com/in/varshini-v-5a45a736a',
        github: 'https://github.com/varshini-v20',
    },
    {
        id: 'sc', committee: 'core',
        role: 'Vice Research Head', name: 'Sharadhi CP',
        img: 'sharadhi', w: 720, h: 510,
        linkedin: 'https://www.linkedin.com/in/sharadhi-cp-53791335a',
        github: 'https://github.com/sharadhi06',
    },
    {
        id: 'jt', committee: 'core',
        role: 'Vice Project Head', name: 'Jeevan Thanu',
        img: 'jeevan', w: 900, h: 680,
        linkedin: 'https://www.linkedin.com/in/jeevan-thanu-399b65375',
        github: 'https://github.com/jeevanthanu836-prog',
    },
    {
        id: 'ex-as-aashi', committee: 'exec',
        role: 'Marketing', name: 'Aashi Singh',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-enj-evan', committee: 'exec',
        role: 'Marketing', name: 'Evan Nikhil Jackson',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-aa-akshaya', committee: 'exec',
        role: 'Marketing', name: 'Akshaya Akula',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-pth-peri', committee: 'exec',
        role: 'Events', name: 'Peri Tripura Haasini',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-ib-ishan', committee: 'exec',
        role: 'Events', name: 'Ishan Bhattacharyya',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-v-venkatram', committee: 'exec',
        role: 'Events', name: 'Venkatram',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-aj-ansh', committee: 'exec',
        role: 'Events', name: 'Ansh Jain',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-vg-virat', committee: 'exec',
        role: 'Events', name: 'Virat Gangineni',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-aa-aarit', committee: 'exec',
        role: 'Graphic Design & Video Editing', name: 'Aarit Aggarwal',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-ap-abhilash', committee: 'exec',
        role: 'Graphic Design & Video Editing', name: 'Abhilash Pradhan',
        img: null, w: 4, h: 5,
    },
    {
        id: 'ex-vk-vaishnavi', committee: 'exec',
        role: 'Graphic Design & Video Editing', name: 'Vaishnavi K',
        img: null, w: 4, h: 5,
    },
    {
        id: 'fa1', committee: 'faculty',
        role: 'Faculty Adviser', name: 'Dr. Shreshta Valasa',
        img: 'shrestamam', w: 640, h: 640,
        qual: 'Ph.D.',
        linkedin: 'https://www.linkedin.com/in/dr-shreshta-valasa-810999258',
    },
    {
        id: 'fa2', committee: 'faculty',
        role: 'Faculty Adviser', name: 'Dr. Bharath Sreenivasulu V',
        img: 'bharatsir', w: 640, h: 512,
        qual: 'Ph.D. · Post-Doc (IIT Patna)',
        linkedin: 'https://www.linkedin.com/in/bharath-sreenivasulu-v-64b4a575',
    },
]
