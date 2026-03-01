<template>
    <div class="card">
        <div class="card-info">
            <strong class="card-nome">
                {{ cliente.nome }}
                <span class="status-badge" :class="cliente.ativo ? 'status-ativo' : 'status-inativo'">
                    {{ cliente.ativo ? 'Ativo' : 'Inativo' }}
                </span>
            </strong>
            <div class="card-email">{{ cliente.email }}</div>
        </div>
        <div class="card-actions">
            <slot name="actions" :cliente="cliente" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    cliente: {
        type: Object,
        required: true
    }
})
</script>