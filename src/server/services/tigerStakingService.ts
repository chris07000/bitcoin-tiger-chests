import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
// We're not importing TigerStaking from prisma/generated-client because the file doesn't exist
// Instead, we're using 'any' type for now to avoid linter errors

// Constanten voor staking
const CHEST_PERIOD_SECONDS = 7 * 24 * 60 * 60; // 7 dagen in seconden voor productie
export const CHEST_PERIOD = CHEST_PERIOD_SECONDS * 1000; // 7 dagen in milliseconden
const MIN_CHEST_REWARD = 10000; // 10k sats minimum
const MAX_CHEST_REWARD = 100000; // 100k sats maximum

// Status van een gestakede tiger
export interface TigerStakedInfo {
  id: string;            // ID van de tiger
  name: string;          // Naam van de tiger
  stakedAt: number;      // Timestamp wanneer de tiger gestaked is
  nextChestAt: number;   // Timestamp wanneer de volgende chest beschikbaar is
  image: string;         // Afbeelding URL van de tiger
  isRuneGuardian: boolean; // Is deze tiger een Rune Guardian?
  key: string;           // Voor compatibiliteit met de frontend
  hasClaimedChest: boolean; // We kunnen dit niet weten uit de database, dus standaard false
}

// Status van tiger staking voor een wallet
export interface TigerStakingStatus {
  stakedTigers: TigerStakedInfo[]; // Lijst van gestakede tigers
  stakedInfo: TigerStakedInfo[];    // Extra veld voor compatibiliteit met de frontend
  totalStaked: number;           // Totaal aantal gestakede tigers
  availableChests: number;      // Aantal beschikbare chests
  nextChestDate: number;        // Timestamp van de volgende chest
}

// Resultaat van een chest claim
export type TigerChestClaim = {
  success: boolean;
  satoshisAmount: number;
  chestRemaining: number;
  claimedAt: number;
  rewardType: string;
  balanceUpdated?: boolean; // Geeft aan of de balans al is bijgewerkt
};

// Lijst met bekende Bitcoin Tiger inscription IDs
// Dit zorgt ervoor dat we specifieke tigers kunnen herkennen
export const KNOWN_BITCOIN_TIGER_IDS = [
  // Bitcoin Tigers Series 1 (df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei0 t/m i292)
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei0", // Tiger Series 1 #1
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei1", // Tiger Series 1 #2
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei2", // Tiger Series 1 #3
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei3", // Tiger Series 1 #4
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei4", // Tiger Series 1 #5
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei5", // Tiger Series 1 #6
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei6", // Tiger Series 1 #7
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei7", // Tiger Series 1 #8
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei8", // Tiger Series 1 #9
  "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei9", // Tiger Series 1 #10
  
  // Bitcoin Tigers Series 2 (34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i0 t/m i293)
  "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i0", // Tiger Series 2 #1
  "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i1", // Tiger Series 2 #2
  "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i2", // Tiger Series 2 #3
  "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i3", // Tiger Series 2 #4
  "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i4", // Tiger Series 2 #5
  
  // Bitcoin Tigers Series 3 (002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi0 t/m i293)
  "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi0", // Tiger Series 3 #1
  "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi1", // Tiger Series 3 #2
  "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi2", // Tiger Series 3 #3
  "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi3", // Tiger Series 3 #4
  "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi4", // Tiger Series 3 #5
  
  // Bitcoin Tigers Series 4 (c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i0 t/m i117)
  "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i0", // Tiger Series 4 #1
  "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i1", // Tiger Series 4 #2
  "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i2", // Tiger Series 4 #3
  "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i3", // Tiger Series 4 #4
  "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i4", // Tiger Series 4 #5
  // ... en zo verder tot 117
];

