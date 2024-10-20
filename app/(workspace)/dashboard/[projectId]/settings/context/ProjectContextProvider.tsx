"use client";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import {
  useForm,
  FormProvider,
  UseFormReturn,
  useController,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SpaceFormType,
  defaultSpacePageValues,
  getDefaults,
  spaceFormSchema,
} from "../schema";
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

export function ProjectContextProvider({
  children,
  initialSpaceData,
}: PropsWithChildren & { initialSpaceData?: Partial<SpaceFormType> }) {
  const [spaceState, setSpaceState] = useState<SpaceFormType>(
    defaultSpacePageValues
  );
  const methods = useForm<SpaceFormType>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: defaultSpacePageValues,
  });

  return (
    <ProjectContext.Provider value={{ methods, spaceState, setSpaceState }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ProjectContext.Provider>
  );
}
