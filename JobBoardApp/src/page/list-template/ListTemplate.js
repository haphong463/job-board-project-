import React, { useEffect, useState } from 'react';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/list-template.css'; // Import CSS file for custom styles
import DialogBox from '../../components/dialog-box/Dialogbox';
// import '@fontawesome/fontawesome-free/css/all.min.css';
 
const ListTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false); // New state for showing/hiding filters
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false); // Add a state for the dialog box

  const fetchTemplates = async () => {
    try {
      const response = await axiosRequest.get('/templates/list-template');
      setTemplates(response);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);
  const sortTemplates = (order) => {
    const sortedTemplates = [...templates].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (order === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setTemplates(sortedTemplates);
    setSortOrder(order);
  };
  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // You can implement the search logic here
  };
  const handleDialogClose = () => {
    setShowDialog(false); // Close the dialog box
  };
  
  const handleTemplateClick = async (templateId, templateName) => {
    if (!user) {
      setShowDialog(true); // Show the dialog box if the user is not logged in
      return;
    }
    try {
      await axiosRequest.put('/templates/select-template', null, {
        params: {
          userId: user.id,
          templateId: templateId,
        }
      });
  
      alert('Template selected successfully');
      navigate(`/review-template/${templateName}`); // Navigate to review-template with templateName
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  };
  
  const filteredTemplates = templates.filter((template) =>
    template.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <GlobalLayoutUser>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: 'url("../../../assets/images/hero_1.jpg")' }}
        id="createCv-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">List Template</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>List Template</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5 bg-image overlay-primary fixed overlay"
        style={{
          backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="text-white">You are struggling with prepare a CV?</h2>
              <p className="mb-0 text-white lead">
                Scroll down and fill up the form below to create your CV.
              </p>
            </div>
            <div className="col-md-3 ml-auto">
              <a href="#" className="btn btn-warning btn-block btn-lg">
                Or sign up for free
              </a>
            </div>
          </div>
        </div>
      </section>


      <section className="template-section">
        <div className="container">
          <div className="row border-css">

            <div className="col-md-12 mb-4">
              <h3 className="text-css">Choose your template</h3>
              <div className="filter-toggle" onClick={handleFilterToggle}>
                <i className="fas fa-filter"></i> Filters
              </div>
              {showFilters && (
                <div className="filter-dropdown">
                  <div className="sort-buttons">
                    <button
                      className={`btn btn-primary ${sortOrder === 'asc' ? 'active' : ''}`}
                      onClick={() => sortTemplates('asc')}
                    >
                      Oldest First
                    </button>
                    <button
                      className={`btn btn-primary ${sortOrder === 'desc' ? 'active' : ''}`}
                      onClick={() => sortTemplates('desc')}
                    >
                      Latest First
                    </button>
                  </div>
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              )}
            </div>
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <div key={template.templateId} className="col-md-4 mb-4">
                  <div className="template-card" onClick={() => handleTemplateClick(template.templateId, template.templateName)}>
                    {template.templateImageBase64 ? (
                      <>
                        <img
                          width={200}
                          height={200}
                          className="template-image"
                          src={`data:image/${template.fileExtension};base64,${template.templateImageBase64}`}
                          alt={template.templateName}
                        />
                        <div className="template-details">
                          <span className="template-title">{template.templateName}</span>
                          <span className="template-date">
                            Created: {new Date(template.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="placeholder-image">No Image Available</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">No templates found</div>
            )}
          </div>
        </div>
        
      </section>
      <DialogBox isOpen={showDialog} onClose={handleDialogClose} />
    </GlobalLayoutUser>
  );
};

export default ListTemplate;

