"use client";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import {
  useForm,
  FormProvider,
  UseFormReturn,
  useController,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SpaceFormType, getDefaults, spaceFormSchema } from "../schema";
import landingPageSchema from "../schema/landing-page.schema";
import { z } from "zod";

export interface ISpace {
  methods: UseFormReturn<SpaceFormType>;
  spaceState: SpaceFormType;
  setSpaceState: React.Dispatch<React.SetStateAction<SpaceFormType>>;
}

const ProjectContext = createContext<ISpace | null>(null);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProjectContext must be used under ProjectContext");
  return context;
};

const defaultValues = getDefaults(spaceFormSchema);
const landingPageDefaultValues = getDefaults(
  z.ZodObject.create(landingPageSchema.innerType().shape)
);
export function ProjectContextProvider({
  children,
  initialSpaceData,
}: PropsWithChildren & { initialSpaceData?: Partial<SpaceFormType> }) {
  const [spaceState, setSpaceState] = useState<SpaceFormType>({
    ...defaultValues,
    landingPageSchema: landingPageDefaultValues,
  });
  const methods = useForm<SpaceFormType>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: {
      ...defaultValues,
      landingPageSchema: landingPageDefaultValues,
    },
  });

  return (
    <ProjectContext.Provider value={{ methods, spaceState, setSpaceState }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ProjectContext.Provider>
  );
}
