import { Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { retrieveTasks } from "./habitica";

const Command = () => {
  const { isLoading, data } = useCachedPromise(retrieveTasks, [], {
    initialData: [],
  });

  return (
    <List isLoading={isLoading} isShowingDetail>
      {data.map((task) => (
        <List.Item
          key={task.text}
          title={task.text}
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
export default Command;
