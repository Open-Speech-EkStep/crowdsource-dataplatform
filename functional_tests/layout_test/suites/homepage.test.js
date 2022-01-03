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


function openFeedbackModal(driver)
{
  driver.findElement(By.cssSelector(content.get("feedbackButton"))).click();
}

function openBadgeDetailPage(driver,device)
{
  if(device.isMobile)
  {
   
    driver.executeScript("scroll(0,1500)");
    Thread.sleep(1200);
    driver.findElement(By.xpath(content.get("knowMoreMobile"))).click();
  }
else
  {

    driver.executeScript("scroll(0,20000)");
    Thread.sleep(1000);
    driver.findElement(By.xpath(content.get("knowMore"))).click();
    Thread.sleep(1000);
  }
}

function create_driver(url,device,browser){
  var dr = createDriver(url,device.size,browser.browserName);
  return dr;
}
  
forAll(devices, function (device) {
    forAll(browsers, function (browser) {
      test("Test Home page", function (device,browser) {
        var driver = create_driver(content.get("url"),device,browser);       
          checkLayout(driver, "././specs/home_new.gspec", [device.deviceName]);
          openFeedbackModal(driver);
          Thread.sleep(1000);
          checkLayout(driver, "././specs/feedback.gspec", [device.deviceName]);
          driver.close();
        
      });

      test("Test Badge Detail Page", function (device,browser) {
        var driver = create_driver(content.get("url"),device,browser);        
          openBadgeDetailPage(driver,device);
          Thread.sleep(1000);
          checkLayout(driver, "././specs/badgeDetailpage.gspec", [device.deviceName]);
          driver.close();
        
      });

    }); 
  });