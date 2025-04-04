class AddAccountIdColorDescriptionToConversationStates < ActiveRecord::Migration[7.0]
  def change
    add_column :conversation_states, :account_id, :integer
    add_column :conversation_states, :color, :string
    add_column :conversation_states, :description, :text
  end
end
