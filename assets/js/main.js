(() => {
  const C = window.CORVO;
  const CATS = window.CATEGORIES;
  const PRODUCTS = window.PRODUCTS;
  const page = document.body.dataset.page;
  const mobile = () => window.innerWidth < 760;
  const $ = (s, el = document) => el.querySelector(s);

  // ---------- helpers ----------
  const catBySlug = (slug) => CATS.find((c) => c.slug === slug);
  const price = (n) => (n == null ? "DM for price" : `${C.currency} ${n.toLocaleString("en-PK")}`);
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
  const mailLink = (subject, body) =>
    `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const itemUrl = (p) => new URL(`shop.html?item=${p.id}`, location.href).href;
  const itemMessage = (p) =>
    `Hi CORVO! I'm interested in this piece:\n\n${p.name} (${p.id})` +
    (p.price != null ? `\nPrice: ${price(p.price)}` : "") + (p.size ? `\nSize: ${p.size}` : "") +
    `\n\n${itemUrl(p)}\n\nIs it still available?`;

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
      ? `<a href="${n.href}" class="nav-logo ${page === n.key ? "active" : ""}" aria-label="CORVO home"><img class="nav-crow" src="${badge("corvo")}" alt=""><span class="logo">corvo</span></a>`
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
      (mobile() ? [0.23, 0.5, 0.77] : [0.3, 0.5, 0.7]).forEach((fx, i) => {
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

    $("#dmLink").href = waLink("Hi CORVO! I want to see what's new in the latest drop.");
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
            ${p.sold ? "" : `<a class="quick-buy" href="${waLink(itemMessage(p))}" target="_blank" rel="noopener">Quick Buy</a>`}
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
      const wa = $("#mWa"), mail = $("#mMail");
      wa.href = waLink(itemMessage(p));
      mail.href = mailLink(`Inquiry: ${p.name} (${p.id})`, itemMessage(p));
      modal.classList.toggle("is-sold", !!p.sold);
      wa.querySelector(".split").textContent = p.sold ? "Ask for similar on WhatsApp" : "Order on WhatsApp";
      split(wa.querySelector(".split"));
      modal.hidden = false;
      document.documentElement.classList.add("lock");
      requestAnimationFrame(() => modal.classList.add("open"));
      const u = new URL(location.href);
      u.searchParams.set("item", p.id);
      setUrl(u);
    };
    const close = () => {
      modal.classList.remove("open");
      document.documentElement.classList.remove("lock");
      setTimeout(() => (modal.hidden = true), 400);
      const u = new URL(location.href);
      u.searchParams.delete("item");
      setUrl(u);
    };

    wall.addEventListener("click", (e) => {
      if (e.target.closest(".quick-buy")) return; // Quick Buy goes straight to WhatsApp
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
