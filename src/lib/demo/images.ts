/**
 * Verified Unsplash photography used for demo listings.
 * Wrapped in helper so query params stay consistent.
 */
const base = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

export const IMG = {
  photoStudioCyc: base("1471341971476-ae15ff5dd4ea"),
  cameraFlatlay: base("1516035069371-29a1b244cc32"),
  canonDslr: base("1502920917128-1aa500764cbd"),
  polaroid: base("1526170375885-4d8ecf77b99f"),
  filmCamera: base("1500634245200-e5245c7574ef"),
  photographerStreet: base("1493863641943-9b68992a8d07"),
  clapperboard: base("1485846234645-a62644f84728"),
  concertYellow: base("1459749411175-04bf5292ceea"),
  musicRoomGuitars: base("1598488035139-bdbb2231ce04"),
  rehearsalRoom: base("1514320291840-2e0a9bf2a9ae"),
  condenserMic: base("1478737270239-2f02b77fc618"),
  stageMic: base("1516280440614-37939bbacd81"),
  sm7bDark: base("1590602847861-f357a9332bbc"),
  silverMicArt: base("1554446422-d05db23719d2"),
  headphones: base("1487215078519-e21cc028cb29"),
  neonCorridor: base("1500462918059-b1a0cb512f1d"),
  loungeSofa: base("1540574163026-643ea20ade25"),
  glassCorridor: base("1497366754035-f200968a6e72"),
  whiteDaylight: base("1519710164239-da123dc03ef4"),
  moroccanInterior: base("1505577058444-a3dab90d4253"),
  painterDesk: base("1520333789090-1afc82db536a"),
  muralFace: base("1547891654-e66ed7ebb968"),
  galleryWall: base("1554907984-15263bfd63bd"),
  auditorium: base("1587825140708-dfaf72ae4b04"),
} as const;

export type ImgKey = keyof typeof IMG;
