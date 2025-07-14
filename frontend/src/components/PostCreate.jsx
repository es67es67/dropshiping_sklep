import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

const PostCreate = () => {
  const { user, token } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + images.length > 5) {
      alert('Możesz dodać maksymalnie 5 zdjęć!');
      return;
    }

    // Dodaj nowe pliki do listy
    const newImages = [...images, ...imageFiles];
    setImages(newImages);

    // Utwórz podglądy
    const newPreviews = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Treść postu jest wymagana!');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('isPublic', isPublic);
      
      if (tags.trim()) {
        formData.append('tags', tags);
      }

      // Dodaj zdjęcia
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        alert('Post został opublikowany!');
        
        // Resetuj formularz
        setContent('');
        setImages([]);
        setTags('');
        setIsPublic(true);
        setPreviewImages([]);
        
        // Przekieruj do listy postów
        window.location.href = '/posts';
      } else {
        const error = await response.json();
        alert(`Błąd: ${error.error || 'Nie udało się opublikować postu'}`);
      }
    } catch (error) {
      console.error('Błąd publikowania postu:', error);
      alert('Wystąpił błąd podczas publikowania postu');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      if (imageFiles.length + images.length > 5) {
        alert('Możesz dodać maksymalnie 5 zdjęć!');
        return;
      }

      const newImages = [...images, ...imageFiles];
      setImages(newImages);

      const newPreviews = imageFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  return (
    <div className="post-create-container">
      <h2>Utwórz nowy post</h2>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Treść postu:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Co chcesz udostępnić?"
            rows={6}
            maxLength={1000}
            required
          />
          <small>{content.length}/1000 znaków</small>
        </div>

        <div className="form-group">
          <label>Zdjęcia (maksymalnie 5):</label>
          <div 
            className="image-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <div className="upload-placeholder">
              <i className="upload-icon">📷</i>
              <p>Kliknij lub przeciągnij zdjęcia tutaj</p>
              <small>Maksymalnie 5 zdjęć</small>
            </div>
          </div>
        </div>

        {previewImages.length > 0 && (
          <div className="image-previews">
            <h4>Podgląd zdjęć:</h4>
            <div className="preview-grid">
              {previewImages.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview.preview} alt={`Podgląd ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Tagi (oddzielone przecinkami):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="np. podróże, jedzenie, technologia"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Post publiczny (widoczny dla wszystkich)
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Publikowanie...' : 'Opublikuj post'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .post-create-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .post-form {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group textarea,
        .form-group input[type="text"] {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          resize: vertical;
        }

        .form-group small {
          color: #666;
          font-size: 12px;
        }

        .image-upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.3s;
        }

        .image-upload-area:hover {
          border-color: #007bff;
        }

        .upload-placeholder {
          color: #666;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 10px;
          display: block;
        }

        .image-previews {
          margin-top: 20px;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin-right: 10px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }
      `}</style>
    </div>
  );
};

export default PostCreate; 