// Herkenning van bekende Tiger patterns
export const TIGER_PATTERNS = [
  // Bitcoin Tigers collecties
  {
    baseId: "df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei",
    maxIndex: 292,
    series: 1
  },
  {
    baseId: "34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i",
    maxIndex: 293,
    series: 2
  },
  {
    baseId: "002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi",
    maxIndex: 293,
    series: 3
  },
  {
    baseId: "c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i",
    maxIndex: 117,
    series: 4
  },
  
  // The Rune Guardians partner project
  {
    baseId: "05be581d96d4d4585e2add709ef755cbf89265c71bee73aba50d59698b7c34eci",
    maxIndex: 762,
    series: "rune-guardians-1"
  },
  {
    baseId: "1fa5efccb9fceba13bbad8938694c232b3f5e0879f5a5727e955630708af3837i",
    maxIndex: 816,
    series: "rune-guardians-2"
  },
  {
    baseId: "29b6279c5463995870916c67b469faaa965c144dc0c62d800772ac035e4b8d23i",
    maxIndex: 797,
    series: "rune-guardians-3"
  },
  {
    baseId: "3b8a1ec149ee27107e61e10e4f80773adee20c75f90fd1a59bd8b085f82c16a4i",
    maxIndex: 199,
    series: "rune-guardians-4"
  },
  {
    baseId: "5aecf723e6c56b5a735a0c58ddb9e3ca8c1d6495014d922a94f5d5a1b108023bi",
    maxIndex: 618,
    series: "rune-guardians-5"
  },
  {
    baseId: "5dd2a6d2b695f98a945c58bde8a45bfa5875b9be0aad8677a861ee4232641f3bi",
    maxIndex: 793,
    series: "rune-guardians-6"
  },
  {
    baseId: "632790ddb63bedcc7d54ae31701b5eb2a6dcfbdf0b417f83b401f11613f55eb1i",
    maxIndex: 725,
    series: "rune-guardians-7"
  },
  {
    baseId: "66441b434c7d55e83893af69b701e336dfe9f24174aeccc94e4a1cf82dd3cbcei",
    maxIndex: 849,
    series: "rune-guardians-8"
  },
  {
    baseId: "8671dafa22c8929887d43fc729cb8a6f739dbfe04830911bcdfa85711a8d7665i",
    maxIndex: 157,
    series: "rune-guardians-9"
  },
  {
    baseId: "8a4580ba4c6e4119380740b16f64411d45d6d863276a212bf1771fd42b0910b1i",
    maxIndex: 758,
    series: "rune-guardians-10"
  },
  {
    baseId: "a02f95111188eb99af4a3047e9458d2023f53668d0f7be85a406c8bbf27d9354i",
    maxIndex: 890,
    series: "rune-guardians-11"
  },
  {
    baseId: "beff7f5b77e1971fe2606c3415f81d0ddccc7996c313740672de7a1c12c31eb1i",
    maxIndex: 795,
    series: "rune-guardians-12"
  },
  {
    baseId: "cbec51024b1de3ec004e02b7c676ca26871d8fd5ead37bbc017148e7561bbdb9i",
    maxIndex: 824,
    series: "rune-guardians-13"
  },
  {
    baseId: "cf54fe3a5942bcbf30277f96bef812b7a8a348e68d927b4c50b41cd55644d088i",
    maxIndex: 903,
    series: "rune-guardians-14"
  },
  {
    baseId: "b605a7f41d3c8cb83d1371ff2b835030e39f5fd666e341fffce0feb0e1c4b454i",
    maxIndex: 890,
    series: "rune-guardians-15"
  },
  
  // Taproot Alpha inscriptions
  {
    baseId: "47840ffe3a24102751c01104a5eabb3be0d3013c6f81e4bc3f0b955c9627248di",
    maxIndex: 554,
    series: "taproot-alpha"
  },
  {
    baseId: "5aecf723e6c56b5a735a0c58ddb9e3ca8c1d6495014d922a94f5d5a1b108023bi",
    maxIndex: 0,
    series: "taproot-alpha"
  },
  
  // SigmaX inscriptions
  {
    baseId: "bbcc29a118a2c5cc7cdd81c95fef1c6c8036d07db4437f1058532878249ac5eci",
    maxIndex: 419,
    series: "sigmax-1"
  },
  {
    baseId: "821ac77016796c87ea27a1e1e481b5f5285a59c61136ef069dea3f2a9d010655i",
    maxIndex: 454,
    series: "sigmax-2"
  },
  {
    baseId: "d34fdb58e4c3135405d246cdd3c533cf7b27b80c9608264d1107cf5a6620fe5fi",
    maxIndex: 212,
    series: "sigmax-3"
  },
  {
    baseId: "22404dc9cca8a8b70a5f26af0c0ff616cb64a00ab330429e2b7e2a54e067850ci",
    maxIndex: 496,
    series: "sigmax-4"
  },
  {
    baseId: "71015e503da1c7072fe365a9846554d77eba9d9a7afcc105d8ac535aa77bffbci",
    maxIndex: 489,
    series: "sigmax-5"
  },
  {
    baseId: "aba050b80c5090ae96eddad10f827a17ac47093d1577c680bf34054f9e210f59i",
    maxIndex: 494,
    series: "sigmax-6"
  },
  {
    baseId: "26ed1f845b6ffec8aa137f732acf97bd3c2f5320e85fbcd3c54da19f46d34ff2i",
    maxIndex: 494,
    series: "sigmax-7"
  },
  {
    baseId: "eefe4543561b5fb6d5d4e333759e71e459e1511d24b3ed49ca1944363f375387i",
    maxIndex: 484,
    series: "sigmax-8"
  },
  {
    baseId: "b87ad1a3247881cebb95317c5c16a3238a3e779e6e78c468d2c34c3f79706bdci",
    maxIndex: 309,
    series: "sigmax-9"
  },
  {
    baseId: "14af407b187d3236962d82540d571d3a077dfddd2eacb71ba40d130ad9a5662bi",
    maxIndex: 351,
    series: "sigmax-10"
  },
  {
    baseId: "bce132567ecd98e57b7fce8edcda8922c23d171f7a18789899655fec4144efaci",
    maxIndex: 351,
    series: "sigmax-11"
  },
  {
    baseId: "1bfd611bd7a74c098e40f81ee975fefec715366995b81ee1d5a5402d564c23f3i",
    maxIndex: 300,
    series: "sigmax-12"
  },
  {
    baseId: "bbe382a6fb1c118046edb4c416abb863b64fb0818ce6cc60d46c4f7e3dd64339i",
    maxIndex: 191,
    series: "sigmax-13"
  },
  {
    baseId: "6be540ae9f5f3d1df9f646f1fcb6d1e366844ba4e081a4d677f2312f75550314i",
    maxIndex: 171,
    series: "sigmax-14"
  },
  {
    baseId: "a4d66331fd73aa8b314a8476cffea5fbc487001a1e83565251336ff633e6b639i",
    maxIndex: 214,
    series: "sigmax-15"
  },
  {
    baseId: "ba97d6ed09595ca621095f87e1dcebd05c3a279d0c70e2b5f20ca6a8b2d445c9i",
    maxIndex: 110,
    series: "sigmax-16"
  }
];

