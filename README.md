# 이재형
## [2023-05-11, 11주차 수업 내용]

### <하위 컴포넌트에서 State 공유하기>
* 섭씨온도 값을 props로 받아서 물이 끓는지 안끓는지 문자열로 출력해주는 컴포넌트
```js
function BoilingVerdict(props){
    if(props.celsius >=100){
        return<p>물이 끓습니다</p>;
    }
    return <p>물이 끓지 않습니다.</p>;
}
```
```js
function Calculator(props){
    const[temperature,setTemperature]=useState('');
    const handleChange =(event)=>{
        setTemperature(event.target.value);
    }
    return(
        <fieldset>
        <legend>섭씨 온도를 입력하세요:</legend>
        <input
        value={temperature}
        onChange={handleChange}/>
        <BoilingVerdict
        celsius={parseFloat(temperature)}/>
        </fieldset>
    )
}
```

### <입력 컴포넌트 추출하기>
* 온도를 입력하기 위한 컴포넌트
```js
const scaleNames={
    c:'섭씨',
    f:'화씨'
};
function TemperatureInput(props){
     const[temperature,setTemperature]=useState('');
    const handleChange =(event)=>{
        setTemperature(event.target.value);
    
}
return(
    <fieldset>
    <legend>온도를 입력해주세요(단위:{scaleNames[props.scale]}):</legend>
    <input value={temperature}onChange={handleChange}/>
    </fieldset>
)
}
```
* 섭씨 또는 화씨로 입력 가능하도록 하는 컴포넌트
```js
function Calculator(props){
    return(
        <div>
        <TemperatureInput scale="c"/>
        <TemperatureInput scale="f"/>
        </div>
    )
}
```

### <온도 변환 함수 작성하기>
*섭씨 온도와 화씨 온도값을 동기화 시키기 위해서 각각 변환하는 함수를 작성해야 한다. 

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celcius) {
  return (celsius * 9 / 5) + 32;
}
```
* 위에서 만든 함수를 호출하는 함수
```js
function tryConvert(temperature,convert){
    const input=parseFloat(temperature);
    if(Number.isNaN(input)){
        return'';
    }
    const output =convert(input);
    const rounded=Math.round(output*1000)/1000;
    return rounded.toString();
}
```

* 만약 숫자가 아닌 값을 입력하면 empty string을 리턴하도록 예외 처리 하는 방식
```js
tryConvert('abc', toCelsius); // 'empty string 을 리턴'
tryConvert('10.22', toFahrenheit); // '50.396을 리턴'
```
### <Shared State 적용하기>
* 먼저 TemperatureInput 컴포넌트에서 온도 값을 가져오는 부분을 아래와 같이 수정해야 한다.
```js
return(
    // 변경 전:<input value={temperature} onChange={handleChange}/>
    <input value={props.temperature}onChange={handleChange}/>
)
```
입력된 값이 변경되었을때 상위 컴포넌트로 변경된 값을 전달해야하는데, 이를 위해 handleChange() 함수를 다음과 같이 변경해야 한다.
```js
const handleChange = (event) => {
  // 변경 전: setTemperature(event.target.value);
  props.onTemperatureChange(event.target.value);
}
```

```js
function TemperatureInput(props){
    const handelChange=(event)=>{
        props.onTemperatureChange(event.target.value);
    }

    return(
      <fieldset>
        <legend>온도를 입력해 주세요(단위:{scaleNames[props.scale]}):</legend>

        <input value={props.temperature} onChange={handleChange} />
      </fieldset>
    )
  }
```
### <Calculator 컴포넌트 변경하기>
* 변경된 TemperatureInput 컴포넌트에 맞춰서 변경된 Calculator 컴포넌트이다.
```javascript
function Calculator(props){
    const [temperature,setTemperature]=useState('');
    const [scale,setScale]=useState('c');

    const handleCelsiusChange=(temperature)=>{
        setScale('c');
        setTemperature(temperature);
    }

    const handleFahrenheitChange=(temperature)=>{
        setScale('f');
        setTemperature(temperature);
    }

    const celsius=scale==='f'?tryConvert(temperature,toCelsius):temperature;
    const fahrenheit=scale==='c'?tryConvert(temperature,toFahrenheit):temperature;

    return(
        <div>
        <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={handleCelsiusChange}/>
        <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={handleFahrenheitChange}/>
        <BoilingVerdict celcius={parseFloat(celcius)}/>
        </div>
    )
}
```
* 우선 state로 temperature의 scale을 선언하여 온도 값과 단위를 각각 저장하도록 하였고, 이 온도와 단위를 이용하여 변환 함수를 통해 섭씨온도와 화씨 온도를 구해서 사용한다.
* 각 컴포넌트가 state에 값을 갖고 있는 것이 아닌 공통된 상위 컴포넌트로 올려서 공유하는 방법을 사용하면 리액트에서 더욱 간결하고 효율적인 개발을 할 수 있다.

---
## [2023-05-04, 10주차 수업 내용]

###  <리스트와 키란?>
* 리스트는 자바스크립트의 변수나 객체를 하나의 변수로 묶어 놓은 배열과 같은 것이다.
* 키는 각 객체나 아이템을 구분할 수 있는 고유한 값을 의미한다.
* 리액트에서는 배열과 키를 사용하는 반복되는 다수의 엘리먼트를 쉽게 렌더링할 수 있다.

### <여러 개의 컴포넌트 렌더링 하기>
* 예의 에어비엔비의 화면처럼 같은 컴포넌트를 화면에 반복적으로 나타내야 할 경우 배열에 들어있는 엘리먼트를 map()함수를 이용하여 렌더링 한다.

* 다음은 number배열에 들어있는 각각의 요소를 map()를 이용하여 하나씩 추출하여, 2를 곱한 후 doubled라는 배열에 다시 넣는 코드이다.
```js
const doubled = numbers map((number) => number=2);

