# Huoshan AI Voice

ESP32 voice blocks for WiFi, I2S audio, Doubao ASR/TTS, Coze chat, and an optional LVGL touch panel.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-huoshan-ai-voice |
| Version | 0.2.6 |
| Author | ericoding |
| Source | G:\AilyProject\xiaozhi-ai-arduino |
| License | Project source license |

## Supported Boards

ESP32/ESP32-S3 WiFi boards with I2S microphone/speaker. Screen defaults target ST7789 + FT6336U-compatible touch.

## Description

The voice loop works without display hardware and bundles its ArduinoJson/WebSockets runtime sources for local-library imports. Screen blocks initialize LVGL, show state/chat text, provide touch-to-talk, and include a bundled 15px Source Han CJK LVGL font through the screen runtime header.

## Quick Start

Configure credentials, WiFi, mic pins, speaker pins, then call `begin`. For screen use, call `screen config` and `screen begin`; touch is read directly over `Wire`.
