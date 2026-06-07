# Sound Assets

Place the following .mp3 files in this directory, then add them to your native project:

## Files Needed

| File          | Description            | Duration | Notes                    |
|---------------|------------------------|----------|--------------------------|
| bg_home.mp3   | Home screen background | 30-60s   | Looping, low volume      |
| bg_game.mp3   | Game screen background | 30-60s   | Looping, low volume      |
| tap.mp3       | Cell tap sound         | ~0.2s    | Short click              |
| win.mp3       | Win celebration sound  | ~2s      | Cheer / fanfare          |
| draw.mp3      | Draw game sound        | ~1s      | Gentle tone              |
| error.mp3     | Invalid move sound     | ~0.3s    | Buzz / negative click    |
| button.mp3    | UI button click        | ~0.15s   | Soft click               |

## Native Setup

### iOS
1. Open `ios/TicTacToeFourPlayers.xcodeproj` in Xcode
2. Drag all .mp3 files into the project under the target
3. Ensure "Copy items if needed" is checked
4. Confirm files appear in "Bundle Resources" build phase

### Android
1. Place .mp3 files in `android/app/src/main/res/raw/`
2. File names must be lowercase, no special characters (e.g., `bg_home.mp3`)
3. Android references files without extension, so `bg_home.mp3` becomes `bg_home`

## Testing

The SoundManager gracefully handles missing files. To verify sounds work:
1. Add audio files following the instructions above
2. Rebuild the native app: `npx react-native run-ios` or `npx react-native run-android`
3. Toggle sound ON via the Home screen sound toggle