```
* 다음은 리액트에서 map()함수를 사용한 예제이다.
```js
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
)
```

* 이 코드는 numbers의 요소에 2를 곱하는 대신 <li>태그를 결합해서 리턴하고 있다.
* 리턴된 listItems는 <ul>태그와 결합하여 렌더링 된다.
```js
ReactDOM.render(
  <ul>
    <li>{1}</li>
    <li>{2}</li>
    <li>{3}</li>
    <li>{4}</li>
    <li>{5}</li>
  </ul>
  document.getElimentById('root')
);
```

### <기본적인 리스트 컴포넌트>
* 앞서 작성한 코드를 별도의 컴포넌트로 분리하면 다음과 같다.
* 이 컴포넌트는 props로 받은 숫자를 numbers로 받아 리스트로 렌더링 해준다.
```js
function NumberList(props) {
  const {numbers} = props;

  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );

  return(
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers = {numbers}/>
  document.getElementById('root')
);
```
* 이 코드를 실행하면 "리스트 아이템에 무조건 키가 있어야 한다" 는 경고 문구가 나온다.
* 경고 문구가 나오는 이유는 각각의 아이템에 key props가 없기 때문이다.

### <리스트의 키에 대해서 알아보기>
* 리스트에서의 키는 "리스트에서 아이템을 구별하기 위한 고유한 문자열" 이다.
* 이 키는 리스트에서 어떤 아이템이 변경, 추가 또는 제거되었는지 구분하기 위해 사용한다.
* 키는 같은 리스트에 있는 엘리먼트 사이에서만 고유한 값이면 된다.
* **키 값을 인덱스로 사용해도 되지만 권장하지 않는다**

### <폼이란?>
* 폼은 일반적으로 사용자로부터 입력을 받기위한 양식에서 많이 사용된다.
```js
<form>
  <label>
    이름:
    <input type="text" name="name" />
  </label>
  <button type="submit">제출</button>
</form>
```

### <제어 컴포넌트>
* 제어 컴포넌트는 사용자가 입력한 값에 접근하고 제어할 수 있도록 해주는 컴포넌트이다.
* 다음 코드는 사용자의 이름을 입력 받는 HTML 폼을 리액트 제어 컴포넌트로 만든 것이다.
```js
function NameForm(props) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleSubmit = (event) => {
    alert('입력한 이름: ' + value);
    event.preventDefault();
  }

  return (
    <form> onSubmit={handleSubmit}>
      <label>
        이름:
        <input type="text" value={value} onChange={handleChange} />
      </label>
      <button type="submit">제출</button>
    </form>
  )
}
```

### <textarea 태그>
* HTML에서는 textarea의 children으로 텍스트가 들어가는 형태이다.
``` js
<textarea>
안녕하세요,이렇게 텍스트가 들어갑니다.
</textarea>
```
* 리액트에서는 state를 통해 태그의 value라는 attribute를 변경하여 텍스트를 표시한다.
```js
function RequestForm(props) {
  const [value, setValue] = useState('요청사항을 요청하세요');

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleSubmit = (event) => {
    alert('입력한 요청사항: ' + value);
    event.preventDefault();
  }

  return (
    <form> onSubmit={handleSubmit}>
      <label>
        요청사항:
        <textarea value={value} onChange={handleChange} />
      </label>
      <button type="submit">제출</button>
    </form>
  )
}
```
### <select 태그>
* select 태그도 textarea와 동일하다.
```js
<select>
  <option value="apple">사과</option>
  <option value="banana">바나나</option>
  <option value="grape">포도</option>
  <option value="watermelon">수박</option>
