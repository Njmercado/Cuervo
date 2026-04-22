import { apiSlice } from '../apiSlice'
import { supabase } from '../../lib/supabase'
import type { Condition, ConditionData } from '../../objects/condition'

export const medicalConditionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMedicalConditions: builder.query<Condition[], void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: [] }
        const { data, error } = await supabase.from('MedicalCondition').select('*').eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: data || [] }
      },
      providesTags: ['MedicalCondition']
    }),
    createMedicalCondition: builder.mutation<void, ConditionData>({
      queryFn: async (condition) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('MedicalCondition').insert({
          title: condition.title,
          medicines: condition.medicines,
          user_id: user.id,
          is_allergy: condition.is_allergy,
        })
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['MedicalCondition', 'Profile']
    }),
    updateMedicalCondition: builder.mutation<void, Condition>({
      queryFn: async (condition) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('MedicalCondition').update({
          title: condition.title,
          medicines: condition.medicines,
          is_allergy: condition.is_allergy,
        }).eq('id', condition.id).eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['MedicalCondition', 'Profile']
    }),
    deleteMedicalCondition: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('MedicalCondition').delete().eq('id', id).eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['MedicalCondition', 'Profile']
    }),
  })
})

export const {
  useGetMedicalConditionsQuery,
  useCreateMedicalConditionMutation,
  useUpdateMedicalConditionMutation,
  useDeleteMedicalConditionMutation,
} = medicalConditionsApi
