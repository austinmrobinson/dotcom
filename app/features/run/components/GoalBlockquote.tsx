import type { RaceGoal } from "../types";
import { Text } from "@/app/components/text";

interface GoalBlockquoteProps {
  goal: RaceGoal;
}

export function GoalBlockquote({ goal }: GoalBlockquoteProps) {
  return (
    <figure className="border-l-2 border-foreground/20 pl-4 py-1">
      {goal.title && (
        <Text as="figcaption" contrast="high" weight="medium" className="mb-2">
          {goal.title}
        </Text>
      )}
      <blockquote>
        <Text className="text-pretty italic">{goal.description}</Text>
      </blockquote>
    </figure>
  );
}
