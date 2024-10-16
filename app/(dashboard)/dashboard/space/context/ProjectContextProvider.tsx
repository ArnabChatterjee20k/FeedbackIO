"use client";
import { createContext, PropsWithChildren, useContext } from "react";

export interface ISpace {
    
}

const ProjectContext = createContext<ISpace | null>(null);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProjectContext must be used under ProjectContext");
  return context;
};

export function ProjectContextProvider({ children }: PropsWithChildren) {
  return <ProjectContext.Provider>{children}</ProjectContext.Provider>;
}