</select>
```
```js
function FruitSelect(props) {
  const [value, setValue] = useState('grape');

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleSubmit = (event) => {
    alert('선택한 과일: ' + value);
    event.preventDefault();
  }

  return (
    <form> onSubmit={handleSubmit}>
      <label>
        과일을 선택하세요:
        <select value={value} onChange={handleChange} />
          <option value="apple">사과</option>
          <option value="banana">바나나</option>
          <option value="grape">포도</option>
          <option value="watermelon">수박</option>
        </select>
      </label>
      <button type="submit">제출</button>
    </form>
  )
}
```

### <File input 태그>
* File input 태그는 그 값이 읽기 전용이기 때문에 리액트에서는 비제어 컴포넌트가 된다.
```js
<input type="file" />
```

### <여러 개의 입력 다루기>
```js
function Reservation(props) {
  const [haveBreakfast, setHaveBreakfast] = useState('true');
  const [numberOfGuest, setNumberOfGuest] = useState(2);

  const handleChange = (event) => {
    alert(`아침식사 여부: ${haveBreakfast}, 방문객 수: ${numberofGuest}`);
    setValue(event.target.value);
    event.preventDefault();
  }

  return (
    <form> onSubmit={handleSubmit}>
      <label>
        아침식사 여부:
        <input
          type="checkbox"
          checked={haveBeakfast}
          onChange={(event)=> {
            setHaveBreakfast(event.target.checked);
          }} />
      </label>
      <br />
      <label>
        방문객 수:
        <input
          type="number"
          value={numberOfGuest}
          onChange={(event) => {
            setNumberOfGuest(event.target.value);
        }} />
      </label>
      <button type="submit">제출</button>
    </form>
  )
}
```

### <Input Null Value 설명>
* 제어 컴포넌트에 value prop을 정해진 값으로 넣으면 코드를 수정하지 않는 한 입력 값을 바꿀 수 없다.
* 만약 value prop은 넣되 자유롭게 입력할 수 있게 만들고 싶다면 값이 undefined 또는 null을 넣어주면 된다.
```js
ReactDom.render(<input value="hi" />, rootNode);

setTimeout(function(){
  ReactDom.render(<input value={null} />, rootNode);
}, 1000);
```

---

## [2023-04-27, 9주차 수업 내용]

### <이벤트 처리하기>

* DOM에서 클릭 이벤트를 처리하는 예제 코드
```js
<button onclick="activate()">
  Activate
</button>
```

* React에서 클릭 이벤트 처리하는 예제 코드
```js
<button onclick={activate}>
  Activate
</button>
```

* 둘의 차이점은
1. 이벤트 이름이 onclick에서 onClick으로 변경.(Camel case)
2. 전달하려는 함수는 문자열에서 함수 그대로 전달한다.

* 이벤트가 발생했을 때 해당 이벤트를 처리하는 함수를 "이벤트 핸들러(Event Handler)" 라고 한다. 또는 이벤트가 발생하는 것을 계속 듣고 있다는 의미로 "이벤트 리스너(Event Listener)"라고 부른다.

* 이벤트 핸들러 추가하는 방법은?
* 버튼을 클릭하면 이벤트 핸들러 함수인 handleClick()함수를 호출하도록 되어 있다.
* bind를 사용하지 않으면 this.handleClick은 글로벌 스코프에서 호출되어, undefined로 사용할 수 없기 때문이다.
* bind를 사용하지 않으려면 화살표 함수를 사용하는 방법도 있다.
* 하지만 클래스 컴포넌트는 이제 거의 사용하지 않기 때문에 이 내용은 참고만 한다.
```js
class Toggle extends React.Component(
  constructor(props) {
    super(props);

    this.state ={isToggleOn: true};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState =>({
      isToggleOn:!prevState.isToggleOn
    }));
  }

  render() {
    return(
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? '켜짐' : '꺼짐'}
      </button>
    );
  }
)
```

* 클래스형을 함수형으로 바꾸면 다음 코드와 같다.
* 함수형에서 이벤트 핸들러를 정의하는 방법은 두 가지이다.
* 함수형에서는 this를 사용하지 않고, onClick에서 바로 HandleClick을 넘기면 된다.
```js
function Toggle (props) {
  const [isToggleOn, setIsToggleOn] = useState(true);

  // 방법 1.함수 안에 함수로 정의
  function handleClick() {
    setIsToggleOn((isTogleOn) => !isToggleOn);
  }

  // 방법 2.row function을 사용하여 정의
  const handleClick = () => {
    setIsToggleOn((isToggleOn) => !isToggleOn);
  }

  return(
    <button onClick={handleClick}>
      {isToggleOn ? "켜짐" : "꺼짐"}
    </button>
  );
}

```

### <Argument 전달하기>
* 함수를 정의할 때는 
파라미터(Parameter)혹은 매개변수, 함수를 사용할 때는 아귀먼트(Argument) 혹은 인수 라고 부른다.
* 이벤트 핸들러에 매개변수를 전달해야 하는 경우도 많다
```js
<button onClick={(event) => this.deleteItem(id, event)}>삭제하기</button>
<button onClick={this.deleteItem.bind(this, id)}>삭제하기</button>
```
* 위의 코드는 모두 동일한 역할을 하지만 하나는 화살표 함수를, 다른 하나는 bind를 사용했다.
* event라는 매개변수는 리액트의 이벤트 객체를 의미 한다.
* 두 방법 모두 첫 번째 매개변수는 id이고 두번째 매개변수로 event가 전달된다.
* 첫번째 코드는 명시적으로 event를 매개변수로 넣어 주었고, 두 번째 코드는 id 이후 두번째 매개변수로 event가 자동 전달 된다.(이 방법은 클래스형에서 사용하는 방법이다.)
* 함수형 컴포넌트에서 이벤트 핸들러에 매개변수를 전달하는 아래의(254페이지) 코드와 같이 한다.
```js
fucntion MyButton(props) {
  const handleDelete = (id, event) => {
    console.log(id, event.target);
  };

  return(
    <button onClick={(event) => handleDelete(1, event)}>삭제하기</button>
  );
}
```

### <조건부 렌더링>
* 여기서 조건이란 우리가 알고 있는 조건문의 조건이다.
```js
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if(isLoggedIn) {
    return <USerGreeting />?
  }
  return <GuestGreeting />;
}
```
* props로 전달 받은 isLoggedIn이 true이면 <Usergreeting/>을, false면 <GuestGreeting/>을 return한다.
* 이와 같은 렌더링을 조건부 렌더링이라고 한다.

### <엘리먼트 변수>
* 렌더링해야 될 컴포넌트를 변수처럼 사용하는 방법이 엘리먼트 변수이다.
* 272페이지 코드처럼 state에 따라 button 변수에 컴포넌트 객체를 저장하여 return문에서 사용하고 있다.
```js
let button;
if (isloggedIn){
  button = <LogoutButton onClick={handleLogoutClick} />;
} else {
  button = <LoginButton onClick={handleLoginClick} />;
}

