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
  
  
  
  function openLikhoindia(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(2000);
  
      driver.findElement(By.id('contribution')).sendKeys("ಕನ್ನಡ");
      Thread.sleep(2000);
    }
    else
    {
  
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(2000);
  
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(2000);
  
      driver.findElement(By.id('contribution')).sendKeys("ಕನ್ನಡ");
      Thread.sleep(2000);
  
    }
  
  }
  

  function openLikhoindiaDashboard(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(2000);
      driver.executeScript("scroll(0, 25000);");
      Thread.sleep(1000);
      driver.findElement(By.xpath("//a[@data-testid='ViewAllDetailButton']")).click();
    }
    else
    {
  
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(2000);
      driver.executeScript("scroll(0, 25000);");
      Thread.sleep(1000);
      driver.findElement(By.xpath("//a[@data-testid='ViewAllDetailButton']")).click();
    }
  
  }
  
  function openLikhoindiaContribute(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(1000);
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(700);
      driver.findElement(By.cssSelector("div[data-testid=ActionCardcontribute]")).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(500);

    }
    else
    {
      Thread.sleep(500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(2000);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(2000);
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(700);
      driver.findElement(By.xpath("//*[@data-testid='ActionCardcontribute']")).click();
      Thread.sleep(500);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(500);
    }
  
  }




  function openLikhoindiaValidate(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(1000);
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(700);
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
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[3]")).click();
      Thread.sleep(2000);
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      driver.executeScript("scroll(0, 500);");
      Thread.sleep(700);
      driver.findElement(By.xpath("//*[@data-testid='ActionCardvalidate']")).click();
      Thread.sleep(500);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(500);
    }
  
  }




  
  forAll(devices, function () {
    forAll(browsers, function () {
     // test("Test Likho india ", function (device,browser) {
      //   var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
  
      //     openLikhoindia(driver,device);
      //     checkLayout(driver, "././Specs/likhoindiaLandingPage.gspec", [device.deviceName]);
      //     driver.close();
        
      // });

      // test("Test Likho india Dashboard ", function (device,browser) {
      //   var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
      //     openLikhoindiaDashboard(driver,device);
      //     checkLayout(driver, "././specs/likhoindiaDashboard.gspec", [device.deviceName]);
      //     driver.close();        
      // });

  // test("Test Likho India Validate Page ", function (device,browser) {
  //       var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
  //         openLikhoindiaValidate(driver,device);
  //         checkLayout(driver, "././specs/likhoIndiaValidatePage.gspec", [device.deviceName]);
  //         driver.close();        
  //     });

      test("Test Likho India Contribute Page ", function (device,browser) {
        var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
          openLikhoindiaContribute(driver,device);
          checkLayout(driver, "././specs/likhoIndiaContributePage.gspec", [device.deviceName]);
          driver.close();        
      });

    }); 
  });