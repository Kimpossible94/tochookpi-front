import * as React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/shadcn/form";
import {Input} from "@/components/ui/shadcn/input";
import {Button} from "@/components/ui/shadcn/button";
import {Search} from "lucide-react";

const FormSchema = z.object({
    searchTerm: z.string().optional(),
})

const Main: React.FC = () => {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            searchTerm: '',
        },
    })

    const onSearch = (data: z.infer<typeof FormSchema>) => {
        const query = new URLSearchParams({ searchTerm: data.searchTerm || '' }).toString();
        navigate(`/meeting-list?${query}`);
    };


    return (
        <section className="flex flex-col items-center">
            <div className="p-20 text-center">
                <p className="pl-1 text-6xl font-medium leading-tight">
                    토축피 다이어리에 <br/>
                </p>
                <p className="pl-1 text-6xl font-extrabold leading-tight mb-6">
                    오신 걸 환영합니다
                </p>
                <p className="pl-1 text-lg opacity-80 mb-8">
                    친구들과 함께한 다양한 모임을 기록하세요!
                </p>
                <Link to="/create-meeting">
                    <button
                        className="py-3 px-6 text-xl text-white bg-black rounded-3xl hover:opacity-80 focus:outline-none"
                    >
                        모임 만들기
                    </button>
                </Link>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSearch)} className="mb-8 justify-center w-1/2">
                    <FormField
                        control={form.control}
                        name="searchTerm"
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative w-full">
                                    <FormControl>
                                        <Input
                                            placeholder="검색하려는 모임의 제목을 입력해주세요."
                                            className="pr-20 pl-5 bg-gray-100 h-10 rounded-3xl"
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-sm
                                        rounded-full bg-pink-400 hover:bg-pink-200"
                                    >
                                        <Search/>
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </section>
    );
};

export default Main;
