class AddSentimentFieldsToConversations < ActiveRecord::Migration[7.0]
  def change
    add_column :conversations, :score, :float
    add_column :conversations, :justification, :text
    add_column :conversations, :conversation_sentiment_id, :bigint
  end
end
