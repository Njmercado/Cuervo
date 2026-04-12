import { Box, Typography } from "@mui/material"

export interface EmptyStateProps {
  title: string
  description: string
  color?: string
}

export function EmptyState({ title, description, color }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        gap: 2,
        p: 3,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: color ?? 'text.secondary',
        borderRadius: theme => theme.customSizes.radius.lg,
        color: 'text.secondary',
      }}>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  )
}