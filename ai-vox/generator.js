// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('aivox_init_std_extension')) {
  Blockly.Extensions.unregister('aivox_init_std_extension');
}

if (Blockly.Extensions.isRegistered('aivox_init_lcd_extension')) {
  Blockly.Extensions.unregister('aivox_init_lcd_extension');
}

Blockly.Extensions.register('aivox_init_std_extension', function () {
  // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (boardType) {
    if(boardType.indexOf('aivox') > -1) {
        console.log("board is aivox");
        this.appendDummyInput('')
        .appendField("初始化 AI-VOX(标准I2S) 麦克风引脚 BCLK")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO5", "5"]]), "MIC_BCLK")
        .appendField("WS")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO2", "2"]]), "MIC_WS")
        .appendField("DIN")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO4", "4"]]), "MIC_DIN")   
         this.appendDummyInput('')
          .appendField("扬声器功放引脚 BCLK")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO13", "13"]]), "SPK_BCLK")
        .appendField("WS")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO14", "14"]]), "SPK_WS")
        .appendField("DOUT")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO1", "1"]]), "SPK_DOUT") 
         this.appendDummyInput('')
          .appendField("触发引脚Trigger")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO0", "0"]]), "TRIGGER_PIN")    
    } else {
        let pins = window['boardConfig'].digitalPins;
        this.appendDummyInput('')
        .appendField("初始化小智AI麦克风(标准I2S)引脚 BCLK")
        .appendField(new Blockly.FieldDropdown(pins), "MIC_BCLK")
        .appendField("WS")
        .appendField(new Blockly.FieldDropdown(pins), "MIC_WS")
        .appendField("DIN")
        .appendField(new Blockly.FieldDropdown(pins), "MIC_DIN")   
         this.appendDummyInput('')
          .appendField("扬声器功放引脚 BCLK")
        .appendField(new Blockly.FieldDropdown(pins), "SPK_BCLK")
        .appendField("WS")
        .appendField(new Blockly.FieldDropdown(pins), "SPK_WS")
        .appendField("DOUT")
        .appendField(new Blockly.FieldDropdown(pins), "SPK_DOUT") 
         this.appendDummyInput('')
          .appendField("触发引脚Trigger")
        .appendField(new Blockly.FieldDropdown(pins), "TRIGGER_PIN")    
    }
  };
  this.updateShape_(window['boardConfig'].name);
});


Blockly.Extensions.register('aivox_init_lcd_extension', function () {
  // 直接在扩展中添加updateShape_函数
  this.updateShape_ = function (boardType) {
    if(boardType.indexOf('aivox') > -1) {
        console.log("board is aivox");
        this.appendDummyInput('')
        .appendField("初始化 AI-VOX 显示屏(ST7789驱动) 背光引脚backLight")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO11", "11"]]), "backLight")
        .appendField("MOSI")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO17", "17"]]), "MOSI")
        .appendField("CLK")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO16", "16"]]), "CLK")   
          .appendField("DC")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO12", "12"]]), "DC")
        .appendField("RST")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO21", "21"]]), "RST")
        .appendField("CS")
        .appendField(new Blockly.FieldDropdown([
            ["GPIO15", "15"]]), "CS") 
    } else {
        let pins = window['boardConfig'].digitalPins;
        this.appendDummyInput('')
        .appendField("初始化小智AI显示屏(ST7789驱动) 背光引脚backLight")
        .appendField(new Blockly.FieldDropdown(pins), "backLight")
        .appendField("MOSI")
        .appendField(new Blockly.FieldDropdown(pins), "MOSI")
        .appendField("CLK")
        .appendField(new Blockly.FieldDropdown(pins), "CLK")   
        .appendField("DC")
        .appendField(new Blockly.FieldDropdown(pins), "DC")
        .appendField("RST")
        .appendField(new Blockly.FieldDropdown(pins), "RST")
        .appendField("CS")
        .appendField(new Blockly.FieldDropdown(pins), "CS") 
    }
  };
  this.updateShape_(window['boardConfig'].name);
});

