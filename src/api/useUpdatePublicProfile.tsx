import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"
import { useGetProfileDetails } from "./useGetProfileDetails"
import { useGetUser } from "./useGetUser"

export function useUpdatePublicProfile() {
  const { user } = useAuth()
  const { getProfileDetails } = useGetProfileDetails()
  const { getUser } = useGetUser()

  const updatePublicProfile = async () => {

    const profileDetails = await getProfileDetails('', true)
    if (!profileDetails) {
      toast.error('Error updating profile')
      return
    }

    const userInformation = await getUser()

    const medical_conditions = profileDetails.medical_conditions_data.map((condition) => ({
      title: condition.title,
      medicines: condition.medicines,
      is_allergy: condition.is_allergy,
    }))
    const sos_contacts = profileDetails.sos_contacts_data.map((contact) => ({
      name: contact.name,
      last_name: contact.last_name,
      phone_number: contact.phone_number,
      phone_indicative: contact.phone_indicative,
      location: contact.location,
      relationship: contact.relationship,
    }))

    const { error } = await supabase
      .from('PublicProfile')
      .upsert({
        name: userInformation?.name,
        last_name: userInformation?.last_name,
        id_type: userInformation?.id_type,
        id_number: userInformation?.id_number,
        from: userInformation?.from,
        living_in: userInformation?.living_in,
        sex: userInformation?.sex,
        rh: userInformation?.rh,
        profile_title: profileDetails.profile_title,
        profile_description: profileDetails.profile_description,
        insurance_name: profileDetails.insurance_name,
        insurance_number: profileDetails.insurance_number,
        medical_conditions,
        sos_contacts,
        user_id: user?.id,
      })

    if (error) {
      toast.error('Error updating profile')
      return
    }

    toast.success('Public Profile updated')
  }

  return { updatePublicProfile }
}