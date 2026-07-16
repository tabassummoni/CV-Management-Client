import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();
const positionMapping = {
  1: "Frontend Developer Template",
  2: "Fullstack Developer Template",
  3: "React Native Mobile Dev Template"
};

const parseSkillsAndPosId = (taggedSkills) => {
  let detectedPosId = 1; 
  let rawSkills = taggedSkills || "";

  if (rawSkills.startsWith("[POS_ID:")) {
    const match = rawSkills.match(/^\[POS_ID:(\d+)\]\s*(.*)/);
    if (match) {
      detectedPosId = parseInt(match[1], 10);
      rawSkills = match[2]; 
    }
  }

  return { detectedPosId, rawSkills };
};

router.post('/', async (req, res) => {
  try {
    console.log("📥 Received Request Body from Frontend:", req.body);

    const { 
      title, userId, positionId, fullName, email, 
      phone, summary, skills, ieltsScore, experience, education 
    } = req.body;

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: "User ID is required and must be a valid number." });
    }
    const finalUserId = parseInt(userId);

    const userExists = await prisma.user.findUnique({ where: { id: finalUserId } });
    if (!userExists) { 
      return res.status(400).json({ error: `User with ID ${finalUserId} does not exist.` });
    }

    const selectedPosId = positionId ? parseInt(positionId) : 1;
    const taggedSkills = `[POS_ID:${selectedPosId}] ${skills || ''}`;

    const cleanData = {
      title: title || 'Untitled CV',
      fullName: fullName || '',
      email: email || '',
      phone: phone || '',
      summary: summary || '',
      skills: taggedSkills, 
      ieltsScore: ieltsScore || '',
      experience: experience || '',
      education: education || '',
      version: 1,
      isPublished: false,
      userId: finalUserId
    };

    const newCv = await prisma.cV.create({
      data: cleanData
    });

    console.log("🚀 CV Created Successfully with Position Tag:", newCv);
    return res.status(201).json(newCv);

  } catch (error) {
    console.error("🚨 Prisma DB Write Error Details:", error);
    return res.status(500).json({ error: "Internal Server Error: Could not create CV." });
  }
});

router.get('/positions/all', (req, res) => {
      try {
    const positionsArray = Object.entries(positionMapping).map(([id, title]) => ({
      id: parseInt(id),
      title: title
    }));
    return res.json(positionsArray);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load position templates' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cv = await prisma.cV.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cv) return res.status(404).json({ error: 'CV not found' });

    const { detectedPosId, rawSkills } = parseSkillsAndPosId(cv.skills);

    let dynamicProjects = [];
    if (detectedPosId === 1) {
      dynamicProjects = [{
        id: 101, name: "Interactive POS Dashboard", period: "2025-11 - 2026-02",
        description: "Engineered a high-performance **React and Vite** point of sale interface with unique viewport systems.",
        tags: "React, Vite, Tailwind CSS"
      }];
    } else if (detectedPosId === 2) {
      dynamicProjects = [{
        id: 102, name: "E-Commerce Back-End REST API", period: "2025-08 - 2026-01",
        description: "Developed production-ready relational data models and custom routing configurations using Prisma ORM.",
        tags: "Node.js, Express, Prisma, PostgreSQL"
      }];
    }

    return res.json({
      ...cv,
      skills: rawSkills,
      positionTitle: positionMapping[detectedPosId] || positionMapping[1],
      projects: dynamicProjects
    });

  } catch (error) {
    console.error("🚨 View CV Error:", error);
    return res.status(500).json({ error: 'Failed to fetch CV data' });
  }
});





router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const uId = parseInt(userId);

    const userCVs = await prisma.cV.findMany({
      where: { userId: uId },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCvs = userCVs.map(cv => {
      const { detectedPosId } = parseSkillsAndPosId(cv.skills);

      return {
        id: cv.id,
        title: cv.title,
        version: cv.version || 1,
        isPublished: cv.isPublished || false,
        positionTitle: positionMapping[detectedPosId] || positionMapping[1],
        createdAt: cv.createdAt,
        ieltsScore: cv.ieltsScore || ""
      };
    });

    return res.json(formattedCvs);
  } catch (error) {
    console.error("🚨 Fetch User CVs Error:", error);
    return res.status(500).json({ error: 'Failed to fetch user CVs' });
  }
});

export default router;