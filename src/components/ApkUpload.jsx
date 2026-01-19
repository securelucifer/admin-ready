import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import apkService from '../services/apkService';
import {
    Upload,
    Download,
    Trash2,
    CheckCircle,
    AlertCircle,
    Loader,
    FileText,
    Info
} from 'lucide-react';

const ApkUpload = () => {
    const [file, setFile] = useState(null);
    const [version, setVersion] = useState('');
    const [currentApk, setCurrentApk] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const MAX_SIZE = 30 * 1024 * 1024;

    useEffect(() => {
        fetchCurrentApk();
    }, []);

    const fetchCurrentApk = async () => {
        try {
            setLoading(true);
            const data = await apkService.getStatus();
            if (data.available && data.fileInfo) {
                setCurrentApk(data.fileInfo);
            } else {
                setCurrentApk(null);
            }
        } catch (error) {
            showMessage('error', 'Failed to fetch APK status');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const validateFile = (file) => {
        if (!file) return 'No file selected';

        if (!file.name.endsWith('.apk')) {
            return 'Only .apk files are allowed';
        }

        if (file.size > MAX_SIZE) {
            return `File too large. Maximum size is 30MB. Your file: ${apkService.formatFileSize(file.size)}`;
        }

        return null;
    };

    const handleFileSelect = (selectedFile) => {
        const error = validateFile(selectedFile);
        if (error) {
            showMessage('error', error);
            return;
        }

        setFile(selectedFile);
        setMessage({ type: '', text: '' });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            showMessage('error', 'Please select an APK file first');
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            await apkService.uploadApk(file, version, (percent) => {
                setProgress(percent);
            });

            showMessage('success', '✅ APK uploaded successfully!');
            setFile(null);
            setVersion('');
            setProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            await fetchCurrentApk();
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || 'Upload failed';
            showMessage('error', errorMsg);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete the current APK? This action cannot be undone.')) {
            return;
        }

        try {
            setDeleting(true);
            await apkService.deleteApk();
            showMessage('success', '✅ APK deleted successfully');
            setCurrentApk(null);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || 'Delete failed';
            showMessage('error', errorMsg);
        } finally {
            setDeleting(false);
        }
    };

    const handleDownload = () => {
        window.open(apkService.getDownloadUrl(), '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow rounded-lg mb-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">APK Management</h1>
                            <p className="text-sm text-gray-600 mt-1">Upload and manage your Android app</p>
                        </div>
                        <Link
                            to="/admin/dashboard"
                            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                        >
                            <span>← Back to Dashboard</span>
                        </Link>
                    </div>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`mb-6 rounded-lg p-4 flex items-center space-x-3 ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                {/* Current APK Info */}
                {currentApk && (
                    <div className="bg-white shadow rounded-lg mb-6 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-indigo-100 rounded-lg p-3">
                                    <FileText className="text-indigo-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Current APK</h2>
                                    <p className="text-sm text-gray-500">Active version available for download</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleDownload}
                                    className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Download size={16} />
                                    <span>Download</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="inline-flex items-center space-x-2 px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                                >
                                    {deleting ? (
                                        <Loader className="animate-spin" size={16} />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Filename</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{currentApk.filename}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Version</p>
                                <p className="text-sm font-medium text-gray-900">{currentApk.version}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Size</p>
                                <p className="text-sm font-medium text-gray-900">{apkService.formatFileSize(currentApk.size)}</p>
                            </div>
                            <div className="md:col-span-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {new Date(currentApk.modified).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Section - ✅ HIDDEN WHEN APK EXISTS */}
                {!currentApk && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload APK</h2>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Upload Guidelines:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Only .apk files are allowed</li>
                                    <li>Maximum file size: 30MB</li>
                                    <li>Version number is optional but recommended</li>
                                </ul>
                            </div>
                        </div>

                        {/* Drag & Drop Area */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-300 bg-gray-50'
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".apk"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="hidden"
                                id="apk-upload"
                            />

                            <label htmlFor="apk-upload" className="cursor-pointer">
                                <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">APK file up to 30MB</p>
                            </label>
                        </div>

                        {/* Selected File */}
                        {file && (
                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="text-gray-400" size={24} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                            <p className="text-xs text-gray-500">{apkService.formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Version Input */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Version Number (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 1.0.4"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                disabled={uploading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter the app version number (e.g., 1.0.4)</p>
                        </div>

                        {/* Progress Bar */}
                        {uploading && progress > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                                    <span className="text-sm font-medium text-indigo-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    <span>Uploading... {progress}%</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    <span>Upload APK</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApkUpload;
