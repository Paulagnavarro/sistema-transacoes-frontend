<template>
    <div class="transacao-page">
        <AppNavbar />
        <div class="transacao-wrapper">
            <header class="perfil-header">
                <h1 class="cliente-nome">
                    {{ cliente?.nome }}
                </h1>
                <div class="saldo-card" :class="{ negativo: saldoAtual < 0 }">
                    <span class="saldo-label">Saldo atual</span>
                    <span class="saldo-valor">
                        R$ {{ saldoAtual.toFixed(2) }}
                    </span>
                </div>
            </header>
            <div class="card">
                <h2 class="card-title">Adicionar Transação</h2>
                <MessageAlert v-if="clienteInativo" msg="Cliente inativo não pode realizar transações." tipo="error" @close="() => {}"/>
                <MessageAlert v-if="mensagemSucesso" :msg="mensagemSucesso" tipo="success" @close="mensagemSucesso = ''"/>
                <MessageAlert v-if="mensagemErro" :msg="mensagemErro" tipo="error" @close="mensagemErro = ''"/>
            <form v-if="!clienteInativo" @submit.prevent="adicionarTransacao" class="transacao-form">
                <div class="form-grid">
                    <select v-model="tipo" required>
                        <option value="credito">Crédito</option>
                        <option value="debito">Débito</option>
                    </select>
                    <input v-model.number="valor" type="number" step="0.01" min="0.01" placeholder="Valor" required/>
                    <div class="full-width">
                        <input v-model="descricao" placeholder="Descrição (opcional)"/>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="clienteInativo">Registrar Transação</button>
            </form>
        </div>
        <div class="transacoes-list card">
            <h2>Histórico de Transações</h2>
            <table v-if="transacoes.length">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                    <tbody>
                        <tr v-for="t in transacoes" :key="t.id">
                            <td>{{ formatarData(t.created_at) }}</td>
                            <td :class="t.tipo">{{ t.tipo === 'credito' ? 'Crédito' : 'Débito' }}</td>
                            <td :class="t.tipo">{{ t.tipo === 'credito' ? '+' : '-' }} R$ {{ Number(t.valor).toFixed(2) }}</td>
                            <td>{{ t.descricao || 'Sem descrição' }}</td>
                        </tr>
                    </tbody>
            </table>
            <p v-else>Nenhuma transação registrada.</p>
        </div>
        <button class="btn btn-secondary btn-small btn-auto" @click="voltar">
            Voltar
        </button>
        </div>
        <AppFooter />
    </div>
</template>

<script setup>
    import AppNavbar from '@/components/AppNavbar.vue'
    import AppFooter from '@/components/AppFooter.vue'
    import { ref, computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import api from '@/axios'
    import MessageAlert from '@/components/MessageAlert.vue'

    const route = useRoute()
    const router = useRouter()
    const clienteId = route.params.id
    const cliente = ref(null)
    const transacoes = ref([])
    const saldoAtual = ref(0)
    const tipo = ref('credito')
    const valor = ref(null)
    const descricao = ref('')
    const mensagemSucesso = ref('')
    const mensagemErro = ref('')

    const carregarPerfil = async () => {
        try {
            const response = await api.get(`/transacoes?cliente_id=${clienteId}`)
            console.log("Resposta API:", response.data)
            transacoes.value = response.data.transacoes
            saldoAtual.value = response.data.saldo_atual
            cliente.value = response.data.cliente
        } catch (err) {
            mensagemErro.value = 'Erro ao carregar perfil'
            setTimeout(() => mensagemErro.value = '', 4000)
        }
    }
    onMounted(carregarPerfil)
    const adicionarTransacao = async () => {
        if (clienteInativo.value) {
            mensagemErro.value = "Cliente inativo não pode realizar transações."
            setTimeout(() => mensagemErro.value = '', 4000)
            return
        }
        try {
            await api.post('/transacoes', {
                cliente_id: clienteId,
                tipo: tipo.value,
                valor: valor.value,
                descricao: descricao.value
            })
            valor.value = null
            descricao.value = ''
            mensagemSucesso.value = 'Transação registrada com sucesso!'
            mensagemErro.value = ''
            await carregarPerfil()
            setTimeout(() => mensagemSucesso.value = '', 4000)
        } catch (err) {
            mensagemErro.value = err.response?.data?.message || 'Erro ao registrar transação'
            mensagemSucesso.value = ''
            setTimeout(() => mensagemErro.value = '', 4000)
        }
    }

    const formatarData = (dataStr) => {
      const data = new Date(dataStr)
      const dia = String(data.getDate()).padStart(2, '0')
      const mes = String(data.getMonth() + 1).padStart(2, '0')
      const ano = data.getFullYear()
      const hora = String(data.getHours()).padStart(2, '0')
      const minuto = String(data.getMinutes()).padStart(2, '0')
      return `${dia}/${mes}/${ano} ${hora}:${minuto}`
    }

    const voltar = () => router.push('/dashboard')

    const clienteInativo = computed(() => {
      if (!cliente.value) return false
      return cliente.value.ativo === false
    })
</script>

<style scoped>
.transacao-page {
    min-height: 100vh;
    background: #f1f5f9;
    display: flex;
    flex-direction: column;
}

.transacao-wrapper {
    width: 100%;
    max-width: 1100px; 
    padding: 100px 20px 40px;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.perfil-header h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 5px;
}

.perfil-header p {
    color: #374151;
    margin-bottom: 20px;
}

input, select {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 14px;
}

.mensagem {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 10px;
    font-weight: 500;
    text-align: center;
}

.mensagem.sucesso {
    background: #d1fae5;
    color: #065f46;
}

.mensagem.erro {
    background: #fee2e2;
    color: #b91c1c;
}

.transacoes-list table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 14px;
}

.transacoes-list th,
.transacoes-list td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.transacoes-list th {
    background: #f3f4f6;
    font-weight: 600;
}

.credito {
    color: green;
}

.debito {
    color: red;
}

@media (max-width: 480px) {
    .perfil-header h1 {
        font-size: 20px;
    }
    input, select, button[type="submit"], .voltar-btn {
        font-size: 14px;
        padding: 10px;
    }
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; 
    gap: 8px;
    margin-bottom: 4px;
}

.submit-btn {
    width: 100%;
}

.full-width {
    grid-column: 1 / -1; 
}

.btn-small {
    padding: 6px 14px;
    font-size: 13px;
}

.btn-auto {
    width: fit-content;
    display: inline-flex;
}

.perfil-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    margin-bottom: 15px;
}

.cliente-nome {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.saldo-card {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    padding: 6px 12px;
    border-radius: 8px;
    display: inline-flex; 
    flex-direction: column;
    align-items: flex-start;
    min-width: unset;
}

.saldo-label {
    font-size: 11px;
    color: #6b7280;
}

.saldo-valor {
    font-size: 16px;
    font-weight: 600;
    color: #16a34a; 
}

.saldo-card.negativo .saldo-valor {
    color: #dc2626;
}

.transacao-form.disabled {
    opacity: 0.6;
    pointer-events: none;
}
</style>