return (
  <div>
    <Greeting isLoggedIn={isLoggedIn} />
    {button}
  </div>
)
```

### <인라인 조건>
* 필요한 곳에 조건문을 직접 넣어 사용하는 방법이다.

1. 인라인 if
* if문을 직접 사용하지 않고, 동일한 효과를 내기 위해 && 논ㄹ 연산자를 사용한다.
* &&는 and연산자로 모든 조건이 참일때만 참이 된다.
* 첫 번째 조건이 거짓이면 두번째 조건은 판단할 필요가 없다. 단축평가.
```js
true && expression -> expression
false && expression -> false
```
```js
{unreadMessages.length > 0 &&
  <h2>
    현재 {unreadMessages.length}개의 읽지 않은 메시지가 있습니다.
  </h2>
}
```
* 판단만 하지 않는 것이고 결과 값은 그대로 리턴된다.(274 아래쪽 코드)

2. 인라인 if-else
* 삼항 연산자를 사용한다.
```
조건문 ? 참일경우 : 거짓일 경우
```
* 문자열이나 엘리먼트를 넣어서 사용할 수도 있다.
```js
function UserStatus(props) {
  return(
    <div>
      이 사용자는 현재<b>{props.isLoggedIn ? '로그인' : '로그인하지 않은'}</b> 상태입니다.
    </div>
  )
}
```
```js
<div>
  <Greeting isLoggedIn={isLoggedIn} />
  {isLoggedIn
    ? <LogoutButton onClick={handleLogoutClick} />
    : <LoginButton onClick={handleLoginClick} />
  }
</div>
```

### <컴포넌트 렌더링 막기>
* 컴포넌트를 렌더링하고 싶지 않을 때에는 null을 리턴한다.
```js
function WarningBanner(props) {
  if (!props.warning) {
    return null;
  }

  return (
    <div>경고!</div>
  );
}
```

---

## [2023-04-13, 7주차 수업 내용]

### <'훅'이란>
* 클래스형 컴포넌트에서는 생성자(constructor)에서 state를 정의하고, setState() 함수를 통해 state를 업데이트한다.
* 예전에 사용하던 함수형 컴포넌트는 별도로 state를 정의하거나, 컴포넌트의 생명주기에 맞춰서 어떤 코드가 실행되도록 할 수 없었다.
* 함수형 컴포넌트에서도 state나 생명주기 함수의 기능을 사용하게 해주기 위해 추가된 기능이 바로 훅(Hook)이다.
* 함수형 컴포넌트도 훅을 사용하여 클래스형 컴포넌트의 기능을 모두 동일하게 구현할 수 있게 되었다.
* Hook이란 'state와 생명주기 기능에 갈고리를 걸어 원하는 시점에 정해진 함수를 실행되도록 만든 함수'를 의미한다.
* 훅의 이름은 모두 'use'로 시작한다.
* 사용자 정의 훅(custom hook)을 만들수 있으며, 이 경우에 이름은 자유롭게 할 수 있으나 'use'로 시작할 것을 권장한다.

### <useState>
* useState는 함수형 컴포넌트에서 state를 사용하기 위한 Hook이다.
* 다음 예제는 버튼을 클릭할 때마다 카운트가 증가하는 함수형 컴포넌트이다.
* 하지만 증가는 시킬 수 있지만 증가할 때마다 재 렌더링은 일어나지 않는다.
* 이럴때 state를 사용해야 하지만 함수형에는 없기 때문에 useState()를 사용한다.  

```js
import React, {useState} from "react";

