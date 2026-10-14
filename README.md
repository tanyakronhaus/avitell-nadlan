# ממשבר להזדמנות בענף הנדל״ן — אתר

אתר בשפה העיצובית של TELL.DAVID. כל "שקף" הוא `<section class="slide">` ב-`index.html`.

## קבצים
- `index.html` — כל התוכן (31 שקפים, `id="s01"` עד `id="s31"`)
- `styles.css` — העיצוב: צבעים, גדלי טקסט, פריסות, התאמה למובייל ולהדפסה
- `script.js` — ניווט במקלדת (חצים, PageUp/PageDown, רווח)
- `assets/telldavid-logo.png` — הלוגו

## מבנה שקף
- `.pill` — הכותרת המעוגלת למעלה. `class="pill-title is-new"` = כותרת נושא חדש (מודגשת); בלי `is-new` = "המשך" (רגילה).
- `.cols` — שני טורים (הטור הראשון בקוד מופיע מימין).
- `.single` — טור טקסט אחד ומספר שקף גדול משמאל (`.big-num`).
- `<strong>` — הדגשה בלבן בתוך פסקה.

## הוספת תמונה / סרטון
בשקף מסוג `.single`, החליפי את `<span class="big-num">…</span>` ב:
```html
<figure class="media"><img src="assets/photo.jpg" alt="תיאור"></figure>
```
או `<video src="assets/clip.mp4" autoplay muted loop playsinline></video>` בתוך ה-figure.

## צבעים (ב-`:root` בראש styles.css)
רקע `#0B0B0A` · טקסט `#F4F1EA` · טקסט משני `#C9C4B8` · אדום `#E5484D`
