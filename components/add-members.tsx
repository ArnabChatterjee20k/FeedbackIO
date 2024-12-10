import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import GraidentAvatar from "./graident-avatar";
export default function AddMembers() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add Members</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members To Feedback Space</DialogTitle>
          <form>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-left text-gray-500">
                  Members Email
                </Label>
                <Input
                  name="name"
                  id="name"
                  placeholder="ex - arnab.chatterjee@gmail.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 py-3">
              <p className="text-gray-500">Members</p>
              <ul className="max-h-[8rem] px-2">
                <li className="flex items-center justify-between flex-wrap my-4">
                  <div className="flex gap-2 items-center">
                    <GraidentAvatar id="sdfk" />
                    <span className="flex flex-col">
                      <span className="text-gray-600">arnab.chatterjee@gmail.com</span>
                      <p className="text-gray-500 text-xs">Read,Write</p>
                    </span>
                  </div>
                  <Select>
                    <SelectTrigger className="w-min">
                      Permissions
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Read</SelectItem>
                      <SelectItem value="dark">Write</SelectItem>
                    </SelectContent>
                  </Select>
                </li>
              </ul>
            </div>
            <div className="w-full flex justify-end">
              <Button>Save Members</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
