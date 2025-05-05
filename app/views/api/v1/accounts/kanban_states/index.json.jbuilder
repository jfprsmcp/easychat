json.payload do
  json.array! @kanban_states do |item|
    json.id item["id"]
    json.name item["name"]
    json.color item["color"]
    json.order item["order"]
    json.count item["count"]
  end
end
