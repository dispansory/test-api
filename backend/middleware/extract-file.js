const multer = require('multer');

const MIM_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIM_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type!");
    if (isValid) {
      error = null;
    }
    callBack(error, "images")
  },
  filename: (req, file, callBack) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIM_TYPE_MAP[file.mimetype];
    callBack(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({storage: storage}).single("image");
