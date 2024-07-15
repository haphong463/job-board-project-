import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById } from "../../features/JobSlice";
import { deleteJob } from "../../services/JobService";
import DataTable from "react-data-table-component";
import {jwtDecode} from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CFormInput
} from '@coreui/react';

const ListJob = () => {
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobs.job);
  const jobStatus = useSelector((state) => state.jobs.status);
  const error = useSelector((state) => state.jobs.error);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false); // Thêm trạng thái refreshFlag

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      dispatch(fetchJobById(userId));
    }
  }, [dispatch, refreshFlag]); // Thêm refreshFlag vào dependency array

  useEffect(() => {
    setFilteredJobs(jobData);
  }, [jobData]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob(id))
        .unwrap()
        .then(() => {
          // Job deleted successfully, set refreshFlag to trigger useEffect
          setRefreshFlag(prevFlag => !prevFlag);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Failed to delete the job:", error);
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/job/edit/${id}`);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredJobs || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jobs");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "jobs.xlsx");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value === "") {
      setFilteredJobs(jobData);
      setSuggestions([]);
    } else {
      const filtered = jobData.filter((job) =>
        job.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJobs(filtered);
      const newSuggestions = jobData
        .filter((job) => job.title.toLowerCase().includes(value.toLowerCase()))
        .map((job) => job.title);
      setSuggestions(newSuggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion);
    const filtered = jobData.filter((job) =>
      job.title.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredJobs(filtered);
    setSuggestions([]);
  };

  const columns = [
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Offered Salary", selector: (row) => row.offeredSalary, sortable: true },
    { name: "City", selector: (row) => row.city, sortable: true },
    { name: "Work Schedule", selector: (row) => row.workSchedule, sortable: true },
    { name: "Position", selector: (row) => row.position, sortable: true },
    { name: "Experience", selector: (row) => row.experience, sortable: true },
    { name: "Expired", selector: (row) => row.expired, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="job-actions">
          <CButton onClick={() => handleEdit(row.id)} color="info">Edit</CButton>
          <CButton onClick={() => handleDelete(row.id)} color="danger">Delete</CButton>
        </div>
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        fontSize: '1rem',
      }
    },
    headCells: {
      style: {
        fontSize: '1rem',
        fontWeight: 'bold',
      },
    },
  };

  if (jobStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (jobStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <CContainer>
      <CRow className="mb-4">
        <CCol lg="6">
          <h4 className="display-4">Job List</h4>
        </CCol>
        <CCol lg="6" className="text-end">
          <div className="search-container">
            <CFormInput
              type="text"
              placeholder="Search jobs"
              value={searchText}
              onChange={handleSearch}
            />
            {suggestions.length > 0 && (
              <div className="auto-complete-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="auto-complete-suggestion"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            <Link to="/job/create">
              <CButton color="primary" className="ms-2">Create Job</CButton>
            </Link>
            <CButton color="success" className="ms-2" onClick={handleExport}>Export to Excel</CButton>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="12">
          <CCard className="data-table">
            <CCardBody>
              <DataTable
                columns={columns}
                data={filteredJobs || []}
                customStyles={customStyles}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ListJob;
