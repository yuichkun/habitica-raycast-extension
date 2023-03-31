import { Action, ActionPanel, Icon, showToast } from "@raycast/api";
import { FC } from "react";
import { getConfig } from "../config";
import { completeTask, deleteTask, updateDueDate } from "../habitica";
import { playSound } from "../sound";
import { HabiticaDaily, HabiticaTask } from "../types";
import { ChangeTags } from "./ChangeTags";
import { RenameTask } from "./RenameTask";
type Props = {
  item: HabiticaTask | HabiticaDaily;
  refetchList: () => void;
};

function isHabiticaTask(item: HabiticaTask | HabiticaDaily): item is HabiticaTask {
  if (item.type === "todo") return true;
  return false;
}

export const HabiticaEditMenu: FC<Props> = ({ item, refetchList }) => {
  const { language } = getConfig();
  const handleComplete = async (task: HabiticaTask | HabiticaDaily) => {
    try {
      await showToast({ title: "Completing Task...", message: task.text });
      await completeTask(task.id);
      refetchList();
      if (isHabiticaTask(item)) {
        playSound("todo.mp3");
      } else {
        playSound("daily.mp3");
      }
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
        message: `by ${date?.toLocaleDateString(language) ?? "No Date"}`,
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
  const handleDelete = async (task: HabiticaTask | HabiticaDaily) => {
    try {
      await showToast({
        title: "Deleting the task",
        message: task.text,
      });
      await deleteTask(task.id);
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
      <Action
        title="Mark as Complete"
        icon={Icon.CheckCircle}
        shortcut={{
          key: "c",
          modifiers: ["cmd", "shift"],
        }}
        onAction={() => handleComplete(item)}
      />
      {isHabiticaTask(item) && (
        <Action.PickDate
          title="Set Date"
          shortcut={{
            key: "d",
            modifiers: ["cmd", "shift"],
          }}
          onChange={(date) => {
            handleUpdateDate(item, date);
          }}
        />
      )}
      <Action.Push
        title="Rename Task"
        icon={Icon.Tag}
        shortcut={{
          key: "r",
          modifiers: ["cmd", "shift"],
        }}
        target={<RenameTask item={item} refetchList={refetchList} />}
      />
      <Action.Push
        title="Change Tags"
        icon={Icon.Tag}
        shortcut={{
          key: "t",
          modifiers: ["cmd", "shift"],
        }}
        target={<ChangeTags item={item} refetchList={refetchList} />}
      />
      <Action
        title="Delete Task"
        icon={Icon.DeleteDocument}
        shortcut={{
          key: "delete",
          modifiers: ["cmd", "shift"],
        }}
        onAction={() => handleDelete(item)}
      />
    </ActionPanel.Submenu>
  );
};