// In-memory database simulatie voor ontwikkeling
// In productie zou dit vervangen worden door een echte database
type TigerStakingDB = {
  stakedTigers: Map<string, Map<string, TigerStakedInfo>>;  // wallet -> tigerId -> info
  claimedChests: Map<string, Array<{ 
    timestamp: number;
    amount: number;
  }>>;  // wallet -> claimed chests history
  stakingHistory: Array<{
    walletAddress: string;
    tigerId: string;
    action: 'stake' | 'unstake' | 'claim-chest';
    timestamp: number;
    amount?: number;
  }>;
};

// In-memory database initializeren
const tigerStakingDB: TigerStakingDB = {
  stakedTigers: new Map(),
  claimedChests: new Map(),
  stakingHistory: []
};

// Helper functie om de staking database te laden uit localStorage (indien beschikbaar)
const loadStakingFromStorage = () => {
  // Functie verwijderd: we gebruiken nu alleen de SQL database
  console.log('loadStakingFromStorage is deprecated - using SQL database instead');
};

// Helper functie om staking database op te slaan in localStorage
const saveStakingToStorage = () => {
  // Functie verwijderd: we gebruiken nu alleen de SQL database
  console.log('saveStakingToStorage is deprecated - using SQL database instead');
};

// Initialiseer de data uit de localStorage als we in een browser zijn
if (typeof window !== 'undefined') {
  // Code verwijderd: we gebruiken nu alleen de SQL database
  console.log('No longer initializing from localStorage - using SQL database instead');
}

