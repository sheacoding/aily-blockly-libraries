# Huoshan AI Voice Streaming Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original PlatformIO project's real-time voice experience in the Aily Blockly library, including accurate lossless ASR input, low first-audio latency, and bounded automatic recovery from WebSocket failures.

**Architecture:** Keep recording, ASR transport, Coze SSE parsing, TTS synthesis, and I2S playback as independent streaming stages. Use a FreeRTOS byte ring buffer with backpressure for microphone audio, retain the complete recording only as an exceptional reconnect fallback, synthesize Coze output sentence by sentence over a reusable TTS WebSocket, and keep HTTP TTS only as a pre-audio fallback.

**Tech Stack:** Aily Blockly generator JavaScript, Arduino ESP32 Core 3.x, FreeRTOS, arduinoWebSockets, ArduinoJson, ESP32 legacy I2S, Bun compliance validator.

**Implementation Status:** Code, generated sketch compilation, architecture regression checks, compliance validation, and package dry-run are complete. Physical-device latency and recognition quality require the final serial-log verification after flashing.

---

### Task 1: Lock the PIO architecture into a regression test

**Files:**
- Create: `G:/tmp/test-huoshan-streaming-runtime.js`
- Modify: none

- [ ] Assert that ASR uses 10 ms PCM chunks and a FreeRTOS ring buffer.
- [ ] Assert that recording uses blocking backpressure instead of packet-drop accounting.
- [ ] Assert that Coze preconnects TTS and dispatches complete sentences while SSE is still arriving.
- [ ] Assert that WebSocket TTS is attempted before HTTP fallback.
- [ ] Run `node G:\tmp\test-huoshan-streaming-runtime.js` and confirm it fails against the current batch-oriented implementation.

### Task 2: Restore lossless real-time ASR transport

**Files:**
- Modify: `huoshan-ai-voice/generator.js`

- [ ] Add `freertos/ringbuf.h` to generated includes.
- [ ] Replace the fixed packet pool and free-index queues with a 32 KB byte ring buffer.
- [ ] Read 160 PCM16 samples per I2S operation, apply gain once, append to the diagnostic recording, and send the 320-byte frame to the ring buffer with `portMAX_DELAY`.
- [ ] Run recording and ASR consumers as unpinned priority-1 tasks, matching the reference scheduler behavior.
- [ ] Send WebSocket frames through the normal `sendBIN(payload, length)` path so sub-1400-byte payloads use the library's optimized single-TCP-packet implementation.
- [ ] Keep the complete recording only for one bounded reconnect upload after a real connection/send failure.
- [ ] Log ASR first-connect time, packet count, average send time, maximum send time, reconnect count, and stop-to-final-result time.

### Task 3: Restore Coze-to-TTS overlap

**Files:**
- Modify: `huoshan-ai-voice/generator.js`

- [ ] Start a background TTS WebSocket connection immediately after Coze accepts the HTTP request.
- [ ] Append assistant answer deltas to both the public reply and a TTS sentence buffer.
- [ ] Dispatch each complete Chinese or ASCII sentence to TTS as soon as punctuation arrives.
- [ ] Send the final remainder with `disconnectAfter=true`; if there is no remainder, explicitly finish the current TTS sequence.
- [ ] Record Coze first-delta and first-sentence latency metrics.

### Task 4: Make WebSocket streaming TTS primary

**Files:**
- Modify: `huoshan-ai-voice/generator.js`

- [ ] Reuse one TTS WebSocket across all sentences in one Coze response.
- [ ] Queue every PCM packet immediately to the existing independent I2S playback task.
- [ ] Treat a negative sequence number as synthesis completion.
- [ ] Reconnect and retry once when the connection fails before any PCM packet is received.
- [ ] Use HTTP TTS only when WebSocket setup or request submission fails before playback starts.
- [ ] Wait for the playback queue only after the final sentence, then transition to `idle`.
- [ ] Log TTS first-audio latency, packet count, bytes, reconnect count, and final-sequence status.

### Task 5: Add network recovery defaults

**Files:**
- Modify: `huoshan-ai-voice/generator.js`

- [ ] Enable static WiFi buffers, station auto-reconnect, and disabled WiFi sleep before connecting.
- [ ] Configure bounded WebSocket reconnect intervals without allowing stale requests to leak into the next conversation.
- [ ] Clear ASR and TTS request state at every conversation boundary.

### Task 6: Update documentation and generated-library metadata

**Files:**
- Modify: `huoshan-ai-voice/readme_ai.md`
- Modify only if user-facing defaults change: `huoshan-ai-voice/block.json`
- Modify only if user-facing defaults change: `huoshan-ai-voice/toolbox.json`
- Modify only if user-facing text changes: `huoshan-ai-voice/i18n/zh_cn.json`

- [ ] Document the recommended microphone gain and clipping interpretation.
- [ ] Document that ASR and TTS automatically reconnect once on transport failure.
- [ ] Document expected latency log fields for hardware verification.

### Task 7: Verify generated code and package compliance

**Files:**
- Modify: none

- [ ] Run the architecture regression test and confirm all assertions pass.
- [ ] Run `node --check huoshan-ai-voice/generator.js`.
- [ ] Sync `generator.js` into the user's local Aily project and regenerate the temporary sketch.
- [ ] Run Aily preprocess and ESP32-S3 compile.
- [ ] Run `bun .scripts_git_action\validate-library-compliance.js huoshan-ai-voice`.
- [ ] Run `npm pack .\huoshan-ai-voice --dry-run --json` and verify required files are included.
- [ ] Do not commit or push unless the user explicitly requests it after hardware verification.
