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

5. **Hack away** (Opinions Wanted)
    ```sh
    # made changes to code
    git status
    git add <filename> # or git add .
    git commit
    ```

    Commit often. Break down your task into separate mini-tasks and commit each time.

    Keep commit messages short. Convention is below 50 characters, if you need more do it on a separate line.

    ***Commit Format***
    `(part of app you worked on) what you did`

    ***Commit message example***
    ```sh
    (signup) button disabled if inputs are invalid

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

