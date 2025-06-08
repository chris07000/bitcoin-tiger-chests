# Tiger Images Directory

Deze directory bevat lokale afbeeldingen voor Bitcoin Tigers om rate limiting problemen met ordinals.com te vermijden.

## Hoe te gebruiken:

1. **Voeg tiger afbeeldingen toe:** Plaats de daadwerkelijke tiger afbeeldingen hier met bestandsnamen tiger1.png, tiger2.png, etc.

2. **Update de mapping:** In `src/components/BitcoinTigersStaking.tsx` staat de `TIGER_IMAGE_MAPPING` die inscription IDs mapt naar lokale afbeeldingen.

3. **Voeg nieuwe mappings toe:** Voor elke nieuwe tiger, voeg een entry toe in de mapping:
   ```javascript
   'INSCRIPTION_ID_HIER': '/tigers/tigerX.png'
   ```

## Voordelen:

✅ **Geen rate limits** - Lokale afbeeldingen laden altijd snel
✅ **Betere prestaties** - Geen externe API calls nodig
✅ **Betrouwbaar** - Geen afhankelijkheid van externe services
✅ **Cacheable** - Browsers kunnen afbeeldingen cachen

## Format:

- Aanbevolen formaat: PNG
- Aanbevolen grootte: 180x180px of groter
- Bestandsnaam: tiger1.png, tiger2.png, tiger3.png, etc.

## Fallback:

Als er geen mapping is voor een inscription ID, gebruikt het systeem automatisch een van de pixel tiger afbeeldingen uit de public directory. 