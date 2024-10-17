import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, GripVertical } from 'lucide-react'

export type FieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'longText' | 'toggle' | 'avatar' | 'array';
  arrayConfig?: {
    maxItems: number;
    itemLabel: string;
  };
};

type FormBuilderProps = {
  config: FieldConfig[];
  onSubmit: (data: any) => void;
};

export default function FormBuilder({ config, onSubmit }: FormBuilderProps) {
  const { control, handleSubmit } = useForm();
  const [formState, setFormState] = useState<Record<string, any>>({});

  const renderField = (field: FieldConfig, index?: number) => {
    switch (field.type) {
      case 'text':
      case 'longText':
        return (
          <Controller
            control={control}
            name={field.name}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, error },
            }) => (
              <div className="mb-4">
                <Label htmlFor={name}>{field.label}</Label>
                {field.type === 'longText' ? (
                  <Textarea
                    id={name}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, [name]: e.target.value }));
                      onChange(e);
                    }}
                    value={value}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    id={name}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, [name]: e.target.value }));
                      onChange(e);
                    }}
                    value={value}
                    className="mt-1"
                  />
                )}
                {invalid && error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
        );
      case 'toggle':
        return (
          <Controller
            control={control}
            name={field.name}
            render={({
              field: { onChange, value, name, ref },
              fieldState: { invalid, error },
            }) => (
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id={name}
                  name={name}
                  ref={ref}
                  checked={value}
                  onCheckedChange={(checked) => {
                    setFormState((prev) => ({ ...prev, [name]: checked }));
                    onChange(checked);
                  }}
                />
                <Label htmlFor={name}>{field.label}</Label>
                {invalid && error && <p className="text-red-500 text-sm">{error.message}</p>}
              </div>
            )}
          />
        );
      case 'avatar':
        return (
          <Controller
            control={control}
            name={field.name}
            render={({
              field: { onChange, value, name, ref },
              fieldState: { invalid, error },
            }) => (
              <div className="mb-4">
                <Label htmlFor={name}>{field.label}</Label>
                <div className="flex items-center space-x-4 mt-1">
                  <Avatar>
                    <AvatarImage src={value} alt="Avatar" />
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
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormState((prev) => ({ ...prev, [name]: reader.result }));
                          onChange(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    accept="image/*"
                  />
                </div>
                {invalid && error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
        );
      case 'array':
        if (!field.arrayConfig) return null;
        return (
          <ArrayField
            key={field.name}
            name={field.name}
            label={field.label}
            control={control}
            maxItems={field.arrayConfig.maxItems}
            itemLabel={field.arrayConfig.itemLabel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {config.map((field) => (
        <React.Fragment key={field.name}>
          {renderField(field)}
        </React.Fragment>
      ))}
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}

function ArrayField({ name, label, control, maxItems, itemLabel }: {
  name: string;
  label: string;
  control: any;
  maxItems: number;
  itemLabel: string;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <GripVertical className="cursor-move" size={20} />
          <Controller
            name={`${name}.${index}.value`}
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={`${itemLabel} ${index + 1}`} />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
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
          onClick={() => append({ value: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add one (up to {maxItems})
        </Button>
      )}
    </div>
  );
}