import { apiSlice } from '../apiSlice'
import { supabase } from '../../lib/supabase'
import type { License } from '../../objects/license'

// TODO: Add Supabase RLS policies for the License table.
// Currently no RLS guards are in place — all users can CRUD.
// Future: unauthenticated users should only SELECT by license_id,
// and UPDATE should be restricted to rows where is_activated = false.

export const licenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLicense: builder.query<License | null, string>({
      queryFn: async (licenseId) => {
        const { data, error } = await supabase
          .from('License')
          .select('*')
          .eq('license_id', licenseId)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            return { data: null }
          }
          return { error: { status: 500, data: error.message } }
        }
        return { data }
      },
      providesTags: ['License'],
    }),

    activateLicense: builder.mutation<void, string>({
      queryFn: async (licenseId) => {

        // TODO: all this should be moved to a trigger function in Supabase

        // 1. Fetch the license to get credentials
        const { data: license, error: fetchError } = await supabase
          .from('License')
          .select('*')
          .eq('license_id', licenseId)
          .single()

        if (fetchError || !license) {
          return { error: { status: 404, data: 'License not found' } }
        }

        if (license.is_activated) {
          return { error: { status: 409, data: 'License already activated' } }
        }

        // 2. Sign up the user with the license credentials
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: license.user_email,
          password: license.temporary_password,
          options: {
            data: { requires_password_change: true },
          },
        })

        if (signUpError) {
          return { error: { status: 500, data: signUpError.message } }
        }

        if (!authData.user?.id) {
          return { error: { status: 500, data: 'User creation failed: No user ID returned' } }
        }

        // 3. Update the license as activated
        const { error: updateError } = await supabase
          .from('License')
          .update({
            is_activated: true,
            user_id: authData.user.id,
          })
          .eq('license_id', licenseId)

        if (updateError) {
          return { error: { status: 500, data: updateError.message } }
        }

        // 4. Auto-login with the temporary credentials
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: license.user_email,
          password: license.temporary_password,
        })

        if (loginError) {
          return { error: { status: 500, data: loginError.message } }
        }

        // 5. Create Device table row
        // Using 'Band' as the default device type. Adjust as needed if License indicates otherwise.
        const { data: deviceData, error: deviceError } = await supabase
          .from('Device')
          .insert({
            user_id: authData.user.id,
            type: 'Band',
          })
          .select('id')
          .single()

        if (deviceError) {
          return { error: { status: 500, data: deviceError.message } }
        }

        // 6. Create User table row
        const { error: userError } = await supabase.from('User').insert({
          user_id: authData.user.id,
          name: license.user_name,
          last_name: license.user_last_name,
          full_name: `${license.user_name} ${license.user_last_name}`,
          devices: deviceData?.id ? [deviceData.id] : [],
        })

        if (userError) {
          return { error: { status: 500, data: userError.message } }
        }

        // 6. Create default Profile (chosen by default)
        const { error: profileError } = await supabase.from('Profile').insert({
          user_id: authData.user.id,
          profile_title: `${license.user_name} ${license.user_last_name}`,
          profile_description: '',
          chosen: true,
          medical_conditions: [],
          sos_contacts: [],
          insurance_name: '',
          insurance_number: '',
        })

        if (profileError) {
          return { error: { status: 500, data: profileError.message } }
        }

        return { data: undefined }
      },
      invalidatesTags: ['License', 'User', 'Profile', 'Device'],
    }),
  }),
})

export const { useGetLicenseQuery, useActivateLicenseMutation, useLazyGetLicenseQuery } = licenseApi
