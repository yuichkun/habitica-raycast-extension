import { ActionPanel, Action, showToast, Icon } from "@raycast/api";
import { FC } from "react";
import { completeTask, deleteTask, updateDueDate } from "../habitica";
import { playSound } from "../sound";
import { HabiticaTask } from "../types";
type Props = {
  task: HabiticaTask;
  refetchList: () => void;
};

export const HabiticaEditMenu: FC<Props> = ({ task, refetchList }) => {
  const handleComplete = async (task: HabiticaTask) => {
    try {
      await showToast({ title: "Completing Task...", message: task.text });
      await completeTask(task.id);
      refetchList();
      playSound("todo.mp3");
    } catch (e) {
      if (e instanceof Error) {
        await showToast({ title: "Failed:", message: e.message });
      }
      throw e;
    }
  };
  const handleUpdateDate = async (task: HabiticaTask, date: Date | null) => {
    try {
      await showToast({
        title: "Updating Task Due Date",
        message: `by ${date?.toLocaleDateString("ja-JP") ?? "No Date"}`,
      });
      await updateDueDate(task.id, date);
      refetchList();
    } catch (e) {
      if (e instanceof Error) {
        await showToast({ title: "Failed:", message: e.message });
      }
      throw e;
    }
  };
  const handleDelete = async (task: HabiticaTask) => {
    try {
      await showToast({
        title: "Deleting the task",
        message: task.text,
      });
      await deleteTask(task.id);
      // await updateDueDate(task.id);
      refetchList();
    } catch (e) {
      if (e instanceof Error) {
        await showToast({ title: "Failed:", message: e.message });
      }
      throw e;
    }
  };
  return (
    <ActionPanel.Submenu title="Edit">
      <Action.PickDate
        title="Set Date"
        shortcut={{
          key: "d",
          modifiers: ["cmd", "shift"],
        }}
        onChange={(date) => {
          handleUpdateDate(task, date);
        }}
      />
      <Action
        title="Delete Task"
        icon={Icon.DeleteDocument}
        shortcut={{
          key: "delete",
          modifiers: ["cmd", "shift"],
        }}
        onAction={() => handleDelete(task)}
      />
      <Action
        title="Mark as Complete"
        icon={Icon.CheckCircle}
        shortcut={{
          key: "c",
          modifiers: ["cmd", "shift"],
        }}
        onAction={() => handleComplete(task)}
      />
    </ActionPanel.Submenu>
  );
};
