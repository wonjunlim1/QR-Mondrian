const multer = require('multer');
const multerS3 = require('multer-s3');
const { MainMenu } = require("../models");
const { S3Client } = require('@aws-sdk/client-s3');
const sequelize = require("sequelize");
const CONFIG = require('../config/s3')

const s3 = new S3Client(
    {
        region: CONFIG.region,
        credentials: {
            accessKeyId: CONFIG.accessKeyId,
            secretAccessKey: CONFIG.secretAccessKey,
        },
        sslEnabled: false,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
    }

);

async function getMaxMenuId() {
    try {
        const maxMenuId = await MainMenu.findOne({
            attributes: [
                [sequelize.fn('MAX', sequelize.col('id')), 'maxId'],
            ],
            raw: true
        });

        return maxMenuId.maxId + 1;
    } catch (error) {
        console.error('Error while retrieving max id from MainMenu table:', error);
        throw error;
    }
}

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'spqr-menu',
        acl: 'public-read',
        key: function (req, file, cb) {

            let menuId;
            // If menu updated
            if (req.params.menu_id) {
                menuId = req.params.menu_id
                cb(null, req.params.restaurant_id + '/' + menuId + '.png');

            } else {
                // If new menu, get maxmenuId from Menu table
                getMaxMenuId()
                    .then((maxId) => {
                        menuId = maxId;
                        cb(null, req.params.restaurant_id + '/' + menuId + '.png');
                    })
                    .catch((error) => {
                        console.error('Error while retrieving max id:', error);
                        cb(error);
                    });
                return;
            }
        }
    })
});

module.exports = upload;

