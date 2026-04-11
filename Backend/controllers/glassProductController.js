const GlassProduct = require('../models/GlassProduct');

const defaultGlassData = {
  name: "ALUX Glass Products",
  glassTypes: {
    "Clear Float Glass": {
      Standard: { "4": 130, "6": 210, "8": 290, "10": 350, "12": 500 },
      Premium: { "4": 170, "6": 300, "8": 400, "10": 500, "12": 750 }
    },
    "Tempered Glass": {
      Standard: { "5": 375, "6": 450, "8": 540, "12": 630 },
      Premium: { "5": 400, "6": 550, "8": 700, "12": 800 }
    },
    "Laminated Glass": {
      Standard: { "10": 500, "15": 900, "20": 1400 },
      Premium: { "10": 700, "15": 1400, "20": 2000 }
    },
    "Tinted Glass": {
      Standard: { "4": 370, "6": 450, "8": 600 },
      Premium: { "4": 450, "6": 600, "8": 800 }
    }
  }
};

exports.getGlassProducts = async (req, res) => {
  try {
    let glassData = await GlassProduct.findOne();
    
    if (!glassData) {
      glassData = new GlassProduct(defaultGlassData);
      await glassData.save();
    }
    
    res.json({ success: true, data: glassData });
  } catch (error) {
    console.error('Get glass products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGlassProducts = async (req, res) => {
  try {
    const { glassTypes } = req.body;
    
    let glassData = await GlassProduct.findOne();
    
    if (!glassData) {
      glassData = new GlassProduct({ glassTypes });
    } else {
      glassData.glassTypes = glassTypes;
      glassData.updatedAt = Date.now();
    }
    
    await glassData.save();
    
    res.json({ success: true, message: 'Glass prices updated successfully', data: glassData });
  } catch (error) {
    console.error('Update glass products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetGlassProducts = async (req, res) => {
  try {
    await GlassProduct.deleteMany();
    const glassData = new GlassProduct(defaultGlassData);
    await glassData.save();
    
    res.json({ success: true, message: 'Glass prices reset to default', data: glassData });
  } catch (error) {
    console.error('Reset glass products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};