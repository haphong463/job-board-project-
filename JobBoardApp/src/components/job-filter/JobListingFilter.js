// import { Autocomplete, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchCategoryThunk } from "../../features/categorySlice";
// import { fetchJobThunk } from "../../features/jobSlice";
// import { fetchCompanyThunk } from "../../features/companySlice";
// import JobMappingFilter from "../../page/job-listing/location_mapping";
// import { useDispatch, useSelector } from "react-redux";

// const [filters, setFilters] = useState({
//     title: '',
//     // offeredSalary: '',
//     location: [],
//     position: [],
//     jobType: [],
//     contractType: [],
//     companyType: [],
//     categoryNames: []
// });

// const normalizeLocation = (locationString) =>
// {
//     return locationString.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
// };



// const JobListingFilter = () =>
// {
//     const { locationMapping, position, jobTypes, contractTypes, companyTypes } = JobMappingFilter;

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const normalizeString = (str) => str.trim().toLowerCase();
//     const [open, setOpen] = useState(false);
//     const [searchTerms, setSearchTerms] = useState('');
//     const categories = useSelector((state) => state.category.categories);
//     const jobs = useSelector((state) => state.job.jobs);
//     const companies = useSelector((state) => state.company.companies);



//     useEffect(() =>
//     {
//         dispatch(fetchCategoryThunk());
//         dispatch(fetchJobThunk());
//         dispatch(fetchCompanyThunk());
//     }, []);

//     const getLocationString = (companyId) =>
//     {
//         const company = companies.find(comp => comp.companyId === companyId);
//         return company ? company.location : '';
//     };


//     const titleOptions = [...new Set(jobs.map(job => job.title))];
//     const categoryOptions = [...new Set(categories.map(cat => cat.categoryName))];

//     // Kết hợp tất cả các tùy chọn thành một danh sách duy nhất
//     const combinedOptions = useMemo(() =>
//     {
//         return [
//             ...titleOptions.map(title => ({ type: 'title', value: title })),
//             ...categoryOptions.map(category => ({ type: 'category', value: category }))
//         ];
//     }, [titleOptions, categoryOptions]);

//     const filteredOptions = useMemo(() =>
//     {
//         const searchTermNormalized = normalizeString(searchTerms);

//         // Kiểm tra xem tìm kiếm có phải là từ khóa category không
//         const isCategorySearch = combinedOptions.some(option =>
//             option.type === 'category' && normalizeString(option.value).includes(searchTermNormalized)
//         );
//         return combinedOptions.filter(option =>
//             normalizeString(option.value).includes(searchTermNormalized)
//         );
//     }, [searchTerms, combinedOptions]);

//     const handleKeyDown = (event) =>
//     {
//         if (event.key === 'Enter')
//         {
//             event.preventDefault(); // Ngăn chặn hành vi mặc định của Enter
//             handleSearch(); // Thực hiện tìm kiếm
//             setOpen(false); // Đóng dropdown sau khi nhấn Enter
//         }
//     };

//     const handleSearch = () =>
//     {
//         navigate(`/viewAllJobs/${encodeURIComponent(searchTerms.trim())}`);
//     };

//     const handlePositionItemClick = (event) =>
//     {
//         const {
//             target: { value },
//         } = event;
//         setFilters({
//             ...filters,
//             position: position.filter((level) => value.includes(level.value)),
//         });
//     };

//     const handleJobTypeItemClick = (level) =>
//     {
//         const newSelection = filters.jobType.some((item) => item.value === level.value)
//             ? filters.jobType.filter((item) => item.value !== level.value)
//             : [...filters.jobType, level];
//         setFilters({ ...filters, jobType: newSelection });
//     };

//     const handleContractTypeItemClick = (level) =>
//     {
//         const newSelection = filters.contractType.some((item) => item.value === level.value)
//             ? filters.contractType.filter((item) => item.value !== level.value)
//             : [...filters.contractType, level];
//         setFilters({ ...filters, contractType: newSelection });
//     };

//     const handleCompanyTypeItemClick = (type) =>
//     {
//         const newSelection = filters.companyType.some((item) => item.value === type.value)
//             ? filters.companyType.filter((item) => item.value !== type.value)
//             : [...filters.companyType, type];
//         setFilters({ ...filters, companyType: newSelection });
//     };

//     const handleLocationItemClick = (event, location) =>
//     {
//         const newSelection = filters.location.some((item) => item.value === location.value)
//             ? filters.location.filter((item) => item.value !== location.value)
//             : [...filters.location, location];

//         setFilters({ ...filters, location: newSelection });
//     };

//     return (
//         <div className="border p-3" style={{ borderColor: '#cccccc', fontSize: '14px' }}>
//             <div className="mb-3">
//                 <label>Search</label>
//                 <Autocomplete
//                     freeSolo
//                     open={open}
//                     // onOpen={() => setOpen(true)}
//                     onClose={() => setOpen(false)}
//                     onInputChange={(event, newInputValue) => setSearchTerms(newInputValue)}
//                     inputValue={searchTerms}
//                     options={filteredOptions}
//                     getOptionLabel={(option) => option.value}
//                     filterOptions={(options) => options}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             label="Search"
//                             onKeyDown={handleKeyDown}
//                         />
//                     )}
//                 />

//             </div>
//             <br></br>

