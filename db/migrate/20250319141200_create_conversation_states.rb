class CreateConversationStates < ActiveRecord::Migration[7.0]
  def change
    create_table :conversation_states do |t|
      t.string :name
      t.timestamps
    end
  end
end
