import { Button, Grid } from "@mui/material"
import { FormInput } from "./FormInput"
import { FormSelect } from "./FormSelect"
import { useGetUser, useUpdateUser } from "../../api"
import { useState, useEffect } from "react"
import type { UserDTO } from "../../objects/user"

export function UpdateUserSettings() {
  const { getUser } = useGetUser()
  const { updateUser } = useUpdateUser()
  const [form, setForm] = useState<UserDTO | null>(null)

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value } as UserDTO)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      setForm(user)
    }
    fetchUser()
  }, [])

  return (
    <Grid container columns={12} spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Nombre"
          name="name"
          value={form?.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Apellido"
          name="last_name"
          value={form?.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Tipo de Sangre"
          name="rh"
          value={form?.rh}
          onChange={(e) => handleChange('rh', e.target.value)}
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Sexo"
          name="sex"
          value={form?.sex}
          onChange={(e) => handleChange('sex', e.target.value)}
          options={['Masculino', 'Femenino', 'Otro']}
        />
      </Grid>
      <Grid size={2}>
        <FormInput
          label="Indicativo"
          name="personal_phone_indicative"
          value={form?.personal_phone_indicative}
          onChange={(e) => handleChange('personal_phone_indicative', e.target.value)}
        />
      </Grid>
      <Grid size={10}>
        <FormInput
          label="Teléfono"
          name="personal_phone_number"
          value={form?.personal_phone_number}
          onChange={(e) => handleChange('personal_phone_number', e.target.value)}
        />
      </Grid>
      <Grid size={12} display='flex' justifyContent='flex-end'>
        <Button
          variant="contained"
          onClick={() => updateUser(form as UserDTO)}
        >
          Actualizar
        </Button>
      </Grid>
    </Grid>
  )
}