function Counter(props) {
  const [count, setCount] = useState(0);

  return(
    <div>
      <p>총 {count}번 클릭했습니다.</p>
      <button onClick={() => setCount(count + 1)}>
        클릭
      </button>
    </div>
  );
}
```
### <useEffect>
* useState와 함께 가장 많이 사용하는 Hook이다.
* 이 함수는 사이드 이펙트를 수행하기 위한 것이다.
* 영어로 side effect는 부작용을 의미한다. 일반적으로 프로그래밍에서 사이드 이펙트는 '개발자가 의도하지 않은 코드가 실행되면서 버그가 발생하는 것'을 말한다.
* 하지만 리액트에서는 효과 또는 영향을 뜻하는 effect의 의미에 가깝다.
* 예를 들면 서버에서 데이터를 받아오거나 수동으로 DOM을 변경하는 등의 작업을 의미한다.
* 이 작업을 이펙트라고 부르는 이유는 이 작업들이 다른 컴포넌트에 영향을 미칠 수 있으며, 렌더링 중에는 작업이 완료될 수 없기 때문이다. 렌더링이 끝난 이후에 실행되어야 하는 작업들이다.
* 클래스 컴포넌트의 생명주기 함수와 같은 기능을 하나로 통합한 기능을 제공한다.
* 결국 sideEffect는 렌더링 외에 실행해야 하는 부수적인 코드를 말한다.
* 예를 들면 네트워크 리퀘스트, DOM 수동 조작, 로깅 등은 정리(clean-up)가 필요 없는 경우들이다.
* useEffect()함수는 다음과 같이 사용한다.
* 첫번째 파라미터는 이펙트 함수가 들어가고, 두번째 파라미터로는 의존성 배열이 들어간다.
```
예시-> useEffect(이펙트 함수, 의존성 배열);
```
* 의존성 배열은 이펙트가 의존하고 있는 배열로, 배열 안에 있는 변수 중에 하나라도 값이 변경되었을 때 이펙트 함수가 실행된다.
* 이펙트 함수는 처음 컴포넌트가 렌더링 된 이후, 그리고 재 렌더링 이후에 실행된다.
* 만약 이펙트 함수가 마운트와 언마운트 될 때만 한 번씩 실행되게 하고 싶으면 빈 배열을 넣은면 된다. 이 경우 props나 state에 있는 어떤 값에도 의존하지 않기 때문에 여러번 실행되지 않는다.

** 의존성 배열을 생략하는 경우는 업데이트 될 때마다 호출된다.
```js


