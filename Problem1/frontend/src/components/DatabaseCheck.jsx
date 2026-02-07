import React, { useState } from 'react';
import { checkDatabase } from '../services/api';

const DatabaseCheck = () => {
    const [dbName, setDbName] = useState('');
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheck = async (e) => {
        e.preventDefault();
        setStatus(null);
        setMessage('');
        setLoading(true);

        try {
            const response = await checkDatabase(dbName);
            if (response.data.exists) {
                setStatus('exists');
                setMessage(response.data.message);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setStatus('not_found');
                setMessage(err.response.data.message);
            } else {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Error checking database');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 h-full flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
            <div>
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Check Database
                </h2>
                <form onSubmit={handleCheck} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Database Name</label>
                        <input
                            type="text"
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            className="input-field"
                            placeholder="e.g. existing_db"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-secondary ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Checking...
                            </span>
                        ) : 'Check Status'}
                    </button>
                </form>
            </div>

            {message && (
                <div className={`mt-6 p-4 rounded-xl text-sm text-center animate-fade-in-up border ${status === 'exists' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    status === 'not_found' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                    <span className="font-semibold block mb-1">
                        {status === 'exists' ? 'Available' : status === 'not_found' ? 'Not Found' : 'Error'}
                    </span>
                    {message}
                </div>
            )}
        </div>
    );
};

export default DatabaseCheck;
