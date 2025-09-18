import React, {useState} from "react";
import {PlayCircle, Undo2, X, ZoomIn} from "lucide-react";
import {ReviewFile} from "@/redux/types/meeting";

interface FilePreviewProps {
    file: ReviewFile;
    index: number;
    isEditing?: boolean;
    onClickEnlarge?: (file: ReviewFile) => void;
    onClickDelete?: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({file, index, isEditing, onClickEnlarge, onClickDelete}) => {
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const isImage = file.type === 'IMAGE';
    const clickEnlarge = (file: ReviewFile) => {
        if (onClickEnlarge) onClickEnlarge(file);
    }

    const handleRemoveBtn = (index: number) => {
        if(file.state === 'NEW') {
            if(onClickDelete) onClickDelete(index);
        } else if (file.state === 'DELETE') {
            setIsDelete(false);
            file.state = undefined;
        } else {
            setIsDelete(true);
            file.state = 'DELETE';
        }
    };

    return (
        <div className="relative w-32 h-32 rounded overflow-hidden group shadow border">
            <div className={`w-full h-full ${file.state === 'DELETE' ? 'opacity-20' : ''}`}>
                {isImage ? (
                    <img src={file.url} className="w-full h-full object-cover" alt="이미지" />
                ) : (
                    <video src={file.url} className="w-full h-full object-cover" muted />
                )}
            </div>

            <button
                type="button"
                className="absolute bottom-1 left-1 bg-white text-black hover:bg-opacity-50 p-0.5 rounded"
                onClick={() => clickEnlarge(file)}
            >
                {isImage ? <ZoomIn className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            </button>

            {isEditing && (
                <button
                    type="button"
                    className="absolute top-1 right-1 bg-white text-black hover:bg-opacity-50 p-0.5 rounded"
                    onClick={() => handleRemoveBtn(index)}
                >
                    {isDelete ? <Undo2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
}

export default FilePreview;