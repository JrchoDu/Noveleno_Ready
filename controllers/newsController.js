const News = require('../models/News');
const User = require('../models/User');

// Get all news
const getAllNews = async (req, res) => {
    try {
        const news = await News.findAll();
        
        const newsWithFullNamesAndBarangays = await Promise.all(news.map(async (newsItem) => {
            const user = await User.findByPk(newsItem.user_id); 
            const fullName = user ? `${user.fullname}` : 'Unknown User'; 

            return {
                ...newsItem.toJSON(), 
                user_fullname: fullName, 
                barangay: newsItem.barangay
            };
        }));

        return res.json(newsWithFullNamesAndBarangays);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch news.' });
    }
};


// Get news by ID
const getNewsById = async (req, res) => {
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
};

// Create news
const createNews = async (req, res) => {
    const { title, description, barangay, email, imageUrl } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user_id = user.id;

        // Create news object
        const newNews = {
            title,
            description,
            image_url: imageUrl,
            barangay,
            user_id,
        };

        // Save new news item to the database
        const createdNews = await News.create(newNews);
        return res.status(201).json(createdNews);
    } catch (err) {
        console.error('Error creating news:', err);
        return res.status(500).json({ error: 'Failed to create news.' });
    }
};

// Update news by ID
const updateNews = async (req, res) => {
    const { id } = req.params;
    const { title, description, image_url, barangay, user_id } = req.body;

    try {
        const [updated] = await News.update(
            { title, description, image_url, barangay, user_id },
            { where: { id } }
        );

        if (!updated) {
            return res.status(404).json({ error: 'News not found.' });
        }
        return res.status(200).json({ message: 'News updated successfully.' });
    } catch (error) {
        return res.status(400).json({ error: 'Failed to update news.' });
    }
};

// Delete news by ID
const deleteNews = async (req, res) => {
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
};

module.exports = {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
};
