/**
 * THE BRIDE'S SIDE — the Roda family card (Janhavi / Guddu, Jaipur).
 *
 * Every word here is translated from the printed bride-side invitation
 * ("Guddu - Avi.pdf"). The groom's side is a different card with a different
 * host family, living in its own project and deployed to its own link — the
 * two are deliberately kept apart so neither can drift into the other.
 *
 * Where the printed card is in Hindi, the English wording is a faithful
 * rendering, with the Hindi term kept alongside it wherever guests would
 * recognise the ritual by its own name (Vivah Hath, Chaak-Bhaat, Mayra…).
 */

export const meta = {
  /** Who this card is sent on behalf of. */
  side: "The Roda Family · Jaipur",
  invocation: "Shri Ganeshay Namah",
  occasion: "Mangal Parinayotsav",
  occasionEnglish: "The Auspicious Wedding Celebration",
} as const;

/**
 * `primary` is the name set large everywhere on the card; `secondary` is the
 * one that sits under it in script and in brackets. The printed invitation
 * leads with the pet names — Guddu (Janhavi), Avi (Bhavesh) — but the family
 * asked for the given names to lead on the site, so the two are the other way
 * round here. Swap the values back in this one place to reverse it; nothing
 * else in the card needs to change.
 */
export const couple = {
  bride: {
    primary: "Janhavi",
    secondary: "Guddu",
    honorific: "Ayushmati",
    role: "The Bride",
    side: "Vadhu Paksh",
    sideEnglish: "Bride's Side",
    portrait: "/art/bride.jpg",
    city: "Jaipur",
    lineage: [
      "Daughter of Smt. Pinky & Late Shri Ashok Ji Roda",
      "Granddaughter of Late Smt. Geeta Devi & Late Shri Om Prakash Ji Roda",
    ],
  },
  groom: {
    primary: "Bhavesh",
    secondary: "Avi",
    honorific: "Ayushman",
    role: "The Groom",
    side: "Var Paksh",
    sideEnglish: "Groom's Side",
    portrait: "/art/groom.jpg",
    city: "Jodhpur",
    lineage: [
      "Son of Smt. Vandana Rai & Shri Praveen Rai Ji",
      "Grandson of Late Smt. Nirmala Rai & Late Shri Prakash Rai Ji",
    ],
  },
} as const;

/**
 * The wedding day — this drives the countdown. Kept as a string so it only
 * becomes a Date on the client; a module-level `new Date()` would be frozen
 * at prerender time under Cache Components.
 */
export const WEDDING_ISO = "2026-11-20T21:00:00+05:30";

export const shlokas = {
  /** From the programme page of the card. */
  ganesh: {
    lines: [
      "Vighna Haran Mangal Karan, Gannayak Ganraj",
      "Pratham Nimantran Aapko, Sakal Sudharo Kaj",
    ],
    english:
      "Remover of obstacles, bringer of all that is auspicious — the first invitation is yours, O Ganaraj. Let every task be set right.",
  },
  /** From the invitation page of the card. */
  vishnu: {
    lines: [
      "Mangalam Bhagwan Vishnu, Mangalam Garudadhwajah",
      "Mangalam Pundarikakshah, Mangalaya Tano Harih",
    ],
    english:
      "Auspicious is Lord Vishnu, auspicious He of the Garuda banner; auspicious the lotus-eyed one — may Hari grant us auspiciousness.",
  },
} as const;

export const invitation = {
  lead: "With the boundless grace of the Supreme",
  hosts: "Smt. Pinky & Late Shri Ashok Ji Roda",
  hostsRelation: "request the honour of your presence at the marriage of their daughter",
  joiner: "with",
  closing:
    "We invite you most warmly to this sweet hour. Through our traditions, our blessings, our welcome and our regard, may every dear one join in our family's happiness and make our joy complete.",
} as const;

/**
 * The elders who are no longer with us — Janhavi's nani-nana and dadi-dada —
 * blessing the couple from above. This sits between the invitation and the
 * couple, exactly where a printed card invokes its swargiya elders.
 *
 * `ratio` is the artwork's own aspect — the frame is built from it, and the
 * edges dissolve into the wine ground rather than cropping. Swap the file
 * and update this number.
 */
