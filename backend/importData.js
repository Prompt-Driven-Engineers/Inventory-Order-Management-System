const mysql = require('mysql2');
const fs = require('fs');
const csv = require('csv-parser');

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '765876',
  database: 'inventory_db'
});

// CSV Path
const filePath = './data/flipkart_com-ecommerce_sample.csv';

// Helper function to clean category
const extractCategory = (raw) => {
  if (!raw) return ['Unknown', 'Unknown'];
  try {
    const tree = JSON.parse(raw.replace(/'/g, '"'))[0];
    const parts = tree.split('>>').map(p => p.trim());
    const cat = parts[0] || 'Unknown';
    const sub = parts[1] || cat;
    return [cat, sub];
  } catch (e) {
    return ['Unknown', 'Unknown'];
  }
};

// Start Parsing CSV
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const name = row['product_name']?.trim().slice(0, 255);
    const description = row['description'] || null;
    const [category, subcategory] = extractCategory(row['product_category_tree']);
    const specifications = row['product_specifications'] ? JSON.stringify({ spec: row['product_specifications'] }) : JSON.stringify({});
    const images = row['image'] ? JSON.stringify([row['image']]) : null;
    const brand = row['brand']?.trim() || null;

    const query = `
      INSERT INTO inventory 
      (Name, Description, Category, Subcategory, Specifications, images, Brand) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name, description, category, subcategory, specifications, images, brand], (err) => {
      if (err) {
        console.error('Insert error:', err.sqlMessage);
      }
    });
  })
  .on('end', () => {
    console.log('CSV import completed ✅');
    db.end();
  });
