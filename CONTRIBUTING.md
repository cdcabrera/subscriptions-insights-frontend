# Contributing
Contributing encompasses repository specific requirements.

## Process
<details>
<summary>Using Git</summary>

Curiosity makes use of
- GitHub's fork and pull workflow.
- A linear commit process and rebasing. GitHub merge commits, and squashing are discouraged in favor of smaller independent commits

**Working directly on the main repository is highly discouraged. Continuous Integration is dependent on branch structure.**

### Main repository branches and continuous integration
Curiosity makes use of the branches `dev`, `main`.
- `dev` branch is a representation of development and `stage-beta`.
   - When a branch push happens the `dev` branch is automatically deployed for `https://console.stage.redhat.com/preview`
- `main` branch is a representation of 3 environments `stage-stable`, `prod-beta`, and `prod-stable`.
   - When a branch push happens the `main` branch is automatically deployed for `https://console.stage.redhat.com/`
   - When a release candidate tag is created for the latest commit in `main` branch it will automatically be deployed for `https://console.redhat.com/preview`
   - When the latest commit message uses the form `chore(release): [version number]` and a release tag with the same release version is created in `main` branch it will automatically be deployed for `https://console.redhat.com/`

### Branch syncing
Linear commit history for Curiosity makes syncing concise
- `dev` is always rebased from `main`
   - typically after a release
   - or in prep for a fast-forward of `main`
- `main` is fast-forwarded from `dev`
   - typically when commits are prepared for release

</details>

<details>
<summary>Pull request workflow, and testing</summary>

All development work should be handled through GitHub's fork and pull workflow.

### Setting up a pull request
Development PRs should be opened against the `dev` branch. PRs directly to `main` are discouraged since branch structure
represents environment. However, exceptions are allowed for
- bug fixes
- build updates

As long those updates are also rebased against the `dev` branch.

> If your pull request work contains any of the following warning signs 
>  - out of sync commits, is not rebased against the `dev` branch
>  - poorly structured commits and messages
>  - any one commit relies on other commits to work correctly, in the same pull request
>  - dramatic file restructures that attempt complex behavior
>  - missing, relaxed, or removed unit tests
>  - dramatic unit test snapshot updates
>  - affects "many" files
>
> You will be encouraged to restructure your commits to help in review.

#### Pull request commits, messaging

Your pull request should contain Git commit messaging that follows the use of [conventional commit types](https://www.conventionalcommits.org/)
to provide consistent history and help generate [CHANGELOG.md](./CHANGELOG.md) updates.

Commit messages follow three basic guidelines
- No more than `65` characters for the first line
- If your pull request has more than a single commit you include the pull request number using the format
  ```
  [message] (#1234)
  ```
  
  You can also include the pull request number on a single commit, but
  GitHub will automatically apply the pull request number when the
  `squash` button is used on a pull request.

- Commit message formats follow the structure
  ```
  <type>(scope): <issue number><description>
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
- Commit messages, see [Pull request commits, messaging](#Pull%20request%20commits,%20messaging)
- Code documentation, see [Updating code documentation]()
- Pull request code, see [Updating unit tests during development]()
- Jenkins integration can be ignored until it actively runs integration testing.

> Caching for GitHub actions and NPM packages is active in order to speed up subsequent pull request
> updates. Occasionally test failures can occur after recent NPM package updates. Typically, this can
> present if a NPM package has moved, or removed, support for an old or new version of NodeJS. If
> test failures are happening shortly after a prior NPM update commit has merged into `dev`
> you may need to clear the GitHub actions cache and restart the related tests.

</details>

<details>
<summary>Releasing code</summary>
</details>

## Development
<details>
<summary>Install tooling</summary>

## Install tooling
Before developing you'll need to install:
 * [NodeJS and NPM](https://nodejs.org/)
 * [Docker](https://docs.docker.com/engine/install/)
   * Alternatively, you can try [Podman](https://github.com/containers/podman). [Homebrew](https://brew.sh/) can be used for the install `$ brew install podman`
 * And [Yarn](https://yarnpkg.com)

### OS support
The tooling for Curiosity is `Mac OS` centered.

While some aspects of the tooling have been expanded for Linux there may still be issues. It is encouraged that OS tooling
changes are contributed back while maintaining existing `Mac OS` functionality.

If you are unable to test additional OS support it is imperative that code reviews take place before integrating/merging build changes.

### NodeJS and NPM
The Curiosity build attempts to align to the current NodeJS LTS version. It is possible to test future versions of NodeJS LTS. See CI Testing for more detail. 

### Docker & Mac
Setting Docker up on a Mac? Install the appropriate package and you should be good to go. To check if everything installed correctly you can try these steps.
   1. In a terminal instance run
      ```
      $ docker run hello-world
      ```

### Docker & Linux
Setting Docker up on a Linux machine can include an additional convenience step. If you're having to prefix "sudo" in front of your Docker commands you can try these steps.
  * [Docker postinstall documentation](https://docs.docker.com/engine/install/linux-postinstall/)

### Yarn
Once you've installed NodeJS you can use NPM to perform the [Yarn](https://yarnpkg.com) install

  ```
  $ npm install yarn -g
  ``` 
</details>

<details>
<summary>Setup for React and Redux</summary>
</details>

<details>
<summary>Actual development</summary>
</details>

<details>
<summary>Testing</summary>
</details>
