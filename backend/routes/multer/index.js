const express = require('express')
const router = express.Router();
const upload = require('../../modules/multer')

router.post('/single', upload.single('image'), async (req, res) => {
    const imageUrl = req.file.location;
    console.log(req.file);
    console.log(req.body);

    res.send({
        imageUrl: imageUrl,
        file: req.file,
        body: req.body
    });

})

module.exports = router;