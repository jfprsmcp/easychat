# == Schema Information
#
# Table name: conversation_states
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class ConversationState < ApplicationRecord
    validates :name, presence: true, uniqueness: true
end
