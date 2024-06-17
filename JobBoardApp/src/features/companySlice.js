import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchAllCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  uploadLogo,
} from '../services/CompanyService';

// Thunks for async operations
export const fetchCompanies = createAsyncThunk('companies/fetchAll', async () => {
  const res = await fetchAllCompanies();
  return res.data;
});

export const fetchCompany = createAsyncThunk('companies/fetchById', async (id) => {
  const res = await fetchCompanyById(id);
  return res.data;
});

export const addCompany = createAsyncThunk('companies/add', async (companyDTO, { rejectWithValue }) => {
  try {
    const res = await createCompany(companyDTO);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const editCompany = createAsyncThunk('companies/edit', async ({ id, companyDTO }, { rejectWithValue }) => {
  try {
    const res = await updateCompany(id, companyDTO);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeCompany = createAsyncThunk('companies/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteCompany(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const uploadCompanyLogo = createAsyncThunk('companies/uploadLogo', async ({ id, file }, { rejectWithValue }) => {
  try {
    const res = await uploadLogo(id, file);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    company: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies.push(action.payload);
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(editCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editCompany.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedCompany = action.payload;
        state.companies = state.companies.map((company) =>
          company.id === updatedCompany.id ? updatedCompany : company
        );
      })
      .addCase(editCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeCompany.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        state.companies = state.companies.filter((company) => company.id !== id);
      })
      .addCase(removeCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadCompanyLogo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // handle logo upload success if necessary
      })
      .addCase(uploadCompanyLogo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default companySlice.reducer;