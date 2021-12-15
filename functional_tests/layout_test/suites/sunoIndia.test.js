var devices = {
    mobile: {
      deviceName: "Mobile",
      size: "360x640",
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
  
  
  
  function openSunoindia(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(2000);
  
      driver.findElement(By.id('contribution')).sendKeys("ಕನ್ನಡ");
      Thread.sleep(500);
    }
    else
    {
  
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(2000);
  
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(2000);

      driver.findElement(By.id('contribution')).sendKeys("ಕನ್ನಡ");
      Thread.sleep(500);
  
    }
  
  }


  function openUserDetail(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(1500);
      driver.findElement(By.cssSelector("div[data-testid=ActionCardcontribute]")).click();
      Thread.sleep(500);

    }
    else
    {
      Thread.sleep(1500);
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(1500);
      driver.findElement(By.cssSelector("div[data-testid=ActionCardcontribute]")).click();
      Thread.sleep(500);

    }
  
  }

  

  function openSunoindiaTranscribe(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(1000);
  
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(500);
      driver.findElement(By.xpath("//div[@data-testid='ActionCardcontribute']")).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(5000);

    }
    else
    {
      Thread.sleep(500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(2000);
  
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(2000);

      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(500);
      driver.findElement(By.xpath("//div[@data-testid='ActionCardcontribute']")).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(5000);
    }
  
  }


  function openSunoindiaValidate(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(1000);
  
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(500);
      driver.findElement(By.cssSelector("div[data-testid=ActionCardvalidate]")).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(500);

    }
    else
    {
      Thread.sleep(500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(2000);
  
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(2000);

      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(500);
      driver.findElement(By.cssSelector("//div[@data-testid=ActionCardvalidate]")).click();
      Thread.sleep(500);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(500);
    }
  
  }
  

  function openSunoindiaDashboard(driver,device)
  {
    if(device.isMobile)
      {
      Thread.sleep(500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(700);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(1000);
      driver.executeScript("scroll(0, 5000);");
      Thread.sleep(1000);
      driver.findElement(By.xpath("//a[@data-testid='ViewAllDetailButton']")).click();
      
      }

      else
      {
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[1]")).click();
      Thread.sleep(700);
      driver.executeScript("scroll(0, 20000);");
      Thread.sleep(500);
     driver.findElement(By.xpath("//a[@data-testid='ViewAllDetailButton']")).click();
      }
  }


  
  forAll(devices, function () {
    forAll(browsers, function () {
      // test("Test Suno India Landing page and User Details Modal", function (device,browser) {
      //   var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
      //     openSunoindia(driver,device);
      //    checkLayout(driver, "././specs/sunoindiaLandingPage.gspec", [device.deviceName]);
      //     openUserDetail(driver,device);
      //     checkLayout(driver, "././specs/userDetail.gspec", [device.deviceName]);
          
      //     driver.close();
        
      // }); 

      // test("Test Suno India Transcribe page", function (device,browser) {

      //     var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
          
      //     openSunoindiaTranscribe(driver,device);  
      //     checkLayout(driver, "././specs/sunoindiaTranscribePage.gspec", [device.deviceName]);
      //     driver.close();
    
      // }); 

    //   test("Test Suno India Validate page", function (device,browser) {

    //     var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
        
    //     openSunoindiaValidate(driver,device);  
    //     checkLayout(driver, "././Specs/sunoindiaValidatePage.gspec", [device.deviceName]);
    //     driver.close();
  
    // }); 

    test("Test Suno India Dashboard page", function (device,browser) {

      var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName);  
      openSunoindiaDashboard(driver,device);  
      checkLayout(driver, "././Specs/sunoIndiaDashboard.gspec", [device.deviceName]);
      driver.close();

    }); 

    }); 
  });