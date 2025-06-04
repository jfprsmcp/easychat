class AddActiveAgentBotToConversations < ActiveRecord::Migration[7.0]
  def change
    add_column :conversations, :active_agent_bot, :boolean, default: true, null: false
  end
end