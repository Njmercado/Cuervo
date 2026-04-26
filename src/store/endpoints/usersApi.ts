import { apiSlice } from '../apiSlice'
import { supabase } from '../../lib/supabase'
import type { User } from '../../objects/user'

export interface CreateUserData {
  user_id: string
  name: string
  last_name?: string
  full_name: string
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User | null, void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: null }
        const { data, error } = await supabase.from('User').select('*').eq('user_id', user.id).single()
        if (error) {
          if (error.code === 'PGRST116') {
            return { data: null }
          }
          return { error: { status: 500, data: error.message } }
        }
        return { data }
      },
      providesTags: ['User']
    }),
    createUser: builder.mutation<void, CreateUserData>({
      queryFn: async (userData) => {
        const { error } = await supabase.from('User').insert({
          user_id: userData.user_id,
          name: userData.name,
          last_name: userData.last_name,
          full_name: userData.full_name,
        })
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['User']
    }),
    updateUser: builder.mutation<void, User>({
      queryFn: async (userData) => {
        const { data: { user } } = await supabase.auth.getUser() // TODO: I'm not sure about this. I think is not necessary to request user on each request. I think we can get it from the store.
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error, status } = await supabase.from('User').update({
          name: userData.name,
          last_name: userData.last_name,
          full_name: `${userData.name} ${userData.last_name}`,
          rh: userData.rh,
          sex: userData.sex,
          personal_phone_number: userData.personal_phone_number,
          personal_phone_indicative: userData.personal_phone_indicative,
          id_type: userData.id_type,
          id_number: userData.id_number,
          living_in: userData.living_in,
          from: userData.from,
          public_username: userData.public_username?.toUpperCase(),
        }).eq('user_id', user.id).eq('id', userData.id)
        if (error) return { error: { status: status, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['User', 'Profile']
    })
  })
})

export const { useGetUserQuery, useCreateUserMutation, useUpdateUserMutation } = usersApi
