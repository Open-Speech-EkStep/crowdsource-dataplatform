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
  

function openFeedbackModal(driver)
{
  driver.findElement(By.cssSelector("button[data-testid=Button]")).click();
}


function openBadgeDetailPage(driver,device)
{
  if(device.isMobile)
  {
   
    driver.executeScript("scroll(0,1500)");
    Thread.sleep(1200);
    driver.findElement(By.xpath("//div/main/div[2]/div/section[2]/div/div[3]/div/a/b")).click();
}
else{

    driver.executeScript("scroll(0,20000)");
    Thread.sleep(1000);
    driver.findElement(By.xpath("//b[text()='Know More']")).click();
    Thread.sleep(1000);
}
}

  
forAll(devices, function () {
    forAll(browsers, function () {
      // test("Test Home page", function (device,browser) {
      //   var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName);         
      //     checkLayout(driver, "././specs/home_new.gspec", [device.deviceName]);
          
      //     openFeedbackModal(driver);

      //     checkLayout(driver, "././Specs/feedback.gspec", [device.deviceName]);
      //     driver.close();
        
      // });

      test("Test Badge Detila page page", function (device,browser) {
        var driver = createDriver("https://uat-ui.vakyansh.in",device.size,browser.browserName);         
          openBadgeDetailPage(driver,device);
          checkLayout(driver, "././specs/badgeDetailpage.gspec", [device.deviceName]);
          driver.close();
        
      });

    }); 
  });