<script>
  import { onMount } from 'svelte';
  import { Search, User, ChevronDown, LogOut } from 'lucide-svelte';

  let showCategories = false;
  let showProfile = false;
  let searchTerm = '';
  let userInfo = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/user-info'); // Ajusta esta URL a tu endpoint real
      if (!response.ok) {
        throw new Error('Error al obtener información del usuario');
      }
      userInfo = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  });

  async function handleSearch(event) {
    event.preventDefault();
    try {
      const response = await fetch('/api/search-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      const results = await response.json();
      console.log('Resultados de búsqueda:', results);
      // Aquí deberías manejar los resultados, por ejemplo, actualizando el estado de tu aplicación
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }
      // Redirige al usuario a la página de login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error);
    }
  }
</script>

<style>
  /* Estilos encapsulados para el navbar */
  :global(.navbar) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: #fff;
  }
  :global(.navbar-container) {
    display: flex;
    justify-content: space-around;
    align-items: stretch;
  }
  :global(.navbar-menu) {
    display: flex;
    align-items: stretch;
  }
  :global(.navbar-dropdown) {
    position: relative;
  }
  :global(.navbar-dropdown-content) {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 0;
    z-index: 1;
  }
  :global(.navbar-search) {
    flex-grow: 5;
    margin: 0 1rem;
  }
  :global(.navbar-profile) {
    position: relative;
  }
  :global(.navbar-profile-content) {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    z-index: 1;
  }
</style>

<nav class="navbar bg-blue-600 p-4">
  <div class="navbar-container container mx-auto">
    <div class="navbar-menu">
      <a href="/productos" class="text-white font-bold mr-4">Inicio</a>
      <div class="navbar-dropdown">
        <button 
          on:click={() => showCategories = !showCategories}
          class="text-white flex items-center"
        >
          Categorías <ChevronDown class="ml-1" />
        </button>
        {#if showCategories}
          <div class="navbar-dropdown-content">
            {#each ['Moda', 'Hogar', 'Tecnología', 'Belleza'] as category}
              <a 
                href="/categoria/{category.toLowerCase()}"
                class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                {category}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <form on:submit|preventDefault={handleSearch} class="navbar-search">
      <div class="relative">
        <input
          type="text"
          placeholder="Buscar productos..."
          class="w-full py-2 px-4 rounded-full"
          bind:value={searchTerm}
        />
        <button type="submit" class="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Search class="text-gray-500" />
        </button>
      </div>
    </form>

    <div class="navbar-profile">
      <button 
        on:click={() => showProfile = !showProfile}
        class="text-white flex items-center"
      >
        <User class="mr-2" /> Perfil
      </button>
      {#if showProfile && userInfo}
        <div class="navbar-profile-content">
          <p class="font-bold">{userInfo.nombre} {userInfo.apellido}</p>
          <p>Rol: {userInfo.rol.join(', ')}</p>
          <p>Teléfono: {userInfo.telefono}</p>
          <button 
            on:click={handleLogout}
            class="mt-2 flex items-center text-red-600 hover:text-red-800"
          >
            <LogOut class="mr-2" /> Cerrar sesión
          </button>
        </div>
      {/if}
    </div>
  </div>
</nav>