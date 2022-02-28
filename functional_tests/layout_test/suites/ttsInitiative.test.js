var content = loadProperties("./suites/constant.properties");
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

  function openTtsCards(driver,device,flow)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("ttsInitiativeNavBar"))).click();
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
      Thread.sleep(5000);

    }
    else
    {
      Thread.sleep(500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
  
      driver.findElement(By.xpath(content.get("ttsInitiativeNavBar"))).click();
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
      Thread.sleep(2000);
      driver.findElement(By.xpath(content.get("submitButtonUserDetail"))).click();
      Thread.sleep(5000);
    }
  
  }
  
  function openTtsInitiative(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("ttsInitiativeNavBar"))).click();
      Thread.sleep(2000);
  
      driver.findElement(By.id(content.get("languageDropDown"))).click();
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("languageKannada"))).click();
      Thread.sleep(1000);

    }
    else
    {
  
      Thread.sleep(1500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
  
      driver.findElement(By.xpath(content.get("ttsInitiativeNavBar"))).click();
      Thread.sleep(2000);

      driver.findElement(By.id(content.get("languageDropDown"))).click();
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("languageKannada"))).click();
      Thread.sleep(1000);
  
    }
  
  }


  function openUserDetail(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageOdia"));
      Thread.sleep(1500);
      driver.findElement(By.cssSelector(content.get("contributeCard"))).click();
      Thread.sleep(500);

    }
    else
    {
      Thread.sleep(1500);
      driver.findElement(By.id(content.get("languageDropDown"))).sendKeys(content.get("languageOdia"));
      Thread.sleep(1500);
      driver.findElement(By.cssSelector(content.get("contributeCard"))).click();
      Thread.sleep(500);

    }
  
  }

  
  function openTtsInitiativeDashboard(driver,device)
  {
    if(device.isMobile)
      {
      Thread.sleep(500);
      driver.findElement(By.xpath(content.get("hamBurger"))).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath(content.get("ttsInitiativeNavBar"))).click();
      Thread.sleep(2000);
      driver.executeScript("scroll(0, 5000);");
      Thread.sleep(1000);
      driver.findElement(By.xpath(content.get("viewAllDetails"))).click();
      
      }

      else
      {
      driver.findElement(By.xpath(content.get("ttsInitiativeNavBar"))).click();
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
      test("Test TTS Initiative Landing page and User Details Modal", function (device,browser) {
          var driver = create_driver(content.get("url"),device,browser);
          openTtsInitiative(driver,device);
          Thread.sleep(1000);
          checkLayout(driver, "././specs/ttsInitiativeLandingPage.gspec", [device.deviceName]);
          openUserDetail(driver,device);
          Thread.sleep(1000);
          checkLayout(driver, "././specs/userDetail.gspec", [device.deviceName]);
          
          driver.close();
        
      }); 

      test("Test TTS Initiative Transcribe page", function (device,browser) {

          var driver = create_driver(content.get("url"),device,browser);
          
          openTtsCards(driver,device,"Contribute"); 
          Thread.sleep(1000); 
          checkLayout(driver, "././specs/ttsInitiativeTranscribePage.gspec", [device.deviceName]);
          driver.close();
    
      }); 

      test("Test TTS Initiative Validate page", function (device,browser) {

        var driver = create_driver(content.get("url"),device,browser);
        
        openTtsCards(driver,device,"Validate"); 
        Thread.sleep(1000); 
        checkLayout(driver, "././specs/ttsInitiativeValidatePage.gspec", [device.deviceName]);
        driver.close();
  
    }); 

    test("Test TTS Initiative Dashboard page", function (device,browser) {

      var driver = create_driver(content.get("url"),device,browser); 
      openTtsInitiativeDashboard(driver,device);  
      Thread.sleep(1000);
      checkLayout(driver, "././specs/ttsInitiativeDashboard.gspec", [device.deviceName]);
      driver.close();

    }); 

    }); 
  });