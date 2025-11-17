# 🧬 API-POWERED NAME GENERATION - Examples

## Overview
Yangi **Advanced Name Generator v3.0** ota-ona ismlaridan intelligent tavsiyalar beradi.

---

## 📊 Algorithm Strategies

### Strategy 1: **Exact Pattern Match** (95% confidence)
- Ota ismining **BIRINCHI harfi** bilan boshlanadi
- Ona ismining **OXIRGI harfi** bilan tugaydi

**Misol:**
```
Ota: Kamoliddin  → First letter: 'K'
Ona: Oisha       → Last letter: 'A'

Result: KAMOLA (K + ...amo... + la + A)
```

### Strategy 2: **Father Prefix Match** (75% confidence)
- Faqat ota ismining birinchi harfi bilan

**Misol:**
```
Ota: Kamoliddin → 'K'
Results: Kamola, Komila
```

### Strategy 3: **Mother Suffix Match** (70% confidence)
- Faqat ona ismining oxirgi harfi bilan

**Misol:**
```
Ona: Oisha → 'A'
Results: Komila, Aziza, Malika, Anora
```

### Strategy 4: **Syllable Blending** (50-60% confidence)
- Ota-ona ismlaridan bo'g'inlarni oladi

**Misol:**
```
Ota: Kamoliddin → syllables: [ka, kam, amo, mol, oli, lid, idd, ddi, din]
Ona: Oisha      → syllables: [oi, ois, ish, sha, ha]

Match in "Komila": kom (from kam), li (from oli)
Match in "Madina": ma (from kam), din (from din)
```

---

## 🎯 Real Examples

### Example 1: Kamoliddin + Oisha = ?

**Input:**
- Father: Kamoliddin
- Mother: Oisha
- Gender: Girl

**API Response:**
```json
[
  {
    "name": "Kamola",
    "meaning": "Kamolotga yetgan, to'liq [🏆 PERFECT DUAL]",
    "origin": "Arabcha",
    "gender": "girl",
    "confidence": 95
  },
  {
    "name": "Komila",
    "meaning": "Mukammal, kamolotga yetgan [👨 FATHER PREFIX]",
    "origin": "Arabcha",
    "gender": "girl",
    "confidence": 75
  },
  {
    "name": "Malika",
    "meaning": "Malika, qirolicha [👩 MOTHER SUFFIX]",
    "origin": "Arabcha",
    "gender": "girl",
    "confidence": 70
  },
  {
    "name": "Aziza",
    "meaning": "Aziz, hurmatli [👩 MOTHER SUFFIX]",
    "origin": "Arabcha",
    "gender": "girl",
    "confidence": 70
  },
  {
    "name": "Madina",
    "meaning": "Muqaddas shahar [🧬 2 SYLLABLE MATCH]",
    "origin": "Arabcha",
    "gender": "girl",
    "confidence": 60
  }
]
```

### Example 2: Amir + Zuhra = ?

**Input:**
- Father: Amir
- Mother: Zuhra
- Gender: Boy

**API Response:**
```json
[
  {
    "name": "Alisher",
    "meaning": "Arslon sifatli [🧬 CONTAINS BOTH]",
    "origin": "Arabcha-Forscha",
    "gender": "boy",
    "confidence": 50
  },
  {
    "name": "Akmal",
    "meaning": "Mukammal [👨 FATHER PREFIX]",
    "origin": "Arabcha",
    "gender": "boy",
    "confidence": 75
  },
  {
    "name": "Abdulloh",
    "meaning": "Allohning quli [👨 FATHER PREFIX]",
    "origin": "Arabcha",
    "gender": "boy",
    "confidence": 75
  }
]
```

---

## 🔧 Technical Implementation

### Service Location
`src/modules/bot/services/name-generator-api.service.ts`

### Key Methods

1. **generateNamesByPattern()**
   - Main algorithm
   - Pattern matching with confidence scoring
   - Returns top 10 results

2. **extractSyllables()**
   - Breaks names into 2-3 letter chunks
   - Used for syllable fusion strategy

3. **enrichWithExternalAPI()** *(Future)*
   - Placeholder for real API integration
   - Can connect to Behind The Name, Namsor, etc.

### Integration
Bot automatically uses API generation when:
- Parent names are provided (both father & mother)
- Uses `buildApiGeneratedRecommendations()` method

---

## 📈 Confidence Scoring

| Match Type | Confidence | Description |
|------------|-----------|-------------|
| 🏆 PERFECT DUAL | 95% | First letter + Last letter match |
| 👨 FATHER PREFIX | 75% | Starts with father's first letter |
| 👩 MOTHER SUFFIX | 70% | Ends with mother's last letter |
| 🧬 CONTAINS BOTH | 50% | Both letters present in name |
| 🧬 SYLLABLE MATCH | 40-60% | 2+ syllables from parents |
| 📊 PARTIAL | 30% | One letter match |

---

## 🚀 Future Enhancements

1. **External API Integration**
   - Behind The Name API
   - Namsor API for cultural validation
   - Islamic Names API

2. **Machine Learning**
   - Train on Uzbek name patterns
   - Predict popularity trends
   - Semantic similarity models

3. **Extended Database**
   - 500+ Uzbek names
   - Regional variations
   - Historical popularity data

---

## 💡 Usage in Bot

```typescript
// User inputs in Telegram bot:
Ota ismi: Kamoliddin
Ona ismi: Oisha
Jins: Qiz bola

// Bot responds with:
🎯 Profil: 🧬 API Generatsiya
Ota: Kamoliddin, Ona: Oisha asosida yaratilgan

1. 👧 Kamola — Kamolotga yetgan, to'liq [🏆 PERFECT DUAL]
2. 👧 Komila — Mukammal, kamolotga yetgan [👨 FATHER PREFIX]
3. 👧 Malika — Malika, qirolicha [👩 MOTHER SUFFIX]
...
```

---

**Ishlab chiqildi:** 2025-11-17  
**Version:** 3.0  
**Developer:** Senior AI Engineer 🚀
