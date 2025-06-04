# Bitcoin Tiger Chests - Deployment Instructies

## Vercel Configuratie

Voor een succesvolle deployment op Vercel, zorg ervoor dat de volgende omgevingsvariabelen zijn ingesteld:

### Vereiste omgevingsvariabelen

```
# Database URL (postgresql://)
DATABASE_URL=postgresql://username:password@host:port/database

# API configuratie
NEXT_PUBLIC_API_BASE_URL=https://jouw-domein.vercel.app

# Admin API key
ADMIN_API_KEY=jouw-veilige-admin-sleutel
```

### Belangrijk

- Zorg ervoor dat de DATABASE_URL begint met `postgresql://` of `postgres://` protocol
- Bij gebruik van een externe PostgreSQL database (zoals Supabase of Neon), kopieer de connection string exact zoals die wordt gegeven
- Als je migraties wilt uitvoeren, zorg ervoor dat je database gebruiker de juiste rechten heeft

## Troubleshooting

### Database verbinding

Als je problemen hebt met de database verbinding, controleer het volgende:

1. De URL begint met `postgresql://` of `postgres://`
2. De gebruikersnaam en wachtwoord zijn correct
3. De host is toegankelijk vanaf Vercel (sommige gratis database diensten vereisen IP whitelisting)
4. Het schema is correct gegenereerd met `npx prisma generate`

### Prisma schema generatie

Vercel bouwt je applicatie automatisch, maar het kan soms nodig zijn om Prisma client expliciet te genereren:

```bash
npx prisma generate
```

Dit commando wordt automatisch uitgevoerd tijdens de build fase via `prebuild` script in package.json. 