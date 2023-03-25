import { Action, ActionPanel, Form, Icon, showToast, useNavigation } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { FC } from "react";
import { completeTask, deleteTask, getAllTags, updateDueDate, updateTags } from "../habitica";
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
      <Action.Push
        title="Change Tags"
        icon={Icon.Tag}
        shortcut={{
          key: "t",
          modifiers: ["cmd", "shift"],
        }}
        target={<ChangeTags task={task} />}
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

type ChangeTagsProps = {
  task: HabiticaTask;
};
const ChangeTags: FC<ChangeTagsProps> = ({ task }) => {
  const { pop } = useNavigation();
  const { isLoading, data: tags } = useCachedPromise(getAllTags, [], {
    initialData: [],
  });

  const handleSubmit = async ({ tags }: { tags: string[] }) => {
    try {
      await showToast({
        title: "Updating tags of task",
        message: task.text,
      });
      await updateTags(task.id, tags);
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
