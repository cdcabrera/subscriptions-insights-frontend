# Contributing
Contributing encompasses repository specific requirements.

## Process
<details>
<summary><h3 style="display: inline-block">Using Git</h3></summary>

Curiosity makes use of
- GitHub's fork and pull workflow.
- A linear commit process and rebasing. GitHub merge commits, and squashing are discouraged in favor of smaller independent commits

> Working directly on the main repository is highly discouraged. Continuous Integration is dependent on branch structure.

#### Main repository branches and continuous integration
Curiosity makes use of the branches `dev`, `main`.
- `dev` branch is a representation of development and `stage-beta`.
   - When a branch push happens the `dev` branch is automatically deployed for `https://console.stage.redhat.com/preview`
- `main` branch is a representation of 3 environments `stage-stable`, `prod-beta`, and `prod-stable`.
   - When a branch push happens the `main` branch is automatically deployed for `https://console.stage.redhat.com/`
   - When a release candidate tag is created for the latest commit in `main` branch it will automatically be deployed for `https://console.redhat.com/preview`
   - When the latest commit message uses the form `chore(release): [version number]` and a release tag with the same release version is created in `main` branch it will automatically be deployed for `https://console.redhat.com/`

#### Branch syncing
Linear commit history for Curiosity makes syncing concise
- `dev` is always rebased from `main`
   - typically after a release
   - or in prep for a fast-forward of `main`
- `main` is fast-forwarded from `dev`
   - typically when commits are prepared for release

</details>

<details>
<summary><h3 style="display: inline-block">Pull request workflow, and testing</h3></summary>

All development work should be handled through GitHub's fork and pull workflow.

#### Setting up a pull request
Development pull requests (PRs) should be opened against the `dev` branch. PRs directly to `main` are discouraged since branch structure
represents environment. However, exceptions are allowed, as long those updates are also rebased against the `dev` branch, for...
- bug fixes
- build updates

> If your pull request work contains any of the following warning signs 
>  - out of sync commits (is not rebased against the `dev` branch)
>  - poorly structured commits and messages
>  - any one commit relies on other commits to work at all, in the same pull request
>  - dramatic file restructures that attempt complex behavior
>  - missing, relaxed, or removed unit tests
>  - dramatic unit test snapshot updates
>  - affects any file not directly associated with the associated issue being resolved
>  - affects "many" files
>
> You will be encouraged to restructure your commits to help in review.

#### Pull request commits, messaging

