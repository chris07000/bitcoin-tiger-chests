import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';

type ChestType = 'bronze' | 'silver' | 'gold';

interface ChestProgress {
  bronzeOpened: number;
  silverOpened: number;
  goldOpened: number;
  nextBronzeReward: number;
  nextSilverReward: number;
  nextGoldReward: number;
}

interface ChestProgressContextType {
  progress: ChestProgress;
  addOpenedChest: (type: ChestType) => void;
  canClaimFreeChest: (type: ChestType) => boolean;
  claimFreeChest: (type: ChestType) => void;
}

const DEFAULT_PROGRESS: ChestProgress = {
  bronzeOpened: 0,
  silverOpened: 0,
  goldOpened: 0,
  nextBronzeReward: 50,
  nextSilverReward: 50,
  nextGoldReward: 50
};

const ChestProgressContext = createContext<ChestProgressContextType | undefined>(undefined);

// Helper om progress data van de server te laden
const fetchProgressFromServer = async (walletAddress: string): Promise<ChestProgress | null> => {
  if (!walletAddress) {
    console.error('Cannot fetch progress: No wallet address provided');
    return null;
  }
  
  console.log('=== FETCHING PROGRESS FROM SERVER DEBUG ===');
  console.log(`Fetching progress for wallet: ${walletAddress}`);
  
  try {
    // Gebruik cache control headers om zeker verse data te krijgen
    const response = await fetch(`/api/chests/progress/${walletAddress}?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log('Fetch response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server responded with error ${response.status}: ${errorText}`);
      return DEFAULT_PROGRESS;
    }
    
    const data = await response.json();
    console.log('Received progress data from server:', data);
    
    if (!data || !data.progress) {
      console.error('Invalid progress data received from server:', data);
      return DEFAULT_PROGRESS;
    }
    
    // Log de bronzeOpened waarde specifiek
    console.log('bronzeOpened from server:', data.progress.bronzeOpened);
    
    return data.progress as ChestProgress;
  } catch (error) {
    console.error('Error fetching progress from server:', error);
    return DEFAULT_PROGRESS;
  } finally {
    console.log('=== END FETCHING PROGRESS DEBUG ===');
  }
};

// Helper om progress data naar de server te sturen
const saveProgressToServer = async (walletAddress: string, progress: ChestProgress): Promise<void> => {
  if (!walletAddress) {
    console.log('No wallet address provided, cannot save progress');
    return;
  }
  
  try {
    // IP Check - op lokaal IP gebruiken we geen API
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.'))) {
      console.log('On local IP: Skipping save to server');
      return;
    }
    
    console.log(`Saving chest progress to server for wallet ${walletAddress}:`, progress);
    
    const baseUrl = typeof window !== 'undefined' ? 
      (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
    
    // Voeg cache control en content-type headers toe
    const response = await fetch(`${baseUrl}/api/chests/progress/${walletAddress}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ progress }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Error saving chest progress to server:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Gooi een error zodat de retry logica wordt geactiveerd
      throw new Error(`Failed to save progress: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Chest progress saved successfully:', data);
  } catch (error) {
    console.error('Error saving chest progress:', error);
    
    // Sla de laatste progress en wallet op voor de retry
    const lastProgress = {...progress};
    const lastWallet = walletAddress;
    
    // Als er geen verbinding is met de server, probeer het nogmaals na een korte vertraging
    setTimeout(() => {
      console.log('Retrying to save chest progress...');
      try {
        const baseUrl = typeof window !== 'undefined' ? 
          (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
          
        fetch(`${baseUrl}/api/chests/progress/${lastWallet}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          body: JSON.stringify({ progress: lastProgress }),
        }).then(response => {
          if (response.ok) {
            console.log('Retry successful: Chest progress saved');
            return response.json();
          } else {
            console.error('Retry failed: Could not save chest progress');
            throw new Error(`Failed retry: ${response.status} ${response.statusText}`);
          }
        }).then(data => {
          console.log('Retry response data:', data);
        }).catch(retryError => {
          console.error('Error in retry:', retryError);
          
          // Probeer nog een laatste keer na een langere vertraging
          setTimeout(() => {
            console.log('Final retry attempt to save chest progress...');
            fetch(`${baseUrl}/api/chests/progress/${lastWallet}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              },
              body: JSON.stringify({ progress: lastProgress }),
            }).then(response => {
              console.log('Final retry result:', response.ok ? 'Success' : 'Failed');
            }).catch(finalError => {
              console.error('Final retry failed:', finalError);
            });
          }, 5000); // Laatste poging na 5 seconden
        });
      } catch (retryError) {
        console.error('Error in retry attempt:', retryError);
      }
    }, 3000); // Probeer na 3 seconden opnieuw
  }
};

