import { apiSlice } from '../apiSlice'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../objects/profile'
import type { ProfileData } from '../../objects/profile'
import type { Condition } from '../../objects/condition'
import type { SOSContact } from '../../objects/sosContact'
import type { PublicProfileType } from '../../objects/publicProfile'

export interface ProfileDetails extends Profile {
  medical_conditions_data: Condition[]
  sos_contacts_data: SOSContact[]
}

export const profilesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfiles: builder.query<Profile[], void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { data: [] }
        const { data, error } = await supabase.from('Profile').select('*').eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: data || [] }
      },
      providesTags: ['Profile']
    }),
    getChosenProfile: builder.query<Profile, string>({
      queryFn: async (token) => {
        const { data, error } = await supabase
          .from('Profile')
          .select('*')
          .eq('user_id', token)
          .eq('chosen', true)
          .single()
        if (error) return { error: { status: 500, data: error.message } }
        return { data }
      },
      providesTags: ['Profile']
    }),
    getPublicProfile: builder.query<PublicProfileType, string>({
      queryFn: async (token) => {
        const { data, error } = await supabase
          .from('PublicProfile_Safe')
          .select('*')
          .or(`username.eq.${token.toUpperCase()},public_username.eq.${token.toUpperCase()}`)
          .single()
        if (error) return { error: { status: 500, data: error.message } }
        return { data }
      },
      // Uses Profile tag since public profile is effectively derived from Profile updates
      providesTags: ['Profile']
    }),
    createProfile: builder.mutation<void, ProfileData>({
      queryFn: async (profile) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase.from('Profile').insert({
          ...profile,
          user_id: user.id
        })
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    }),
    updateProfile: builder.mutation<void, Profile>({
      queryFn: async (profile) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase
          .from('Profile')
          .update({
            profile_description: profile.profile_description,
            profile_title: profile.profile_title,
            medical_conditions: profile.medical_conditions,
            sos_contacts: profile.sos_contacts,
            insurance_name: profile.insurance_name,
            insurance_number: profile.insurance_number,
            chosen: profile.chosen,
          })
          .eq('id', profile.id)
          .eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    }),
    deleteProfile: builder.mutation<void, string>({
      queryFn: async (id) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        const { error } = await supabase
          .from('Profile')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Profile']
    }),
    updateChosenStatus: builder.mutation<void, { id: string; currentChosenProfileId?: string }>({
      queryFn: async ({ id }) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }

        const { error, data } = await supabase.rpc('update_chosen_profile', {
          new_chosen_profile_id: id,
          user_id: user.id
        })

        if (error) {
          return { error: { status: 500, message: error.message } }
        }

        return { data }
      },
      invalidatesTags: ['Profile']
    }),
  })
})

export const {
  useGetProfilesQuery,
  useGetChosenProfileQuery,
  useGetPublicProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useUpdateChosenStatusMutation,
} = profilesApi
