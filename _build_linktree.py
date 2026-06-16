# -*- coding: utf-8 -*-
import base64, io
from PIL import Image
from _lib_raven import raven_no_ring
col=raven_no_ring("LOGOS/CORVO OFFICIAL.jpeg",(242,239,233))
col.thumbnail((420,420),Image.LANCZOS)
buf=io.BytesIO(); col.save(buf,"PNG")
b64=base64.b64encode(buf.getvalue()).decode()

NESTS=[("CORVO CAGE","STRUCTURE","Tops · shirts · jackets","corvocage"),
 ("CORVO BASE","FOUNDATION","Bottoms · denim · trousers","corvobase"),
 ("CORVO LACE","MOVEMENT","Footwear · sneakers · boots","corvolace"),
 ("CORVO ESSENTIALS","UTILITY","Belts · caps · ties","corvoessential"),
 ("CORVO ORE","ADORNMENT","Jewelry · chains · rings","corvoore"),
 ("CORVO RELIC","REMNANT","Antiques · deco · collectibles","corvorelic")]
nest_html="\n".join(f'''      <a class="nest" href="https://instagram.com/{h}" target="_blank">
        <div class="nest-l"><span class="nest-name">{n}</span><span class="nest-sub">{s}</span></div>
        <span class="nest-code">{c}</span>
      </a>''' for n,c,s,h in NESTS)

