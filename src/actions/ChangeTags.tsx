import { Action, ActionPanel, Form, showToast, useNavigation } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { FC } from "react";
import { getAllTags, updateTags } from "../habitica";
import { HabiticaDaily, HabiticaTask } from "../types";

type ChangeTagsProps = {
  item: HabiticaTask | HabiticaDaily;
  refetchList: () => void;
};
export const ChangeTags: FC<ChangeTagsProps> = ({ item: item, refetchList }) => {
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
      <Form.TagPicker id="tags" title="Tags" defaultValue={item.tags}>
        {tags.map((tag) => (
          <Form.TagPicker.Item key={tag.id} value={tag.id} title={tag.name} />
        ))}
      </Form.TagPicker>
    </Form>
  );
};
