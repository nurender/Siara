const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload directory
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('✅ Uploads directory created:', UPLOAD_DIR);
}

// Upload single media
const uploadMedia = async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    console.log('User:', req.user);

    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { originalname, filename, mimetype, size } = req.file;
    const { folder, alt_text, caption } = req.body;
    console.log('✅ File received:', originalname, filename);

    // Get file URL
    const file_url = `/uploads/${filename}`;
    const file_type = mimetype.startsWith('image/') ? 'image' : 
                      mimetype.startsWith('video/') ? 'video' : 'document';

    // Save to database
    const [result] = await pool.query(
      `INSERT INTO media (original_name, file_name, file_url, file_type, mime_type, file_size, folder, alt_text, caption, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [originalname, filename, file_url, file_type, mimetype, size, folder || 'general', alt_text || '', caption || '', req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: result.insertId,
        original_name: originalname,
        file_name: filename,
        file_url,
        file_type,
        mime_type: mimetype,
        file_size: size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
};

// Upload multiple media
const uploadMultipleMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { folder } = req.body;
    const uploadedFiles = [];

    for (const file of req.files) {
      const { originalname, filename, mimetype, size } = file;
      const file_url = `/uploads/${filename}`;
      const file_type = mimetype.startsWith('image/') ? 'image' : 
                        mimetype.startsWith('video/') ? 'video' : 'document';

      const [result] = await pool.query(
        `INSERT INTO media (original_name, file_name, file_url, file_type, mime_type, file_size, folder, uploaded_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [originalname, filename, file_url, file_type, mimetype, size, folder || 'general', req.user.id]
      );

      uploadedFiles.push({
        id: result.insertId,
        original_name: originalname,
        file_name: filename,
        file_url,
        file_type
      });
    }

    res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
};

// Get all media
const getAllMedia = async (req, res) => {
  try {
    const { folder, file_type, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM media WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM media WHERE 1=1';
    const params = [];
    const countParams = [];

    if (folder && folder !== 'all') {
      query += ' AND folder = ?';
      countQuery += ' AND folder = ?';
      params.push(folder);
      countParams.push(folder);
    }

    if (file_type && file_type !== 'all') {
      query += ' AND file_type = ?';
      countQuery += ' AND file_type = ?';
      params.push(file_type);
      countParams.push(file_type);
    }

    if (search) {
      query += ' AND (original_name LIKE ? OR alt_text LIKE ? OR caption LIKE ?)';
      countQuery += ' AND (original_name LIKE ? OR alt_text LIKE ? OR caption LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [media] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: media,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
};

// Get single media
const getMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const [media] = await pool.query(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      data: media[0]
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
};

// Update media details
const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { alt_text, caption, folder } = req.body;

    await pool.query(
      'UPDATE media SET alt_text = ?, caption = ?, folder = ?, updated_at = NOW() WHERE id = ?',
      [alt_text, caption, folder, id]
    );

    res.json({
      success: true,
      message: 'Media updated successfully'
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update media'
    });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Get file info first
    const [media] = await pool.query('SELECT file_name FROM media WHERE id = ?', [id]);

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Delete file from storage
    const filePath = path.join(UPLOAD_DIR, media[0].file_name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.query('DELETE FROM media WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media'
    });
  }
};

// Delete multiple media
const deleteMultipleMedia = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No media IDs provided'
      });
    }

    // Get file info
    const [media] = await pool.query(
      `SELECT id, file_name FROM media WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    // Delete files from storage
    for (const item of media) {
      const filePath = path.join(UPLOAD_DIR, item.file_name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from database
    await pool.query(
      `DELETE FROM media WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    res.json({
      success: true,
      message: `${ids.length} media files deleted successfully`
    });
  } catch (error) {
    console.error('Delete multiple media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media'
    });
  }
};

// Get folders
const getFolders = async (req, res) => {
  try {
    const [folders] = await pool.query(
      'SELECT DISTINCT folder, COUNT(*) as count FROM media GROUP BY folder ORDER BY folder'
    );

    res.json({
      success: true,
      data: folders
    });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch folders'
    });
  }
};

// Create folder
const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    // Just return success - folders are created implicitly when media is uploaded
    res.json({
      success: true,
      message: 'Folder created successfully',
      data: { name }
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create folder'
    });
  }
};

module.exports = {
  uploadMedia,
  uploadMultipleMedia,
  getAllMedia,
  getMedia,
  updateMedia,
  deleteMedia,
  deleteMultipleMedia,
  getFolders,
  createFolder
};

