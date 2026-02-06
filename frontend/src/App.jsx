import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, Upload, FileText } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import SummaryView from './pages/SummaryView';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                                    <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                                        <BookOpen size={24} />
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-slate-900">
                                        Scholar<span className="text-blue-600">Summ</span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-grow">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/summary/:id" element={<SummaryView />} />
                        </Routes>
                    </div>
                </main>

                <footer className="bg-white border-t border-slate-200 mt-auto">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-slate-400 text-sm">
                            &copy; 2026 ScholarSumm. Powered by RAG + ScaleDown.
                        </p>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
