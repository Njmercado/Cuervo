# AGENTS.md - Development Guidelines for Cuervo

This document provides comprehensive guidelines for agentic coding agents working in the Cuervo (QuienEs) repository—a React 19 + TypeScript medical emergency profile manager.

## Build, Lint & Test Commands

```bash
# Development
yarn dev              # Start Vite dev server with HMR

# Production
yarn build            # Type check (tsc) + Vite production build
yarn preview          # Preview production build locally

# Linting
yarn lint             # Run ESLint on all TS/TSX files

# Testing
yarn test             # Run all tests (Vitest, exit after completion)
yarn test:ui          # Run tests with Vitest UI dashboard

# Running a single test
yarn test -- src/components/ui/__tests__/ConditionCard.test.tsx
yarn test -- --grep "renders title"  # Filter by test name
yarn test -- --watch                 # Watch mode for development

# Environment setup (required for development)
# Create .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

## Code Style Guidelines

### Imports & Dependencies

- Use ES6 module syntax with named imports
- Type imports use `type` keyword: `import type { Profile } from '../../objects/profile'`
- Group imports: external packages first, then relative imports
- Always use relative paths starting with `./` or `../`

```typescript
// Correct
import { useState } from 'react'
import { useTheme, Box } from '@mui/material'
import type { ProfileData } from '../../objects/profile'
import { FormInput } from './FormInput'
```

### TypeScript & Types

- `"strict": true` mode enforced - all types must be explicit
- No unused locals/parameters allowed
- Data models use dual interfaces: `XyzData` (mutable fields) + `Xyz extends XyzData` (with immutable metadata)

```typescript
// Correct pattern for interfaces
export interface ConditionData {
  title: string
  medicines: string[]
  is_allergy?: boolean
}

export interface Condition extends ConditionData {
  id: string
  user_id?: string
  created_at?: string
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProfileForm`, `ConditionCard`, `SOSContactForm`)
- **Component files**: PascalCase matching export name
- **Hooks**: camelCase with `use` prefix (e.g., `useQR`, `useAuth`)
- **Utils/services**: camelCase (e.g., `audioTTS.ts`, `protectedRoute.tsx`)
- **Database fields**: snake_case (e.g., `profile_title`, `medical_conditions`, `sos_contacts`)
- **Event handlers**: `on{Action}` pattern (e.g., `onEdit`, `onDelete`, `onUpdate`, `onChange`)
- **Interfaces**: `{Name}Props` for component props, `{Name}Data` for mutable data

### Component Architecture

- Functional components only (no class components)
- Props defined as interface ending in `Props`
- Use destructuring in function signature when props have 2+ properties
- Export named functions, not default exports

```typescript
interface ConditionCardProps {
  condition: Condition
  onEdit: (condition: Condition) => void
  onDelete: (id: string) => void
}

export function ConditionCard({ condition, onEdit, onDelete }: ConditionCardProps) {
  // component body
}
```

### Material-UI & Theming

The project extends MUI theme with custom color palette and sizing utilities:

```typescript
// Theme structure (defined in App.tsx)
theme.palette.custom.primary[100]      // Full opacity green (#006E2A)
theme.palette.custom.primary[10]       // 10% opacity
theme.palette.custom.primary[20]       // 20% opacity
theme.palette.custom.tertiary[100]     // Red for allergies/errors
theme.palette.custom.neutral[100]      // Light gray backgrounds

theme.customSizes.font.tiny             // 0.625rem (10px)
theme.customSizes.font.small            // 0.75rem (12px)
theme.customSizes.font.base             // 0.9375rem (15px)
theme.customSizes.font.xl               // 1.5rem (24px)

theme.customSizes.radius.md             // 8px border radius
theme.size(4)                           // Utility: 4 * 0.25rem = 1rem
```

**Card Pattern**: All cards use custom shadow + border styling:
```typescript
sx={{
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.04)',
  borderRadius: theme.customSizes.radius.md,
}}
```

**Color Convention**: Numbers indicate opacity level (100=full, 30/20/10/5=percent opacity).

### RTK Query + Supabase Integration Pattern

All data operations use RTK Query with Supabase backend via `queryFn`:

```typescript
// Template for all endpoints
export const profilesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfiles: builder.query<Profile[], void>({
      queryFn: async () => {
        // 1. Always check auth first
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        
        // 2. Execute Supabase query
        const { data, error } = await supabase
          .from('Profile')
          .select('*')
          .eq('user_id', user.id)
        
        // 3. Return normalized response
        if (error) return { error: { status: 500, data: error.message } }
        return { data: data || [] }
      },
      providesTags: ['Profile']  // For cache invalidation
    }),
    
    createProfile: builder.mutation<void, Profile>({
      queryFn: async (profile) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { status: 401, data: 'Unauthorized' } }
        
        const { error } = await supabase.from('Profile').insert({
          ...profile,
          user_id: user.id
        })
        
        if (error) return { error: { status: 500, data: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Profile', 'MedicalCondition']  // Invalidate related caches
    }),
  })
})

