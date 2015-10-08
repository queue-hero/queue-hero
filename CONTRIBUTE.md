### Git Workflow draft

1. **Fork team's repo**

2. **Clone the fork you just made onto your computer**
    `$ git clone http://github.com/team-name/project-name.git`

    `git clone` by default will show only the master when cloned.

    `$ git checkout -b dev origin/dev`

3. **Set your upstream as the team's repo**
    `$ git remote add upstream http://github.com/team-name/project-name.git`

4. **Create a new branch**
    `$ git checkout -b chatDatabaseQuery`

    Keep the names short but descriptive. No need to include your name.

5. **Hack away**
    ```sh
    # made changes to code
    git status
    git add <filename> # or git add .
    git commit
    ```

    Commit often. Break down your task into separate mini-tasks and commit each time.

    [Use the git commit style used by Karma team](https://karma-runner.github.io/0.13/dev/git-commit-msg.html)

    ```sh
    <type>(<scope>): <subject>

    <body>
    ```

    **Message subject**

    First line cannot be longer than 70 characters, second line is always blank and other lines should be wrapped at 80 characters.

    The *type* and *scope* should always be lowercase as shown below.

    ***Allowed type values:***

    - **feat** (new feature for the user, not a new feature for build script)
    - **fix** (bug fix for the user, not a fix to a build script)
    - **docs** (changes to the documentation)
    - **style** (formatting, missing semi colons, etc; no production code change)
    - **refactor** (refactoring production code, eg. renaming a variable)
    - **test** (adding missing tests, refactoring tests; no production code change)
    - **chore** (updating grunt tasks etc; no production code change)

    ***Example scope values:***

    - init
    - runner
    - watcher
    - config
    - web-server
    - proxy
    - etc.

    The *scope* can be empty (eg. if the change is a global or difficult to assign to a single component), in which case the parentheses are omitted. In smaller projects such as Karma plugins, the <scope> is empty.

    **Message body**

    Use the imperative, present tense: "change" not "changed" nor “"changes"

    Include motivation for the change and contrasts with previous behavior

    ***Commit message example***
    ```sh
    fix(signup): change button state if inputs are invalid

    - validation for e-mail, phonenumber
    - username, passwords and email are set as required
    ```

6. **Prepare your code for pull request**
    - Read through code and add comments if necessary.
    - Fix errors flagged by JSHint.
    - Check if code conforms with the style guide.

7. **Pull from upstream**
    `$ git pull upstream dev`

8. **Fix all merge conflicts**
    ```sh
    # Fix merge conflicts
    $ git status
    $ git add .
    ```

9. **Push to github repo**
    `$ git push origin chatDatabaseQuery`

10. **Make pull request on github.com**
    Title the request so the reviewer can see what the pull request does.

11. **Update Trello**
    - Add pull request number `(##)` at beginning of card.
      - If the pull request spans multiple cards (ideally it should not), combine it into one card.
    - Move card to list titled "Pending Pull Request."
    - Approver will move card to "Completed" list.

12. **(Optional) After approval, update dev branch and delete feature branch**
    ```sh
    $ git checkout dev
    $ git pull upstream dev
    # you can also do git merge featureBranch if your local dev is up-to-date with upstream dev
    $ git branch -d featureBranch # use -D if you havn't merged local dev
    ```

