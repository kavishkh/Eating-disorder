
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardContainerProps {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  children: ReactNode;
  variant?: "default" | "gradient" | "glass" | "dark-gradient";
}

export function CardContainer({
  title,
  description,
  className,
  contentClassName,
  headerClassName,
  children,
  variant = "default",
}: CardContainerProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all",
        variant === "gradient" && "card-gradient",
        variant === "glass" && "glass-card",
        variant === "dark-gradient" && "dark-gradient",
        className
      )}
    >
      {(title || description) && (
        <CardHeader className={cn("pb-3", headerClassName)}>
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
