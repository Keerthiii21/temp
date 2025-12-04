const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const zipsDir = path.join(uploadsDir, 'zips');
const piMapsDir = path.join(uploadsDir, 'pi_maps');

[uploadsDir, zipsDir, piMapsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer config for ZIP files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, zipsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}.zip`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.zip') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  }
});

/**
 * POST /api/zip/upload
 * Upload and extract a ZIP file containing pothole_map.html
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const zipPath = req.file.path;
    const timestamp = path.basename(zipPath, '.zip');
    const extractDir = path.join(piMapsDir, timestamp);

    // Create extraction directory
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }

    // Extract ZIP
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractDir, true);

    // Find pothole_map.html in extracted files
    let mapHtmlPath = null;
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file === 'pothole_map.html') {
          mapHtmlPath = filePath;
        }
      }
    };

    walkDir(extractDir);

    if (!mapHtmlPath) {
      return res.status(400).json({ success: false, message: 'pothole_map.html not found in ZIP' });
    }

    // Get relative path from uploads for URL
    const relativePath = path.relative(uploadsDir, mapHtmlPath).replace(/\\/g, '/');
    const mapUrl = `/uploads/${relativePath}`;

    res.json({
      success: true,
      mapUrl,
      timestamp,
      extractDir: relativePath
    });
  } catch (err) {
    console.error('ZIP upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
