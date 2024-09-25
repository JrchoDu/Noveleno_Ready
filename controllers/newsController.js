const News = require('../models/News');
const User = require('../models/User');
const { Op } = require('sequelize'); // Import Op for Sequelize operators

// Helper function to calculate expiration date (e.g., 7 days from creation)
const calculateExpirationDate = () => {
  const expirationDays = 7; // News expires after 7 days (you can change this)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  return expirationDate;
};

class NewsController {
  // Get all news (filter out expired news and non-approved news)
  static async getAllNews(req, res) {
    try {
      const currentDate = new Date(); // Current date for expiration comparison
      const news = await News.findAll({
        where: {
          status: 1, // Only fetch news with status = 1
          expires_at: { [Op.gt]: currentDate } // Only fetch non-expired news
        }
      });

      const newsWithDetails = await Promise.all(news.map(async (newsItem) => {
        const user = await User.findByPk(newsItem.user_id);
        const fullName = user ? `${user.fullname}` : 'Unknown User';

        return {
          ...newsItem.toJSON(),
          user_fullname: fullName,
          barangay: newsItem.barangay,
        };
      }));

      return res.json(newsWithDetails);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch news.' });
    }
  }

  static async getPendingNews(req, res) {
    try {
      const currentDate = new Date(); // Current date for expiration comparison
      const news = await News.findAll({
        where: {
          status: 0, // Only fetch news with status = 0 (pending)
          expires_at: { [Op.gt]: currentDate } // Only fetch non-expired news
        }
      });

      const newsWithDetails = await Promise.all(news.map(async (newsItem) => {
        const user = await User.findByPk(newsItem.user_id);
        const fullName = user ? `${user.fullname}` : 'Unknown User';

        return {
          ...newsItem.toJSON(),
          user_fullname: fullName,
          barangay: newsItem.barangay,
        };
      }));

      return res.json(newsWithDetails);
    } catch (error) {
      console.error('Error fetching pending news:', error);
      return res.status(500).json({ error: 'Failed to fetch news.' });
    }
  }

  static async approveNews(req, res) {
    const { id } = req.params;
    try {
      // Log the id to verify it's being passed correctly
      console.log(`Attempting to approve news with ID: ${id}`);
      
      // Check if the news exists before attempting to update
      const newsItem = await News.findByPk(id);
      if (!newsItem) {
        return res.status(404).json({ error: 'News not found.' });
      }

      const [updated] = await News.update(
        { status: 1 }, // Set status to 1 (approved)
        { where: { id } }
      );

      if (updated === 0) {
        return res.status(404).json({ error: 'News not found.' });
      }

      return res.status(200).json({ message: 'News approved successfully.' });
    } catch (error) {
      console.error('Error approving news:', error);
      return res.status(400).json({ error: 'Failed to approve news.' });
    }
  }

  // Get news by ID
  static async getNewsById(req, res) {
    const { id } = req.params;
    try {
      const newsItem = await News.findByPk(id);
      if (!newsItem) {
        return res.status(404).json({ error: 'News not found.' });
      }
      return res.json(newsItem);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch news item.' });
    }
  }

  // Create news (with expiration date)
  static async createNews(req, res) {
    const { title, description, barangay, email, imageUrl, status } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }


      // Calculate expiration date
      const expires_at = calculateExpirationDate();

      // Create news object
      const newNews = {
        title,
        description,
        image_url: imageUrl,
        barangay,
        user_id: user.id,
        status,
        expires_at,  // Set expiration date
      };

      // Save new news item to the database
      const createdNews = await News.create(newNews);
      return res.status(201).json(createdNews);
    } catch (err) {
      console.error('Error creating news:', err);
      return res.status(500).json({ error: 'Failed to create news.' });
    }
  }

  // Update news by ID
  static async updateNews(req, res) {
    const { id } = req.params;
    const { title, description, image_url, barangay, user_id, status } = req.body;

    try {
      const [updated] = await News.update(
        { title, description, image_url, barangay, user_id, status },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({ error: 'News not found.' });
      }
      return res.status(200).json({ message: 'News updated successfully.' });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update news.' });
    }
  }

  // Delete news by ID
  static async deleteNews(req, res) {
    const { id } = req.params;
    try {
      const deleted = await News.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: 'News not found.' });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete news.' });
    }
  }
}

module.exports = NewsController;