export const { useGetProfilesQuery, useCreateProfileMutation } = profilesApi
```

**Key Rules**:
- Always check user existence in mutations (return 401 if missing)
- Return errors as `{ error: { status: number, data: string } }`
- Use `providesTags` to enable cache invalidation
- Use `invalidatesTags` to refresh related data after mutations
- Export hooks with pattern: `use{Action}{Entity}Query|Mutation`

### Form Patterns & Anti-Patterns

#### **Create vs Update Pattern**

Forms handle both creation and editing. Use this pattern:

```typescript
interface ConditionFormProps {
  condition?: Condition    // Omit for create mode, provide for edit mode
  onSave: (data: ConditionData) => void   // For create
  onUpdate: (data: Condition) => void     // For update
}

export function ConditionForm({ condition, onSave, onUpdate }: ConditionFormProps) {
  // ✅ CORRECT: Lazy initialization or prop-based init
  const [form, setForm] = useState<ConditionData>(() => 
    condition ? { ...condition } : EMPTY_CONDITION
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (condition?.id) {
      // Update: pass full object with id
      onUpdate({ ...condition, ...form })
    } else {
      // Create: pass only data fields
      onSave(form)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Form fields */}
    </Box>
  )
}
```

#### **Array Input Pattern (medicines, contacts)**

```typescript
const [medicineInput, setMedicineInput] = useState('')

const handleAddMedicine = () => {
  const trimmed = medicineInput.trim()
  if (trimmed && !form.medicines.includes(trimmed)) {
    setForm({ ...form, medicines: [...form.medicines, trimmed] })
    setMedicineInput('')
  }
}

return (
  <>
    <TextField
      label="Medicamento"
      value={medicineInput}
      onChange={(e) => setMedicineInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          handleAddMedicine()
        }
      }}
    />
    
    <Stack direction="row" gap={1}>
      {form.medicines.map((med) => (
        <Chip
          key={med}
          label={med}
          onDelete={() => setForm({
            ...form,
            medicines: form.medicines.filter(m => m !== med)
          })}
        />
      ))}
    </Stack>
  </>
)
```

#### **❌ ANTI-PATTERNS TO AVOID**

```typescript
// ❌ DON'T: setState in useEffect causes performance issues & test failures
useEffect(() => {
  setForm(condition)  // Causes cascading renders
}, [condition])

// ✅ DO: Lazy initialize or use key prop for complete reset
const [form, setForm] = useState(() => condition || EMPTY)
// OR add key={condition?.id} to force reset on condition change

// ❌ DON'T: Unsafe optional chaining
if (form?.medicines?.length) { }

// ✅ DO: Explicit null checks
if (form && form.medicines && form.medicines.length) { }

// ❌ DON'T: Missing form dependencies
useEffect(() => {
  onUpdate(form)
}, [form])  // Missing: onUpdate dependency

// ✅ DO: Include all dependencies
useEffect(() => {
  onUpdate(form)
}, [form, onUpdate])
```

### Error Handling

- RTK Query endpoints return normalized errors: `{ error: { status: number, data: string } }`
- Always check auth: `const { data: { user } } = await supabase.auth.getUser()`
- Unauthorized access returns 401 status
- Database errors return 500 status with error message

```typescript
// Correct error handling pattern
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { error: { status: 401, data: 'Unauthorized' } }

const { data, error } = await supabase.from('Profile').select('*')
if (error) return { error: { status: 500, data: error.message } }

return { data }
```

### Spanish Language Support (es-CO)

- All UI text in Spanish (Colombian Spanish)
- Phone format: `+57` country code
- Date formatting: `.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })`
- Text-to-speech: `utterance.lang = 'es-ES'` with Mexican/Colombian voice preference
- Medical fields in snake_case (database) auto-convert to camelCase (UI)

### Formatting

- Use 2 spaces for indentation (ESLint enforces)
- Line length: no strict limit but keep readability in mind
- Semicolons required at end of statements
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- No console.log in production code (use logger or remove)

## Testing Guidelines

- Test file location: `src/{feature}/__tests__/{Component}.test.tsx`
- Tests use React Testing Library + Vitest
- Mock MUI theme for component tests (see pattern below)
- Use `vi.fn()` for mocks, `vi.mock()` for modules
- Test names describe behavior: "renders title and medicine chips", "calls onEdit when Edit clicked"

### MUI Component Testing Pattern

```typescript
// Always mock useTheme for MUI components
vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material/styles')>()
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        custom: {
          primary: { 100: '#006E2A', 10: 'rgba(0,110,42,0.1)' },
          tertiary: { 100: '#C62828', 20: 'rgba(198,40,40,0.1)' },
          neutral: { 100: '#EEEEF0' },
        },
      },
      customSizes: {
        font: { tiny: '0.625rem', xl: '1.5rem', small: '0.75rem' },
        radius: { md: '8px' },
      },
    }),
  }
})