Your pull request should contain Git commit messaging that follows the use of [conventional commit types](https://www.conventionalcommits.org/)
to provide consistent history and help generate [CHANGELOG.md](./CHANGELOG.md) updates.

Commit messages follow three basic guidelines
- No more than `65` characters for the first line
- If your pull request has more than a single commit you should include the pull request number in your message using the format. This additional copy is not counted towards the `65` character limit.
  ```
  [message] (#1234)
  ```
  
  You can also include the pull request number on a single commit, but
  GitHub will automatically apply the pull request number when the
  `squash` button is used on a pull request.

- Commit message formats follow the structure
  ```
  <type>(<scope>): <issue number><description>
  ```
  Where
  - Type = the type of work the commit resolves.
     - Basic types include `feat` (feature), `fix`, `chore`, `build`.
     - See [conventional commit types](https://www.conventionalcommits.org/) for additional types.
  - Scope = the area of code affected.
     - Can be a directory or filenames
     - Does not have to encompass all file names affected
  - Issue number = the Jira issue number
     - Currently, the prefix `sw-[issue number]` represents `SWATCH-[issue number]`
  - Description = what the commit work encompasses

  Example
  ```
  feat(config): sw-123 rhel, activate instance inventory
  ```
> Not all commits need an issue number. But it is encouraged you attempt to associate
> a commit with an issue for tracking. In a scenario where no issue is available
> exceptions are made for `fix`, `chore`, and `build`.

#### Pull request test failures
Creating a pull request fires the following checks through GitHub actions.
- Commit message linting, see [commit_lint.yml](./.github/workflows/commit_lint.yml)
- Code documentation linting, see [documentation_lint.yml](./.github/workflows/documentation_lint.yml)
- Pull request code linting, unit tests and repo-level integration tests, see [pull_request.yml](./.github/workflows/pull_request.yml)
- Jenkins integration testing. Currently, Jenkins re-runs the same tests being used in [pull_request.yml](./.github/workflows/pull_request.yml)

> You can always attempt to restart Jenkins testing by placing a pull request comment
> with the copy `/retest`.

To resolve failures for any GitHub actions make sure you first review the results of the test by
clicking the `checks` tab on the related pull request.

For additional information on failures for
- Commit messages, see [Pull request commits, messaging](#pull-request-commits-messaging)
- Code documentation, see [Updating code documentation]()
- Pull request code, see [Updating unit tests during development]()
- Jenkins integration can be ignored until it actively runs integration testing.

> Caching for GitHub actions and NPM packages is active. This caching allows subsequent pull request
> updates to avoid reinstalling yarn dependencies. 
> 
> Occasionally test failures can occur after recent NPM package updates either in the pull request
> itself or in a prior commit to the pull request. The most common reason for this failure presents when
> a NPM package has changed its support for different versions of NodeJS and those packages are updated
> in the `dev` branch. 
> 
> If test failures are happening shortly after a NPM package update you may need to clear the
> GitHub actions cache and restart the related tests.

</details>

<details>
<summary><h3 style="display: inline-block">Releasing code for all environments</h3></summary>

Curiosity releases code to the following environments
   - stage preview
   - stage stable
   - production preview
   - production stable

> After pushing code, or tagging, a repository hook notifies continuous integration and starts the process of
> environment updates.

#### Release for stage preview
Merging code into stage preview is simplistic
1. merge a pull request into `dev`
   ```
   pull-request -> dev -> stage preview
   ```

#### Release for stage stable
To merge code into stage stable
1. open a pull request from `dev` to `main` and merge using the `rebase` button.
   ```
   dev -> pull-request -> main -> stage stable
   ```

#### Release for production preview
To merge code into production preview
1. tag the most recent commit on `main` as a release candidate using the format, where `rc.0` index is a typical starting point.
`v[x].[x].[x]-rc.[x]`
   ```
   main -> release cadidate tag -> production preview
   ```

#### Release for production stable
To merge code into production stable a maintainer must run the release commit process locally.

   ```
   local main repo, main branch -> release commit -> origin main -> tag -> production stable
   ```

1. clone the main repository, within the repo confirm you're on the `main` branch and synced with `origin` `main`
1. run
   1. `$ git checkout main`
   1. `$ yarn`
   1. `$ yarn release --dry-run` to confirm the release output version and commits.
   1. `$ yarn release` to generate the commit and file changes.
      
      >If the version recommended should be different you can run the command with an override version following a semver format
      >  ```
      >  $ yarn release --override X.X.X
      >  ``` 
1. Confirm you now have a release commit with the format `chore(release): X.X.X` and there are updates to
   - `package.json`
   - `CHANGELOG.md`
   If there are issues with the file updates you can correct them and squish any fixes into the `chore(release): X.X.X` commit
1. Push the **SINGLE** commit to `origin` `main`
1. Using the [Curiosity GitHub releases interface](https://github.com/RedHatInsights/curiosity-frontend/releases)
   1. Draft a new release from `main` confirming you are aligned with the `chore(release): X.X.X` commit hash
   1. Create the new tag using the **SAME** semver version created by the release commit but add a `v` prefix to it, i.e. `vX.X.X`, for consistency.
   
   > To avoid issues with inconsistent Git tagging use it is recommended you use the GitHub releases interface.

</details>

## Development
<details>
<summary><h3 style="display: inline-block">Install tooling</h3></summary>

Before developing you'll need to install:
 * [NodeJS and NPM](https://nodejs.org/)
 * [Docker](https://docs.docker.com/desktop/)
   * Alternatively, you can try [Podman](https://github.com/containers/podman). [Homebrew](https://brew.sh/) can be used for the install `$ brew install podman`
 * And [Yarn](https://yarnpkg.com)

#### OS support
The tooling for Curiosity is `Mac OS` centered.

While some aspects of the tooling have been expanded for Linux there may still be issues. It is encouraged that OS tooling
changes are contributed back while maintaining existing `Mac OS` functionality.

If you are unable to test additional OS support it is imperative that code reviews take place before integrating/merging build changes.

#### NodeJS and NPM
The Curiosity build attempts to align to the current NodeJS LTS version. It is possible to test future versions of NodeJS LTS. See CI Testing for more detail. 

#### Docker and Mac
Setting [Docker](https://docs.docker.com/desktop/) up on a Mac? Install the appropriate package. Confirm everything installed correctly by trying these steps.
   1. In a terminal instance run
      ```
      $ docker run hello-world
      ```

Reference the Docker documentation for additional installation help.

#### Docker and Linux
Setting Docker up on a Linux machine may include additional steps.
  * [Docker on Linux](https://docs.docker.com/desktop/install/linux-install/)

Reference the Docker documentation for additional installation help.

#### Yarn
Once you've installed NodeJS you can use NPM to perform the [Yarn](https://yarnpkg.com) install

  ```
  $ npm install yarn -g
  ``` 
</details>

<details>
<summary><h3 style="display: inline-block">Setup for React and Redux</h3></summary>
</details>

<details>
<summary><h3 style="display: inline-block">Actual development</h3></summary>
</details>

<details>
<summary><h3 style="display: inline-block">Testing</h3></summary>
</details>
