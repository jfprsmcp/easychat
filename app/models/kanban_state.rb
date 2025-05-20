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
      SELECT *
      FROM (
        SELECT ks."id",ks."name",ks."color",ks."order",ks."account_id",ks."created_at",ks."updated_at",COUNT(c.id) AS count
        FROM kanban_states ks
        LEFT JOIN conversations c ON c.kanban_states_id = ks.id
        WHERE ks.account_id = ?
        GROUP by ks."id", ks."name",ks."color",ks."order",ks."account_id",ks."created_at",ks."updated_at"
        UNION ALL
        SELECT NULL, NULL, NULL, NULL,NULL,NULL,NULL, COUNT(c.id) AS count
        FROM conversations c
        WHERE c.kanban_states_id IS NULL AND c.account_id = ?
      ) as kanban_group
	    order by kanban_group.order
    SQL
    sanitized_sql = ActiveRecord::Base.send(:sanitize_sql_array, [sql, account_id, account_id])
    ActiveRecord::Base.connection.execute(sanitized_sql).to_a
  end
end
