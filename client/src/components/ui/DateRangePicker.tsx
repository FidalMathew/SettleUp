import * as React from "react";
import {addDays, format} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";
import {DateRange} from "react-day-picker";
import {FC, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {FormikProps} from "formik";

interface MyFormValues {
  groupName: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  category: string;
}

interface DatePickerWithRangeProps {
  className?: string;

  formik?: FormikProps<MyFormValues>;
  defaultValue?: DateRange;
}

export const DatePickerWithRange: FC<DatePickerWithRangeProps> = ({
  className,
  formik,
  defaultValue,
}) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: defaultValue ? defaultValue.from : new Date(),
    to: defaultValue ? defaultValue.to : new Date(),
  });

  useEffect(() => {
    if (formik) {
      formik.setFieldValue("dateRange", date);
    }
  }, [date]);
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal w-[97%]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