// Helper functie om te bepalen of een inscription ID een bekende Bitcoin Tiger is
export const isKnownBitcoinTiger = (inscriptionId: string): boolean => {
  // Exacte match van een ID in de lijst
  if (KNOWN_BITCOIN_TIGER_IDS.includes(inscriptionId)) {
    return true;
  }
  
  // Check of het inscription ID voldoet aan een van de patterns
  for (const pattern of TIGER_PATTERNS) {
    if (inscriptionId.startsWith(pattern.baseId)) {
      // Het nummer na de 'i' extraheren
      const numberStr = inscriptionId.substring(pattern.baseId.length);
      const number = parseInt(numberStr);
      
      // Controleer of het een getal is en binnen het bereik
      if (!isNaN(number) && number >= 0 && number <= pattern.maxIndex) {
        // Log het juiste type op basis van de series
        const isTaprootAlpha = typeof pattern.series === 'string' && pattern.series.includes('taproot');
        const isRuneGuardian = typeof pattern.series === 'string' && pattern.series.includes('rune');
        const isSigmaX = typeof pattern.series === 'string' && pattern.series.includes('sigmax');
        
        if (isTaprootAlpha) {
          console.log(`Matched Taproot Alpha: ${inscriptionId} (Series: ${pattern.series})`);
          return true;
        } else if (isRuneGuardian) {
          console.log(`Matched Rune Guardian: ${inscriptionId} (Series: ${pattern.series})`);
          return true;
        } else if (isSigmaX) {
          console.log(`Matched SigmaX: ${inscriptionId} (Series: ${pattern.series})`);
          // BELANGRIJK: We retourneren false voor SigmaX, omdat het geen Bitcoin Tiger is
          return false;
        } else {
          console.log(`Matched Bitcoin Tiger: ${inscriptionId} (Series: ${pattern.series})`);
          return true;
        }
      }
    }
  }
  
  return false;
};

// TigerStakingService klasse voor het afhandelen van Tiger staking operaties
export class TigerStakingService {
  // Get staking status for a wallet
  async getTigerStakingStatus(walletAddress: string): Promise<TigerStakingStatus> {
    try {
      if (!prisma) {
        console.error('Prisma client is not initialized');
        throw new Error('Database connection not available');
      }

      // Vind de wallet in de database
      const wallet = await prisma.wallet.findUnique({
        where: { address: walletAddress }
      });
      
      if (!wallet) {
        console.log(`Wallet ${walletAddress} not found, returning empty staking status`);
        return {
          stakedTigers: [],
          stakedInfo: [], // Voor compatibiliteit met de frontend
          totalStaked: 0,
          availableChests: 0,
          nextChestDate: 0
        };
      }
      
      // Haal alle actieve staked tigers op voor deze wallet
      const stakedTigers = await prisma.tigerStaking.findMany({
        where: {
          walletId: wallet.id,
          isActive: true
        }
      });
      
      // Converteer database records naar TigerStakedInfo objecten
      const stakedTigersInfo: TigerStakedInfo[] = stakedTigers.map((tiger: any) => ({
        id: tiger.tigerId,
        name: tiger.tigerName || `Bitcoin Tiger #${tiger.tigerId}`,
        stakedAt: tiger.stakedAt.getTime(),
        nextChestAt: tiger.nextChestAt.getTime(),
        image: tiger.tigerImage || '/tiger-pixel1.png',
        isRuneGuardian: tiger.isGuardian || false,
        key: tiger.tigerId, // Voor compatibiliteit met de frontend
        hasClaimedChest: false // We kunnen dit niet weten uit de database, dus standaard false
      }));
      
      // Bereken de volgende beschikbare chest datum
      let nextChestDate = Number.MAX_SAFE_INTEGER;
      const now = Date.now();
      let availableChests = 0;
      
      // Ga door alle tigers heen om beschikbare chests te berekenen
      for (const tiger of stakedTigers) {
        const nextChestTime = tiger.nextChestAt.getTime();
        if (nextChestTime <= now) {
          availableChests++;
        }
        if (nextChestTime < nextChestDate) {
          nextChestDate = nextChestTime;
        }
      }
      
      // Als er geen tigers zijn gestaked, zet de nextChestDate op 0
      if (stakedTigers.length === 0) {
        nextChestDate = 0;
      }
      
      // Log voor debugging
      console.log(`Staking status for wallet ${walletAddress}:`);
      console.log(`- Total staked tigers: ${stakedTigersInfo.length}`);
      console.log(`- Available chests: ${availableChests}`);
      console.log(`- Next chest date: ${nextChestDate > 0 ? new Date(nextChestDate).toISOString() : 'None'}`);
      console.log(`- Staked tigers info:`, stakedTigersInfo);
      
      return {
        stakedTigers: stakedTigersInfo, // Dit was eerst een array, nu is het aantal
        stakedInfo: stakedTigersInfo, // Extra veld voor compatibiliteit met de frontend
        totalStaked: stakedTigersInfo.length,
        availableChests,
        nextChestDate
      };
    } catch (error) {
      console.error('Error getting tiger staking status:', error);
      throw error;
    }
  }
  
