// backup-memex-model.js(images)가 만든 JSON 백업을 입력으로 받아, 각 항목의
// data.path(서명된 CloudFront URL)로 실제 이미지 파일까지 내려받아
// backups/images/image-files-<timestamp>/ 아래에 저장하는 읽기 전용 스크립트.
// 파일명은 data.hash를 사용해서 동일 이미지 중복 저장을 피한다.
//
// 사용법:
//   node scripts/backup-image-files.js                                 (backups/images/ 안의 가장 최근 images-*.json 사용)
//   node scripts/backup-image-files.js backups/images/images-xxx.json   (특정 JSON 지정)

const fs = require("fs");
const path = require("path");

const IMAGES_BACKUP_DIR = path.join(
  __dirname,
  "..",
  "backups",
  "images",
);
const CONCURRENCY = 5;

const findLatestBackupJson = () => {
  const files = fs
    .readdirSync(IMAGES_BACKUP_DIR)
    .filter(
      (name) =>
        name.startsWith("images-") && name.endsWith(".json"),
    )
    .sort();

  const latest = files.at(-1);

  if (!latest) {
    throw new Error(
      `${IMAGES_BACKUP_DIR} 에서 images-*.json 백업 파일을 찾지 못했습니다.`,
    );
  }

  return path.join(IMAGES_BACKUP_DIR, latest);
};

const extFromUrl = (url) => {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname);

  return ext || ".bin";
};

const downloadImage = async (item, outputDir) => {
  const hash = item.data?.hash;
  const url = item.data?.path;

  if (!hash || !url) {
    return {
      uid: item.uid,
      skipped: true,
      reason: "hash 또는 path 없음",
    };
  }

  const filePath = path.join(outputDir, `${hash}${extFromUrl(url)}`);

  if (fs.existsSync(filePath)) {
    return { uid: item.uid, skipped: true, reason: "이미 존재함" };
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`다운로드 실패 (${res.status}): ${url}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return { uid: item.uid, skipped: false };
};

const runWithConcurrency = async (items, worker, concurrency) => {
  const results = [];
  let cursor = 0;

  const runNext = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;

      results[index] = await worker(items[index]);
    }
  };

  await Promise.all(
    Array.from({ length: concurrency }, runNext),
  );

  return results;
};

const timestamp = () =>
  new Date().toISOString().replace(/[:.]/g, "-");

const main = async () => {
  const jsonPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : findLatestBackupJson();

  console.log(`입력 JSON: ${jsonPath}`);

  const items = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const outputDir = path.join(
    IMAGES_BACKUP_DIR,
    `image-files-${timestamp()}`,
  );

  fs.mkdirSync(outputDir, { recursive: true });

  console.log(
    `${items.length}건 대상, 동시 다운로드 ${CONCURRENCY}개씩 진행 중...`,
  );

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  const results = await runWithConcurrency(
    items,
    async (item) => {
      try {
        const result = await downloadImage(item, outputDir);

        if (result.skipped) {
          skipped += 1;
        } else {
          downloaded += 1;
        }

        return result;
      } catch (error) {
        failed += 1;
        console.error(`[error] uid=${item.uid}`, error.message);

        return { uid: item.uid, skipped: true, reason: "error" };
      }
    },
    CONCURRENCY,
  );

  void results;

  console.log(
    `완료. 다운로드 ${downloaded}건, 스킵 ${skipped}건, 실패 ${failed}건.\n저장 위치: ${outputDir}`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
