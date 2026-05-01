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
          return { error: { status: 500, data: error.message } }
        }
        return { data }
      },
      providesTags: ['License'],
    }),

    activateLicense: builder.mutation<void, string>({
      queryFn: async (licenseId) => {

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

        // 3. Auto-login with the temporary credentials
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: license.user_email,
          password: license.temporary_password,
        })

        if (loginError) {
          return { error: { status: 500, data: loginError.message } }
        }

        // 4. Create all registers directly in supabase
        const { data, error } = await supabase.rpc("activate_license", { license_id: license.license_id, user_id: authData.user.id });

        if (error) {
          return { error: { status: 500, data: 'License Activation has failed' } }
        }

        return { data }
      },
      invalidatesTags: ['License', 'User', 'Profile', 'Device'],
    }),
  }),
})

export const { useGetLicenseQuery, useActivateLicenseMutation, useLazyGetLicenseQuery } = licenseApi
