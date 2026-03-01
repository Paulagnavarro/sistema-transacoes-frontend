import { ref } from 'vue'

/* Composable para controlar mensagens de sucesso e erro com auto-remoção */
export function useAlert(autoHideMs = 4500) {
    const successMsg = ref('')
    const errorMsg = ref('')

    // Mostra mensagem de sucesso e remove após o tempo definido
    function showSuccess(text) {
        successMsg.value = text
        errorMsg.value = ''
        setTimeout(() => { successMsg.value = '' }, autoHideMs)
    }

    // Mostra mensagem de erro e remove após o tempo definido
    function showError(text) {
        errorMsg.value = text
        successMsg.value = ''
        setTimeout(() => { errorMsg.value = '' }, autoHideMs)
    }

    function clear() {
        successMsg.value = ''
        errorMsg.value = ''
    }

    return {
        successMsg,
        errorMsg,
        showSuccess,
        showError,
        clear
    }
}