// AIVOX wifi init
Arduino.forBlock['aivox_init_wifi'] = function (block, generator) {
    let wifi_ssid = generator.valueToCode(block, 'wifi_ssid', generator.ORDER_ATOMIC) || '""';
    let wifi_pwd = generator.valueToCode(block, 'wifi_pwd', generator.ORDER_ATOMIC) || '""';
    generator.addLibrary('AIVOX_wifi_init', '#include <WiFi.h>\n#include <driver/spi_common.h>\n#include <esp_heap_caps.h>');
    generator.addVariable('AIVOX_wifi_ssid_define', `#define WIFI_SSID ${wifi_ssid}`);
    generator.addVariable('AIVOX_wifi_pwd_define', `#define WIFI_PASSWORD ${wifi_pwd}`);

const setupCode = `
  WiFi.useStaticBuffers(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }`;
    generator.addSetup('aivox_wifi', setupCode, false);
    return '';
  };
  
Arduino.forBlock['aivox_init_std'] = function(block, generator) {
    const micBclk = block.getFieldValue('MIC_BCLK');
    const micWs = block.getFieldValue('MIC_WS');
    const micDin = block.getFieldValue('MIC_DIN');

    const spkBclk = block.getFieldValue('SPK_BCLK');
    const spkWs = block.getFieldValue('SPK_WS');
    const spkDout = block.getFieldValue('SPK_DOUT');
    const triggerPin = block.getFieldValue('TRIGGER_PIN');

    // Add Libraries
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
    generator.addLibrary('include_aivox_observer', '#include "ai_vox_observer.h"');
    generator.addLibrary('include_i2s_std_input', '#include "audio_input_device_sph0645.h"');
    generator.addLibrary('include_i2s_std_output', '#include "i2s_std_audio_output_device.h"');

    // Add Objects
    generator.addObject('aivox_observer', 'auto g_observer = std::make_shared<ai_vox::Observer>();', true);
 
    generator.addObject('aivox_kMicPinBclk', `constexpr gpio_num_t kMicPinBclk = GPIO_NUM_${micBclk};`, true);
    generator.addObject('aivox_kMicPinWs', `constexpr gpio_num_t kMicPinWs = GPIO_NUM_${micWs};`, true);
    generator.addObject('aivox_kMicPinDin', `constexpr gpio_num_t kMicPinDin = GPIO_NUM_${micDin};`, true);

    generator.addObject('aivox_kSpeakerPinBclk', `constexpr gpio_num_t kSpeakerPinBclk = GPIO_NUM_${spkBclk};`, true);
    generator.addObject('aivox_kSpeakerPinWs', `constexpr gpio_num_t kSpeakerPinWs = GPIO_NUM_${spkWs};`, true);
    generator.addObject('aivox_kSpeakerPinDout', `constexpr gpio_num_t kSpeakerPinDout = GPIO_NUM_${spkDout};`, true);

    generator.addObject('aivox_kTriggerPin', `constexpr gpio_num_t kTriggerPin = GPIO_NUM_${triggerPin};`, true);
    generator.addObject('aivox_input_device', `auto audio_input_device = std::make_shared<AudioInputDeviceSph0645>(kMicPinBclk, kMicPinWs, kMicPinDin);`, true);
    generator.addObject('aivox_output_device', `auto audio_output_device = std::make_shared<ai_vox::I2sStdAudioOutputDevice>(kSpeakerPinBclk, kSpeakerPinWs, kSpeakerPinDout);`, true);

    // Add Setup code
    const setupCode = `
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  ai_vox_engine.SetObserver(g_observer);
  ai_vox_engine.SetTrigger(kTriggerPin);
  ai_vox_engine.Start(audio_input_device, audio_output_device);
`;
    generator.addSetup('aivox_serial', "Serial.begin(115200);", false);
    generator.addSetup('aivox_start', setupCode, false);
    return ''; // This block generates setup code, not loop code.
};

