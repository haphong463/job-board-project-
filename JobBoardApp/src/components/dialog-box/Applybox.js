import React, { useState } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import './applybox.css';

const ApplyBox = ({ jobId, userId }) => {
  const [name, setName] = useState('');
  const [cv, setCV] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('employeeName', name);
    formData.append('cvFile', cv);
    formData.append('coverLetter', coverLetter);

    try {
        const response = await axiosRequest.post(`/jobs/${jobId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Application submitted successfully:', response);
        // Handle success (e.g., show a success message, clear form, etc.)
      } catch (error) {
        console.error('Error submitting application:', error);
        // Handle error (e.g., show error message to user)
      }
    };

  return (
    <div className="apply-box">
      <h2></h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên *</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="cv">CV ứng tuyển *</label>
          <input 
            type="file" 
            id="cv" 
            onChange={(e) => setCV(e.target.files[0])} 
            required 
          />
          <small>Hỗ trợ định dạng .doc .docx .pdf, không chứa mật khẩu bảo vệ, dung lượng dưới 3MB</small>
        </div>

        <div className="form-group">
          <label htmlFor="coverLetter">Thư xin việc (Không bắt buộc)</label>
          <textarea 
            id="coverLetter" 
            value={coverLetter} 
            onChange={(e) => setCoverLetter(e.target.value)} 
            placeholder="Những kỹ năng, dự án hay thành tựu nào chứng tỏ bạn là một ứng viên tiềm năng cho vị trí ứng tuyển này?"
          />
        </div>

        <button type="submit" className="submit-button">Gửi CV của tôi</button>
      </form>
    </div>
  );
};

export default ApplyBox;
