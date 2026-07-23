# APK Build Fix Instructions

The GitHub Actions APK build fails because it uses Java 21, but Capacitor/Gradle needs Java 17.

## Quick Fix (Manual — 1 minute)

1. Go to: https://github.com/daviekumi-glitch/ngoms-ai/edit/main/.github/workflows/build-apk.yml
2. Find this line:
   ```
   java-version: '21'
   ```
3. Change it to:
   ```
   java-version: '17'
   ```
4. Below the `build-apk` step, add this env block:
   ```yaml
   env:
     JAVA_HOME: ${{ env.JAVA_HOME_17_X64 }}
     GRADLE_OPTS: -Dorg.gradle.jvmargs=-Xmx2048m -Dorg.gradle.daemon=false
   ```
5. Click "Commit changes" → Done. Build will auto-trigger.

## Why This Happens
- Java 21 changed method signatures that Gradle 8.x depends on
- Capacitor's generated Android project requires Java 17 compatibility
- The `GRADLE_OPTS` flag prevents OOM (out of memory) errors in CI

## Full Fixed Workflow
See the content in `.github/workflows/build-apk.yml` — change `java-version: '21'` to `'17'` and add GRADLE_OPTS.
