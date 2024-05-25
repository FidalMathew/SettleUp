import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {CalendarIcon} from "lucide-react";
import {Button} from "../ui/button";
import {useState} from "react";
import {Label} from "../ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Form, Formik} from "formik";
export default function AddExpense({datastring}: {datastring: string}) {
  const [date, setDate] = useState<Date>();
  return (
    <div className="w-full">
      <Formik
        initialValues={{
          amount: 0,
          description: "",
          paidBy: "",
          category: "",
          date: new Date(),
          splitArray: [],
          unequallySplitArray: [],
          equalSplit: true,
        }}
        onSubmit={(values, action) => {
          // action.resetForm()
          console.log(values);
        }}
      >
        {(formik) => (
          <Form className="flex flex-col">
            <div className="w-full">
              <div className="mt-5 w-full">
                <div className="flex items-end justify-center text-6xl gap-1 w-full mb-6">
                  <Input
                    type="text"
                    placeholder="0"
                    className="focus-visible:ring-0 border-none rounded-none text-6xl h-24 text-center w-[180px]"
                    inputMode="numeric"
                    maxLength={4}
                  />
                  <p className="text-3xl -translate-y-4">USDC</p>
                </div>
              </div>
              <div className="flex justify-between flex-col w-[90%] gap-3 m-auto">
                <div className="w-full">
                  <Input
                    type="text"
                    placeholder="Description"
                    className="text-sm focus-visible:ring-0"
                  />
                </div>
                <div className="w-full">
                  <Select>
                    <SelectTrigger className="w-full focus-visible:ring-0 active:ring-0 focus:ring-0">
                      <SelectValue placeholder="Paid By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="jaydeep">
                          {/* picture and text */}

                          <div className="flex items-center gap-3">
                            <img src="/man.png" alt="man" className="h-6 w-6" />
                            <p>Fidal</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="fidal">
                          {/* picture and text */}

                          <div className="flex items-center gap-3">
                            <img src="/man.png" alt="man" className="h-6 w-6" />
                            <p>Jaydeep</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="manvik">
                          <div className="flex items-center gap-3">
                            <img
                              src="/user.png"
                              alt="user"
                              className="h-6 w-6"
                            />
                            <p>Manvik</p>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center flex-col mt-5 w-[90%] m-auto gap-3">
                <div className="w-full">
                  <Select>
                    <SelectTrigger className="w-full focus-visible:ring-0 active:ring-0 focus:ring-0">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="food">
                          {/* picture and text */}

                          <div className="flex items-center gap-3">
                            <img src="/burger.png" className="h-6 w-6" />
                            <p>Food</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="fuel">
                          <div className="flex items-center gap-3">
                            <img src="/fuel.png" className="h-6 w-6" />
                            <p>Fuel</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="shopping">
                          <div className="flex items-center gap-3">
                            <img src="/shopping.png" className="h-6 w-6" />
                            <p>Shopping</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="cab">
                          <div className="flex items-center gap-3">
                            <img src="/car.png" className="h-6 w-6" />
                            <p>Cab</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="grocery">
                          <div className="flex items-center gap-3">
                            <img src="/vegetable.png" className="h-6 w-6" />
                            <p>Grocery</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="train">
                          <div className="flex items-center gap-3">
                            <img src="/train.png" className="h-6 w-6" />
                            <p>Train</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="sports">
                          <div className="flex items-center gap-3">
                            <img src="/sports.png" className="h-6 w-6" />
                            <p>Sports</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="temple">
                          <div className="flex items-center gap-3">
                            <img src="/temple.png" className="h-6 w-6" />
                            <p>Temple</p>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" mode="single" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="pt-5 pb-0 flex flex-col gap-3">
                <Tabs
                  defaultValue="equally"
                  className="w-full flex flex-col items-center"
                >
                  <TabsList className="rounded-full">
                    <TabsTrigger
                      value="equally"
                      className="data-[state=active]:bg-[#81B29A] data-[state=active]:text-white data-[state=active]:rounded-full"
                    >
                      Equally
                    </TabsTrigger>
                    <TabsTrigger
                      value="unequally"
                      className="data-[state=active]:bg-[#81B29A] data-[state=active]:text-white data-[state=active]:rounded-full"
                    >
                      Unequally
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="equally"
                    className="w-full flex items-start flex-col focus-visible:ring-0"
                  >
                    <p className="pt-3">Select to Split</p>
                    <Carousel
                      opts={{
                        align: "start",
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="w-full">
                        <CarouselItem className="basis-1/3">
                          <div className="flex flex-col gap-1">
                            <Checkbox id="option1" className="peer sr-only" />
                            <Label
                              htmlFor="option1"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8  w-8 "
                              />
                              <div className="flex flex-col items-center gap-2">
                                <p>Fidal</p>
                                <p>23 USDC</p>
                              </div>
                            </Label>
                          </div>
                        </CarouselItem>

                        <CarouselItem className="basis-1/3">
                          <div className="">
                            <Checkbox id="option2" className="peer sr-only" />
                            <Label
                              htmlFor="option2"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8  w-8 "
                              />
                              <div className="flex flex-col items-center gap-2">
                                <p>Fidal</p>
                                <p>23 USDC</p>
                              </div>
                            </Label>
                          </div>
                        </CarouselItem>
                        <CarouselItem className="basis-1/3">
                          <div className="">
                            <Checkbox id="option3" className="peer sr-only" />
                            <Label
                              htmlFor="option3"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8  w-8 "
                              />
                              <div className="flex flex-col items-center gap-2">
                                <p>Fidal</p>
                                <p>23 USDC</p>
                              </div>
                            </Label>
                          </div>
                        </CarouselItem>
                        <CarouselItem className="basis-1/3">
                          <div className="">
                            <Checkbox id="option4" className="peer sr-only" />
                            <Label
                              htmlFor="option4"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#81B29A] [&:has([data-state=checked])]:border-[#81B29A]"
                            >
                              <img
                                src="/man.png"
                                alt="man"
                                className="mb-3 h-8 w-8"
                              />
                              <div className="flex flex-col items-center gap-2">
                                <p>Fidal</p>
                                <p>23 USDC</p>
                              </div>
                            </Label>
                          </div>
                        </CarouselItem>
                      </CarouselContent>
                    </Carousel>
                  </TabsContent>
                  <TabsContent value="unequally" className="w-full relative">
                    <div className="h-[30px] w-full absolute bottom-0 right-0 border bg-white z-50 rounded-t-md flex justify-between px-4 text-xs items-center">
                      <p>People 1/2</p>
                      <p>Amount Remaining: 100 USDC</p>
                    </div>
                    <div className="flex flex-col gap-3 border p-2 h-[250px] overflow-y-auto expense-box placeholder pb-[33px]">
                      {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <div className="flex items-center justify-between space-x-2 p-3 rounded-xl bg-gray-50">
                          <div className="flex gap-3 items-center">
                            <Checkbox
                              id="terms2"
                              className="data-[state=checked]:bg-[#81B29A] focus-visible:ring-0 border border-gray-300 bg-gray-200"
                            />
                            <Label
                              htmlFor="terms2"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            />
                            <div className="flex gap-4 items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="/woman.png" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>

                              <p>You</p>
                            </div>
                          </div>
                          <Input
                            type="text"
                            placeholder="0"
                            className="w-20 focus-visible:ring-0"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
