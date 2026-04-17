package main

import (
    "github.com/gin-gonic/gin"
    
    "github.com/lailaKho753/KanjiForge/handlers"
)

func main() {
    r := gin.Default()
    
    // 🔥 AMAN: Matikan trusted proxies karena tidak pakai proxy
    r.SetTrustedProxies(nil)
    
    r.LoadHTMLGlob("templates/*")
    r.Static("/static", "./static")
    
    r.GET("/", func(c *gin.Context) {
        c.HTML(200, "index.html", nil)
    })
    
    api := r.Group("/api")
    {
        api.POST("/generate", handlers.GenerateQuestions)
        api.POST("/submit", handlers.SubmitQuiz)
    }
    
    r.Run(":8080")
}