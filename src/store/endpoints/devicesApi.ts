import { apiSlice } from '../apiSlice'
import { supabase } from '../../lib/supabase'
import type { Device } from '../../objects/device'

export const devicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<Device[], void>({
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }

        const { data, error } = await supabase
          .from('Device')
          .select('*')
          .eq('user_id', user.id)

        if (error) return { error: { status: 500, data: error.message } }
        return { data: data || [] }
      },
      providesTags: ['Device'],
    }),

    getDeviceById: builder.query<Device | null, string>({
      queryFn: async (id) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }

        const { data, error } = await supabase
          .from('Device')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            return { data: null }
          }
          return { error: { status: 500, data: error.message } }
        }
        return { data }
      },
      providesTags: (_result, _error, id) => [{ type: 'Device', id }],
    }),
  }),
})

export const {
  useGetDevicesQuery,
  useGetDeviceByIdQuery,
} = devicesApi
