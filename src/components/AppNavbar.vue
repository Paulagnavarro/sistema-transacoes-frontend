<template>
    <nav class="navbar">
        <div class="nav-left">
            <div class="logo">
                <div class="avatar"></div>
                <span>ClientHub</span>
            </div>
            <ul class="nav-links">
                <li>
                    <router-link to="/dashboard" class="nav-link">
                        Clientes
                    </router-link>
                </li>
                <li>
                    <router-link to="/admin" class="nav-link">
                        Administração
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="nav-right">
            <button class="logout-btn" @click="logout">
              Sair
            </button>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px; /* altura fixa */
    background: #0b1120;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    z-index: 1000;
    box-sizing: border-box;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.logo {
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 16px;
    margin: 0;
    padding: 0;
}

.nav-link {
    color: #cbd5e1; 
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.nav-link:hover {
    background: #1e293b;
    color: white;
}

.nav-right {
    display: flex;
}

.logout-btn {
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #f87171;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.logout-btn:hover {
    background: rgba(220, 38, 38, 0.2);
    border-color: #dc2626;
    color: #dc2626;
}

@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        height: auto;
        padding: 15px;
        gap: 10px;
    }
    .nav-left {
        flex-direction: column;
        gap: 10px;
    }
    .nav-links {
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }
    .nav-right {
        width: 100%;
        justify-content: center;
    }
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: white;
}
</style>