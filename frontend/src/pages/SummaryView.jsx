import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSummary } from '../api';
import { ArrowLeft, BookOpen, Layers, Activity, Cpu } from 'lucide-react';

export default function SummaryView() {
    const { id } = useParams();
    const [summaryData, setSummaryData] = useState(null);
    const [level, setLevel] = useState('technical');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary(level);
    }, [id, level]);

    const fetchSummary = async (lvl) => {
        setLoading(true);
        try {
            const data = await getSummary(id, lvl);
            setSummaryData(data);
        } catch (error) {
            console.error("Failed to fetch summary", error);
        } finally {
            setLoading(false);
        }
    };

    const levels = [
        { id: 'eli5', label: 'ELI5', desc: 'Simple explanation' },
        { id: 'technical', label: 'Technical', desc: 'Methodology helper' },
        { id: 'expert', label: 'Expert', desc: 'Critical Analysis' },
    ];

    return (
        <div className="space-y-6">
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50/50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Paper Analysis</h1>
                            <p className="text-sm text-slate-500">ID: {id}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
                        {levels.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setLevel(l.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${level === l.id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-500">Generating {level} summary via ScaleDown...</p>
                        </div>
                    ) : (
                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-bold mb-4 capitalize">{level} Summary</h2>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line">
                                {summaryData?.summary}
                            </div>

                            {/* Mock Stats Section */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                                    <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Layers size={20} /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Tokens Saved</p>
                                        <p className="text-lg font-bold text-slate-900">75.4%</p>
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Activity size={20} /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Scientific Accuracy</p>
                                        <p className="text-lg font-bold text-slate-900">98.2%</p>
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><Cpu size={20} /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Processing Time</p>
                                        <p className="text-lg font-bold text-slate-900">1.2s</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
