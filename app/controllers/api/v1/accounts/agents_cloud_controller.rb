require 'httparty'
class Api::V1::Accounts::AgentsCloudController < Api::V1::Accounts::BaseController
  CLOUD_RUN_AGENT_SUGGESTION_MESSAGE = ENV.fetch('CLOUD_RUN_AGENT_SUGGESTION_MESSAGE','')
  CLOUD_RUN_AGENT_CONVERSATION_SENTIMENT = ENV.fetch('CLOUD_RUN_AGENT_CONVERSATION_SENTIMENT','')

  def suggestion_message
    params = permitted_params_suggestion_message
    begin
      response = HTTParty.get(CLOUD_RUN_AGENT_SUGGESTION_MESSAGE, {
          query: {
            conversation_display_id: params[:conversation_display_id],
            account_id: params[:account_id],
            count_responses: params[:count_responses],
          }
      }).parsed_response
      render json: {
        status: response["status"],
        message: response["message"],
        data: response["data"]
      }, status: :ok
    rescue => e
      render json: {
        status: false,
        message: "fails agent suggestion message: #{e.message}",
        data: nil
      }, status: :internal_server_error
    end
  end


  def analize_conversation_sentiment
    params = permitted_params_conversation_sentiment
    begin
      response = HTTParty.get(CLOUD_RUN_AGENT_CONVERSATION_SENTIMENT, {
          query: {
            conversation_display_id: params[:conversation_display_id],
            account_id: params[:account_id],
          }
      }).parsed_response
      render json: {
        status: response["status"],
        message: response["message"],
        data: response["data"]
      }, status: :ok
    rescue => e
      render json: {
        status: false,
        message: "fails agent conversation sentiment: #{e.message}",
        data: nil
      }, status: :internal_server_error
    end
  end

  private

  def permitted_params_suggestion_message
    params.permit(:conversation_display_id, :account_id, :count_responses)
  end

  def permitted_params_conversation_sentiment
    params.permit(:conversation_display_id, :account_id)
  end

end