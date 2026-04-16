package handlers

import (
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
    
    "github.com/gin-gonic/gin"
    "github.com/go-resty/resty/v2"
    
    "github.com/[your-username]/KanjiForge/models"
)

// Build the prompt for AI to generate questions
func buildPrompt(kanjiData string) string {
    return fmt.Sprintf(`
Create 2 multiple choice questions for EACH kanji below. Output format: JSON array.

Kanji data:
%s

Rules:
1. JLPT-style questions (kanji reading, usage in sentences, meaning differences)
2. Each question has 4 options (A, B, C, D)
3. Include explanation why the correct answer is right
4. Output ONLY the JSON array, no extra text

Example format:
[
  {
    "text": "Question: How to read kanji '駐' in the word '駐車'?",
    "options": ["A. ちゅう", "B. とまる", "C. つう", "D. しゃ"],
    "correct": "A",
    "explanation": "In '駐車' (parking), kanji '駐' is read as 'ちゅう'."
  }
]
`, kanjiData)
}

// GenerateQuestions handles POST /api/generate
func GenerateQuestions(c *gin.Context) {
    // Get input from user
    kanjiInput := c.PostForm("kanji_data")
    if kanjiInput == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Kanji data cannot be empty"})
        return
    }
    
    // Call Ollama API
    client := resty.New()
    response, err := client.R().
        SetHeader("Content-Type", "application/json").
        SetBody(map[string]interface{}{
            "model":  "llama3.2:3b", // Change this to your model
            "prompt": buildPrompt(kanjiInput),
            "stream": false,
        }).
        Post("http://localhost:11434/api/generate")
    
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call AI: " + err.Error()})
        return
    }
    
    // Parse response from Ollama
    var ollamaResp struct {
        Response string `json:"response"`
    }
    json.Unmarshal(response.Body(), &ollamaResp)
    
    // Extract JSON from response (AI sometimes adds extra text)
    questionsJSON := extractJSON(ollamaResp.Response)
    
    var questions []models.Question
    if err := json.Unmarshal([]byte(questionsJSON), &questions); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse questions from AI response"})
        return
    }
    
    // Assign ID to each question
    for i := range questions {
        questions[i].ID = i
    }
    
    c.JSON(http.StatusOK, gin.H{
        "questions": questions,
        "total":     len(questions),
    })
}

// Helper: Extract JSON array from AI response (sometimes has surrounding text)
func extractJSON(text string) string {
    start := strings.Index(text, "[")
    end := strings.LastIndex(text, "]")
    if start != -1 && end != -1 {
        return text[start : end+1]
    }
    return "[]"
}

// SubmitQuiz handles POST /api/submit
func SubmitQuiz(c *gin.Context) {
    var submission struct {
        Answers   map[int]string      `json:"answers"`
        Questions []models.Question   `json:"questions"`
    }
    
    if err := c.BindJSON(&submission); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid submission data"})
        return
    }
    
    // Calculate score
    score := 0
    for i, q := range submission.Questions {
        if userAnswer, exists := submission.Answers[i]; exists {
            if userAnswer == q.Correct {
                score++
            }
        }
    }
    
    c.JSON(http.StatusOK, gin.H{
        "score":       score,
        "total":       len(submission.Questions),
        "questions":   submission.Questions,
        "userAnswers": submission.Answers,
        "percentage":  float64(score) / float64(len(submission.Questions)) * 100,
    })
}