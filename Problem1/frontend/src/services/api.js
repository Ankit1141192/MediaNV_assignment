import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

export const createDatabase = async (dbName) => {
  return await axios.post(`${API_URL}/create-database`, { dbName });
};

export const checkDatabase = async (dbName) => {
  return await axios.post(`${API_URL}/check-database`, { dbName });
};

export const migrateDatabase = async (sourceDb, targetDb) => {
  return await axios.post(`${API_URL}/migrate-database`, { sourceDb, targetDb });
};
