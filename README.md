# CORVO — thrift community website

Plain HTML/CSS/JS. Nothing to install and no build step.

## Pages
- `index.html` — home: full-screen photo slideshow, live piece count, category ticker
- `categories.html` — curved 3D carousel of the 6 categories (drag, scroll or swipe)
- `shop.html` — all products, or one category with `shop.html?c=shoes`
  - click a product to open its details, with **Order on WhatsApp** and **Email us** buttons
  - every product has a shareable link, e.g. `shop.html?item=SH-001` (good for Instagram captions)
- `about.html`, `contact.html`

## Change contact details
Edit `assets/js/config.js` (WhatsApp number, email, Instagram).

## Add or edit products
Edit `assets/js/products.js`. Put photos in `assets/img/products/` and list them in the product's `images`:

```js
{ id: "SH-007", cat: "shirts", name: "Black Denim Jacket", price: 4200, size: "L", condition: "9/10",
  note: "Heavy denim.", images: ["assets/img/products/SH-007-1.jpg", "assets/img/products/SH-007-2.jpg"] },
```

Category slugs: `shirts`, `pants`, `shoes`, `belts-caps`, `jewelry`, `antiques`.
Once an item sells, add `sold: true`.

## Preview locally
```
python -m http.server 8120
```
Then open http://localhost:8120
