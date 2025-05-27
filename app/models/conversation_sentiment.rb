# == Schema Information
#
# Table name: conversation_sentiments
#
#  id         :bigint           not null, primary key
#  icon       :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class ConversationSentiment < ApplicationRecord
    validates :name, presence: true
end
