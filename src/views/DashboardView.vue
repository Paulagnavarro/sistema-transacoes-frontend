<template>
    <div class="dashboard-page">
        <AppNavbar />
        <div class="dashboard-wrapper">
            <h1 class="page-title">Gerenciamento de Clientes</h1>
            <MessageAlert :msg="successMsg" tipo="success" @close="clear"/>
            <MessageAlert :msg="errorMsg" tipo="error" @close="clear"/>
            <div class="dashboard-actions">
                <button class="btn btn-primary" @click="toggleForm">
                    {{ showNovoClienteForm ? 'Cancelar' : 'Cadastrar Novo Cliente' }}
                </button>
            </div>
           
            <ClienteForm v-if="showNovoClienteForm" :cliente="novoCliente" :modo-edicao="false" :erros="errosCadastro" @salvar="handleCadastrarCliente"/>
           
            <ClienteForm v-if="showEditarClienteForm && clienteEmEdicao" :cliente="clienteEmEdicao" :modo-edicao="true" :erros="errosEdicao" @salvar="handleAtualizarCliente" @cancelar="cancelarEdicao"/>

            <section class="clientes-list">
                <div v-if="loading" class="info-msg">
                    Carregando clientes...
                </div>
                <div v-else-if="clientes.length === 0" class="info-msg">
                    Nenhum cliente cadastrado ainda.
                </div>
                <div v-else class="cards-container">
                    <ClienteCard v-for="cliente in clientes" :key="cliente.id" :cliente="cliente">
                        <div class="cliente-header">
                            <div class="cliente-nome-status">
                                <span class="cliente-nome">{{ cliente.nome }}</span>
                                <span class="status-badge" :class="cliente.ativo ? 'status-ativo' : 'status-inativo'">
                                    {{ cliente.ativo ? 'Ativo' : 'Inativo' }}
                                </span>
                            </div>
                            <span class="cliente-email">{{ cliente.email }}</span>
                        </div>

                        <template #actions>
                            <div class="cliente-actions-wrapper">
                                <button class="btn btn-warning" @click="editarCliente(cliente)">Editar</button>
                                <button class="btn btn-primary" @click="gerenciarPerfil(cliente.id)">Gerenciar Transações</button>
                            </div>
                        </template>
                    </ClienteCard>
                </div>
            </section>
        </div>
        <AppFooter />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import ClienteCard from '@/components/ClienteCard.vue'
    import AppNavbar from '@/components/AppNavbar.vue'
    import AppFooter from '@/components/AppFooter.vue'
    import ClienteForm from '@/components/ClienteForm.vue'
    import { useClientes } from '@/composables/useClientes'
    import { useAlert } from '@/composables/useAlert'
    import MessageAlert from '@/components/MessageAlert.vue'

    const { successMsg, errorMsg, clear } = useAlert()
    const router = useRouter()
    const { clientes, loading, carregarClientes, cadastrarCliente, atualizarCliente } = useClientes()
    const showNovoClienteForm = ref(false)
    const showEditarClienteForm = ref(false)
    const clienteEmEdicao = ref(null)
    const resetNovoCliente = () => ({ nome: '',  email: '', telefone: '', data_nascimento: '', ativo: true })
    const novoCliente = ref(resetNovoCliente())
    const errosCadastro = ref({})
    const errosEdicao   = ref({})

    const toggleForm = () => {
        errosCadastro.value = {}
        showNovoClienteForm.value = !showNovoClienteForm.value
        showEditarClienteForm.value = false
        // Limpa formulário ao abrir novamente
        if (showNovoClienteForm.value) {
            novoCliente.value = {
            nome: '',
            email: '',
            telefone: '',
            data_nascimento: '',
            ativo: true
            }
        }
    }

    const cancelarEdicao = () => {
        errosEdicao.value = {}
        showEditarClienteForm.value = false
        clienteEmEdicao.value = null
    }

    const editarCliente = (cliente) => {
        errosEdicao.value = {}
        clienteEmEdicao.value = { ...cliente } // cópia profunda simples
        showEditarClienteForm.value = true
        showNovoClienteForm.value = false
    }

    const gerenciarPerfil = (id) => {
        router.push(`/cliente/${id}`)
    }

    const handleCadastrarCliente = async (dados) => {
        errosCadastro.value = {}
        try {
            const result = await cadastrarCliente(dados)
            if (result.success) {
                novoCliente.value = resetNovoCliente()
                showNovoClienteForm.value = false
                successMsg.value = 'Cliente cadastrado com sucesso!'
            } else {
                errosCadastro.value = result.errors
            }
        } catch (err) {
            errorMsg.value = 'Erro ao cadastrar cliente. Tente novamente.'
        }
    }

    const handleAtualizarCliente = async (dados) => {
        errosEdicao.value = {}
        try {
            const result = await atualizarCliente(dados)
            if (result.success) {
                successMsg.value = 'Cliente atualizado com sucesso!'
                cancelarEdicao()
            } else {
                errosEdicao.value = result.errors
            }
        } catch (err) {
            errorMsg.value = 'Erro ao atualizar cliente. Tente novamente.'
        }
    }

    onMounted(() => {
        carregarClientes()
    })
</script>

<style scoped>
.dashboard-page {
    min-height: 100vh;
    background: #f1f5f9;
    padding-top: 70px;
    display: flex;
    flex-direction: column;
}

.dashboard-wrapper {
    width: 100%;
    max-width: 1100px;
    padding: 0 20px;
    margin: 0 auto;
    flex: 1;
}

.info-msg {
    text-align: center;
    color: #6b7280;
    margin: 40px 0;
}

.router-link-active {
    color: #4f46e5;
    font-weight: bold;
}

.dashboard-actions {
    margin-bottom: 30px;
}

.erro-campo {
    color: #dc3545;
    font-size: 13px;
    display: block;
    margin-top: 4px;
}

.messages {
    margin-bottom: 20px;
}

@keyframes fadeSlide {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cliente-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.cliente-nome-status {
  display: flex;
  align-items: center;
  gap: 8px; 
}

.cliente-nome {
  font-weight: 600;
  font-size: 16px;
}

:deep(.status-badge) {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
  font-weight: 500;
}

:deep(.status-ativo) {
  background-color: #e6f9f0;
  color: #0f5132;
  border: 1px solid #b7ebd3;
}

:deep(.status-inativo) {
  background-color: #fde8e8;
  color: #842029;
  border: 1px solid #f5c2c7;
}

.cliente-actions-wrapper {
  display: flex;
  gap: 12px;          
  justify-content: flex-end; 
}
</style>