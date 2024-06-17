import axiosRequest from '../configs/axiosConfig';

export const fetchAllCompanies = async () => {
  return await axiosRequest.get('/companies');
};

export const fetchCompanyById = async (id) => {
  return await axiosRequest.get(`/companies/${id}`);
};

export const createCompany = async (companyDTO) => {
  return await axiosRequest.post('/companies/add', companyDTO);
};

export const updateCompany = async (id, companyDTO) => {
  return await axiosRequest.put(`/companies/edit/${id}`, companyDTO);
};

export const deleteCompany = async (id) => {
  return await axiosRequest.delete(`/companies/delete/${id}`);
};

export const uploadLogo = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await axiosRequest.post(`/companies/add/${id}/upload-logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};