import React from "react";
import {PlayCircle, X, ZoomIn} from "lucide-react";
import {ReviewFile} from "@/redux/types/meeting";

interface FilePreviewProps {
    file: ReviewFile;
    index: number;
    deleteBtn?: boolean;
    onClickEnlarge?: (file: ReviewFile) => void;
    onClickDelete?: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({file, index, deleteBtn, onClickEnlarge, onClickDelete}) => {
    const isImage = file.type === 'IMAGE';
    const clickEnlarge = (file: ReviewFile) => {
        if (onClickEnlarge) onClickEnlarge(file);
    }

    const removeFile = (index: number) => {
        if(onClickDelete) onClickDelete(index);
    };

    return (
        <div className="relative w-32 h-32 rounded overflow-hidden group shadow border">
            {isImage ? (
                <img src={file.url} alt="이미지" className="w-full h-full object-cover" />
            ) : (
                <video src={file.url} className="w-full h-full object-cover" muted />
            )}

            <button
                type="button"
                className="absolute bottom-1 left-1 bg-white text-black hover:bg-opacity-50 p-0.5 rounded"
                onClick={() => clickEnlarge(file)}
            >
                {isImage ? <ZoomIn className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            </button>

            {deleteBtn && (
                <button
                    type="button"
                    className="absolute top-1 right-1 bg-white text-black hover:bg-opacity-50 p-0.5 rounded"
                    onClick={() => removeFile(index)}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default FilePreview;