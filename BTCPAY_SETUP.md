# BTCPay Server Setup voor Bitcoin Tiger

## Voltage BTCPay Server Setup

### 1. Voltage Account Setup
1. Ga naar [Voltage](https://voltage.cloud) en maak een account aan
2. Maak een nieuwe BTCPay Server instance aan
3. Noteer je BTCPay Server URL (bijv. `https://your-instance.voltage.cloud`)

### 2. BTCPay Server Configuration
1. Log in op je BTCPay Server instance
2. Ga naar **Server Settings** → **Services** → **API Keys**
3. Klik op **Generate New API Key**
4. Selecteer de benodigde permissions:
   - `btcpay.store.canviewinvoices`
   - `btcpay.store.cancreateinvoice`
   - `btcpay.store.canmodifyinvoices`
5. Kopieer de gegenereerde API key

### 3. Store Setup
1. Ga naar **Stores** in je BTCPay Server dashboard
2. Maak een nieuwe store aan of gebruik een bestaande
3. Kopieer de Store ID uit de URL (bijv. `stores/abc123def456`)
4. Configureer je wallet setup voor Bitcoin onchain payments

### 4. Environment Variables
Voeg de volgende variabelen toe aan je `.env.local` bestand:

```env
# BTCPay Server Configuration
BTCPAY_SERVER_URL="https://your-voltage-instance.voltage.cloud"
BTCPAY_API_KEY="your_generated_api_key"
BTCPAY_STORE_ID="your_store_id"

# Application Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional: For production webhooks
BTCPAY_WEBHOOK_SECRET="your_webhook_secret"
```

### 5. Testing
1. Start je development server: `npm run dev`
2. Ga naar je applicatie en test een Bitcoin deposit
3. Controleer of de BTCPay invoice correct wordt aangemaakt
4. Test een small amount op testnet eerst

### 6. Production Webhook Setup (Optioneel)
Voor automatische payment confirmatie kun je webhooks instellen:

1. Ga naar **Store Settings** → **Webhooks**
2. Voeg een nieuwe webhook toe met URL: `https://yourdomain.com/api/webhooks/btcpay`
3. Selecteer events: `InvoiceSettled`, `InvoiceProcessing`
4. Voeg webhook secret toe voor beveiliging

### Troubleshooting
- **API Key Issues**: Controleer of je API key alle benodigde permissions heeft
- **Store Not Found**: Controleer of je Store ID correct is
- **Network Issues**: Zorg ervoor dat je BTCPay Server instance bereikbaar is
- **Invoice Creation Failed**: Controleer de browser console voor error details

### Security Notes
- Bewaar je API keys veilig en deel ze nooit
- Gebruik verschillende keys voor development en production
- Configureer IP restrictions in BTCPay Server indien mogelijk
- Monitor je invoices regelmatig voor verdachte activiteit 