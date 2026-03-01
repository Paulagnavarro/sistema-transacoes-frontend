<template>
    <form @submit.prevent="salvar" class="cliente-form">
        <h2 class="form-title">
            {{ modoEdicao ? 'Editar Cliente' : 'Novo Cliente' }}
        </h2>
        <div class="form-grid">
            <div>
                <input v-model="clienteLocal.nome" @input="limparErro('nome')" :class="{ 'input-error': erros?.nome }" placeholder="Nome completo"/>
                <small v-if="erros?.nome" class="erro-campo">
                    {{ erros.nome[0] }}
                </small>
            </div>
            <div>
                <input v-model="clienteLocal.email" type="email" @input="limparErro('email')" :class="{ 'input-error': erros?.email }"  placeholder="E-mail"/>
                    <small v-if="erros?.email" class="erro-campo">
                    {{ erros.email[0] }}
                </small>
            </div>
            <div>
                <input v-model="clienteLocal.telefone" @input="limparErro('telefone')" :class="{ 'input-error': erros?.telefone }" placeholder="Telefone (opcional)"/>
                <small v-if="erros?.telefone" class="erro-campo">
                    {{ erros.telefone[0] }}
                </small>
            </div>
            <div>
                <input v-model="clienteLocal.data_nascimento" type="date" @input="limparErro('data_nascimento')" :class="{ 'input-error': erros?.data_nascimento }"/>
                <small v-if="erros?.data_nascimento" class="erro-campo">
                    {{ erros.data_nascimento[0] }}
                </small>
            </div>
            <div v-if="modoEdicao" class="status-field">
                <label class="status-label">Status</label>
                <select v-model="clienteLocal.ativo" class="status-select">
                    <option :value="true">Ativo</option>
                    <option :value="false">Inativo</option>
                </select>
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">
                {{ modoEdicao ? 'Salvar Alterações' : 'Salvar Cliente' }}
            </button>

            <button v-if="modoEdicao" type="button" class="btn btn-secondary" @click="$emit('cancelar')" >
                Cancelar
            </button>
        </div>
    </form>
</template>

<script setup>
    import { ref, watch } from 'vue'

    const props = defineProps({
        cliente: {
            type: Object,
            required: true
        },
        modoEdicao: {
            type: Boolean,
            default: false
        },
        erros: {
            type: Object,
            default: () => ({})
        }
    })

    const emit = defineEmits(['salvar', 'cancelar'])
    const clienteLocal = ref({ ...props.cliente })

    watch(
        () => props.cliente,
        (novo) => {
            clienteLocal.value = { ...novo }
        }
    )

    const salvar = () => {
        emit('salvar', { ...clienteLocal.value })
    }

    const limparErro = (campo) => {
        if (props.erros && props.erros[campo]) {
            delete props.erros[campo]
        }
    }
</script>

<style scoped>
.erro-campo {
    color: #dc3545;
    font-size: 13px;
    display: block;
    margin-top: 4px;
}

.input-error {
    border: 1px solid #dc3545 !important;
    background: #fff5f5;
}

.form-actions {
    display: flex;
    gap: 12px;
}

.status-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
}

.status-select {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background-color: white;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s;
}

.btn-primary {
    background: transparent;
    border: 1px solid #6366f1;
    color: #6366f1;
}

.btn-primary:hover {
    background: #6366f1;
    color: white;
}

.btn-danger {
    background: #dc2626;
}

.btn-danger:hover {
    background: #b91c1c;
}

.btn-warning {
    background: transparent;
    border: 1px solid #f59e0b;
    color: #f59e0b;
}

.btn-warning:hover {
    background: #f59e0b;
    color: white;
}

.btn-secondary {
    background: #64748b;
}
</style>