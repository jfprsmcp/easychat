json.array! @conversation_sentiments do |sentiment|
  json.id sentiment.id
  json.name sentiment.name
  json.icon sentiment.icon
  json.created_at sentiment.created_at
  json.updated_at sentiment.updated_at
end