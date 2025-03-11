import {Switch} from "@/components/ui/switch";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const FormSchema = z.object({
    is_notification_disabled: z.boolean().optional(),
    is_invite_disabled: z.boolean().optional(),
})

export const Settings = () => {
    const { user } = useSelector((state: RootState) => state.user);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            is_notification_disabled: false,
            is_invite_disabled: false,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {

    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div>
                        <div className="grid grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="is_notification_disabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>알림 거부 여부</FormLabel>
                                            <FormDescription>
                                                활동 내역에 대한 알림을 수신하고 싶지 않다면 설정해주세요.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="is_invite_disabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>모임 초대 거부 여부</FormLabel>
                                            <FormDescription>
                                                모임 초대를 자동으로 거부하시려면 설정해주세요.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-readonly
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">저장</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};