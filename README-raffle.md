# Bitcoin Tiger Raffle Feature

## Overview

De Bitcoin Tiger Raffle functionaliteit stelt gebruikers in staat om tickets te kopen voor raffles waarbij ze exclusieve Bitcoin Tiger Ordinals en andere prijzen kunnen winnen.

## Features

- Weergave van actieve raffles
- Kopen van raffle tickets met Bitcoin sats
- Bijhouden van gekochte tickets per gebruiker
- Automatisch trekken van winnaars na afloop van een raffle

## Database Schema

De raffle functionaliteit maakt gebruik van de volgende database tabellen:

1. `Raffle` - Bevat informatie over de raffle (naam, beschrijving, afbeelding, ticketprijs, etc.)
2. `RaffleTicket` - Registreert tickets die gekocht zijn door gebruikers

## API Endpoints

- `GET /api/raffle/list` - Haalt alle raffles op (optioneel: filter op status)
- `GET /api/raffle/tickets` - Haalt tickets op voor een specifieke gebruiker
- `POST /api/raffle/purchase` - Koopt tickets voor een raffle

## Setup

1. Zorg ervoor dat de Prisma schema's up-to-date zijn:
   ```
   npm run prisma:migrate
   ```

2. Genereer de Prisma client:
   ```
   npm run prisma:generate
   ```

3. Seed de database met voorbeelddata:
   ```
   npm run prisma:seed
   ```

Je kunt ook alles in één keer uitvoeren met:
```
npm run db:setup
```

## Development

1. Om lokaal te ontwikkelen, zorg ervoor dat er een lokale PostgreSQL database beschikbaar is.
2. Kopieer het `.env.example` bestand naar `.env` en vul de juiste database credentials in.
3. Start de development server:
   ```
   npm run dev
   ```

## Winnaar Trekken (TODO)

Het automatisch trekken van een winnaar is nog niet geïmplementeerd. Dit kan worden gedaan met een cron job die regelmatig controleert of er raffles zijn afgelopen en nog geen winnaar hebben. 