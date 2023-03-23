import React from "react" //리엑트 임포트
import Book from "./Book" //북 컨포넌트 임포트

function Library(props) {  //Library함수 정의
  return (
    <div>
      <Book name="처음 만난 파이썬" numOfPage={300}></Book>
      <Book name="처음 만난 AWS" numOfPage={400}></Book>
      <Book name="처음 만난 리액트" numOfPage={500}></Book>
    </div>
  )
}

export default Library