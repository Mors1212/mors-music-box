# Mors's Music Box

เครื่องเล่นเพลงแบบปุ่มลอยสำหรับ SillyTavern ที่เล่นเพลย์ลิสต์ประจำตัวบอทแต่ละตัว ลิสต์เพลงถูกเก็บไว้ในการ์ดบอท (`data.extensions.mors_music_box`) จึงติดไปกับไฟล์ PNG ตอน export และโมเดลไม่เห็น

## ติดตั้ง
- **จาก GitHub:** Extensions → Install extension → วางลิงก์ repo
- **ด้วยมือ:** แตกโฟลเดอร์ `mors-music-box` ใส่ใน `public/scripts/extensions/third-party/` แล้วรีโหลด ST

## ใช้งาน
1. เปิดแชตกับบอท (ใช้กับแชตเดี่ยว ไม่รองรับแชตกลุ่ม)
2. แตะปุ่ม ♪ ที่ลอยอยู่ (ลากย้ายได้) จะเปิดหน้าเพลย์ลิสต์ → แตะ ✎ มุมขวาบน
3. ใส่ชื่อเพลงและลิงก์ไฟล์เสียงตรง หรือเปิด "วางหลายเพลงทีเดียว" แล้ววางทีละบรรทัดแบบ `ชื่อเพลง | ลิงก์`
4. ใน "ตั้งค่าการ์ด" ใส่ป้าย (เช่น ISSUE 03), ข้อความลายมือ และธีมประจำการ์ดได้ → **Save to Card**

## ลิงก์เพลง
ต้องเป็นลิงก์ที่เปิดแล้วเป็นไฟล์เสียงทันที (mp3, ogg, m4a, wav)
- ใช้ได้ดี: Catbox (`files.catbox.moe/…`), GitHub raw / jsDelivr
- แปลงให้อัตโนมัติ: ลิงก์ Dropbox, GitHub `/blob/`, Google Drive `/file/d/…` (Drive อาจไม่เสถียรกับไฟล์ใหญ่)
- ใช้ไม่ได้: YouTube, Spotify, SoundCloud

## ธีม
ตั้งต้น: **Rose** · Elegant · Midnight
- สลับเร็ว ๆ: แตะปุ่มจานสีในหน้าเพลย์ลิสต์ · กดค้างเพื่อเปิดรายการธีม
- เพิ่มธีมเอง: Extensions → Mors's Music Box → **Import ธีม** (ไฟล์ JSON)
- ทำธีมใหม่ง่ายสุด: กด **Export ธีมนี้** แล้วเอาไฟล์ไปแก้สี/ฟอนต์

```json
{
  "name": "Prussian Night",
  "colors": {
    "screen": "#121826", "frame": "#0b0f17", "text": "#ece4d4", "muted": "#8f8778", "soft": "#a59d8e",
    "accent": "#c9a96e", "track": "#2c3650", "play": "#c9a96e", "playIcon": "#121826",
    "vinyl": "#0a0a0a", "groove": "#1d1d1d", "stylus": "#a88452", "stylusKnob": "#c9a96e",
    "row": "rgba(201,169,110,0.08)", "button": "#0d1119", "buttonIcon": "#c9a96e"
  },
  "fonts": { "tag": "Cinzel", "title": "Cormorant Garamond", "body": "DM Sans", "sign": "La Belle Aurore" },
  "texture": "paper"
}
```
- ไม่ใส่ค่าไหน จะใช้ค่าพื้นฐานแทน
- `fonts` ใส่ชื่อฟอนต์จาก Google Fonts ได้ จะโหลดให้อัตโนมัติ
- `texture`: `paper`, `paper-light`, `paper-dark`, `none` หรือลิงก์รูป https (ปูซ้ำเป็นลาย)
- ถ้าการ์ดกำหนดธีมไว้และเปิด "Use the character's theme" จะใช้ธีมของการ์ด ธีมที่ Import มาเองจะถูกฝังลงการ์ดตอนเลือกเป็นธีมประจำการ์ด

### ส่วนเสริม (ใส่หรือไม่ใส่ก็ได้)
```json
{
  "colors": { "line": "#c9a7ff" },
  "background": "https://…/bg.jpg",
  "disc": { "image": "https://…/disc.png", "grooves": false, "label": true },
  "stylus": { "image": "https://…/arm.png", "width": 70, "height": 140, "top": -40, "right": -30 }
}
```
- `colors.line` สีเส้นคั่นในลิสต์และหน้าแก้เพลย์ลิสต์ (ไม่ใส่ = ใช้สี `track`)
- `background` รูปเต็มจอ (ยืดให้เต็ม) ถ้าอยากให้ปูซ้ำใช้ `{ "image": "…", "fit": "tile" }`
- `disc.image` รูปแทนแผ่นเสียงสีดำ (แนะนำ PNG พื้นใส ทรงกลม) · `grooves` เปิด/ปิดลายร่องแผ่น (ใส่รูปแล้วจะปิดให้เอง) · `label: false` ซ่อนรูป avatar ตรงกลาง
- `stylus: false` เอาแขนเข็มออก หรือใส่ `image` เป็นรูปแขนเข็มแบบของเราเอง ปรับขนาดและตำแหน่งเป็น px ได้ (หมุนจากขอบบนตรงกลางของรูป)
- ลิงก์รูปต้องขึ้นต้นด้วย https หรือฝังรูปไว้ในไฟล์เป็น `data:image/…;base64,…` ก็ได้ (ไฟล์ธีมเดียวจบ ไม่ต้องฝากรูป)

## อื่น ๆ
- Import / Export JSON ในหน้าแก้เพลย์ลิสต์ ใช้ย้ายลิสต์ระหว่างบอทได้
- มือถือ: ควบคุมจากหน้าจอล็อกได้ (Media Session)
- "เล่นอัตโนมัติ" อาจโดนเบราว์เซอร์บล็อกจนกว่าจะแตะหน้าจอครั้งแรก

by Mors
