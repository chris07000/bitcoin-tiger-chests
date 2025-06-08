# Tiger Images System

Dit systeem gebruikt de bestaande genummerde tiger afbeeldingen in de `public` directory (1.png, 2.png, etc.) om rate limiting problemen met ordinals.com te vermijden.

## Hoe het werkt:

### 1. **Bestaande Afbeeldingen**
- Tiger afbeeldingen: `1.png` tot `999.png` (bijna 1000 tigers!)
- Fallback afbeeldingen: `tiger-pixel1.png`, `tiger-pixel2.png`, etc.

### 2. **Tiger Number Mapping**
Voor bekende inscription IDs hebben we een directe mapping naar nummers:

```javascript
const TIGER_NUMBER_MAPPING: Record<string, number> = {
  'e0fa3603a3eb14944bb38d16dbf21a7eb79af8ebd21828e8dad72f7ce4daa7cei0': 1, // → /1.png
  'c9970479c393de09e886afd5fd3e0ff5c4fea97e00d1c4251469d99469357a46i0': 2, // → /2.png
  // ... meer mappings
};
```

### 3. **Automatische Nummer Generatie**
Voor inscription IDs zonder mapping wordt er automatisch een consistent nummer gegenereerd:

```javascript
// Inscription ID → Hash → Nummer tussen 1-999
const number = (Math.abs(hash) % 999) + 1;
// Resultaat: /247.png (bijvoorbeeld)
```

### 4. **Fallback System**
Als laatste optie worden de pixel tiger afbeeldingen gebruikt.

## Voordelen:

✅ **Geen rate limits** - Alle afbeeldingen zijn lokaal  
✅ **Instant loading** - Directe toegang tot genummerde bestanden  
✅ **Consistent** - Zelfde inscription ID geeft altijd dezelfde afbeelding  
✅ **Schaalbaar** - Gebruikt bestaande 999 tiger afbeeldingen  
✅ **Automatisch** - Geen handmatige mapping nodig voor de meeste tigers  

## Console Logging:

Het systeem logt automatisch wat er gebeurt:

- ✅ `Found mapped number for abc123...: 5.png` (directe mapping)
- 🎯 `Generated number for def456...: 247.png` (automatisch gegenereerd)
- 🎭 `Using fallback image for xyz789...: /tiger-pixel1.png` (fallback)

## Nieuwe Mappings Toevoegen:

Als je specifieke tigers naar specifieke nummers wilt mappen:

1. Check console voor missing mappings
2. Voeg toe aan `TIGER_NUMBER_MAPPING`:
   ```javascript
   'INSCRIPTION_ID_HIER': 42, // → /42.png
   ```

## File Structure:

```
public/
├── 1.png          ← Tiger #1
├── 2.png          ← Tiger #2
├── ...
├── 999.png        ← Tiger #999
├── tiger-pixel1.png ← Fallback
├── tiger-pixel2.png ← Fallback
└── ...
```

Dit systeem is veel simpeler en betrouwbaarder dan het vorige complexe mapping systeem! 