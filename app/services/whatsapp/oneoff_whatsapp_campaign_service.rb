require 'open-uri'
require 'tempfile'
class Whatsapp::OneoffWhatsappCampaignService
  pattr_initialize [:campaign!]

  def perform
    # raise "Invalid campaign #{campaign.id}" if campaign.inbox.inbox_type != 'Whatsapp' || !campaign.one_off?
    raise 'Completed Campaign' if campaign.completed?

    # marks campaign completed so that other jobs won't pick it up
    campaign.completed!

    audience_label_ids = campaign.audience.select { |audience| audience['type'] == 'Label' }.pluck('id')
    audience_labels = campaign.account.labels.where(id: audience_label_ids).pluck(:title)
    process_audience(audience_labels)
  end

  private

  delegate :inbox, to: :campaign
  delegate :channel, to: :inbox


  def process_audience(audience_labels)
    contacts    = campaign.account.contacts.tagged_with(audience_labels, any: true)
    user        = User.find_by(id: campaign.sender_id)
    inbox       = Inbox.find_by(id: campaign.inbox_id)
    attachments = load_file(campaign.additional_attributes["template_params"]["header"])
    return if user.nil? || inbox.nil?
    contacts.each do |contact|
      next if contact.phone_number.blank?
      conversation = get_last_conversation(contact, inbox)
      Messages::MessageBuilder.new(user, conversation, {
        content: campaign.message,
        message_type: 'outgoing',
        template_params: campaign.additional_attributes["template_params"],
        attachments: attachments
      }).perform
    end
  end

  def load_file(header)
    return nil if header.blank?
    tempfile = Tempfile.new
    tempfile.binmode
    tempfile.write(URI.open(header["url"]).read)
    tempfile.rewind
    filename = File.basename(URI.parse(header["url"]).path)
    [
      ActionDispatch::Http::UploadedFile.new(
        filename: filename,
        type: Rack::Mime.mime_type(File.extname(filename)),
        tempfile: tempfile
      )
    ]
  end

  def get_last_conversation(contact, inbox)
    contact_inbox = contact.contact_inboxes.find_or_create_by!(inbox_id: inbox.id) do |ci|
       ci.contact_id = contact.id 
       ci.source_id  = contact.phone_number.delete('+').to_s
    end
    conversation_last_open = if inbox.lock_to_single_conversation
                                  contact_inbox.conversations.last
                              else
                                  contact_inbox.conversations.where.not(status: :resolved).last
                              end
    return conversation_last_open if conversation_last_open
    ::Conversation.create!({
        account_id: inbox.account_id,
        inbox_id: inbox.id,
        contact_id: contact.id,
        contact_inbox_id: contact_inbox.id
    })
  end

end
