package main

import (
    "github.com/gin-gonic/gin"
    
    "github.com/[your-username]/KanjiForge/handlers"
)

func main() {
    // Create Gin router with default middleware (logger and recovery)
    r := gin.Default()
    
    // Serve static files and templates
    r.LoadHTMLGlob("templates/*")
    r.Static("/static", "./static")
    
    // Main page
    r.GET("/", func(c *gin.Context) {
        c.HTML(200, "index.html", nil)
    })
    
    // API routes
    api := r.Group("/api")
    {
        api.POST("/generate", handlers.GenerateQuestions)
        api.POST("/submit", handlers.SubmitQuiz)
    }
    
    // Start the server
    // Default port 8080 - change if needed
    r.Run(":8080")
}