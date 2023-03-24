import { Action, ActionPanel, Form, Icon, showHUD, showToast } from "@raycast/api";
import { FC } from "react";
import { createTask } from "./habitica";
import { Todo } from "./types";

export default function Command() {
  async function handleCreate(todo: Todo) {
    try {
      await showToast({ title: "Creating a new Task...", message: todo.title });
      await createTask({
        text: todo.title,
        type: todo.type,
        date: todo.date?.toISOString(),
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
      <CreateTodoForm onCreate={handleCreate} />
    </>
  );
}

type Props = {
  onCreate: (todo: Todo) => void;
};

const CreateTodoForm: FC<Props> = ({ onCreate }) => {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Todo" onSubmit={onCreate} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Task Name" />
      <Form.Dropdown id="type" title="Type" defaultValue="todo">
        <Form.Dropdown.Item value="todo" title="To Do's" icon={Icon.Pencil} />
        <Form.Dropdown.Item value="daily" title="Dailies" icon={Icon.Alarm} />
        <Form.Dropdown.Item value="habit" title="Habits" icon={Icon.Clock} />
        <Form.Dropdown.Item value="reward" title="Rewards" icon={Icon.Coin} />
      </Form.Dropdown>
      <Form.DatePicker id="date" title="Date" />
    </Form>
  );
};
