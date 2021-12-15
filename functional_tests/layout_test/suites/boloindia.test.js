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
  
  
  function openBoloindia(driver,device)
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

  
  function openDashboard(driver,device)
  {
    if(device.isMobile)
      {
      Thread.sleep(500);
      driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
      Thread.sleep(700);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[2]")).click();
      Thread.sleep(1000);
      driver.executeScript("scroll(0, 5000);");
      Thread.sleep(1000);
      driver.findElement(By.xpath("//a[@data-testid='ViewAllDetailButton']")).click();
      
      }

      else
      {
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[2]")).click();
      Thread.sleep(700);
      driver.executeScript("scroll(0, 20000);");
      Thread.sleep(1000);
     driver.findElement(By.xpath("//a[@data-testid='ViewAllDetailButton']")).click();
      }
  }

  function openBoloindiaValidate(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[2]")).click();
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
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[2]")).click();
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
  


  function openBoloContribute(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[2]")).click();
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
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[2]")).click();
      Thread.sleep(2000);
      driver.findElement(By.id('contribution')).sendKeys("ଓଡିଆ");
      Thread.sleep(700);
      driver.findElement(By.xpath("//*[@data-testid='ActionCardcontribute']")).click();
      Thread.sleep(500);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(500);
    }
  
  }
  

  
  
  forAll(devices, function () {
    forAll(browsers, function () {
      // test("Test Bolo india Landing Page ", function (device,browser) {
      //   var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName);  
  
      //     openBoloindia(driver,device);
          
      //     checkLayout(driver, "././specs/boloindiaLandingPage.gspec", [device.deviceName]);
      //     driver.close();
        
      // });


      test("Test Bolo India Contribute page", function (device,browser) {

        var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
        
        openBoloContribute(driver,device);  
        checkLayout(driver, "././specs/boloIndiaContribution.gspec", [device.deviceName]);
        driver.close();
  
    }); 

    //       test("Test Bolo India Validate page", function (device,browser) {

    //     var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
        
    //     openBoloindiaValidate(driver,device);  
    //     checkLayout(driver, "././specs/boloIndiaValidatepage.gspec", [device.deviceName]);
    //     driver.close();
  
    // }); 

    //   test("Bolo India Dashboard Page",function(device,browser){

    //     var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName);  
    //     openDashboard(driver,device);
    //     checkLayout(driver, "././specs/boloIndiaDashboard.gspec", [device.deviceName]);
    //     driver.close();

    // });


    }); 
  });