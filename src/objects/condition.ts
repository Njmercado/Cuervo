export interface ConditionData {
  title: string
  medicines: string[]
  user_id?: string
  is_allergy?: boolean
}

export interface Condition extends ConditionData {
  id: string
  created_at?: string
}
