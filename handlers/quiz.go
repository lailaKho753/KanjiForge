package handlers

import (
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
    "regexp"
    "github.com/gin-gonic/gin"
    "github.com/go-resty/resty/v2"
    
    "github.com/lailaKho753/KanjiForge/models"
)

func buildPrompt(kanjiData string) string {
    return `You are a JLPT question generator. Use ONLY words from this data:

` + kanjiData + `

RULES:
1. READING questions: options MUST be HIRAGANA only
2. WRITING questions: options MUST be KANJI only
3. ALL options MUST come from the data above
4. NO katakana, NO romaji, NO made-up words

EXAMPLE for data: 駐車 (ちゅうしゃ) - parking

[
  {"text": "駐車 の読み方は？", "options": ["A. ちゅうしゃ", "B. ちゅうしゃじょう", "C. むり", "D. むだん"], "correct": "A", "explanation": "駐車 is read as ちゅうしゃ"},
  {"text": "ちゅうしゃ の漢字は？", "options": ["A. 駐車", "B. 駐車場", "C. 無理", "D. 無断"], "correct": "A", "explanation": "ちゅうしゃ is written as 駐車"}
]

Generate 2 questions (one of each type) for each kanji.
Output ONLY JSON array.`
}

func isPureHiragana(s string) bool {
    return regexp.MustCompile(`^[\p{Hiragana}]+$`).MatchString(s)
}

func cleanTrailingCommas(jsonStr string) string {
    re1 := regexp.MustCompile(`,(\s*})`)
    jsonStr = re1.ReplaceAllString(jsonStr, "$1")
    re2 := regexp.MustCompile(`,(\s*\])`)
    jsonStr = re2.ReplaceAllString(jsonStr, "$1")
    return jsonStr
}

func extractJSON(text string) string {
    re := regexp.MustCompile(`\[\s*\{.*?\}\s*\]`)
    match := re.FindString(text)
    if match != "" {
        return match
    }
    
    re2 := regexp.MustCompile(`(?s)\[.*\]`)
    match2 := re2.FindString(text)
    if match2 != "" {
        if strings.HasPrefix(match2, "[") && strings.HasSuffix(match2, "]") {
            return match2
        }
    }
    
    start := strings.Index(text, "[")
    end := strings.LastIndex(text, "]")
    if start != -1 && end != -1 && end > start {
        return text[start : end+1]
    }
    
    return "[]"
}

func GenerateQuestions(c *gin.Context) {
    kanjiInput := c.PostForm("kanji_data")
    if kanjiInput == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Kanji data cannot be empty"})
        return
    }
    
    client := resty.New()
    response, err := client.R().
        SetHeader("Content-Type", "application/json").
        SetBody(map[string]interface{}{
            "model":   "gemma3:4b-it-qat",
            "prompt":  buildPrompt(kanjiInput),
            "stream":  false,
            "options": map[string]interface{}{
                "num_ctx":     1024,
                "temperature": 0.0,
            },
        }).
        Post("http://localhost:11434/api/generate")
    
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call AI: " + err.Error()})
        return
    }
    
    var ollamaResp struct {
        Response string `json:"response"`
    }
    json.Unmarshal(response.Body(), &ollamaResp)
    
    fmt.Println("\n=== RAW AI RESPONSE ===")
    fmt.Println(ollamaResp.Response)
    fmt.Println("=====================\n")
    
    questionsJSON := extractJSON(ollamaResp.Response)
    questionsJSON = cleanTrailingCommas(questionsJSON)
    
    fmt.Println("=== EXTRACTED JSON ===")
    fmt.Println(questionsJSON)
    fmt.Println("=====================\n")
    
    var questions []models.Question
    if err := json.Unmarshal([]byte(questionsJSON), &questions); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error":      "Failed to parse questions from AI response",
            "debug_json": questionsJSON,
        })
        return
    }
    
    for i := range questions {
        questions[i].ID = i
        if questions[i].Explanation == "" {
            correctAnswerText := ""
            for _, opt := range questions[i].Options {
                if strings.HasPrefix(opt, questions[i].Correct+". ") {
                    correctAnswerText = strings.TrimPrefix(opt, questions[i].Correct+". ")
                    break
                }
            }
            if correctAnswerText != "" {
                questions[i].Explanation = fmt.Sprintf("Correct answer: %s", correctAnswerText)
            } else {
                questions[i].Explanation = "The correct answer is " + questions[i].Correct
            }
        }
    }
    
    c.JSON(http.StatusOK, gin.H{
        "questions": questions,
        "total":     len(questions),
    })
}

func SubmitQuiz(c *gin.Context) {
    var submission struct {
        Answers   map[int]string      `json:"answers"`
        Questions []models.Question   `json:"questions"`
    }
    
    if err := c.BindJSON(&submission); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid submission data"})
        return
    }
    
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