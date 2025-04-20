class AddKanbanStatesIdToConversations < ActiveRecord::Migration[7.0]
  def change
    add_column :conversations, :kanban_states_id, :integer, null: true
  end
end