export const ChestProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { walletAddress } = useWallet();
  const [progress, setProgress] = useState<ChestProgress>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load progress from server when wallet changes or on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!walletAddress) {
        console.log('No wallet address available, using default progress');
        setProgress(DEFAULT_PROGRESS);
        setIsLoading(false);
        return;
      }
      
      console.log(`Loading chest progress for wallet: ${walletAddress}`);
      setIsLoading(true);
      
      try {
        // Haal de data op van de server
        const serverProgress = await fetchProgressFromServer(walletAddress);
        
        if (serverProgress) {
          console.log('Setting progress from server data:', serverProgress);
          setProgress(serverProgress);
          
          // Sync de data terug naar de server om zeker te zijn dat alles up-to-date is
          // Dit lost eventuele inconsistenties op tussen client en server
          saveProgressToServer(walletAddress, serverProgress)
            .catch(syncError => {
              console.error('Error syncing progress back to server:', syncError);
            });
        } else {
          console.warn('No server progress returned, using defaults');
          setProgress(DEFAULT_PROGRESS);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        setProgress(DEFAULT_PROGRESS);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Laad de progress meteen bij initialisatie
    loadProgress();
    
    // Stel een interval in om de progress regelmatig te verversen
    const refreshInterval = setInterval(() => {
      if (walletAddress) {
        console.log('Refreshing chest progress data...');
        loadProgress();
      }
    }, 60000); // Ververs elke 60 seconden
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [walletAddress]);

  // Save progress to server whenever it changes
  useEffect(() => {
    if (!walletAddress || isLoading) return;
    
    console.log('Progress changed, saving to server:', progress);
    
    // Gebruik een debounce om te voorkomen dat we teveel aanroepen doen
    const saveTimeout = setTimeout(() => {
      saveProgressToServer(walletAddress, progress)
        .catch(error => {
          console.error('Failed to save progress after debounce:', error);
        });
    }, 500); // 500ms debounce
    
    return () => clearTimeout(saveTimeout);
  }, [progress, walletAddress, isLoading]);
  
  // Extra interval om de progress periodiek op te slaan (failsafe)
  useEffect(() => {
    if (!walletAddress) return;
    
    // Sla elke 30 seconden de voortgang op als extra zekerheid
    const saveInterval = setInterval(() => {
      if (!isLoading) {
        console.log('Interval: Saving chest progress to ensure persistence');
        saveProgressToServer(walletAddress, progress)
          .catch(error => {
            console.error('Failed to save progress in interval:', error);
          });
      }
    }, 30000); // Elke 30 seconden
    
    return () => clearInterval(saveInterval);
  }, [progress, walletAddress, isLoading]);

  const addOpenedChest = (type: ChestType) => {
    if (!walletAddress) return;
    
    console.log(`Adding opened chest of type: ${type}`);
    
    // Maak eerst een kopie van de huidige progress
    const currentProgress = { ...progress };
    
    // Update de telling voor dit type chest
    const updatedCount = currentProgress[`${type}Opened` as keyof ChestProgress] + 1;
    currentProgress[`${type}Opened` as keyof ChestProgress] = updatedCount;
    
    console.log(`Progress update: ${type}Opened van ${progress[`${type}Opened` as keyof ChestProgress]} naar ${updatedCount}`);
    
    // Direct de server updaten met de nieuwe waarde
    try {
      console.log('Direct server update with new progress:', currentProgress);
      
      // Server update in aparte context uitvoeren om state update niet te blokkeren
      (async () => {
        try {
          const baseUrl = typeof window !== 'undefined' ? 
            (process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin) : '';
            
          const serverResponse = await fetch(`${baseUrl}/api/chests/progress/${walletAddress}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            },
            body: JSON.stringify({ progress: currentProgress }),
          });
          
          if (serverResponse.ok) {
            const data = await serverResponse.json();
            console.log('Server update successful:', data);
          } else {
            console.error('Server update failed:', serverResponse.status, serverResponse.statusText);
            
            // Probeer nogmaals na 1 seconde
            setTimeout(async () => {
              try {
                const retryResponse = await fetch(`${baseUrl}/api/chests/progress/${walletAddress}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                  },
                  body: JSON.stringify({ progress: currentProgress }),
                });
                
                console.log('Retry update result:', retryResponse.ok ? 'Success' : 'Failed');
              } catch (retryError) {
                console.error('Retry update error:', retryError);
              }
            }, 1000);
          }
        } catch (serverError) {
          console.error('Server update error:', serverError);
        }
      })();
    } catch (error) {
      console.error('Error preparing server update:', error);
    }
    
    // Update de lokale state
    setProgress(currentProgress);
  };

  const canClaimFreeChest = (type: ChestType): boolean => {
    if (!walletAddress) return false;
    
    const opened = progress[`${type}Opened` as keyof ChestProgress];
    const nextReward = progress[`next${type.charAt(0).toUpperCase() + type.slice(1)}Reward` as keyof ChestProgress];
    return opened >= nextReward;
  };

  const claimFreeChest = (type: ChestType) => {
    if (!walletAddress || !canClaimFreeChest(type)) return;

    console.log(`Claiming free chest of type: ${type}`);
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [`next${type.charAt(0).toUpperCase() + type.slice(1)}Reward` as keyof ChestProgress]: 
          prev[`next${type.charAt(0).toUpperCase() + type.slice(1)}Reward` as keyof ChestProgress] + 50
      };
      
      // Meteen save progress naar server buiten de state update
      setTimeout(() => {
        console.log(`Immediate save after claiming ${type} chest`);
        saveProgressToServer(walletAddress, newProgress)
          .catch(error => {
            console.error(`Failed to save claimed ${type} chest progress:`, error);
          });
      }, 0);
      
      return newProgress;
    });
  };

  return (
    <ChestProgressContext.Provider 
      value={{ 
        progress, 
        addOpenedChest,
        canClaimFreeChest,
        claimFreeChest
      }}
    >
      {children}
    </ChestProgressContext.Provider>
  );
};

export const useChestProgress = () => {
  const context = useContext(ChestProgressContext);
  if (!context) {
    throw new Error('useChestProgress must be used within a ChestProgressProvider');
  }
  return context;
}; 