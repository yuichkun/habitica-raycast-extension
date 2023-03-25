import { Action, ActionPanel, Form, Icon, showToast, useNavigation } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { FC } from "react";
import { completeTask, deleteTask, getAllTags, updateDueDate, updateTags } from "../habitica";
import { playSound } from "../sound";
import { HabiticaDaily, HabiticaTask } from "../types";
type Props = {
  item: HabiticaTask | HabiticaDaily;
  refetchList: () => void;
};

function isHabiticaTask(item: HabiticaTask | HabiticaDaily): item is HabiticaTask {
  if ("date" in item) {
    return true;
  } else {
    return false;
  }
}

export const HabiticaEditMenu: FC<Props> = ({ item, refetchList }) => {
  const handleComplete = async (task: HabiticaTask | HabiticaDaily) => {
    try {
      await showToast({ title: "Completing Task...", message: task.text });
      await completeTask(task.id);
      refetchList();
      if (isHabiticaTask(item)) {
        playSound("todo.mp3");
      } else {
        // TODO: play the other file
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
      <Action
        title="Mark as Complete"
        icon={Icon.CheckCircle}
        shortcut={{
          key: "c",
          modifiers: ["cmd", "shift"],
        }}
        onAction={() => handleComplete(item)}
      />
    </ActionPanel.Submenu>
  );
};

type ChangeTagsProps = {
  item: HabiticaTask | HabiticaDaily;
  refetchList: () => void;
};
const ChangeTags: FC<ChangeTagsProps> = ({ item: item, refetchList }) => {
  const { pop } = useNavigation();
  const { isLoading, data: tags } = useCachedPromise(getAllTags, [], {
    initialData: [],
  });

  const handleSubmit = async ({ tags }: { tags: string[] }) => {
    try {
      await showToast({
        title: "Updating tags of task",
        message: item.text,
      });
      await updateTags(item.id, tags);
      refetchList();
      pop();
    } catch (e) {
      if (e instanceof Error) {
        await showToast({ title: "Failed:", message: e.message });
      }
      throw e;
    }
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Change Tags" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TagPicker id="tags" title="Tags">
        {tags.map((tag) => (
          <Form.TagPicker.Item key={tag.id} value={tag.id} title={tag.name} />
        ))}
      </Form.TagPicker>
    </Form>
  );
};
