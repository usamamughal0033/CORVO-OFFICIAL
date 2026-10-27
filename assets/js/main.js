(() => {
  const C = window.CORVO;
  const CATS = window.CATEGORIES;
  const PRODUCTS = window.PRODUCTS;
  const page = document.body.dataset.page;
  const mobile = () => window.innerWidth < 760;
  const $ = (s, el = document) => el.querySelector(s);

  // ---------- helpers ----------
  const catBySlug = (slug) => CATS.find((c) => c.slug === slug);
  // Products without their own price use the store's default price for now.
  PRODUCTS.forEach((p) => { if (p.price == null) p.price = C.defaultPrice; });
  const price = (n) => `${C.currency}${n.toLocaleString("en-US")}`;
  const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

  // Placeholder photos until real product images are added.
  const placeholder = (kw, seed, w = 600, h = 800) =>
    `https://picsum.photos/seed/${kw.split(",")[0]}${seed}/${w}/${h}`;
  const fallback = (seed, w = 600, h = 800) =>
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#111"/></svg>`)}`;

  const imagesFor = (p) => {
    if (p.images && p.images.length) return p.images;
    const kw = catBySlug(p.cat).kw;
    const s = hash(p.id) % 900;
    return [0, 1, 2].map((k) => placeholder(kw, s + k * 1000));
  };

  const img = (src, alt, seed, cls = "") =>
    `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy" decoding="async"
      onerror="this.onerror=null;this.src='${fallback(seed)}'">`;

  // Opening the files directly (file://) makes Chrome reject URL updates; never let that break the page.
  const setUrl = (u) => { try { history.replaceState(null, "", u); } catch (_) {} };

  const waLink = (msg) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;

  const itemUrl = (p) => new URL(`shop.html?item=${p.id}`, location.href).href;
  const itemMessage = (p) =>
    `Hi CORVO! I'd like more photos, a video or details on this piece:\n\n${p.name} (${p.id})` +
    `\nPrice: ${price(p.price)}` + (p.size ? `\nSize: ${p.size}` : "") + `\n\n${itemUrl(p)}`;

  // Split text into letters that roll on hover.
  const split = (el) => {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = [...text]
      .map((ch, i) => {
        const c = ch === " " ? "&nbsp;" : ch;
        return `<span class="ch" style="--i:${i}" aria-hidden="true"><span>${c}</span><span>${c}</span></span>`;
      })
      .join("");
  };

  // ---------- shared chrome: nav, curtain, grain ----------
  const NAV = [
    { href: "shop.html", label: "Drops", sub: '<span id="clock">--:--</span>', key: "shop", align: "start" },
    { href: "categories.html", label: "Categories", key: "categories", align: "center" },
    { href: "index.html", logo: true, key: "home", align: "center" },
    { href: "about.html", label: "About", key: "about", align: "center" },
    { href: "contact.html", label: "Contact", sub: `<span>${new Date().getFullYear()}</span>`, key: "contact", align: "end" },
  ];

  // Crow badges in assets/img/logos: corvo.png for the main brand, <slug>.png for each category.
  const badge = (slug) => `assets/img/logos/${slug}.png`;

  const nav = document.createElement("nav");
  nav.className = "nav";
  nav.innerHTML = NAV.map((n) =>
    n.logo
      ? `<a href="${n.href}" class="nav-logo ${page === n.key ? "active" : ""}" aria-label="CORVO home"><span class="logo">CORVO</span></a>`
      : `<a href="${n.href}" class="nav-item ${n.align} ${page === n.key ? "active" : ""}">
          <span class="split">${n.label}</span>${n.sub ? `<small>${n.sub}</small>` : ""}</a>`
  ).join("");
  document.body.prepend(nav);

  const curtain = document.createElement("div");
  curtain.className = "curtain";
  const grain = document.createElement("div");
  grain.className = "grain";
  document.body.append(curtain, grain);

  document.querySelectorAll(".split").forEach(split);

  const tick = () => {
    const el = $("#clock");
    if (el) el.textContent = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };
  tick();
  setInterval(tick, 15000);

  // Page transitions: fade the curtain in, then leave.
  requestAnimationFrame(() => document.body.classList.add("ready"));
  window.addEventListener("pageshow", (e) => e.persisted && document.body.classList.remove("leaving"));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.href === location.href || a.hasAttribute("download")) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => (location.href = url.href), 420);
  });

  // ---------- CART (every page) ----------
  // One-of-one pieces, so the cart is just a list of product ids kept in this browser.
  const CART_KEY = "corvo-cart";
  const cart = {
    ids: (() => {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (_) { return []; }
    })().filter((id) => PRODUCTS.some((p) => p.id === id && !p.sold)),
    items() { return this.ids.map((id) => PRODUCTS.find((p) => p.id === id)); },
    total() { return this.items().reduce((t, p) => t + p.price, 0); },
    has(id) { return this.ids.includes(id); },
    save() {
      try { localStorage.setItem(CART_KEY, JSON.stringify(this.ids)); } catch (_) {}
      document.dispatchEvent(new CustomEvent("cart"));
    },
    add(id) { if (!this.has(id)) { this.ids.push(id); this.save(); } },
    remove(id) { this.ids = this.ids.filter((x) => x !== id); this.save(); },
    clear() { this.ids = []; this.save(); },
  };

  const cartBtn = document.createElement("button");
  cartBtn.className = "cart-btn";
  cartBtn.innerHTML = '<span class="split">Cart</span> <b id="cartCount">(0)</b>';
  split(cartBtn.querySelector(".split"));

  const drawer = document.createElement("aside");
  drawer.className = "drawer";
  drawer.hidden = true;
  drawer.setAttribute("aria-label", "Cart");
  drawer.innerHTML = `
    <div class="drawer-bg" data-cart-close></div>
    <div class="drawer-box">
      <header class="drawer-head"><h2>Cart <span id="drawerCount"></span></h2>
        <button data-cart-close><span class="split">Close ✕</span></button></header>
      <div class="drawer-list" id="drawerList"></div>
      <footer class="drawer-foot">
        <p class="drawer-total"><span>Subtotal</span><b id="drawerTotal"></b></p>
        <p class="m-how">No payment on the website. After you order, we confirm on WhatsApp and share payment and delivery details.</p>
        <a class="btn solid" href="checkout.html" id="drawerCheckout"><span>Checkout</span><span>→</span></a>
        <button class="btn" data-cart-close><span>Continue shopping</span><span>←</span></button>
      </footer>
    </div>`;
  drawer.querySelectorAll(".split").forEach(split);
  if (page !== "checkout") document.body.append(cartBtn);
  document.body.append(drawer);

  const cartLine = (p) => `
        <div class="line">
          <a class="line-img" href="shop.html?item=${p.id}">${img(imagesFor(p)[0], p.name, hash(p.id))}</a>
          <div class="line-info">
            <a class="line-name" href="shop.html?item=${p.id}">${p.name}</a>
            <span class="line-meta">${p.id}${p.size ? ` · ${p.size}` : ""}</span>
            <button class="line-remove" type="button" data-remove="${p.id}">Remove</button>
          </div>
          <b class="line-price">${price(p.price)}</b>
        </div>`;
  const renderCart = () => {
    const items = cart.items();
    cartBtn.querySelector("b").textContent = `(${items.length})`;
    $("#drawerCount").textContent = `(${items.length})`;
    $("#drawerTotal").textContent = price(cart.total());
    $("#drawerCheckout").classList.toggle("disabled", !items.length);
    $("#drawerList").innerHTML = items.length ? items.map(cartLine).join("") : '<p class="drawer-empty">Your cart is empty.</p>';
  };
  const openCart = () => {
    drawer.hidden = false;
    document.documentElement.classList.add("lock");
    requestAnimationFrame(() => drawer.classList.add("open"));
  };
  const closeCart = () => {
    drawer.classList.remove("open");
    if (!document.querySelector(".modal.open")) document.documentElement.classList.remove("lock");
    setTimeout(() => (drawer.hidden = true), 400);
  };
  const bump = () => { cartBtn.classList.remove("bump"); void cartBtn.offsetWidth; cartBtn.classList.add("bump"); };
  cartBtn.addEventListener("click", openCart);
  drawer.addEventListener("click", (e) => {
    if (e.target.closest("[data-cart-close]")) closeCart();
    const rm = e.target.closest("[data-remove]");
    if (rm) cart.remove(rm.dataset.remove);
    if (e.target.closest("#drawerCheckout.disabled")) e.preventDefault();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) closeCart(); });
  document.addEventListener("cart", renderCart);
  renderCart();

  // ---------- HOME ----------
  if (page === "home") {
    // Categories, the logo and About sit on the string between the two sneakers.
    // Points along the string, measured on a 1600 × 899 copy of the artwork (the file itself is a larger upscale).
    const STRING = [[300, 390], [350, 409], [400, 425], [450, 439], [500, 450], [550, 459], [600, 467],
      [650, 473], [700, 477], [750, 479], [800, 480], [850, 479], [900, 476], [950, 472], [1000, 466],
      [1050, 458], [1100, 448], [1150, 435], [1200, 421], [1250, 404], [1300, 385]];
    const stringY = (x) => {
      let i = STRING.findIndex(([px]) => px >= x);
      if (i <= 0) i = i === 0 ? 1 : STRING.length - 1;
      const [[x0, y0], [x1, y1]] = [STRING[i - 1], STRING[i]];
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    };
    // "Shop all" takes the middle of the string; the corvo logo moves to the top centre.
    const shopLink = document.createElement("a");
    shopLink.href = "shop.html";
    shopLink.className = "nav-item center";
    shopLink.innerHTML = '<span class="split">Shop all</span>';
    split(shopLink.querySelector(".split"));
    const [, categoriesLink, logoLink, aboutLink] = nav.children;
    logoLink.after(shopLink);
    const riders = [categoriesLink, shopLink, aboutLink];
    riders.forEach((el) => el.classList.add("on-string"));
    const artImg = $("#pageArt img");
    // Where the two characters are (same 1600 × 899 scale); this band is scaled to span nearly the full width.
    const CHARS = { x: 80, y: 332, w: 1408, h: 466 };
    const placeOnString = () => {
      const iw = 1600, ih = 899;
      const s = Math.min((innerWidth * 0.9) / CHARS.w, (innerHeight - 160) / CHARS.h);
      const ox = innerWidth / 2 - (CHARS.x + CHARS.w / 2) * s;
      const oy = innerHeight * 0.55 - (CHARS.y + CHARS.h / 2) * s; // from the top of the page
      Object.assign(artImg.style, { width: `${iw * s}px`, height: `${ih * s}px`, left: `${ox}px`, top: `${oy}px` });
      const r = nav.getBoundingClientRect();
      const box = { left: r.left, top: r.top + scrollY };
      // DROPS and CONTACT sit in the top corners; the nav itself stays centred for the words on the string.
      nav.style.setProperty("--corner-top", `${(mobile() ? 18 : 36) - box.top}px`);
      [0.3, 0.5, 0.7].forEach((fx, i) => {
        const sx = innerWidth * fx;
        const ix = (sx - ox) / s;
        const slope = (stringY(ix + 4) - stringY(ix - 4)) / 8;
        riders[i].style.left = `${sx - box.left}px`;
        riders[i].style.top = `${oy + stringY(ix) * s - box.top}px`;
        riders[i].style.setProperty("--tilt", `${(Math.atan(slope) * 180) / Math.PI}deg`);
      });
    };
    if (artImg.complete) placeOnString();
    artImg.addEventListener("load", placeOnString);
    window.addEventListener("resize", placeOnString);

  }

  // ---------- CATEGORIES: curved 3D carousel ----------
  if (page === "categories") {
    const stage = $("#stage");
    const ring = $("#ring");
    const label = $("#ringLabel");
    const N = 18;
    const step = 360 / N;
    let W, H, R, P, T;
    const panels = [];

    for (let i = 0; i < N; i++) {
      const cat = CATS[i % CATS.length];
      const count = PRODUCTS.filter((p) => p.cat === cat.slug && !p.sold).length;
      const seed = 300 + i * 7;
      const a = document.createElement("a");
      a.className = "panel";
      a.href = `shop.html?c=${cat.slug}`;
      const shots = PRODUCTS.filter((p) => p.cat === cat.slug && p.images.length).map((p) => p.images[0]);
      const cover = shots.length ? shots[Math.floor(i / CATS.length) % shots.length] : placeholder(cat.kw, seed, 500, 900);
      a.innerHTML = `${img(cover, cat.name, seed)}
        <span class="cap"><span>${cat.name}</span><span>${String(count).padStart(2, "0")} pcs</span></span>`;
      ring.appendChild(a);
      panels.push({ el: a, cat, i });
    }

    const layout = () => {
      const m = mobile();
      W = m ? 170 : 260;
      H = m ? 300 : 470;
      const gap = m ? 14 : 22;
      R = (N * (W + gap)) / (2 * Math.PI);
      P = m ? 620 : 900;
      T = R - (m ? 190 : 290);
      stage.style.perspective = `${P}px`;
      panels.forEach(({ el, i }) => {
        el.style.width = `${W}px`;
        el.style.height = `${H}px`;
        el.style.margin = `${-H / 2}px 0 0 ${-W / 2}px`;
        el.style.transform = `rotateY(${i * step}deg) translateZ(${-R}px)`;
      });
    };
    layout();
    window.addEventListener("resize", layout);

    let rot = -140, vel = 0, dragging = false, lastX = 0, moved = 0, idle = 0, lastFront = null;

    const norm = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
    const frame = () => {
      if (!dragging) {
        rot += vel;
        vel *= 0.94;
        if (Math.abs(vel) < 0.02 && ++idle > 90) rot += 0.04;
      }
      ring.style.transform = `translateZ(${T}px) rotateY(${rot}deg)`;
      let front = null, best = 999;
      panels.forEach((p) => {
        const a = norm(p.i * step + rot);
        // Panels near the sides grow large in perspective; fade them out instead of letting them crowd the edges.
        const fade = Math.min(1, Math.max(0, (78 - Math.abs(a)) / 16));
        p.el.style.visibility = fade > 0 ? "visible" : "hidden";
        p.el.style.opacity = fade.toFixed(3);
        if (Math.abs(a) < best) (best = Math.abs(a)), (front = p);
      });
      if (front && front.cat !== lastFront) {
        lastFront = front.cat;
        const idx = CATS.indexOf(front.cat) + 1;
        label.innerHTML = `<span>${String(idx).padStart(2, "0")} / ${String(CATS.length).padStart(2, "0")}</span>
          <img class="badge" src="${badge(front.cat.slug)}" alt=""><strong>${front.cat.name}</strong><span>${front.cat.tag}</span>`;
      }
      requestAnimationFrame(frame);
    };
    vel = 7; // intro spin
    requestAnimationFrame(frame);

    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      vel -= (e.deltaY + e.deltaX) * 0.012; // scroll down spins the carousel the same way as dragging left
      idle = 0;
    }, { passive: false });
    stage.addEventListener("pointerdown", (e) => {
      dragging = true; moved = 0; lastX = e.clientX; idle = 0;
      stage.classList.add("grabbing");
    });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      const d = dx * (mobile() ? 0.25 : 0.12);
      rot += d;
      vel = d;
    });
    window.addEventListener("pointerup", () => {
      dragging = false;
      stage.classList.remove("grabbing");
    });
    // A drag shouldn't count as a click on a panel.
    stage.addEventListener("click", (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  // ---------- SHOP: grid wall + product modal ----------
  if (page === "shop") {
    const params = new URLSearchParams(location.search);
    let active = catBySlug(params.get("c")) ? params.get("c") : "all";

    const chips = $("#chips");
    chips.innerHTML = [{ slug: "all", name: "All" }, ...CATS]
      .map((c) => `<button data-c="${c.slug}"><span class="split">${c.name}</span></button>`)
      .join("");
    chips.querySelectorAll(".split").forEach(split);

    const wall = $("#wall");
    const render = () => {
      const list = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);
      const cat = catBySlug(active);
      $("#shopBadge").src = badge(cat ? cat.slug : "corvo");
      $("#shopTitle").textContent = cat ? cat.name : "All Drops";
      $("#shopCount").textContent = `${String(list.filter((p) => !p.sold).length).padStart(2, "0")} available`;
      chips.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.c === active));
      wall.innerHTML = list
        .map((p, i) => `
          <div class="card ${p.sold ? "sold" : ""}" data-id="${p.id}" role="button" tabindex="0" style="--d:${(i % 12) * 45}ms">
            <span class="card-img">${img(imagesFor(p)[0], p.name, hash(p.id))}${p.sold ? '<em class="tag">Sold</em>' : ""}</span>
            <span class="card-cap"><span class="card-name">${p.name}</span>${p.price != null && !p.sold ? `<span class="card-price">${price(p.price)}</span>` : ""}</span>
            <span class="card-meta"><span>${p.id}</span><span>${p.size || ""}</span></span>
            ${p.sold ? "" : `<button class="quick-buy ${cart.has(p.id) ? "in" : ""}" data-add="${p.id}">${cart.has(p.id) ? "In cart ✓" : "Add to cart"}</button>`}
          </div>`)
        .join("");
      requestAnimationFrame(() => wall.classList.add("in"));
    };

    chips.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      active = b.dataset.c;
      const u = new URL(location.href);
      u.searchParams.delete("item");
      active === "all" ? u.searchParams.delete("c") : u.searchParams.set("c", active);
      setUrl(u);
      wall.classList.remove("in");
      setTimeout(render, 250);
    });
    render();

    // The middle nav glides into whichever gap between rows is nearest the centre of the screen,
    // so it never sits on top of a photo.
    const navEl = $(".nav");
    let navY = innerHeight / 2;
    const followGap = () => {
      const rows = [];
      wall.querySelectorAll(".card").forEach((c) => {
        const r = c.getBoundingClientRect();
        const row = rows.find((x) => Math.abs(x.top - r.top) < 8);
        if (row) row.bottom = Math.max(row.bottom, r.bottom);
        else rows.push({ top: r.top, bottom: r.bottom });
      });
      if (rows.length) {
        rows.sort((a, b) => a.top - b.top);
        const gaps = [($(".shop-top").getBoundingClientRect().bottom + rows[0].top) / 2];
        for (let i = 0; i < rows.length - 1; i++) gaps.push((rows[i].bottom + rows[i + 1].top) / 2);
        gaps.push(rows[rows.length - 1].bottom + 40);
        const mid = innerHeight / 2;
        const onScreen = gaps.filter((g) => g > 50 && g < innerHeight - 50);
        const target = (onScreen.length ? onScreen : [mid]).reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
        navY += (target - navY) * 0.22;
        navEl.style.top = `${navY.toFixed(1)}px`;
      }
      requestAnimationFrame(followGap);
    };
    followGap();

    // Modal
    const modal = $("#modal");
    const open = (id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return;
      const imgs = imagesFor(p);
      const cat = catBySlug(p.cat);
      const seed = hash(p.id);
      $("#mMain").innerHTML = img(imgs[0], p.name, seed);
      $("#mThumbs").innerHTML = imgs
        .map((s, i) => `<button class="${i === 0 ? "on" : ""}" data-src="${s}">${img(s, "", seed + i + 1)}</button>`)
        .join("");
      $("#mCat").textContent = `${cat.name} — ${p.id}`;
      $("#mName").textContent = p.name;
      $("#mPrice").textContent = p.sold ? "Sold out" : price(p.price);
      $("#mSize").textContent = p.size;
      $("#mCond").textContent = p.condition;
      // hide spec rows that have no value yet
      [["#mSize", p.size], ["#mCond", p.condition]].forEach(([sel, v]) => {
        $(sel).hidden = !v;
        $(sel).previousElementSibling.hidden = !v;
      });
      $("#mNote").textContent = p.note || "";
      const wa = $("#mWa");
      wa.href = waLink(itemMessage(p));
      modal.classList.toggle("is-sold", !!p.sold);
      modal.dataset.id = p.id;
      $("#mAdd").hidden = !!p.sold;
      syncAdd();
      wa.querySelector(".split").textContent = p.sold ? "Ask for similar on WhatsApp" : "Ask on WhatsApp";
      split(wa.querySelector(".split"));
      modal.hidden = false;
      document.documentElement.classList.add("lock");
      requestAnimationFrame(() => modal.classList.add("open"));
      const u = new URL(location.href);
      u.searchParams.set("item", p.id);
      setUrl(u);
    };
    // Modal "Add to cart": adds the piece, then becomes "View cart".
    const syncAdd = () => {
      const inCart = cart.has(modal.dataset.id);
      const label = $("#mAdd .split");
      label.textContent = inCart ? "In cart — view cart" : "Add to cart";
      split(label);
      $("#mAdd span:last-child").textContent = inCart ? "→" : "+";
    };
    $("#mAdd").addEventListener("click", () => {
      if (cart.has(modal.dataset.id)) { close(); openCart(); return; }
      cart.add(modal.dataset.id);
      bump();
    });
    // Keep card buttons and the modal in step with the cart (also when items are removed in the drawer).
    document.addEventListener("cart", () => {
      wall.querySelectorAll("[data-add]").forEach((b) => {
        const inCart = cart.has(b.dataset.add);
        b.classList.toggle("in", inCart);
        b.textContent = inCart ? "In cart ✓" : "Add to cart";
      });
      if (modal.dataset.id) syncAdd();
    });
    const close = () => {
      modal.classList.remove("open");
      document.documentElement.classList.remove("lock");
      setTimeout(() => (modal.hidden = true), 400);
      const u = new URL(location.href);
      u.searchParams.delete("item");
      setUrl(u);
    };

    wall.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) { // first tap adds the piece, a second tap opens the cart
        if (cart.has(add.dataset.add)) openCart();
        else { cart.add(add.dataset.add); bump(); }
        return;
      }
      const card = e.target.closest(".card");
      if (card) open(card.dataset.id);
    });
    wall.addEventListener("keydown", (e) => {
      const card = e.target.closest(".card");
      if (card && e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(card.dataset.id); }
    });
    $("#mThumbs").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $("#mThumbs").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      $("#mMain img").src = b.dataset.src;
    });
    modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });

    // Shareable item links: shop.html?item=SH-001
    const deep = params.get("item");
    if (deep) {
      const p = PRODUCTS.find((x) => x.id === deep);
      if (p && active === "all") { active = p.cat; render(); }
      setTimeout(() => open(deep), 300);
    }
  }

  // ---------- ABOUT ----------
  if (page === "about") {
    // Light on the glass follows the cursor.
    document.querySelectorAll(".glass").forEach((g) =>
      g.addEventListener("pointermove", (e) => {
        const r = g.getBoundingClientRect();
        g.style.setProperty("--mx", `${e.clientX - r.left}px`);
        g.style.setProperty("--my", `${e.clientY - r.top}px`);
      })
    );
  }

  // ---------- CHECKOUT ----------
  if (page === "checkout") {
    const form = $("#coForm");
    const showSummary = () => {
      const items = cart.items();
      $("#coGrid").hidden = !items.length;
      $("#coEmpty").hidden = !!items.length || !$("#coDone").hidden;
      $("#coItems").innerHTML = items.map(cartLine).join("");
      $("#coSubtotal").textContent = price(cart.total());
      $("#coTotal").textContent = price(cart.total());
      $("#coPlaceTotal").textContent = price(cart.total());
    };
    $("#coItems").addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove]");
      if (rm) cart.remove(rm.dataset.remove);
    });
    document.addEventListener("cart", showSummary);
    showSummary();
    $("#coWa").href = waLink("Hi CORVO! I have a question before I order.");

    const itemLine = (p) => `${p.name} (${p.id})${p.size ? ` — ${p.size}` : ""} — ${price(p.price)}`;
    const itemList = (items) => items.map((p) => `• ${itemLine(p)}`).join("\n");
    const orderText = (no, d, items, total) =>
      `Order ${no}\n${itemList(items)}\nTotal: ${total} + delivery\n\n` +
      `Name: ${d.name}\nWhatsApp: ${d.phone}\nEmail: ${d.email}\nCity: ${d.city}\nAddress: ${d.address}` +
      (d.note ? `\nNote: ${d.note}` : "");
    // 03XX XXXXXXX → 923XXXXXXXXX for wa.me links.
    const waNumber = (phone) => {
      const n = phone.replace(/\D/g, "");
      if (n.startsWith("0")) return `92${n.slice(1)}`;
      if (n.length === 10 && n.startsWith("3")) return `92${n}`;
      return n;
    };
    // Step 1 of the WhatsApp process: CORVO asks the customer to confirm. The order email gives the
    // store a one-tap link that opens this message in a chat with the customer.
    const confirmRequest = (no, d, items, total) =>
      `Assalam o Alaikum ${d.name}! 👋\n\nThank you for shopping with *CORVO*. We've received your order *${no}*:\n\n` +
      `${itemList(items)}\n\n*Total:* ${total} + delivery\n*Delivery to:* ${d.address}, ${d.city}\n\n` +
      `Please reply *YES* to confirm your order and we'll share the payment details with you.\n\n— Team CORVO`;
    // Sent to the customer's inbox by FormSubmit as soon as the order is placed.
    const customerEmail = (no, d, items, total) =>
      `Hi ${d.name},\n\nThank you for your order with CORVO! Here are your order details.\n\n` +
      `Order: ${no}\n${itemList(items)}\nTotal: ${total} + delivery\nDelivering to: ${d.address}, ${d.city}\n\n` +
      `What happens next:\n` +
      `1. We'll message you on WhatsApp (${d.phone}). Reply to confirm your order.\n` +
      `2. We'll share the payment details on WhatsApp. Send us a screenshot once you've paid.\n` +
      `3. We verify your payment, confirm your order and share the delivery time.\n\n` +
      `Want to confirm right away? Message us on WhatsApp: ${C.whatsappDisplay}\n` +
      `${waLink(`Hi CORVO! I placed order ${no} on the website and I'd like to confirm it.`)}\n\n` +
      `Thank you for choosing pre-loved.\nTeam CORVO\n${C.instagramHandle}`;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = $("#coError");
      err.hidden = true;
      form.querySelectorAll(".bad").forEach((el) => el.classList.remove("bad"));
      const d = Object.fromEntries(new FormData(form));
      Object.keys(d).forEach((k) => (d[k] = String(d[k]).trim()));
      // Required fields, a full-length phone number and a valid email.
      const bad = ["name", "phone", "email", "city", "address"].filter((k) => !d[k]);
      if (d.phone && d.phone.replace(/\D/g, "").length < 10 && !bad.includes("phone")) bad.push("phone");
      if (d.email && !form.email.checkValidity()) bad.push("email");
      if (bad.length) {
        bad.forEach((k) => form[k].classList.add("bad"));
        err.textContent = "Please fill in the highlighted fields.";
        err.hidden = false;
        form[bad[0]].focus();
        return;
      }
      const items = cart.items();
      if (!items.length) return showSummary();
      const no = `CRV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const total = price(cart.total());
      const text = orderText(no, d, items, total);
      const btn = $("#coPlace");
      btn.disabled = true;
      btn.firstElementChild.textContent = "Placing order…";
      try {
        // The order is emailed to the store through FormSubmit (see orderEmail in config.js).
        const res = await fetch(`https://formsubmit.co/ajax/${C.orderEmail}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `New CORVO order ${no} — ${total}`,
            _template: "table",
            _captcha: "false",
            _replyto: d.email,
            _autoresponse: customerEmail(no, d, items, total),
            Order: no,
            "Step 1 — ask customer to confirm (tap to open WhatsApp)": `https://wa.me/${waNumber(d.phone)}?text=${encodeURIComponent(confirmRequest(no, d, items, total))}`,
            Items: items.map(itemLine).join(" | "),
            Total: `${total} + delivery`,
            Name: d.name,
            WhatsApp: d.phone,
            email: d.email,
            City: d.city,
            Address: d.address,
            Note: d.note || "—",
          }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || String(out.success) !== "true") throw new Error(out.message || res.status);
        cart.clear();
        $("#coGrid").hidden = true;
        $("#coEmpty").hidden = true;
        $("#coDone").hidden = false;
        $("#coDoneText").textContent = `Your order ${no} has been received. We'll message you on WhatsApp at ${d.phone} to confirm it. You can also confirm right now.`;
        $("#coStepEmail").textContent = `Confirmation sent to ${d.email}`;
        $("#coStepEmail").className = "done";
        $("#coDoneWa").href = waLink(`Hi CORVO! I placed order ${no} on the website and I'd like to confirm it. ✅\n\n${text}`);
        scrollTo(0, 0);
      } catch (e) {
        // FormSubmit refuses pages opened straight from disk, and holds the first order until the store activates it.
        const why = location.protocol === "file:"
          ? "Orders can't be sent from a page opened as a file. Open the site through its web address."
          : /activat/i.test(e.message) ? "Our order inbox is being set up. Please try again in a few minutes."
          : "We couldn't send your order just now. Please try again.";
        console.warn("Order not sent:", e.message);
        err.innerHTML = `${why} Or <a href="${waLink(`Hi CORVO! I'd like to place this order:\n\n${text}`)}" target="_blank" rel="noopener">send it on WhatsApp</a>.`;
        err.hidden = false;
      } finally {
        btn.disabled = false;
        btn.firstElementChild.textContent = "Place order";
      }
    });
  }

  // ---------- FOOTER (Home and About) ----------
  if ($("#footCats")) {
    document.querySelectorAll(".wa-number").forEach((el) => (el.textContent = `WhatsApp: ${C.whatsappDisplay}`));
    document.querySelectorAll(".ig-handle").forEach((el) => (el.textContent = C.instagramHandle));
    document.querySelectorAll(".mail-text").forEach((el) => (el.textContent = C.email));
    document.querySelectorAll("[data-ig]").forEach((a) => (a.href = C.instagram));
    document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));
    $("#footCats").innerHTML = CATS.map((c) => `<a href="shop.html?c=${c.slug}"><img class="badge" src="${badge(c.slug)}" alt="">${c.name}</a>`).join("");
    document.querySelectorAll('.foot-cols a[href^="#"]').forEach((a) =>
      a.addEventListener("click", () => {
        const d = document.querySelector(a.getAttribute("href"));
        if (d && d.tagName === "DETAILS") d.open = true;
      })
    );
  }

  // ---------- CONTACT ----------
  if (page === "contact") {
    const links = {
      wa: waLink("Hi CORVO! 👋"),
      mail: `mailto:${C.email}`,
      ig: C.instagram,
    };
    document.querySelectorAll("[data-link]").forEach((a) => (a.href = links[a.dataset.link]));
    $("#waText").textContent = C.whatsappDisplay;
    $("#mailText").textContent = C.email;
    $("#igText").textContent = C.instagramHandle;
  }

  // Footer contacts wherever present.
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = waLink("Hi CORVO! 👋")));
  document.querySelectorAll("[data-mail]").forEach((a) => (a.href = `mailto:${C.email}`));
})();
