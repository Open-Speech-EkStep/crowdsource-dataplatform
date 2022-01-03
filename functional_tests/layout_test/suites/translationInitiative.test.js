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

function openTranslationCards(driver,device,flow)
{
  if(!device.isMobile)
  {
    Thread.sleep(1500);
    driver.findElement(By.xpath(content.get("translationInitiativeNavBar"))).click();
    Thread.sleep(1000);
    driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageOdia"));
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
    driver.findElement(By.xpath(content.get("translationInitiativeNavBar"))).click();
    Thread.sleep(2000);
    driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageOdia"));
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
    Thread.sleep(2000);
    driver.findElement(By.xpath(content.get("submitButtonUserDetail"))).click();
    Thread.sleep(500);
  }

}
  
  function openTranslationInitiative(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("translationInitiativeNavBar"))).click();
      Thread.sleep(2000);
  
      driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageKannada"));
      Thread.sleep(2000);
    }
    else
    {
  
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
  
      driver.findElement(By.xpath(content.get("translationInitiativeNavBar"))).click();
      Thread.sleep(2000);
  
      driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageKannada"));
      Thread.sleep(2000);
  
    }
  
  }
  
  function openTranslationInitiativeDashboard(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("translationInitiativeNavBar"))).click();
      Thread.sleep(2000);
      driver.executeScript("scroll(0, 1500);");
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("viewAllDetails"))).click();
    }
    else
    {
  
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath(content.get("translationInitiativeNavBar"))).click();
      Thread.sleep(2000);
      driver.executeScript("scroll(0, 5000);");
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("viewAllDetails"))).click();
    }
  
  }

  function create_driver(url,device,browser){
    var dr = createDriver(url,device.size,browser.browserName);
    return dr;
  }

  forAll(devices, function (device) {
    forAll(browsers, function (browser) {
     test("Test Translation Initiative ", function (device,browser) {
          var driver = create_driver(content.get("url"),device,browser);
          openTranslationInitiative(driver,device);
          Thread.sleep(1000);
          checkLayout(driver,"././specs/translationInitiativeLandingPage.gspec", [device.deviceName]);
          driver.close();
        
      });

      test("Test Translation Initiative Dashboard ", function (device,browser) {
          var driver = create_driver(content.get("url"),device,browser);
          openTranslationInitiativeDashboard(driver,device);
          Thread.sleep(1000);
          checkLayout(driver,"././specs/translationInitiativeDashboard.gspec", [device.deviceName]);
          driver.close();        
      });

     test("Test Translation Initiative Validate Page ", function (device,browser) {
          var driver = create_driver(content.get("url"),device,browser);
          openTranslationCards(driver,device,"Validate");
          Thread.sleep(1000);
          checkLayout(driver,"././specs/translationInitiativeValidatePage.gspec", [device.deviceName]);
          driver.close();        
      });

      test("Test Translation Initiative Contribute Page ", function (device,browser) {
          var driver = create_driver(content.get("url"),device,browser);
          openTranslationCards(driver,device,"Contribute");
          Thread.sleep(1000);
          checkLayout(driver,"././specs/translationInitiativeContributePage.gspec", [device.deviceName]);
          driver.close();        
      });

    }); 
  });