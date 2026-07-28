// getList(목록 조회)가 돌려주는 item과, 같은 uid를 getItem(단건 조회)으로 다시
// 가져온 item을 비교해서, 마이그레이션 스크립트가 getList 결과의 data/publish를
// 그대로 믿고 되돌려써도 안전한지(= 필드가 축약되지 않는지) 확인하는 읽기 전용 스크립트.
//
// images 모델에서 가장 첫 항목 1개만 조회한다. 아무것도 쓰지 않는다.
//
// 사용법: node scripts/check-image-data-shape.js

require("dotenv").config();

const Mf = require("@rebel9/memex-fetcher");

const PROJECT_ID = "cbbcc6cd";
const MODEL_KEY = "images";

const memexFetcher = Mf.createMemexFetcher(
  process.env.MEMEX_TOKEN ?? ""
);

const main = async () => {
  if (!process.env.MEMEX_TOKEN) {
    throw new Error(
      "MEMEX_TOKEN 환경변수가 필요합니다 (.env 확인)"
    );
  }

  const listRes = await memexFetcher.getList(
    PROJECT_ID,
    MODEL_KEY,
    { size: 1, page: 0 }
  );
  const listResult = await listRes.json();
  const listItem = listResult.list?.[0];

  if (!listItem) {
    console.log("images 모델에 항목이 없습니다.");
    return;
  }

  const detailRes = await memexFetcher.getItem(
    PROJECT_ID,
    MODEL_KEY,
    listItem.uid
  );
  const detailItem = await detailRes.json();

  console.log("=== getList가 돌려준 항목 ===");
  console.log(JSON.stringify(listItem, null, 2));

  console.log(
    "\n=== 같은 uid를 getItem으로 다시 조회한 항목 ==="
  );
  console.log(JSON.stringify(detailItem, null, 2));

  const listKeys = Object.keys(listItem).sort();
  const detailKeys = Object.keys(detailItem).sort();
  const listDataKeys = Object.keys(
    listItem.data ?? {}
  ).sort();
  const detailDataKeys = Object.keys(
    detailItem.data ?? {}
  ).sort();

  const missingTopLevel = detailKeys.filter(
    (key) => !listKeys.includes(key)
  );
  const missingInData = detailDataKeys.filter(
    (key) => !listDataKeys.includes(key)
  );

  console.log("\n=== 비교 결과 ===");
  console.log(
    "최상위 키 - getList:",
    listKeys,
    "/ getItem:",
    detailKeys
  );
  console.log(
    "data 내부 키 - getList:",
    listDataKeys,
    "/ getItem:",
    detailDataKeys
  );
  console.log(
    "publish - getList:",
    listItem.publish,
    "/ getItem:",
    detailItem.publish
  );

  if (missingTopLevel.length > 0) {
    console.log(
      "\n⚠️  getList에는 없고 getItem에만 있는 최상위 키:",
      missingTopLevel
    );
  }

  if (missingInData.length > 0) {
    console.log(
      "⚠️  getList.data에는 없고 getItem.data에만 있는 키:",
      missingInData
    );
  }

  if (
    missingTopLevel.length === 0 &&
    missingInData.length === 0
  ) {
    console.log(
      "\ngetList와 getItem의 필드 구성이 동일합니다 - " +
        "마이그레이션 스크립트가 item.data/publish를 그대로 " +
        "재사용해도 안전할 가능성이 높습니다."
    );
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
