<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Navbar from './components/Navbar.svelte';

  let products = [];
  let selectedProduct = null;
  let showModal = false;
  let currentUser = null;

  async function fetchProducts() {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      products = response.data.map(post => ({
        ...post,
        img: `https://picsum.photos/200/300?random=${post.id}`,
        name: post.title.slice(0, 20),
        price: `$${Math.floor(Math.random() * 100) + 1}`,
        sellerPhone: '1234567890' // Simulación, deberías reemplazarlo con datos reales.
      }));
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  }

  function openModal(product) {
    selectedProduct = product;
    showModal = true;
  }

  function closeModal() {
    selectedProduct = null;
    showModal = false;
  }

  async function sendWhatsAppMessage(to, from, productName) {
    // Simulación: Aquí es donde enviarías la solicitud al backend
    console.log(`Simulación: mensaje enviado a ${to} desde ${from} sobre el producto ${productName}`);
    return true;
  }

  async function handleContactClick(product) {
    if (!currentUser) {
      alert('Por favor, inicia sesión para contactar al vendedor.');
      return;
    }
    
    const success = await sendWhatsAppMessage(
      product.sellerPhone, 
      currentUser.whatsappNumber, 
      product.name
    );

    if (success) {
      alert('Mensaje enviado al vendedor. Pronto se pondrá en contacto contigo.');
    } else {
      alert('Hubo un problema al enviar el mensaje. Por favor, intenta más tarde.');
    }
  }

  async function fetchCurrentUser() {
    try {
      const response = await axios.get('/api/current-user'); // Simulación, deberías reemplazarlo con tu endpoint real.
      currentUser = response.data;
    } catch (error) {
      console.error('Error al recuperar al usuario actual:', error);
    }
  }

  onMount(() => {
    fetchProducts();
    fetchCurrentUser();
  });
</script>

<style>
  .app-container {
    padding-top: 60px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    background-color: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .card img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .contact-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #25D366;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    text-decoration: none;
    transition: background-color 0.3s;
    margin-top: 1rem;
  }

  .contact-button:hover {
    background-color: #128C7E;
  }

  .contact-button i {
    margin-right: 0.5rem;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    position: relative;
  }

  .modal-content img {
    max-width: 100%;
    height: auto;
  }

  .modal-content button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .modal-content button:hover {
    background-color: #0056b3;
  }

  footer {
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: center;
    border-top: 1px solid #ddd;
  }

  footer p {
    margin: 0;
    color: #6c757d;
  }

  footer a {
    color: #007bff;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }
</style>

<Navbar />

<div class="app-container">
  <h1>Productos</h1>
  <div class="grid">
    {#each products as product}
      <div class="card" on:click={() => openModal(product)}>
        <img src={product.img} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.price}</p>
        <button class="contact-button" on:click|stopPropagation={() => handleContactClick(product)}>
          <i class="fab fa-whatsapp"></i> Contactar al vendedor
        </button>
      </div>
    {/each}
  </div>

  {#if showModal}
    <div class="modal" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <button on:click={closeModal}>Cerrar</button>
        <h2>{selectedProduct.name}</h2>
        <img src={selectedProduct.img} alt={selectedProduct.name} />
        <p>{selectedProduct.body}</p>
        <p>Precio: {selectedProduct.price}</p>
        <button class="contact-button" on:click={() => handleContactClick(selectedProduct)}>
          <i class="fab fa-whatsapp"></i> Contactar al vendedor
        </button>
      </div>
    </div>
  {/if}
</div>

<footer>
  <p>© 2023 Tu Empresa. Todos los derechos reservados. | <a href="/privacy">Política de Privacidad</a></p>
</footer>
