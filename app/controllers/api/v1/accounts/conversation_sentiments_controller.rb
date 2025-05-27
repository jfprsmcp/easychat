class Api::V1::Accounts::ConversationSentimentsController < Api::V1::Accounts::BaseController
  before_action :current_account
  def index
    @conversation_sentiments = ConversationSentiment.all
  end
end