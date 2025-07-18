class AddPromptToAgentBots < ActiveRecord::Migration[7.0]
  def change
    add_column :agent_bots, :prompt, :text
  end
end