export const blessings = {
  src: "/bride/familyBlessing.jpeg",
  alt: "Janhavi and Bhavesh seated with folded hands as their late grandparents bless them from the heavens above",
  kicker: "Swargiya Ashirwad",
  title: "Blessings From Above",
  sub: "The hands that raised her, raised once more in blessing.",
  caption: "Watching Over Us",
  captionEnglish: "Absent from the mandap, present in every prayer",
  /** The two pairs of elders in the artwork, labelled as the family says them. */
  names: [
    {
      label: "Her Dadi & Dada",
      line: "Late Smt. Geeta Devi & Late Shri Om Prakash Ji Roda",
    },
    {
      label: "Her Nani & Nana",
      line: "Late Smt. Pushpa Devi & Late Shri Sitaram Ji Sunalia",
    },
  ],
  ratio: "1024 / 1536",
} as const;

export type RitualItem = {
  id: string;
  /** The name guests will recognise. */
  name: string;
  /** Plain-English gloss of what happens. */
  english: string;
  day: string;
  date: string;
  /** Short form for the date pill, e.g. "10 Nov". */
  dateShort: string;
  time: string;
  blurb: string;
  venue: string;
  image: string;
  imageAlt: string;
  /**
   * CSS object-position for the card crop, e.g. "50% 38%". The cards are
   * landscape, so a portrait photograph gets a horizontal band taken out of
   * its middle; set this to pull the crop towards the faces. Defaults to
   * centre when omitted.
   */
  focus?: string;
  /** Calendar block in UTC — the ICS builder reads these directly. */
  calStart: string;
  calEnd: string;
};

/**
 * The full Vaivahik Karyakram, in the order printed on the card.
 *
 * Times are exactly as printed. The card gives Paanigrahan Sanskar only as
 * "shubh lagnanusar" (at the auspicious hour), so its calendar block assumes
 * 9:00 PM IST — change `calStart` / `calEnd` once the muhurat is fixed.
 */