describe('ConditionCard', () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  afterEach(() => vi.clearAllMocks())

  it('renders title and medicine chips', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('Diabetes')).toBeInTheDocument()
    expect(screen.getByText('Metformina')).toBeInTheDocument()
  })

  it('calls onEdit when "Editar" menu item is clicked', () => {
    render(<ConditionCard condition={mockCondition} onEdit={onEdit} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('más opciones'))
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(mockCondition)
  })
})
```

## Common Patterns

### Adding a New Page/Component

1. Create component file in `src/components/` or `src/components/ui/`
2. Define `{Name}Props` interface with typed event handlers
3. Export named function component
4. Add route in `src/constants/routes.ts` if it's a page
5. Wire up in `src/App.tsx` routing if needed

### Adding a RTK Query Endpoint

1. Create file: `src/store/endpoints/{entityName}Api.ts`
2. Use `apiSlice.injectEndpoints()` pattern with queryFn
3. Include auth check in every query/mutation
4. Use tag invalidation for cache management
5. Export hooks: `useGet{Entity}Query`, `useCreate{Entity}Mutation`, etc.

### Material-UI Theme Usage

```typescript
import { useTheme, Box, Card, Chip } from '@mui/material'

export function MyComponent() {
  const theme = useTheme()
  
  return (
    <Card sx={{
      // Use custom palette with opacity levels
      bgcolor: theme.palette.custom.primary[10],      // 10% opacity
      boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
    }}>
      <Chip
        label="Medicine"
        sx={{
          bgcolor: theme.palette.custom.primary[10],
          color: theme.palette.custom.primary[100],
          fontWeight: 600,
          fontSize: theme.customSizes.font.small,
        }}
      />
    </Card>
  )
}
```

### Page Component with Full CRUD

```typescript
export function Conditions() {
  const { data: conditions = [] } = useGetMedicalConditionsQuery()
  const [editingCondition, setEditingCondition] = useState<Condition>()
  const [openDrawer, setOpenDrawer] = useState(false)
  
  const [createCondition] = useCreateMedicalConditionMutation()
  const [updateCondition] = useUpdateMedicalConditionMutation()
  const [deleteCondition] = useDeleteMedicalConditionMutation()
  
  const handleSave = async (data: ConditionData) => {
    try {
      await createCondition(data).unwrap()
      toast.success('Condición guardada')
      setOpenDrawer(false)
    } catch {
      toast.error('Error al guardar')
    }
  }
  
  return (
    <Box component="main">
      {conditions.length === 0 ? (
        <EmptyState title="No tienes condiciones" />
      ) : (
        <Grid container spacing={2}>
          {conditions.map((condition) => (
            <Grid key={condition.id} size={{ xs: 12, md: 4 }}>
              <ConditionCard
                condition={condition}
                onEdit={setEditingCondition}
                onDelete={(id) => deleteCondition(id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      <SideDrawer isOpen={openDrawer} onClose={() => setOpenDrawer(false)}>
        <ConditionForm onSave={handleSave} onUpdate={updateCondition} />
      </SideDrawer>
    </Box>
  )
}
```

### State Management

- Use Redux Toolkit + RTK Query for server state (data from backend)
- Use React `useState` for local UI state only (form inputs, drawer open/close)
- Auth context provided via `AuthContext` in `src/contexts/AuthContext.tsx`
- Never store derived state; compute from source of truth

## Project Structure Reference

```
src/
  components/        # Page components (Dashboard, Conditions, SOSContact, etc.)
  components/ui/     # Reusable UI components (26 components: Card, Form, Modal, etc.)
  store/
    endpoints/       # RTK Query API definitions (profilesApi, medicalConditionsApi, etc.)
    index.ts         # Redux store configuration
  objects/           # TypeScript interfaces (Profile, Condition, SOSContact, User)
  constants/         # Constants, routes, server endpoints
  hooks/             # Custom React hooks (useQR, useAuth)
  contexts/          # React Context providers (AuthContext)
  utils/             # Utility functions (audioTTS, protectedRoute)
  lib/               # External library initialization (Supabase client)
```

## Known Issues & Fixes

### Issue #1: setState in useEffect (CRITICAL) 🔴

**Files Affected**: `ConditionForm.tsx:26`, `SOSContactForm.tsx:28`, `Profile.tsx:29`, `UpdateUserSettings.tsx:20`

**Problem**: Calling setState directly in useEffect body triggers cascading renders and test failures.

```typescript
// ❌ WRONG - Causes infinite render loops
useEffect(() => {
  if (condition) setForm(condition)
}, [condition])

// ✅ CORRECT - Use lazy initialization
const [form, setForm] = useState<ConditionData>(() => 
  condition ? { ...condition } : EMPTY_CONDITION
)
```

**Impact**: Performance degradation, 5 failing tests, ESLint warnings.

---

### Issue #2: Hardcoded Test URL in useQR Hook 🟡

**File**: `src/hooks/useQR.ts:13-15`

**Problem**: QR codes always link to test domain `quiensoy.com.co/p/123456` instead of actual user profile.

```typescript
// ❌ WRONG - Hardcoded test URL
const url = `...?data=quiensoy.com.co/p/123456`

// ✅ CORRECT - Use current user's profile
const url = `...?data=${window.location.origin}/p/${targetId}`
```

**Impact**: QR codes don't work in production; always point to test profile.

---

### Issue #3: TypeScript Any Violations 🟡

**File**: `src/store/endpoints/profilesApi.ts:150, 161`

**Problem**: Uses `any[]` types, violating `"strict": true` mode.

```typescript
// ❌ WRONG
let conditions: any[] = []

// ✅ CORRECT - Use proper types
type MedicalConditionRow = Database['public']['Tables']['MedicalCondition']['Row']
let conditions: MedicalConditionRow[] = []
```

**Impact**: TypeScript strict mode violation, reduced type safety.

---

### Issue #4: Unsafe Optional Chaining 🟡

**File**: `src/components/ui/ConditionForm.tsx:36`

**Problem**: Double optional chaining could throw TypeError if short-circuits.

```typescript
// ❌ WRONG - Could throw if form?.medicines is undefined
if (form?.medicines?.length) { ... }

// ✅ CORRECT - Explicit null checks
if (form && form.medicines && form.medicines.length) { ... }
```

**Impact**: Potential runtime error in edge cases.

---

### Issue #5: AuthContext Exports Non-Component 🟡

**File**: `src/contexts/AuthContext.tsx:43`

**Problem**: Exporting `useAuth` hook from context file breaks react-refresh/only-export-components rule.

```typescript
// ❌ WRONG - Violates react-refresh rule
export const AuthProvider = ({ children }) => { ... }
export const useAuth = () => { ... }

// ✅ CORRECT - Move hook to separate file
// File: src/hooks/useAuth.ts
export const useAuth = () => useContext(AuthContext)
```

**Impact**: Fast Refresh may break during development; eslint error.

---

## CI/CD & Deployment

### Firebase Hosting Integration

The project deploys to Firebase Hosting via GitHub Actions:

**Workflow Files**:
- `.github/workflows/firebase-hosting-merge.yml` - Deploys on main branch push
- `.github/workflows/firebase-hosting-pull-request.yml` - Creates preview for PRs

**Deployment Process**:
1. Push to main branch triggers workflow
2. Install dependencies with `yarn`
3. Run `yarn build` (includes TypeScript check)
4. Deploy to Firebase Hosting

**Required Environment Secrets** (set in GitHub):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- Firebase service account (auto-configured)

### Local Deployment Testing

```bash
# Build production bundle
yarn build

# Preview locally
yarn preview

# Analyze bundle size
yarn build && ls -lh dist/assets/
```

**Note**: Current bundle is 824KB (245KB gzipped), exceeding Vite's 500KB warning threshold. Consider code-splitting if adding significant features.

## Important Notes

- **Database naming**: All database columns use snake_case (auto-converted from UI camelCase)
- **Type safety**: Always use `type` imports for TypeScript-only imports
- **Supabase integration**: Client initialized in `src/lib/supabase.ts`, never hardcode URLs
- **Environment vars**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` required in `.env` for local development
- **No unused code**: Both ESLint and TypeScript strict mode enforce no unused variables/parameters
- **Project maturity**: Early-stage production (39 commits, stable deployment pipeline)
- **Test coverage**: Currently 68% (11/16 tests passing) - prioritize fixing failing tests
- **Bundle size**: Monitor dist size with each major feature; consider route-based code-splitting if exceeds 300KB gzip
