# Build, Commit and Push

This skill builds the project, checks for errors, and only creates a commit and pushes to GitHub if the build is successful with no errors.

## Instructions

When the user invokes this skill:

1. **Run the build command**

   - Execute `npm run build` to build the project
   - This will run i18n compilation and Next.js build
   - Capture the full output

2. **Check for build errors**

   - If the build fails (exit code != 0), analyze the errors
   - Report the errors to the user with clear explanations
   - DO NOT proceed to commit or push
   - Offer to help fix the errors
   - After fixing errors, run the build again

3. **Repeat until build succeeds**

   - Keep fixing errors and rebuilding until `npm run build` exits with code 0
   - Ensure there are no TypeScript errors, ESLint errors, or build failures

4. **Analyze changes and group by purpose**

   - Once the build is completely successful with no errors:
     - Run `git status` to see what files have changed
     - Run `git diff` to see the actual changes
     - Run `git log -5 --oneline` to see recent commit style
     - **Analyze all changes and group them by purpose/type:**
       - Feature additions
       - Bug fixes
       - Refactoring
       - Documentation updates
       - Configuration changes
       - Translation updates
       - Style/UI changes
       - Performance improvements
       - etc.

5. **Create separate commits for different purposes**

   - **IMPORTANT:** Changes with different purposes MUST be in separate commits
   - For each group of related changes:
     - Stage only the files related to that specific purpose using `git add <files>`
     - Create a focused commit message in English that:
       - Summarizes the specific nature of this group (feature/fix/refactor/docs/etc.)
       - Focuses on "why" rather than "what"
       - Follows the existing commit message style
     - Create the commit with `git commit -m "your message"`
   - Repeat for each group until all changes are committed
   - **Examples:**
     - Commit 1: `feat: add user authentication with JWT tokens`
     - Commit 2: `fix: resolve memory leak in image loading component`
     - Commit 3: `docs: update README with deployment instructions`
   - **Never mix unrelated changes in a single commit**

6. **Push to GitHub**
   - After all commits are created, push them to the remote repository using `git push`
   - Confirm success to the user with a summary of all commits pushed

## Important Notes

- NEVER commit or push if the build has any errors
- **CRITICAL:** Always create separate commits for changes with different purposes (never mix unrelated changes)
- Always summarize the commit message in English regardless of the user's language
- Follow the existing commit message style in the repository
- Do not commit sensitive files like .env or credentials
- If build fails repeatedly, explain the issue clearly and wait for user guidance
- Stage files carefully - use specific file paths, not `git add .` when creating multiple commits

## Usage

The user can invoke this skill by saying:

- "build commit push"
- "build and push"
- "check build and commit"
- Or any similar phrase indicating they want to build, commit, and push
