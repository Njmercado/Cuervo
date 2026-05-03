import { type PublicProfileType } from '../objects/publicProfile'
import { RH_LABEL } from '../constants'

/**
 * Builds the identity and demographics portion of the audio script
 */
function generateIdentityText(profile: PublicProfileType) {
  let text = `Soy ${profile.name || ''} ${profile.last_name || ''}. `

  if (profile.sex) text += `Sexo ${profile.sex}. `
  if (profile.from) text += `De ${profile.from}. `
  if (profile.living_in) text += `Reside en ${profile.living_in}. `
  if (profile.id_type && profile.id_number) text += `Identificado con ${profile.id_type} número ${profile.id_number.split('').join(' ')}. ` // Breaking number for readable speech

  return text
}

/**
 * Builds the critical medical portion of the script (Blood, Allergies, Insurances, Conditions)
 */
function generateMedicalText(profile: PublicProfileType) {
  let text = ''

  if (profile.rh) text += `Tipo de sangre ${RH_LABEL[profile.rh]}. `

  const allergies = profile.medical_conditions?.filter(c => c.is_allergy)
  if (allergies && allergies.length > 0) {
    text += 'Alergias conocidas: '
    allergies.forEach(a => {
      text += `${a.title}. `
      if (a.medicines && a.medicines.length > 0) {
        text += `Medicación para alergia: ${a.medicines.join(', ')}. `
      }
    })
  } else {
    text += 'Sin alergias médicas conocidas. '
  }

  const conditions = profile.medical_conditions?.filter(c => !c.is_allergy)
  if (conditions && conditions.length > 0) {
    text += 'El paciente presenta las siguientes condiciones previas: '
    conditions.forEach(cond => {
      text += `${cond.title}. `
      if (cond.medicines && cond.medicines.length > 0) {
        text += `Medicación relacionada: ${cond.medicines.join(', ')}. `
      }
    })
  }

  if (profile.insurance_name) {
    text += `Aseguradora o EPS: ${profile.insurance_name}. `
  }

  return text
}

/**
 * Builds the Emergency Contacts list for speech
 */
function generateEmergencyContacts(profile: PublicProfileType) {
  let text = ''
  if (profile.sos_contacts && profile.sos_contacts.length > 0) {
    const contactsText = profile.sos_contacts.map(c => `${c.name || ''}, ${c.relationship || ''}`).join(', tambien ')
    text += `En caso de urgencia, los contactos designados son: ${contactsText}. `
  }
  return text
}

/**
 * Grabs the user's explicit profile extra info
 */
function generateAdditionalInfo(profile: PublicProfileType) {
  if (profile.profile_description) {
    return `Información adicional a considerar: ${profile.profile_description}. `
  }
  return ''
}

/**
 * Main invokable pipeline to synthesize speech from a PublicProfileType.
 * It systematically groups text and reads it asynchronously.
 */
export function playProfileAudio(profile: PublicProfileType) {
  if (!window.speechSynthesis) {
    console.error('Speech Synthesis no soportado en este navegador.')
    return false
  }

  // Cancel any ongoing playbacks so they don't queue
  window.speechSynthesis.cancel()

  // Assemble full script
  const scriptChunks = [
    generateIdentityText(profile),
    generateMedicalText(profile),
    generateEmergencyContacts(profile),
    generateAdditionalInfo(profile)
  ]
  const fullText = scriptChunks.join(' ')

  const utterance = new SpeechSynthesisUtterance(fullText)

  // Try mapping to a native Spanish voice bank correctly
  const voices = window.speechSynthesis.getVoices()
  // Specifically target ES variants
  const esVoices = voices.filter(v => v.lang.startsWith('es'))
  if (esVoices.length > 0) {
    // Prefer Latin American/Mexican variants where possible because of the App's assumed demographic
    const mxVoice = esVoices.find(v => v.lang.includes('MX') || v.lang.includes('CO'))
    utterance.voice = mxVoice || esVoices[0]
  } else {
    // Fallback explicit locale identifier
    utterance.lang = 'es-ES'
  }

  // Configuration
  utterance.rate = 0.95 // 5% Slower for better emergency comprehension
  utterance.pitch = 1.0

  window.speechSynthesis.speak(utterance)
  return true
}

/** Stop ongoing TTS execution immediately */
export function stopProfileAudio() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
