import React, { useEffect, useState } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './pdf.css';

const ListPdf = () => {
  const [pdfs, setPdfs] = useState([]);
  const userId = useSelector(state => state.auth.user.id); // Adjust according to your Redux state
  const [error, setError] = useState(null); // Optional: Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axiosRequest.get(`/templates/list-document/${userId}`);
        setPdfs(response); // Assuming response contains data
      } catch (error) {
        console.error('Error fetching PDFs:', error);
        setError('Failed to load PDFs');
      }
    };

    fetchPdfs();
  }, [userId]);

  const handlePdfClick = (id) => {
    navigate(`/pdf-cv/${id}`);
  };

  return (
    <div className="pdf-list-container">
      <h2>Your PDFs</h2>
      {pdfs.length > 0 ? (
        <ul className="pdf-list">
          {pdfs.map(pdf => (
             <li key={pdf.id} className="pdf-item" onClick={() => handlePdfClick(pdf.id)}>
             <i className="fas fa-file-pdf pdf-icon m-2 pdf-icon-css"></i>
             <span className="pdf-name">{pdf.fileName}</span>
           </li>
          ))}
        </ul>
      ) : (
        <p>No PDFs found</p>
      )}
    </div>
  );
};

export default ListPdf;