function Counter(props) {
  const [count, setCount] = useState(0);

  // componentDidMount, componentDidUpdate와 비슷하게 작동한다.
  useEffect(() =>{
    // 브라우저 ApI를 사용해서 document의 title을 업데이트 한다.
    document.title = '총 ${count}번 클릭했습니다.';
  });

  return(
    <div>
      <p>총 {count}번 클릭했습니다.</p>
      <button onClick={() => setCount(count + 1)}>
        클릭
      </button>
    </div>
  );
}
```

componentWillUnmount()동일한 기능은 어떻게 구현하는지 알아보자.
```js
function Counter(props) {
  const [count, setCount] = useState(0);
  useEffect(() =>{

    document.title = '총 ${count}번 클릭했습니다.';
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() =>{
    ServerAPI.subscribeUserStatus(props.user.id, hanleStatusChange);
    return () => {
      ServerAPI.unsubscribeUserStatus(props.user.id, hanleStatusChange);
    }
  });

  function handleStatusChane(status) {
    setIsOnline(status.inOnline);
  }
}
```

### <정리>
```js
useEffect(() => {
  // 컴포넌트가 마운트 된 이후,
  // 의존성 배열에 있는 변수들 중 하나라도 값이 변경되었을 때 실행됨
  // 의존성 배열에 빈 배열([])을 넣으면 마운트와 언마운트시에 단 한번씩만 실행됨
  // 의존성 배열 생략 시 컴포넌트 업데이트 시마다 실행됨
  ...

  return () => {
    // 컴포넌트가 마운트 해제되기 전에 실행됨
    ...
  }
}, [의존성 변수1, 의존성 변수2, ...]);
```

### <useMemo>
* useMemo() 혹은 memoizde value를 리턴하는 훅이다.
* 이전 계산값을 갖고 있기 때문에 연산량이 많은 작업의 반복을 피할 수 있다.
* 이 훅은 렌더링이 일어나는 동안 실행된다.
* 따라서 렌더링이 일어나는 동안 실행돼서는 안될 작업을 넣으면 안된다.
* 예를 들면 useEffect에서 실행되어야 할 사이드 이펙트 같은 것이다.
```js
count memoizedValue = useMemo(
  () => {
    // 연산량이 높은 작업을 수행하여 결과를 반환
    return computeExpensiveValue(의존성 변수1,)
  }
)
```

* 다음 코드와 같이 의존성 배열을 넣지 않을 경우, 렌더링이 일어날 때 마다 매번 함수가 실행된다.
* 따라서 의존성 배열을 넣지 않는 것은 의미가 없다.
* 만약 빈 배열을 넣게 되면 컴포넌트 마운트 시에만 함수가 실행된다.
```js
const memoizedValue = useMemo(
  () => computeExpensiveValue(a,b);
);
```
### <useCallback>
* useCallback() 훅은 useMemo()와 유사한 역할을 한다.
* 차이점은 값이 아닌 함수를 반환한다는 점이다.
* 의존성 배열을 파라미터로 받는 것은 useMemo와 동일하다.
* 파라미터로 받은 함수를 콜백이라고 부른다.
* useMemo와 마찬가지로 의존성 배열중 하나라도 변경되면 콜백함수를 반환한다.
```js
const memoizedCallback = useCallback(
  () => {
    doSomething(의존성 변수1, 의존성 변수2);
  },
  [의존성 변수1, 의존성 변수2]
); 
```

### <useRef>
* useRef() 훅은 레퍼런스를 사용하기 위한 훅이다.
* 레퍼런스란 특정 컴포넌트에 접근할 수 있는 객체를 의미한다.
* useRef() 훅은 바로 이 레퍼런스 객체를 반환한다.
* 레퍼런스 객체에는 .current라는 속성이 있는데, 이것은 현재 참조하고 있는 엘리먼트를 의미한다.
```js
const refContainer = useRef(초깃값);
```
* 이렇게 반환된 레퍼런스 객체는 컴포넌트의 라이프타임 전체에 걸쳐서 유지된다.
* 즉, 컴포넌트가 마운트 해제 전까지는 계속 유지된다는 의미이다.

### <훅의 규칙>
#### 1. 첫번째 규칙
* 첫 번째 규칙은 무조건 최상의 레벨에서만 호출해야 한다는 것이다. 여기서 최상의는 컴포넌트의 최상의 레벨을 의미한다.
* 따라서 반복문이나 조건문 또는 중첩된 함수들 안에서 훅을 호출하면 안된다.
* 이 규칙에 따라서 훅은 컴포넌트가 렌더링 될 때마다 같은 순서로 호출되어야 한다.
페이지 224의 코드는 조건에 따라 호출됨으로 잘못된 코드이다.

#### 2. 두번째 규칙
* 두번째 규칙은 리액트 함수형 컴포넌트에서만 훅을 호출해야 한다는 것이다.
* 따라서 일반 자바스크립트 함수에서 훅을 호축하면 안된다.
* 훅은 리액트의 함수형 컴포넌트 혹은 직접 만든 커스텀 훅에서만 호출할 수 있다.

### 필요시 직접 훅을 만들어 쓸 수도 있다. 이것을 커스텀 훅이라고 한다.
### 1. 커스텀 훅을 만들어야 하는 상황
예제 UserStatus 컴포넌트는 isOnline이라는 state에 따라서 사용자의 상태가 온라인인지 아닌지를 텍스트로 보여주는 컴포넌트이다.
```js
function UserStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChane(status) {
    setIsOnline(status.inOnline);
    }

    ServerAPI.subscribeUserStatus(props.user.id, hanleStatusChange);
    return () => {
      ServerAPI.unsubscribeUserStatus(props.user.id, hanleStatusChange);
    };
  });
}
```

### 2. 커스텀 훅 추출하기
* 두개의 자바스크립트 함수에서 하나의 로직을 공유하도록 하고 싶을 때 새로운 함수를 하나 만드는 방법을 사용한다.
* 리액트 컴포넌트와 훅은 모두 함수기이 때문에 동일한 방법을 사용할 수 있다.
* 이름을 use로 시작하고, 내부에서 다른 훅을 호출하는 자바스크립트 함수를 만들면 된다.

### 3. 커스텀 훅 사용하기
```js
function UserStatus(props) {
  const isOnline = useUserState(props.user.id);

  if (isOnline === null) {
    return '대기중...';
  }
  return isOnline ? '온라인' : '오프라인';
}
function UserLiseItem(props) {
  const isOnline = useUserState(props.user.id);
  
  return(
    <li style={{color: isOnline ? 'green' : 'black'}}>
    {props.user.name}
    </li>
  );
}
```

---

## [2023-04-06, 6주차 수업 내용]

### <컴포넌트 추출>
* 복잡한 컴포넌트를 쪼개서 여러 개의 컴포넌트로 나눌 수 있다
* 큰 컴포넌트에서 일부를 추출해서 새로운 컴포넌트를 만드는 것이다.
  - 실무에서는 처음부터 1개의 컴포넌트에 하나의 기능만 사용하도록 설계하는게 좋다

### <컴포넌트 작성>
Comment.jsx
```js
import React from "react";

const styles = {
  wrapper: {
      margin: 8,
      padding: 8,
      display: "flex",
      flexDirection: "row",
      border: "1px solid grey",
      borderRadius: 16,
  },
  imageContainer: {},
  image: {
      width: 50,
      height: 50,
      borderRadius: 25,
  },
  contentContainer: {
      marginLeft: 8,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
  },
  nameText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
  },
  commentText: {
      color: "black",
      fontSize: 16,
  },
};

function Comment(props) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.imageContainer}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          alt="프로필 이미지"
          style={styles.image}
        />
      </div>
      <div style={styles.contentContainer}>
        <span style={styles.nameText}>이재형</span>
        <span style={styles.nameText}>
          내가 만든 첫 컴포넌트
          </span>
      </div>
    </div>
  );
}

export default Comment;
```
Comment 컴포넌트를 위와 같이 작성할 수 있다.  
html적인 요소들은
```js
function Comment(props) {
  return (

      );
}
```
이 안에 넣어주고 css는 이 밖에 작성해주면 된다.  
컴포넌트가 작성되었으면 이 컴포넌트를 CommentList에 불러와야한다.  
CommentList.jsx
```js
import React from "react";
import Comment from "./Comment";

