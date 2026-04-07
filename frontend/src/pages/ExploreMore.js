import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const ExploreMore = () => {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    subject: 'all',
    search: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    subjects: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchPdfs();
    fetchFilterOptions();
  }, [navigate]);

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/pdfs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPdfs(response.data);
      setFilteredPdfs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/pdfs/filters/options`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...pdfs];

    // Category filter
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(pdf => pdf.category === currentFilters.category);
    }

    // Subject filter
    if (currentFilters.subject !== 'all') {
      filtered = filtered.filter(pdf => 
        pdf.subject.toLowerCase().includes(currentFilters.subject.toLowerCase())
      );
    }

    // Search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm) ||
        pdf.description.toLowerCase().includes(searchTerm) ||
        pdf.subject.toLowerCase().includes(searchTerm) ||
        pdf.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredPdfs(filtered);
  };

  const handleViewPdf = async (pdfId, pdfUrl, title) => {
    try {
      const token = localStorage.getItem('token');
      // Track view
      await axios.get(`${API_BASE_URL}/pdfs/${pdfId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Open PDF in new tab for viewing
      const fullPdfUrl = pdfUrl.startsWith('http') ? pdfUrl : `${API_BASE_URL}${pdfUrl}`;
      window.open(fullPdfUrl, '_blank');
    } catch (error) {
      console.error('Error viewing PDF:', error);
      alert('Error accessing PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner"></div>
        <p>Loading PDFs...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          📄 Explore More Resources
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Discover and view educational PDFs, study materials, and reference documents
        </p>
      </div>

      {/* Filters */}
      <div className="card fade-in-up" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search PDFs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Subjects</option>
              {filterOptions.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>
            Showing {filteredPdfs.length} of {pdfs.length} PDFs
          </p>
          <button
            onClick={() => {
              setFilters({ category: 'all', subject: 'all', search: '' });
              setFilteredPdfs(pdfs);
            }}
            className="btn btn-outline"
            style={{ fontSize: '0.9rem' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* PDF Grid */}
      {filteredPdfs.length === 0 ? (
        <div className="card fade-in-up" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>No PDFs found</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {filters.search || filters.category !== 'all' || filters.subject !== 'all'
              ? 'Try adjusting your filters to find more resources.'
              : 'No PDFs have been uploaded yet. Check back later!'}
          </p>
          {(filters.search || filters.category !== 'all' || filters.subject !== 'all') && (
            <button
              onClick={() => {
                setFilters({ category: 'all', subject: 'all', search: '' });
                setFilteredPdfs(pdfs);
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="course-grid fade-in-up">
          {filteredPdfs.map((pdf) => (
            <div key={pdf._id} className="course-card">
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {pdf.category}
              </div>

              <div style={{
                width: '100%',
                height: '200px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '12px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                📄
              </div>

              <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                {pdf.title}
              </h3>

              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {pdf.description.length > 100 
                  ? pdf.description.substring(0, 100) + '...'
                  : pdf.description}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>Subject:</strong> {pdf.subject}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>Pages:</strong> {pdf.pages || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>Size:</strong> {pdf.fileSize}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>Views:</strong> {pdf.viewCount || pdf.downloadCount || 0}
                  </span>
                </div>
              </div>

              {pdf.tags && pdf.tags.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  {pdf.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-block',
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        marginRight: '0.5rem',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => handleViewPdf(pdf._id, pdf.pdfUrl, pdf.title)}
              >
                👁️ View PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreMore;
