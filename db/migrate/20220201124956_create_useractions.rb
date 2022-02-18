class CreateUseractions < ActiveRecord::Migration[7.0]
  def change
    create_table :useractions do |t|
      t.string :user_id
      t.string :level
      t.string :action_category
      t.string :action_details

      t.timestamps
    end
  end
end
