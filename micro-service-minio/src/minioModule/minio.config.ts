export const minioConfig = {
  minioClientConfig: {
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
  },
  bucketName: 'test',
  folder: {
    VIDEOS: 'videos',
    IMGS: 'imgs',
  },
};
