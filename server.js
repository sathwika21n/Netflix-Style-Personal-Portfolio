const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

loadEnvFile();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const AI_PROVIDER = (process.env.AI_PROVIDER || 'openai').toLowerCase();
const MODEL = process.env.AI_MODEL || process.env.OPENAI_MODEL || 'gpt-5.4-nano';
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

const PORTFOLIO_CONTEXT = [
    'Name: Sathwika Thatiparthi.',
    'Education: Computer Science student at the University of Texas at Dallas.',
    'Focus: full-stack development, web development, software engineering, and system design.',
    'Professional summary: Sathwika has hands-on project experience, a strong computer science foundation, problem-solving ability, and a passion for clean, maintainable code.',
    'Experience: The portfolio describes multiple technical projects demonstrating technical proficiency and readiness to contribute to software development teams. It does not list specific employers or formal job titles.',
    'Skills: HTML5, CSS3, JavaScript, React, Node.js, Python, Python3, Streamlit, Vue.js, TypeScript, and Jupyter Notebook.',
    'Project: Advisor AI. AI-powered academic advisor application that helps students navigate course selections and degree paths. Technologies: Python3 and Streamlit. GitHub: https://github.com/sathwika21n/AcademicAdvisor-AI-chatBOT.git.',
    'Project: Alumni Tracking System - NAF. System for tracking and managing alumni information and engagement. Technologies: Vue.js, TypeScript, and Jupyter Notebook.',
    'Project: EndoTrack. Endometriosis-focused app where patients enter information and get personalized recommendations and local hospital suggestions. Technologies: Python, TypeScript, and React. Demo: https://www.youtube.com/watch?v=UTkWNrf-YEg. GitHub: https://github.com/sathwika21n/WeHack-2026.git.',
    'Resume: The developer page has a Download Resume button for Sathwika_Thatiparthi_Resume.pdf.',
    'Contact: The developer page links to GitHub at https://github.com/sathwika21n and LinkedIn at https://www.linkedin.com/in/sathwika-thatiparthi-221019230.',
    'Website: Netflix-style personal portfolio with Developer, Hiring Manager, Personal Life, and Artist views. Built with HTML, CSS, JavaScript, Font Awesome icons, animations, and responsive design.',
    'Personal and creative pages: The site includes personal-life galleries for family, adventures, celebrations, daily life, special occasions, and nature, plus an artist profile for creative work.'
].join('\n');

function loadEnvFile() {
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) return;

    const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    envLines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) return;

        const separatorIndex = trimmedLine.indexOf('=');
        if (separatorIndex === -1) return;

        const key = trimmedLine.slice(0, separatorIndex).trim();
        const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
        if (key && !process.env[key]) {
            process.env[key] = value;
        }
    });
}

function readRequestBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', chunk => {
            body += chunk;
            if (body.length > 25000) {
                request.destroy();
                reject(new Error('Request body is too large.'));
            }
        });

        request.on('end', () => resolve(body));
        request.on('error', reject);
    });
}

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(payload));
}

function getApiKey() {
    if (AI_PROVIDER === 'openrouter') {
        return process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    }

    return process.env.OPENAI_API_KEY;
}

function getSystemInstructions() {
    return [
        'You are Sathwika Thatiparthi portfolio assistant.',
        'Answer only from the provided portfolio context.',
        'Be concise, friendly, and specific.',
        'If the answer is not in the context, say that the website does not include that detail yet.',
        'Do not invent dates, employers, contact details, certifications, or experience.'
    ].join(' ');
}

function extractOpenAIResponseText(payload) {
    if (typeof payload.output_text === 'string') {
        return payload.output_text.trim();
    }

    return (payload.output || [])
        .flatMap(outputItem => outputItem.content || [])
        .filter(contentItem => contentItem.type === 'output_text' && contentItem.text)
        .map(contentItem => contentItem.text)
        .join('\n')
        .trim();
}

function extractChatCompletionText(payload) {
    return payload.choices?.[0]?.message?.content?.trim() || '';
}

async function callOpenAI(question, apiKey) {
    const payload = {
        model: MODEL,
        input: [
            {
                role: 'developer',
                content: [
                    {
                        type: 'input_text',
                        text: getSystemInstructions()
                    }
                ]
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'input_text',
                        text: `Portfolio context:\n${PORTFOLIO_CONTEXT}\n\nQuestion: ${question}`
                    }
                ]
            }
        ],
        max_output_tokens: 140,
        store: false
    };

    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(18000)
    });

    const responsePayload = await aiResponse.json();
    return { aiResponse, responsePayload, answer: extractOpenAIResponseText(responsePayload) };
}

async function callOpenRouter(question, apiKey) {
    const payload = {
        model: MODEL,
        messages: [
            {
                role: 'system',
                content: getSystemInstructions()
            },
            {
                role: 'user',
                content: `Portfolio context:\n${PORTFOLIO_CONTEXT}\n\nQuestion: ${question}`
            }
        ],
        max_tokens: 140
    };

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.SITE_URL || `http://${HOST}:${PORT}`,
            'X-Title': process.env.SITE_TITLE || 'Sathwika Portfolio'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(18000)
    });

    const responsePayload = await aiResponse.json();
    return { aiResponse, responsePayload, answer: extractChatCompletionText(responsePayload) };
}

async function callAiProvider(question) {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error(`Missing ${AI_PROVIDER === 'openrouter' ? 'OPENROUTER_API_KEY' : 'OPENAI_API_KEY'}. Add it to .env, then restart the server.`);
    }

    if (AI_PROVIDER === 'openrouter') {
        return callOpenRouter(question, apiKey);
    }

    return callOpenAI(question, apiKey);
}

async function handleChat(request, response) {
    let body;
    try {
        body = JSON.parse(await readRequestBody(request));
    } catch (error) {
        sendJson(response, 400, { error: 'Invalid JSON request.' });
        return;
    }

    const question = String(body.question || '').trim();
    if (!question) {
        sendJson(response, 400, { error: 'Please send a question.' });
        return;
    }

    try {
        const { aiResponse, responsePayload, answer } = await callAiProvider(question);

        if (!aiResponse.ok) {
            const message = responsePayload.error?.message || `${AI_PROVIDER} request failed.`;
            sendJson(response, aiResponse.status, { error: message });
            return;
        }

        sendJson(response, 200, {
            answer: answer || 'I could not find a clear answer in the portfolio context.'
        });
    } catch (error) {
        sendJson(response, 500, {
            error: error.message || `Could not reach ${AI_PROVIDER}. Check your connection and API key.`
        });
    }
}

function serveStaticFile(request, response) {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const requestedPath = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

    if (!filePath.startsWith(PUBLIC_DIR)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        response.writeHead(200, {
            'Content-Type': MIME_TYPES[extension] || 'application/octet-stream'
        });
        response.end(data);
    });
}

const server = http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/api/chat') {
        handleChat(request, response);
        return;
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
        serveStaticFile(request, response);
        return;
    }

    response.writeHead(405);
    response.end('Method not allowed');
});

server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing server or start this one with PORT=3002 npm start.`);
        process.exit(1);
    }

    throw error;
});

server.listen(PORT, HOST, () => {
    console.log(`Portfolio server running at http://${HOST}:${PORT}`);
    console.log(`AI provider: ${AI_PROVIDER}`);
    console.log(`AI model: ${MODEL}`);
});
