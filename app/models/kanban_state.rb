# == Schema Information
#
# Table name: kanban_states
#
#  id         :bigint           not null, primary key
#  color      :string
#  name       :string
#  order      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  account_id :bigint           not null
#
# Indexes
#
#  index_kanban_states_on_account_id  (account_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id) ON DELETE => restrict
#
class KanbanState < ApplicationRecord
  belongs_to :account
  validates :name, presence: true
  validates :color, presence: true
  validates :order, presence: true
  validates :account_id, presence: true
  attr_accessor :count

  def self.update_order_batch(update)
    cases = update.map { |item| "WHEN #{item[:id]} THEN #{item[:order]}" }.join("\n")
    ids   = update.map { |item| item[:id] }.join(", ")
    sql = <<~SQL
      UPDATE kanban_states
      SET "order" = CASE id
        #{cases}
        ELSE "order"
      END
      WHERE id IN (#{ids});
    SQL
    connection.execute(sql)
  end

  def self.get_state_order(account_id)
    sql = <<-SQL
        SELECT kanban_states.*, COUNT(conversations.id) AS count
        FROM conversations
        FULL JOIN kanban_states
          ON kanban_states.id = conversations.kanban_states_id
          AND conversations.account_id = #{account_id}
        GROUP BY kanban_states.id
        ORDER BY kanban_states.order
    SQL
    connection.execute(sql).to_a
  end
end