html=f'''<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>CORVO — The Murder</title>
<style>
  :root{{--ink:#0b0b0b;--paper:#f4f1ea;--brass:#b79a5b;--stone:#8a887e;--line:#2a2a28;}}
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{background:#0b0b0b;color:var(--paper);font-family:Arial,Helvetica,sans-serif;
    -webkit-font-smoothing:antialiased;min-height:100vh;display:flex;justify-content:center;
    background-image:radial-gradient(circle at 50% 0%,#181818 0%,#0b0b0b 60%);}}
  .wrap{{width:100%;max-width:440px;padding:38px 22px 60px;text-align:center}}
  .raven{{width:118px;height:auto;margin:6px auto 14px;display:block;filter:drop-shadow(0 6px 18px rgba(0,0,0,.5))}}
  .brand{{font-size:30px;font-weight:700;letter-spacing:8px;margin-left:8px}}
  .tag{{color:var(--brass);font-size:11px;letter-spacing:4px;margin-top:8px}}
  .promise{{color:var(--stone);font-size:12px;font-style:italic;margin-top:14px;font-family:Georgia,serif}}
  .badge{{display:inline-block;margin:18px auto 4px;border:1px solid var(--line);border-radius:30px;
    padding:7px 16px;font-size:11px;letter-spacing:1px;color:var(--paper)}}
  .badge b{{color:var(--brass)}}
  .cta{{display:block;margin:26px 0 8px;background:var(--paper);color:#0b0b0b;text-decoration:none;
    padding:16px;border-radius:14px;font-weight:700;letter-spacing:2px;font-size:14px;transition:.2s}}
  .cta:hover{{transform:translateY(-2px)}}
  .section{{color:var(--stone);font-size:11px;letter-spacing:3px;margin:26px 0 12px;text-align:left}}
  .nest{{display:flex;align-items:center;justify-content:space-between;text-decoration:none;color:var(--paper);
    border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:10px;transition:.2s;background:#101010}}
  .nest:hover{{border-color:var(--brass);transform:translateY(-2px)}}
  .nest-l{{display:flex;flex-direction:column;text-align:left}}
  .nest-name{{font-weight:700;letter-spacing:2px;font-size:14px}}
  .nest-sub{{color:var(--stone);font-size:11px;margin-top:3px}}
  .nest-code{{color:var(--brass);font-size:10px;letter-spacing:2px}}
  .row{{display:flex;gap:10px}}
  .row a{{flex:1;border:1px solid var(--line);border-radius:14px;padding:13px;text-decoration:none;color:var(--paper);
    font-size:12px;letter-spacing:1px;transition:.2s;background:#101010}}
  .row a:hover{{border-color:var(--brass)}}
  .toggle{{width:100%;text-align:left;background:#101010;color:var(--paper);border:1px solid var(--line);
    border-radius:14px;padding:14px 16px;margin-bottom:10px;font:inherit;font-size:13px;letter-spacing:1px;
    cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:.2s}}
  .toggle:hover{{border-color:var(--brass)}}
  .toggle .chev{{color:var(--brass);transition:.2s}}
  .toggle.open .chev{{transform:rotate(90deg)}}
  .panel{{display:none;text-align:left;border:1px solid var(--line);border-top:none;
    border-radius:0 0 14px 14px;margin:-12px 0 10px;padding:14px 18px;background:#0d0d0d}}
  .panel.open{{display:block}}
  .panel li{{color:#c9c6bd;font-size:12.5px;line-height:1.55;margin:0 0 7px 2px;list-style:none;position:relative;padding-left:16px}}
  .panel li:before{{content:"›";color:var(--brass);position:absolute;left:0}}
  .panel .h{{color:var(--brass);font-size:11px;letter-spacing:2px;margin:2px 0 9px}}
  .foot{{color:#56554f;font-size:10px;letter-spacing:2px;margin-top:34px}}
  .note{{color:#56554f;font-size:9px;margin-top:8px}}
</style></head>
<body><div class="wrap">
  <img class="raven" alt="CORVO" src="data:image/png;base64,{b64}">
  <div class="brand">CORVO</div>
  <div class="tag">THE MURDER · LAHORE</div>
  <div class="promise">“Worn before. Wanted again.”</div>
  <div class="badge"><b>🎥 Verify before you pay</b> · live video on request</div>

  <a class="cta" href="https://wa.me/923208808233?text=Hi%20CORVO%2C%20I%20want%20to%20claim%20a%20piece" target="_blank">SHOP ON WHATSAPP →</a>

  <div class="section">ENTER THE 6 NESTS</div>
{nest_html}

  <div class="section">BEFORE YOU BUY</div>
  <button class="toggle" onclick="tg(this,'p-how')">How to order <span class="chev">›</span></button>
  <div class="panel" id="p-how">
    <div class="h">ORDER IN 5 STEPS</div>
    <ul>
      <li>Tap a nest and screenshot the piece you want.</li>
      <li>Message us on WhatsApp (or DM) with that piece.</li>
      <li>We send a live video + exact measurements so you can verify before you pay.</li>
      <li>Confirm &amp; pay via Easypaisa / JazzCash / bank transfer.</li>
      <li>We film your parcel as we pack it, then ship nationwide (2–4 days).</li>
    </ul>
  </div>
  <button class="toggle" onclick="tg(this,'p-size')">Size guide <span class="chev">›</span></button>
  <div class="panel" id="p-size">
    <div class="h">EVERY PIECE IS 1-OF-1 — CHECK THE MEASUREMENTS</div>
    <ul>
      <li>We list real measurements on every post. Compare them to an item you already own.</li>
      <li>Tops: pit-to-pit (armpit to armpit) × length (shoulder to hem).</li>
      <li>Bottoms: waist (laid flat) × inseam.</li>
      <li>Footwear: US/EU size + insole length in cm.</li>
      <li>Unsure? Send us your measurements and we'll tell you if it fits.</li>
    </ul>
  </div>
  <a class="toggle" href="https://instagram.com/corvo0fficial" target="_blank" style="text-decoration:none">Pop-up &amp; updates <span class="chev">›</span></a>

  <div class="foot">PAKISTAN'S FIRST THRIFT COMMUNITY · EST. 2026</div>
</div>
<script>
function tg(btn,id){{var p=document.getElementById(id);var o=p.classList.toggle('open');btn.classList.toggle('open',o);}}
</script>
</body></html>'''
open("CORVO_LINKTREE.html","w",encoding="utf-8").write(html)
print("saved CORVO_LINKTREE.html  (",len(html)//1024,"KB )")
