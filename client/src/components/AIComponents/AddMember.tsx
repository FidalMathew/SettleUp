import {Plus} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {PreviewComponent} from "searchpal";
import {Field, Form, Formik} from "formik";
import {convertStringToJSON} from "@/lib/utils";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
  ResponsiveDialogComponent,
  ResponsiveDialogComponentContent,
  ResponsiveDialogComponentDescription,
  ResponsiveDialogComponentFooter,
  ResponsiveDialogComponentHeader,
  ResponsiveDialogComponentTitle,
} from "@/components/ui/ResponsiveDialog";
import {emoji} from "../../lib/emoji";

const AddMembers = ({datastring}: {datastring: string}) => {
  const [data, setData] = useState(convertStringToJSON(datastring));
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const getRandomEmoji = () => emoji[Math.floor(Math.random() * emoji.length)];
  const randomAvatar = getRandomEmoji();

  console.log(data, "from add members");
  return (
    <div>
      <p className="text-lg font-semibold text-center">Add Members</p>
      <Formik
        initialValues={{
          name: data.member || "",
          email: data.email || "",
          phone: data.phone || "",
          wallet: data.wallet_address || "",
          avatarPath: randomAvatar.imgpath,
        }}
        onSubmit={(values, action) => {
          console.log(values);
        }}
      >
        {(formik) => (
          <Form>
            <ResponsiveDialogComponent
              open={openAvatarModal}
              onOpenChange={setOpenAvatarModal}
            >
              <ResponsiveDialogComponentContent>
                <ResponsiveDialogComponentHeader>
                  <ResponsiveDialogComponentTitle>
                    <p>Select an Emoji</p>
                  </ResponsiveDialogComponentTitle>
                  <ResponsiveDialogComponentDescription>
                    <div className="grid grid-cols-3 grid-flow-row grid-rows-3 w-full place-items-center pt-5 gap-6">
                      {emoji.map(
                        (
                          item: {
                            imgpath: string;
                            name: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="border rounded-xl p-4 flex flex-col gap-2 aspect-square h-fit items-center cursor-pointer hover:bg-muted"
                          >
                            <img
                              src={item.imgpath}
                              alt={item.name}
                              className="h-16 w-16"
                              onClick={() => {
                                formik.setFieldValue(
                                  "avatarPath",
                                  item.imgpath
                                );
                                setOpenAvatarModal(false);
                              }}
                            />
                            {/* <p>Man</p> */}
                          </div>
                        )
                      )}
                    </div>
                  </ResponsiveDialogComponentDescription>
                </ResponsiveDialogComponentHeader>
              </ResponsiveDialogComponentContent>
            </ResponsiveDialogComponent>

            <div className="w-full pt-6 flex items-center flex-col gap-4">
              <Avatar
                className="w-32 h-32 relative overflow-visible cursor-pointer"
                onClick={() => setOpenAvatarModal((prev) => !prev)}
              >
                <AvatarImage src={formik.values.avatarPath} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full gap-2">
                <Field
                  as={Input}
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="w-full focus-visible:ring-0"
                />
                <div className="flex items-center gap-3">
                  <Field
                    as={Input}
                    name="email"
                    id="email"
                    type="text"
                    placeholder="Email"
                    className="w-full focus-visible:ring-0"
                  />
                  <Field
                    as={Input}
                    name="phone"
                    id="phone"
                    type="text"
                    placeholder="Phone"
                    className="w-full focus-visible:ring-0"
                  />
                </div>
                <Field
                  as={Input}
                  name="wallet"
                  id="wallet"
                  type="text"
                  placeholder="Wallet Address (0x..)"
                  className="w-full focus-visible:ring-0"
                />
              </div>
            </div>

            <Button
              className="bg-[#81B29A] hover:bg-[#81B29A] w-full mt-6"
              type="submit"
            >
              Add Member
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMembers;