Arduino.forBlock['aivox_init_lcd'] = function(block, generator) {
    const backLight = block.getFieldValue('backLight');
    const mosi = block.getFieldValue('MOSI');
    const clk = block.getFieldValue('CLK');
    const dc = block.getFieldValue('DC');
    const rst = block.getFieldValue('RST');
    const cs = block.getFieldValue('CS');
    const width = 240;
    const height = 240;

    generator.addLibrary('include_aivox_esp_lcd_panel_io', '#include <esp_lcd_panel_io.h>');
    generator.addLibrary('include_aivox_esp_lcd_panel_ops', '#include <esp_lcd_panel_ops.h>');
    generator.addLibrary('include_aivox_esp_lcd_panel_vendor', '#include <esp_lcd_panel_vendor.h>');

    generator.addLibrary('include_aivox_display', '#include "display.h"');

    generator.addObject('aivox_backLight', `constexpr gpio_num_t kDisplayBacklightPin = GPIO_NUM_${backLight};`, true);
    generator.addObject('aivox_mosi', `constexpr gpio_num_t kDisplayMosiPin = GPIO_NUM_${mosi};`, true);
    generator.addObject('aivox_clk', `constexpr gpio_num_t kDisplayClkPin = GPIO_NUM_${clk};`, true);
    generator.addObject('aivox_dc', `constexpr gpio_num_t kDisplayDcPin = GPIO_NUM_${dc};`, true);
    generator.addObject('aivox_rst', `constexpr gpio_num_t kDisplayRstPin = GPIO_NUM_${rst};`, true);
    generator.addObject('aivox_cs', `constexpr gpio_num_t kDisplayCsPin = GPIO_NUM_${cs};`, true);

    generator.addObject('aivox_kDisplaySpiMode', `constexpr auto kDisplaySpiMode = 0;`, true);
    generator.addObject('aivox_width', `constexpr uint32_t kDisplayWidth = ${width};`, true);
    generator.addObject('aivox_height', `constexpr uint32_t kDisplayHeight =  ${height};`, true);
    generator.addObject('aivox_kDisplayMirrorX', `constexpr bool kDisplayMirrorX = false;`, true);
    generator.addObject('aivox_kDisplayMirrorY', `constexpr bool kDisplayMirrorY = false;`, true);
    generator.addObject('aivox_kDisplayInvertColor', `constexpr bool kDisplayInvertColor = true;`, true);
    generator.addObject('aivox_kDisplaySwapXY', `constexpr bool kDisplaySwapXY = false;`, true);
    generator.addObject('aivox_kDisplayRgbElementOrder', `constexpr auto kDisplayRgbElementOrder = LCD_RGB_ELEMENT_ORDER_RGB;`, true);

    generator.addObject('aivox_init_display_obj', `std::unique_ptr<Display> g_display;`, true);

    generator.addObject('aivox_initDisplay', 
`void InitDisplay() {
  pinMode(kDisplayBacklightPin, OUTPUT);
  analogWrite(kDisplayBacklightPin, 255);
  spi_bus_config_t buscfg{
    .mosi_io_num = kDisplayMosiPin,
    .miso_io_num = GPIO_NUM_NC,
    .sclk_io_num = kDisplayClkPin,
    .quadwp_io_num = GPIO_NUM_NC,
    .quadhd_io_num = GPIO_NUM_NC,
    .max_transfer_sz = kDisplayWidth * kDisplayHeight * sizeof(uint16_t),
  };
  ESP_ERROR_CHECK(spi_bus_initialize(SPI3_HOST, &buscfg, SPI_DMA_CH_AUTO));
  esp_lcd_panel_io_handle_t panel_io = nullptr;
  esp_lcd_panel_handle_t panel = nullptr;
  // 液晶屏控制IO初始化
  ESP_LOGD(TAG, "Install panel IO");
  esp_lcd_panel_io_spi_config_t io_config = {};
  io_config.cs_gpio_num = kDisplayCsPin;
  io_config.dc_gpio_num = kDisplayDcPin;
  io_config.spi_mode = kDisplaySpiMode;
  io_config.pclk_hz = 40 * 1000 * 1000;
  io_config.trans_queue_depth = 10;
  io_config.lcd_cmd_bits = 8;
  io_config.lcd_param_bits = 8;
  ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi(SPI3_HOST, &io_config, &panel_io));

  // 初始化液晶屏驱动芯片
  ESP_LOGD(TAG, "Install LCD driver");
  esp_lcd_panel_dev_config_t panel_config = {};
  panel_config.reset_gpio_num = kDisplayRstPin;
  panel_config.rgb_ele_order = kDisplayRgbElementOrder;
  panel_config.bits_per_pixel = 16;
  ESP_ERROR_CHECK(esp_lcd_new_panel_st7789(panel_io, &panel_config, &panel));
  esp_lcd_panel_reset(panel);
  esp_lcd_panel_init(panel);
  esp_lcd_panel_invert_color(panel, kDisplayInvertColor);
  esp_lcd_panel_swap_xy(panel, kDisplaySwapXY);
  esp_lcd_panel_mirror(panel, kDisplayMirrorX, kDisplayMirrorY);
  g_display = std::make_unique<Display>(panel_io, panel, kDisplayWidth, kDisplayHeight, 0, 0, kDisplayMirrorX, kDisplayMirrorY, kDisplaySwapXY);
  g_display->Start();
}` , true);
    generator.addSetup('aivox_init_display', `InitDisplay();`, false);
    return '';
}

