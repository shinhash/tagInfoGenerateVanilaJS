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