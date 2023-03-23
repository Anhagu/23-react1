# 이재형

## [2023-03-23, 4주차 수업 내용]

### <JSX(JavaScript XML)>
JSX란? 자바스크립트와 XML/HTML을 함께 사용할 수 있는 자바스크립트 확장 문법
* JSX알려주는 React사이트  
https://ko.reactjs.org/docs/introducing-jsx.html

### JSX의 역할
1. JSX 내부적으로 xml/html 코드를 자바스크립트로 변환
2. React가 creatElement함수를 사용하여 자동으로 자바스크립트로 변환해준다.
3. js작업할 경우 createElement함수를 사용해야 한다.
4. JSX는 가독성을 높여 주는 역할을 한다.

### JSX의 장점
1. 코드가 간결해짐
2. 가독성이 향상됨
3. Injection Attack이라 불리는 해킹 방법을 방어함으로써 보안에 강함

### JSX 사용법
1. 모든 자바 스크립트 문법을 지원한다
2. 자바스크립트 문법에 XML과 HTML을 섞어서 사용한다.
3. 아래 코드의 2번 라인처럼 섞어서 사용하는 것이다.
4. 만일 HTML이나 xml에 자바스크립트 코드를 사용하고 싶으면 { }괄호를 사용한다.
* 만일 태그의 속성값을 넣고 싶을때는 다음과 같이 한다.  
큰따옴표 사이에 문자열을 넣거나  
``` const element = <div tabIndex="0"></div>; ```  
중괄호 사이에 자바스크립트 코드를 넣으면 됨  
``` const elemet = <img src={user.avatarUrl}></img> ```  

### (실습) JSX 코드 작성해보기
1. create-react-app으로 만든 프로젝트를 VSCode로 연다
2. src 디렉토리에 'chapter_03'이라는 디렉토리를 생성한다
3. 생성한 디렉토리에 Book.jsx라는 파일을 생성한다
4. 이 파일에 다음과 같이 코딩한다  

Book.jsx
```
import React from "react"

function Book(props) {
  return (
    <div>
      <h1>{`이 책의 이름은 ${props.name}입니다.`}</h1>
      <h2>{`이 책은 총 ${props.numOfPage}페이지로 이루어져있습니다.`}</h2>
    </div>
  )
}

export default Book
```
Library.jsx
```
import React from "react"

function Book(props) {
  return (
    <div>
      <h1>{`이 책의 이름은 ${props.name}입니다.`}</h1>
      <h2>{`이 책은 총 ${props.numOfPage}페이지로 이루어져있습니다.`}</h2>
    </div>
  )
}

export default Book
```
### 코드 작성후

1. 프로젝트 root의 index.js 파일을 오픈한다.
2. Library컴포넌트를 import한다.
3. render함수에서 App을 Library 컴포넌트로 수정한다
4. 이제 npm start로 app을 실행하고 결과를 확인한다

index.js
```
import Library from './chapter_03/Library'; // 2. Library 컨포넌트 import


<React.StrictMode>
    <Library /> // 3. render함수에서 App을 Library 컴포넌트로 수정
  </React.StrictMode>
```
---
## [2023-03-16, 3주차 수업 내용]

### <README.md 작성요령> (파일 이름은 대문자)
1. 이름 : h1
2. 강의 날자 : h2
3. 학습 내용(필수) : h2이하 사이즈 자유 사용
4. 작성 코드(선택)
5. 최근 내용이 위에 오도록 작성
6. 날자 별 구분이 잘 가도록 작성

개발환경을 자주 구축하거나 설정하기 편하게 하고 싶다면 패키지 매니저를 사용하는 것이 좋다.    
chocolatey는 윈도우 운영체제에서의 패키지 매니저이다.

### <node.js 버전 확인하는 방법>
  Git Bash에서 "node --version" 혹은 "node -v"를 입력하면 node.js의 버전을 확인할 수 있다.    
  *Node.js는 npm(node package manager)라는 패키지 매니저를 제공한다.

