import { Action, ActionPanel, Form, Icon, showHUD, showToast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { FC } from "react";
import { createTask, getAllTags } from "./habitica";
import { Tag, Todo } from "./types";

export default function Command() {
  const { isLoading, data } = useCachedPromise(getAllTags, [], {
    initialData: [],
  });
  async function handleCreate(todo: Todo) {
    try {
      await showToast({ title: "Creating a new Task...", message: todo.title });
      await createTask({
        text: todo.title,
        difficulty: todo.difficulty,
        type: todo.type,
        date: todo.date?.toISOString(),
        tags: todo.tags,
      });
      await showHUD(`Created a task: ${todo.title} ✅`);
    } catch (e) {
      if (e instanceof Error) {
        await showToast({ title: "Failed:", message: e.message });
      }
      throw e;
    }
  }

  return (
    <>
      <CreateTodoForm onCreate={handleCreate} tags={data} isLoading={isLoading} />
    </>
  );
}

type Props = {
  isLoading: boolean;
  tags: Tag[];
  onCreate: (todo: Todo) => void;
};

const CreateTodoForm: FC<Props> = ({ onCreate, tags, isLoading }) => {
  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Todo" onSubmit={onCreate} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Task Name" />
      <Form.Dropdown id="difficulty" title="Difficulty" defaultValue="Easy">
        <Form.Dropdown.Item value="Trivial" title="Trivial" icon={Icon.Stars} />
        <Form.Dropdown.Item value="Easy" title="Easy" icon={Icon.Stars} />
        <Form.Dropdown.Item value="Medium" title="Medium" icon={Icon.Stars} />
        <Form.Dropdown.Item value="Hard" title="Hard" icon={Icon.Stars} />
      </Form.Dropdown>
      <Form.Dropdown id="type" title="Type" defaultValue="todo">
        <Form.Dropdown.Item value="todo" title="To Do's" icon={Icon.Pencil} />
        <Form.Dropdown.Item value="daily" title="Dailies" icon={Icon.Alarm} />
        <Form.Dropdown.Item value="habit" title="Habits" icon={Icon.Clock} />
        <Form.Dropdown.Item value="reward" title="Rewards" icon={Icon.Coin} />
      </Form.Dropdown>
      <Form.DatePicker id="date" title="Date" />
      <Form.TagPicker id="tags" title="Tags">
        {tags.map((tag) => (
          <Form.TagPicker.Item key={tag.id} value={tag.id} title={tag.name} />
        ))}
      </Form.TagPicker>
    </Form>
  );
};