export const rituals: RitualItem[] = [
  {
    id: "vivah-hath",
    name: "Vivah Hath",
    english: "The First Ritual",
    day: "Tuesday",
    date: "10 November 2026",
    dateShort: "10 Nov",
    time: "3:00 PM",
    blurb:
      "Hands on the stone chakki, the first grain ground together — this is where the household begins to turn towards the wedding.",
    venue: "At the residence — Om Niwas, Jaipur",
    image: "/festivities/vivah-hath.png",
    imageAlt: "Janhavi and Bhavesh turning the stone chakki together",
    calStart: "20261110T093000Z",
    calEnd: "20261110T113000Z",
  },
  {
    id: "ganesh-nimantran",
    name: "Ganesh Nimantran",
    english: "The First Invitation",
    day: "Wednesday",
    date: "11 November 2026",
    dateShort: "11 Nov",
    time: "9:00 AM",
    blurb:
      "Before a single card is posted, the first invitation goes to Bappa. Nothing in this house starts without His blessing.",
    venue: "At the residence — Om Niwas, Jaipur",
    image: "/festivities/ganesh-nimantran-2.png",
    imageAlt: "The first wedding invitation offered to Ganesh ji",
    calStart: "20261111T033000Z",
    calEnd: "20261111T053000Z",
  },
  {
    id: "haldi",
    name: "Hald Hath Baan",
    english: "The Haldi",
    day: "Thursday",
    date: "19 November 2026",
    dateShort: "19 Nov",
    time: "10:00 AM",
    blurb:
      "Turmeric on the hands, marigolds everywhere, and absolutely no chance of staying clean. Wear something you don't love.",
    venue: "Bhakhar Paradise, Jaipur",
    image: "/festivities/haldi-2.png",
    imageAlt: "Janhavi glowing with haldi, surrounded by marigolds",
    calStart: "20261119T043000Z",
    calEnd: "20261119T073000Z",
  },
  {
    id: "chaak-bhaat",
    name: "Chaak-Bhaat",
    english: "Blessings from the Maternal Family",
    day: "Thursday",
    date: "19 November 2026",
    dateShort: "19 Nov",
    time: "1:00 PM",
    blurb:
      "The nanihal arrives with gifts, sweets and blessings — the afternoon the mother's family takes over the house.",
    venue: "Bhakhar Paradise, Jaipur",
    image: "/festivities/mayra.png",
    imageAlt: "The maternal family arriving with gifts and blessings",
    calStart: "20261119T073000Z",
    calEnd: "20261119T093000Z",
  },
  {
    id: "sagai-sangeet",
    name: "Sagai & Mahila Sangeet",
    english: "Engagement & Ladies' Sangeet",
    day: "Thursday",
    date: "19 November 2026",
    dateShort: "19 Nov",
    time: "7:30 PM",
    blurb:
      "Two rings exchanged, and then the dhol starts. Come with a song picked out — you will be asked.",
    venue: "Bhakhar Paradise, Jaipur",
    image: "/festivities/engagement.png",
    imageAlt: "The ring ceremony under a floral canopy",
    calStart: "20261119T140000Z",
    calEnd: "20261119T180000Z",
  },
  {
    id: "swaruchi-bhoj",
    name: "Swaruchi Bhoj",
    english: "The Wedding Feast",
    day: "Friday",
    date: "20 November 2026",
    dateShort: "20 Nov",
    time: "7:00 PM onwards",
    blurb:
      "A long table, a longer menu, and every Rajasthani thing you have been meaning to try. Come hungry.",
    venue: "Bhakhar Paradise, Jaipur",
    image: "/festivities/feast.png",
    imageAlt: "The royal wedding feast laid out for guests",
    calStart: "20261120T133000Z",
    calEnd: "20261120T163000Z",
  },
  {
    id: "swagat-baraat",
    name: "Swagat Baraat",
    english: "Welcoming the Baraat",
    day: "Friday",
    date: "20 November 2026",
    dateShort: "20 Nov",
    time: "7:30 PM",
    blurb:
      "The groom's procession reaches our gate — band, dhol, lights and the whole street watching. Be outside for this one.",
    venue: "Bhakhar Paradise, Jaipur",
    image: "/festivities/swagat-baraat.jpg",
    imageAlt:
      "The groom arriving on a decorated white horse as the tilak is applied at the gate",
    // portrait photograph in a landscape card — bias the crop up to the faces
    focus: "50% 38%",
    calStart: "20261120T140000Z",
    calEnd: "20261120T150000Z",
  },
  {
    id: "paanigrahan",
    name: "Paanigrahan Sanskar",
    english: "The Wedding Ceremony",
    day: "Friday",
    date: "20 November 2026",
    dateShort: "20 Nov",
    time: "At the auspicious muhurat",
    blurb:
      "Seven rounds of the sacred fire, one hand placed in another, and a promise that outlasts the night.",
    venue: "Bhakhar Paradise, Jaipur",
    image: "/festivities/paanigrahan.png",
    imageAlt: "Janhavi and Bhavesh hand in hand before the sacred fire",
    calStart: "20261120T153000Z",
    calEnd: "20261120T183000Z",
  },
];

/** The programme grouped by day, which is how the printed card sets it. */
export const programme = [
  {
    id: "day-1",
    day: "Tuesday",
    date: "10 November 2026",
    dayNum: "10",
    month: "November",
    label: "It Begins",
    note: "At the residence",
    items: ["vivah-hath"],
  },
  {
    id: "day-2",
    day: "Wednesday",
    date: "11 November 2026",
    dayNum: "11",
    month: "November",
    label: "Bappa First",
    note: "At the residence",
    items: ["ganesh-nimantran"],
  },
  {
    id: "day-3",
    day: "Thursday",
    date: "19 November 2026",
    dayNum: "19",
    month: "November",
    label: "Colour & Song",
    note: "Bhakhar Paradise",
    items: ["haldi", "chaak-bhaat", "sagai-sangeet"],
  },
  {
    id: "day-4",
    day: "Friday",
    date: "20 November 2026",
    dayNum: "20",
    month: "November",
    label: "The Day Itself",
    note: "Bhakhar Paradise",
    items: ["swaruchi-bhoj", "swagat-baraat", "paanigrahan"],
  },
] as const;

export const venue = {
  name: "Bhakhar Paradise",
  address: ["Narayan Enclave, 200 Feet Road", "Mangyawas, Mansarovar"],
  city: "Jaipur",
  mapQuery:
    "Bhakhar Paradise, Narayan Enclave, 200 Ft Road, Mangyawas, Mansarovar, Jaipur",
} as const;

