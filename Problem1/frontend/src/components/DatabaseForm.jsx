import React, { useState } from 'react';
import { createDatabase } from '../services/api';

const DatabaseForm = () => {
    const [dbName, setDbName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await createDatabase(dbName);
            setMessage(response.data.message);
            setDbName('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create database');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 h-full flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
            <div>
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Create New Database
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Database Name</label>
                        <input
                            type="text"
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            className="input-field"
                            placeholder="e.g. my_new_db"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </span>
                        ) : 'Create Database'}
                    </button>
                </form>
            </div>

            {message && (
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center animate-fade-in-up">
                    <span className="font-semibold block mb-1">Success!</span>
                    {message}
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center animate-fade-in-up">
                    <span className="font-semibold block mb-1">Error</span>
                    {error}
                </div>
            )}
        </div>
    );
};

export default DatabaseForm;
