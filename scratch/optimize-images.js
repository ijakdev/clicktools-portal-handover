const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const https = require('https');

const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
const uploadsDir = path.resolve(__dirname, '..', 'public', 'uploads', 'blog');

const posts = [
  {
    id: 1,
    newFilename: 'thumbnail-image-optimization-efficiency.jpg',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
    alt: '이미지 최적화로 웹사이트 로딩 속도를 개선하는 방법 안내 이미지',
    caption: '이미지 용량을 줄이면 로딩 속도가 2배 빨라집니다.'
  },
  {
    id: 2,
    newFilename: 'pdf-merge-guide-online-tool.jpg',
    url: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop',
    alt: '복잡한 PDF 파일을 간편하게 하나로 합치는 가이드 이미지',
    caption: '프로그램 설치 없이 브라우저에서 10초 만에 PDF 합치기 완료'
  },
  {
    id: 3,
    newFilename: 'qr-code-marketing-strategy-cases.jpg',
    url: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=800&auto=format&fit=crop',
    alt: '오프라인 매장 매출을 올리는 QR 코드 마케팅 활용 사례',
    caption: '디지털 전환의 핵심, QR 코드를 활용한 스마트 매장 운영'
  },
  {
    id: 4,
    oldPath: '/uploads/blog/1775789269135-2026-04-10_11;45;00.PNG',
    newFilename: 'short-url-creator-guide.png',
    alt: '긴 URL 링크를 깔끔하게 단축하는 숏URL 만들기 방법',
    caption: '신뢰도를 높이는 깔끔한 링크 공유, 숏URL로 해결하세요.'
  },
  {
    id: 5,
    oldPath: '/uploads/blog/1775794183953-HXhJgIuUW4zX6wyth-A7_rsXEXmSthOPZ6SvTliux__UUW9h-PZ2-rR5Hak6M129Qbmtjtvy5HpAU__XRLRwu4nHVzp0pd7Xz7mUdTiKMTfsBi7TtOgbv5TRJp8G6y5UbqFp9EdF3n5vzwNDvYoyN-wJL2ZD7ZWKrlv9py28ooUo_GyZ5eYP_yTfyin-WTDT.jpeg',
    newFilename: 'smart-calculator-all-in-one-efficiency.jpeg',
    alt: '업무 효율을 2배 높여주는 스마트 계산기 기능 모음',
    caption: '단위 변환부터 대출 계산까지, 모든 계산을 한 번에 해결하세요.'
  },
  {
    id: 6,
    oldPath: '/uploads/blog/1776058083444-ChatGPT_Image_2026년_4월_13일_오후_02_27_54.png',
    newFilename: 'image-filename-seo-optimization-secret.png',
    alt: '검색 엔진 최적화를 위한 이미지 파일 이름 설정 방법 인포그래픽',
    caption: '파일 이름 하나가 검색 노출 결과의 차이를 만듭니다.'
  }
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function run() {
  const db = new sqlite3.Database(dbPath);

  // 1. Add columns if not exist
  await new Promise((resolve) => {
    db.serialize(() => {
      db.run("ALTER TABLE blog_posts ADD COLUMN image_alt TEXT", () => {});
      db.run("ALTER TABLE blog_posts ADD COLUMN image_caption TEXT", () => {
        resolve();
      });
    });
  });

  for (const post of posts) {
    const newPath = `/uploads/blog/${post.newFilename}`;
    const fullDest = path.join(uploadsDir, post.newFilename);

    if (post.url) {
      console.log(`Downloading ${post.url} -> ${fullDest}`);
      await download(post.url, fullDest);
    } else if (post.oldPath) {
      const oldFull = path.join(__dirname, '..', 'public', post.oldPath);
      if (fs.existsSync(oldFull)) {
        console.log(`Renaming ${oldFull} -> ${fullDest}`);
        fs.renameSync(oldFull, fullDest);
      } else {
          console.warn(`File not found: ${oldFull}`);
      }
    }

    console.log(`Updating DB for post ${post.id}`);
    await new Promise((resolve) => {
      db.run(
        "UPDATE blog_posts SET thumbnail = ?, image_alt = ?, image_caption = ? WHERE id = ?",
        [newPath, post.alt, post.caption, post.id],
        () => resolve()
      );
    });
  }

  db.close();
  console.log('Finished image processing and DB update.');
}

run().catch(console.error);