### <npm 버전 확인하는법>
  Git Bash에서 "npm --version" 혹은 "npm -v"를 입력하면 npm의 버전을 확인할 수 있다.

### <웹페이지의 구성요소 3가지>
  1. HTML   
    -웹사이트의 뼈대를 담당하는 마크업 언어    
    -태그를 사용해 웹사이트 구조를 만듬

  2. CSS    
    -웹사이트의 레이아웃과 디자인을 입히는 역할을 하는 언어

  3. JavaScript   
    -웹페이지에서 동적인 부분을 구현하기 위한 스크립트 언어

### <React(리엑트)>
#### 리액트의 정의
  -사용자 인터페이스를 만들기 위한 자바스크립트 라이브러리

#### 리액트 개념 정리
  -복잡한 사이트를 쉽고 빠르게 만들고, 관리하기 위해 만들어진것이 리액트   
  -다른 표현으로는 SPA를 쉽고 빠르게 만들 수 있도록 해주는 도구라고 생각하면 된다.

#### 리액트의 장점
  1. 빠른 업데이트와 렌더링 속도    
    -Virtual DOM으로 이를 가능하게 함    
    -DOM이란 XML, HTML 문서의 각 항목을 계층으로 표현하여 생성, 변형, 삭제할 수 있도록 돕는 인터페이스이다. 이 것은 W3C의 표준이다.    
    -Virtual DOM은 DOM 조작이 비효율적인 이유로 속도가 느리기 때문에 고안된 방법이다.    
    -DOM은 동기식, Virtual DOM은 비동기식 방법으로 렌더링을 한다.    
  *동기식 : 오브젝트가 변경되면 서버와 동기화 해야하기에 해당 작업이 완료될때 까지 다른 작업이 중단됨   
  *비동기식 : 오브젝트가 변경되면 해당 오브젝트만 다시 렌더링 하기에 다른 작업을 수행할 수도 있으며 작업속도가 빠름

  2. 컴포넌트 기반 구조   
    -리액트의 모든 페이지를 컴포넌트로 구성됩니다.   
    -하나의 컴포넌트는 다른 여러 개의 컴포넌트의 조합으로 구성할 수 있습니다.    
    -그래서 리액트로 개발을 하다 보면 레고 블록을 조립하는 것처럼 컴포넌트를 조합해서 웹사이트를 개발하게 됩니다.    
    -재사용성이 뛰어나다.    
  *컴포넌트 : 프로그램을 구성하는 모듈 단위   
  예시 : 웹에서는 로그인폼, 네비게이션바, 슬라이더등 페이지를 구성하는 여러 오브젝트들이 컴포넌트 요소로 구현 될 수 있다.

  3. 재사용성   
    -반복적인 작업을 줄여주기 때문에 생산성을 높여 준다.   
    -또한 유지보수가 용이하다    
    -재사용이 가능 하려면 해당 모듈의 의존성이 없어져야 한다.

  4. 든든한 지원군    
    -메타(구 페이스북)에서 오픈 소스 프로젝트로 관리하고있어 계속 발전하고 있다.

  5. 활발한 지식 공유 & 커뮤니티

  6. 모바일 앱 개발 가능    
    -리액트 네이티브라는 모바일 환경 UI프레임워크를 사용하면 크로스 플랫폼(cross-platform) 모바일 앱을 개발할 수 있다.

#### 리액트의 단점
  1. 방대한 학습량    
    - 자바스크립트를 공부한 경우 빠르게 학습할 수 있다.

  2. 높은 상태 관리 복잡도    
    - state, component life cycle 등의 개념이 있지만 그리 어렵지 않다.

### <React app 생성>
create-react-app은 local에 React를 개발하는데 필요한 모든 패키지를 설치하고 프로젝트를 생성해 준다.   
-> npx create-react-app {app 이름}

### <프로젝트 시작하는 법>
-> npm start
  
