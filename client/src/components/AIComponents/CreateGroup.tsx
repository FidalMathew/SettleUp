import {DatePickerWithRange} from "../ui/DateRangePicker";
import {Input} from "../ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {useEffect, useState} from "react";
import {convertStringToJSON} from "@/lib/utils";
import {Field, Form, Formik} from "formik";
import {Button} from "@/components/ui/button";
import {useContractFunctionContextHook} from "@/Context/ContractContext";
import moment from "moment";

interface CreateGroupProps {
  data: any;
}
export default function CreateGroup({datastring}: {datastring: string}) {
  const [data, setData] = useState(convertStringToJSON(datastring));

  const {gaslessTransaction} = useContractFunctionContextHook();

  function formatDate(dateString: string) {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    // Format the date as DD-MM-YYYY
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  const handleCreateGroup = async (values: any) => {
    const {groupName, dateRange, category} = values;

    if (gaslessTransaction) {
      const to = formatDate(dateRange.to);
      const from = formatDate(dateRange.from ? dateRange.from : dateRange.to);
      gaslessTransaction("createGroup", [groupName, category, from, to]);
    }
  };

  console.log(moment(data.start_date, "DD-MM-YYYY").toDate(), "dateRange");
  console.log(moment(data.end_date, "DD-MM-YYYY").toDate(), "dateRange");

  return (
    <div>
      <Formik
        initialValues={{
          groupName: data.group ? data.group : "",
          dateRange: {
            from: data.start_date
              ? moment(data.start_date, "DD-MM-YYYY").toDate()
              : new Date(),
            to: data.end_date
              ? moment(data.end_date, "DD-MM-YYYY").toDate()
              : new Date(),
          },
          category: "food",
        }}
        onSubmit={(values, _) => console.log(values, "values")}
      >
        {(formik) => (
          <Form>
            <p className="text-center text-lg font-semibold">Create a Group</p>
            <div className="flex flex-col gap-3">
              <div className="mt-5 flex item-center gap-4">
                {/* <div>
                  <Input type="file" id="groupImage" className="hidden" />
                  <Label htmlFor="groupImage" className="cursor-pointer">
                    <div className="h-16 w-20 bg-gray-200 rounded-md grid place-content-center">
                      <SmilePlus />
                    </div>
                  </Label>
                </div> */}
                <div className="flex flex-col justify-start gap-2 w-full">
                  {/* <Label htmlFor="groupName" className="text-xs ml-1">
                    Group Name
                  </Label> */}
                  <Field
                    as={Input}
                    id="groupName"
                    name="groupName"
                    placeholder="Enter Group Name"
                    className="focus-visible:ring-0 rounded-lg w-[97%]"
                  />
                </div>
              </div>
              <div className="w-full">
                <DatePickerWithRange
                  formik={formik}
                  className=""
                  defaultValue={{
                    from: moment(data.start_date, "DD-MM-YYYY").toDate(),
                    to: moment(data.end_date, "DD-MM-YYYY").toDate(),
                  }}
                />
              </div>
              <div className="w-full">
                <Carousel opts={{align: "start"}} className="w-full">
                  <RadioGroup
                    className="w-full"
                    value={formik.values.category}
                    onValueChange={
                      (value) => formik.setFieldValue("category", value)
                      // console.log(value, "value")
                    }
                  >
                    <CarouselContent className="w-full">
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="food"
                            id="food"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="food"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/food.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Food</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="fuel"
                            id="fuel"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="fuel"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/fuel.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Fuel</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="shopping"
                            id="shopping"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="shopping"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/shopping.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Shopping</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="cab"
                            id="cab"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="cab"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/cab.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Cab</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="grocery"
                            id="grocery"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="grocery"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/grocery.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Grocery</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="train"
                            id="train"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="train"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/train.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Train</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="sports"
                            id="sports"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="sports"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/sports.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Sports</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                        <div>
                          <RadioGroupItem
                            value="temple"
                            id="temple"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="temple"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                          >
                            <div className="flex items-center flex-col">
                              <img
                                src="/category/temple.png"
                                className="h-6 w-6 mb-3"
                              />
                              <p>Temple</p>
                            </div>
                          </Label>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                  </RadioGroup>
                </Carousel>
              </div>
            </div>
            <Button
              className="bg-[#81B29A] hover:bg-[#81B29A] w-full mt-6"
              type="submit"
            >
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
