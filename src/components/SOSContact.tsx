import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Grid,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import toast from 'react-hot-toast'
import { SideDrawer } from './ui/SideDrawer'
import { Modal } from './ui/Modal'
import { SOSContactCard } from './ui/SOSContactCard'
import { SOSContactForm } from './ui/SOSContactForm'
import { SOSContactSearch } from './ui/SOSContactSearch'
import {
  useGetSOSContactsQuery,
  useCreateSOSContactMutation,
  useUpdateSOSContactMutation,
  useDeleteSOSContactMutation
} from '../store/endpoints/sosContactsApi'
import type { SOSContact, SOSContactData } from '../objects/sosContact'
import { EmptyState } from './ui/EmptyState'

export function SOSContacts() {
  const theme = useTheme()
  const [editingContact, setEditingContact] = useState<SOSContact | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | undefined>(undefined)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [searchFilter, setSearchFilter] = useState<{ search?: string, relationship?: string }>({})
  const { data: contacts = [] } = useGetSOSContactsQuery(searchFilter, { skip: Object.keys(searchFilter).length === 0 ? false : undefined })
  const [createSOSContact] = useCreateSOSContactMutation()
  const [updateSOSContact] = useUpdateSOSContactMutation()
  const [deleteSOSContact] = useDeleteSOSContactMutation()

  const handleSearch = (query: string, relationship: string) => {
    setSearchFilter({
      ...(query ? { search: query } : {}),
      ...(relationship ? { relationship } : {}),
    })
  }

  const handleOpenCreate = () => {
    setEditingContact(undefined)
    setOpenDrawer(true)
  }

  const handleOpenEdit = (contact: SOSContact) => {
    setEditingContact(contact)
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setEditingContact(undefined)
    setOpenDrawer(false)
  }

  const handleSave = async (data: SOSContactData | SOSContact) => {
    try {
      if ('id' in data) {
        await updateSOSContact({ id: data.id, contact: data }).unwrap()
        toast.success(`Contacto "${data.name}" actualizado`)
      } else {
        await createSOSContact(data as SOSContactData).unwrap()
        toast.success(`Contacto "${data.name}" guardado`)
      }
      handleCloseDrawer()
    } catch {
      toast.error('Error al guardar el contacto')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    try {
      await deleteSOSContact(deletingId).unwrap()
      toast.success('Contacto eliminado')
    } catch {
      toast.error('Error al eliminar el contacto')
    } finally {
      setDeletingId(undefined)
    }
  }

  const deletingContact = contacts.find((c) => c.id === deletingId)

  return (
    <Box component="main" height="100vh">
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box component="header" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: theme.customSizes.font.small, fontWeight: 700, color: 'text.primary' }}>
              PANEL DE CONTROL
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ color: theme.palette.error.main }}>
              Contactos de Emergencia
            </Typography>
          </Box>
          <Button
            onClick={handleOpenCreate}
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{ bgcolor: theme.palette.custom.tertiary[100] }}
          >
            Agregar Contacto
          </Button>
        </Box>

        {/* Search & Filters */}
        <SOSContactSearch onSearch={handleSearch} />

        {/* Content */}
        {contacts.length === 0 ? (
          <EmptyState
            title="No tienes contactos de emergencia registrados"
            description="Agrega tu primer contacto de emergencia para mantener tu perfil actualizado"
            color={theme.palette.custom.tertiary[20]}
          />
        ) : (
          <Grid container columns={12} spacing={2}>
            {contacts.map((contact) => (
              <Grid key={contact.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <SOSContactCard
                  contact={contact}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => setDeletingId(id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Create / Edit Drawer */}
      <SideDrawer
        isOpen={openDrawer}
        onClose={handleCloseDrawer}
        title={editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
        permanent={false}
      >
        <SOSContactForm
          contact={editingContact}
          onSave={handleSave}
          onCancel={handleCloseDrawer}
        />
      </SideDrawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(undefined)}
        title="Eliminar Contacto"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography>
            ¿Estás seguro de que deseas eliminar el contacto{' '}
            <strong>"{deletingContact?.name} {deletingContact?.last_name}"</strong>? Esta acción no se puede deshacer.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setDeletingId(undefined)}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}