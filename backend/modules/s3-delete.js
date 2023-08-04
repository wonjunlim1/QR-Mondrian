const { DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const sequelize = require("sequelize");
const CONFIG = require("../config/s3");
const aws = require('aws-sdk');

const s3 = new S3Client({
    region: CONFIG.region,
    credentials: {
        accessKeyId: CONFIG.accessKeyId,
        secretAccessKey: CONFIG.secretAccessKey,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
})


exports.deleteFileFromS3 = (key, next) => {
    const deleteParams = new DeleteObjectCommand({
        Bucket: "spqr-menu",
        Key: key,
    });
    const response = s3.send(deleteParams);

}