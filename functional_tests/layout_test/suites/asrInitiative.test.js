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

function openAsrCards(driver,device,flow)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("asrInitiativeNavBar"))).click();
      Thread.sleep(1000);
      driver.findElement(By.id(content.get("languageDropDown"))).click();
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("languageOdia"))).click();
      Thread.sleep(1000);
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
      driver.findElement(By.xpath(content.get("asrInitiativeNavBar"))).click();
      Thread.sleep(2000);
      driver.findElement(By.id(content.get("languageDropDown"))).click();
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("languageOdia"))).click();
      Thread.sleep(1000);
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

  function openAsrInitiative(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("asrInitiativeNavBar"))).click();
      Thread.sleep(2000);
    }
    else
    {

      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath(content.get("asrInitiativeNavBar"))).click();
      Thread.sleep(2000);
    }
  
  }

  
  function openDashboard(driver,device)
  {
    if(device.isMobile)
      {
      Thread.sleep(500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath(content.get("asrInitiativeNavBar"))).click();
      Thread.sleep(2000);
      driver.executeScript("scroll(0, 5000);");
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("viewAllDetails"))).click();
      
      }

      else
      {
      driver.findElement(By.xpath(content.get("asrInitiativeNavBar"))).click();
      Thread.sleep(2000);
      driver.executeScript("scroll(0, 1500);");
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
       test("Test Asr Initiative Landing Page ", function (device,browser) {
        var driver = create_driver(content.get("url"),device,browser);
  
          openAsrInitiative(driver,device);
          Thread.sleep(1000);
          checkLayout(driver,"././specs/asrInitiativeLanding.gspec", [device.deviceName]);
          driver.close();
        
      });


      test("Test Asr Initiative Contribute page", function (device,browser) {

        var driver = create_driver(content.get("url"),device,browser);
        
        openAsrCards(driver,device,"Contribute");  
        Thread.sleep(1000);
        checkLayout(driver,"././specs/asrInitiativeContribution.gspec", [device.deviceName]);
        driver.close();
  
    }); 

      test("Test Asr Initiative Validate page", function (device,browser) {

          var driver = create_driver(content.get("url"),device,browser);
        
        openAsrCards(driver,device,"Validate");  
        Thread.sleep(1000);
        checkLayout(driver,"././specs/asrInitiativeValidatepage.gspec", [device.deviceName]);
        driver.close();
  
    }); 

      test("Asr Initiative Dashboard Page",function(device,browser){

        var driver = create_driver(content.get("url"),device,browser); 
        openDashboard(driver,device);
        Thread.sleep(1000);
        checkLayout(driver, "././specs/asrInitiativeDashboard.gspec", [device.deviceName]);
        driver.close();

    });
    }); 
  });