// AWS S3 설정
export const AWS_CONFIG = {
  region: 'ap-northeast-2', // 서울 리전
  bucketName: process.env.AWS_S3_BUCKET_NAME || 'your-bucket-name',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
};

// S3 URL 생성 헬퍼 함수
export const getS3Url = (key: string): string => {
  return `https://${AWS_CONFIG.bucketName}.s3.${AWS_CONFIG.region}.amazonaws.com/${key}`;
};
