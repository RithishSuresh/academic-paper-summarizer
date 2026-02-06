import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { uploadPaper } from '../api';

export default function Dashboard() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStats, setUploadStats] = useState(null);
    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await processFile(files[0]);
        }
    };

    const handleFileSelect = async (e) => {
        if (e.target.files.length > 0) {
            await processFile(e.target.files[0]);
        }
    };

    const processFile = async (file) => {
        setIsUploading(true);
        setUploadStats(null);
        try {
            const data = await uploadPaper(file);
            setUploadStats(data);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload paper.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4 py-12">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                    Summarize Research Papers <br />
                    <span className="text-blue-600">at Hyperspeed</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-slate-500">
                    Upload any PDF to get section-aware summaries, technical breakdowns, and methodology recreations.
                    Powered by ScaleDown for 75% token reduction.
                </p>
            </div>

            <div className="max-w-xl mx-auto">
                <div
                    className={`
            relative group border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                >
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileSelect}
                    />

                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                            {isUploading ? <Loader2 className="animate-spin" /> : <Upload size={32} />}
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-slate-900">
                                {isUploading ? "Processing..." : "Click to upload or drag PDF"}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                MAX 50MB
                            </p>
                        </div>
                    </div>
                </div>

                {uploadStats && (
                    <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-fade-in-up">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <CheckCircle className="text-green-500" size={20} />
                                    Ready for Analysis
                                </h3>
                                <p className="text-slate-500 mt-1">{uploadStats.title}</p>
                            </div>
                            <button
                                onClick={() => navigate(`/summary/${uploadStats.id}`)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                View Summary <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Compression</span>
                                <span className="block text-xl font-bold text-slate-900">{uploadStats.stats.compression_ratio}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Latency Boost</span>
                                <span className="block text-xl font-bold text-slate-900">{uploadStats.stats.latency_improvement}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
