// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const loading = document.querySelector('.loading');

  // Função para esconder loading
  function hideLoading() {
    if (loading) {
      loading.style.display = 'none';
    }
  }

  // Esconder loading após 5 segundos (fallback)
  setTimeout(hideLoading, 5000);
});

