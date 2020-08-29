json.array! @category_children do |child| ##複数データが入っている場合は配列で取り出す必要がある.array!
  json.id child.id
  json.name child.name
end