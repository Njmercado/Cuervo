import { Dialog, DialogContent } from '@mui/material'
import { PasswordResetForm } from './PasswordResetForm'

export function PasswordResetModal() {
  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
        <PasswordResetForm />
      </DialogContent>
    </Dialog>
  )
}
