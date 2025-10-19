import React, { useState, useRef } from 'react';
import { UploadIcon, ImageIcon } from './icons';

interface ImageUploaderProps {
    onUpload: (base64Url: string) => void;
    compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, compact = false }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setError(null);
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onUpload(e.target?.result as string);
            };
            reader.onerror = () => {
                setError('Could not read the file.');
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please upload a valid image file (PNG, JPG).');
        }
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!compact) setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!compact) setIsDragging(false);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    if (compact) {
        return (
            <div>
                 <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileChange}
                    accept="image/png, image/jpeg, image/webp"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full font-semibold px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
                >
                    <ImageIcon className="w-5 h-5" />
                    Upload Image
                </button>
            </div>
        );
    }

    return (
        <div>
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-brand-primary bg-brand-lavender/50' : 'border-gray-300 hover:border-brand-primary'}`}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={onFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    ref={fileInputRef}
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                    <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="font-semibold text-brand-secondary">Drag & drop an image here</p>
                    <p className="text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG, or WEBP</p>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm font-semibold mt-2 text-center">{error}</p>}
        </div>
    );
};

export default ImageUploader;