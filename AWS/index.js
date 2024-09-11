import { GetObjectCommand, S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

import { getSignedUrl} from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
    region:process.env.BUCKET_NAME,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    });
    const url = getSignedUrl(s3Client, command, {expiresIn: 20}); // valid for 20sec
    return url;
}

async function putObject(filename, contentType){
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function ListObject(){
    const command = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        key:'/'
    })
    const result = await s3Client.send(command);
    console.log(result);
}

async function init3(){
    const cmd = new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: 'graphql.jpeg',
    });
    const data = await s3Client.send(cmd);
}
init3()

async function init1(){
    console.log("URL for graphql.jpeg", getObjectURL("graphql.jpeg"))
}
init1();


async function init2(){
    console.log("URL for uploading", putObject(`image-${Date.now()}.jpeg`, 'image/jpeg'))
}
init2();

