import React, { useState, useEffect } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import './css/user-cv-list.css';
import  DefaultImage  from '../../assets/images/doc-bg.jpeg'
import DetailsCv from './DetailsCv';
import UpdateCv from './UpdateCv';
import DeleteCv from './DeleteCv';

const CvCard = ({ cv, onView, onUpdate, onDelete }) => {
    const [showIcons, setShowIcons] = useState(false);
    return (
      <div
        className="cv-card"
        onMouseEnter={() => setShowIcons(true)}
        onMouseLeave={() => setShowIcons(false)}
      >
        <img 
          src={DefaultImage} 
          alt={cv.cvTitle} 
          className="cv-card-image"
        />
        <div className="cv-card-content">
          <h3 className='cv-card-title'>{cv.cvTitle}</h3>
          <p>Created: {new Date(cv.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(cv.updatedAt).toLocaleDateString()}</p>
        </div>
        {showIcons && (
          <div className="cv-card-actions">
            <button onClick={() => onView(cv)} title="View">
              <i className="cv-icon-1 fas fa-eye"></i>
            </button>
            <button onClick={() => onUpdate(cv)} title="Edit">
              <i className="cv-icon-2 fas fa-edit"></i>
            </button>
            <button onClick={() => onDelete(cv)} title="Delete">
              <i className="cv-icon-3 fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </div>
    );
  };
  

const Dialog = ({ children }) => (
    <div className="dialog-overlay">
        <div className="dialog-content">
            {children}
        </div>
    </div>
);

const CvList = () => {
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector(state => state.auth.user.id);
    const [showUpdateCv, setShowUpdateCv] = useState(false);
    const [showDeleteCv, setShowDeleteCv] = useState(false);
    const [showDetailsCv, setShowDetailsCv] = useState(false);
    const [selectedCv, setSelectedCv] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        const fetchCvs = async () => {
            try {
                const response = await axiosRequest.get(`/usercv/list-cvs/${userId}`);
                setCvs(response);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch CVs');
                setLoading(false);
            }
        };

        fetchCvs();
    }, [userId]);

    const handleView = async (cv) => {
        try {
            const response = await axiosRequest.get(`/usercv/view-cv/${cv.cvId}`);
            setSelectedCv(response);
            setShowDetailsCv(true);
            setShowDialog(true);
        } catch (error) {
            console.error('Error fetching CV details', error);
            setError('Error fetching CV details. Please try again.');
        }
    };

    const handleUpdate = (cv) => {
        setSelectedCv(cv);
        setShowUpdateCv(true);
        setShowDialog(true);
    };

    const handleDelete = (cv) => {
        setSelectedCv(cv);
        setShowDeleteCv(true);
        setShowDialog(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="cv-list">
            {cvs && cvs[0] ? (
                cvs.map((cv) => (
                    <CvCard
                        key={cv.cvId}
                        cv={cv}
                        onView={handleView}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))
            ) : (
                <p>No CVs available</p>
            )}
            {showDialog && (
                <Dialog>
                    {showDetailsCv && <DetailsCv cv={selectedCv} onClose={() => { setShowDetailsCv(false); setShowDialog(false); }} />}
                    {showUpdateCv && <UpdateCv userId={userId} cvId={selectedCv.cvId} onClose={() => { setShowUpdateCv(false); setShowDialog(false); }} />}
                    {showDeleteCv && (
                        <DeleteCv
                            userId={userId}
                            cv={selectedCv}
                            cvId={selectedCv.cvId}
                            onDelete={() => {
                                setShowDeleteCv(false);
                                setShowDialog(false);
                                // Implement refreshCvList function if needed
                            }}
                            onCancel={() => { setShowDeleteCv(false); setShowDialog(false); }}
                        />
                    )}
                </Dialog>
            )}
        </div>
    );
};

export default CvList;