//             <div className="mb-3">
//                 <label>Location</label>
//                 <FormGroup>
//                     {locationMapping.locations.map((location) => (
//                         <FormControlLabel
//                             key={location.value}
//                             control={
//                                 <Checkbox
//                                     checked={filters.location.some(item => item.value === location.value)}
//                                     // onChange={() => handleLocationItemClick(location)}
//                                     onChange={(e) => handleLocationItemClick(e, location)}
//                                     name={location.label}
//                                 />
//                             }
//                             label={location.label}
//                         />
//                     ))}
//                 </FormGroup>
//             </div>

//             <div className="mb-3">
//                 <FormControl fullWidth variant="outlined">
//                     <InputLabel>Levels</InputLabel>
//                     <Select
//                         multiple
//                         value={filters.position.map((item) => item.value)}
//                         onChange={handlePositionItemClick}
//                         input={<OutlinedInput label="Levels" />}
//                         renderValue={(selected) => (
//                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                                 {selected.map((value) =>
//                                 {
//                                     const level = position.find((l) => l.value === value);
//                                     return level ? (
//                                         <Chip key={value} label={level.label} />
//                                     ) : null;
//                                 })}
//                             </div>
//                         )}
//                         MenuProps={{
//                             PaperProps: {
//                                 style: {
//                                     maxHeight: 200, // Set a max height for the dropdown menu
//                                     overflow: 'auto', // Enable scrolling
//                                 },
//                             },
//                         }}
//                     >
//                         {position.map((level) => (
//                             <MenuItem key={level.value} value={level.value}>
//                                 <Checkbox checked={filters.position.some((item) => item.value === level.value)} />
//                                 <ListItemText primary={level.label} />
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//             </div>

//             <div className="mb-3">
//                 <label>Job types</label>
//                 <FormGroup>
//                     {jobTypes.map(jobType => (
//                         <FormControlLabel
//                             key={jobType.value}
//                             control={
//                                 <Checkbox
//                                     checked={filters.jobType.some(item => item.value === jobType.value)}
//                                     onChange={() => handleJobTypeItemClick(jobType)}
//                                     name={jobType.label}
//                                 />
//                             }
//                             label={jobType.label}
//                         />
//                     ))}
//                 </FormGroup>
//             </div>

//             <div className="mb-3">
//                 <label>Contract types</label>
//                 <FormGroup>
//                     {contractTypes.map(contract => (
//                         <FormControlLabel
//                             key={contract.value}
//                             control={
//                                 <Checkbox
//                                     checked={filters.contract?.some(item => item.value === contract.value)}
//                                     onChange={() => handleContractTypeItemClick(contract)}
//                                     name={contract.label}
//                                 />
//                             }
//                             label={contract.label}
//                         />
//                     ))}
//                 </FormGroup>
//             </div>

//             <div className="mb-3">
//                 <label>company types</label>
//                 <FormGroup>
//                     {companyTypes.map(company => (
//                         <FormControlLabel
//                             key={company.value}
//                             control={
//                                 <Checkbox
//                                     checked={filters.company?.some(item => item.value === company.value)}
//                                     onChange={() => handleCompanyTypeItemClick(company)}
//                                     name={company.label}
//                                 />
//                             }
//                             label={company.label}
//                         />
//                     ))}
//                 </FormGroup>
//             </div>
//         </div>
//     )


// }

// const applyFilters = useCallback((job) =>
// {
//     const { title, offeredSalary, position, location, categoryNames, jobType, contractType, companyType } = filters;

//     // const normalizedTitle = normalizeString(title);
//     // const titleMatch = normalizedTitle ? normalizeString(job.title).includes(normalizedTitle) : true;

//     const normalizedTitle = normalizeString(title);
//     const normalizedJobTitle = normalizeString(job.title);
//     const titleMatch = normalizedTitle ? normalizedJobTitle.includes(normalizedTitle) : true;

//     const jobCategoryNames = job.categoryId.map(id =>
//     {
//         const category = categories.find(cat => cat.categoryId === id);
//         return category ? category.categoryName.toLowerCase() : '';
//     });

//     const categoryMatch = categoryNames.length === 0 || categoryNames.some(catName =>
//         jobCategoryNames.includes(normalizeString(catName))
//     );

//     const locationMatch = location.length === 0 || location.some(loc =>
//     {
//         const locationString = normalizeLocation(getLocationString(job.companyId));
//         console.log('Location String:', locationString); // Kiểm tra giá trị
//         return Object.keys(JobMappingFilter.locationMapping).some(key =>
//         {
//             const normalizedKey = normalizeLocation(key);
//             return locationString.includes(normalizedKey) && JobMappingFilter.locationMapping[normalizedKey] === loc.value;
//         });
//     });

//     const positionMatch = position.length === 0 || position.some(pos => job.position?.toLowerCase().includes(pos.value.toLowerCase()));
//     const jobTypeMatch = jobType.length === 0 || jobType.some(tyle => job.jobType?.toLowerCase().includes(tyle.value.toLowerCase()));
//     const contractTypeMatch = contractType.length === 0 || contractType.some(tyle => job.contractType?.toLowerCase().includes(tyle.value.toLowerCase()));
//     const company = companies.find(company => company.companyId === job.companyId);
//     const companyTypeMatch = companyType.length === 0 || companyType.some(type => company.type?.toLowerCase() === type.value.toLowerCase());

//     return titleMatch && categoryMatch && locationMatch && positionMatch && jobTypeMatch && contractTypeMatch && companyTypeMatch;
// }, [filters, categories, companies, locationMapping]);





// export { JobListingFilter, applyFilters };