  // Stake een Bitcoin Tiger
  async stakeTiger(walletAddress: string, tigerId: string, tigerData: any): Promise<TigerStakingStatus> {
    console.log(`Staking Bitcoin Tiger ${tigerId} for wallet ${walletAddress}`);
    
    try {
      if (!prisma) {
        console.error('Prisma client is not initialized');
        throw new Error('Database connection not available');
      }
      
      // Controleer of de wallet bestaat
      let wallet = await prisma.wallet.findUnique({
        where: { address: walletAddress }
      });
      
      // Als de wallet niet bestaat, creëer deze
      if (!wallet) {
        console.log(`Creating new wallet record for ${walletAddress}`);
        wallet = await prisma.wallet.create({
          data: {
            id: `wallet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            address: walletAddress,
            balance: 0,
            updatedAt: new Date()
          }
        });
        console.log(`Found wallet in database: ${wallet.id}`);
      } else {
        console.log(`Found wallet in database: ${wallet.id}`);
      }
      
      // Controleer of deze tiger niet al gestaked is
      const existingStake = await prisma.tigerStaking.findFirst({
        where: {
          walletId: wallet.id,
          tigerId: tigerId,
          isActive: true
        }
      });
      
      if (existingStake) {
        console.log(`Tiger ${tigerId} is already staked by wallet ${walletAddress}. Returning current staking status.`);
        return await this.getTigerStakingStatus(walletAddress);
      }
      
      // Gebruik de timestamps die door de server-side API zijn bepaald
      // Als ze niet worden opgegeven, maak dan zelf nieuwe timestamps aan
      const now = Date.now();
      const stakedAt = tigerData.stakedAt || now;
      const nextChestAt = tigerData.nextChestAt || (now + CHEST_PERIOD);
      
      console.log(`Setting stake time to ${new Date(stakedAt).toISOString()}`);
      console.log(`Setting nextChestAt to ${new Date(nextChestAt).toISOString()} (exactly ${CHEST_PERIOD_SECONDS}s later)`);
      
      try {
        // Creëer de tiger staking record in de database
        await prisma.tigerStaking.create({
          data: {
            id: `stake_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            walletId: wallet.id,
            tigerId: tigerId,
            tigerName: tigerData.name || `Bitcoin Tiger #${tigerId}`,
            tigerImage: tigerData.image || '/tiger-pixel1.png',
            isGuardian: tigerData.isRuneGuardian || false,
            stakedAt: new Date(stakedAt),
            nextChestAt: new Date(nextChestAt),
            isActive: true,
            tigerLevel: 1,
            updatedAt: new Date()
          }
        });
      } catch (error: any) {
        // Als we een unieke constraint error krijgen (P2002), betekent het dat de tiger al gestaakt is
        if (error.code === 'P2002') {
          console.log(`Tiger ${tigerId} is already staked by wallet ${walletAddress}. Updating if needed.`);
          
          // Update de bestaande tiger stake zodat deze actief is (voor het geval hij inactief was)
          await prisma.tigerStaking.updateMany({
            where: {
              walletId: wallet.id,
              tigerId: tigerId
            },
            data: {
              isActive: true,
              updatedAt: new Date()
            }
          });
        } else {
          // Voor andere fouten, gooi door
          throw error;
        }
      }
      
      // Return bijgewerkte staking status
      return await this.getTigerStakingStatus(walletAddress);
    } catch (error) {
      console.error('Error staking tiger:', error);
      throw error;
    }
  }
  
