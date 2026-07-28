// 과거에 파일명을 key(data.name.KO)로 등록된 "images" 항목들을, 실제 파일을 내려받아
// 해시를 계산한 뒤 그 해시로 name.KO를 갱신하는 1회성 마이그레이션 스크립트.
//
// 이 작업 이후에는 uploadPendingMedia의 readImage(hash) dedup 조회가 과거 이미지에도
// 정상적으로 매치되어, 동일 이미지 재업로드 시 중복 등록되지 않는다.
//
// 실행 전 반드시 --apply 없이 먼저 돌려 dry-run 결과를 확인할 것.
//
// 사용법:
//   node scripts/migrate-image-keys-to-hash.js           (dry-run, 아무것도 바꾸지 않음)
//   node scripts/migrate-image-keys-to-hash.js --apply    (실제 반영)

require("dotenv").config();

const Mf = require("@rebel9/memex-fetcher");

const PROJECT_ID = "cbbcc6cd";
const MODEL_KEY = "images";
const PAGE_SIZE = 50;

const HASH_PATTERN = /^[0-9a-f]{64}$/;

const isApply = process.argv.includes("--apply");

const memexFetcher = Mf.createMemexFetcher(
  process.env.MEMEX_TOKEN ?? ""
);

const hashUrl = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `이미지를 내려받지 못했습니다 (${res.status}): ${url}`
    );
  }

  const buffer = await res.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    buffer
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const fetchPage = async (page) => {
  const res = await memexFetcher.getList(
    PROJECT_ID,
    MODEL_KEY,
    {
      size: PAGE_SIZE,
      page,
    }
  );

  const result = await res.json();

  return result.list ?? [];
};

const migrateItem = async (item) => {
  const currentName = item.data?.name?.KO ?? "";

  if (HASH_PATTERN.test(currentName)) {
    return { uid: item.uid, skipped: true };
  }

  const path = item.data?.path;

  if (!path) {
    console.warn(
      `[skip] path가 없는 항목 uid=${item.uid}`
    );

    return { uid: item.uid, skipped: true };
  }

  const hash = await hashUrl(path);

  console.log(
    `[${isApply ? "apply" : "dry-run"}] uid=${item.uid} "${currentName}" -> ${hash}`
  );

  if (!isApply) {
    return { uid: item.uid, skipped: false };
  }

  await memexFetcher.updateItem(
    PROJECT_ID,
    MODEL_KEY,
    JSON.stringify({
      publish: item.publish ?? true,
      uid: item.uid,
      data: {
        ...item.data,
        name: { KO: hash },
      },
    })
  );

  return { uid: item.uid, skipped: false };
};

const main = async () => {
  if (!process.env.MEMEX_TOKEN) {
    throw new Error(
      "MEMEX_TOKEN 환경변수가 필요합니다 (.env 확인)"
    );
  }

  console.log(
    isApply
      ? "APPLY 모드: 실제로 데이터를 갱신합니다."
      : "DRY-RUN 모드: 아무것도 바꾸지 않고 계산만 합니다. 실제 반영하려면 --apply를 붙이세요."
  );

  let page = 0;
  let migrated = 0;
  let skipped = 0;

  while (true) {
    const items = await fetchPage(page);

    if (items.length === 0) break;

    for (const item of items) {
      try {
        const { skipped: wasSkipped } =
          await migrateItem(item);

        if (wasSkipped) skipped += 1;
        else migrated += 1;
      } catch (error) {
        console.error(
          `[error] uid=${item.uid}`,
          error
        );
      }
    }

    page += 1;
  }

  console.log(
    `완료. 대상 ${migrated}건, 스킵(이미 해시이거나 path 없음) ${skipped}건.`
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
