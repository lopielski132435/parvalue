// Par Value — Golf Equipment Catalog
// Category → Brand → Models, plus optional specs per category
// Last updated: 2026-06-29 — update this whenever new models are added

export const OTHER = '__other__'

export const CATEGORIES = [
  { id: 'wood',   label: 'Woods' },
  { id: 'iron',   label: 'Irons' },
  { id: 'wedge',  label: 'Wedges' },
  { id: 'putter', label: 'Putters' },
]

export const BRANDS = {
  wood: [
    'Adams Golf', 'Benross', 'Ben Hogan', 'Callaway', 'Cleveland', 'Cobra',
    'Daiwa', 'Fourteen Golf', 'Honma', 'Lynx Golf', 'MacGregor', 'Mizuno',
    'Nike Golf', 'Nickent', 'Ping', 'PXG', 'Srixon', 'TaylorMade',
    'Titleist', 'Tour Edge', 'Wilson Staff', 'Yonex',
  ],
  iron: [
    'Adams Golf', 'Ben Hogan', 'Bridgestone Golf', 'Callaway', 'Cleveland',
    'Cobra', 'Daiwa', 'Fourteen Golf', 'Honma', 'MacGregor', 'Miura',
    'Mizuno', 'Nike Golf', 'Ping', 'PXG', 'Srixon', 'Sub 70', 'Takomo',
    'TaylorMade', 'Titleist', 'Tour Edge', 'Wilson Staff', 'Yonex',
  ],
  wedge: [
    'Ben Hogan', 'Callaway', 'Cleveland', 'Cobra', 'Edel', 'Fourteen Golf',
    'Mizuno', 'Ping', 'PXG', 'Scratch Golf', 'Srixon', 'TaylorMade',
    'Titleist', 'Vokey', 'Tour Edge', 'Wilson Staff',
  ],
  putter: [
    'Bettinardi', 'Bobby Grace', 'Callaway', 'Cleveland', 'Cobra', 'Edel',
    'Evnroll', 'Guerin Rife', 'L.A.B. Golf', 'MacGregor', 'Never Compromise',
    'Odyssey', 'Ping', 'Piretti', 'PXG', 'Ray Cook', 'Scotty Cameron',
    'SeeMore', 'TaylorMade', 'Titleist', 'Wilson Staff', 'Yes! Golf',
  ],
}

