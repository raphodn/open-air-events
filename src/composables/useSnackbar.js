import { ref } from 'vue'

const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

export const useSnackbar = () => {
  const showSuccess = (message) => {
    snackbarMessage.value = message
    snackbarColor.value = 'success'
    showSnackbar.value = true
  }

  const showError = (message) => {
    snackbarMessage.value = message
    snackbarColor.value = 'error'
    showSnackbar.value = true
  }

  return {
    showSnackbar,
    snackbarMessage,
    snackbarColor,
    showSuccess,
    showError
  }
}
