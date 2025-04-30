import { frontendURL } from '../../../../helper/URLHelper';

const conversations = accountId => ({
  parentNav: 'conversations',
  routes: [
    'home',
    'inbox_dashboard',
    'inbox_conversation',
    'conversation_through_inbox',
    'notifications_dashboard',
    'label_conversations',
    'conversations_through_label',
    'team_conversations',
    'conversations_through_team',
    'conversation_mentions',
    'conversation_through_mentions',
    'conversation_participating',
    'conversation_through_participating',
    'folder_conversations',
    'conversations_through_folders',
    'conversation_unattended',
    'conversation_through_unattended',
    'board_conversations',
    'inbox_board_conversation'
  ],
  menuItems: [
    {
      icon: 'chat',
      label: 'ALL_CONVERSATIONS',
      key: 'conversations',
      toState: frontendURL(`accounts/${accountId}/dashboard`),
      toolTip: 'Conversation from all subscribed inboxes',
      toStateName: 'home',
    },
    {
      icon: 'mention',
      label: 'MENTIONED_CONVERSATIONS',
      key: 'conversation_mentions',
      toState: frontendURL(`accounts/${accountId}/mentions/conversations`),
      toStateName: 'conversation_mentions',
    },
    {
      icon: 'mail-unread',
      label: 'UNATTENDED_CONVERSATIONS',
      key: 'conversation_unattended',
      toState: frontendURL(`accounts/${accountId}/unattended/conversations`),
      toStateName: 'conversation_unattended',
    },
    {
      icon: 'board',
      label: 'BOARD',
      key: 'board_conversations',
      toState: frontendURL(`accounts/${accountId}/board`),
      toStateName: 'board_conversations',
    },
  ],
});

export default conversations;
