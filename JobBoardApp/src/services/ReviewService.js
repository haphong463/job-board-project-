import axiosRequest from "../configs/axiosConfig";

// Fetch all reviews for a specific company
export const getAllReviews = async (companyId) =>
{
    const data = await axiosRequest.get(`/companies/${companyId}/reviews`);
    return data;
};

// Add a new review
export const addReview = async (companyId, review) =>
{
    const { data } = await axiosRequest.post(`/companies/${companyId}/reviews`, review);
    return data;
};

// Get a specific review by ID
export const getReview = async (companyId, reviewId) =>
{
    const { data } = await axiosRequest.get(`/companies/${companyId}/reviews/${reviewId}`);
    return data;
};

export const updateReview = async (companyId, reviewId, review) =>
{
    const { data } = await axiosRequest.put(`/companies/${companyId}/reviews/${reviewId}`, review);
    return data;
};

// Check if the user has reviewed a company
export const hasReviewedCompany = async (companyId) =>
{
    const data = await axiosRequest.get(`/companies/${companyId}/reviews/hasReviewed`);
    return data;
};
