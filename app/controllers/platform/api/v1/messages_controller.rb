class Platform::Api::V1::MessagesController < PlatformController
  before_action :conversation
  
  def index
    @messages = message_finder.perform
  end  
  
  def message_finder
    @message_finder ||= MessageFinder.new(@conversation, params)
  end 

  def conversation
    parameters = permitted_params(:conversation_id,:account_id)
    @conversation = Conversation.find_by(display_id: parameters[:conversation_id], account_id: parameters[:account_id])
  end

  private

  def permitted_params(*required)
    permitted = params.permit(required)
    missing = required.select { |key| permitted[key].blank? }
    if missing.any?
      raise ActionController::BadRequest.new("QueryParams required: #{missing.join(', ')}")
    end
    permitted
  end

end