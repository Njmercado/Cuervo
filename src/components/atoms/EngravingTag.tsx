import { Box, Typography, useTheme } from '@mui/material'
import type { EngravingData } from '../../objects/engraving'
import { buildQRUrl } from '../../utils/buildQRUrl'
import { ROUTES } from '../../constants'

interface EngravingTagProps {
  name: string
  lastName: string
  data: EngravingData
  showEngraving: boolean
}

export function EngravingTag({ name, lastName, data, showEngraving }: EngravingTagProps) {
  const theme = useTheme()
  const qrUrl = buildQRUrl(`/${ROUTES.PUBLIC}/demo`)

  const fullName = [name, lastName].filter(Boolean).join(' ')
  const nameLine = showEngraving && fullName
  const rhLine = showEngraving && data.rh
  const idLine = showEngraving && data.idNumber
  const conditionLine = showEngraving && data.condition
  const sosLine = showEngraving && (data.sosRelationship || data.sosPhone)
    ? `${data.sosRelationship}${data.sosRelationship && data.sosPhone ? ': ' : ''}${data.sosPhone}`
    : null

  return (
    <Box
      sx={{
        /* Fixed physical dimensions: 4cm × 6cm */
        width: '4cm',
        height: '6cm',
        borderRadius: theme.customSizes.radius.sm,
        /* Brushed metal gradient */
        background: `linear-gradient(
            170deg,
            ${theme.palette.custom.metal.light} 0%,
            ${theme.palette.custom.metal.base} 30%,
            ${theme.palette.custom.metal.dark} 55%,
            ${theme.palette.custom.metal.base} 75%,
            ${theme.palette.custom.metal.light} 100%
          )`,
        border: `1px solid ${theme.palette.custom.metal.border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
        p: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '2px',
        overflow: 'hidden',
      }}
    >
      {/* QR code */}
      <Box
        component="img"
        src={qrUrl}
        alt="Vista previa QR"
        sx={{
          width: '3cm',
          height: '3cm',
          borderRadius: '2px',
        }}
      />

      <Box sx={{
        textAlign: 'center',
        color: theme.palette.custom.metal.text,
        lineHeight: 1.2,
      }}>
        {nameLine && <Typography sx={{ fontSize: theme.customSizes.font.small }}>{nameLine}</Typography>}
        {rhLine && <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.small }}>{rhLine}</Typography>}
        {idLine && <Typography sx={{ fontSize: theme.customSizes.font.small }}>{idLine}</Typography>}
        {conditionLine && <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.small }}>{conditionLine}</Typography>}
        {sosLine && <Typography sx={{ fontWeight: 700, fontSize: theme.customSizes.font.small }}>{sosLine}</Typography>}
      </Box>
    </Box>
  )
}
