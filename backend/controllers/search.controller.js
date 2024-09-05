const postgre = require('../config/database'); 

const searchController = {
  searchProducts: async (req, res) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ msg: 'No search query provided' });
      }

      // allow search by product name or description
      const searchQuery = `
        SELECT * FROM products 
        WHERE LOWER(name) LIKE $1 
        OR LOWER(description) LIKE $1
      `;
      
      const { rows } = await postgre.query(searchQuery, [`%${query.toLowerCase()}%`]);

      if (rows.length > 0) {
        return res.status(200).json({ data: rows });
      } else {
        return res.status(404).json({ msg: "No products found matching your search." });
      }

    } catch (error) {
      console.error("Error during search:", error);
      return res.status(500).json({ msg: `Internal Server Error: ${error.message}` });
    }
  },
};

module.exports = searchController;
