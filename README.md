# AI Hotel Receptionist Website

A beautiful hotel receptionist chatbot website built with Next.js, Tailwind CSS, and Azure OpenAI.

## Setup

# Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the root with your Azure OpenAI credentials:
   ```env
   AZURE_OPENAI_ENDPOINT=your-endpoint-url
   AZURE_OPENAI_API_KEY=your-api-key
   AZURE_OPENAI_DEPLOYMENT=your-deployment-name
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## File Structure
- `/pages/index.js` — Main chatbot UI
- `/pages/api/chat.js` — API route for Azure OpenAI
- `/styles/globals.css` — Tailwind CSS styles

## Customization
- Update the chatbot avatar in `/public/chatbot-avatar.png` (optional)
- Edit the Q&A prompt in `/pages/api/chat.js` for your hotel

# Backend
1. Navigate to `backend/` and create a virtual environment:
   ```
   cd backend
   python -m venv venv
   ```
2. Activate the venv:
   ```
   venv\Scripts\activate
   ```
4. Install requirements:
   ```
   pip install -r requirements.txt
   ```
6. Run the backend:
   ```
   uvicorn main:app --reload --port 8000
   ```
# ai-hotel
