const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
const modelsDir = path.join(uploadsDir, 'models');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
  if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true });
  console.log('[3DItems] Directories created/verified:', { modelsDir, thumbnailsDir });
} catch (err) {
  console.error('[3DItems] Error creating directories:', err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (file.fieldname === 'modelFile') {
        cb(null, modelsDir);
      } else {
        cb(null, thumbnailsDir);
      }
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    } catch (err) {
      cb(err, null);
    }
  },
});

const fileFilter = (req, file, cb) => {
  try {
    if (file.fieldname === 'modelFile') {
      const allowed = ['.glb', '.gltf', '.obj', '.fbx', '.stl', '.3ds'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid model file type: ${ext}`));
      }
    } else if (file.fieldname === 'thumbnailFile') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid image file type: ${file.mimetype}`));
      }
    } else {
      cb(null, true);
    }
  } catch (err) {
    cb(err, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const uploadFields = upload.fields([
  { name: 'modelFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 },
]);

const item3DSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sub: { type: String, trim: true, default: '' },
    cat: { type: String, required: true, lowercase: true },
    type: { type: String, lowercase: true, default: 'custom' },
    colorHex: { type: String, default: '#888888' },
    colorLabel: { type: String, default: '' },
    colorNum: { type: Number },
    desc: { type: String, required: true },
    dimensions: { type: String, default: '' },
    material: { type: String, default: '' },
    finish: { type: String, default: '' },
    frameSystem: { type: String, default: '' },
    polygonCount: { type: String, default: '' },
    modelFormat: { type: String, default: 'PBR Ready' },
    features: { type: [String], default: [] },
    modelUrl: { type: String, default: null },
    thumbnailUrl: { type: String, default: null },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

let Item3D;
try {
  Item3D = mongoose.model('Item3D');
} catch {
  Item3D = mongoose.model('Item3D', item3DSchema);
}

function hexToNum(hex) {
  try {
    return parseInt((hex || '#888888').replace('#', ''), 16);
  } catch {
    return 0x888888;
  }
}

function parseFeatures(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split('\n').map(s => s.trim()).filter(Boolean);
}

router.get('/', async (req, res) => {
  try {
    console.log('[3DItems] GET / - Fetching items');
    const items = await Item3D.find({ active: true }).sort({ createdAt: -1 });
    console.log(`[3DItems] GET / - Found ${items.length} items`);
    res.json(items);
  } catch (err) {
    console.error('[3DItems] GET / error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log(`[3DItems] GET /${req.params.id}`);
    const item = await Item3D.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('[3DItems] GET /:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      console.error('[3DItems] POST upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    try {
      const body = req.body;
      const modelFile = req.files?.modelFile?.[0];
      const thumbnailFile = req.files?.thumbnailFile?.[0];
      
      console.log('[3DItems] POST - Creating item:', body.name);
      console.log('[3DItems] POST - Model file:', modelFile?.filename);
      console.log('[3DItems] POST - Thumbnail file:', thumbnailFile?.filename);

      const item = new Item3D({
        name: body.name,
        sub: body.sub || '',
        cat: body.cat,
        type: body.type || 'custom',
        colorHex: body.colorHex || '#888888',
        colorLabel: body.colorLabel || '',
        colorNum: hexToNum(body.colorHex),
        desc: body.desc,
        dimensions: body.dimensions || '',
        material: body.material || '',
        finish: body.finish || '',
        frameSystem: body.frameSystem || '',
        polygonCount: body.polygonCount || '',
        modelFormat: body.modelFormat || 'PBR Ready',
        features: parseFeatures(body.features),
        modelUrl: modelFile ? `/uploads/models/${modelFile.filename}` : null,
        thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
      });

      await item.save();
      console.log('[3DItems] POST - Item saved successfully, modelUrl:', item.modelUrl);
      res.status(201).json(item);
    } catch (err) {
      console.error('[3DItems] POST save error:', err);
      res.status(400).json({ error: err.message });
    }
  });
});

router.put('/:id', (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      console.error('[3DItems] PUT upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    try {
      const item = await Item3D.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });

      const body = req.body;
      const modelFile = req.files?.modelFile?.[0];
      const thumbnailFile = req.files?.thumbnailFile?.[0];

      console.log('[3DItems] PUT - Updating item:', item.name);

      if (body.name !== undefined) item.name = body.name;
      if (body.sub !== undefined) item.sub = body.sub;
      if (body.cat !== undefined) item.cat = body.cat;
      if (body.type !== undefined) item.type = body.type;
      if (body.colorHex !== undefined) {
        item.colorHex = body.colorHex;
        item.colorNum = hexToNum(body.colorHex);
      }
      if (body.colorLabel !== undefined) item.colorLabel = body.colorLabel;
      if (body.desc !== undefined) item.desc = body.desc;
      if (body.dimensions !== undefined) item.dimensions = body.dimensions;
      if (body.material !== undefined) item.material = body.material;
      if (body.finish !== undefined) item.finish = body.finish;
      if (body.frameSystem !== undefined) item.frameSystem = body.frameSystem;
      if (body.polygonCount !== undefined) item.polygonCount = body.polygonCount;
      if (body.modelFormat !== undefined) item.modelFormat = body.modelFormat;
      if (body.features !== undefined) item.features = parseFeatures(body.features);

      if (modelFile) {
        if (item.modelUrl) {
          const oldPath = path.join(uploadsDir, 'models', path.basename(item.modelUrl));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('[3DItems] PUT - Deleted old model file:', oldPath);
          }
        }
        item.modelUrl = `/uploads/models/${modelFile.filename}`;
      }
      if (thumbnailFile) {
        if (item.thumbnailUrl) {
          const oldPath = path.join(uploadsDir, 'thumbnails', path.basename(item.thumbnailUrl));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('[3DItems] PUT - Deleted old thumbnail file:', oldPath);
          }
        }
        item.thumbnailUrl = `/uploads/thumbnails/${thumbnailFile.filename}`;
      }

      await item.save();
      console.log('[3DItems] PUT - Item updated successfully');
      res.json(item);
    } catch (err) {
      console.error('[3DItems] PUT error:', err);
      res.status(400).json({ error: err.message });
    }
  });
});

router.post('/:id/view', async (req, res) => {
  try {
    const item = await Item3D.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ views: item.views });
  } catch (err) {
    console.error('[3DItems] POST /view error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const item = await Item3D.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ likes: item.likes });
  } catch (err) {
    console.error('[3DItems] POST /like error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Item3D.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    console.log('[3DItems] DELETE - Deleting item:', item.name);

    if (item.modelUrl) {
      const modelPath = path.join(uploadsDir, 'models', path.basename(item.modelUrl));
      if (fs.existsSync(modelPath)) {
        fs.unlinkSync(modelPath);
        console.log('[3DItems] DELETE - Deleted model file:', modelPath);
      }
    }
    if (item.thumbnailUrl) {
      const thumbPath = path.join(uploadsDir, 'thumbnails', path.basename(item.thumbnailUrl));
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
        console.log('[3DItems] DELETE - Deleted thumbnail file:', thumbPath);
      }
    }

    await item.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('[3DItems] DELETE error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, Item3D };