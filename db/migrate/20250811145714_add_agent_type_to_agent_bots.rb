class AddAgentTypeToAgentBots < ActiveRecord::Migration[7.0]
  def change
    add_column :agent_bots, :agent_type, :integer, default:0
  end
end
