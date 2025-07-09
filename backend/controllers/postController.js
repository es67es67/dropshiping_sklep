const Post = require('../models/postModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// Utwórz nowy post
exports.createPost = async (req, res) => {
  try {
    const { content, images, tags, isPublic } = req.body;
    const author = req.userId;
    
    const post = new Post({
      author,
      content,
      images: images || [],
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    await post.save();
    
    // Pobierz post z danymi autora
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar');
    
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz posty (feed)
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { isPublic: true };
    
    // Jeśli podano userId, pobierz posty konkretnego użytkownika
    if (userId) {
      query.author = userId;
    }
    
    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz posty użytkownika
exports.getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ author: req.userId })
      .populate('author', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments({ author: req.userId });
    
    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz konkretny post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar');
    
    if (!post) {
      return res.status(404).json({ error: 'Post nie został znaleziony' });
    }
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Polub/odlub post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post nie został znaleziony' });
    }
    
    const userId = req.userId;
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      
      // Utwórz powiadomienie dla autora postu
      if (post.author.toString() !== userId) {
        const notification = new Notification({
          recipient: post.author,
          sender: userId,
          type: 'like',
          post: post._id,
          message: 'polubił Twój post'
        });
        await notification.save();
      }
    }
    
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar');
    
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodaj komentarz
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post nie został znaleziony' });
    }
    
    const comment = {
      author: req.userId,
      content
    };
    
    post.comments.push(comment);
    await post.save();
    
    // Utwórz powiadomienie dla autora postu
    if (post.author.toString() !== req.userId) {
      const notification = new Notification({
        recipient: post.author,
        sender: req.userId,
        type: 'comment',
        post: post._id,
        message: 'skomentował Twój post'
      });
      await notification.save();
    }
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar');
    
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuń post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest autorem postu
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do usunięcia tego postu' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post został usunięty' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
