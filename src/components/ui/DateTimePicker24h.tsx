"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DateTimePicker24h({ value, onChange }: { value?: Date; onChange: (date: Date) => void }) {
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(value);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        setInternalDate(value);
    }, [value]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            if (internalDate) {
                newDate.setHours(internalDate.getHours());
                newDate.setMinutes(internalDate.getMinutes());
            }
            setInternalDate(newDate);
            onChange(newDate); // 상위 컴포넌트로 전달
        }
    };

    const handleTimeChange = (type: "hour" | "minute", value: string) => {
        if (internalDate) {
            const newDate = new Date(internalDate);
            if (type === "hour") {
                newDate.setHours(parseInt(value));
            } else {
                newDate.setMinutes(parseInt(value));
            }
            setInternalDate(newDate);
            onChange(newDate); // 상위 컴포넌트로 전달
        }
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !internalDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {internalDate ? (
                        format(internalDate, "MM/dd/yyyy HH:mm")
                    ) : (
                        <span>MM/DD/YYYY HH:mm</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={internalDate}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={internalDate && internalDate.getHours() === hour ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={internalDate && internalDate.getMinutes() === minute ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("minute", minute.toString())}
                                    >
                                        {minute.toString().padStart(2, "0")}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}