# GitHub Issues & Milestones Guide for AI Agents

## Objective
As an AI Developer Agent working on this project, you have a critical responsibility: **maintain strict and graceful tracking of our work using GitHub Issues and Milestones.** 

This guide outlines the disciplined workflow you MUST follow in every chat to ensure our project management stays up-to-date automatically as we progress.

---

## 🚦 Core Rules & Discipline

1. **Never work in the shadows**: Every significant code change, feature addition, refactor, or bug fix MUST be tracked by a GitHub issue.
2. **Search First**: Always use GitHub search tools to check if an issue already exists for the task before creating a new one to avoid duplicates.
3. **Milestone Alignment**: Ensure issues are associated with the correct, active milestone if one applies to the current scope of work. Always check existing milestones.
4. **Continuous Documentation**: Record important technical decisions, blockers, and sub-task completions as comments on the respective issue.

---

## 🛠️ The Agent Workflow

Every time you are assigned a task, start a new chat, or begin a new unit of work, seamlessly integrate the following steps:

### Step 1: Issue Discovery & Creation (Planning Phase)
- **Search**: Look for existing open issues related to your current task.
- **Adopt or Create**:
  - *If an issue exists*: Read it to understand the context and add a comment indicating you are starting work on it.
  - *If no issue exists*: Create a new issue using your GitHub tools.
- **Issue Formatting**:
  - **Title**: Clear, concise, and action-oriented (e.g., `Implement JWT Authentication for API`).
  - **Body**: Include a description of the "Why", "What", and "Acceptance Criteria". Use Markdown checklists (`- [ ]`) for breaking down the task.
  - **Milestone**: Assign the issue to the current active milestone (query available milestones if necessary).
  - **Labels/Assignees**: Apply relevant labels (e.g., `enhancement`, `bug`, `documentation`) and assign the issue to yourself or the appropriate user.

### Step 2: Implementation & Tracking (Execution Phase)
- **Branch Naming**: When creating a branch, include the issue number (e.g., `feature/123-jwt-auth`).
- **Progress Updates**: If a task is complex, takes multiple steps, or requires a change in technical direction, add a concise comment to the GitHub issue explaining the progress or the pivot. 
- **Checklists**: If the issue description has a checklist, update the issue body to check off items as you complete them.

### Step 3: Resolution & Linking (Completion Phase)
- **Commit Messages**: Always reference the issue number in your commit messages using closing keywords if appropriate (e.g., `Fixes #ISSUE_ID`, `Resolves #ISSUE_ID`, `Closes #ISSUE_ID`, or `Ref #ISSUE_ID` if it just relates to it).
- **Pull Requests**: If you create a Pull Request, explicitly link the issue in the PR description so it closes automatically upon merging.
- **Alternative Closure**: If finishing a task that doesn't require a PR, manually close the issue and leave a final comment summarizing the changes made (linking to the specific commit if possible).

---

## 4. Standard Labels

Apply these labels when creating issues:

- `enhancement`: New features or improvements.
- `bug`: Errors or broken functionality.
- `documentation`: Changes to README, guides, or code comments.
- `refactor`: Code cleanup without logic change.
- `urgent`: Blocks critical workflows.

---

## 📝 Standard Template for AI Issue Creation

When creating an issue, use the following structure:

```markdown
**Context:**
[Brief description of why this task is needed based on the user's prompt]

**Objective:**
[What exactly will be accomplished]

**Acceptance Criteria / Tasks:**
- [ ] Sub-task 1
- [ ] Sub-task 2

**Technical Notes:**
[Any starting file paths, architectural constraints, or specific library versions to use]
```

---
<<<<<<< HEAD
*Note to AI Agent: Upon reading this guide at the start of a session, you are expected to proactively manage GitHub issues without the user needing to manually remind you.*
=======
*Note to AI Agent: Upon reading this guide at the start of a session, you are expected to proactively manage GitHub issues without the user needing to manually remind you.*
>>>>>>> f2d61f37669321a2927ed58a5bea505abc60cf95
