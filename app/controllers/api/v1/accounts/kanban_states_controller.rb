class Api::V1::Accounts::KanbanStatesController < Api::V1::Accounts::BaseController
  before_action :current_account
  before_action :fetch_kanban_state, except: [:index, :create, :update_order_batch]
  before_action :check_authorization

  def index
    @kanban_states = Current.account.kanban_states.order(:order)
  end

  def create
    order  = count_kanban_states_account
    kanban = permitted_params
    @kanban_state = Current.account.kanban_states.create!(kanban.merge(order: order))
  end

  def update
    @kanban_state.update!(permitted_params)
  end

  def update_order_batch
    kanban_states_update = permitted_arrays_params
    begin
      KanbanState.update_order_batch(kanban_states_update)
      head :ok
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def destroy
    if Conversation.exists?(kanban_states_id: @kanban_state.id)
      render json: { error: "Cannot delete: referenced by conversation" }, status: :unprocessable_entity
    else
      @kanban_state.destroy!
      head :ok
    end
  end

  private

  def fetch_kanban_state
    @kanban_state = Current.account.kanban_states.find(params[:id])
  end

  def count_kanban_states_account
    return Current.account.kanban_states.count
  end

  def permitted_arrays_params
    params.require(:kanban_states).map do |item|
      permitted_item = item.permit(:id,:name,:order)
      if permitted_item[:id].blank? || permitted_item[:name].blank? || permitted_item[:order].blank?
        raise ActionController::BadRequest.new("Bad request")
      end
      permitted_item
    end
  end
  
  def permitted_params
    params.require(:kanban_state).permit(:name,:color)
  end
end
