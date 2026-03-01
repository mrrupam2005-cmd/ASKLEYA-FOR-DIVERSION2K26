'use client';
import { useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    onImageSelected: (file: File) => void;
    disabled?: boolean;
}

export default function ImageUploader({ onImageSelected, disabled }: ImageUploaderProps) {
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelected(file);
            // Reset input so the same file can be selected again if needed
            if (galleryInputRef.current) galleryInputRef.current.value = '';
            if (cameraInputRef.current) cameraInputRef.current.value = '';
        }
    };

    return (
        <div className="flex gap-2">
            {/* Gallery Upload */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={galleryInputRef}
                onChange={handleFileChange}
            />
            {/* Camera Capture */}
            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={cameraInputRef}
                onChange={handleFileChange}
            />

            <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled}
                className="group relative h-12 w-12 flex items-center justify-center glass-panel rounded-full holographic-border transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                title="Initialize Bio-Scan"
            >
                <div className="absolute inset-0 rounded-full bg-[#22D3EE]/0 group-hover:bg-[#22D3EE]/10 transition-colors" />
                <Camera size={20} className="text-[#22D3EE] group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all" />
            </button>

            <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={disabled}
                className="group relative h-12 w-12 flex items-center justify-center glass-panel rounded-full holographic-border transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                title="Input Visual Data"
            >
                <div className="absolute inset-0 rounded-full bg-[#22D3EE]/0 group-hover:bg-[#22D3EE]/10 transition-colors" />
                <ImageIcon size={18} className="text-[#22D3EE]/70 group-hover:text-[#22D3EE] group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all" />
            </button>
        </div>
    );
}