function CommentList(props) {
  return(
    <div>
      <Comment/>
    </div>
  );
}

export default CommentList;
```
import Comment from "./Comment"; 로 Comment를 import해준다.  
Comment를 리스트로 작성하면 아래와 같다.

CommentList.js
```js
import React from "react";
import Comment from "./Comment";

const comments = [
  {
    name: "이재형",
    comment: "안녕하세요. 이재형입니다.",
  },
  {
    name: "이재형",
    comment: "안녕하세요. 이재형입니다.",
  },
  {
    name: "이재형",
    comment: "안녕하세요. 이재형입니다.",
  },
];


function CommentList(props) {
  return(
    <div>
      {comments.map((comment) => {
        return (
          <Comment name={comment.name} comment={comment.comment}/>
        );
      })}
    </div>
  );
}

export default CommentList;
```



### <state에 대해>
### 1. state란?
 * state는 리액트 컴포넌트의 상태를 의미한다.
 * 상태의 의미는 정상인지 비정상인지가 아니라 컴포넌트의 데이터를 의미한다.
 * 정확히는 컴포넌트의 변경가능한 데이터를 의미한다.
 * State가 변하면 다시 렌더링이 되기 때문에 렌더링과 관련된 값만 state에 포함시켜야 한다.

 ### 2. state의 특징
 * 리액트 만의 특별한 형태가 아닌 단지 자바스크립트 객체일 뿐입니다.
 * 예시 코드의 LikeButton은 class 컴포넌트이다.
 * constructor는 생성자이고 그 안에 있는
 * this.state가 현 컴포넌트의 state이다.  
-- 함수형에서는 useState()라는 함수 사용한다.

CommentList.jsx
 ```js
class LikeButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      liked: false
    }
  }
}
 ```
* state는 변경이 가능하다고 했지만 직접 수정해서는 안된다
* 불가능하다고 생각하는 것이 좋다
* state를 변경하고자 할 때는 setstate()함수를 사용한다.

예시)
```js
// state를 직접 수정(잘못된 사용법)
this.state(
  name:'Inje'
);

//setState 함수를 통한 수정 (정상적인 사용법)
this.setState({
  neame: 'Inje'
});
```

### <생명주기에 대해 알아보기>
* 생명주기는 컴포넌트의 생성 시점, 사용 시점, 종료 시점을 나타내는 것이다.
* 생성 직후 componentDidMount()함수가 호출된다.
* 컴포넌트가 소멸하기 전까지 여러번 랜더링 한다.
* 렌더링은 props, setState(), forceUpdate()에 의해 상태가 변경되면 이루어진다.
* 그리고 렌더링이 끝나면 componentDidUpdate() 함수가 호출된다.
* 마지막으로 컴포넌트가 언마운트 되면 componentWillUnmount() 함수가 호출된다.

---

## [2023-03-30, 5주차 수업 내용]

### <엘리먼트의 정의>
1. 엘리먼트는 리액트 앱을 구성하는 요소를 의미
2. 공식페이지에는 엘리먼트는 리액트 앱의 가장 작은 빌딩 블록들" 이라고 설명하고 있다.
3. 웹사이트의 경우는 DOM 엘리먼트이며 HTML요소를 의미한다.

### <리액트 엘리먼트와 DOM엘리먼트의 차이>
1. 리액트 엘리먼트는 Virtual DOM의 형태를 취하고 있다.
2. DOM 엘리먼트는 페이지의 모든 정보를 갖고 있어 무겁다.
3. 반면 리액트 엘리먼트는 변화한 부분만 갖고 있어 가볍다.

### <엘리먼트의 생김새>
* 리액트 엘리먼트는 자바스크립트 객체의 형태로 존재한다.
* 컴포넌트(Button 등), 속성(color 등) 및 내부의 모든 children을 포함하는 일반 JS객체이다.
* 이 객체는 마음대로 변경할 수 없는 불변성을 갖고 있다.

버튼을 나타내기 위한 엘리먼트의 예
```js
<button class='bg-green'>
  <b>
    Hello, element!
  </b>
</button>
```
  * type에는 html태그 이름, props에는 속성을 나타낸다.  
  * 리액트 엘리먼트의 예를 보면 type에 태그 대신 리액트 컴포넌트가 들어가있는 것 외에는 차이가 없다는 것을 알 수 있다.  
  * 이 역시 자바스크립트 객체이다.  

```js
<button class='bg-green'>
  <b>
    Hello, element!
  </b>
</button>
```
  * 내부적으로 자바스크립트 객체를 만드는 역할을 하는 함수가 createElement()이다.  
  * 실체 createElement() 함수가 동작하는 과정을 살펴보자.  
  
다음 코드는 Button과 ConfiremDialog 컴포넌트고 ConfirmDialog가 Button을 포함하고 있다.  

```js
function Button(props) {
  return(
    <button className={`bg-${props.color}`}>
      <b>
        {props.children}
      </b>
    </button>
  )
}

