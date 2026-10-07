const products = [
  {
    id: 1,
    name: 'Classic Overshirt',
    category: 'ao',
    tag: 'Áo',
    price: 520000,
    oldPrice: 690000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Relaxed Denim',
    category: 'quan',
    tag: 'Quần',
    price: 610000,
    oldPrice: 820000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Soft Knit Dress',
    category: 'dam',
    tag: 'Đầm',
    price: 760000,
    oldPrice: 980000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Cotton Essential Tee',
    category: 'ao',
    tag: 'Áo',
    price: 390000,
    oldPrice: 520000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Tailored Trouser',
    category: 'quan',
    tag: 'Quần',
    price: 670000,
    oldPrice: 860000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Satin Midi Dress',
    category: 'dam',
    tag: 'Đầm',
    price: 820000,
    oldPrice: 1050000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 7,
    name: 'Street Layer Jacket',
    category: 'ao',
    tag: 'Áo',
    price: 900000,
    oldPrice: 1180000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 8,
    name: 'Wide Leg Pants',
    category: 'quan',
    tag: 'Quần',
    price: 590000,
    oldPrice: 760000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'
  }
];

const formatMoney = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);

const cartStorageKey = 'mini-fashion-cart';
let cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
let currentFilter = 'all';

const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartPanel = document.getElementById('cart-panel');
const openCartButton = document.getElementById('open-cart');
const closeCartButton = document.getElementById('close-cart');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

function getVisibleProducts() {
  const keyword = (searchInput?.value || '').trim().toLowerCase();

  return products.filter((product) => {
    const matchesFilter = currentFilter === 'all' || product.category === currentFilter;
    const matchesSearch = product.name.toLowerCase().includes(keyword);
    return matchesFilter && matchesSearch;
  });
}

function renderProducts() {
  if (!productGrid) return;

  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<div class="product-card"><div class="product-card-body"><h3>Không tìm thấy sản phẩm</h3></div></div>';
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-card-body">
            <span class="product-tag">${product.tag}</span>
            <h3>${product.name}</h3>
            <div class="product-rating">★ ${product.rating}</div>
            <div class="product-footer">
              <div class="price-group">
                <span class="old-price">${formatMoney(product.oldPrice)}</span>
                <strong>${formatMoney(product.price)}</strong>
              </div>
              <button class="add-cart" data-id="${product.id}">Thêm</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function saveCart() {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function updateCart() {
  if (!cartItemsContainer || !cartTotal || !cartCount) return;

  const uniqueItems = cart.reduce((acc, item) => {
    const match = acc.find((entry) => entry.id === item.id);
    if (match) {
      match.quantity += item.quantity;
    } else {
      acc.push({ ...item, quantity: item.quantity || 1 });
    }
    return acc;
  }, []);

  const total = uniqueItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartItemsContainer.innerHTML = uniqueItems.length
    ? uniqueItems
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          if (!product) return '';

          return `
            <div class="cart-item">
              <img src="${product.image}" alt="${product.name}" />
              <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>${formatMoney(product.price)} × ${item.quantity}</p>
              </div>
              <button class="remove-item" data-id="${product.id}">Xóa</button>
            </div>
          `;
        })
        .join('')
    : '<p style="color: #6d6d6d;">Giỏ hàng đang trống.</p>';

  cartTotal.textContent = formatMoney(total);
  cartCount.textContent = uniqueItems.reduce((sum, item) => sum + item.quantity, 0);
  saveCart();
}

function addToCart(productId) {
  cart.push({ id: productId, quantity: 1 });
  updateCart();
  cartPanel.classList.add('open');
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

function toggleCart() {
  cartPanel.classList.toggle('open');
}

function initializeEvents() {
  if (openCartButton) openCartButton.addEventListener('click', toggleCart);
  if (closeCartButton) closeCartButton.addEventListener('click', toggleCart);

  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-cart');
    if (addButton) {
      addToCart(Number(addButton.dataset.id));
    }

    const removeButton = event.target.closest('.remove-item');
    if (removeButton) {
      removeFromCart(Number(removeButton.dataset.id));
    }

    const filterButton = event.target.closest('.filter-btn');
    if (filterButton) {
      currentFilter = filterButton.dataset.filter;
      filterButtons.forEach((button) =>
        button.classList.toggle('active', button === filterButton)
      );
      renderProducts();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', renderProducts);
  }

  document.querySelector('.newsletter-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button');
    button.textContent = 'Đã đăng ký';
    button.disabled = true;
  });
}

renderProducts();
updateCart();
initializeEvents();
