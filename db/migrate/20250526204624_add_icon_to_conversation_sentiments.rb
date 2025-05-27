class AddIconToConversationSentiments < ActiveRecord::Migration[7.0]
  def change
    add_column :conversation_sentiments, :icon, :string
  end
end
