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



function openDekhoindia(driver,device)
{
  if(!device.isMobile)
  {
    Thread.sleep(1500);
    driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[4]")).click();
    Thread.sleep(2000);

    driver.findElement(By.id('contribution')).sendKeys("ಕನ್ನಡ");
    Thread.sleep(2000);
  }
  else
  {

    Thread.sleep(1500);
    //driver.manage().timeouts().implicitlyWait(5);
    driver.findElement(By.xpath("//*[@data-testid='Navigation']/button")).click();
    Thread.sleep(2000);

    driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[4]")).click();
    Thread.sleep(2000);


    ////*[@id="__next"]/div/header/div[1]/div/nav/div/div/a[1]
    driver.findElement(By.id('contribution')).sendKeys("ಕನ್ನಡ");
    Thread.sleep(2000);

  }

}



function openDekhoindiaContribute(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[4]")).click();
      Thread.sleep(1000);
      driver.findElement(By.id('contribution')).sendKeys("ਪੰਜਾਬੀ");
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
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[4]")).click();
      Thread.sleep(2000);
      driver.findElement(By.id('contribution')).sendKeys("ਪੰਜਾਬੀ");
      Thread.sleep(700);
      driver.findElement(By.xpath("//*[@data-testid='ActionCardcontribute']")).click();
      Thread.sleep(500);
      driver.findElement(By.xpath("//button[@type='submit']")).click();
      Thread.sleep(500);
    }
  
  }




  function openDekhoindiaValidate(driver,device)
  {
    if(!device.isMobile)
    {
      Thread.sleep(1500);
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[4]")).click();
      Thread.sleep(1000);
      driver.findElement(By.id('contribution')).sendKeys("ਪੰਜਾਬੀ");
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
      driver.findElement(By.xpath("//*[@data-testid='NavigationList']/a[4]")).click();
      Thread.sleep(2000);
      driver.findElement(By.id('contribution')).sendKeys("ਪੰਜਾਬੀ");
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
    // test("Test dekho india ", function (device,browser) {
    //   var driver = createDriver("https://dev-next.vakyansh.in",device.size,browser.browserName); 
    //     openDekhoindia(driver,device);
        
    //     checkLayout(driver, "././specs/dekhoindiaLandingPage.gspec", [device.deviceName]);
    //     driver.close();
      
    // });

    // test("Test dekho India validate", function (device,browser) {
    //   var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
    //   openDekhoindiaValidate(driver,device);
    //     checkLayout(driver, "././specs/dekhoIndiaValidate.gspec", [device.deviceName]);
    //     driver.close();
      
    // });

    test("Test dekho india coontribute", function (device,browser) {
      var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName); 
      openDekhoindiaContribute(driver,device);
        
        checkLayout(driver, "././Specs/dekhoIndiaContribute.gspec", [device.deviceName]);
        driver.close();
      
    });
  }); 
});