class AddConversationsStateIdToConversations < ActiveRecord::Migration[7.0]
  def change
    add_column :conversations, :conversations_state_id, :integer
  end
end
