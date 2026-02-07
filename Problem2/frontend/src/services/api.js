import axios from 'axios';

const API_URL = 'http://localhost:5000/api/candidates';

export const getCandidates = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching candidates", error);
        throw error;
    }
};

export const getCandidateById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching candidate with id ${id}`, error);
        throw error;
    }
};

export const createCandidate = async (candidate) => {
    try {
        const response = await axios.post(API_URL, candidate);
        return response.data;
    } catch (error) {
        console.error("Error creating candidate", error);
        throw error;
    }
};

export const updateCandidate = async (id, candidate) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, candidate);
        return response.data;
    } catch (error) {
        console.error(`Error updating candidate with id ${id}`, error);
        throw error;
    }
};

export const deleteCandidate = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting candidate with id ${id}`, error);
        throw error;
    }
};
