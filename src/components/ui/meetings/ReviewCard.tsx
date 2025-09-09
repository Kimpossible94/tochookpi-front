import React, {useState} from "react";
import {MeetingReview, ReviewFile} from "@/redux/types/meeting";
import {Avatar, AvatarImage} from "@/components/ui/shadcn/avatar";
import {Card} from "@/components/ui/shadcn/card";
import FilePreview from "@/components/ui/meetings/FilePreview";
import EnlargeFile from "@/components/ui/meetings/EnlargeFile";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {Pencil, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {meetingReviewSchema} from "@/lib/schemas/meeting";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/shadcn/form";
import api from "@/services/api";
import {Spinner} from "@/components/ui/shadcn/spinner";

interface ReviewCardProps {
    review: MeetingReview;
    onDelete?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({review, onDelete}) => {
    const [selectedPreviewFile, setSelectedPreviewFile] = useState<ReviewFile | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<z.infer<typeof meetingReviewSchema>>({
        resolver: zodResolver(meetingReviewSchema),
        defaultValues: {
            meetingId: review.meetingId,
            writerId: review.writer.id,
            files: [],
            comments: review.comments,
        },
    });

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

    const handleFileDelete = async () => {

    }

    const handleReviewDelete = async () => {
        if (!review || btnLoading) return;
        setBtnLoading(true);

        try {
            await api.delete(`/reviews/${review.id}`);
            if (onDelete) onDelete();
        } catch (error) {
            console.error("삭제 실패:", error);
            // TODO: 토큰 만료, 이미 삭제된 모임 등 예외 처리
        } finally {
            setBtnLoading(false);
        }
    }

    return (
        <Card className="p-4 space-y-3 w-full">
            <div className="w-full flex justify-between">
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

                {review.writer.id === user!.id && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="text-black hover:opacity-50 p-0.5 rounded"
                        >
                            <Pencil
                                className="w-3.5 h-3.5"
                                onClick={() => setIsEditing(true)}
                            />
                        </button>
                        {btnLoading ? <Spinner size="small" />
                            :  <button
                                type="button"
                                className="text-red-500 hover:opacity-50 p-0.5 rounded"
                                onClick={handleReviewDelete}
                                >
                                <X className="w-5 h-5"/>
                            </button>
                        }
                    </div>
                )}
            </div>

            {isEditing ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            console.log("수정 데이터:", data);
                            setIsEditing(false);
                        })}
                        className="space-y-3"
                    >
                        <textarea
                            {...form.register("comments")}
                            defaultValue={review.comments}
                            className="w-full border rounded p-2 text-sm"
                        />
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            {...form.register("files")}
                        />

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                                저장
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 bg-gray-300 rounded text-sm"
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </Form>
            ) : (
                <>
                    <p className="text-sm text-gray-800 whitespace-pre-line">{review.comments}</p>

                    {review.files.length > 0 && (
                        <div className="flex w-full flex-wrap gap-4">
                            {review.files.map((file, index) => (
                                <FilePreview
                                    key={index}
                                    index={index}
                                    file={file}
                                    deleteBtn={isEditing}
                                    onClickEnlarge={handlePreviewFileClick}
                                    onClickDelete={handleFileDelete}
                                />
                            ))}
                        </div>
                    )}

                    {selectedPreviewFile && (
                        <EnlargeFile file={selectedPreviewFile} onClickClose={handleEnlargeClose} />
                    )}
                </>
            )}
        </Card>
    )
}

export default ReviewCard;