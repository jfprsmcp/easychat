class AddInitAtAndFinishAtToAgentBots < ActiveRecord::Migration[7.0]
  def change
    add_column :agent_bots, :init_at, :string, default: ""
    add_column :agent_bots, :finish_at, :string, default: ""
  end
end
