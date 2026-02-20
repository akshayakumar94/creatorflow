![WhatsApp Image 2026-02-19 at 12 52 09 PM](https://github.com/user-attachments/assets/04fd1047-3244-4bd6-8a72-634f138d1625)
 CreatorFlow
AI-Powered Social Media Promotion Engine

CreatorFlow is an AI-driven SaaS platform designed to automate social media content planning, generation, validation, and reel production for creators and businesses.

It transforms a simple idea into a structured, production-ready content campaign using a multi-stage AI pipeline powered by Gemini API and ChatGPT API.

🧠 Core Concept

CreatorFlow enables users to generate complete multi-day content strategies from minimal inputs:

Describe Type of Content

Target Audience

Target Platforms

Content Goal

The system then:

Generates a structured roadmap

Allows editing and approval

Produces ready-to-publish posts and reels

Validates AI output against strategy

Generates branded visuals

Prepares video-ready media assets

🏗 System Architecture

CreatorFlow follows a modular AI architecture:

🔹 Strategy Engine (Gemini API)

Generates a structured 3–4 day roadmap including:

2 Posts per day

1 Reel per day

Objective

Tone

CTA(Call To Action)

Scene breakdown

Prompt instructions

The output is stored as a structured documentation file.

🔹 Content Generation Engine (ChatGPT API)

Converts the approved strategy into structured JSON content:

Post titles

Captions

Hashtags

Image prompts

Reel scripts

Scene breakdown

CTA

Each day’s content is stored separately for modular processing.

🔹 Similarity & Validation Engine

Ensures quality and alignment by:

Comparing the approved strategy

With generated content

Produces:

Topic alignment score

Objective consistency score

Tone consistency score

Overall similarity score

🔹 Media Generation Layer

AI-generated branded images

30-second vertical reel generation

Media storage & preview system

🔄 End-to-End Workflow

User Input
→ Strategy Generation (Gemini)
→ Editable Document
→ Approval
→ Content Generation (ChatGPT)
→ Similarity Validation
→ Image Generation
→ Reel Production
→ Media Library

📁 Project Structure
/projects/{project_id}
    documentation.txt
    /generated_content
        day_1.json
        day_2.json
        day_3.json
    /analysis
        similarity_report.json
    /media
        /images
        /videos

🧩 Implementation Roadmap
🚀 Phase 1 – Strategy Engine

Integrated Gemini API

Built structured multi-day planning system

Implemented documentation storage

Developed Notepad-style editable review layer

Designed approval workflow

🚀 Phase 2 – Content Generation System

Integrated ChatGPT API

Converted strategy document into structured JSON

Generated captions, titles, hashtags, reel scripts

Implemented day-wise content storage

Created modular content extraction system

🚀 Phase 3 – Similarity & Validation Engine

Developed AI-based alignment comparison

Generated analytical scoring report

Built similarity dashboard logic

Ensured strategy-to-content consistency

🚀 Phase 4 – Media Production & UI Enhancement

Integrated image generation

Implemented reel-ready metadata structure

Built premium AI processing modal

Developed media preview system

Organized asset storage

✨ Key Features

✔ Multi-day AI strategy planning
✔ Editable strategy workflow
✔ Structured JSON content pipeline
✔ AI similarity validation
✔ AI-generated images
✔ Vertical reel generation
✔ Modular SaaS architecture
✔ Scalable AI pipeline

🔐 Security & Best Practices

API keys stored in environment variables

No direct frontend API exposure

Structured backend AI services

Controlled generation limits

Error handling and retry logic

🚀 Future Enhancements

Smart scheduling engine

Auto-posting integration

Engagement prediction

AI hook optimization

Multi-project dashboard

🏆 Vision

CreatorFlow bridges the gap between content planning and automated production using advanced AI systems.

It is designed to evolve from a hackathon prototype into a scalable SaaS content automation platform.


screenshorts attched below
![ss4](https://github.com/user-attachments/assets/a9494459-498b-480a-9e85-a13441d7954e)
![ss1](https://github.com/user-attachments/assets/8d19b732-12ed-4883-b5e9-9701f0ca452a)
![ss2](https://github.com/user-attachments/assets/c1cd828a-3452-4721-b4e6-0e6409a8fa76)
![ss3](https://github.com/user-attachments/assets/a98b522e-09f5-4985-94cf-79c7805055b2)
![ss5](https://github.com/user-attachments/assets/331056bc-8395-441d-817a-d7d8fbd6f68b)


