// CORVO — categories and products.
//
// To add a real product: copy one line, give it a new unique id, and list its photos in `images`,
// e.g. images: ["assets/img/products/SH-007-1.jpg", "assets/img/products/SH-007-2.jpg"].
// Products with an empty `images` list show placeholder photos.
// Set sold: true once a piece is gone — it stays visible with a SOLD tag.

window.CATEGORIES = [
  { slug: "shirts",     name: "Shirts",         tag: "Flannels, tees, overshirts",   kw: "shirt,vintage" },
  { slug: "pants",      name: "Pants",          tag: "Denim, cargos, trousers",      kw: "jeans,denim" },
  { slug: "shoes",      name: "Shoes",          tag: "Sneakers, boots, loafers",     kw: "sneakers,boots" },
  { slug: "belts-caps", name: "Belts & Caps",   tag: "Leather belts, vintage caps",  kw: "cap,belt" },
  { slug: "jewelry",    name: "Jewelry",        tag: "Rings, chains, bracelets",     kw: "jewelry,ring" },
  { slug: "antiques",   name: "Antique Pieces", tag: "Old, rare, one of one",        kw: "antique,vintage" },
];

window.PRODUCTS = [
  // SHIRTS
  { id: "SH-001", cat: "shirts", name: "Vintage Flannel Overshirt", price: 2800, size: "L",  condition: "9/10", note: "Heavy brushed cotton, earthy check.", images: [] },
  { id: "SH-002", cat: "shirts", name: "Faded Tour Tee '98",        price: 1800, size: "M",  condition: "8/10", note: "Single stitch, perfect fade.", images: [] },
  { id: "SH-003", cat: "shirts", name: "Oversized Denim Shirt",     price: 3200, size: "XL", condition: "9/10", note: "Boxy fit, mid wash.", images: [] },
  { id: "SH-004", cat: "shirts", name: "Corduroy Button-Up",        price: 2600, size: "M",  condition: "8/10", note: "Fine wale, chocolate brown.", images: [] },
  { id: "SH-005", cat: "shirts", name: "Hawaiian Rayon Shirt",      price: 2200, size: "L",  condition: "9/10", note: "Loud print, soft drape.", images: [], sold: true },
  { id: "SH-006", cat: "shirts", name: "Striped Oxford Shirt",      price: 1900, size: "S",  condition: "10/10", note: "Crisp, barely worn.", images: [] },

  // PANTS
  { id: "PA-001", cat: "pants", name: "Washed Straight Denim",  price: 3500, size: "W32", condition: "9/10", note: "Classic five-pocket, light wash.", images: [] },
  { id: "PA-002", cat: "pants", name: "Utility Cargo Pants",    price: 3800, size: "W34", condition: "8/10", note: "Six pockets, olive ripstop.", images: [] },
  { id: "PA-003", cat: "pants", name: "Pleated Wool Trousers",  price: 3000, size: "W30", condition: "9/10", note: "Double pleat, charcoal.", images: [] },
  { id: "PA-004", cat: "pants", name: "Carpenter Work Pants",   price: 3400, size: "W32", condition: "7/10", note: "Hammer loop, worn-in.", images: [], sold: true },
  { id: "PA-005", cat: "pants", name: "Black Flared Denim",     price: 3600, size: "W30", condition: "9/10", note: "70s flare, deep black.", images: [] },
  { id: "PA-006", cat: "pants", name: "Corduroy Wide Leg",      price: 3100, size: "W32", condition: "8/10", note: "Relaxed, cream colour.", images: [] },

  // SHOES
  { id: "SO-001", cat: "shoes", name: "Retro Court Sneakers",  price: 6500, size: "EU 42", condition: "8/10", note: "Off-white leather, gum sole.", images: [] },
  { id: "SO-002", cat: "shoes", name: "Leather Chelsea Boots", price: 7800, size: "EU 43", condition: "9/10", note: "Dark brown, resoled.", images: [] },
  { id: "SO-003", cat: "shoes", name: "Suede Penny Loafers",   price: 5200, size: "EU 41", condition: "8/10", note: "Tan suede, leather sole.", images: [] },
  { id: "SO-004", cat: "shoes", name: "Canvas High-Tops",      price: 3900, size: "EU 42", condition: "7/10", note: "Black canvas, nicely beaten.", images: [], sold: true },
  { id: "SO-005", cat: "shoes", name: "Vintage Hiking Boots",  price: 6900, size: "EU 44", condition: "8/10", note: "Lug sole, red laces.", images: [] },
  { id: "SO-006", cat: "shoes", name: "Patent Derby Shoes",    price: 5600, size: "EU 42", condition: "9/10", note: "High shine, formal.", images: [] },

  // BELTS & CAPS
  { id: "BC-001", cat: "belts-caps", name: "Western Buckle Belt",   price: 2200, size: "Free",  condition: "8/10", note: "Engraved silver-tone buckle.", images: [] },
  { id: "BC-002", cat: "belts-caps", name: "Braided Leather Belt",  price: 1800, size: "34",    condition: "9/10", note: "Woven brown leather.", images: [] },
  { id: "BC-003", cat: "belts-caps", name: "Washed 6-Panel Cap",    price: 1500, size: "Adj",   condition: "8/10", note: "Sun-faded navy.", images: [] },
  { id: "BC-004", cat: "belts-caps", name: "Corduroy Dad Cap",      price: 1600, size: "Adj",   condition: "9/10", note: "Brass buckle strap.", images: [], sold: true },
  { id: "BC-005", cat: "belts-caps", name: "Wool Flat Cap",         price: 2100, size: "M",     condition: "9/10", note: "Herringbone tweed.", images: [] },
  { id: "BC-006", cat: "belts-caps", name: "Military Webbing Belt", price: 1400, size: "Free",  condition: "8/10", note: "Roller buckle, olive.", images: [] },

  // JEWELRY
  { id: "JW-001", cat: "jewelry", name: "Silver Curb Chain",      price: 4500, size: "50cm",  condition: "9/10", note: "Chunky links, heavy feel.", images: [] },
  { id: "JW-002", cat: "jewelry", name: "Old Signet Ring",        price: 2800, size: "US 9",  condition: "8/10", note: "Flat face, worn patina.", images: [] },
  { id: "JW-003", cat: "jewelry", name: "Beaded Bracelet Set",    price: 1200, size: "Free",  condition: "10/10", note: "Three pieces, stone beads.", images: [] },
  { id: "JW-004", cat: "jewelry", name: "Turquoise Stone Ring",   price: 3200, size: "US 8",  condition: "9/10", note: "Natural stone, silver band.", images: [] },
  { id: "JW-005", cat: "jewelry", name: "Pearl Chain Necklace",   price: 2600, size: "45cm",  condition: "9/10", note: "Pearls with a steel chain.", images: [], sold: true },
  { id: "JW-006", cat: "jewelry", name: "Hammered Silver Cuff",   price: 3500, size: "Free",  condition: "8/10", note: "Hand-hammered texture.", images: [] },

  // ANTIQUE PIECES
  { id: "AN-001", cat: "antiques", name: "Brass Pocket Watch",      price: 9500,  size: "—", condition: "Working", note: "Hand-wound, engraved case.", images: [] },
  { id: "AN-002", cat: "antiques", name: "Vintage Film Camera",     price: 12000, size: "—", condition: "Working", note: "35mm rangefinder.", images: [] },
  { id: "AN-003", cat: "antiques", name: "Rotary Telephone",        price: 8500,  size: "—", condition: "Display", note: "Bakelite body.", images: [] },
  { id: "AN-004", cat: "antiques", name: "Brass Oil Lamp",          price: 6000,  size: "—", condition: "8/10", note: "Glass chimney included.", images: [] },
  { id: "AN-005", cat: "antiques", name: "Leather Travel Trunk",    price: 18000, size: "—", condition: "7/10", note: "Old stickers, brass locks.", images: [], sold: true },
  { id: "AN-006", cat: "antiques", name: "Mechanical Typewriter",   price: 15000, size: "—", condition: "Working", note: "Full keyset, new ribbon.", images: [] },
];
