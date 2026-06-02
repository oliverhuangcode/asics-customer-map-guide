export const CATEGORY_COLORS = {
  'Nature': '#1D9E75',
  'Food & Drink': '#D85A30',
  'Culture': '#534AB7',
  'Shopping': '#BA7517',
  'Sport': '#185FA5',
  'Nightlife': '#993556',
  'Other': '#6B6B7A',
}

export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] ?? '#6B6B7A'
