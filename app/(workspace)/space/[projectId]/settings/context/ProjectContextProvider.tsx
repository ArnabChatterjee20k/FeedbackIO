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
import { SpaceFormState } from "../actions/edit-space.action";

export interface ISpace {
  methods: UseFormReturn<SpaceFormType>;
  spaceState: SpaceFormType;
  setSpaceState: React.Dispatch<React.SetStateAction<SpaceFormType>>;
  getChangedData:(payload:SpaceFormType)=>Record<keyof SpaceFormType,object>
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
    initialSpaceData as SpaceFormType
  );
  const methods = useForm<SpaceFormType>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: initialSpaceData,
  });

  function getChangedData(payload:SpaceFormType){
    const finalResult:Record<keyof SpaceFormType,object> = {
      landingPageSchema:{},
      notificationSchema:{},
      settingsSchema:{},
      thankYouPageSchema:{}
    }
    if(!initialSpaceData) return finalResult
    console.log(payload.landingPageSchema.logo)
    Object.keys(finalResult).forEach((schema) => {
      Object.entries(schema in initialSpaceData && initialSpaceData[schema as keyof SpaceFormType] as SpaceFormType[keyof SpaceFormType])
        .forEach(([key, value]) => {
          // @ts-ignore
          if (key in payload[schema] && payload[schema][key] !== value) {
            // @ts-ignore
            finalResult[schema][key] = payload[schema][key] 
          }
        });
    });
    return finalResult
  }

  return (
    <ProjectContext.Provider value={{ methods, spaceState, setSpaceState,getChangedData }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ProjectContext.Provider>
  );
}
