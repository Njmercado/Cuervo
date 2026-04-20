import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Profile', 'MedicalCondition', 'SOSContact', 'User', 'License'],
  endpoints: () => ({}),
})
