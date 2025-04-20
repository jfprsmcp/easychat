json.payload do
  json.array! @kanban_states do |item|
    json.id item[:id] || item.id
    json.name item[:name] || item.name
    json.color item[:color] || item.color
    json.order item[:order] || item.order
  end
end
