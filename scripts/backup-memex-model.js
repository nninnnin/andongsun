// memex 프로젝트(cbbcc6cd)의 임의 모델 전체를 JSON/CSV로 백업하는 읽기 전용 스크립트.
// 마이그레이션 작업 전에 원본 상태를 남겨두기 위한 용도. 아무것도 쓰지 않는다.
//
// getList(목록 조회)는 필드가 축약되어 올 수도 있다는 의심이 있어서(아직 미확인),
// 백업의 신뢰도를 위해 uid만 목록에서 뽑고 항목마다 getItem(단건 조회)으로
// 완전한 데이터를 다시 가져온다.
//
// 사용법: node scripts/backup-memex-model.js <images|articles|tags|...>
// 결과: backups/<model>/<model>-YYYY-MM-DDTHH-mm-ss.json, backups/<model>/<model>-YYYY-MM-DDTHH-mm-ss.csv

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const Mf = require("@rebel9/memex-fetcher");

const PROJECT_ID = "cbbcc6cd";
const PAGE_SIZE = 50;
const BACKUPS_DIR = path.join(__dirname, "..", "backups");

const MODEL_KEY = process.argv[2];

if (!MODEL_KEY) {
  throw new Error(
    "모델 키를 인자로 넘겨주세요. 예: node scripts/backup-memex-model.js images",
  );
}

const memexFetcher = Mf.createMemexFetcher(
  process.env.MEMEX_TOKEN ?? "",
);

const fetchPage = async (page) => {
  const res = await memexFetcher.getList(
    PROJECT_ID,
    MODEL_KEY,
    {
      size: PAGE_SIZE,
      page,
    },
  );

  const result = await res.json();

  return result.list ?? [];
};

const fetchAllUids = async () => {
  const uids = [];
  let page = 0;

  while (true) {
    const items = await fetchPage(page);

    if (items.length === 0) break;

    uids.push(...items.map((item) => item.uid));
    page += 1;
  }

  return uids;
};

const fetchFullItem = async (uid) => {
  const res = await memexFetcher.getItem(
    PROJECT_ID,
    MODEL_KEY,
    uid,
  );

  return res.json();
};

const csvEscape = (value) => {
  const stringified =
    value === undefined || value === null
      ? ""
      : String(value);

  if (/[",\n]/.test(stringified)) {
    return `"${stringified.replace(/"/g, '""')}"`;
  }

  return stringified;
};

const toCsvRow = (item) => {
  const fields = [
    item.uid,
    item.publish,
    item.order,
    item.createdAt,
    item.updateAt,
    JSON.stringify(item.data ?? {}),
  ];

  return fields.map(csvEscape).join(",");
};

const buildCsv = (items) => {
  const header = [
    "uid",
    "publish",
    "order",
    "createdAt",
    "updateAt",
    "dataJson",
  ].join(",");

  const rows = items.map(toCsvRow);

  return [header, ...rows].join("\n");
};

const timestamp = () =>
  new Date().toISOString().replace(/[:.]/g, "-");

const main = async () => {
  if (!process.env.MEMEX_TOKEN) {
    throw new Error(
      "MEMEX_TOKEN 환경변수가 필요합니다 (.env 확인)",
    );
  }

  console.log(`"${MODEL_KEY}" 모델 목록 조회 중...`);

  const uids = await fetchAllUids();

  console.log(
    `${uids.length}건 발견. 각 항목 상세 조회 중...`,
  );

  const items = [];

  for (const uid of uids) {
    try {
      items.push(await fetchFullItem(uid));
    } catch (error) {
      console.error(`[error] uid=${uid}`, error);
    }
  }

  const outputDir = path.join(BACKUPS_DIR, MODEL_KEY);

  fs.mkdirSync(outputDir, { recursive: true });

  const suffix = timestamp();
  const jsonPath = path.join(
    outputDir,
    `${MODEL_KEY}-${suffix}.json`,
  );
  const csvPath = path.join(
    outputDir,
    `${MODEL_KEY}-${suffix}.csv`,
  );

  fs.writeFileSync(
    jsonPath,
    JSON.stringify(items, null, 2),
  );
  fs.writeFileSync(csvPath, buildCsv(items));

  console.log(
    `완료. ${items.length}건 백업.\nJSON: ${jsonPath}\nCSV: ${csvPath}`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
