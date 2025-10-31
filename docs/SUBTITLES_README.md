# 📝 Demo Video Subtitles

This directory contains subtitle files for the Encrypted Signal Sharing Pool demo video.

## 📁 Files

### `DEMO_SUBTITLES.srt`
**SRT format** - Standard subtitle format compatible with:
- Video editing software (Premiere Pro, Final Cut Pro, DaVinci Resolve)
- YouTube automatic captions
- Most video players (VLC, Windows Media Player, etc.)

**Format**: SubRip (SRT) with timestamps in `HH:MM:SS,mmm` format

### `DEMO_SUBTITLES.txt`
**Text format** - Simple timestamp format for:
- Quick reference
- Script reading
- Manual editing

**Format**: `[MM:SS]` timestamps with text

## ⏱️ Video Duration

- **Total length**: 2 minutes 40 seconds (160 seconds)
- **Compressed from**: Original 3 minutes 58 seconds (238 seconds)
- **Compression ratio**: ~67%

## 📋 Content Structure

The subtitles cover:
1. **Introduction** (0:00-0:12) - Welcome and core concept
2. **Core Values** (0:12-0:30) - Privacy protection and features
3. **Project Advantages** (0:30-0:56) - Three main advantages
4. **Zama Tech Stack** (0:56-1:27) - Technical details
5. **System Architecture** (1:27-1:57) - Technical architecture
6. **Quick Start & Features** (1:57-2:19) - Getting started and features
7. **Use Cases & Highlights** (2:19-2:38) - Business value
8. **Closing** (2:38-2:40) - Credits and thanks

## 🎬 Usage

### For Video Editors:
1. Import the `.srt` file into your video editing software
2. Adjust timing if needed to match your video pace
3. Style the subtitles according to your brand guidelines

### For YouTube:
1. Upload your video
2. Go to **Subtitles** → **Add new subtitle**
3. Upload `DEMO_SUBTITLES.srt`
4. YouTube will auto-sync the subtitles

### For Manual Editing:
1. Use `DEMO_SUBTITLES.txt` for easy reading and editing
2. Convert back to SRT format when done

## ✏️ Editing Tips

- **SRT format** uses milliseconds: `00:00:05,000` (5 seconds)
- Each subtitle entry has:
  - Sequence number
  - Timestamp range (`start --> end`)
  - Text content (can span multiple lines)
  - Empty line separator

Example:
```
1
00:00:00,000 --> 00:00:05,000
First subtitle text
This can be multiple lines

2
00:00:05,000 --> 00:00:10,000
Second subtitle text
```

## 📝 Notes

- All timestamps are compressed to fit 2:40 video length
- Text content has been preserved from original script
- Timestamps are approximate and may need fine-tuning to match actual video

---

**Last Updated**: 2025-01-XX  
**Video Length**: 2:40  
**Format**: SRT (SubRip) + TXT (Simple)

