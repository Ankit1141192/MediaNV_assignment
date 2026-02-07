import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createCandidate, getCandidateById, updateCandidate } from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const CandidateForm = () => {
    const [candidate, setCandidate] = useState({
        name: '',
        age: '',
        email: '',
        phone: '',
        skills: '',
        experience: '',
        applied_position: '',
        status: 'Applied'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            loadCandidate();
        }
    }, [id]);

    const loadCandidate = async () => {
        try {
            const data = await getCandidateById(id);
            setCandidate(data);
        } catch (err) {
            setError('Failed to load candidate details.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidate(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (id) {
                await updateCandidate(id, candidate);
            } else {
                await createCandidate(candidate);
            }
            navigate('/');
        } catch (err) {
            setError('Failed to save candidate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft size={20} className="mr-2" />
                Back to Candidates
            </Link>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{id ? 'Edit Candidate' : 'Add New Candidate'}</h2>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={candidate.name}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={candidate.email}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={candidate.phone}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                            <input
                                type="number"
                                name="age"
                                value={candidate.age}
                                onChange={handleChange}
                                required
                                min="18"
                                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Applied Position</label>
                        <input
                            type="text"
                            name="applied_position"
                            value={candidate.applied_position}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                        <input
                            type="text"
                            name="experience"
                            value={candidate.experience}
                            onChange={handleChange}
                            placeholder="e.g. 5 years, Senior Level"
                            className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                        <textarea
                            name="skills"
                            value={candidate.skills}
                            onChange={handleChange}
                            rows="3"
                            placeholder="e.g. JavaScript, React, Node.js"
                            className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={candidate.status}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center disabled:opacity-50"
                        >
                            <Save size={20} className="mr-2" />
                            {loading ? 'Saving...' : 'Save Candidate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CandidateForm;