export const MODELS = {
  wood: {
    'Callaway': [
      'Paradym Ai Smoke Driver', 'Paradym Ai Smoke Triple Diamond Driver',
      'Paradym Driver', 'Paradym Triple Diamond Driver',
      'Rogue ST Max Driver', 'Rogue ST Max D Driver', 'Rogue ST Triple Diamond Driver',
      'Epic Max Driver', 'Epic Speed Driver', 'Epic Flash Driver',
      'Paradym Ai Smoke Fairway', 'Paradym Fairway', 'Rogue ST Max Fairway',
      'Paradym Ai Smoke Hybrid', 'Paradym Hybrid', 'Rogue ST Max Hybrid',
    ],
    'Cobra': [
      'Darkspeed X Driver', 'Darkspeed LS Driver', 'Darkspeed Max Driver',
      'Aerojet Driver', 'Aerojet LS Driver', 'Aerojet Max Driver',
      'LTDx Driver', 'LTDx LS Driver', 'LTDx Max Driver',
      'Darkspeed X Fairway', 'Aerojet Fairway', 'LTDx Fairway',
      'Darkspeed Hybrid', 'Aerojet Hybrid',
    ],
    'Honma': [
      'TR20 Driver', 'TR21 Driver', 'TR22 Driver',
      'XP-1 Driver', 'Beres Driver',
      'TR20 Fairway', 'TR21 Fairway', 'TR22 Fairway',
    ],
    'Mizuno': [
      'ST-X 220 Driver', 'ST-Z 220 Driver', 'ST-G 220 Driver',
      'ST-Max 230 Driver', 'ST-X 230 Driver', 'ST-Z 230 Driver',
      'ST-X Fairway', 'ST-Z Fairway',
    ],
    'Ping': [
      'G430 Max Driver', 'G430 Max 10K Driver', 'G430 SFT Driver', 'G430 LST Driver',
      'G425 Max Driver', 'G425 SFT Driver', 'G425 LST Driver',
      'G410 Plus Driver', 'G410 SFT Driver', 'G410 LST Driver',
      'G430 Max Fairway', 'G430 SFT Fairway', 'G425 Max Fairway',
      'G430 Hybrid', 'G425 Hybrid', 'G410 Hybrid',
    ],
    'PXG': [
      '0811 XF Gen6 Driver', '0811 X Gen6 Driver', '0811 XF Gen5 Driver',
      '0811 X Gen5 Driver', '0811 Gen4 Driver',
      '0341 XF Gen6 Fairway', '0341 X Gen6 Fairway',
      '0317 XF Gen6 Hybrid',
    ],
    'Srixon': [
      'ZX5 Mk II Driver', 'ZX7 Mk II Driver',
      'ZX5 Driver', 'ZX7 Driver',
      'ZX Mk II Fairway', 'ZX Fairway',
      'ZX Mk II Hybrid', 'ZX Hybrid',
    ],
    'TaylorMade': [
      'Qi10 Driver', 'Qi10 Max Driver', 'Qi10 LS Driver',
      'Stealth 2 Driver', 'Stealth 2 Plus Driver', 'Stealth 2 HD Driver',
      'Stealth Driver', 'Stealth Plus Driver', 'Stealth HD Driver',
      'SIM2 Driver', 'SIM2 Max Driver', 'SIM2 Max D Driver',
      'SIM Driver', 'SIM Max Driver', 'SIM Max D Driver',
      'Qi10 Fairway', 'Stealth 2 Fairway', 'Stealth Fairway',
      'Qi10 Rescue', 'Stealth 2 Rescue', 'Stealth Rescue',
    ],
    'Titleist': [
      'TSR4 Driver', 'TSR3 Driver', 'TSR2 Driver', 'TSR1 Driver',
      'TSi4 Driver', 'TSi3 Driver', 'TSi2 Driver', 'TSi1 Driver',
      'TS4 Driver', 'TS3 Driver', 'TS2 Driver', 'TS1 Driver',
      'TSR3 Fairway', 'TSR2 Fairway', 'TSR1 Fairway',
      'TSi3 Fairway', 'TSi2 Fairway',
      'TSR Hybrid', 'TSi Hybrid',
    ],
    'Yonex': [
      'Ezone GS Driver', 'Ezone Elite 4 Driver',
    ],
    'Cleveland': [
      'Launcher XL Driver', 'Launcher HB Turbo Driver',
      'Launcher XL Fairway', 'Launcher HB Turbo Fairway',
    ],
  },

  iron: {
    'Ben Hogan': [
      'PTx Pro Irons', 'PTx Irons', 'Ft. Worth 15 Irons', 'APEX Irons',
    ],
    'Callaway': [
      'Apex Pro 24 Irons', 'Apex 24 Irons', 'Apex MB 24 Irons', 'Apex CB 24 Irons',
      'Paradym Ai Smoke Irons', 'Paradym Ai Smoke HL Irons',
      'Rogue ST Max Irons', 'Rogue ST Max OS Irons', 'Rogue ST Pro Irons',
      'Apex Pro 21 Irons', 'Apex 21 Irons', 'Apex MB 21 Irons', 'Apex DCB 21 Irons',
      'X Forged CB 21 Irons', 'X Forged 21 Irons',
    ],
    'Cleveland': [
      'ZipCore XL Irons', 'ZipCore Irons',
      'Launcher XL Halo Irons', 'Launcher Turbo HB Irons',
    ],
    'Cobra': [
      'Darkspeed X Irons', 'Darkspeed Irons',
      'Aerojet Irons', 'Aerojet Max Irons',
      'King Tour CB Irons', 'King Tour MB Irons',
      'King Forged Tec One Length Irons',
    ],
    'Honma': [
      'TW757 P Irons', 'TW757 V Irons', 'TW757 Irons',
      'TR20 P Irons', 'TR20 V Irons', 'TR20 B Irons',
      'Beres IE-01 Irons',
    ],
    'Miura': [
      'MC-501 Irons', 'MB-101 Irons', 'CB-301 Irons', 'CB-57 Irons',
      'TC-201 Irons', 'IC-601 Irons', 'PP-9003 Irons',
    ],
    'Mizuno': [
      'Pro 241 Irons', 'Pro 245 Irons', 'Pro 243 Irons', 'Pro 225 Irons', 'Pro 223 Irons',
      'JPX 923 Forged Irons', 'JPX 923 Tour Irons', 'JPX 923 Hot Metal Irons', 'JPX 923 Hot Metal Pro Irons',
      'JPX 921 Forged Irons', 'JPX 921 Tour Irons', 'JPX 921 Hot Metal Irons',
    ],
    'Ping': [
      'i230 Irons', 'i525 Irons', 'i59 Irons',
      'G430 Irons', 'G425 Irons',
      'Blueprint T Irons', 'Blueprint S Irons', 'Blueprint Irons',
      'ZB Forged Irons',
    ],
    'PXG': [
      '0311 XP Gen6 Irons', '0311 P Gen6 Irons', '0311 T Gen6 Irons', '0311 ST Gen6 Irons',
      '0311 XP Gen5 Irons', '0311 P Gen5 Irons', '0311 T Gen5 Irons',
      '0311 Gen4 Irons', '0311 P Gen4 Irons',
    ],
    'Srixon': [
      'ZX5 Mk II Irons', 'ZX7 Mk II Irons',
      'ZX5 Irons', 'ZX7 Irons', 'ZX Utility Irons',
      'Z 785 Irons', 'Z 585 Irons',
    ],
    'Sub 70': [
      '699 Pro Irons', '699 Irons', '639 CB Irons',
      '749 CB Irons', '9000 SL Irons',
    ],
    'TaylorMade': [
      'P7MB Irons', 'P7MC Irons', 'P790 Irons', 'P770 Irons',
      'P7CB Irons', 'P7TW Irons',
      'Qi10 Irons', 'Stealth 2 HD Irons', 'Stealth 2 Irons',
      'SIM2 Max Irons', 'SIM2 Max OS Irons',
    ],
    'Titleist': [
      'T100 Irons', 'T100S Irons', 'T150 Irons', 'T200 Irons', 'T350 Irons',
      'T100 2023 Irons', 'T200 2023 Irons',
      '620 MB Irons', '620 CB Irons', '620 AP1 Irons', '620 AP2 Irons', '620 AP3 Irons',
      '718 MB Irons', '718 CB Irons', '718 AP1 Irons', '718 AP2 Irons', '718 AP3 Irons',
    ],
    'Wilson Staff': [
      'Dynapower Forged Irons', 'Dynapower Irons',
      'D9 Forged Irons', 'D9 Irons',
      'Model CB Irons', 'Model MB Irons',
    ],
  },

  wedge: {
    'Callaway': [
      'Jaws Raw Full Face Wedge', 'Jaws Raw Wedge',
      'Mack Daddy CB Wedge', 'Mack Daddy 5 Jaws Wedge',
      'PM Grind 19 Wedge',
    ],
    'Cleveland': [
      'RTX 6 ZipCore Wedge', 'RTX 6 ZipCore Full Face Wedge',
      'RTX ZipCore Wedge', 'RTX ZipCore Full Face Wedge',
      'RTX4 Wedge', 'RTX4 Full Face Wedge',
      'Smart Sole Full Face Wedge', 'CBX4 Zipcore Wedge',
    ],
    'Cobra': [
      'King MIM Wedge', 'King Cobra Wedge',
    ],
    'Edel': [
      'EAS 5.0 Wedge', 'EAS 3.0 Wedge',
      'SMS Wedge', 'E-1 Wedge',
    ],
    'Ping': [
      'Glide 4.0 Wedge', 'Glide 4.0 ES Wedge',
      'Glide 3.0 Wedge', 'Glide 3.0 ES Wedge',
      's159 Wedge', 's55 Wedge',
    ],
    'PXG': [
      '0311 XW Gen6 Wedge', '0311 XP Gen6 Wedge',
      '0311 XW Gen5 Wedge', '0311 ST Wedge',
    ],
    'TaylorMade': [
      'MG4 Wedge', 'MG4 TW Grind Wedge',
      'MG3 Wedge', 'MG3 TW Grind Wedge',
      'Hi-Toe 3 Wedge', 'Hi-Toe Raw Wedge',
    ],
    'Titleist': [
      'Vokey SM10 Wedge', 'Vokey SM9 Wedge', 'Vokey SM8 Wedge',
      'Vokey SM7 Wedge', 'Vokey SM6 Wedge',
      'Vokey WedgeWorks SM10 Wedge',
    ],
    'Vokey': [
      'SM10 Wedge', 'SM9 Wedge', 'SM8 Wedge',
      'SM7 Wedge', 'SM6 Wedge',
      'WedgeWorks SM10 Wedge',
    ],
  },

  putter: {
    'Bettinardi': [
      'BB1 Putter', 'BB8 Putter', 'BB56 Putter',
      'Studio Stock 3 Putter', 'Studio Stock 28 Putter',
      'Queen B 6 Putter', 'Queen B 8 Putter',
      'Inovai 6.0 Putter', 'Inovai 8.0 Putter',
    ],
    'Callaway': [
      'Odyssey Ai-ONE Putter', 'Odyssey Ai-ONE Milled Putter',
      'Odyssey White Hot OG Putter', 'Odyssey White Hot Versa Putter',
      'Odyssey Ten Putter', 'Odyssey Toulon Design Putter',
    ],
    'Cleveland': [
      'HB Soft Milled Putter', 'Frontline Elite Putter',
      'Frontline 2.0 Putter',
    ],
    'Cobra': [
      'King 3D Printed Agera Putter', 'King 3D Printed Grandsport Putter',
      'King Vintage Putter', 'King Supersport-35 Putter',
    ],
    'Edel': [
      'EAS 5.0 Putter', 'SMS Putter',
      'Torque Balanced Putter',
    ],
    'Evnroll': [
      'ER2B Putter', 'ER5B Putter', 'ER7 Putter',
      'ER8 Putter', 'ER11 Putter',
    ],
    'L.A.B. Golf': [
      'Link.1 Putter', 'Mezz.1 Max Putter',
      'DF 2.1 Putter', 'Directed Force 2.1 Putter',
    ],
    'Odyssey': [
      'Ai-ONE Putter', 'Ai-ONE Milled Putter', 'Ai-ONE Cruiser Putter',
      'White Hot OG Putter', 'White Hot Versa Putter',
      'Ten Putter', 'Toulon Design Putter',
      'Tri-Hot 5K Putter', 'DFX Putter',
    ],
    'Ping': [
      'PLD Milled Putter', 'PLD Milled Anser Putter',
      'G Le3 Putter', '2023 Piper Putter',
      'Sigma 2 Putter', 'Vault 2.0 Putter',
      'Heppler Putter', 'DS72 Putter',
    ],
    'PXG': [
      '0211 Putter', '0311 Putter',
      'Sugar Creek Putter', 'Darkness Putter',
      'Battle Ready Midnight Putter', 'Battle Ready Putter',
    ],
    'Scotty Cameron': [
      'Phantom X 5 Putter', 'Phantom X 5.5 Putter',
      'Phantom X 7 Putter', 'Phantom X 7.5 Putter',
      'Phantom X 11 Putter', 'Phantom X 11.5 Putter',
      'Special Select Newport Putter', 'Special Select Newport 2 Putter',
      'Special Select Squareback 2 Putter', 'Special Select Flowback 5 Putter',
      'Special Select Del Mar Putter',
      'Select Newport 2 Putter', 'Select Newport 3 Putter',
      'Select Fastback 1.5 Putter', 'Select Squareback 2 Putter',
      'Caledonia Putter', 'Jet Set Putter',
    ],
    'TaylorMade': [
      'Spider GT Max Putter', 'Spider GT Rollback Putter',
      'Spider EX Putter', 'Spider EX Flow Neck Putter',
      'TP Reserve M47 Putter', 'TP Reserve B11 Putter',
      'TP Hydro Blast Putter', 'Pix 2 Putter',
      'Truss TM1 Putter', 'Truss TB1 Putter',
    ],
    'Titleist': [
      'Scotty Cameron Phantom X Putter',
      'Scotty Cameron Special Select Putter',
    ],
    'Wilson Staff': [
      'Infinite Putter', 'Staff Model Blade Putter',
      'Staff Model Putter',
    ],
  },
}