Arduino.forBlock['aivox_register_led_driver_status'] = function(block, generator) {
    const driverName = generator.valueToCode(block, 'driver_name', generator.ORDER_ATOMIC) || '""';
    let name = driverName.replace(/"/g, '');
    const driver_num = generator.valueToCode(block, 'driver_num', generator.ORDER_ATOMIC) || '""';
    const properties = generator.valueToCode(block, 'driver_properties', generator.ORDER_ATOMIC) || '""';
    const open = generator.valueToCode(block, 'driver_open', generator.ORDER_ATOMIC) || '""';
    const close = generator.valueToCode(block, 'driver_close', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_register_led`, `std::shared_ptr<ai_vox::iot::Entity> g_${name}_iot_entity;`, true);
    generator.addObject(`aivox_init_${name}_digital_state`, 
`void InitDigitalControl${name}Iot() {
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  std::vector<ai_vox::iot::Property> ${name}_properties({
      {
          ${driverName},                       
          ${properties},              
          ai_vox::iot::ValueType::kBool
      }
  });
  std::vector<ai_vox::iot::Function> ${name}_functions({
      {"TurnOn",     
       ${open},  
       {
           
       }},
      {"TurnOff",   
       ${close},  
       {
           
       }},
  });
  g_${name}_iot_entity = std::make_shared<ai_vox::iot::Entity>(${driverName},                      
                                                           ${properties},                   
                                                           std::move(${name}_properties),  
                                                           std::move(${name}_functions)
    );
  g_${name}_iot_entity->UpdateState(${driverName}, false);
  ai_vox_engine.RegisterIotEntity(g_${name}_iot_entity);
}`, true);
    generator.addSetup('aivox_register_led_driver_status', `InitDigitalControl${name}Iot();`, false);
    return "";
}

Arduino.forBlock['aivox_register_servo_driver_status'] = function(block, generator) {
    const driverName = generator.valueToCode(block, 'driver_name', generator.ORDER_ATOMIC) || '""';
    let name = driverName.replace(/"/g, '');
    const driver_num = generator.valueToCode(block, 'driver_num', generator.ORDER_ATOMIC) || '""';
    const properties = generator.valueToCode(block, 'driver_properties', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_register_servo`, `std::shared_ptr<ai_vox::iot::Entity> g_servo_iot_entity;`, true);
    generator.addObject(`aivox_init_digital_state`, 
`void InitServoControlIot() {
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  std::vector<ai_vox::iot::Property> servo_iot_properties;
  for (uint32_t i = 1; i <= ${driver_num}; i++) {
    std::string property_name = std::to_string(i) + "号舵机";
    std::string property_describe = std::to_string(i) + "号" + ${properties};
    servo_iot_properties.push_back({
        std::move(property_name),        
        std::move(property_describe),    
        ai_vox::iot::ValueType::kNumber  
    });
  }
  std::vector<ai_vox::iot::Function> servo_iot_functions({
      {"SetOneServo",
       "设置单个舵机角度",
       {{"angle_value", "舵机角度(0-180之间的整数)", ai_vox::iot::ValueType::kNumber, true},
        {"index", "舵机编号", ai_vox::iot::ValueType::kNumber, true}}},
      {"SetAllServos", "设置所有舵机角度", {{"angle_value", "舵机角度(0-180之间的整数)", ai_vox::iot::ValueType::kNumber, true}}}

  });
  g_servo_iot_entity = std::make_shared<ai_vox::iot::Entity>("Servo",                      
                                                           ${properties},                   
                                                           std::move(servo_iot_properties),  
                                                           std::move(servo_iot_functions)
    );
  for (uint32_t i = 1; i <= ${driver_num}; i++) {
    std::string property_name = std::to_string(i) + "号舵机";
    g_servo_iot_entity->UpdateState(std::move(property_name), 0);
  }
  ai_vox_engine.RegisterIotEntity(g_servo_iot_entity);
}`, false);
    generator.addSetup(`aivox_register_servo_driver_status`, `InitServoControlIot();`);
    return "";
}

// 
Arduino.forBlock['aivox_register_ultrasonic_sensor_driver_status'] = function(block, generator) {
    const driverName = generator.valueToCode(block, 'driver_name', generator.ORDER_ATOMIC) || '""';
    let name = driverName.replace(/"/g, '');
    const properties = generator.valueToCode(block, 'driver_properties', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_register_ultrasonic`, `std::shared_ptr<ai_vox::iot::Entity> g_us04_ultrasonic_sensor_iot_entity;`, true);
    generator.addObject(`aivox_init_ultrasonic_sensor_state`, 
`void InitUltrasonicSensorIot() {
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  std::vector<ai_vox::iot::Property> us04_ultrasonic_sensor_iot_properties({
      {
          ${driverName},                       
          ${properties},              
          ai_vox::iot::ValueType::kString
      }
  });
  std::vector<ai_vox::iot::Function> us04_ultrasonic_sensor_iot_functions({});
  g_us04_ultrasonic_sensor_iot_entity = std::make_shared<ai_vox::iot::Entity>(${driverName},                      
                                                           "超声波传感器",                   
                                                           std::move(us04_ultrasonic_sensor_iot_properties),  
                                                           std::move(us04_ultrasonic_sensor_iot_functions)
    );
  g_us04_ultrasonic_sensor_iot_entity->UpdateState("distance", "0");
  ai_vox_engine.RegisterIotEntity(g_us04_ultrasonic_sensor_iot_entity);
}`, true);
    generator.addSetup('aivox_register_us04_ultrasonic_driver_status', `InitUltrasonicSensorIot();`, false);
    return "";
}

Arduino.forBlock['aivox_register_dht11_sensor_driver_status'] = function(block, generator) {
    const dht11_temp_name = generator.valueToCode(block, 'dht11_temp_name', generator.ORDER_ATOMIC) || '""';
    const temp_properties = generator.valueToCode(block, 'temp_properties', generator.ORDER_ATOMIC) || '""';
    const dht11_humidity_name = generator.valueToCode(block, 'dht11_humidity_name', generator.ORDER_ATOMIC) || '""';
    const humidity_properties = generator.valueToCode(block, 'humidity_properties', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_register_dht11`, `std::shared_ptr<ai_vox::iot::Entity> g_dht11_sensor_iot_entity;`, true);
    generator.addObject(`aivox_init_dht11_sensor_state`, 
`void InitDht11SensorIot() {
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  std::vector<ai_vox::iot::Property> dht11_sensor_iot_properties({
      {
          ${dht11_temp_name},                       
          ${temp_properties},              
          ai_vox::iot::ValueType::kString
      },
      {
          ${dht11_humidity_name},                       
          ${humidity_properties},              
          ai_vox::iot::ValueType::kString
      }
  });
  std::vector<ai_vox::iot::Function> dht11_sensor_iot_functions({});
  g_dht11_sensor_iot_entity = std::make_shared<ai_vox::iot::Entity>("DHT11Sensor",                      
                                                           "DHT11温湿度传感器",                   
                                                           std::move(dht11_sensor_iot_properties),  
                                                           std::move(dht11_sensor_iot_functions)
    );
  g_dht11_sensor_iot_entity->UpdateState(${dht11_temp_name}, "0");
  g_dht11_sensor_iot_entity->UpdateState(${dht11_humidity_name}, "0");
  ai_vox_engine.RegisterIotEntity(g_dht11_sensor_iot_entity);
}`, true);
    generator.addSetup('aivox_register_dht11_driver_status', `InitDht11SensorIot();`, false);
    return "";
}

Arduino.forBlock['aivox_register_analog_sensor_driver_status'] = function(block, generator) {
    const aivox_analog_name = generator.valueToCode(block, 'aivox_analog_name', generator.ORDER_ATOMIC) || '""';
    let analog_name = aivox_analog_name.replace(/"/g, '');
    const aivox_analog_desc = generator.valueToCode(block, 'aivox_analog_desc', generator.ORDER_ATOMIC) || '""';
    const aivox_analog_status = generator.valueToCode(block, 'aivox_analog_status', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_register_${aivox_analog_name}`, `std::shared_ptr<ai_vox::iot::Entity> g_${analog_name}_sensor_iot_entity;`, true);
    generator.addObject(`aivox_init_${analog_name}_sensor_state`, 
`void Init${analog_name}SensorIot() {
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  std::vector<ai_vox::iot::Property> ${analog_name}_sensor_iot_properties({
      {
          ${aivox_analog_name},                       
          ${aivox_analog_status},              
          ai_vox::iot::ValueType::kString
      },
      {
      }
  });
  std::vector<ai_vox::iot::Function>  ${analog_name}_sensor_iot_functions({});
  g_${analog_name}_sensor_iot_entity = std::make_shared<ai_vox::iot::Entity>(${aivox_analog_name},                      
                                                           ${aivox_analog_desc},                   
                                                           std::move(${analog_name}_sensor_iot_properties),  
                                                           std::move(${analog_name}_sensor_iot_functions)
    );
  g_${analog_name}_sensor_iot_entity->UpdateState(${aivox_analog_name}, "0");
  ai_vox_engine.RegisterIotEntity(g_${analog_name}_sensor_iot_entity);
}`, true);
    generator.addSetup(`aivox_register_${analog_name}_driver_status`, `Init${analog_name}SensorIot();`, false);
    return "";
}

Arduino.forBlock['aivox_register_ws2812_driver_status'] = function(block, generator) {
    const aivox_ws2812_name = generator.valueToCode(block, 'aivox_ws2812_name', generator.ORDER_ATOMIC) || '""';
    let ws2812_name = aivox_ws2812_name.replace(/"/g, '');
    const aivox_ws2812_num = generator.valueToCode(block, 'aivox_ws2812_num', generator.ORDER_ATOMIC) || '""';
    generator.addObject(`aivox_register_${ws2812_name}`, `std::shared_ptr<ai_vox::iot::Entity> g_${ws2812_name}_iot_entity;`, true);
    generator.addObject(`aivox_init_${ws2812_name}_sensor_state`, 
`void Init${analog_name}Iot() {
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  std::vector<ai_vox::iot::Property> ${ws2812_name}_properties({
      {
          "brightness",                       
          "亮度(0-255)",,              
          ai_vox::iot::ValueType::kNumber
      },
      {
          "LedNums",                       
          "灯的数量",                      
          ai_vox::iot::ValueType::kNumber  
      }
  });
  for (uint32_t i = 1; i <= ${aivox_ws2812_num}; ++i) {
    const std::string property_name = "color" + std::to_string(i);
    const std::string property_describe = std::to_string(i) + "号灯颜色";
    ${ws2812_name}_properties.push_back({std::move(property_name), std::move(property_describe), ai_vox::iot::ValueType::kString});
  }
  std::vector<ai_vox::iot::Function>  ${ws2812_name}_functions({
  {"SetIndexColor",    
       "设置指定LED颜色",  
       {
           {
               "index",                          
               "LED索引(1-总数)",                
               ai_vox::iot::ValueType::kNumber,  
               true                              
           },
           {"red", "红色值(0-255)", ai_vox::iot::ValueType::kNumber, true},
           {"green", "绿色值(0-255)", ai_vox::iot::ValueType::kNumber, true},
           {"blue", "蓝色值(0-255)", ai_vox::iot::ValueType::kNumber, true},
       }},
      {"SetRangeIndexsColor",
       "设置连续LED范围颜色",
       {
           {"start", "起始LED索引(1-总数)", ai_vox::iot::ValueType::kNumber, true},
           {"end", "结束LED索引(1-总数)", ai_vox::iot::ValueType::kNumber, true},
           {"red", "红色值(0-255)", ai_vox::iot::ValueType::kNumber, true},
           {"green", "绿色值(0-255)", ai_vox::iot::ValueType::kNumber, true},
           {"blue", "蓝色值(0-255)", ai_vox::iot::ValueType::kNumber, true},
       }},
       {"SetBrightness",
       "设置亮度",
       {
           {"brightness", "亮度值(0-255)", ai_vox::iot::ValueType::kNumber, true},
       }},
       {"Clear", "清除所有LED", {}},
  });
  g_${ws2812_name}_iot_entity = std::make_shared<ai_vox::iot::Entity>(${aivox_ws2812_name},                      
                                                           "RGB灯环",                   
                                                           std::move(${ws2812_name}_properties),  
                                                           std::move(${ws2812_name}_functions)
    );
  g_ws2812b_iot_entity->UpdateState("brightness", 128);
  g_ws2812b_iot_entity->UpdateState("LedNums", ${aivox_ws2812_num});
  for (uint32_t i = 1; i <= ${aivox_ws2812_num}; ++i) {
    const std::string property_name = "color" + std::to_string(i);
    g_ws2812b_iot_entity->UpdateState(std::move(property_name), R"({"red":0,"green":0,"blue":0})");
  }
  ai_vox_engine.RegisterIotEntity(g_${ws2812_name}_iot_entity);
}`, true);
    generator.addSetup(`aivox_register_${ws2812_name}_driver_status`, `Init${ws2812_name}Iot();`, false);
    return "";
}


// --- Event Loop ---
Arduino.forBlock['aivox_loop'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');

    // Add necessary loop code
    const loopCode = `
  const auto events = g_observer->PopEvents();
  for (auto& event : events) {
${statements_do}
  }
  taskYIELD();
`;
    // Use addLoop to ensure it's added correctly, tag prevents duplicates if block used multiple times (though unlikely for this type)
    generator.addLoop('aivox_event_loop', loopCode, true);
    return ''; // The main loop logic is added via addLoop
};

// --- Event Checks and Data Getters ---
// Helper function to get the variable name for the current event type
function getEventVarName(block) {
    let parent = block.getParent();
    while (parent) {
        if (parent.type === 'aivox_event_is_activation') return 'activation_event';
        if (parent.type === 'aivox_event_is_state_change') return 'state_changed_event';
        if (parent.type === 'aivox_event_is_emotion') return 'emotion_event';
        if (parent.type === 'aivox_event_is_chat_message') return 'chat_message_event';
        if (parent.type === 'aivox_event_is_iot_message') return 'iot_message_event';
        parent = parent.getParent();
    }
    return null; // Should not happen if blocks are used correctly
}

Arduino.forBlock['aivox_set_ota_link'] = function (block, generator) {
    let ota_link = generator.valueToCode(block, 'ota_link', generator.ORDER_ATOMIC) || '""';
    let code = `ai_vox_engine->SetOtaUrl(${ota_link});\n`;
    return code;
};

Arduino.forBlock['aivox_lcd_show_status'] = function (block, generator) {
    let ai_vox_status = generator.valueToCode(block, 'ai_vox_status', generator.ORDER_ATOMIC) || '""';
    let code = `g_display->ShowStatus(${ai_vox_status});\n`;
    return code;
};

Arduino.forBlock['aivox_lcd_show_chat_message'] = function (block, generator) {
    const display_role = block.getFieldValue('ai_vox_display_role');
    let ai_vox_chat_message = generator.valueToCode(block, 'ai_vox_chat_message', generator.ORDER_ATOMIC) || '""';
    let code = `g_display->SetChatMessage(${display_role}, ${ai_vox_chat_message});\n`;
    return code;
};

Arduino.forBlock['aivox_lcd_show_emotion'] = function (block, generator) {
    let ai_vox_emotion = generator.valueToCode(block, 'ai_vox_emotion', generator.ORDER_ATOMIC) || '""';
    let code = `g_display->SetEmotion(${ai_vox_emotion});\n`;
    return code;
};
  
Arduino.forBlock['aivox_event_is_activation'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto activation_event = std::get_if<ai_vox::Observer::ActivationEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_activation_message'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    if (!eventVar || eventVar !== 'activation_event') {
        return ['/* ERROR: Block must be inside "If event is Activation" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->message.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_activation_code'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'activation_event') {
        return ['/* ERROR: Block must be inside "If event is Activation" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->code.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_event_is_state_change'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto state_changed_event = std::get_if<ai_vox::Observer::StateChangedEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_new_state'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'state_changed_event') {
        return ['/* ERROR: Block must be inside "If event is State Change" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->new_state`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_old_state'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'state_changed_event') {
        return ['/* ERROR: Block must be inside "If event is State Change" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->old_state`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_state_enum'] = function(block, generator) {
    const state = block.getFieldValue('STATE');
    return [state, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['aivox_event_is_emotion'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto emotion_event = std::get_if<ai_vox::Observer::EmotionEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_emotion'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'emotion_event') {
        return ['/* ERROR: Block must be inside "If event is Emotion" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->emotion.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_event_is_chat_message'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto chat_message_event = std::get_if<ai_vox::Observer::ChatMessageEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_chat_role'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'chat_message_event') {
        return ['/* ERROR: Block must be inside "If event is Chat Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->role`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_chat_role_enum'] = function(block, generator) {
    const role = block.getFieldValue('chat_role');
    return [role, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['aivox_get_chat_content'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'chat_message_event') {
        return ['/* ERROR: Block must be inside "If event is Chat Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->content.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};


Arduino.forBlock['aivox_event_is_iot_message'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    // const code = `const auto it = iot_message_event->parameters.find("index");\nint64_t index = std::get<int64_t>(it->second);\n`;
    const code = `if (auto iot_message_event = std::get_if<ai_vox::Observer::IotMessageEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_iot_message_event_name'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'iot_message_event') {
        return ['/* ERROR: Block must be inside "If event is iot Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->name`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_iot_led_message_event_fuction'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    const event_fuction = block.getFieldValue('event_fuction');
     if (!eventVar || eventVar !== 'iot_message_event') {
        return ['/* ERROR: Block must be inside "If event is iot Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->function == "${event_fuction}"`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_iot_servo_message_event_fuction'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    const event_fuction = block.getFieldValue('event_fuction');
     if (!eventVar || eventVar !== 'iot_message_event') {
        return ['/* ERROR: Block must be inside "If event is iot Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->function == "${event_fuction}"`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_iot_servo_message'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    const iot_servo_msg = block.getFieldValue('iot_servo_msg');
    if (!eventVar || eventVar !== 'iot_message_event') {
        return ['/* ERROR: Block must be inside "If event is iot Message" */', Arduino.ORDER_ATOMIC];
    }
    generator.addObject(`aivox_get_iot_servo_message`, `int getIotServoMessage(auto iotEvent, int type){
        int res = 0;    
            if(type == 1) {
                auto it = iotEvent->parameters.find("index");
                res = std::get<int64_t>(it->second);
            }else if(type == 2) {
                auto it = iotEvent->parameters.find("angle_value");
                res = std::get<int64_t>(it->second);
            }
            return res;
        }`);
    const code = `getIotServoMessage(iot_message_event, ${iot_servo_msg})`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_update_led_iot_state'] = function(block, generator) {
    let aivox_drive = generator.valueToCode(block, 'aivox_drive', generator.ORDER_ATOMIC) || '""';
    let name = aivox_drive.replace(/"/g, '');
    let aivox_drive_state = generator.valueToCode(block, 'aivox_drive_state', generator.ORDER_ATOMIC) || '""';
    let code = `g_${name}_iot_entity->UpdateState(${aivox_drive}, ${aivox_drive_state});\n`;
    return code;
};

Arduino.forBlock['aivox_update_servo_iot_state'] = function(block, generator) {
    let aivox_drive = generator.valueToCode(block, 'aivox_drive', generator.ORDER_ATOMIC) || '""';
    let aivox_drive_state = generator.valueToCode(block, 'aivox_drive_state', generator.ORDER_ATOMIC) || '""';
    let code = `g_servo_iot_entity->UpdateState(${aivox_drive}, ${aivox_drive_state});\n`;
    return code;
};

Arduino.forBlock['aivox_update_all_servo_iot_state'] = function(block, generator) {
    let aivox_servo_num = generator.valueToCode(block, 'aivox_servo_num', generator.ORDER_ATOMIC) || '""';
    let aivox_drive_state = generator.valueToCode(block, 'aivox_drive_state', generator.ORDER_ATOMIC) || '""';
    let code = `for (uint32_t i = 1; i <= ${aivox_servo_num}; i++) {
    g_servo_iot_entity->UpdateState(std::to_string(i) + "号舵机", ${aivox_drive_state});
}\n`;
    return code;
};

// 
Arduino.forBlock['aivox_update_ultrasonic_iot_state'] = function(block, generator) {
    let aivox_ultrasonic = generator.valueToCode(block, 'aivox_ultrasonic', generator.ORDER_ATOMIC) || '""';
    let aivox_ultrasonic_distance = generator.valueToCode(block, 'aivox_ultrasonic_distance', generator.ORDER_ATOMIC) || '""';
    let code = `g_us04_ultrasonic_sensor_iot_entity->UpdateState(${aivox_ultrasonic}, std::to_string(${aivox_ultrasonic_distance}));\n`;
    return code;
};

Arduino.forBlock['aivox_update_dht11_iot_state'] = function(block, generator) {
    let aivox_dht11 = generator.valueToCode(block, 'aivox_dht11', generator.ORDER_ATOMIC) || '""';
    let aivox_dnt11_value = generator.valueToCode(block, 'aivox_dnt11_value', generator.ORDER_ATOMIC) || '""';
    let code = `g_dht11_sensor_iot_entity->UpdateState(${aivox_dht11}, std::to_string(${aivox_dnt11_value}));\n`;
    return code;
};

Arduino.forBlock['aivox_update_analog_sensor_iot_state'] = function(block, generator) {
    let aivox_analog_sensor_name = generator.valueToCode(block, 'aivox_analog_sensor_name', generator.ORDER_ATOMIC) || '""';
    let analog_name = aivox_analog_sensor_name.replace(/"/g, '');
    let aivox_analog_sensor_value = generator.valueToCode(block, 'aivox_analog_sensor_value', generator.ORDER_ATOMIC) || '""';
    let code = `g_${analog_name}_sensor_iot_entity->UpdateState(${aivox_analog_sensor_name}, std::to_string(${aivox_analog_sensor_value}));\n`;
    return code;
};