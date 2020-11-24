import Action, { CommonGenericResponseType } from "@BrainlyAction";

type Props = {
  message: string;
  userId?: number;
  conversationId?: number;
};

type UsersDataInSendMessageResponseType = {
  avatar?: { "64": string; "100": string };
  avatars?: { "64": string; "100": string };
  gender?: number;
  id?: number;
  nick?: string;
  ranks: {
    color: string;
    names: string[];
    count: number;
  };
  ranks_ids?: number[];
};

export default async ({
  userId,
  conversationId,
  message,
}: Props): Promise<
  CommonGenericResponseType<{
    data: {
      content: string;
      conversation_id: number;
      created: string;
      id: number;
      is_harmful: boolean;
      user_id: number;
    };
    users_data: UsersDataInSendMessageResponseType[];
  }>
> => {
  if (!userId && !conversationId) return null;

  let validConversationId = conversationId;

  if (userId && !conversationId) {
    const resConversation = await new Action().GetConversationID(userId);

    if (!resConversation || !resConversation.success)
      return Promise.reject(resConversation);

    validConversationId = resConversation.data.conversation_id;
  }

  return new Action().Legacy().api_messages().send().POST({
    content: message,
    conversation_id: validConversationId,
  });
};
