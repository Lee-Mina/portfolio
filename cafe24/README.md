# 주연샵 헤더/네비 리뉴얼 (Cafe24 붙여넣기용)

Figma "주연테크 리브랜딩" 스타일 가이드 기준. **클래스명은 기존 스킨 그대로 유지**했고,
색·폰트는 토큰 파일 하나(`jy-tokens.css`)로 관리해 운영 보수가 쉽도록 구성했습니다.

## 파일
| 파일 | 카페24 경로 | 역할 |
|---|---|---|
| `_wg/css/jy-tokens.css` | `/_wg/css/jy-tokens.css` | **디자인 토큰**(색/타이포/라운드). 가장 먼저 로드 |
| `_wg/import/header.html` | `/_wg/import/header.html` | 한 줄 헤더(로고·주메뉴·아이콘) |
| `_wg/css/header.css` | `/_wg/css/header.css` | 헤더 + 모바일 전체메뉴 + 하단 네비 스타일 |
| `_wg/import/bottomnav.html` | `/_wg/import/bottomnav.html` | 모바일 전용 하단 고정 네비 |
| `_wg/css/footer.css` | `/_wg/css/footer.css` | 푸터(토큰 적용, 클래스명 유지, 배경 png 제거) |
| `_wg/css/jy-prdcard.css` | `/_wg/css/jy-prdcard.css` | 상품 카드(라운드16·이미지1:1·뱃지 pill·상품명 2줄) |
| `_wg/import/hero.html` | `/_wg/import/hero.html` | 메인 히어로(Display/XL 카피 + CTA). jy-main.css `.jy-hero` 재사용 |
| `_wg/import/catmenu.html` | `/_wg/import/catmenu.html` | 2단 카테고리 메뉴(모바일, **상품분류 자동 생성**) |
| `_wg/import/lineup.html` + `_wg/css/jy-lineup.css` | `/_wg/import/…`, `/_wg/css/…` | LINE UP 섹션(피처 배너 + 메인 진열 가로형 상품) |

## 적용 순서
1. **토큰 로드** — `base.html`(또는 공통 head) 최상단에 한 줄 추가:
   ```
   <!--@css(/_wg/css/jy-tokens.css)-->
   ```
   → 기존 `--jy-dark` 미정의로 흰 배경에 흰 글씨 되던 다크 섹션도 이걸로 해결됩니다.
2. **헤더 교체** — `/_wg/import/header.html` 내용을 이 파일로 교체.
3. **헤더 CSS 교체** — `/_wg/css/header.css` 교체.
4. **하단 네비 추가** — `basic/main.html`의 `</body>` 직전, `#wrap` 바깥에:
   ```
   <!--@import(/_wg/import/bottomnav.html)-->
   ```
   그리고 기존 header.html 안에 있던 `<nav class="jy-bottomnav">…</nav>` 블록은 삭제.
5. **2단 카테고리 메뉴 추가** — 같은 위치(`</body>` 직전)에 하단 네비와 함께:
   ```
   <!--@import(/_wg/import/bottomnav.html)-->
   <!--@import(/_wg/import/catmenu.html)-->
   ```
   하단 네비 "카테고리"와 헤더 햄버거(`.jy-catmenu-open`)로 열립니다.
   **메뉴 데이터 소스(2가지, 자동 선택):**
   - **자동(기본)** — 헤더의 `#category-lnb`(`Layout_category`) 상품분류를 읽음. 상품분류만
     등록하면 되고 코드 수정 불필요. 단 이 모듈은 **대분류(1단)만** 내보내므로 화면은
     "대분류 단일 리스트"로 나옵니다.
   - **2단(선택)** — `category_full_m`(전체메뉴 html버전)에 대·중·소 메뉴를 직접 작성한 뒤,
     `catmenu.html` 상단의 안내 주석 한 줄(hidden import)을 풀면 **대분류(왼쪽)+중·소분류(오른쪽)
     2단 메뉴**로 자동 전환됩니다. (`category_full_m` 실제 경로에 맞게 import 경로만 확인)
   - 두 소스 모두 **읽기 전용** — 카페24 모듈/원본은 수정하지 않습니다.

## 알아둘 점
- **메뉴 항목**은 `[상점관리 > 상품분류]`에서 관리 → 코드 수정 불필요.
- **로고 이미지**는 `[디자인 > 배너/팝업 > logo_ms]` 배너로 교체(투명 PNG).
- 주메뉴는 `category.html`이 `#category-lnb .d1-wrap` 구조라고 가정하고 스타일링했습니다.
  실제 출력이 다르면 `header.css`의 `.hd-nav a` 셀렉터만 실제 메뉴 링크에 맞춰 조정하세요.
- 장바구니 뱃지(`#hdCartCount` / `#jyBnCart`)는 카페24 장바구니 수량을 넣으면 표시됩니다(비어 있으면 자동 숨김).
- **상품 카드**(`jy-prdcard.css`)는 `.prdList` 공통 클래스를 기준으로 합니다. 카테고리/뱃지를 쓰려면
  카드 마크업에 `<p class="jy-cate">MONITOR</p>`, `<span class="jy-badge best">BEST</span>`를 추가하세요.
  실제 `prdList.html`의 상품명/가격/스펙 클래스가 다르면 `.name/.price/.spec` 셀렉터만 맞추면 됩니다.
- **푸터**(`footer.css`)는 클래스명·구조 그대로, 색/폰트/구분선만 토큰화했습니다.
  head에서 기존 `footer.css` 대신 이 파일을 로드하면 됩니다.
