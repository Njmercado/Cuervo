import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  useTheme,
  FormControlLabel,
} from '@mui/material'
import type { Theme } from '@mui/material/styles'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import WatchIcon from '@mui/icons-material/Watch'
import { FormInput, EngravingForm, EngravingTag } from './'
import type { EngravingData } from '../../objects/engraving'
import { INITIAL_ENGRAVING } from '../../objects/engraving'

const WHATSAPP_PHONE = '573000000000'

const STEPS_WITH_ENGRAVING = ['Tus datos', 'Tu grabado', 'Confirmar']
const STEPS_WITHOUT_ENGRAVING = ['Tus datos', 'Confirmar']

interface ContactData {
  name: string
  lastName: string
  email: string
  phone: string
}

const INITIAL_CONTACT: ContactData = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
}

function buildWhatsAppUrl(contact: ContactData, engraving: EngravingData): string {
  const sosLine = engraving.sosRelationship || engraving.sosPhone
    ? `${engraving.sosRelationship}${engraving.sosRelationship && engraving.sosPhone ? ': ' : ''}${engraving.sosPhone}`
    : ''

  const message = [
    '*Nueva solicitud de compra — QuienEs*',
    '',
    '*Nombre:* ' + contact.name + ' ' + contact.lastName,
    '*Email:* ' + contact.email,
    '*Telefono:* ' + contact.phone,
    '',
    '*Grabado solicitado:*',
    contact.name + ' ' + contact.lastName + (engraving.rh ? ' ' + engraving.rh : ''),
    engraving.idNumber,
    engraving.condition,
    sosLine,
    '',
    'Hola, estoy interesado(a) en adquirir la pulsera de identificacion medica QuienEs.',
  ].filter(Boolean).join('\n')

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

function ProductBadge() {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        pb: 3,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          bgcolor: (t: Theme) => t.palette.custom.primary[10],
          borderRadius: (t: Theme) => t.customSizes.radius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WatchIcon sx={{ color: 'primary.main', fontSize: 24 }} />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.lg, color: 'text.primary' }}>
          Pulsera QuienEs
        </Typography>
        <Typography sx={{ fontSize: theme.customSizes.font.small, color: 'text.secondary' }}>
          Identificación médica de emergencia
        </Typography>
      </Box>
    </Box>
  )
}

function TrustBadges() {
  const theme = useTheme()
  const chipSx = {
    bgcolor: (t: Theme) => t.palette.custom.neutral[100],
    color: 'text.secondary',
    fontSize: theme.customSizes.font.tiny,
    fontWeight: 600,
  }
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
      <Chip icon={<LocalShippingIcon sx={{ fontSize: 16 }} />} label="Envío nacional" size="small" sx={chipSx} />
      <Chip icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />} label="Compra segura" size="small" sx={chipSx} />
      <Chip icon={<WhatsAppIcon sx={{ fontSize: 16 }} />} label="Atención directa" size="small" sx={chipSx} />
    </Box>
  )
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme()
  if (!value) return null
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography sx={{ fontSize: theme.customSizes.font.small, color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: theme.customSizes.font.small, color: 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  )
}

