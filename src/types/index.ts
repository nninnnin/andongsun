// 이번 세션에 실제로 선택했지만 아직 서버에 등록되지 않은 파일.
// hash가 서버 조회/등록 키(정체성)이고, originalName은 화면에 보여줄 이름일 뿐이다.
export type MediaFile = {
  hash: string;
  originalName: string;
  file: File;
};

// 서버에 등록(기존 재사용 포함)이 끝난 미디어. path가 실제 표시용 경로.
export type UploadedMedia = {
  path: string;
  originalName: string;
};