/** The two household blocks printed at the foot of the programme page. */
export const households = [
  {
    id: "vadhu",
    side: "Vadhu Paksh",
    sideEnglish: "Bride's Side",
    name: "Om Niwas",
    lines: ["Plot No. 30, Chand Nagar Vistar", "Gokulpura, Jhotwara, Jaipur"],
    phones: [
      { display: "94144 33143", tel: "+919414433143" },
      { display: "72300 93761", tel: "+917230093761" },
    ],
  },
  {
    id: "var",
    side: "Var Paksh",
    sideEnglish: "Groom's Side",
    name: "Shri Praveen Rai Ji",
    lines: ["C-102, Mangaldeep Darshan", "Gangna Fanta Pal, Jodhpur"],
    phones: [{ display: "94605 51600", tel: "+919460551600" }],
  },
] as const;

/** Everyone the card names, in the groups it names them in. */
export const families = [
  {
    id: "uttarakanshi",
    title: "Uttarakanshi",
    english: "Awaiting You Most Eagerly",
    members: ["Sajjan Lal Roda"],
    note: "Plot No. 30, Chand Nagar Vistar, Gokulpura, Jhotwara, Jaipur",
  },
  {
    id: "swagatkarta",
    title: "Swagatkarta",
    english: "Your Hosts & Welcome",
    members: ["Rajesh Roda", "Lalit Roda", "Aman Soni"],
  },
  {
    id: "darshanabhilashi",
    title: "Darshanabhilashi",
    english: "Hoping to See You",
    members: [
      "Santosh",
      "Sajjan",
      "Pawan",
      "Makkhan",
      "Hemant",
      "Rajesh",
      "Vijay",
      "Aman",
      "Jay",
      "and the entire Roda Parivar",
    ],
  },
  {
    id: "janwai",
    title: "Janwai Paksh",
    english: "The Son-in-Law's Family",
    members: ["Pushpa Devi — Shri Narendra Ji Bhama"],
    note: "Prayagraj",
  },
  {
    id: "nanihal",
    title: "Nanihal Paksh",
    english: "The Maternal Family",
    members: ["Late Shri Sitaram Ji", "and the entire Sunalia Parivar"],
  },
] as const;

/**
 * The family portrait at the head of the family section.
 * `ratio` is the photograph's own aspect — the frame is built from it so the
 * picture is never cropped. Swap the file and update these two numbers.
 */
export const familyPhoto = {
  src: "/bride/family.jpg",
  alt: "The Roda family together at the ceremony",
  /** Rajasthani for "do come" — the welcome this family would actually say. */
  caption: "Padharo Sa",
  captionEnglish: "Do come — our home is waiting for you",
  ratio: "1119 / 1200",
} as const;

/** The children's invitation printed at the very bottom of the card. */
export const baalManuhar = {
  title: "Baal Manuhar",
  english: "An Invitation from the Children",
  plea: "Come running — running! — to our Didi's wedding!",
  names: [
    "Riyansh",
    "Rutvi",
    "Naman",
    "Disha",
    "Harshika",
    "Krishna",
    "Krishna",
    "and all the little ones",
  ],
} as const;

/** The "Preshak" block from the back of the envelope. */
export const sender = {
  label: "Sent with love by",
  names: ["Sajjan", "Makkhanlal", "Rajesh", "Aman Soni"],
  address: ["Plot No. 30, Chand Nagar Vistar", "Gokulpura, Jhotwara, Jaipur"],
  phones: [
    { display: "94144 33143", tel: "+919414433143" },
    { display: "72300 93761", tel: "+917230093761" },
  ],
} as const;

export const navSections = [
  { id: "home", label: "Home" },
  { id: "invitation", label: "Invitation" },
  { id: "blessings", label: "Blessings" },
  { id: "couple", label: "Couple" },
  { id: "rituals", label: "Rituals" },
  { id: "programme", label: "Programme" },
  { id: "family", label: "Family" },
  { id: "rsvp", label: "RSVP" },
];

export const ritualById = (id: string) => rituals.find((r) => r.id === id);