export function PurchaseForm() {
  const theme = useTheme()
  const [step, setStep] = useState(0)
  const [contact, setContact] = useState<ContactData>(() => ({ ...INITIAL_CONTACT }))
  const [engraving, setEngraving] = useState<EngravingData>(() => ({ ...INITIAL_ENGRAVING }))
  const [wantsEngraving, setWantsEngraving] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<boolean>(false)

  const steps = wantsEngraving ? STEPS_WITH_ENGRAVING : STEPS_WITHOUT_ENGRAVING
  const confirmStep = wantsEngraving ? 2 : 1
  const engravingStep = wantsEngraving ? 1 : -1

  const isContactValid =
    contact.name.trim() !== '' &&
    contact.lastName.trim() !== '' &&
    contact.email.trim() !== '' &&
    contact.phone.trim() !== ''

  const handleContactChange = (field: keyof ContactData) => (value: string, error?: boolean) => {
    setContact((prev) => ({ ...prev, [field]: value }))
    setFormError(error ?? false)
  }

  const handleEngravingChange = (field: keyof EngravingData, value: string, error?: boolean) => {
    setEngraving((prev) => ({ ...prev, [field]: value }))
    setFormError(error ?? false)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      window.open(buildWhatsAppUrl(contact, engraving), '_blank', 'noopener,noreferrer')
    }, 600)
  }

  const handleReset = () => {
    setContact({ ...INITIAL_CONTACT })
    setEngraving({ ...INITIAL_ENGRAVING })
    setWantsEngraving(true)
    setSubmitted(false)
    setStep(0)
  }

  if (submitted) {
    return (
      <Card sx={{ p: { xs: 4, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: theme.customSizes.radius.circle,
            bgcolor: (t: Theme) => t.palette.custom.primary[10],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(0,110,42,0.3)' },
              '70%': { boxShadow: '0 0 0 16px rgba(0,110,42,0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(0,110,42,0)' },
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: theme.customSizes.font.xl }}>
          ¡Redirigiendo a WhatsApp!
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: theme.customSizes.font.base, maxWidth: 360, lineHeight: 1.6 }}>
          Tu información ha sido preparada. Serás redirigido a WhatsApp para continuar con el proceso de compra.
        </Typography>
        <Button variant="outlined" onClick={handleReset} sx={{ borderRadius: theme.customSizes.radius.pill, px: 4, mt: 1 }}>
          Enviar otra solicitud
        </Button>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 4 }}>
      <ProductBadge />

      {/* Stepper */}
      <Stepper
        activeStep={step}
        orientation="horizontal"
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ── Step 0: Contact data ── */}
      {step === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: theme.customSizes.font.xl, color: 'text.primary', mb: 1 }}>
              Datos de contacto
            </Typography>
            <Typography sx={{ fontSize: theme.customSizes.font.base, color: 'text.secondary', mb: 3 }}>
              Te contactaremos por WhatsApp para finalizar tu compra.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <FormInput label="Primer Nombre *" id="buy-name" value={contact.name} onChange={handleContactChange('name')} placeholder="Ej: Juan" />
            <FormInput label="Primer Apellido *" id="buy-lastname" value={contact.lastName} onChange={handleContactChange('lastName')} placeholder="Ej: Pérez" />
          </Box>
          <FormInput
            label="Email *"
            id="buy-email"
            value={contact.email}
            onChange={handleContactChange('email')}
            placeholder="nombre@ejemplo.com"
            rules={[
              {
                validate: (v: string) => /^.+@\w+(\.\w+)+$/.test(v),
                errorMessage: 'El email es inválido'
              }
            ]}
          />
          <FormInput
            label="Teléfono *"
            id="buy-phone"
            value={contact.phone}
            onChange={handleContactChange('phone')}
            placeholder="300 123 4567"
            rules={[
              {
                validate: (v: string) => /^\d+$/.test(v),
                errorMessage: 'El teléfono debe contener solo números'
              },
              {
                validate: (v: string) => v.length >= 7 && v.length <= 10,
                errorMessage: 'El teléfono debe tener entre 7 y 10 dígitos'
              }
            ]}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={wantsEngraving}
                onChange={(e) => {
                  setWantsEngraving(e.target.checked)
                  if (!e.target.checked) setEngraving({ ...INITIAL_ENGRAVING })
                }}
                sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
              />
            }
            label="Quiero personalizar el grabado de mi pulsera"
            sx={{ mb: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isContactValid || formError}
            endIcon={<ArrowForwardIcon />}
            onClick={() => setStep(wantsEngraving ? 1 : confirmStep)}
            sx={{ mt: 1, py: 2, borderRadius: theme.customSizes.radius.pill }}
          >
            Continuar
          </Button>
        </Box>
      )}

      {/* ── Step 1: Engraving (only if wantsEngraving) ── */}
      {step === engravingStep && wantsEngraving && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: theme.customSizes.font.xl, color: 'text.primary', mb: 1 }}>
              Grabado de pulsera
            </Typography>
            <Typography sx={{ fontSize: theme.customSizes.font.base, color: 'text.secondary', mb: 3 }}>
              Todos los campos son opcionales. El QR y tu nombre del paso anterior ya se incluyen.
            </Typography>
          </Box>

          {/* Form + Preview Tag — tag above form on xs, form-left/tag-right on sm */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
            gap: { xs: 3, sm: 5 },
            alignItems: 'center',
          }}>
            <Box sx={{ order: { xs: 2, sm: 1 } }}>
              <EngravingForm data={engraving} onChange={handleEngravingChange} />
            </Box>
            <Box sx={{ order: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'center' }}>
              <EngravingTag name={contact.name} lastName={contact.lastName} data={engraving} showEngraving={wantsEngraving} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep(0)}
              sx={{ borderRadius: theme.customSizes.radius.pill, order: { xs: 2, sm: 1 }, py: { xs: 1, sm: 'inherit' } }}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              disabled={formError}
              onClick={() => setStep(confirmStep)}
              sx={{ py: { xs: 1.5, sm: 2 }, borderRadius: theme.customSizes.radius.pill, order: { xs: 1, sm: 2 } }}
            >
              Revisar pedido
            </Button>
          </Box>
        </Box>
      )}

      {/* ── Confirm step ── */}
      {step === confirmStep && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: theme.customSizes.font.xl, color: 'text.primary', mb: 1 }}>
              Confirmar pedido
            </Typography>
            <Typography sx={{ fontSize: theme.customSizes.font.base, color: 'text.secondary', mb: 3 }}>
              Revisa tus datos antes de continuar por WhatsApp.
            </Typography>
          </Box>

          {/* Contact summary */}
          <Card sx={{ p: 3, bgcolor: (t: Theme) => t.palette.custom.primary[10] }}>
            <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.small, color: 'primary.main', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Datos de contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <ConfirmRow label="Nombre" value={`${contact.name} ${contact.lastName}`} />
              <ConfirmRow label="Email" value={contact.email} />
              <ConfirmRow label="Teléfono" value={contact.phone} />
            </Box>
          </Card>

          {/* Engraving summary — only if user chose engraving */}
          {wantsEngraving && (
            <Card sx={{ p: 3, bgcolor: (t: Theme) => t.palette.custom.neutral[100] }}>
              <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.small, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Grabado
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ConfirmRow label="Tipo de sangre" value={engraving.rh} />
                <ConfirmRow label="Identificación" value={engraving.idNumber} />
                <ConfirmRow label="Condición médica" value={engraving.condition} />
                <ConfirmRow label="Contacto SOS" value={[engraving.sosRelationship, engraving.sosPhone].filter(Boolean).join(': ')} />
              </Box>
            </Card>
          )}

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep(wantsEngraving ? engravingStep : 0)}
              sx={{ borderRadius: theme.customSizes.radius.pill, order: { xs: 2, sm: 1 }, py: { xs: 1, sm: 'inherit' } }}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={handleSubmit}
              sx={{ py: { xs: 1.5, sm: 2 }, borderRadius: theme.customSizes.radius.pill, order: { xs: 1, sm: 2 } }}
            >
              Continuar por WhatsApp
            </Button>
          </Box>

          <TrustBadges />
        </Box>
      )}
    </Card>
  )
}
