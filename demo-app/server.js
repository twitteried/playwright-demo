const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const { users } = require('./data/users');
const { products } = require('./data/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'e2e-testing-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check if user exists and password matches
  const user = Object.values(users).find(user => 
    user.username === username && user.password === password
  );
  
  if (user) {
    // Store user in session
    req.session.user = {
      username: user.username,
      role: user.role,
      email: user.email
    };
    
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard route
app.get('/dashboard', requireAuth, (req, res) => {
  // Generate recent activity based on user role
  let recentActivity = [];
  const now = new Date();
  
  if (req.session.user.role === 'admin') {
    recentActivity = [
      { text: 'New user registered', time: new Date(now - 30 * 60000).toLocaleTimeString() },
      { text: 'System update completed', time: new Date(now - 2 * 60 * 60000).toLocaleTimeString() },
      { text: 'Weekly report generated', time: new Date(now - 5 * 60 * 60000).toLocaleTimeString() }
    ];
  } else if (req.session.user.role === 'manager') {
    recentActivity = [
      { text: 'Inventory updated', time: new Date(now - 45 * 60000).toLocaleTimeString() },
      { text: 'Staff meeting scheduled', time: new Date(now - 3 * 60 * 60000).toLocaleTimeString() },
      { text: 'Sales report viewed', time: new Date(now - 6 * 60 * 60000).toLocaleTimeString() }
    ];
  } else {
    recentActivity = [
      { text: 'Order #1234 placed', time: new Date(now - 20 * 60000).toLocaleTimeString() },
      { text: 'Wishlist updated', time: new Date(now - 2 * 60 * 60000).toLocaleTimeString() },
      { text: 'Profile information updated', time: new Date(now - 4 * 60 * 60000).toLocaleTimeString() }
    ];
  }
  
  const stats = [
    { label: 'Orders', value: '24' },
    { label: 'Revenue', value: '$1,284.50' },
    { label: 'Products', value: '186' },
    { label: 'Customers', value: '52' }
  ];
  
  res.render('dashboard', { 
    user: req.session.user,
    recentActivity,
    stats
  });
});

// Products route
app.get('/products', requireAuth, (req, res) => {
  let filteredProducts = [...products];
  const { category, sort, search } = req.query;
  
  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Search products
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort products
  if (sort) {
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }
  
  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(product => product.category))];
  
  res.render('products', { 
    user: req.session.user, 
    products: filteredProducts,
    categories,
    selectedCategory: category || 'all',
    searchTerm: search || '',
    sortOption: sort || 'none'
  });
});

// Add to cart route (just returns success response)
app.post('/api/cart/add', requireAuth, (req, res) => {
  res.json({ success: true, message: 'Product added to cart' });
});

// Products create route - only for admin and manager
app.get('/products/create', requireAuth, (req, res) => {
  if (req.session.user.role === 'customer') {
    return res.status(403).send('Access denied');
  }
  
  res.render('product-create', { 
    user: req.session.user,
    categories: [...new Set(products.map(product => product.category))]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
