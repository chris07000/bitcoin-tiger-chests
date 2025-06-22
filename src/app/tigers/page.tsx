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
    <>
      <style jsx>{`
        .tigers-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%);
          color: #fff;
          padding: 4rem 1rem 2rem;
        }
        
        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .tigers-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .tigers-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        
        .tigers-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
        }
        
        .series-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .series-tab {
          padding: 0.8rem 1.5rem;
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .series-tab:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 107, 0, 0.6);
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);
        }
        
        .series-tab.active {
          background: linear-gradient(135deg, #FF6B00 0%, #FFB800 100%);
          border-color: #FF6B00;
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        
        .pagination-button {
          padding: 0.8rem 1.2rem;
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .pagination-button:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: rgba(255, 107, 0, 0.6);
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);
        }
        
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .pagination-info {
          padding: 0.8rem 1.2rem;
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 107, 0, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .tigers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .tiger-card {
          background: rgba(26, 26, 27, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        
        .tiger-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 107, 0, 0.6);
          box-shadow: 0 12px 40px rgba(255, 107, 0, 0.2);
        }
        
        .series-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(26, 26, 27, 0.9);
          backdrop-filter: blur(10px);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #FF6B00;
          z-index: 10;
          border: 1px solid rgba(255, 107, 0, 0.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .tiger-image-container {
          width: 100%;
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
        }
        
        .tiger-content {
          padding: 1.5rem;
        }
        
        .tiger-info {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .tiger-name {
          margin: 0;
          color: #FF6B00;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .tiger-type {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .tiger-link {
          display: inline-block;
          font-size: 0.8rem;
          color: #FF6B00;
          text-decoration: none;
          padding: 0.5rem 1rem;
          background: rgba(255, 107, 0, 0.1);
          border: 1px solid rgba(255, 107, 0, 0.3);
          border-radius: 6px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .tiger-link:hover {
          background: rgba(255, 107, 0, 0.2);
          border-color: rgba(255, 107, 0, 0.5);
          transform: translateY(-1px);
        }
        
        .pagination-footer {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          .tigers-container {
            padding: 3rem 0.5rem 1.5rem;
          }
          
          .tigers-title {
            font-size: 2rem;
          }
          
          .tigers-subtitle {
            font-size: 1rem;
          }
          
          .series-tabs {
            gap: 0.25rem;
          }
          
          .series-tab {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
          
          .tigers-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }
          
          .pagination {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .pagination-button,
          .pagination-info {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
        }
        
        @media (max-width: 480px) {
          .tigers-title {
            font-size: 1.6rem;
          }
          
          .tigers-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
          
          .tiger-content {
            padding: 1rem;
          }
          
          .tiger-name {
            font-size: 1rem;
          }
        }
      `}</style>
      
      <div className="tigers-container">
        <div className="content-wrapper">
          <div className="tigers-header">
            <h1 className="tigers-title">Bitcoin Tigers Collection</h1>
            <p className="tigers-subtitle">
              Explore our complete collection of Bitcoin Tigers across all series
            </p>
          </div>
          
          {/* Series tabs */}
          <div className="series-tabs">
            {TIGER_SERIES.map(series => (
              <button 
                key={series.id}
                onClick={() => {
                  setSelectedSeries(series.id);
                  setCurrentPage(0);
                }}
                className={`series-tab ${selectedSeries === series.id ? 'active' : ''}`}
              >
                {series.name}
              </button>
            ))}
          </div>
          
          {/* Page navigation */}
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="pagination-button"
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {currentPage + 1} of {totalPages}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="pagination-button"
            >
              Next →
            </button>
          </div>
          
          {/* Tigers grid */}
          <div className="tigers-grid">
            {currentTigers.map((tiger, index) => (
              <div key={tiger.id} className="tiger-card">
                <div className="series-badge">
                  {tiger.seriesName.replace('Bitcoin Tigers ', '')}
                </div>
                
                <div className="tiger-image-container">
                  <Image 
                    src={tiger.imageUrl}
                    alt={`${tiger.seriesName} ${tiger.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={index < 4}
                  />
                </div>
                
                <div className="tiger-content">
                  <div className="tiger-info">
                    <h3 className="tiger-name">
                      {tiger.name}
                    </h3>
                    <div className="tiger-type">
                      Bitcoin Tiger
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a 
                      href={tiger.ordinalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="tiger-link"
                    >
                      View on Ordinals Explorer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination info */}
          <div className="pagination-footer">
            Viewing all {currentSeries.count} tigers from {currentSeries.name}. Navigate through pages to see more.
          </div>
        </div>
      </div>
    </>
  );
} 