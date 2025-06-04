'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Fixed list of Bitcoin Tigers series
const TIGER_SERIES = [
  {
    id: 'series1',
    name: 'Bitcoin Tigers Series 1',
    baseId: 'df507f90784f3cbeb695598199cf7a24d293b4bdd46d342809cc83781427adeei',
    count: 293,
    startNumber: 1 // Images start at 1.png
  },
  {
    id: 'series2',
    name: 'Bitcoin Tigers Series 2',
    baseId: '34e91e21b54873b251447a8500934c02718945014f64bcdb6eb01c8a28716bb7i',
    count: 294,
    startNumber: 294 // Series 2 starts at 294.png (293 + 1)
  },
  {
    id: 'series3',
    name: 'Bitcoin Tigers Series 3',
    baseId: '002daf5cf64dd62c65e8cee7c7738a921cd334b2619845cedaadd357187a45fdi',
    count: 294,
    startNumber: 588 // Series 3 starts at 588.png (293 + 294 + 1)
  },
  {
    id: 'series4',
    name: 'Bitcoin Tigers Series 4',
    baseId: 'c0fecdeed61f30653190550bb6d4a9b5172443f8a6a0c57630d08fbbba65b5e5i',
    count: 118,
    startNumber: 882 // Series 4 starts at 882.png (293 + 294 + 294 + 1)
  }
];

export default function TigersPage() {
  const [selectedSeries, setSelectedSeries] = useState('series1');
  const [currentPage, setCurrentPage] = useState(0);
  
  // Find the selected series
  const currentSeries = TIGER_SERIES.find(s => s.id === selectedSeries) || TIGER_SERIES[0];
  
  // Constant for items per page
  const ITEMS_PER_PAGE = 20;
  
  // Calculate the number of pages
  const totalPages = Math.ceil(currentSeries.count / ITEMS_PER_PAGE);
  
  // Calculate start and end indexes for current page
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, currentSeries.count - 1);
  
  // Generate tigers for the current page
  const currentTigers = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const inscriptionId = `${currentSeries.baseId}${i}`;
    const tigerNumber = i + 1;
    const imageNumber = currentSeries.startNumber + i; // Determine the correct image number
    
    currentTigers.push({
      id: inscriptionId,
      name: `#${tigerNumber}`,
      seriesName: currentSeries.name,
      imageUrl: `/${imageNumber}.png`, // Use the actual image from the public folder
      ordinalLink: `https://ordinals.com/inscription/${inscriptionId}`
    });
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#ffd700', marginBottom: '20px' }}>
        Bitcoin Tigers Collection
      </h1>
      
      {/* Series tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        {TIGER_SERIES.map(series => (
          <button 
            key={series.id}
            onClick={() => {
              setSelectedSeries(series.id);
              setCurrentPage(0); // Reset to first page when changing series
            }}
            style={{
              padding: '8px 16px',
              margin: '4px',
              background: selectedSeries === series.id ? '#ffd700' : '#333',
              color: selectedSeries === series.id ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {series.name}
          </button>
        ))}
      </div>
      
      {/* Page navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            background: '#333',
            color: currentPage === 0 ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 0 ? 'default' : 'pointer'
          }}
        >
          ← Previous
        </button>
        
        <div style={{ padding: '8px 16px', color: '#ccc' }}>
          Page {currentPage + 1} of {totalPages}
        </div>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
          style={{
            padding: '8px 16px',
            margin: '0 4px',
            background: '#333',
            color: currentPage === totalPages - 1 ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages - 1 ? 'default' : 'pointer'
          }}
        >
          Next →
        </button>
      </div>
      
      {/* Tigers grid with actual images */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {currentTigers.map((tiger, index) => (
          <div key={tiger.id} style={{ 
            background: '#1a1a2e',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #333',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            position: 'relative'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Series badge in top-right corner */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(26, 26, 46, 0.85)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              color: '#ffd700',
              zIndex: 10,
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(2px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {tiger.seriesName.replace('Bitcoin Tigers ', '')}
            </div>
            
            <div style={{ width: '100%', position: 'relative', aspectRatio: '1/1' }}>
              <Image 
                src={tiger.imageUrl}
                alt={`${tiger.seriesName} ${tiger.name}`}
                fill
                style={{ objectFit: 'cover' }}
                priority={index < 4} // Priority loading for the first 4 images
              />
            </div>
            <div style={{ padding: '15px' }}>
              <div style={{ 
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  margin: '0', 
                  color: '#ffd700', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  {tiger.name}
                </h3>
                <div style={{ 
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  Bitcoin Tiger
                </div>
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                marginTop: '5px'
              }}>
                <a 
                  href={tiger.ordinalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '12px',
                    color: '#ffd700',
                    textDecoration: 'none',
                    display: 'inline-block',
                    padding: '5px 10px',
                    background: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '4px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)'}
                >
                  View on Ordinals Explorer
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination info */}
      <div style={{ marginTop: '30px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        * Viewing all {currentSeries.count} tigers from {currentSeries.name}. Navigate through pages to see more.
      </div>
    </div>
  );
} 