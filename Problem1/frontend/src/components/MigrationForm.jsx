import React, { useState } from 'react';
import { migrateDatabase } from '../services/api';

const MigrationForm = () => {
    const [sourceDb, setSourceDb] = useState('');
    const [targetDb, setTargetDb] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMigrate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await migrateDatabase(sourceDb, targetDb);
            setMessage(response.data.message);
            // Optional: clear inputs on success
            // setSourceDb('');
            // setTargetDb('');
        } catch (err) {
            setError(err.response?.data?.error || 'Migration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-10 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400">
                Database Migration
            </h2>
            <form onSubmit={handleMigrate} className="max-w-2xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-2">
                        <label className="input-label">Source Database</label>
                        <input
                            type="text"
                            value={sourceDb}
                            onChange={(e) => setSourceDb(e.target.value)}
                            className="input-field"
                            placeholder="e.g. old_db"
                            required
                        />
                    </div>

                    <div className="hidden md:flex justify-center pt-6">
                        <svg className="w-8 h-8 text-slate-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <label className="input-label">Target Database</label>
                        <input
                            type="text"
                            value={targetDb}
                            onChange={(e) => setTargetDb(e.target.value)}
                            className="input-field"
                            placeholder="e.g. new_db"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white tracking-wide shadow-lg shadow-rose-500/20
                    bg-gradient-to-r from-pink-600 to-rose-600 
                    hover:from-pink-500 hover:to-rose-500 
                    active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2
                    ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Migrating Data...
                        </span>
                    ) : 'Start Migration'}
                </button>
            </form>

            <div className="mt-8 max-w-2xl mx-auto">
                {message && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center animate-fade-in-up">
                        <span className="font-semibold block mb-1">Migration Successful!</span>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center animate-fade-in-up">
                        <span className="font-semibold block mb-1">Migration Failed</span>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MigrationForm;
