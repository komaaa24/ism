# 🔧 SERVER MERGE MUAMMOSINI HAL QILISH

## ❌ Muammo:
```
error: Your local changes to the following files would be overwritten by merge:
	src/modules/bot/bot.service.ts
Please commit your changes or stash them before you merge.
```

## ✅ YECHIM 1: Lokal o'zgarishlarni bekor qilish (TAVSIYA ETILADI)

Agar serverdagi o'zgarishlar kerak bo'lmasa:

```bash
# Serverda bajaring:
git reset --hard HEAD
git pull origin master
```

Bu lokal o'zgarishlarni o'chirib, GitHub'dan yangi kodlarni tortadi.

---

## ✅ YECHIM 2: Lokal o'zgarishlarni saqlab qo'yish

Agar serverdagi o'zgarishlarni saqlamoqchi bo'lsangiz:

```bash
# Serverda bajaring:
git stash
git pull origin master
git stash pop
```

Bu lokal o'zgarishlarni vaqtincha saqlaydi, keyin qaytaradi.

---

## ✅ YECHIM 3: Conflict'larni qo'lda hal qilish

Agar ikkalasini ham birlashtirmoqchi bo'lsangiz:

```bash
# Serverda bajaring:
git add src/modules/bot/bot.service.ts
git commit -m "Local server changes"
git pull origin master
# Agar conflict bo'lsa, faylni tahrirlang
git add .
git commit -m "Merge with latest code"
```

---

## 🎯 ENG OSON VA XAVFSIZ USUL:

Serverda quyidagi buyruqlarni ketma-ket bajaring:

```bash
# 1. Hozirgi papkani tekshirish
pwd

# 2. Git holatini ko'rish
git status

# 3. Lokal o'zgarishlarni bekor qilish
git reset --hard HEAD

# 4. GitHub'dan tortish
git pull origin master

# 5. Dependencies yangilash
pnpm install

# 6. Build qilish
pnpm run build

# 7. PM2 bilan qayta ishga tushirish
pm2 restart all
# yoki
pm2 restart bot-name
```

---

## 📝 IZOH:

- `git reset --hard HEAD` - Barcha lokal o'zgarishlarni o'chiradi (xavfsiz, chunki GitHub'da bor)
- `git stash` - Lokal o'zgarishlarni saqlab qo'yadi
- Agar serverdagi o'zgarishlar kerak bo'lmasa, YECHIM 1 ni ishlating

---

## ✅ TO'LIQ JARAYON (NUSXA-KO'CHIRISH UCHUN):

```bash
cd /path/to/your/bot
git reset --hard HEAD
git pull origin master
pnpm install
pnpm run build
pm2 restart all
pm2 logs
```

Muvaffaqiyat! 🎉
