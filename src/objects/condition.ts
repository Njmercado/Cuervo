export interface ConditionData {
  title: string
  medicines: string[]
  is_allergy?: boolean
}

export interface Condition extends ConditionData {
  id: string
  user_id?: string
  created_at?: string
}
