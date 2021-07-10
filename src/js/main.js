"use strict";
{
  document.body.style.color = "red";

  Promise.resolve(console.log("yey"));

  () => {
    console.log("hong");
  };
}
