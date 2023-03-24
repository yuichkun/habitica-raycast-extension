import { List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { retrieveTasks } from "./habitica";

const Command = () => {
  const { isLoading, data } = useCachedPromise(retrieveTasks, [], {
    initialData: [],
  });

  return (
    <List isLoading={isLoading}>
      {data.map((task) => (
        <List.Item title={task.text} />
      ))}
    </List>
  );
};

export default Command;
