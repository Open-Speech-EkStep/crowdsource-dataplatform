const {readFileSync} = require('fs');
const {stringToHTML} = require('../utils');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/assistiveText.ejs`, 'UTF-8')
);

describe("assisstive text",()=>{
  test("should give true when instructive-msg component is present", ()=>{
    expect($("#instructive-msg").html()).toBeTruthy();
  })

  test("should give true when instructive-msg-div component is present", ()=>{
    expect($(".instructive-msg-div").html()).toBeTruthy();
  })
})