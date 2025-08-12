import React from "react";
import {X} from "lucide-react";
import {ReviewFile} from "@/redux/types/meeting";


interface EnlargeFileProps {
    file: ReviewFile;
    onClickClose?: () => void;
}

const EnlargeFile:React.FC<EnlargeFileProps> = ({file, onClickClose}) => {

    const clickClose = () => {
        if (onClickClose) onClickClose();
    }

    return (
        <div>
            <div className="relative mt-4 border rounded-lg p-4">
                <button
                    type="button"
                    className="absolute top-1 right-1 bg-whitetext-black hover:bg-opacity-50 p-0.5 rounded"
                    onClick={() => clickClose()}
                >
                    <X className="w-4 h-4"/>
                </button>
                {file.type === "IMAGE" ? (
                    <img src={file.url} alt="selected" className="max-w-full max-h-96 mx-auto rounded"/>
                ) : (
                    <video controls className="max-w-full max-h-96 mx-auto rounded" src={file.url}/>
                )}
            </div>
        </div>
    )
}

export default EnlargeFile;