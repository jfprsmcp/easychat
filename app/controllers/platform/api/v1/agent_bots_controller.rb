require 'cgi'
require 'action_view'
include ActionView::Helpers::SanitizeHelper

class Platform::Api::V1::AgentBotsController < PlatformController
  before_action :set_resource, except: [:index, :create, :query]
  before_action :validate_platform_app_permissible, except: [:index, :create, :query]

  def index
    @resources = @platform_app.platform_app_permissibles.where(permissible_type: 'AgentBot').all
  end

  def show; end

  def create
    @resource = AgentBot.new(agent_bot_params.except(:avatar_url))
    @resource.save!
    process_avatar_from_url
    @platform_app.platform_app_permissibles.find_or_create_by(permissible: @resource)
  end

  def update
    @resource.update!(agent_bot_params.except(:avatar_url))
    process_avatar_from_url
  end

  def destroy
    @resource.destroy!
    head :ok
  end

  def query
    agent_bot_inbox = AgentBotInbox.find_by(account_id: params[:account_id], inbox_id: params[:inbox_id])
    return render json: { error: 'agent bot not found' }, status: :not_found if agent_bot_inbox.nil?
    @resource = agent_bot_inbox.agent_bot
    @resource.prompt = clean_tags_html(@resource.prompt)
  end

  def avatar
    @resource.avatar.purge if @resource.avatar.attached?
    @resource
  end

  private

  def clean_tags_html(text)
    return "" if text.blank?
    CGI.unescapeHTML(strip_tags(text))
  end

  def set_resource
    @resource = AgentBot.find(params[:id])
  end

  def agent_bot_params
    params.permit(:name, :description, :account_id, :outgoing_url, :avatar, :avatar_url)
  end

  def process_avatar_from_url
    ::Avatar::AvatarFromUrlJob.perform_later(@resource, params[:avatar_url]) if params[:avatar_url].present?
  end
end
