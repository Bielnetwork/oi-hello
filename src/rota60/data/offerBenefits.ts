import { CalendarDays, ClipboardList, Gift, Languages, Signpost } from 'lucide-react'
import { bonuses } from './plans'

const bonusIcons = [Signpost, ClipboardList, CalendarDays, Languages]

export const bonusCards = bonuses.map(([title, description], index) => ({
  title,
  description,
  icon: bonusIcons[index] ?? Gift,
}))
