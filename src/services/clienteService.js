import api from '@/axios'

/* Busca a lista de clientes */
export const listarClientes = async () => {
    const { data } = await api.get('/clientes')
    return data
}

/* Cria um novo cliente */
export const criarCliente = async (dados) => {
    return await api.post('/clientes', dados)
}

/* Atualiza um cliente existente pelo ID */
export const atualizarClienteService = async (id, dados) => {
    return await api.put(`/clientes/${id}`, dados)
}