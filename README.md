안동선 기자님을 위한 웹사이트.

기획 / 디자인 : 김대순  
개발 : 이동규

---

### 이미지 저장에 관하여

- 에디터에서 이미지를 추가한다.

  - 몇 가지 일이 일어난다.
  - `mediaState` 에 파일 이름과 파일을 추가한다. 추후 등록 시 파일을 가져오기 위함
  - 에디터에 임시로 보여줄 이미지로 `file` 을 `base64` 형태로 변환하여 그려준다. 이 때, 태그에 `data-name` 속성으로 파일 이름을 추가해둔다. 추후 이 이름으로 `mediaState` 에서 파일을 가져온다.

- 글을 저장할 때,
  - 이미지 태그들을 모두 긁어온다.
  - 해당 이미지 이름으로 미믹스 `images` 모델을 검색한다. 이미 있다면 이미지 패스를 가져온다.
  - 이미지 패스를 가져올 수 없었던 이미지들을 골라낸다.
  - `registerImage` 함수를 사용해 해당 이미지들을 등록한다.
    - 등록 시에 받은 path는 `images` 모델에 이미지 이름과 함께 저장하도록 한다.
  - images 모델에서 받아오거나 새롭게 register해서 받아온 path들을 태그의 src에 갈아끼운다.
  - 다른 정보들과 함께 글을 저장
