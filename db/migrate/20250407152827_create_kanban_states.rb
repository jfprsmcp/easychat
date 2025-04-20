class CreateKanbanStates < ActiveRecord::Migration[7.0]
  def change
    create_table :kanban_states do |t|
      t.string :name
      t.string :color
      t.integer :order
      t.references :account, null: false, foreign_key: { on_delete: :restrict }
      t.timestamps
    end
  end
end
