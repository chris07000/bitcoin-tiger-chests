'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import React from 'react'

// Admin API key - normaal gesproken zou je dit uit een .env of beveiligde storage halen
const ADMIN_API_KEY = 'Bitcoin-Tiger-Admin-Secret-Key'

export default function AdminRafflePage() {
  const router = useRouter()
  
  // Stel een standaard einddatum in voor over 7 dagen
  const defaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 dagen vanaf nu
    
    // Format voor date input (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const defaultEndTime = () => {
    const date = new Date();
    // Format voor time input (HH:MM)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '/tiger-logo.png',
    ticketPrice: '',
    totalTickets: '',
    endDate: defaultEndDate(),
    endTime: defaultEndTime()
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [imagePreview, setImagePreview] = useState('/tiger-logo.png')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Toon lokale preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    // Upload de afbeelding
    setIsUploading(true)
    setUploadError('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_API_KEY}`
        },
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Update het formulier met het pad naar de afbeelding
        setFormData(prev => ({ ...prev, image: data.filePath }))
        console.log('Image uploaded successfully:', data.filePath)
      } else {
        setUploadError(data.error || 'Failed to upload image')
        console.error('Error uploading image:', data.error)
      }
    } catch (error) {
      setUploadError('Failed to upload image')
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleImageURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, image: value }))
    setImagePreview(value)
  }
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: '', type: '' })

    try {
      // Combineer datum en tijd tot een volledige ISO string
      const endsAt = new Date(`${formData.endDate}T${formData.endTime}:00`);
      
      // Check of de datum geldig is
      if (isNaN(endsAt.getTime())) {
        setMessage({ 
          text: 'Please enter a valid date and time', 
          type: 'error' 
        });
        setIsLoading(false);
        return;
      }
      
      // Check of de datum in de toekomst ligt
      if (endsAt <= new Date()) {
        setMessage({ 
          text: 'End date must be in the future', 
          type: 'error' 
        });
        setIsLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        ticketPrice: formData.ticketPrice,
        totalTickets: formData.totalTickets,
        endsAt: endsAt.toISOString()
      };
      
      const response = await fetch('/api/admin/raffle/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_API_KEY}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          text: 'Raffle created successfully!', 
          type: 'success' 
        })
        // Reset form
        setFormData({
          name: '',
          description: '',
          image: '/tiger-logo.png',
          ticketPrice: '',
          totalTickets: '',
          endDate: defaultEndDate(),
          endTime: defaultEndTime()
        })
        // Redirect naar de raffle pagina na 2 seconden
        setTimeout(() => {
          router.push('/raffle')
        }, 2000)
      } else {
        setMessage({ 
          text: `Error: ${data.error || 'Failed to create raffle'}`, 
          type: 'error' 
        })
      }
    } catch (error) {
      setMessage({ 
        text: 'An error occurred while creating the raffle', 
        type: 'error' 
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5rem 2rem;
          min-height: 100vh;
          background: #0d1320;
          color: #fff;
        }
        
        .title {
          font-size: 2rem;
          font-family: 'Press Start 2P', monospace;
          color: #ffd700;
          margin-bottom: 2rem;
          text-align: center;
          text-shadow: 2px 2px #000;
        }
        
        .form-container {
          width: 100%;
          max-width: 800px;
          background: rgba(0, 0, 0, 0.3);
          padding: 2rem;
          border-radius: 8px;
          border: 2px solid rgba(255, 215, 0, 0.3);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          color: #ffd700;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.8rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 215, 0, 0.5);
          border-radius: 4px;
          color: #fff;
          font-size: 1rem;
        }
        
        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #ffd700;
        }
        
        .image-preview {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
        }
        
        .preview-container {
          width: 200px;
          height: 200px;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .submit-button {
          background: #ffd700;
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-family: 'Press Start 2P', monospace;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1rem;
          display: inline-block;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #ffe970;
        }
        
        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .message {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 4px;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
        }
        
        .message.success {
          background: rgba(74, 252, 74, 0.1);
          color: #4afc4a;
          border: 1px solid #4afc4a;
        }
        
        .message.error {
          background: rgba(255, 0, 0, 0.1);
          color: #ff5555;
          border: 1px solid #ff5555;
        }
        
        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .two-columns {
            grid-template-columns: 1fr;
          }
        }
        
        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .preview-container {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          overflow: hidden;
          width: 100%;
          height: 200px;
          position: relative;
          cursor: pointer;
          border: 2px dashed rgba(255, 215, 0, 0.3);
        }
        
        .preview-container:hover {
          border-color: #ffd700;
        }
        
        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        
        .upload-spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #ffd700;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .upload-text {
          font-size: 0.9rem;
          font-family: 'Press Start 2P', monospace;
        }
        
        .upload-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .upload-btn {
          background: #ffd700;
          color: #000;
          border: none;
          border-radius: 4px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          font-family: 'Press Start 2P', monospace;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .upload-btn:hover:not(:disabled) {
          background: #ffe970;
          transform: translateY(-2px);
        }
        
        .upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .or-text {
          margin: 0.5rem 0;
          color: #aaa;
          font-size: 0.8rem;
        }
        
        .upload-error {
          color: #ff5555;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
      `}</style>

      <div className="container">
        <h1 className="title">Create New Raffle</h1>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          maxWidth: '800px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href="/admin/raffle/manage" 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem 1rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              Manage Raffles
            </a>
            
            <a 
              href="/admin/logout" 
              style={{
                background: 'rgba(255, 0, 0, 0.2)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem 1rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              Logout
            </a>
          </div>
        </div>
        
        <div className="form-container">
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Raffle Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Bitcoin Tiger #123"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the raffle prize"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="image">
                Raffle Image
              </label>
              
              <div className="image-upload-container">
                <div className="preview-container" onClick={triggerFileInput}>
                  <Image
                    src={imagePreview || '/tiger-logo.png'}
                    alt="Raffle Image Preview"
                    width={200}
                    height={200}
                    className="preview-image"
                    style={{ 
                      cursor: 'pointer',
                      objectFit: 'contain',
                      maxHeight: '200px',
                      maxWidth: '100%',
                      borderRadius: '8px'
                    }}
                  />
                  
                  {isUploading && (
                    <div className="upload-overlay">
                      <div className="upload-spinner"></div>
                      <div className="upload-text">Uploading...</div>
                    </div>
                  )}
                </div>
                
                <div className="upload-options">
                  <div className="upload-btn-wrapper">
                    <button 
                      type="button"
                      className="upload-btn"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  <div className="url-input-wrapper">
                    <p className="or-text">or paste image URL:</p>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      className="form-input"
                      value={formData.image}
                      onChange={handleImageURLChange}
                      placeholder="e.g. /tiger-logo.png or https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                {uploadError && (
                  <div className="upload-error">
                    {uploadError}
                  </div>
                )}
              </div>
            </div>
            
            <div className="two-columns">
              <div className="form-group">
                <label className="form-label" htmlFor="ticketPrice">
                  Ticket Price (sats)
                </label>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  className="form-input"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 5000"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="totalTickets">
                  Total Tickets
                </label>
                <input
                  type="number"
                  id="totalTickets"
                  name="totalTickets"
                  className="form-input"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 100"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-input"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]} // Voorkom datums in het verleden
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="endTime">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
              <p style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.8rem', 
                color: '#aaa' 
              }}>
                Select the date and time when the raffle should end
              </p>
            </div>
            
            <div className="button-container">
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Raffle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
} 