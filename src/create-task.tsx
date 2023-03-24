import { Action, ActionPanel, Form, showHUD, showToast } from "@raycast/api";
import { FC } from "react";
import { Todo } from "./types";

export default function Command() {
  async function handleCreate(todo: Todo) {
    await showToast({ title: "Creating a new Task...", message: todo.title });
    // TODO: create task on habitica
    await showHUD(`Created a task: ${todo.title} ✅`);
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
    </Form>
  );
};
