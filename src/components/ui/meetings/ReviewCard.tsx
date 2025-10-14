import React, {useEffect, useState} from "react";
import {MeetingReview, ReviewFile} from "@/redux/types/meeting";
import {Avatar, AvatarImage} from "@/components/ui/shadcn/avatar";
import {Card} from "@/components/ui/shadcn/card";
import FilePreview from "@/components/ui/meetings/FilePreview";
import EnlargeFile from "@/components/ui/meetings/EnlargeFile";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {Paperclip, Pencil, PencilOff, SendHorizonal, Trash2} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {meetingReviewSchema} from "@/lib/schemas/meeting";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/shadcn/form";
import api from "@/services/api";
import {Spinner} from "@/components/ui/shadcn/spinner";
import {Button} from "@/components/ui/shadcn/button";
import ConfirmDialog from "@/components/ui/common/ConfirmDialog";

interface ReviewCardProps {
    review: MeetingReview;
    onChange?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({review, onChange}) => {
    const [selectedPreviewFile, setSelectedPreviewFile] = useState<ReviewFile | null>(null);
    const { user } = useSelector((state: RootState) => state.user);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [previewFiles, setPreviewFiles] = useState<ReviewFile[]>([]);

    const form = useForm<z.infer<typeof meetingReviewSchema>>({
        resolver: zodResolver(meetingReviewSchema),
        defaultValues: {
            meetingId: review.meetingId,
            writerId: review.writer.id,
            files: [],
            comments: review.comments,
        },
    });


    useEffect(() => {
        initFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [review]);

    const initFiles = (): void => {
        if (review?.files?.length) {
            setPreviewFiles(
                review.files.map((f) => ({
                    id: f.id,
                    file: f.file,
                    type: f.type,
                    url: f.url,
                }))
            );
        }
    }

    const handlePreviewFileClick = (file: ReviewFile) => {
        setSelectedPreviewFile({
            type: file.type,
            file: file.file,
            url: file.url,
        });
    };

    const removeFile = (index: number) => {
        const fileToRemove = previewFiles[index];

        URL.revokeObjectURL(fileToRemove.url);

        const newPreviewFiles = previewFiles.filter((_, i) => i !== index);
        setPreviewFiles(newPreviewFiles);

        // 확대된 파일이 삭제되었을 때 null처리
        if (selectedPreviewFile?.file === fileToRemove.file) setSelectedPreviewFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const newPreviewFiles: ReviewFile[] = files.map(file => ({
            file,
            type: file.type.startsWith("image/") ? 'IMAGE' : 'VIDEO',
            url: URL.createObjectURL(file),
            state: 'NEW',
        }));

        const updatedPreviewFiles = [...previewFiles, ...newPreviewFiles];
        setPreviewFiles(updatedPreviewFiles);
    };

    const handleEditing = async () => {
        if(isEditing) initFiles();
        setSelectedPreviewFile(null);
        setIsEditing(!isEditing);
    }

    const handleReviewDelete = async () => {
        if (!review || btnLoading) return;
        setBtnLoading(true);

        try {
            await api.delete(`/reviews/${review.id}`);
            if (onChange) onChange();
        } catch (error) {
            console.error("삭제 실패:", error);
            // TODO: 토큰 만료, 이미 삭제된 모임 등 예외 처리
        } finally {
            setBtnLoading(false);
        }
    }

    const handleReviewUpdateSubmit = async (data: z.infer<typeof meetingReviewSchema>) => {
        const formData = new FormData();

        const dtoWithoutNewFiles = {
            id: review.id,
            writerId: data.writerId,
            meetingId: data.meetingId,
            comments: data.comments,
            reviewFiles: previewFiles.filter(f => !f.state || f.state === "DELETE"),
            // reviewFiles로는 기존의 파일 데이터만 전송
        };
        formData.append('review', new Blob([JSON.stringify(dtoWithoutNewFiles)], {type: 'application/json'}));

        previewFiles
            .filter(f => f.state === "NEW" && f.file instanceof File)
            .forEach(f => {
                formData.append("files", f.file);
            });

        try {
            await api.put(`/reviews/${review.id}`, formData);
            setIsEditing(false);
            if (onChange) onChange();
        } catch (error) {
            alert("등록에 수정에 실패했습니다.")
        }
    };

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
                            onClick={handleEditing}
                        >
                            {isEditing ?
                                <PencilOff
                                    className="w-3.5 h-3.5"
                                />
                                : <Pencil
                                    className="w-3.5 h-3.5"
                                />}
                        </button>
                        {btnLoading ? <Spinner size="small" />
                            :
                                <ConfirmDialog
                                    trigger={<Trash2 className="w-3.5 h-full text-red-500 hover:opacity-50 rounded"/>}
                                    title="리뷰 삭제"
                                    description="해당 리뷰를 삭제히겠습니까?"
                                    confirmText="삭제"
                                    onConfirm={handleReviewDelete}
                                />
                        }
                    </div>
                )}
            </div>

            {isEditing ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleReviewUpdateSubmit)}
                        className="space-y-3"
                    >
                        {previewFiles.length > 0 && (
                            <div className="flex w-full flex-wrap gap-4">
                                {previewFiles.map((previewFile, index) => {
                                    return (
                                        <FilePreview
                                            key={index}
                                            file={previewFile}
                                            index={index}
                                            isEditing={true}
                                            onClickEnlarge={handlePreviewFileClick}
                                            onClickDelete={removeFile}
                                        />)
                                })}
                            </div>
                        )}

                        {selectedPreviewFile && (
                            <EnlargeFile file={selectedPreviewFile} onClickClose={() => setSelectedPreviewFile(null)} />
                        )}

                        <div className="border-gray-300 border w-full rounded-md flex flex-col px-5 py-3 mt-2">
                            <FormField
                                control={form.control}
                                name="comments"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel></FormLabel>
                                        <FormControl>
                                                        <textarea
                                                            className="w-full resize-none outline-none"
                                                            rows={4}
                                                            placeholder="이번 모임에 대해서 한마디 남겨주세요."
                                                            {...field}
                                                        />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <hr className="my-2" />

                            <div className="flex w-full justify-between">
                                <FormField
                                    control={form.control}
                                    name="files"
                                    render={() => (
                                        <FormItem className="flex">
                                            <FormLabel className={`cursor-pointer content-center hover:opacity-50
                                                                ${previewFiles.length > 0 && 'border rounded-md px-2 flex items-center'}
                                                                ${previewFiles.length > 10 && 'bg-red-600 text-white'}`}>
                                                <Paperclip className="w-4 h-4" />
                                                {previewFiles.length > 0 &&
                                                    (<span className="ml-1">{previewFiles.length} / 10</span>)}
                                            </FormLabel>

                                            <FormControl>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*,video/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="ml-2" />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" variant="outline">
                                    <SendHorizonal />
                                </Button>
                            </div>
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
                                    onClickEnlarge={handlePreviewFileClick}
                                />
                            ))}
                        </div>
                    )}

                    {selectedPreviewFile && (
                        <EnlargeFile file={selectedPreviewFile} onClickClose={() => setSelectedPreviewFile(null)} />
                    )}
                </>
            )}
        </Card>
    )
}

export default ReviewCard;

//TODO: 삭제버튼 눌렀을 때 삭제여부 묻기