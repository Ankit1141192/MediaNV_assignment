import React, { useState } from 'react';
import './DatabaseManager.css'; // We'll create this CSS file next

const DatabaseManager = () => {
    const [newDbName, setNewDbName] = useState('');
    const [existingDbName, setExistingDbName] = useState('');
    const [checkDbName, setCheckDbName] = useState('');

    // Migration state
    const [sourceDb, setSourceDb] = useState('');
    const [targetDb, setTargetDb] = useState('');

    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:3000';

    const handleMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000); // Auto-clear after 5s
    };

    const checkDatabase = async () => {
        if (!checkDbName) return handleMessage('error', 'Please enter a database name to check.');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/check-db`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dbName: checkDbName }),
            });
            const data = await res.json();
            if (data.exists) {
                handleMessage('success', data.message);
            } else {
                handleMessage('error', data.message);
            }
        } catch (err) {
            handleMessage('error', 'Failed to check database.');
        } finally {
            setLoading(false);
        }
    };

    const createDatabase = async () => {
        if (!newDbName) return handleMessage('error', 'Please enter a name for the new database.');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/create-db`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dbName: newDbName }),
            });
            const data = await res.json();
            if (res.ok) {
                handleMessage('success', data.message);
                setNewDbName(''); // Clear input on success
            } else {
                handleMessage('error', data.error || 'Failed to create database.');
            }
        } catch (err) {
            handleMessage('error', 'Failed to connect to backend.');
        } finally {
            setLoading(false);
        }
    };

    const migrateDatabase = async () => {
        if (!sourceDb || !targetDb) return handleMessage('error', 'Please provide both source and target databases.');
        if (sourceDb === targetDb) return handleMessage('error', 'Source and target cannot be the same.');

        setLoading(true);
        handleMessage('info', 'Migration started... This may take a while.'); // Info message

        try {
            const res = await fetch(`${API_URL}/migrate-db`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceDb, targetDb }),
            });
            const data = await res.json();
            if (res.ok) {
                handleMessage('success', data.message);
            } else {
                handleMessage('error', data.error || 'Migration failed.');
            }
        } catch (err) {
            handleMessage('error', 'Failed to connect to backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="db-manager-container">
            <h1>PostgreSQL Database Manager</h1>

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="card-grid">
                {/* Check Database */}
                <div className="card">
                    <h2>Check Database</h2>
                    <div className="input-group">
                        <label>Database Name</label>
                        <input
                            type="text"
                            value={checkDbName}
                            onChange={(e) => setCheckDbName(e.target.value)}
                            placeholder="e.g., my_existing_db"
                        />
                    </div>
                    <button onClick={checkDatabase} disabled={loading} className="btn primary">
                        {loading ? 'Checking...' : 'Check Availability'}
                    </button>
                </div>

                {/* Create Database */}
                <div className="card">
                    <h2>Create New Database</h2>
                    <div className="input-group">
                        <label>New Database Name</label>
                        <input
                            type="text"
                            value={newDbName}
                            onChange={(e) => setNewDbName(e.target.value)}
                            placeholder="e.g., my_new_db"
                        />
                    </div>
                    <button onClick={createDatabase} disabled={loading} className="btn success">
                        {loading ? 'Creating...' : 'Create Database'}
                    </button>
                </div>

                {/* Migrate Database */}
                <div className="card full-width">
                    <h2>Migrate Database</h2>
                    <p className="description">Export data from an existing database to another one.</p>
                    <div className="migration-inputs">
                        <div className="input-group">
                            <label>Source Database</label>
                            <input
                                type="text"
                                value={sourceDb}
                                onChange={(e) => setSourceDb(e.target.value)}
                                placeholder="Source DB Name"
                            />
                        </div>
                        <div className="arrow">➔</div>
                        <div className="input-group">
                            <label>Target Database</label>
                            <input
                                type="text"
                                value={targetDb}
                                onChange={(e) => setTargetDb(e.target.value)}
                                placeholder="Target DB Name"
                            />
                        </div>
                    </div>
                    <button onClick={migrateDatabase} disabled={loading} className="btn warning">
                        {loading ? 'Migrating...' : 'Start Migration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatabaseManager;
