import { Action, ActionPanel, Color, Icon, List, showHUD, showToast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { completeTask, retrieveTasks } from "./habitica";
import { HabiticaTask } from "./types";

const Command = () => {
  const { isLoading, data } = useCachedPromise(retrieveTasks, [], {
    initialData: [],
  });

  const handleComplete = async (task: HabiticaTask) => {
    try {
      await showToast({ title: "Completing Task...", message: task.text });
      await completeTask(task.id);
      await showHUD(`Completed a task: ${task.text} ✅`);
    } catch (e) {
      if (e instanceof Error) {
        await showToast({ title: "Failed:", message: e.message });
      }
      throw e;
    }
  };

  return (
    <List isLoading={isLoading}>
      {data.sort(sortByDate).map((task) => (
        <List.Item
          key={task.text}
          title={task.text}
          actions={
            <ActionPanel title="Habitica">
              <ActionPanel.Submenu title="Edit">
                <Action
                  title="Mark as Complete"
                  shortcut={{
                    key: "c",
                    modifiers: ["cmd", "shift"],
                  }}
                  onAction={() => handleComplete(task)}
                />
              </ActionPanel.Submenu>
            </ActionPanel>
          }
          accessories={[
            {
              date: task.date
                ? {
                    color: priorityToColor(determinePriority(task.date)),
                    value: new Date(task.date),
                  }
                : null,
            },
          ]}
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label
                    title="Due Date"
                    text={task.date ?? "No Due Date"}
                    icon={Icon.Calendar}
                  />
                  <List.Item.Detail.Metadata.Separator />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      ))}
    </List>
  );
};

function sortByDate(a: HabiticaTask, b: HabiticaTask) {
  if (a.date && b.date) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  } else if (a.date) {
    return -1;
  } else if (b.date) {
    return 1;
  } else {
    return 0;
  }
}

type Priority = "high" | "medium" | "low";

function determinePriority(date: string): Priority {
  const now = new Date();
  const targetDate = new Date(date);

  if (targetDate < now) {
    return "high";
  }

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const daysDifference = Math.floor((targetDate.getTime() - now.getTime()) / oneDayInMilliseconds);

  if (daysDifference <= 1) {
    return "high";
  } else if (daysDifference <= 3) {
    return "medium";
  } else {
    return "low";
  }
}

function priorityToColor(priority: Priority) {
  switch (priority) {
    case "high":
      return Color.Red;
    case "medium":
      return Color.Orange;
    case "low":
      return Color.PrimaryText;
  }
}

export default Command;
