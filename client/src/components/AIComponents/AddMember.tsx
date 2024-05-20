import {Plus} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {PreviewComponent} from "searchpal";

interface AddMembersProps {
  name?: string;
  email?: string;
  phone?: string;
  walletAddress?: string;
}
const AddMembers = ({name, email, phone, walletAddress}: AddMembersProps) => {
  return (
    <div>
      <p className="text-lg font-semibold">Create Group</p>
      <div className="w-full pt-6 flex items-center flex-col gap-4">
        <div>
          <Input type="file" id="avatarupload" className="hidden" />

          <Avatar className="w-32 h-32 relative overflow-visible">
            <Label htmlFor="avatarupload" className="cursor-pointer">
              <div className="absolute bottom-1 z-10 right-3 border h-6 w-6 bg-white rounded-full grid place-content-center cursor-pointer">
                <Plus className="h-4 w-4" />
              </div>
            </Label>
            <AvatarImage src="/user.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col w-full gap-2">
          <Input
            type="text"
            placeholder="Name"
            className="w-full focus-visible:ring-0"
          />
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Email"
              className="w-full focus-visible:ring-0"
            />
            <Input
              type="text"
              placeholder="Phone"
              className="w-full focus-visible:ring-0"
            />
          </div>
          <Input
            type="text"
            placeholder="Wallet Address (0x..)"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AddMembers;
