"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../../../../../../../components/ui/button";
import {
  Dispatch,
  FormEvent,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderIcon, TrashIcon } from "lucide-react";
import GraidentAvatar from "../../../../../../../components/graident-avatar";
import { PermissionEnum, TypeEnum, UsersPermission } from "../../types/types";
import Empty from "@/components/empty";
import createPermissionAction from "../../actions/create-permission-action";
import { toast, useToast } from "@/hooks/use-toast";
import deletePermissionAction from "../../actions/delete-permission-action";

// Currently the requirement is for READ permission only due to our event
// TODO: if required just use the write permission from the enum
export default function AddMembers({
  children,
  data,
  document_id,
}: PropsWithChildren & {
  data: UsersPermission[];
  document_id: string;
}) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<UsersPermission[]>([...data]);
  const { toast } = useToast();
  const [isAddMemberPending, startMemberTransition] = useTransition();

  // TODO: currently considering only permission
  // if multiple required make sure to add that
  async function addToMembers(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const member_id = formData.get("email") as string;
    const permissionLevels = [
      formData.get("permission-data") as PermissionEnum,
    ];
    startMemberTransition(async () => {
      // TODO: if we use a multiselect list then for each permission we can add entry to the payload
      const memberAdded = await createPermissionAction([
        {
          document_id: document_id,
          member_id,
          permissionLevels: permissionLevels,
        },
      ]);
      if (memberAdded) {
        setMembers((members) => {
          return [
            ...members,
            { permissions: permissionLevels, user_id: member_id },
          ];
        });
      } else
        toast({
          title: "Error while adding member",
          description: `Not able to add ${member_id}`,
          variant: "destructive",
        });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Members</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Add Members To Feedback Space</DialogTitle>
          <p className="text-blue-600 text-xs font-bold">
            Click the cross to close the modal
          </p>
          <div>
            <form onSubmit={addToMembers} className="grid gap-4 py-4">
              <div className="w-full flex gap-2 items-end">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="name" className="text-left text-gray-500">
                    Members Email
                  </Label>
                  <Input
                    name="email"
                    id="email"
                    placeholder="ex - arnab.chatterjee@gmail.com"
                    className="col-span-3"
                    required
                  />
                </div>
                <Select
                  name="permission-data"
                  defaultValue={PermissionEnum.READ}
                >
                  <SelectTrigger className="w-min">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PermissionEnum.READ}>Read</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-accent text-accent-foreground hover:bg-white"
                  disabled={isAddMemberPending}
                >
                  {isAddMemberPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-2 py-3">
            <p className="text-gray-500">Members</p>
            <ul className="max-h-[16rem] px-2 overflow-y-scroll">
              {members?.length == 0 ? <Empty>No Members Present</Empty> : null}
              {members?.map(({ permissions, user_id }) => (
                <UserListItem
                  user_id={user_id}
                  permissions={permissions}
                  document_id={document_id}
                  setMembers={setMembers}
                />
              ))}
            </ul>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function UserListItem({
  user_id,
  permissions,
  setMembers,
  document_id,
}: {
  user_id: string;
  permissions: PermissionEnum[];
  document_id: string;
  setMembers: Dispatch<SetStateAction<UsersPermission[]>>;
}) {
  const [isDeleteMemberPending, startDeleteTransition] = useTransition();

  function deleteMember(e: FormEvent) {
    e.preventDefault();
    startDeleteTransition(async () => {
      const isDeleted = await deletePermissionAction({
        document_id,
        user_id,
        permissionLevel: permissions,
      });
      if (isDeleted)
        setMembers((members) => {
          return members.filter((member) => member.user_id != user_id);
        });
    });
  }

  return (
    <form onSubmit={deleteMember}>
      <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center mb-3 sm:mb-0">
          <GraidentAvatar id={user_id} />
          <span className="flex flex-col ml-3">
            <span className="text-sm font-medium text-gray-700">{user_id}</span>
            <p className="text-xs text-gray-500">
              {permissions
                .map((permission) => permission.toUpperCase())
                .join(", ")}
            </p>
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
          <Select>
            <SelectTrigger className="w-32 text-sm">Permissions</SelectTrigger>
            <SelectContent>
              <SelectItem value="read">Read</SelectItem>
              {/* Add other permission options as needed */}
            </SelectContent>
          </Select>
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon"
            className="ml-2"
          >
            {isDeleteMemberPending ? (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4 text-red-500" />
            )}
          </Button>
        </div>
      </li>
    </form>
  );
}