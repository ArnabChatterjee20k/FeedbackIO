import React from "react";
import {
  Controller,
  useFieldArray,
  Path,
  FieldValues,
  Control,
  ArrayPath,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import { spaceFormSchema, SpaceFormType } from "../schema";
import { useProjectContext } from "../context/ProjectContextProvider";
import landingPageSchema from "../schema/landing-page.schema";

export type FieldPath<TFieldValues extends FieldValues> = Path<TFieldValues>;
export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "longText" | "toggle" | "avatar" | "array";
  arrayConfig?: {
    maxItems: number;
    itemLabel: string;
  };
  path: FieldPath<SpaceFormType>;
};

type FormBuilderProps = {
  config: FieldConfig[];
  page: keyof SpaceFormType;
};

export default function FormBuilder({ config, page }: FormBuilderProps) {
  const {
    methods: { control, setValue },
    spaceState,
    setSpaceState,
  } = useProjectContext();

  const renderField = (field: FieldConfig, index?: number) => {
    switch (field.type) {
      case "text":
      case "longText":
        return (
          <Controller
            name={field.path}
            control={control}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, error },
            }) => (
              <div className="mb-4">
                <Label htmlFor={name}>{field.label}</Label>
                {field.type === "longText" ? (
                  <Textarea
                    id={name}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      setSpaceState((prev) => ({
                        ...prev,
                        [page]: {
                          ...prev[page],
                          [name.split(".")[1]]: e.target.value,
                        },
                      }));
                      onChange(e);
                    }}
                    value={value as string}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    id={name}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      setSpaceState((prev) => ({
                        ...prev,
                        [page]: {
                          ...prev[page],
                          [name.split(".")[1]]: e.target.value,
                        },
                      }));
                      onChange(e);
                    }}
                    value={value as string}
                    className="mt-1"
                  />
                )}
                {invalid && error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </div>
            )}
          />
        );
      case "toggle":
        return (
          <Controller
            control={control}
            name={field.path}
            render={({
              field: { name, value, ref },
              fieldState: { invalid, error },
            }) => (
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id={name}
                  name={name}
                  ref={ref}
                  checked={value as boolean}
                  onCheckedChange={(checked) => {
                    setValue(name, checked);
                    setSpaceState((prev) => {
                      return {
                        ...prev,
                        [page]: {
                          ...prev[page],
                          [name.split(".")[1]]: checked,
                        },
                      };
                    });
                  }}
                />
                <Label htmlFor={name}>{field.label}</Label>
                {invalid && error && (
                  <p className="text-red-500 text-sm">{error.message}</p>
                )}
              </div>
            )}
          />
        );
      case "avatar":
        return (
          <Controller
            control={control}
            name={field.path}
            render={({
              field: { onChange, value, name, ref },
              fieldState: { invalid, error },
            }) => (
              <div className="mb-4">
                <Label htmlFor={name}>{field.label}</Label>
                <div className="flex items-center space-x-4 mt-1">
                  <Avatar>
                    <AvatarImage src={value as string} alt="Avatar" />
                    <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
                  <Input
                    id={name}
                    name={name}
                    type="file"
                    ref={ref}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSpaceState((prev) => ({
                          ...prev,
                          [page]: {
                            ...prev[page],
                            [name.split(".")[1]]: URL.createObjectURL(file),
                          },
                        }));
                        onChange(file)
                      }
                    }}
                    accept="image/*"
                  />
                </div>
                {invalid && error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </div>
            )}
          />
        );
      case "array":
        if (!field.arrayConfig) return null;
        return (
          <ArrayField
            key={field.path}
            name={field.path as never}
            label={field.label}
            maxItems={field.arrayConfig.maxItems}
            itemLabel={field.arrayConfig.itemLabel}
            page={page}
            control={control}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {config.map((field) => (
        <React.Fragment key={field.path}>{renderField(field)}</React.Fragment>
      ))}
    </div>
  );
}

interface ArrayFieldProps<TFieldValues extends FieldValues> {
  name: ArrayPath<TFieldValues>;
  label: string;
  maxItems: number;
  itemLabel: string;
  control: Control<TFieldValues>;
  page: keyof SpaceFormType;
}

function ArrayField<TFieldValues extends FieldValues>({
  name,
  label,
  maxItems,
  itemLabel,
  control,
  page,
}: ArrayFieldProps<TFieldValues>) {
  const { setSpaceState } = useProjectContext();

  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  const handleChange = (index: number, value: string) => {
    setSpaceState((prev) => {
      const newState = { ...prev };
      const fieldPath = name.split(".");
      const pageData = newState[page] as Record<string, any>;
      const fieldData = pageData[fieldPath[1]] as string[];
      fieldData[index] = value;
      return newState;
    });
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <GripVertical className="cursor-move" size={20} />

          <Controller
            // assigning name.index format so that values remain unique
            // if only name, it will be same for all inputs and all inputs will have all the inputs
            name={`${name}.${index}` as Path<TFieldValues>}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value as string}
                onChange={(e) => {
                  onChange(e);
                  handleChange(index, e.target.value);
                }}
                placeholder={`${itemLabel} ${index + 1}`}
              />
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setSpaceState((prev) => {
                const newState = { ...prev };
                const fieldPath = name.split(".");
                const pageData = newState[page] as Record<string, any>; // eg -> landingPage
                const fieldData = pageData[fieldPath[1]] as string[]; // eg -> questions field of landingPage
                const prevData = fieldData.slice(0, index);
                const nextData = fieldData.slice(index + 1);
                const newFieldData = [...prevData, ...nextData];
                return {
                  ...prev,
                  [page]: { ...prev[page], [fieldPath[1]]: newFieldData },
                };
              });
              remove(index);
            }}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      ))}

      {fields.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            append("Next question??" as any);
            setSpaceState((prev) => {
              const newState = { ...prev };
              const fieldPath = name.split(".");
              const pageData = newState[page] as Record<string, any>;
              const fieldData = [
                ...(pageData[fieldPath[1]] as string[]),
                "Next question??",
              ];
              return {
                ...prev,
                [page]: { ...prev[page], [fieldPath[1]]: fieldData },
              };
            });
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add one (up to {maxItems})
        </Button>
      )}
    </div>
  );
}
