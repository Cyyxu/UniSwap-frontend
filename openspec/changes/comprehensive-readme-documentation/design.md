## Context

The UniSwap project is a comprehensive campus second-hand trading platform with multiple modules including e-commerce, community, AI chat, and admin management. Currently, documentation is scattered across the `docs/` folder focusing mainly on API changes and backend integration. There is no central README that provides a holistic view of the project.

**Current State:**
- No root-level README.md
- Extensive documentation in `docs/` folder (40+ files)
- Documentation focused on API changes and migration guides
- New developers must navigate multiple files to understand the project

**Constraints:**
- Must maintain existing documentation structure in `docs/`
- Should not duplicate detailed API documentation
- Must be accessible to both Chinese and English-speaking developers
- Should follow standard README best practices

## Goals / Non-Goals

**Goals:**
- Create a comprehensive, well-structured README.md at project root
- Provide clear project overview and quick start guide
- Document all major features and modules
- Include setup instructions for development and production
- Link to existing detailed documentation appropriately
- Use visual elements (badges, diagrams, screenshots) to enhance readability
- Support both new developer onboarding and experienced developer reference

**Non-Goals:**
- Not replacing existing detailed documentation in `docs/`
- Not documenting every API endpoint (link to existing docs instead)
- Not creating a tutorial (focus on reference and setup)
- Not translating all existing documentation

## Decisions

### 1. README Structure and Organization

**Decision:** Use a hierarchical structure with clear sections and table of contents

**Rationale:**
- Standard practice in open-source projects
- Easy navigation with anchor links
- Allows readers to jump to relevant sections
- Supports both quick scanning and deep reading

**Structure:**
```markdown
# Project Title & Badges
## Table of Contents
## About the Project
## Features
## Tech Stack
## Getting Started
  - Prerequisites
  - Installation
  - Configuration
## Usage
## Project Structure
## API Documentation
## Deployment
## Contributing
## License
## Contact
```

**Alternatives Considered:**
- Single-page flat structure: Rejected due to content volume
- Multiple README files: Rejected to maintain simplicity

### 2. Visual Elements and Formatting

**Decision:** Include badges, ASCII diagrams, and emoji icons for visual appeal

**Rationale:**
- Badges provide quick status information (build, version, license)
- ASCII diagrams work in all environments (no image dependencies)
- Emojis improve scannability and modern feel
- Aligns with modern README best practices

**Elements to Include:**
- Status badges (build, version, license)
- Feature list with emoji icons
- Architecture diagram in ASCII
- Module structure visualization
- Code blocks with syntax highlighting

### 3. Language and Localization

**Decision:** Primary README in Chinese with English sections for technical terms

**Rationale:**
- Target audience is primarily Chinese-speaking students
- Technical terms (API names, commands) remain in English
- Existing codebase and comments are mixed Chinese/English
- Easier maintenance with single language

**Alternatives Considered:**
- Fully bilingual README: Rejected due to maintenance overhead
- English-only: Rejected as it doesn't match target audience
- Separate README.zh.md: Considered for future if international adoption grows

### 4. Documentation Linking Strategy

**Decision:** Use relative links to existing `docs/` folder, create quick reference tables

**Rationale:**
- Avoids duplication of detailed documentation
- Keeps README focused and concise
- Maintains single source of truth for API docs
- Easy to update when docs change

**Link Structure:**
```markdown
## API 文档
详细的 API 文档请查看：
- [用户模块 API](./docs/api/01-用户模块.md)
- [商品模块 API](./docs/api/02-商品模块.md)
...
```

### 5. Code Examples and Quick Start

**Decision:** Include minimal, working code examples in README

**Rationale:**
- Helps developers get started quickly
- Shows common use patterns
- Validates that setup instructions work
- Reduces time to first successful run

**Examples to Include:**
- Environment setup commands
- Development server start
- Basic API call examples
- Common development tasks

### 6. Project Structure Documentation

**Decision:** Use tree-style ASCII visualization with annotations

**Rationale:**
- Provides clear overview of codebase organization
- Helps new developers navigate the project
- Shows relationship between folders
- Standard practice in technical documentation

**Format:**
```
src/
├── api/              # API 接口层
├── components/       # 可复用组件
├── pages/            # 页面组件
├── store/            # 状态管理
└── utils/            # 工具函数
```

## Risks / Trade-offs

### Risk: README Becomes Outdated
**Mitigation:**
- Keep README focused on stable, high-level information
- Link to detailed docs instead of duplicating
- Add "Last Updated" date
- Include in PR review checklist for major changes

### Risk: Too Long and Overwhelming
**Mitigation:**
- Use collapsible sections for detailed content
- Provide table of contents for navigation
- Keep each section focused and concise
- Use visual hierarchy (headers, lists, code blocks)

### Risk: Duplication with Existing Docs
**Mitigation:**
- README provides overview and quick start only
- Link to detailed documentation in `docs/`
- Avoid copying API specifications
- Focus on "what" and "why", link to "how"

### Trade-off: Chinese vs English
**Trade-off:** Chinese README may limit international adoption
**Acceptance:** Target audience is Chinese students, can add English version later if needed

### Trade-off: Maintenance Overhead
**Trade-off:** Another document to keep updated
**Acceptance:** README is high-value, worth the maintenance cost; linking strategy minimizes duplication
