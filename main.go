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
	r.Static("/app", "./static/app")

	r.GET("/", func(c *gin.Context) {
		c.File("static/app/index.html")
	})

	r.GET("/ai-quiz", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	api := r.Group("/api")
	{
		api.POST("/generate", handlers.GenerateQuestions)
		api.POST("/submit", handlers.SubmitQuiz)
	}

	r.Run(":8080")
}
