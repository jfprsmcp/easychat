class AddAdditionalAttributesToCampaigns < ActiveRecord::Migration[7.0]
  def change
    add_column :campaigns, :additional_attributes, :jsonb,  default: {}, null: false
  end
end
