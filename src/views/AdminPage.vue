<template>
    <div class="admin-page">
        <AppNavbar />
        <div class="admin-wrapper">
            <h1>Cadastrar Novo Administrador</h1>
            <form @submit.prevent="cadastrarAdmin" class="admin-form">
                <input v-model="novoAdmin.nome" placeholder="Nome" required />
                <input v-model="novoAdmin.email" type="email" placeholder="Email" required autocomplete="off" />
                <input v-model="novoAdmin.senha" type="password" placeholder="Senha" required autocomplete="new-password" />
                <input v-model="novoAdmin.confirmarSenha" type="password" placeholder="Confirmar senha" required autocomplete="new-password" />
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary submit-btn">
                        Criar Administrador
                    </button>
                </div>
            </form>
            <button class="btn btn-secondary btn-small btn-auto voltar-btn" @click="voltar" type="button">Voltar</button>
            <div class="messages" v-if="mensagem">
                <div class="alert" :class="mensagemTipo">
                    <div class="alert-content">
                        <span class="alert-icon">
                            {{ mensagemTipo === 'alert-success' ? '✔' : '⚠' }}
                        </span>
                        <span>{{ mensagem }}</span>
                    </div>
                    <button class="alert-close" @click="mensagem = ''">×</button>
                </div>
            </div>
        </div>
        <AppFooter />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import api from '@/axios'
    import AppNavbar from '@/components/AppNavbar.vue'
    import AppFooter from '@/components/AppFooter.vue'
    import { useRouter } from 'vue-router'

    const mensagem = ref('')
    const mensagemTipo = ref('alert-success')
    const router = useRouter()
    const novoAdmin = ref({nome: '', email: '', senha: '', confirmarSenha: '' })

    const cadastrarAdmin = async () => {
        if (novoAdmin.value.senha !== novoAdmin.value.confirmarSenha) {
            mensagem.value = 'As senhas não coincidem'
            mensagemTipo.value = 'alert-error'
            return
        }

        try {
            await api.post('/register', {
                name: novoAdmin.value.nome,
                email: novoAdmin.value.email,
                password: novoAdmin.value.senha,
                password_confirmation: novoAdmin.value.confirmarSenha,
                device_name: 'admin-page'
            })
            mensagem.value = 'Administrador criado com sucesso!'
            mensagemTipo.value = 'alert-success'
            novoAdmin.value = {
                nome: '',
                email: '',
                senha: '',
                confirmarSenha: ''
            }
        } catch (error) {
            mensagemTipo.value = 'alert-error'
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors
                const firstErrorKey = Object.keys(errors)[0]
                mensagem.value = errors[firstErrorKey][0]  
            } else if (error.response && error.response.data.message) {
                mensagem.value = error.response.data.message
            } else {
                mensagem.value = 'Erro ao criar administrador'
            }
        }
    }
    const voltar = () => router.push('/dashboard')
</script>

<style scoped>
.admin-wrapper {
    padding: 100px 20px;
    max-width: 600px;
    margin: auto;
}

.admin-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.mensagem {
    margin-top: 15px;
}

.messages {
    margin-top: 25px
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
.voltar-btn {
    margin-top: 15px;
    width: fit-content;
    padding: 6px 14px;      
    font-size: 13px;          
    background: #6b7280;    
    color: white;
    border: none;
}

</style>