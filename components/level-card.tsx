"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  completed?: boolean;
  locked?: boolean;
  onClick?: () => void;
  className?: string;
}

export function LevelCard({
  title,
  description,
  icon: Icon,
  completed,
  locked,
  onClick,
  className,
}: LevelCardProps) {
  return (
    <motion.div
      whileHover={!locked ? { scale: 1.02 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all",
          locked && "opacity-50 cursor-not-allowed",
          !locked && "hover:shadow-lg",
          completed && "border-2 border-green-500",
          className
        )}
        onClick={!locked ? onClick : undefined}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "rounded-xl p-3",
                completed && "bg-green-100 text-green-600",
                locked && "bg-gray-100 text-gray-400",
                !completed && !locked && "bg-rose-100 text-rose-600"
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{title}</h3>
                {completed && <Badge variant="default">Completed</Badge>}
                {locked && <Badge variant="secondary">Locked</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
