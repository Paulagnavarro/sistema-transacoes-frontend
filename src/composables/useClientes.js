// src/composables/useClientes.js
import { ref } from 'vue'
import {
  listarClientes,
  criarCliente,
  atualizarClienteService
} from '@/services/clienteService'

export function useClientes() {
    const clientes = ref([])
    const loading = ref(false)
    const error = ref(null)         
    const successMessage = ref('')
    const errorMessage = ref('')

    // Função auxiliar para mostrar mensagens temporárias
    const showMessage = (tipo, texto, tempo = 4500) => {
        if (tipo === 'success') {
            successMessage.value = texto
            errorMessage.value = ''
        } else {
            errorMessage.value = texto
            successMessage.value = ''
        }
        setTimeout(() => {
            successMessage.value = ''
            errorMessage.value = ''
        }, tempo)
    }

    // Carregar a lista de clientes
    const carregarClientes = async () => {
        try {
            loading.value = true
            error.value = null
            clientes.value = await listarClientes()
        } catch (err) {
            console.error(err)
            error.value = 'Não foi possível carregar os clientes'
            showMessage('error', 'Erro ao carregar clientes')
            clientes.value = []
        } finally {
            loading.value = false
        }
    }

    // Cadastrar novo cliente
    const cadastrarCliente = async (dados) => {
        try {
            error.value = null
            await criarCliente(dados)
            
            showMessage('success', 'Cliente cadastrado com sucesso!')
            await carregarClientes() 
            return { success: true, errors: {} }
        } catch (err) {
            if (err.response?.status === 422) {
                return { success: false, errors: err.response.data.errors || {} }
            }
    
            showMessage('error', 'Erro ao cadastrar cliente')
            console.error(err)
            return { success: false, errors: {} }
        }
    }

    // Atualizar cliente existente
    const atualizarCliente = async (dados) => {
        if (!dados?.id) return { success: false, errors: {} }

        try {
            error.value = null
            await atualizarClienteService(dados.id, dados)
            
            showMessage('success', 'Cliente atualizado com sucesso!')
            await carregarClientes()
            return { success: true, errors: {} }
        } catch (err) {
            if (err.response?.status === 422) {
                return { success: false, errors: err.response.data.errors || {} }
            }
            
            showMessage('error', 'Erro ao atualizar cliente')
            console.error(err)
            return { success: false, errors: {} }
        }
    }

    return {
        // Estados
        clientes,
        loading,
        error,
        successMessage,
        errorMessage,

        // Métodos
        carregarClientes,
        cadastrarCliente,
        atualizarCliente,

        showMessage
    }
}