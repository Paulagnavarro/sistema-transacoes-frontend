<template>
    <footer class="footer">
        <div class="footer-content">
            <span>© {{ new Date().getFullYear() }} ClientHub</span>
            <span class="footer-divider">•</span>
            <span>Desenvolvido por Paula Garcia Navarro</span>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    width: 100%;
    margin-top: 60px;
    padding: 20px 0;
    background: white;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
    text-align: center;
}

.footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #6b7280;
    flex-wrap: wrap;
}

.footer-divider {
   color: #d1d5db;
}
</style>