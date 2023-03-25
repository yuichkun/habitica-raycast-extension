import { Color, Icon, List } from "@raycast/api";
import { FC } from "react";
import { HabiticaDaily } from "./types";

type Props = {
  daily: HabiticaDaily;
};

export const DailyLineItem: FC<Props> = ({ daily }) => {
  return (
    <List.Item
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