function ConfirmDialog(props) {
  return (
    <div>
    <p>내용을 확인하셨으면 확인 버튼을 눌러주세요.</p>
      <Button color='green'>확인</Button>
    </div>
  )
}
```
  
ConfirmDialog 컴포넌트를 엘리먼트의 형태로 표시하면 다음과 같습니다.
```js
{
  type: 'div',
  props: {
    children: [
      {
        type: 'p',
        props: {
          children: '내용을 확인하셨으면 확인 버튼을 눌러주세요.'
        }
      },
      {
        type: 'button',
        props:{
          className: 'bg-green',
          children: {
            type: 'b',
            props: {
              children: '확인'
            }
          }
        }
      }
    ]
  }
}
```


### <엘리먼트의 특징>
리액트 엘리먼트의 가장 큰 특징은 불변성입니다.
* 즉, 한번 생성된 엘리먼트의 children이나 속성(attributes)을 바꿀 수 없다.

### <내용이 바뀌면 어떻게?>
  * 이 때는 컴포넌트를 통해 새로운 엘리먼트를 생성하면 된다.
  * 그 다음 이전 엘리먼트와 교체를 하는 방법으로 내용을 바꾸는 것이다.
  * 이렇게 교체하는 작업을 하기위해 Virtual DOM을 사용한다.

### <렌더링된 엘리먼트 업데이트하기>
* 다음 코드는 tick()함수를 정의하고 있다
* 이 함수는 현재 시간을 포함한 element를 생성해서 root div에 렌더링해 줍니다.
* 그런데 라인 1 2에 보면 setInterval()함수를 이용해서

### <컴포넌트에 대해 알아보기>
* 앞에서 설명한 바와 같이 리액트는 컴포넌트 기반의 구조와 같다
* 컴포넌트 구조라는 것은 작은 컴포넌트가 모여 큰 컴포넌트를 구성하고, 다시 이런 컴포넌트들이 모여서 전체 페이지를 구성한다는 것을 의미한다.
* 컴포넌

### <Props에 대해 알아보기>
#### 1.Props의 개념
  * props는 prop(property: 속성, 특성)의 준말이다.
  * 이 props가 바로 컴포넌트의 속성이다.
  * 컴포넌트에 어떤 속성, props를 넣느냐에 따라서 속성이 다른 엘리먼트가 출력된다.
  * props는 컴포넌트에 전달 할 다양한 정보를 담고 있는 자바스크립트 객체이다

#### 2.props의 특징
  * 읽기 전용이다. 변경할 수 없다는 의미이다.
  * 속성이 다른 엘리먼트를 생성하려면 새로운 props를 컴포넌트에 전달하면 된다.

#### *Pure 함수 vs Impure 함수
* pure함수는 인수로 받은 함수 내부에서도 변하지 않는 함수이다.
* Impure함수는 인수로 받은 정보가 함수 내부에서 변하는 함수이다.  

#### 3.Props 사용법
* JSX에서는 Key-value쌍으로 Props를 구성한다.
* JSX에서는 중괄로를 사용함으로써 자바스크립트를 작성할 수 있다.

* JSX를 사용하지 않는 경우 props의 전달 방법은 createElement()함수를 사용하는 것이다.

### <컴포넌트 만들기>
#### 1. 컴포넌트의 종류
* 리액트 초기 버전을 사용할 때는 클래스형 컴포넌트를 주로 사용했다.
* 이후 Hook이라는 개념이 나오면서 최근에는 함수형 컴포넌트를 주로 사용한다.
* 예전에 작성된 코드나 문서들이 클래스형 컴포넌트를 사용하고 있기 때문에 클래스형 컴포넌트와 컴포넌트의 생명주기에 관해서도 공부해야 한다.
#### 2. 함수형 컴포넌트
```js
fucntion Welcome(props) {
  return <h1>안녕, {props.name}</h1>
}
```
#### 3. 클래스형 컴포넌트
```js
class Welcome extends React.Component {
  render() {
    return <h1>안녕, {props.name}</h1>
  }
}
```
#### 4. 컴포넌트 이름 짓기
* 이름은 항상 대문자로 시작한다.
* 왜냐하면 리액트는 소문자로 시작하는 컴포넌트를 DOM태그로 인식하기 때문이다. html tag.
* 컴포넌트 파일 이름과 컴포넌트 이름은 같게 한다.

#### 5. 컴포넌트의 렌더링
* 렌터링의 과정은 다음 코드와 같다 (구형방식)
```js
fucntion Welcome(props) {
  return <h1>안녕, {props.name}</h1>
}

const element = <Welcome name="인제" />;
ReactDOM.render(
  element,
  document.getElemnetById('root')
);
```

### <컴포넌트의 합성>
* 컴포넌트 합성은 여러 개의 컴포넌트를 합쳐서 하나의 컴포넌트를 만드는 것이다.
* 리액트에서는 컴포넌트 안에 또 다른 컴포넌트를 사용할 수 있기 때문에, 복잡한 화면을 여러 개의 컴포넌트로 나누어 구현할 수 있다.
* props의 값을 다르게 해서 컴포넌트를 여러 번 사용한다.

---

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
```js
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
```js
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
```js
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
  
