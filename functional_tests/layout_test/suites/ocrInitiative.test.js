var devices = {
  mobile: {
    deviceName: "Mobile",
    size: "500x640",
    isMobile: true
  },
  desktop: {
    deviceName: "Desktop",
    size: "1440x900",
    isMobile: false
  }
};

var browsers = {
  chrome: {
    browserName: "chrome"
  }
};

var content = loadProperties("./suites/constant.properties");
function openOcrCards(driver,device,flow)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("ocrInitiativeNavBar"))).click();
      Thread.sleep(1000);
      driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languagePunjabi"));
      Thread.sleep(700);
      if(flow=="Contribute")
      {
        driver.findElement(By.cssSelector(content.get("contributeCard"))).click();
      }
      else
      {
        driver.findElement(By.cssSelector(content.get("validateCard"))).click();
      }
      Thread.sleep(2000);
      driver.findElement(By.xpath(content.get("submitButtonUserDetail"))).click();
      Thread.sleep(500);

    }
    else
    {
      Thread.sleep(500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath(content.get("ocrInitiativeNavBar"))).click();
      Thread.sleep(2000);
      driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languagePunjabi"));
      Thread.sleep(700);
      if(flow=="Contribute")
      {
        driver.findElement(By.cssSelector(content.get("contributeCard"))).click();
      }
      else
      {
        driver.executeScript("scroll(0, 500);");
        driver.findElement(By.cssSelector(content.get("validateCard"))).click();
      }
      Thread.sleep(500);
      driver.findElement(By.xpath(content.get("submitButtonUserDetail"))).click();
      Thread.sleep(500);
    }
  }

function openOcrInitiative(driver,device)
{
  if(!device.isMobile)
  {
    Thread.sleep(1500);
    driver.findElement(By.xpath(content.get("ocrInitiativeNavBar"))).click();
    Thread.sleep(2000);

    driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageKannada"));
    Thread.sleep(2000);
  }
  else
  {

    Thread.sleep(1500);
    driver.findElement(By.xpath(content.get("hamBurger"))).click();
    Thread.sleep(2000);

    driver.findElement(By.xpath(content.get("ocrInitiativeNavBar"))).click();
    Thread.sleep(2000);
    driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageKannada"));
    Thread.sleep(2000);

  }

}


function create_driver(url,device,browser){
  var dr = createDriver(url,device.size,browser.browserName);
  return dr;
}


forAll(devices, function (device) {
  forAll(browsers, function (browser) {

     test("Test ocr initiative ", function (device,browser) {
      var driver = create_driver(content.get("url"),device,browser);
        openOcrInitiative(driver,device);
        Thread.sleep(1000);
        checkLayout(driver, "././specs/ocrInitiativeLandingPage.gspec", [device.deviceName]);
        driver.close();
      
    });

    test("Test ocr initiative validate", function (device,browser) {
      var driver = create_driver(content.get("url"),device,browser);
        openOcrCards(driver,device,"Validate");
        Thread.sleep(1000);
        checkLayout(driver, "././specs/ocrInitiativeValidate.gspec", [device.deviceName]);
        driver.close();
      
    });

    test("Test ocr initiative contribute", function (device,browser) {
      var driver = create_driver(content.get("url"),device,browser);
        openOcrCards(driver,device,"Contribute");
        Thread.sleep(1000);
        checkLayout(driver, "././specs/ocrInitiativeContribute.gspec", [device.deviceName]);
        driver.close();
      
    });
  }); 
});