// Optional spec fields per category
export const SPECS = {
  wood: [
    { id: 'loft',       label: 'Loft', type: 'select', options: ['7°','8°','8.5°','9°','9.5°','10°','10.5°','11°','11.5°','12°','13°','13.5°','14°','15°','16°','16.5°','17°','18°','19°','20°','21°','22°','23°','24°','25°'] },
    { id: 'flex',       label: 'Shaft flex', type: 'select', options: ['Extra Stiff (X)','Stiff (S)','Regular (R)','Senior (A)','Ladies (L)'] },
    { id: 'shaft',      label: 'Shaft model', type: 'text', placeholder: 'e.g. Ventus Blue 6S' },
    { id: 'grip',       label: 'Grip', type: 'text', placeholder: 'e.g. Golf Pride Tour Velvet' },
    { id: 'grip_size',  label: 'Grip size', type: 'select', options: ['Undersize','Standard','Midsize','Oversize/Jumbo'] },
  ],
  iron: [
    { id: 'set_config', label: 'Set configuration', type: 'text', placeholder: 'e.g. 4-PW, 5-PW, 4-GW' },
    { id: 'flex',       label: 'Shaft flex', type: 'select', options: ['Extra Stiff (X)','Stiff (S)','Regular (R)','Senior (A)','Ladies (L)'] },
    { id: 'shaft',      label: 'Shaft model', type: 'text', placeholder: 'e.g. KBS Tour 120, True Temper Dynamic Gold' },
    { id: 'lie_angle',  label: 'Lie angle', type: 'select', options: ['Standard','1° Flat','2° Flat','3° Flat','1° Upright','2° Upright','3° Upright'] },
    { id: 'grip',       label: 'Grip', type: 'text', placeholder: 'e.g. Golf Pride MCC Plus4' },
    { id: 'grip_size',  label: 'Grip size', type: 'select', options: ['Undersize','Standard','Midsize','Oversize/Jumbo'] },
  ],
  wedge: [
    { id: 'loft',       label: 'Loft', type: 'select', options: ['46°','48°','50°','52°','54°','56°','58°','60°','62°','64°'] },
    { id: 'bounce',     label: 'Bounce', type: 'select', options: ['Low (4°–6°)','Mid (8°–10°)','High (12°–14°)','Full Sole (16°+)'] },
    { id: 'grind',      label: 'Grind', type: 'text', placeholder: 'e.g. F Grind, M Grind, S Grind' },
    { id: 'flex',       label: 'Shaft flex', type: 'select', options: ['Extra Stiff (X)','Stiff (S)','Regular (R)'] },
    { id: 'shaft',      label: 'Shaft model', type: 'text', placeholder: 'e.g. True Temper Dynamic Gold' },
    { id: 'grip',       label: 'Grip', type: 'text', placeholder: 'e.g. Golf Pride Tour Velvet 58' },
    { id: 'grip_size',  label: 'Grip size', type: 'select', options: ['Undersize','Standard','Midsize','Oversize/Jumbo'] },
  ],
  putter: [
    { id: 'length',     label: 'Length', type: 'select', options: ['32"','33"','33.5"','34"','34.5"','35"','35.5"','36"'] },
    { id: 'head_style', label: 'Head style', type: 'select', options: ['Blade','Mid-mallet','Mallet','High-MOI mallet','Face-balanced'] },
    { id: 'hosel',      label: 'Hosel type', type: 'select', options: ['Plumber neck','Slant neck','Double bend','Center shaft','Face balanced','Armlock'] },
    { id: 'grip',       label: 'Grip', type: 'text', placeholder: 'e.g. SuperStroke Traxion Pistol GT' },
    { id: 'grip_size',  label: 'Grip size', type: 'select', options: ['Slim 2.0','3.0','5.0','Standard','Midsize','Oversize'] },
  ],
}

// Condition options (shared across all categories)
export const CONDITIONS = [
  { id: 'new',       label: 'New' },
  { id: 'like_new',  label: 'Used – Like New' },
  { id: 'good',      label: 'Used – Good' },
  { id: 'fair',      label: 'Used – Fair' },
]
