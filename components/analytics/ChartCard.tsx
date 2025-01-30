import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropsWithChildren } from "react";

export interface ChartCardProps {
  title?: string;
}

export default function ChartCard({
  children,
  title,
}: ChartCardProps & PropsWithChildren) {
  return (
    <Card className="shadow-none rounded-md w-full">
      {title ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="py-6">{children}</CardContent>
    </Card>
  );
}
