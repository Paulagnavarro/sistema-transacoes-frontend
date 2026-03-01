<template>
    <div v-if="msg" :class="['alert', tipoClasse]" class="alert">
        <div class="alert-content">
            <span class="alert-icon">{{ icon }}</span>
            <span>{{ msg }}</span>
        </div>
        <button type="button" class="alert-close" @click="fechar" :aria-label="`Fechar mensagem de ${tipo}`">×</button>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
    msg: String,
    tipo: {
        type: String,
        default: 'success', // 'success' ou 'error'
    }
    })

    const emits = defineEmits(['close'])
    const icon = props.tipo === 'success' ? '✔' : '⚠'
    const tipoClasse = props.tipo === 'success' ? 'alert-success' : 'alert-error'
    const fechar = () => emits('close')
</script>