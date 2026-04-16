package models

type Question struct {
    ID          int      `json:"id"`
    Text        string   `json:"text"`
    Options     []string `json:"options"`
    Correct     string   `json:"correct"`
    Explanation string   `json:"explanation"`
}

type UserAnswer struct {
    QuestionID int    `json:"question_id"`
    Answer     string `json:"answer"`
}

type QuizResult struct {
    Score        int                `json:"score"`
    Total        int                `json:"total"`
    Questions    []Question         `json:"questions"`
    UserAnswers  map[int]string     `json:"user_answers"`
    Explanations []Question         `json:"explanations"`
}