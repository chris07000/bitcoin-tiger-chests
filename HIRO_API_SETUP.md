# 🚀 Hiro API Setup Guide - Dramatische Verbetering Image Loading

## 📈 **Resultaat: 36x Snellere Image Loading**

Met een gratis Hiro API key krijg je **900 requests per minuut** in plaats van 25. Dat is **15 requests per seconde**!

## 🔑 **Stap 1: Gratis API Key Aanvragen**

1. Ga naar: https://platform.hiro.so/
2. Maak een gratis account aan
3. Ga naar "API Keys" in je dashboard
4. Klik "Create New API Key"
5. Selecteer "Free/Starter" plan (standaard)
6. Kopieer je API key

## ⚙️ **Stap 2: Environment Variable Configureren**

Voeg deze regel toe aan je `.env.local` bestand:

```env
NEXT_PUBLIC_HIRO_API_KEY=jouw_api_key_hier
```

**Voorbeeld:**
```env
NEXT_PUBLIC_HIRO_API_KEY=hiro_pk_1234567890abcdef
```

## 🔧 **Stap 3: Vercel Environment Variables**

Voor productie op Vercel:

1. Ga naar je Vercel dashboard
2. Open je project settings
3. Ga naar "Environment Variables"
4. Voeg toe:
   - **Name:** `NEXT_PUBLIC_HIRO_API_KEY`
   - **Value:** `jouw_api_key`
   - **Environment:** All (Production, Preview, Development)

## 📊 **Rate Limits Overzicht**

| Situatie | Rate Limit | Per Seconde | Maandelijk Limit |
|----------|------------|-------------|------------------|
| **Geen API key** | 25 RPM | 0.42 req/sec | Geen |
| **🎯 Gratis API key** | **900 RPM** | **15 req/sec** | 50K Bitcoin L1 |
| Build plan ($99) | 3K RPM | 50 req/sec | 500K Bitcoin L1 |

## ✅ **Wat Dit Oplost**

### **Zonder API Key (huidige situatie):**
- ❌ Langzame image loading
- ❌ Vaak timeout errors  
- ❌ Gebruikers zien niet hun exacte tigers
- ❌ 25 requests per minuut = 1 request per 2.4 seconden

### **Met Gratis API Key:**
- ✅ **36x snellere loading**
- ✅ Betrouwbare image loading
- ✅ Gebruikers zien altijd hun exacte tigers
- ✅ 900 requests per minuut = 1 request per 67ms
- ✅ Intelligent fallback naar meerdere endpoints
- ✅ Automatische retry met exponential backoff

## 🎯 **Technische Verbeteringen**

De nieuwe image loading gebruikt:

1. **Multi-strategy loading:**
   - Primary: ordinals.com (snelst)
   - Secondary: Hiro API met key
   - Tertiary: Alternatieve endpoints

2. **Intelligent batching:**
   - Respecteert rate limits automatisch
   - Optimaliseert verzoek timing
   - Batch processing voor meerdere images

3. **Advanced retry logic:**
   - Exponential backoff (1s, 2s, 4s)
   - Verschillende endpoints proberen
   - HEAD requests voor snellere checks

## 🔍 **Verificatie**

Na setup, check je browser console voor:
```
✅ Tiger abc123: Primary URL works
🚀 Batch loading 12 tiger images with 15.0 req/sec (67ms delay)
```

## 📞 **Support**

Als je problemen hebt:
1. Check je browser console voor error messages
2. Verify dat `NEXT_PUBLIC_HIRO_API_KEY` correct is ingesteld
3. Restart je development server na environment variable changes

---

**🎉 Resultaat: Perfect werkende tiger images voor alle gebruikers!** 