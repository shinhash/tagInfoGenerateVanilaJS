// src/utils/createHandleChange.ts
import React from "react";

// 제네릭 ChangeEvent 핸들러
export const createHandleChange = 
(setter: React.Dispatch<React.SetStateAction<any>>) => 
  (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => { 
    const {name, value} = e.target;
    setter((prev:any) => ({...prev, [name] : value})); 
};


export const objIsNullEmptyUndefined = (obj : any) => {
  let result = false;
  if(obj === undefined || obj === null || obj === ""){
    result = true;
  }
  return result;
}


export const ClipboardCopy = (text: string) => {
  if(navigator.clipboard){
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("클립보드에 복사되었습니다.");
      }).catch(() => {
        alert("복사를 다시 시도해주세요.");
      });
  }else{
    if (!document.queryCommandSupported("copy")) {
      return alert("복사하기가 지원되지 않는 브라우저입니다.");
    }

    const textarea = document.createElement("textarea") as HTMLTextAreaElement;
    textarea.value = text;
    (textarea.style as any).top = 0;
    (textarea.style as any).left = 0;
    textarea.style.position = "fixed";

    document.getElementById("root")?.appendChild(textarea);

    textarea.focus();
    textarea.select();
    document.execCommand("copy");

    document.getElementById("root")?.removeChild(textarea);
    alert("클립보드에 복사되었습니다.");
  }
}