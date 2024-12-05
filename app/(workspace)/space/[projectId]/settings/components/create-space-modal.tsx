"use client";
import { ChangeEvent, PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import createSpaceAction from "../actions/edit-space.action";
import { useFormState } from "react-dom";
import createDefaultSpaceAction from "../actions/create-space.action";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function SpaceModal({ children }: PropsWithChildren) {
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, createSpaceFormAction] = useFormState(
    createDefaultSpaceAction,
    { errors: [] }
  );
  console.log({errors})

  if (errors.errors.length) {
    errors.errors.map((message) => {
      toast.error("Error happend while creating your space", {
        description: message,
        dismissible: true,
        duration: 10000,
      });
    });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      setLogo(e.target.files[0]);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Space</DialogTitle>
          <DialogDescription>
            These are the basic information required for the space
          </DialogDescription>
        </DialogHeader>
        <form action={createSpaceFormAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Product Name
              </Label>
              <Input
                name="name"
                id="name"
                placeholder="Ex- Hello world"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Message to reviewers
              </Label>
              <Input
                name="message"
                id="message"
                placeholder="ex- welcome!"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <Avatar>
              <AvatarImage
                alt="Avatar"
                src={logo ? URL.createObjectURL(logo) : ""}
              />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <Input name="logo" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving..." : "Save changes"}
    </Button>
  );
}
