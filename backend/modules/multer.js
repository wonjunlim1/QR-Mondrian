const multer = require('multer');
const multerS3 = require('multer-s3');
const { MainMenu } = require("../models");
const { S3Client } = require('@aws-sdk/client-s3');
const sequelize = require("sequelize");
const webMenuService = require('../service/webMenuService')

// S3Client.config.loadFromPath(__dirname + '/../config/s3.json');

const s3 = new S3Client(
    {
        region: 'ap-northeast-2',
        credentials: {
            accessKeyId: "",
            secretAccessKey: "",
        },
        sslEnabled: false,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
    }

);


function getMaxMenuId() {
    return MainMenu.findOne({
        attributes: [
            [sequelize.fn('MAX', sequelize.col('id')), 'maxId'],
        ],
        raw: true
    })
        .then((result) => {
            return result.maxId + 1;
        })
        .catch((error) => {
            console.error('Error while retrieving max id from MainMenu table:', error);
            throw error;
        });
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

