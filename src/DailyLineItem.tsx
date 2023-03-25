import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { FC } from "react";
import { HabiticaEditMenu } from "./actions/edit";
import { HabiticaDaily } from "./types";

type Props = {
  daily: HabiticaDaily;
  refetchList: () => void;
};

export const DailyLineItem: FC<Props> = ({ daily, refetchList }) => {
  return (
    <List.Item
      actions={
        <ActionPanel title="Daily">
          <HabiticaEditMenu item={daily} refetchList={refetchList} />
        </ActionPanel>
      }
      key={daily.id}
      title={daily.text}
      accessories={[
        {
          text: {
            color: daily.completed ? Color.Green : Color.SecondaryText,
            value: daily.completed ? "Done" : "Ongoing",
          },
        },
      ]}
    />
  );
};
