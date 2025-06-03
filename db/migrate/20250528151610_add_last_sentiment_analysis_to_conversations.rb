class AddLastSentimentAnalysisToConversations < ActiveRecord::Migration[7.0]
  def change
    add_column :conversations, :last_sentiment_analysis, :datetime
  end
end
