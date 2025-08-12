import React, {useState} from "react";
import {MeetingReview, ReviewFile} from "@/redux/types/meeting";
import {Avatar, AvatarImage} from "@/components/ui/shadcn/avatar";
import {Card} from "@/components/ui/shadcn/card";
import FilePreview from "@/components/ui/meetings/FilePreview";
import EnlargeFile from "@/components/ui/meetings/EnlargeFile";

interface ReviewCardProps {
    review: MeetingReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({review}) => {
    const [selectedPreviewFile, setSelectedPreviewFile] = useState<ReviewFile | null>(null);

    const handlePreviewFileClick = (file: ReviewFile) => {
        setSelectedPreviewFile({
            type: file.type,
            file: file.file,
            url: file.url,
        });
    };

    const handleEnlargeClose = () => {
        setSelectedPreviewFile(null);
    };

    return (
        <Card className="p-4 space-y-3 w-full">
            <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7">
                    <AvatarImage
                        src={review.writer.profileImage || "https://github.com/shadcn.png"}/>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{review.writer.username}</span>
                    {review.createdAt && (
                        <span
                            className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-800 whitespace-pre-line">{review.comments}</p>

            {review.files.length > 0 && (
                <div className="flex w-full flex-wrap gap-4">
                    {review.files.map((file, index) => {
                        return (
                            <FilePreview
                                key={index}
                                index={index}
                                file={file}
                                onClickEnlarge={handlePreviewFileClick}
                            />
                        )
                    })}
                </div>
            )}

            {selectedPreviewFile && (
                <EnlargeFile file={selectedPreviewFile} onClickClose={handleEnlargeClose} />
            )}
        </Card>
    )
}

export default ReviewCard;