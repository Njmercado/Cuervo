import { Button, Grid } from "@mui/material"
import { FormInput } from "./FormInput"
import { FormSelect } from "./FormSelect"
import { useGetUserQuery, useUpdateUserMutation } from "../../store/endpoints/usersApi"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import type { User } from "../../objects/user"

export function UpdateUserSettings() {
  const { data: user } = useGetUserQuery()
  const [updateUser] = useUpdateUserMutation()
  const [form, setForm] = useState<User>(user || {} as User)

  const handleChange = (name: string) => (value: string) => {
    setForm({ ...form, [name]: value } as User)
  }

  useEffect(() => {
    if (user) {
      setForm(user)
    }
  }, [user])

  const handleSave = async () => {
    try {
      await updateUser(form as User).unwrap()
      toast.success('Usuario actualizado correctamente')
    } catch (error: any) {
      switch (error.status) {
        case 400:
          toast.error('Error al actualizar el usuario, campos inválidos')
          break;
        default:
          toast.error('Error al actualizar el usuario, por favor intente de nuevo')
          break;
      }
    }
  }

  return (
    <Grid container columns={12} spacing={2}>
      <Grid size={{ xs: 12 }}>
        {/* TODO: Add a helper text to explain what is a public username, also check if the public username is already taken and show error messages for wrong username structure */}
        <FormInput
          label="Nombre de usuario público"
          name="public_username"
          value={form?.public_username?.toUpperCase()}
          onChange={(value) => handleChange('public_username')(value.toUpperCase())}
          rules={[
            {
              validate: (value: string) => value.length >= 1 && value.length <= 6,
              errorMessage: 'Debe tener entre 1 y 6 caracteres',
            },
            {
              validate: (value: string) => /^[A-Z0-9_]*$/.test(value.toUpperCase()),
              errorMessage: 'Solo puede contener letras, números y guiones bajos',
            }
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Nombre"
          name="name"
          value={form?.name}
          onChange={handleChange('name')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Apellido"
          name="last_name"
          value={form?.last_name}
          onChange={handleChange('last_name')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Tipo de Documento"
          name="id_type"
          value={form?.id_type}
          onChange={(e) => handleChange('id_type')(e.target.value)}
          options={['CC', 'CE', 'PAS', 'TI']}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Número de Documento"
          name="id_number"
          value={form?.id_number}
          onChange={handleChange('id_number')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Tipo de Sangre"
          name="rh"
          value={form?.rh}
          onChange={(e) => handleChange('rh')(e.target.value)}
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          label="Sexo"
          name="sex"
          value={form?.sex}
          onChange={(e) => handleChange('sex')(e.target.value)}
          options={['Masculino', 'Femenino', 'Otro']}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Lugar de Nacimiento"
          name="from"
          value={form?.from}
          onChange={handleChange('from')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormInput
          label="Vivo en"
          name="living_in"
          value={form?.living_in}
          onChange={handleChange('living_in')}
        />
      </Grid>
      <Grid size={2}>
        <FormInput
          label="Indicativo"
          name="personal_phone_indicative"
          value={form?.personal_phone_indicative}
          onChange={handleChange('personal_phone_indicative')}
        />
      </Grid>
      <Grid size={10}>
        <FormInput
          label="Teléfono"
          name="personal_phone_number"
          value={form?.personal_phone_number}
          onChange={handleChange('personal_phone_number')}
        />
      </Grid>
      <Grid size={12} display='flex' justifyContent='flex-end'>
        <Button
          variant="contained"
          onClick={handleSave}
        >
          Actualizar
        </Button>
      </Grid>
    </Grid>
  )
}