  // Claim een chest
  async claimChest(walletAddress: string): Promise<TigerChestClaim> {
    console.log(`Claiming chest for wallet: ${walletAddress}`);
    
    try {
      if (!prisma) {
        console.error('Prisma client is not initialized');
        throw new Error('Database connection not available');
      }
      
      // Vind de wallet in de database
      const wallet = await prisma.wallet.findUnique({
        where: { address: walletAddress }
      });
      
      if (!wallet) {
        console.log(`Wallet ${walletAddress} not found`);
        throw new Error('Wallet not found');
      }
      
      // Haal alle actieve staked tigers op voor deze wallet
      const stakedTigers = await prisma.tigerStaking.findMany({
        where: {
          walletId: wallet.id,
          isActive: true
        }
      });
      
      if (stakedTigers.length === 0) {
        console.log(`No staked tigers found for wallet ${walletAddress}`);
        throw new Error('No staked tigers found');
      }
      
      // Vind tigers met beschikbare chests
      const now = Date.now();
      const availableTigers = stakedTigers.filter(
        (tiger: any) => tiger.nextChestAt.getTime() <= now
      );
      
      if (availableTigers.length === 0) {
        console.log(`No available chests found for wallet ${walletAddress}`);
        throw new Error('No chests available to claim');
      }
      
      // Kies de eerste beschikbare tiger
      const tigerToClaim = availableTigers[0];
      
      // Genereer random reward
      const randomValue = (randomBytes(4).readUInt32BE(0) % 10000) / 100; // 0 to 99.99
      console.log(`Random value for reward determination: ${randomValue}`);
      
      // Reward chances: 99.95% low roll, 0.04% high roll, 0.01% jackpot
      let satoshisAmount: number;
      let rewardType: string;
      
      if (randomValue < 0.01) {
        // 0.01% chance of jackpot (25,000-100,000 sats)
        satoshisAmount = Math.floor(Math.random() * 75000) + 25000;
        rewardType = "JACKPOT";
        console.log(`JACKPOT reward generated: ${satoshisAmount} sats`);
      } else if (randomValue < 0.05) {
        // 0.04% chance of high roll (10,000-25,000 sats)
        satoshisAmount = Math.floor(Math.random() * 15000) + 10000;
        rewardType = "HIGH_ROLL";
        console.log(`HIGH ROLL reward generated: ${satoshisAmount} sats`);
      } else {
        // 99.95% chance of low roll (1,000-10,000 sats)
        satoshisAmount = Math.floor(Math.random() * 9000) + 1000;
        rewardType = "LOW_ROLL";
        console.log(`LOW ROLL reward generated: ${satoshisAmount} sats`);
      }
      
      // Update de volgende chest datum voor deze tiger
      await prisma.tigerStaking.update({
        where: {
          id: tigerToClaim.id
        },
        data: {
          nextChestAt: new Date(now + CHEST_PERIOD)
        }
      });
      
      // Registreer de claim
      const chestClaim = await prisma.tigerChestClaim.create({
        data: {
          id: `claim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          walletId: wallet.id,
          tigerId: tigerToClaim.tigerId,
          stakedId: tigerToClaim.id,
          amount: satoshisAmount,
          rewardType: rewardType,
          claimedAt: new Date()
        }
      });
      
      // Update de wallet balance
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: satoshisAmount
          },
          updatedAt: new Date()
        }
      });
      
      // Creëer een transactie record
      await prisma.transaction.create({
        data: {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          walletId: wallet.id,
          amount: satoshisAmount,
          type: 'REWARD',
          status: 'COMPLETED',
          paymentHash: `chest_${Date.now()}`,
          createdAt: new Date()
        }
      });
      
      // Bereken hoeveel chests er nog over zijn na deze claim
      const remainingAvailableTigers = await prisma.tigerStaking.count({
        where: {
          walletId: wallet.id,
          isActive: true,
          nextChestAt: {
            lte: new Date()
          }
        }
      });
      
      // Return claim resultaat
      return {
        success: true,
        satoshisAmount,
        chestRemaining: remainingAvailableTigers,
        claimedAt: Date.now(),
        rewardType,
        balanceUpdated: true // Geeft aan dat de balans is bijgewerkt
      };
    } catch (error) {
      console.error('Error claiming chest:', error);
      throw error;
    }
  }
  
  // Unstake een Bitcoin Tiger
  async unstakeTiger(walletAddress: string, tigerId: string): Promise<TigerStakingStatus> {
    console.log(`Unstaking Bitcoin Tiger ${tigerId} for wallet ${walletAddress}`);
    
    try {
      if (!prisma) {
        console.error('Prisma client is not initialized');
        throw new Error('Database connection not available');
      }
      
      // Vind de wallet in de database
      const wallet = await prisma.wallet.findUnique({
        where: { address: walletAddress }
      });
      
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      
      // Vind de gestakede tiger
      const stakedTiger = await prisma.tigerStaking.findFirst({
        where: {
          walletId: wallet.id,
          tigerId: tigerId,
          isActive: true
        }
      });
      
      if (!stakedTiger) {
        throw new Error('This Bitcoin Tiger is not staked by this wallet');
      }
      
      // Update de status naar inactief
      await prisma.tigerStaking.update({
        where: {
          id: stakedTiger.id
        },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });
      
      // Return bijgewerkte staking status
      return await this.getTigerStakingStatus(walletAddress);
    } catch (error) {
      console.error('Error unstaking tiger:', error);
      throw error;
    }
  }
}

// Exporteer een instance van de service
export const tigerStakingService = new TigerStakingService();