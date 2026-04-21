import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

function getEnv() {
    const endpoint = process.env.SUPABASE_S3_ENDPOINT;
    const region = process.env.SUPABASE_S3_REGION;
    const accessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.SUPABASE_S3_SECRET_ACCESS_KEY;
    const bucket = process.env.SUPABASE_S3_BUCKET ?? 'blog';
    const publicUrlBase =
        process.env.SUPABASE_PUBLIC_URL_BASE ??
        (endpoint ? endpoint.replace(/\/storage\/v1\/s3\/?$/, '/storage/v1/object/public') : '');
    return { endpoint, region, accessKeyId, secretAccessKey, bucket, publicUrlBase };
}

let clientInstance: S3Client | null = null;
let clientCacheKey = '';

export function getS3Client(): S3Client {
    const { endpoint, region, accessKeyId, secretAccessKey } = getEnv();
    if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
        throw new Error(
            'Supabase S3 환경변수가 설정되지 않았습니다. ' +
            'SUPABASE_S3_ENDPOINT, SUPABASE_S3_REGION, SUPABASE_S3_ACCESS_KEY_ID, SUPABASE_S3_SECRET_ACCESS_KEY 을 확인하세요.'
        );
    }
    // 환경변수가 바뀌면 클라이언트 재생성 (dev HMR 대응)
    const cacheKey = `${endpoint}|${region}|${accessKeyId}`;
    if (clientInstance && clientCacheKey === cacheKey) return clientInstance;
    clientInstance = new S3Client({
        endpoint,
        region,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
    });
    clientCacheKey = cacheKey;
    return clientInstance;
}

export function getBucket(): string {
    return getEnv().bucket;
}

export async function uploadToStorage(params: {
    key: string;
    body: Buffer | Uint8Array;
    contentType: string;
    cacheControl?: string;
}): Promise<string> {
    const client = getS3Client();
    await client.send(
        new PutObjectCommand({
            Bucket: getBucket(),
            Key: params.key,
            Body: params.body,
            ContentType: params.contentType,
            CacheControl: params.cacheControl ?? 'public, max-age=31536000, immutable',
        })
    );
    return getPublicUrl(params.key);
}

export async function deleteFromStorage(key: string): Promise<void> {
    const client = getS3Client();
    await client.send(
        new DeleteObjectCommand({
            Bucket: getBucket(),
            Key: key,
        })
    );
}

export function getPublicUrl(key: string): string {
    const { publicUrlBase, bucket } = getEnv();

    if (!publicUrlBase) {
        throw new Error('SUPABASE_PUBLIC_URL_BASE 를 설정하거나 SUPABASE_S3_ENDPOINT 를 올바르게 지정하세요.');
    }
    return `${publicUrlBase}/${bucket}/${key}`;
}
